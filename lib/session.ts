import crypto from 'crypto';
import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME, UserSession } from '@/lib/auth';

/**
 * Server-only session helpers. Sessions are stored as `<base64url json>.<hmac>` so a
 * client cannot edit its own role. Set SESSION_SECRET in production.
 */

const DEV_SECRET = 'fazix_dev_session_secret_change_me';

function secret(): string {
  const s = process.env.SESSION_SECRET || process.env.AUTH_SECRET;
  if (!s && process.env.NODE_ENV === 'production') {
    console.warn('[session] SESSION_SECRET is not set; using the insecure development secret.');
  }
  return s || DEV_SECRET;
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', secret()).update(payload).digest('base64url');
}

export function encodeSession(session: UserSession): string {
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function decodeSession(value: string | undefined | null): UserSession | null {
  if (!value) return null;
  const dot = value.lastIndexOf('.');
  if (dot <= 0) return null;
  const payload = value.slice(0, dot);
  const given = Buffer.from(value.slice(dot + 1));
  const expected = Buffer.from(sign(payload));
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return null;
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as UserSession;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<UserSession | null> {
  const store = await cookies();
  return decodeSession(store.get(SESSION_COOKIE_NAME)?.value);
}

/** Staff = has a staff Discord role (see DISCORD_ROLE_IDS.support in lib/auth.ts). */
export function isStaff(session: UserSession | null): boolean {
  return Boolean(session && (session.eligibleGroups || [session.role]).includes('support'));
}

export function jsonError(status: number, error: string): Response {
  return Response.json({ error }, { status });
}

/** Returns the session, or a Response to return immediately. */
export async function requireStaff(): Promise<UserSession | Response> {
  const session = await getSession();
  if (!session) return jsonError(401, 'Not signed in.');
  if (!isStaff(session)) return jsonError(403, 'Staff only.');
  return session;
}

export async function requireUser(): Promise<UserSession | Response> {
  const session = await getSession();
  if (!session) return jsonError(401, 'Not signed in.');
  return session;
}

export function sessionCookie(value: string, maxAge: number) {
  return {
    name: SESSION_COOKIE_NAME,
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}

export function clampText(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}
