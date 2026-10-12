import nodemailer from 'nodemailer';

export const TARGET_CONTACT_EMAIL = process.env.CONTACT_EMAIL_TARGET || 'fazixesports@gmail.com';

interface ContactEmailParams {
  name: string;
  email: string;
  category: string;
  organization?: string;
  subject?: string;
  message: string;
  ip?: string;
}

interface ApplicationEmailParams {
  role: string;
  ign: string;
  fullName?: string;
  age?: string;
  country?: string;
  discord: string;
  currentMmr?: string;
  peakMmr?: string;
  trackerUrl?: string;
  competitiveExp?: string;
  notes?: string;
  ip?: string;
}

/**
 * Creates a configured Nodemailer transporter using SMTP credentials (e.g. Brevo, Mailgun, or Gmail).
 * Returns null if no credentials are configured in environment variables.
 */
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const rawPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || '';
  const pass = rawPass.replace(/\s+/g, '');

  if (!user || !pass) {
    return null;
  }

  if (host) {
    const port = Number(process.env.SMTP_PORT) || 587;
    const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465;
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

/**
 * Sends a notification embed to a Discord staff channel if webhook URL is configured.
 */
async function sendDiscordNotification(title: string, fields: { name: string; value: string; inline?: boolean }[]) {
  const webhookUrl = process.env.DISCORD_CONTACT_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [
          {
            title,
            color: 0xff5900,
            fields,
            footer: { text: `Forwarded to ${TARGET_CONTACT_EMAIL}` },
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });
  } catch (err) {
    console.error('[FAZIX DISCORD NOTIFICATION ERROR]', err);
  }
}

/**
 * Forwards contact form submissions to fazixesports@gmail.com
 * Supports Web3Forms (easiest, zero SMTP), Resend, Brevo/SMTP, and Discord Webhooks.
 */
export async function forwardContactEmail(params: ContactEmailParams): Promise<{
  delivered: boolean;
  method: 'web3forms' | 'resend' | 'smtp' | 'logged';
  target: string;
  messageId?: string;
}> {
  const { name, email, category, organization, subject, message, ip } = params;
  const targetEmail = TARGET_CONTACT_EMAIL;
  const emailSubject = `[FAZIX Contact] ${category}: ${subject || 'New Inquiry'} (${name})`;

  // Also trigger Discord notification in background if configured
  sendDiscordNotification(`📨 Contact Inquiry: ${category}`, [
    { name: 'Name', value: name, inline: true },
    { name: 'Email', value: email, inline: true },
    { name: 'Organization', value: organization || 'N/A', inline: true },
    { name: 'Subject', value: subject || 'No subject' },
    { name: 'Message', value: message.length > 1000 ? `${message.slice(0, 1000)}...` : message },
  ]).catch(() => {});

  // 1. Option A: Web3Forms (Takes 10 seconds to get access key at web3forms.com, zero SMTP/DNS hassle)
  if (process.env.WEB3FORMS_ACCESS_KEY) {
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: process.env.WEB3FORMS_ACCESS_KEY,
          subject: emailSubject,
          from_name: name,
          email,
          replyto: email,
          category,
          organization: organization || 'N/A',
          message,
        }),
      });

      const data = await res.json();
      if (data.success) {
        console.log(`[FAZIX MAILER (Web3Forms)] Successfully forwarded contact inquiry to ${targetEmail}`);
        return { delivered: true, method: 'web3forms', target: targetEmail };
      }
      console.error('[FAZIX MAILER (Web3Forms) ERROR]', data);
    } catch (err) {
      console.error('[FAZIX MAILER (Web3Forms) FETCH ERROR]', err);
    }
  }

  // 2. Option B: Resend (resend.com API Key)
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'FAZIX Contact <onboarding@resend.dev>',
          to: [targetEmail],
          reply_to: email,
          subject: emailSubject,
          text: `From: ${name} (${email})\nOrganization: ${organization || 'N/A'}\nTopic: ${category}\n\nMessage:\n${message}`,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log(`[FAZIX MAILER (Resend)] Successfully forwarded contact inquiry to ${targetEmail}`);
        return { delivered: true, method: 'resend', target: targetEmail, messageId: data.id };
      }
      console.error('[FAZIX MAILER (Resend) ERROR]', data);
    } catch (err) {
      console.error('[FAZIX MAILER (Resend) FETCH ERROR]', err);
    }
  }

  // 3. Option C: SMTP (Brevo, Gmail, or custom SMTP host)
  const transporter = getTransporter();
  if (transporter) {
    try {
      const fromAddress = process.env.SMTP_FROM || `"FAZIX Contact Form" <${process.env.SMTP_USER || process.env.GMAIL_USER}>`;
      const info = await transporter.sendMail({
        from: fromAddress,
        to: targetEmail,
        replyTo: email,
        subject: emailSubject,
        text: `From: ${name} (${email})\nOrganization: ${organization || 'N/A'}\nTopic: ${category}\nSubject: ${subject || 'N/A'}\n\nMessage:\n${message}`,
      });

      console.log(`[FAZIX MAILER (SMTP)] Successfully forwarded contact email to ${targetEmail}. MessageId: ${info.messageId}`);
      return { delivered: true, method: 'smtp', target: targetEmail, messageId: info.messageId };
    } catch (err) {
      console.error(`[FAZIX MAILER (SMTP) ERROR] Failed to send via SMTP to ${targetEmail}:`, err);
    }
  }

  // 4. Fallback: Log full formatted email forwarding
  console.log(`[FAZIX MAILER (LOGGED)] Email prepared for ${targetEmail}:`);
  console.log({ name, email, category, subject, message });

  return { delivered: false, method: 'logged', target: targetEmail };
}

