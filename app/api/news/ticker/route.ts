import { NextResponse } from 'next/server';
import { verifyBotAuth } from '@/lib/security';
import {
  checkRateLimit,
  getClientIp,
  getRateLimitHeaders,
  rateLimitResponse,
  checkAuthBruteForce,
  recordAuthFailure,
  resetAuthFailures,
} from '@/lib/rateLimit';
import { getNewsDatabase, updateTicker, clearTicker } from '@/lib/newsStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/news/ticker
 * Lightweight endpoint for the website client to poll the active top badge banner
 * Rate limit: 120 req / min per IP
 */
export async function GET(req: Request) {
  try {
    const ip = getClientIp(req);
    const getLimitMax = 120;
    const rateLimit = checkRateLimit('ticker-get', ip, {
      limit: getLimitMax,
      windowMs: 60 * 1000,
    });

    if (!rateLimit.success) {
      return rateLimitResponse(rateLimit);
    }

    const db = await getNewsDatabase();
    return NextResponse.json(
      {
        success: true,
        ticker: db.ticker?.isActive ? db.ticker : null,
        lastUpdated: db.lastUpdated,
      },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          ...getRateLimitHeaders(rateLimit, getLimitMax),
        },
      }
    );
  } catch (error) {
    console.error('[API /api/news/ticker GET error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve ticker' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/news/ticker
 * Quick secure setter for Discord bot to trigger or update top announcement ticker
 * Rate limit: 60 req / min + anti-brute-force lock
 */
export async function POST(req: Request) {
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

    // Rate limit
    const postLimitMax = 60;
    const rateLimit = checkRateLimit('ticker-post', ip, {
      limit: postLimitMax,
      windowMs: 60 * 1000,
    });

    if (!rateLimit.success) {
      return rateLimitResponse(rateLimit);
    }

    const rawBody = await req.text();
    const auth = verifyBotAuth(req, rawBody);

    if (!auth.authorized) {
      const failRecord = recordAuthFailure(ip);
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized bot token',
          reason: auth.reason,
          remainingAttemptsBeforeLockout: Math.max(0, failRecord.remaining),
        },
        { status: 401, headers: getRateLimitHeaders(failRecord, 5) }
      );
    }

    resetAuthFailures(ip);
    const responseHeaders = getRateLimitHeaders(rateLimit, postLimitMax);

    let body: any;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON payload' },
        { status: 400, headers: responseHeaders }
      );
    }

    const { text, badge, link, articleId, priority, isActive } = body;

    if (isActive === false) {
      await clearTicker();
      return NextResponse.json(
        {
          success: true,
          message: 'Ticker banner cleared',
        },
        { headers: responseHeaders }
      );
    }

    if (!text || typeof text !== 'string' || text.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'Ticker text is required (minimum 3 characters)' },
        { status: 400, headers: responseHeaders }
      );
    }

    const ticker = await updateTicker({
      text,
      badge: badge || '',
      link,
      articleId,
      priority: priority || 'normal',
      isActive: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Ticker banner updated successfully',
        ticker,
      },
      { headers: responseHeaders }
    );
  } catch (error) {
    console.error('[API /api/news/ticker POST error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update ticker' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/news/ticker
 * Quickly clears the ticker
 * Rate limit: 30 req / min
 */
export async function DELETE(req: Request) {
  const ip = getClientIp(req);

  const bruteCheck = checkAuthBruteForce(ip);
  if (!bruteCheck.success) {
    return rateLimitResponse(
      bruteCheck,
      `Too many failed authentication attempts. Access locked for ${Math.ceil(
        bruteCheck.retryAfterSeconds / 60
      )} minute(s).`
    );
  }

  const deleteLimitMax = 30;
  const rateLimit = checkRateLimit('ticker-delete', ip, {
    limit: deleteLimitMax,
    windowMs: 60 * 1000,
  });

  if (!rateLimit.success) {
    return rateLimitResponse(rateLimit);
  }

  const auth = verifyBotAuth(req);
  if (!auth.authorized) {
    const failRecord = recordAuthFailure(ip);
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized',
        remainingAttemptsBeforeLockout: Math.max(0, failRecord.remaining),
      },
      { status: 401, headers: getRateLimitHeaders(failRecord, 5) }
    );
  }

  resetAuthFailures(ip);
  await clearTicker();
  return NextResponse.json(
    {
      success: true,
      message: 'Ticker banner cleared successfully',
    },
    { headers: getRateLimitHeaders(rateLimit, deleteLimitMax) }
  );
}
