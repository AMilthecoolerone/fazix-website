import { NextResponse } from 'next/server';
import {
  getBaseUrl,
  serializeSession,
  SESSION_COOKIE_NAME,
  UserSession,
  UserGroup,
  USER_GROUPS,
  resolveUserGroups,
  DISCORD_GUILD_ID
} from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');

  if (error || !code) {
    const errorMsg = error || 'Missing authorization code';
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorMsg)}`, request.url)
    );
  }

  const clientId =
    process.env.DISCORD_CLIENT_ID ||
    process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID ||
    '1542535888322564176';
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = `${getBaseUrl(request)}/api/auth/callback/discord`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL('/login?error=discord_credentials_not_configured', request.url)
    );
  }

  try {
    // 1. Exchange code for access token
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri
      })
    });

    if (!tokenRes.ok) {
      const errData = await tokenRes.text();
      console.error('Discord Token Exchange Error:', errData);
      let errorMsg = 'token_exchange_failed';
      try {
        const json = JSON.parse(errData);
        if (json.error_description) {
          errorMsg = json.error_description;
        } else if (json.error) {
          errorMsg = json.error;
        }
      } catch {}
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(errorMsg)}`, request.url));
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch User Profile
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!userRes.ok) {
      return NextResponse.redirect(new URL('/login?error=user_fetch_failed', request.url));
    }

    const discordUser = await userRes.json();

    // 3. Determine Avatar URL
    let avatarUrl = '/images/logo.png';
    if (discordUser.avatar) {
      const ext = discordUser.avatar.startsWith('a_') ? 'gif' : 'png';
      avatarUrl = `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.${ext}?size=128`;
    }

    // 4. Fetch Guild Member Roles in FAZIX Discord Server
    let memberRoles: string[] = [];
    let memberNick: string | null = null;
    const guildId = process.env.DISCORD_GUILD_ID || DISCORD_GUILD_ID;
    const botToken = process.env.DISCORD_BOT_TOKEN || process.env.DISCORD_TOKEN;

    // Attempt 1: Fetch using Bot token (Server Members Intent)
    if (botToken) {
      try {
        const memberRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${discordUser.id}`, {
          headers: { Authorization: `Bot ${botToken}` }
        });
        if (memberRes.ok) {
          const memberData = await memberRes.json();
          memberRoles = Array.isArray(memberData.roles) ? memberData.roles : [];
          memberNick = memberData.nick || null;
        }
      } catch (e) {
        console.warn('Bot member role lookup failed:', e);
      }
    }

    // Attempt 2: Fetch using User OAuth Token
    if (memberRoles.length === 0) {
      try {
        const userMemberRes = await fetch(`https://discord.com/api/v10/users/@me/guilds/${guildId}/member`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (userMemberRes.ok) {
          const userMemberData = await userMemberRes.json();
          memberRoles = Array.isArray(userMemberData.roles) ? userMemberData.roles : [];
          memberNick = userMemberData.nick || null;
        }
      } catch (e) {
        console.warn('User OAuth guild member lookup failed:', e);
      }
    }

    // 5. Determine Group based on Discord Roles
    const { primaryGroup, eligibleGroups } = resolveUserGroups(memberRoles);

    // If state requested a specific valid group and user is authorized or support
    let assignedGroup: UserGroup = primaryGroup;
    if (state && ['support', 'player', 'partner', 'user'].includes(state)) {
      if (eligibleGroups.includes(state as UserGroup) || primaryGroup === 'support') {
        assignedGroup = state as UserGroup;
      }
    }

    const displayName = memberNick || discordUser.global_name || discordUser.username;

    const session: UserSession = {
      id: discordUser.id,
      username: discordUser.username,
      displayName,
      avatar: discordUser.avatar || '',
      avatarUrl,
      role: assignedGroup,
      group: assignedGroup,
      eligibleGroups,
      discordRoles: memberRoles,
      groupTitle: USER_GROUPS[assignedGroup]?.label || 'Normal people (Users)',
      email: discordUser.email || undefined,
      teamName: assignedGroup === 'player' ? 'FAZIX Main RLCS Roster' : 'FAZIX Esports',
      isDemo: false,
      joinedAt: new Date().toISOString().split('T')[0],
      mmr: assignedGroup === 'player' ? 2185 : undefined
    };

    const serialized = serializeSession(session);
    const response = NextResponse.redirect(new URL('/dashboard', request.url));

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: serialized,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return response;
  } catch (err: any) {
    console.error('Discord Auth Callback Exception:', err);
    return NextResponse.redirect(new URL('/login?error=auth_internal_error', request.url));
  }
}
