import { NextResponse } from 'next/server';
import { getDiscordOAuthUrl, getBaseUrl, isDiscordOAuthConfigured, UserGroup } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requested = (searchParams.get('group') || searchParams.get('role') || 'user') as UserGroup;
  const targetGroup: UserGroup = ['support', 'player', 'partner', 'user'].includes(requested)
    ? requested
    : 'user';

  // If live credentials are not set, allow instant demo login
  if (!isDiscordOAuthConfigured()) {
    const redirectUrl = new URL(`/api/auth/demo?group=${targetGroup}&notice=demo_mode`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect to Discord OAuth Authorization screen with group passed in state and dynamically resolved baseUrl
  const currentBaseUrl = getBaseUrl(request);
  const oauthUrl = getDiscordOAuthUrl(targetGroup, currentBaseUrl);
  return NextResponse.redirect(oauthUrl);
}
