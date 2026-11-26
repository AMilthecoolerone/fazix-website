import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { getDiscordOAuthUrl, getBaseUrl, isDiscordOAuthConfigured, OAUTH_STATE_COOKIE, OAUTH_NEXT_COOKIE, safeNextPath } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!isDiscordOAuthConfigured()) {
    return NextResponse.redirect(new URL('/login?error=discord_credentials_not_configured', request.url));
  }

  // Random state, checked again in the callback so a login can't be started by another site.
  const state = crypto.randomBytes(24).toString('base64url');
  const response = NextResponse.redirect(getDiscordOAuthUrl(state, getBaseUrl(request)));
  response.cookies.set({
    name: OAUTH_STATE_COOKIE,
    value: state,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth/callback',
    maxAge: 60 * 10,
  });
  const next = safeNextPath(new URL(request.url).searchParams.get('next'));
  if (next) {
    response.cookies.set({ name: OAUTH_NEXT_COOKIE, value: next, httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/api/auth/callback', maxAge: 60 * 10 });
  }
  return response;
}
