import crypto from 'crypto';

/**
 * Default secret for local development and staging testing.
 * In production, set FAZIX_DISCORD_BOT_SECRET or DISCORD_BOT_SECRET in .env.local
 */
const DEFAULT_DEV_SECRET = 'fazix_dev_discord_bot_secret_2026';

export function getBotApiSecret(): string {
  return (
    process.env.FAZIX_DISCORD_BOT_SECRET ||
    process.env.DISCORD_BOT_SECRET ||
    process.env.NEWS_API_SECRET ||
    DEFAULT_DEV_SECRET
  );
}

export interface BotAuthResult {
  authorized: boolean;
  reason?: string;
  isDevFallback?: boolean;
}

/**
 * Timing-safe authentication check for Discord bot API requests.
 * Supports:
 *  1. Authorization: Bearer <secret>
 *  2. x-fazix-secret: <secret>
 *  3. x-bot-token: <secret>
 *  4. x-signature-sha256: HMAC-SHA256 signature (optional raw-payload verification)
 */
export function verifyBotAuth(req: Request, rawBody?: string): BotAuthResult {
  const configuredSecret = getBotApiSecret();
  const isDevFallback = configuredSecret === DEFAULT_DEV_SECRET && process.env.NODE_ENV !== 'production';

  // 1. Extract token from Headers
  const authHeader = req.headers.get('authorization') || '';
  const bearerToken = authHeader.toLowerCase().startsWith('bearer ')
    ? authHeader.slice(7).trim()
    : null;

  const headerSecret =
    bearerToken ||
    req.headers.get('x-fazix-secret')?.trim() ||
    req.headers.get('x-fazix-key')?.trim() ||
    req.headers.get('x-bot-token')?.trim() ||
    null;

  // 2. Check token authentication with timing-safe comparison
  if (headerSecret) {
    if (safeCompare(headerSecret, configuredSecret)) {
      return { authorized: true, isDevFallback };
    }
  }

  // 3. Check HMAC-SHA256 signature if provided
  const signatureHeader = req.headers.get('x-signature-sha256')?.trim();
  if (signatureHeader && rawBody !== undefined) {
    const expectedSig = crypto
      .createHmac('sha256', configuredSecret)
      .update(rawBody)
      .digest('hex');

    if (safeCompare(signatureHeader, expectedSig)) {
      return { authorized: true, isDevFallback };
    }
  }

  return {
    authorized: false,
    reason: headerSecret
      ? 'Invalid secret token provided'
      : 'Missing Authorization header or X-Fazix-Secret header',
    isDevFallback,
  };
}

/**
 * Constant-time comparison between two strings to prevent timing attacks.
 */
function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, 'utf8');
    const bufB = Buffer.from(b, 'utf8');

    // To prevent length disclosure timing, hash both before comparison
    const hashA = crypto.createHash('sha256').update(bufA).digest();
    const hashB = crypto.createHash('sha256').update(bufB).digest();

    return crypto.timingSafeEqual(hashA, hashB);
  } catch {
    return false;
  }
}
