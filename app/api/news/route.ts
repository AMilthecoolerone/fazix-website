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
import {
  getNewsDatabase,
  createArticle,
  updateTicker,
  clearTicker,
  deleteArticle,
  approveArticle,
  updateArticleStatus,
} from '@/lib/newsStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/news
 * Public endpoint to fetch active news articles and the current top announcement ticker
 * Rate limit: 120 requests / minute per client IP
 */
export async function GET(req: Request) {
  try {
    const ip = getClientIp(req);
    const limitMax = 120;
    const rateLimit = checkRateLimit('news-get', ip, {
      limit: limitMax,
      windowMs: 60 * 1000,
    });

    if (!rateLimit.success) {
      return rateLimitResponse(rateLimit);
    }

    const { searchParams } = new URL(req.url);
    const tickerOnly = searchParams.get('tickerOnly') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const db = await getNewsDatabase();
    const rateLimitHeaders = getRateLimitHeaders(rateLimit, limitMax);

    if (tickerOnly) {
      return NextResponse.json(
        {
          success: true,
          ticker: db.ticker?.isActive ? db.ticker : null,
          lastUpdated: db.lastUpdated,
        },
        {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            ...rateLimitHeaders,
          },
        }
      );
    }

    const includeAll = searchParams.get('includeAll') === 'true';
    const filteredArticles = includeAll
      ? db.articles
      : db.articles.filter(a => !a.status || a.status === 'published');

    const articles = filteredArticles.slice(0, Math.max(1, Math.min(limit, 50)));

    return NextResponse.json(
      {
        success: true,
        ticker: db.ticker?.isActive ? db.ticker : null,
        articles,
        count: articles.length,
        total: filteredArticles.length,
        lastUpdated: db.lastUpdated,
      },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          ...rateLimitHeaders,
        },
      }
    );
  } catch (error) {
    console.error('[API /api/news GET error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve news data' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/news
 * Secure delivery endpoint for Discord bot to publish articles or update top badge ticker
 * Rate limit: 60 actions / minute per IP + lockout on 5 consecutive failed auth attempts
 */
export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    // 1. Anti-brute force check against auth guessing
    const bruteCheck = checkAuthBruteForce(ip);
    if (!bruteCheck.success) {
      return rateLimitResponse(
        bruteCheck,
        `Too many failed authentication attempts. Access locked for ${Math.ceil(
          bruteCheck.retryAfterSeconds / 60
        )} minute(s).`
      );
    }

    // 2. Action rate limit: 60 actions per minute per client IP
    const postLimitMax = 60;
    const rateLimit = checkRateLimit('news-post', ip, {
      limit: postLimitMax,
      windowMs: 60 * 1000,
    });

    if (!rateLimit.success) {
      return rateLimitResponse(rateLimit);
    }

    // Clone request text for HMAC verification if needed
    const rawBody = await req.text();
    const auth = verifyBotAuth(req, rawBody);

    if (!auth.authorized) {
      const failRecord = recordAuthFailure(ip);
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized. Invalid or missing bot authentication token.',
          reason: auth.reason,
          remainingAttemptsBeforeLockout: Math.max(0, failRecord.remaining),
        },
        {
          status: 401,
          headers: getRateLimitHeaders(failRecord, 5),
        }
      );
    }

    // Valid auth: reset any recorded failures
    resetAuthFailures(ip);

    let body: any;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    const action = body.action || (body.title ? 'create_article' : 'set_ticker');
    const responseHeaders = getRateLimitHeaders(rateLimit, postLimitMax);

    // 3. Action: Set or Update Top News Badge Ticker
    if (action === 'set_ticker') {
      const { text, badge, link, articleId, priority, isActive } = body;

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
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      });

      console.log('[DISCORD BOT] Top badge ticker updated:', {
        badge: ticker.badge,
        text: ticker.text,
        byIp: ip,
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Top announcement badge ticker updated successfully',
          ticker,
        },
        { headers: responseHeaders }
      );
    }

    // 4. Action: Clear / Deactivate Top News Ticker
    if (action === 'clear_ticker') {
      await clearTicker();
      console.log('[DISCORD BOT] Top badge ticker cleared by IP:', ip);
      return NextResponse.json(
        {
          success: true,
          message: 'Top announcement badge ticker deactivated',
        },
        { headers: responseHeaders }
      );
    }

    // 5. Action: Delete an article by ID
    if (action === 'delete_article') {
      const { id } = body;
      if (!id || typeof id !== 'string') {
        return NextResponse.json(
          { success: false, error: 'Article ID is required for deletion' },
          { status: 400, headers: responseHeaders }
        );
      }

      const deleted = await deleteArticle(id);
      if (!deleted) {
        return NextResponse.json(
          { success: false, error: `Article with ID "${id}" was not found` },
          { status: 404, headers: responseHeaders }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: `Article ${id} deleted successfully`,
        },
        { headers: responseHeaders }
      );
    }

    // 5b. Action: Approve an article (editorial release)
    if (action === 'approve_article') {
      const { id } = body;
      if (!id || typeof id !== 'string') {
        return NextResponse.json(
          { success: false, error: 'Article ID is required for approval' },
          { status: 400, headers: responseHeaders }
        );
      }

      const approved = await approveArticle(id);
      if (!approved) {
        return NextResponse.json(
          { success: false, error: `Article with ID "${id}" was not found` },
          { status: 404, headers: responseHeaders }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: `Article ${id} approved and published successfully`,
          article: approved,
        },
        { headers: responseHeaders }
      );
    }

    // 6. Action: Create News Article (with optional top ticker activation)
    if (action === 'create_article') {
      const {
        title,
        summary,
        content,
        image,
        badge,
        author,
        readTime,
        url,
        pinned,
        status,
        setTicker,
        tickerText,
        tickerBadge,
      } = body;

      if (!title || typeof title !== 'string' || title.trim().length < 3) {
        return NextResponse.json(
          { success: false, error: 'Article title is required (minimum 3 characters)' },
          { status: 400, headers: responseHeaders }
        );
      }

      const validContent = content || summary || title;

      const result = await createArticle({
        title,
        summary,
        content: validContent,
        image,
        badge,
        author: author || 'Discord News Bot',
        readTime,
        url,
        pinned,
        status: status || 'published',
        setTicker: Boolean(setTicker),
        tickerText,
        tickerBadge,
      });

      console.log('[DISCORD BOT] News article created:', {
        id: result.article.id,
        title: result.article.title,
        badge: result.article.badge,
        setTicker: Boolean(setTicker),
        byIp: ip,
      });

      return NextResponse.json(
        {
          success: true,
          message: 'News article published successfully',
          article: result.article,
          ticker: result.ticker || null,
        },
        { status: 201, headers: responseHeaders }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: `Unknown action "${action}". Allowed: create_article, set_ticker, clear_ticker, delete_article.`,
      },
      { status: 400, headers: responseHeaders }
    );
  } catch (error) {
    console.error('[API /api/news POST error]:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred while processing news delivery' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/news?id=xxx or ?action=ticker
 * Secure deletion of articles or clearing of top ticker
 * Rate limit: 30 requests / minute per IP
 */
export async function DELETE(req: Request) {
  try {
    const ip = getClientIp(req);

    // Anti-brute-force check
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
    const deleteLimitMax = 30;
    const rateLimit = checkRateLimit('news-delete', ip, {
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
    const responseHeaders = getRateLimitHeaders(rateLimit, deleteLimitMax);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const action = searchParams.get('action');

    if (action === 'ticker') {
      await clearTicker();
      return NextResponse.json(
        {
          success: true,
          message: 'Top announcement badge ticker cleared',
        },
        { headers: responseHeaders }
      );
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing article id parameter' },
        { status: 400, headers: responseHeaders }
      );
    }

    const deleted = await deleteArticle(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404, headers: responseHeaders }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Article ${id} deleted successfully`,
      },
      { headers: responseHeaders }
    );
  } catch (error) {
    console.error('[API /api/news DELETE error]:', error);
    return NextResponse.json(
      { success: false, error: 'Deletion failed' },
      { status: 500 }
    );
  }
}
