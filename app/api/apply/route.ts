import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { forwardApplicationEmail } from '@/lib/mailer';

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit('apply', ip, {
      limit: 4,
      windowMs: 10 * 60 * 1000, // 4 applications per 10 minutes
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: `Too many roster submissions. Please wait ${Math.ceil(
            rateLimit.retryAfterSeconds / 60
          )} minute(s) before submitting another application.`,
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
    const { role, ign, fullName, age, country, discord, currentMmr, peakMmr, trackerUrl, replayUrl, competitiveExp, notes, consent } = body;

    if (!ign || typeof ign !== 'string' || ign.trim().length === 0) {
      return NextResponse.json({ error: 'In-game name (IGN) is required' }, { status: 400 });
    }

    if (!discord || typeof discord !== 'string' || discord.trim().length === 0) {
      return NextResponse.json({ error: 'Discord username is required for contact' }, { status: 400 });
    }

    if (!consent) {
      return NextResponse.json({ error: 'Einwilligung in die Datenschutzerklärung ist erforderlich' }, { status: 400 });
    }

    // Forward the application to fazixesports@gmail.com
    await forwardApplicationEmail({
      role: role || 'main',
      ign: ign.trim(),
      fullName: fullName?.trim(),
      age: age?.trim(),
      country: country?.trim(),
      discord: discord.trim(),
      currentMmr: currentMmr?.trim(),
      peakMmr: peakMmr?.trim(),
      trackerUrl: trackerUrl?.trim(),
      competitiveExp: competitiveExp?.trim(),
      notes: notes?.trim(),
      ip,
    });

    return NextResponse.json({
      success: true,
      message: 'Application received successfully. Scouting staff will review your profile.',
    });
  } catch (error) {
    console.error('Apply API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
