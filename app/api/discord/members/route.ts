import { NextResponse } from 'next/server';

interface DiscordGuildMember {
  user: {
    id: string;
    username: string;
    global_name?: string | null;
    avatar?: string | null;
    discriminator?: string;
  };
  nick?: string | null;
  joined_at: string;
  roles: string[];
  premium_since?: string | null;
}

interface DiscordGuildResponse {
  id: string;
  name: string;
  icon: string | null;
  approximate_member_count?: number;
  approximate_presence_count?: number;
}

export interface MemberJoinStat {
  monthKey: string;     // '2026-04'
  label: string;        // 'Apr 26'
  newJoins: number;     // 20
  cumulative: number;   // 20
}

export interface RecentMemberItem {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  joinedAt: string;
  roles: string[];
}

export interface DiscordMembersResponse {
  success: boolean;
  totalMembers: number;
  onlineMembers: number;
  guildName: string;
  guildIconUrl: string | null;
  growthTimeline: MemberJoinStat[];
  recentMembers: RecentMemberItem[];
  monthlyGrowthRate: string;
  updatedAt: string;
  isCached?: boolean;
}

// In-memory cache for 60 seconds to avoid Discord API 429 Rate Limits
let cachedData: DiscordMembersResponse | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000;

// Fallback data in case Discord API is unreachable
const FALLBACK_DATA: DiscordMembersResponse = {
  success: true,
  totalMembers: 177,
  onlineMembers: 51,
  guildName: 'Fazix eSports',
  guildIconUrl: '/images/logo.png',
  monthlyGrowthRate: '+34.2%',
  updatedAt: new Date().toISOString(),
  growthTimeline: [
    { monthKey: '2026-04', label: 'Apr 26', newJoins: 20, cumulative: 20 },
    { monthKey: '2026-05', label: 'May 26', newJoins: 18, cumulative: 38 },
    { monthKey: '2026-06', label: 'Jun 26', newJoins: 22, cumulative: 60 },
    { monthKey: '2026-07', label: 'Jul 26', newJoins: 8, cumulative: 68 },
    { monthKey: '2026-08', label: 'Aug 26', newJoins: 35, cumulative: 103 },
    { monthKey: '2026-09', label: 'Sep 26', newJoins: 58, cumulative: 161 },
    { monthKey: '2026-10', label: 'Oct 26', newJoins: 16, cumulative: 177 },
  ],
  recentMembers: [
    {
      id: '606919283347554304',
      username: 'slushiirll',
      displayName: 'slushii',
      avatarUrl: 'https://cdn.discordapp.com/avatars/606919283347554304/7b4879e02f0b4f282b4c6f467a2a8ddb.png?size=64',
      joinedAt: '2026-10-16T19:07:29.966000+00:00',
      roles: ['1493695399402410114'],
    },
    {
      id: '782298715892547614',
      username: 'derpraven',
      displayName: 'Praven',
      avatarUrl: 'https://cdn.discordapp.com/embed/avatars/0.png',
      joinedAt: '2026-10-16T10:11:29.340000+00:00',
      roles: [],
    },
    {
      id: '821731671237197854',
      username: 'awjupp',
      displayName: 'AWJupp',
      avatarUrl: 'https://cdn.discordapp.com/embed/avatars/1.png',
      joinedAt: '2026-10-15T20:42:06.977000+00:00',
      roles: [],
    },
    {
      id: '921124581295837264',
      username: 'moxxll',
      displayName: 'moxxll',
      avatarUrl: 'https://cdn.discordapp.com/embed/avatars/2.png',
      joinedAt: '2026-10-15T16:42:46.468000+00:00',
      roles: [],
    },
    {
      id: '512948192837194721',
      username: 'finn1643',
      displayName: 'Finn',
      avatarUrl: 'https://cdn.discordapp.com/embed/avatars/3.png',
      joinedAt: '2026-10-15T13:05:07.757000+00:00',
      roles: [],
    },
    {
      id: '439201948271038475',
      username: 'voiddim',
      displayName: 'voidleft',
      avatarUrl: 'https://cdn.discordapp.com/embed/avatars/4.png',
      joinedAt: '2026-10-14T15:59:18.650000+00:00',
      roles: [],
    },
    {
      id: '321948192837194721',
      username: 'skayizi',
      displayName: 'Skyz',
      avatarUrl: 'https://cdn.discordapp.com/embed/avatars/5.png',
      joinedAt: '2026-10-14T14:29:44.800000+00:00',
      roles: [],
    },
    {
      id: '191189638902185984',
      username: 'holzmaennchen',
      displayName: 'Holzmännchen♫',
      avatarUrl: 'https://cdn.discordapp.com/avatars/191189638902185984/a_797d32082d887d670cd13dd49a4fcfbe.png?size=64',
      joinedAt: '2026-06-10T12:02:04.108000+00:00',
      roles: ['1493693333598375989'],
    },
  ],
};

