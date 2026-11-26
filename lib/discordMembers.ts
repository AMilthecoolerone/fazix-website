import { DISCORD_GUILD_ID, resolveUserGroups, type UserGroup } from '@/lib/auth';
import { readDoc, storeBackend, writeDoc } from '@/lib/store';

interface DiscordGuildMember {
  user: {
    id: string;
    username: string;
    global_name?: string | null;
    avatar?: string | null;
    discriminator?: string;
    bot?: boolean;
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
  monthKey: string; // '2026-04'
  label: string; // 'Apr 26'
  newJoins: number;
  cumulative: number;
}

export interface DailyJoinStat {
  dateKey: string; // '2026-11-26'
  label: string; // 'Nov 26'
  newJoins: number;
  cumulative: number;
}

export interface PresenceSnapshotPoint {
  timestamp: string;
  label: string;
  onlineMembers: number;
  totalMembers: number;
}

export interface RecentMemberItem {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  joinedAt: string;
  roles: string[];
  group: UserGroup;
}

export interface RoleBreakdown {
  support: number;
  player: number;
  partner: number;
  community: number;
  bots: number;
}

export type DataSource = 'live' | 'cache' | 'stale' | 'unavailable';

export interface DiscordMembersResponse {
  success: boolean;
  source: DataSource;
  storageBackend: 'redis' | 'file';
  statusNote?: string;
  guildId: string;
  guildName: string;
  guildIconUrl: string | null;
  totalMembers: number;
  onlineMembers: number;
  offlineMembers: number;
  humanMembers: number;
  botMembers: number;
  joined24h: number;
  joined7d: number;
  joined30d: number;
  monthlyGrowthRate: string;
  avgMonthlyJoins: number;
  growthTimeline: MemberJoinStat[];
  dailyTimeline: DailyJoinStat[];
  presenceHistory: PresenceSnapshotPoint[];
  recentMembers: RecentMemberItem[];
  roleBreakdown: RoleBreakdown;
  updatedAt: string;
  isCached?: boolean;
}

interface PersistedDiscordAnalytics {
  lastSnapshot: Omit<DiscordMembersResponse, 'source' | 'storageBackend' | 'statusNote' | 'isCached' | 'presenceHistory'> | null;
  presenceHistory: PresenceSnapshotPoint[];
}

const STORE_KEY = 'discord_analytics';
const CACHE_TTL_MS = 60 * 1000;
const PRESENCE_SAMPLE_INTERVAL_MS = 5 * 60 * 1000;
const MAX_PRESENCE_POINTS = 288; // 24h at 5-min intervals or longer when sampled on visits
const DAY_MS = 24 * 60 * 60 * 1000;

const EMPTY_STORE: PersistedDiscordAnalytics = {
  lastSnapshot: null,
  presenceHistory: [],
};

function getAvatarUrl(user: DiscordGuildMember['user']): string {
  if (user.avatar) {
    const ext = user.avatar.startsWith('a_') ? 'gif' : 'png';
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=128`;
  }
  try {
    const defaultIndex = (BigInt(user.id) >> 22n) % 6n;
    return `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
  } catch {
    return 'https://cdn.discordapp.com/embed/avatars/0.png';
  }
}

function formatPresenceLabel(isoString: string): string {
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  const datePart = d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
  const timePart = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  });
  return `${datePart} ${timePart}`;
}

function buildDailyTimeline(
  members: Array<{ joinedAtMs: number }>,
  nowMs: number,
  days: number = 30
): DailyJoinStat[] {
  const todayUtc = new Date(nowMs);
  const endDayUtc = Date.UTC(todayUtc.getUTCFullYear(), todayUtc.getUTCMonth(), todayUtc.getUTCDate());
  const startDayUtc = endDayUtc - (days - 1) * DAY_MS;

  const dayCounts = new Map<string, number>();
  let baselineBeforeWindow = 0;

  for (const m of members) {
    if (m.joinedAtMs < startDayUtc) {
      baselineBeforeWindow++;
      continue;
    }
    const d = new Date(m.joinedAtMs);
    const key = d.toISOString().slice(0, 10);
    dayCounts.set(key, (dayCounts.get(key) || 0) + 1);
  }

  let runningCumulative = baselineBeforeWindow;
  const result: DailyJoinStat[] = [];

  for (let i = 0; i < days; i++) {
    const dayDate = new Date(startDayUtc + i * DAY_MS);
    const dateKey = dayDate.toISOString().slice(0, 10);
    const newJoins = dayCounts.get(dateKey) || 0;
    runningCumulative += newJoins;
    const label = dayDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    });
    result.push({
      dateKey,
      label,
      newJoins,
      cumulative: runningCumulative,
    });
  }

  return result;
}