/**
 * Forwards player & creator roster applications to fazixesports@gmail.com
 */
export async function forwardApplicationEmail(params: ApplicationEmailParams): Promise<{
  delivered: boolean;
  method: 'web3forms' | 'resend' | 'smtp' | 'logged';
  target: string;
  messageId?: string;
}> {
  const targetEmail = TARGET_CONTACT_EMAIL;
  const emailSubject = `[FAZIX Application] ${params.role.toUpperCase()}: ${params.ign} (${params.discord})`;

  sendDiscordNotification(`🎮 Roster Application: ${params.role.toUpperCase()}`, [
    { name: 'IGN', value: params.ign, inline: true },
    { name: 'Discord', value: params.discord, inline: true },
    { name: 'Age / Country', value: `${params.age || 'N/A'} / ${params.country || 'N/A'}`, inline: true },
    { name: 'Tracker URL', value: params.trackerUrl || 'N/A' },
    { name: 'Experience', value: params.competitiveExp ? params.competitiveExp.slice(0, 1000) : 'N/A' },
  ]).catch(() => {});

  if (process.env.WEB3FORMS_ACCESS_KEY) {
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: process.env.WEB3FORMS_ACCESS_KEY,
          subject: emailSubject,
          role: params.role,
          ign: params.ign,
          discord: params.discord,
          age: params.age || 'N/A',
          country: params.country || 'N/A',
          tracker: params.trackerUrl || 'N/A',
          experience: params.competitiveExp || 'N/A',
          notes: params.notes || 'N/A',
        }),
      });

      const data = await res.json();
      if (data.success) {
        return { delivered: true, method: 'web3forms', target: targetEmail };
      }
    } catch (err) {
      console.error('[FAZIX MAILER (Web3Forms Application) ERROR]', err);
    }
  }

  const transporter = getTransporter();
  if (transporter) {
    try {
      const fromAddress = process.env.SMTP_FROM || `"FAZIX Recruitment" <${process.env.SMTP_USER || process.env.GMAIL_USER}>`;
      const info = await transporter.sendMail({
        from: fromAddress,
        to: targetEmail,
        subject: emailSubject,
        text: `Role: ${params.role}\nIGN: ${params.ign}\nDiscord: ${params.discord}\nExperience: ${params.competitiveExp || 'N/A'}\nNotes: ${params.notes || 'N/A'}`,
      });

      return { delivered: true, method: 'smtp', target: targetEmail, messageId: info.messageId };
    } catch (err) {
      console.error(`[FAZIX MAILER (SMTP Application) ERROR]`, err);
    }
  }

  return { delivered: false, method: 'logged', target: targetEmail };
}
