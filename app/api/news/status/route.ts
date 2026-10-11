import { NextResponse } from 'next/server';
import { verifyBotAuth, getBotApiSecret } from '@/lib/security';
import {
  checkRateLimit,
  getClientIp,
  getRateLimitHeaders,
  rateLimitResponse,
  checkAuthBruteForce,
  recordAuthFailure,
  resetAuthFailures,
} from '@/lib/rateLimit';
import { getNewsDatabase } from '@/lib/newsStore';

/**
 * GET /api/news/status
 * Discord Bot test / heartbeat / connection verification endpoint
 * Rate limit: 30 req / min + anti-brute-force lock
 */
export async function GET(req: Request) {
  try {
    const ip = getClientIp(req);

    // Anti-brute force check
    const bruteCheck = checkAuthBruteForce(ip);
    if (!bruteCheck.success) {
      return rateLimitResponse(
        bruteCheck,
        `Too many failed authentication attempts. Access locked for ${Math.ceil(
          bruteCheck.retryAfterSeconds / 60
        )} minute(s).`
      );
    }

    // Rate limit: 30 requests / minute
    const statusLimitMax = 30;
    const rateLimit = checkRateLimit('status-get', ip, {
      limit: statusLimitMax,
      windowMs: 60 * 1000,
    });

    if (!rateLimit.success) {
      return rateLimitResponse(rateLimit);
    }

    const auth = verifyBotAuth(req);
    const configuredSecret = getBotApiSecret();
    const isDefaultSecret = configuredSecret === 'fazix_dev_discord_bot_secret_2026';

    if (!auth.authorized) {
      const failRecord = recordAuthFailure(ip);
      return NextResponse.json(
        {
          success: false,
          status: 'unauthorized',
          error: 'Authentication failed. Check your Bearer token or X-Fazix-Secret header.',
          remainingAttemptsBeforeLockout: Math.max(0, failRecord.remaining),
          hint: isDefaultSecret
            ? 'Server is running with dev default secret. Set FAZIX_DISCORD_BOT_SECRET in production.'
            : undefined,
        },
        { status: 401, headers: getRateLimitHeaders(failRecord, 5) }
      );
    }

    resetAuthFailures(ip);
    const db = await getNewsDatabase();

    return NextResponse.json(
      {
        success: true,
        status: 'authenticated',
        serverTime: new Date().toISOString(),
        articlesCount: db.articles.length,
        hasActiveTicker: Boolean(db.ticker?.isActive),
        activeTicker: db.ticker?.isActive
          ? {
              badge: db.ticker.badge,
              text: db.ticker.text,
              updatedAt: db.ticker.updatedAt,
            }
          : null,
        environment: process.env.NODE_ENV || 'development',
        isUsingDevSecretFallback: auth.isDevFallback,
      },
      { headers: getRateLimitHeaders(rateLimit, statusLimitMax) }
    );
  } catch (error) {
    console.error('[API /api/news/status error]:', error);
    return NextResponse.json(
      { success: false, error: 'Health check failed' },
      { status: 500 }
    );
  }
}