function buildUnavailableResponse(guildId: string, statusNote: string): DiscordMembersResponse {
  return {
    success: false,
    source: 'unavailable',
    storageBackend: storeBackend(),
    statusNote,
    guildId,
    guildName: 'Discord Server',
    guildIconUrl: null,
    totalMembers: 0,
    onlineMembers: 0,
    offlineMembers: 0,
    humanMembers: 0,
    botMembers: 0,
    joined24h: 0,
    joined7d: 0,
    joined30d: 0,
    monthlyGrowthRate: '0.0%',
    avgMonthlyJoins: 0,
    growthTimeline: [],
    dailyTimeline: [],
    presenceHistory: [],
    recentMembers: [],
    roleBreakdown: {
      support: 0,
      player: 0,
      partner: 0,
      community: 0,
      bots: 0,
    },
    updatedAt: new Date().toISOString(),
  };
}

async function fetchAllGuildMembers(
  guildId: string,
  token: string
): Promise<{ members: DiscordGuildMember[]; errorStatus?: number }> {
  const allMembers: DiscordGuildMember[] = [];
  let after = '0';

  for (let page = 0; page < 5; page++) {
    const res = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}/members?limit=1000&after=${after}`,
      {
        headers: { Authorization: `Bot ${token}` },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      return { members: allMembers, errorStatus: res.status };
    }

    const batch: DiscordGuildMember[] = await res.json();
    allMembers.push(...batch);

    if (batch.length < 1000) {
      break;
    }

    const lastMember = batch[batch.length - 1];
    if (!lastMember?.user?.id || lastMember.user.id === after) {
      break;
    }
    after = lastMember.user.id;
  }

  return { members: allMembers };
}

function appendPresenceSample(
  history: PresenceSnapshotPoint[],
  nowMs: number,
  onlineMembers: number,
  totalMembers: number
): PresenceSnapshotPoint[] {
  const iso = new Date(nowMs).toISOString();
  const nextPoint: PresenceSnapshotPoint = {
    timestamp: iso,
    label: formatPresenceLabel(iso),
    onlineMembers,
    totalMembers,
  };

  const trimmed = [...history];
  const last = trimmed[trimmed.length - 1];
  if (!last) {
    return [nextPoint];
  }

  const elapsed = nowMs - new Date(last.timestamp).getTime();
  const changed = last.onlineMembers !== onlineMembers || last.totalMembers !== totalMembers;

  if (elapsed >= PRESENCE_SAMPLE_INTERVAL_MS || (changed && elapsed >= 60 * 1000)) {
    trimmed.push(nextPoint);
  } else {
    trimmed[trimmed.length - 1] = nextPoint;
  }

  if (trimmed.length > MAX_PRESENCE_POINTS) {
    return trimmed.slice(trimmed.length - MAX_PRESENCE_POINTS);
  }
  return trimmed;
}

export async function getDiscordMembersData(options?: {
  forceRefresh?: boolean;
}): Promise<DiscordMembersResponse> {
  const now = Date.now();
  const forceRefresh = Boolean(options?.forceRefresh);
  const guildId = process.env.DISCORD_GUILD_ID || DISCORD_GUILD_ID;
  const backend = storeBackend();

  const stored = await readDoc<PersistedDiscordAnalytics>(STORE_KEY, EMPTY_STORE).catch(
    () => EMPTY_STORE
  );
  const storedHistory = Array.isArray(stored.presenceHistory) ? stored.presenceHistory : [];

  if (
    !forceRefresh &&
    stored.lastSnapshot &&
    stored.lastSnapshot.guildId === guildId &&
    now - new Date(stored.lastSnapshot.updatedAt).getTime() < CACHE_TTL_MS
  ) {
    return {
      ...stored.lastSnapshot,
      presenceHistory: storedHistory,
      source: 'cache',
      storageBackend: backend,
      isCached: true,
    };
  }

  const token = process.env.DISCORD_BOT_TOKEN || process.env.DISCORD_TOKEN;
  if (!token) {
    if (stored.lastSnapshot && stored.lastSnapshot.guildId === guildId) {
      return {
        ...stored.lastSnapshot,
        presenceHistory: storedHistory,
        source: 'stale',
        storageBackend: backend,
        statusNote: 'missing_bot_token',
        isCached: true,
      };
    }
    return buildUnavailableResponse(guildId, 'missing_bot_token');
  }

  try {
    const [guildRes, membersResult] = await Promise.all([
      fetch(`https://discord.com/api/v10/guilds/${guildId}?with_counts=true`, {
        headers: { Authorization: `Bot ${token}` },
        cache: 'no-store',
      }),
      fetchAllGuildMembers(guildId, token),
    ]);

    if (!guildRes.ok && membersResult.errorStatus) {
      const note = `discord_api_${guildRes.status}`;
      if (stored.lastSnapshot && stored.lastSnapshot.guildId === guildId) {
        return {
          ...stored.lastSnapshot,
          presenceHistory: storedHistory,
          source: 'stale',
          storageBackend: backend,
          statusNote: note,
          isCached: true,
        };
      }
      return buildUnavailableResponse(guildId, note);
    }

    if (membersResult.errorStatus && membersResult.members.length === 0) {
      const note = `discord_members_${membersResult.errorStatus}`;
      if (stored.lastSnapshot && stored.lastSnapshot.guildId === guildId) {
        return {
          ...stored.lastSnapshot,
          presenceHistory: storedHistory,
          source: 'stale',
          storageBackend: backend,
          statusNote: note,
          isCached: true,
        };
      }
      return buildUnavailableResponse(guildId, note);
    }

    let guildName = 'Discord Server';
    let guildIconUrl: string | null = null;
    let approxTotal = 0;
    let approxOnline = 0;

    if (guildRes.ok) {
      const guild: DiscordGuildResponse = await guildRes.json();
      guildName = guild.name || guildName;
      if (typeof guild.approximate_member_count === 'number') {
        approxTotal = guild.approximate_member_count;
      }
      if (typeof guild.approximate_presence_count === 'number') {
        approxOnline = guild.approximate_presence_count;
      }
      if (guild.icon) {
        guildIconUrl = `https://cdn.discordapp.com/icons/${guildId}/${guild.icon}.png?size=128`;
      }
    }

    const members = membersResult.members;
    const botMembersList = members.filter((m) => Boolean(m.user?.bot));
    const humanMembersList = members.filter((m) => !m.user?.bot);

    const totalMembers = Math.max(approxTotal, members.length);
    const onlineMembers = Math.min(approxOnline, totalMembers);
    const offlineMembers = Math.max(0, totalMembers - onlineMembers);

    const parsedMembers = members
      .filter((m) => m && m.joined_at && !Number.isNaN(new Date(m.joined_at).getTime()))
      .map((m) => ({
        member: m,
        joinedAtMs: new Date(m.joined_at).getTime(),
      }))
      .sort((a, b) => a.joinedAtMs - b.joinedAtMs);

    const monthCounts = new Map<string, number>();
    for (const { joinedAtMs } of parsedMembers) {
      const d = new Date(joinedAtMs);
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
      monthCounts.set(key, (monthCounts.get(key) || 0) + 1);
    }

    const sortedMonthKeys = Array.from(monthCounts.keys()).sort();
    const monthKeys: string[] = [];
    if (sortedMonthKeys.length > 0) {
      const [startY, startM] = sortedMonthKeys[0].split('-').map(Number);
      const nowDate = new Date(now);
      const endY = nowDate.getUTCFullYear();
      const endM = nowDate.getUTCMonth() + 1;
      let y = startY;
      let m = startM;
      while (y < endY || (y === endY && m <= endM)) {
        monthKeys.push(`${y}-${String(m).padStart(2, '0')}`);
        m++;
        if (m > 12) {
          m = 1;
          y++;
        }
      }
    }

    let cumulative = 0;
    const growthTimeline: MemberJoinStat[] = monthKeys.map((key) => {
      const count = monthCounts.get(key) || 0;
      cumulative += count;
      const [yearStr, monthStr] = key.split('-');
      const d = new Date(Date.UTC(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, 1));
      const label = d.toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit',
        timeZone: 'UTC',
      });
      return {
        monthKey: key,
        label,
        newJoins: count,
        cumulative,
      };
    });

    const dailyTimeline = buildDailyTimeline(parsedMembers, now, 30);

    const cutoff24h = now - DAY_MS;
    const cutoff7d = now - 7 * DAY_MS;
    const cutoff30d = now - 30 * DAY_MS;
    let joined24h = 0;
    let joined7d = 0;
    let joined30d = 0;

    for (const { joinedAtMs } of parsedMembers) {
      if (joinedAtMs >= cutoff30d) {
        joined30d++;
        if (joinedAtMs >= cutoff7d) {
          joined7d++;
          if (joinedAtMs >= cutoff24h) {
            joined24h++;
          }
        }
      }
    }

    const roleBreakdown: RoleBreakdown = {
      support: 0,
      player: 0,
      partner: 0,
      community: 0,
      bots: botMembersList.length,
    };

    for (const m of humanMembersList) {
      const { primaryGroup } = resolveUserGroups(m.roles || []);
      if (primaryGroup === 'support') roleBreakdown.support++;
      else if (primaryGroup === 'player') roleBreakdown.player++;
      else if (primaryGroup === 'partner') roleBreakdown.partner++;
      else roleBreakdown.community++;
    }

    const recentSource = humanMembersList.length > 0 ? humanMembersList : members;
    const recentSorted = recentSource
      .filter((m) => m && m.joined_at && !Number.isNaN(new Date(m.joined_at).getTime()))
      .sort((a, b) => new Date(b.joined_at).getTime() - new Date(a.joined_at).getTime());

    const recentMembers: RecentMemberItem[] = recentSorted.slice(0, 30).map((m) => {
      const { primaryGroup } = resolveUserGroups(m.roles || []);
      return {
        id: m.user.id,
        username: m.user.username,
        displayName: m.nick || m.user.global_name || m.user.username,
        avatarUrl: getAvatarUrl(m.user),
        joinedAt: m.joined_at,
        roles: m.roles || [],
        group: primaryGroup,
      };
    });

    let monthlyGrowthRate = '+0.0%';
    if (growthTimeline.length >= 2) {
      const lastMonth = growthTimeline[growthTimeline.length - 1];
      const prevMonth = growthTimeline[growthTimeline.length - 2];
      if (prevMonth.cumulative > 0) {
        const rate = ((lastMonth.newJoins / prevMonth.cumulative) * 100).toFixed(1);
        monthlyGrowthRate = `+${rate}%`;
      }
    }

    const avgMonthlyJoins =
      growthTimeline.length > 0
        ? Number((parsedMembers.length / growthTimeline.length).toFixed(1))
        : 0;

    const updatedAt = new Date(now).toISOString();
    const baseHistory =
      stored.lastSnapshot?.guildId === guildId ? storedHistory : [];
    const nextHistory = appendPresenceSample(baseHistory, now, onlineMembers, totalMembers);

    const snapshot: PersistedDiscordAnalytics['lastSnapshot'] = {
      success: true,
      guildId,
      guildName,
      guildIconUrl,
      totalMembers,
      onlineMembers,
      offlineMembers,
      humanMembers: humanMembersList.length,
      botMembers: botMembersList.length,
      joined24h,
      joined7d,
      joined30d,
      monthlyGrowthRate,
      avgMonthlyJoins,
      growthTimeline,
      dailyTimeline,
      recentMembers,
      roleBreakdown,
      updatedAt,
    };

    await writeDoc<PersistedDiscordAnalytics>(STORE_KEY, {
      lastSnapshot: snapshot,
      presenceHistory: nextHistory,
    }).catch((err) => {
      console.warn('Failed to persist Discord analytics snapshot:', err);
    });

    return {
      ...snapshot,
      presenceHistory: nextHistory,
      source: 'live',
      storageBackend: backend,
      isCached: false,
    };
  } catch (error) {
    console.error('Error in getDiscordMembersData:', error);
    if (stored.lastSnapshot && stored.lastSnapshot.guildId === guildId) {
      return {
        ...stored.lastSnapshot,
        presenceHistory: storedHistory,
        source: 'stale',
        storageBackend: backend,
        statusNote: 'discord_fetch_error',
        isCached: true,
      };
    }
    return buildUnavailableResponse(guildId, 'discord_fetch_error');
  }
}
