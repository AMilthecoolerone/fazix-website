/** Best-effort Discord webhook ping for the staff channel. Never throws. */
export async function notifyStaff(content: string): Promise<void> {
  const url = process.env.DISCORD_STAFF_WEBHOOK_URL || process.env.DISCORD_CONTACT_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: content.slice(0, 1900), allowed_mentions: { parse: [] } }),
    });
  } catch {
    // ignore
  }
}
