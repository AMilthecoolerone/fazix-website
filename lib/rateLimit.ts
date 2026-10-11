interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitRecord>();

export interface RateLimitOptions {
  limit?: number; // max requests allowed in the window (default: 3)
  windowMs?: number; // window duration in ms (default: 10 minutes = 600,000 ms)
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
}

/**
 * Check and record a rate limit hit for a given namespace and identifier (e.g. IP)
 */
export function checkRateLimit(
  namespace: string,
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const limit = options.limit ?? 3;
  const windowMs = options.windowMs ?? 10 * 60 * 1000; // 10 minutes
  const now = Date.now();

  const key = `${namespace}:${identifier}`;
  const record = store.get(key);

  // Periodic cleanup if store grows
  if (store.size > 1000) {
    for (const [k, v] of store.entries()) {
      if (v.resetAt < now) {
        store.delete(k);
      }
    }
  }

  if (!record || record.resetAt <= now) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetAt: now + windowMs,
    };
    store.set(key, newRecord);
    return {
      success: true,
      remaining: limit - 1,
      resetAt: newRecord.resetAt,
      retryAfterSeconds: 0,
    };
  }

  if (record.count >= limit) {
    const retryAfterSeconds = Math.ceil((record.resetAt - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetAt: record.resetAt,
      retryAfterSeconds: Math.max(1, retryAfterSeconds),
    };
  }

  record.count += 1;
  return {
    success: true,
    remaining: limit - record.count,
    resetAt: record.resetAt,
    retryAfterSeconds: 0,
  };
}

/**
 * Helper to safely extract client IP from Next.js request headers
 */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

/**
 * Standard HTTP rate-limit headers to include in responses
 */
export function getRateLimitHeaders(
  result: RateLimitResult,
  limit: number
): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(limit),
    'X-RateLimit-Remaining': String(Math.max(0, result.remaining)),
    'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
  };
}

/**
 * Returns a standardized 429 Too Many Requests response
 */
export function rateLimitResponse(
  result: RateLimitResult,
  message?: string
): Response {
  const errorMessage =
    message ||
    `Rate limit exceeded. Please wait ${result.retryAfterSeconds} second(s) before retrying.`;

  return new Response(
    JSON.stringify({
      success: false,
      error: errorMessage,
      retryAfterSeconds: result.retryAfterSeconds,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(result.retryAfterSeconds),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
      },
    }
  );
}

/**
 * Check if an IP is currently blocked due to repeated failed authentication attempts
 */
export function checkAuthBruteForce(ip: string): RateLimitResult {
  const key = `auth-fail:${ip}`;
  const record = store.get(key);
  const now = Date.now();

  if (record && record.resetAt > now && record.count >= 5) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetAt: record.resetAt,
      retryAfterSeconds: Math.max(1, retryAfter),
    };
  }

  return {
    success: true,
    remaining: record ? Math.max(0, 5 - record.count) : 5,
    resetAt: record ? record.resetAt : now,
    retryAfterSeconds: 0,
  };
}

/**
 * Record a failed authentication attempt (locks IP out after 5 failures for 15 minutes)
 */
export function recordAuthFailure(ip: string): RateLimitResult {
  return checkRateLimit('auth-fail', ip, {
    limit: 5,
    windowMs: 15 * 60 * 1000, // 15 minute lock
  });
}

/**
 * Clears failed authentication attempts upon successful authenticated request
 */
export function resetAuthFailures(ip: string): void {
  store.delete(`auth-fail:${ip}`);
}

