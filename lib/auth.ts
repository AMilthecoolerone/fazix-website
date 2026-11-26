/**
 * Auth model for the site. Login is Discord OAuth only; everything that reads the
 * current user goes through getSession() in lib/session.ts, so swapping the provider
 * (e.g. to Clerk later) only touches lib/session.ts and the /api/auth routes.
 */

export type UserGroup = 'support' | 'player' | 'partner' | 'user';

export interface UserSession {
  id: string; // Discord user ID
  username: string;
  displayName: string;
  avatarUrl: string;
  role: UserGroup; // highest group from Discord roles
  eligibleGroups: UserGroup[];
  discordRoles?: string[];
  email?: string;
}

export const SESSION_COOKIE_NAME = 'fazix_auth_session';
export const OAUTH_STATE_COOKIE = 'fazix_oauth_state';
export const OAUTH_NEXT_COOKIE = 'fazix_oauth_next';

/** Only same-site paths like "/careers/x/apply" are allowed as a post-login destination. */
export function safeNextPath(next: string | null | undefined): string | null {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.includes('\\')) return null;
  return next.slice(0, 300);
}

export const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID || '1493692988654751887';

// Discord server role IDs on FAZIX server
export const DISCORD_ROLE_IDS = {
  support: [
    '1493693333598375989', // |  Support
    '1493693325083934941', // |  Founder
    '1493693332403257526', // |  Management
    '1493693333300576256', // |  Marketing
    '1493696122093310103', // Team Manager
    '1493696230692356158', // Event Manager
    '1542611540652597248', // |  Developer
    '1549502067771445448', // |  Social Media
    '1499121584575615200', // 💛| Team
  ],
  player: [
    '1524961605543006270', // Fazix eSports Spieler
    '1498044235876794430', // 💛 |  Fazix eSports
    '1515796526515880006', // | Coach
    '1554215038464692315', // 💙 | Main Team (Test)
    '1554160899567124691', // | Academy Team
    '1554469442249949274', // 💜 |  Semi Team
    '1514239539198165102', // |  Fazix Skyfall
    '1523400699503968466', // | Fazix Orbit
    '1538844242380857434', // |  Fazix OGs
    '1545011288495628369', // |  Fazix Velour
    '1550265239411359834', // | Fazix Vyro
    '1493695819675603035', // | Fazix Synchro
    '1542549782705217549', // Fazix Esports
  ],
  partner: [
    '1535771218521751552', // |  Partner
  ]
};

/**
 * Resolves user groups from Discord role IDs
 */
export function resolveUserGroups(roleIds: string[] = []): { primaryGroup: UserGroup; eligibleGroups: UserGroup[] } {
  const eligibleSet = new Set<UserGroup>();

  const hasSupport = roleIds.some((id) => DISCORD_ROLE_IDS.support.includes(id));
  const hasPlayer = roleIds.some((id) => DISCORD_ROLE_IDS.player.includes(id));
  const hasPartner = roleIds.some((id) => DISCORD_ROLE_IDS.partner.includes(id));

  if (hasSupport) eligibleSet.add('support');
  if (hasPlayer) eligibleSet.add('player');
  if (hasPartner) eligibleSet.add('partner');
  eligibleSet.add('user'); // Everyone is eligible for the regular user view

  const eligibleGroups = Array.from(eligibleSet);

  let primaryGroup: UserGroup = 'user';
  if (hasSupport) {
    primaryGroup = 'support';
  } else if (hasPlayer) {
    primaryGroup = 'player';
  } else if (hasPartner) {
    primaryGroup = 'partner';
  }

  return { primaryGroup, eligibleGroups };
}

/**
 * Returns the base URL for the application dynamically based on incoming request or environment
 */
export function getBaseUrl(request?: Request): string {
  if (request) {
    try {
      const url = new URL(request.url);
      const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || url.host;
      const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
      const proto =
        request.headers.get('x-forwarded-proto') ||
        (isLocal ? 'http' : (url.protocol ? url.protocol.replace(':', '') : 'https'));
      return `${proto}://${host}`;
    } catch {
      // fallback
    }
  }

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'http://localhost:3000';
  }

  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  );
}

/**
 * Checks if Discord OAuth is configured in environment
 */
export function isDiscordOAuthConfigured(): boolean {
  const clientId = process.env.DISCORD_CLIENT_ID || process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  return Boolean(clientId && clientSecret);
}

/**
 * Generates Discord OAuth2 Authorization URL with dynamic baseUrl
 */
export function getDiscordOAuthUrl(state: string, baseUrlOverride?: string): string {
  const clientId =
    process.env.DISCORD_CLIENT_ID ||
    process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID ||
    '1542535888322564176';
  const baseUrl = (baseUrlOverride || getBaseUrl()).replace(/\/+$/, '');
  const redirectUri = `${baseUrl}/api/auth/callback/discord`;
  const scope = encodeURIComponent('identify email guilds guilds.members.read');
  const encodedRedirect = encodeURIComponent(redirectUri);

  const stateParam = `&state=${encodeURIComponent(state)}`;
  return `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodedRedirect}&scope=${scope}${stateParam}`;
}
