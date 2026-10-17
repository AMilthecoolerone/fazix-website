import { NextResponse } from 'next/server';
import {
  DEMO_PROFILES,
  serializeSession,
  SESSION_COOKIE_NAME,
  UserGroup
} from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const param = (searchParams.get('group') || searchParams.get('role')) as UserGroup;
  const targetGroup: UserGroup =
    param && DEMO_PROFILES[param] ? param : 'user';

  const profile = DEMO_PROFILES[targetGroup];
  const serialized = serializeSession(profile);

  const redirectUrl = new URL('/dashboard', request.url);
  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: serialized,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });

  return response;
}