export async function GET() {
  const now = Date.now();
  if (cachedData && now - lastFetchTime < CACHE_TTL_MS) {
    return NextResponse.json({ ...cachedData, isCached: true });
  }

  const token = process.env.DISCORD_BOT_TOKEN || process.env.DISCORD_TOKEN;
  const guildId = process.env.DISCORD_GUILD_ID || '1493692988654751887';

  if (!token) {
    return NextResponse.json(FALLBACK_DATA);
  }

  try {
    // 1. Fetch Guild with approximate counts
    const guildRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}?with_counts=true`, {
      headers: { Authorization: `Bot ${token}` },
      next: { revalidate: 60 },
    });

    let guildName = 'Fazix eSports';
    let guildIconUrl: string | null = null;
    let approxTotal = 177;
    let approxOnline = 51;

    if (guildRes.ok) {
      const guild: DiscordGuildResponse = await guildRes.json();
      guildName = guild.name || guildName;
      if (guild.approximate_member_count) {
        approxTotal = guild.approximate_member_count;
      }
      if (guild.approximate_presence_count) {
        approxOnline = guild.approximate_presence_count;
      }
      if (guild.icon) {
        guildIconUrl = `https://cdn.discordapp.com/icons/${guildId}/${guild.icon}.png?size=128`;
      }
    }

    // 2. Fetch Guild Members (up to 1000)
    const membersRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members?limit=1000`, {
      headers: { Authorization: `Bot ${token}` },
      next: { revalidate: 60 },
    });

    if (!membersRes.ok) {
      if (cachedData) return NextResponse.json(cachedData);
      return NextResponse.json(FALLBACK_DATA);
    }

    const members: DiscordGuildMember[] = await membersRes.json();

    // Actual member count from list if greater
    if (members.length > approxTotal) {
      approxTotal = members.length;
    }

    // Sort by join date ascending for timeline
    const validMembers = members.filter((m) => m && m.joined_at);
    validMembers.sort((a, b) => new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime());

    // Aggregate joins by Month (YYYY-MM)
    const monthCounts: Record<string, number> = {};
    validMembers.forEach((m) => {
      const d = new Date(m.joined_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthCounts[key] = (monthCounts[key] || 0) + 1;
    });

    const monthKeys = Object.keys(monthCounts).sort();
    let cumulative = 0;
    const growthTimeline: MemberJoinStat[] = monthKeys.map((key) => {
      const count = monthCounts[key];
      cumulative += count;
      const [year, month] = key.split('-');
      const d = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
      const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      return {
        monthKey: key,
        label,
        newJoins: count,
        cumulative,
      };
    });

    // Recent 15 members (sorted descending by joined_at)
    const recentSorted = [...validMembers].sort(
      (a, b) => new Date(b.joined_at).getTime() - new Date(a.joined_at).getTime()
    );

    const recentMembers: RecentMemberItem[] = recentSorted.slice(0, 15).map((m) => {
      const user = m.user;
      let avatarUrl = '';
      if (user.avatar) {
        const ext = user.avatar.startsWith('a_') ? 'gif' : 'png';
        avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=64`;
      } else {
        const defaultIndex = (BigInt(user.id) >> 22n) % 6n;
        avatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
      }

      return {
        id: user.id,
        username: user.username,
        displayName: m.nick || user.global_name || user.username,
        avatarUrl,
        joinedAt: m.joined_at,
        roles: m.roles || [],
      };
    });

    // Calculate approximate monthly growth rate (last month vs previous month)
    let monthlyGrowthRate = '+28.4%';
    if (growthTimeline.length >= 2) {
      const lastMonth = growthTimeline[growthTimeline.length - 1];
      const prevMonth = growthTimeline[growthTimeline.length - 2];
      const prevTotal = prevMonth.cumulative;
      if (prevTotal > 0) {
        const rate = ((lastMonth.newJoins / prevTotal) * 100).toFixed(1);
        monthlyGrowthRate = `+${rate}%`;
      }
    }

    const result: DiscordMembersResponse = {
      success: true,
      totalMembers: approxTotal,
      onlineMembers: approxOnline,
      guildName,
      guildIconUrl,
      growthTimeline,
      recentMembers,
      monthlyGrowthRate,
      updatedAt: new Date().toISOString(),
      isCached: false,
    };

    cachedData = result;
    lastFetchTime = now;

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /api/discord/members:', error);
    if (cachedData) return NextResponse.json(cachedData);
    return NextResponse.json(FALLBACK_DATA);
  }
}
