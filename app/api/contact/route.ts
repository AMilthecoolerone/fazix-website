import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { forwardContactEmail, TARGET_CONTACT_EMAIL } from '@/lib/mailer';

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit('contact', ip, {
      limit: 4,
      windowMs: 10 * 60 * 1000, // 4 requests per 10 minutes
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: `Too many submissions. Please wait ${Math.ceil(
            rateLimit.retryAfterSeconds / 60
          )} minute(s) before sending another message.`,
          retryAfterSeconds: rateLimit.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSeconds),
          },
        }
      );
    }

    const body = await req.json();
    const { name, email, category, organization, subject, message, consent } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email address is required' }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json(
        { error: 'Please provide a message with at least 10 characters' },
        { status: 400 }
      );
    }

    if (!consent) {
      return NextResponse.json(
        { error: 'Einwilligung in die Datenschutzerklärung ist erforderlich' },
        { status: 400 }
      );
    }

    // Forward the inquiry to fazixesports@gmail.com
    const mailResult = await forwardContactEmail({
      name: name.trim(),
      email: email.trim(),
      category: category || 'General / Management',
      organization: organization?.trim(),
      subject: subject?.trim(),
      message: message.trim(),
      ip,
    });

    return NextResponse.json({
      success: true,
      message: 'Your message has been forwarded to Fazix management (fazixesports@gmail.com).',
      target: TARGET_CONTACT_EMAIL,
      delivered: mailResult.delivered,
      method: mailResult.method,
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
