'use client';

import React, { useMemo, useState, useSyncExternalStore } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart2,
  Calendar,
  Database,
  Radio,
  RefreshCw,
  Search,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { DiscordIcon } from '@/components/icons/DiscordIcon';
import type { DiscordMembersResponse, RecentMemberItem } from '@/lib/discordMembers';
import type { UserGroup } from '@/lib/auth';
import styles from './DiscordAnalytics.module.css';

type GraphMode = 'cumulative' | 'monthly' | 'daily' | 'online';
type RoleFilter = 'all' | UserGroup;

interface PlotPoint {
  index: number;
  label: string;
  key: string;
  primaryValue: number;
  secondaryValue: number;
  x: number;
  y: number;
}

const GROUP_LABEL: Record<UserGroup, string> = {
  support: 'Staff',
  player: 'Player',
  partner: 'Partner',
  user: 'Member',
};

const GROUP_TAG_CLASS: Record<UserGroup, string> = {
  support: styles.tagSupport,
  player: styles.tagPlayer,
  partner: styles.tagPartner,
  user: styles.tagUser,
};

function formatRelativeTime(isoString: string, isMounted: boolean): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  if (!isMounted) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  }
  const diffMs = Math.max(0, Date.now() - date.getTime());
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 2) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatUtcStamp(isoString: string): string {
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  const datePart = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  const timePart = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  });
  return `${datePart} · ${timePart} UTC`;
}

function describeStatusNote(note: string | undefined, guildId: string, isStale?: boolean): string {
  const prefix = isStale ? 'Could not refresh live data — showing last persisted snapshot. ' : '';
  if (!note) return `${prefix}Discord API is currently unreachable.`;
  if (note === 'missing_bot_token') {
    return `${prefix}DISCORD_BOT_TOKEN is not configured in the environment.`;
  }
  if (note === 'discord_members_403' || note === 'discord_members_401' || note === 'discord_api_403' || note === 'discord_api_401') {
    return `${prefix}Discord rejected the bot request (${note.replace('discord_members_', 'HTTP ').replace('discord_api_', 'HTTP ')}). Verify DISCORD_BOT_TOKEN, ensure the bot is in guild ${guildId}, and enable Server Members Intent in the Discord Developer Portal.`;
  }
  return `${prefix}Discord API error (${note}).`;
}

export function DiscordAnalyticsClient({ initialData }: { initialData: DiscordMembersResponse }) {
  const [data, setData] = useState<DiscordMembersResponse>(initialData);
  const [refreshing, setRefreshing] = useState(false);
  const [graphMode, setGraphMode] = useState<GraphMode>('cumulative');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const isMounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  async function handleRefresh() {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const res = await fetch('/api/discord/members?refresh=1', { cache: 'no-store' });
      const next: DiscordMembersResponse = await res.json();
      if (next && typeof next.totalMembers === 'number') {
        setData(next);
      }
    } catch (err) {
      console.error('Failed to refresh Discord telemetry:', err);
    } finally {
      setTimeout(() => setRefreshing(false), 350);
    }
  }

  const onlinePct = data.totalMembers > 0
    ? Math.min(100, Math.round((data.onlineMembers / data.totalMembers) * 1000) / 10)
    : 0;

  // Graph Geometry
  const chartW = 720;
  const chartH = 290;
  const padL = 44;
  const padR = 20;
  const padT = 22;
  const padB = 34;
  const innerW = chartW - padL - padR;
  const innerH = chartH - padT - padB;

  const series = useMemo(() => {
    if (graphMode === 'online') {
      return data.presenceHistory.map((p) => ({
        key: p.timestamp,
        label: p.label,
        primaryValue: p.onlineMembers,
        secondaryValue: p.totalMembers,
      }));
    }
    if (graphMode === 'daily') {
      return data.dailyTimeline.map((d) => ({
        key: d.dateKey,
        label: d.label,
        primaryValue: d.newJoins,
        secondaryValue: d.cumulative,
      }));
    }
    return data.growthTimeline.map((m) => ({
      key: m.monthKey,
      label: m.label,
      primaryValue: graphMode === 'monthly' ? m.newJoins : m.cumulative,
      secondaryValue: graphMode === 'monthly' ? m.cumulative : m.newJoins,
    }));
  }, [data.dailyTimeline, data.growthTimeline, data.presenceHistory, graphMode]);

  const maxVal = useMemo(() => {
    if (series.length === 0) return 10;
    const rawMax = Math.max(...series.map((s) => s.primaryValue), 1);
    if (graphMode === 'cumulative' || graphMode === 'online') {
      return Math.ceil(rawMax / 25) * 25;
    }
    if (rawMax <= 10) return Math.max(5, Math.ceil(rawMax / 2) * 2);
    return Math.ceil(rawMax / 10) * 10;
  }, [series, graphMode]);

  const points: PlotPoint[] = useMemo(() => {
    if (series.length === 0) return [];
    const denom = Math.max(1, series.length - 1);
    return series.map((item, idx) => {
      const x = series.length === 1
        ? padL + innerW / 2
        : padL + (idx / denom) * innerW;
      const y = padT + innerH - (item.primaryValue / maxVal) * innerH;
      return {
        index: idx,
        label: item.label,
        key: item.key,
        primaryValue: item.primaryValue,
        secondaryValue: item.secondaryValue,
        x,
        y,
      };
    });
  }, [series, maxVal, innerW, innerH]);

  const linePath = useMemo(() => {
    if (points.length < 2) return '';
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  }, [points]);

  const areaPath = useMemo(() => {
    if (points.length < 2) return '';
    const bottom = padT + innerH;
    return `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${bottom} L ${points[0].x.toFixed(1)} ${bottom} Z`;
  }, [linePath, points, innerH]);

  const activePoint =
    hoveredIdx !== null && points[hoveredIdx]
      ? points[hoveredIdx]
      : points[points.length - 1] ?? null;

  const peakMonth = useMemo(() => {
    if (data.growthTimeline.length === 0) return null;
    return data.growthTimeline.reduce((best, cur) => (cur.newJoins > best.newJoins ? cur : best));
  }, [data.growthTimeline]);

  const latestMonth = data.growthTimeline[data.growthTimeline.length - 1] ?? null;

  const groupCounts = useMemo(() => {
    const counts: Record<RoleFilter, number> = {
      all: data.recentMembers.length,
      support: 0,
      player: 0,
      partner: 0,
      user: 0,
    };
    for (const m of data.recentMembers) {
      counts[m.group]++;
    }
    return counts;
  }, [data.recentMembers]);

  const filteredMembers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return data.recentMembers.filter((m) => {
      if (roleFilter !== 'all' && m.group !== roleFilter) return false;
      if (!q) return true;
      return (
        m.displayName.toLowerCase().includes(q) ||
        m.username.toLowerCase().includes(q)
      );
    });
  }, [data.recentMembers, roleFilter, searchQuery]);

  const roleSegments = useMemo(() => {
    const rb = data.roleBreakdown;
    const sum = Math.max(1, rb.support + rb.player + rb.partner + rb.community + rb.bots);
    return [
      { key: 'support', label: 'Staff / Support', count: rb.support, pct: (rb.support / sum) * 100, color: '#FF5900' },
      { key: 'player', label: 'Esports Players', count: rb.player, pct: (rb.player / sum) * 100, color: '#38BDF8' },
      { key: 'partner', label: 'Partners', count: rb.partner, pct: (rb.partner / sum) * 100, color: '#FACC15' },
      { key: 'community', label: 'Community Members', count: rb.community, pct: (rb.community / sum) * 100, color: '#5865F2' },
      { key: 'bots', label: 'Bots & Services', count: rb.bots, pct: (rb.bots / sum) * 100, color: '#525866' },
    ];
  }, [data.roleBreakdown]);

  const sourceBadgeClass =
    data.source === 'live'
      ? styles.sourceLive
      : data.source === 'cache'
      ? styles.sourceCache
      : data.source === 'stale'
      ? styles.sourceFallback
      : styles.sourceError;

  const sourceLabel =
    data.source === 'live'
      ? 'Live Discord API'
      : data.source === 'cache'
      ? 'Persisted · 60s Cache'
      : data.source === 'stale'
      ? 'Stale Snapshot'
      : 'Disconnected';

  const barWidth = points.length > 0 ? Math.max(6, Math.min(34, (innerW / points.length) * 0.62)) : 12;
  const strokeAccent = graphMode === 'daily' || graphMode === 'online' ? '#10B981' : '#FF5900';

  const primaryReadoutLabel =
    graphMode === 'online'
      ? 'ONLINE'
      : graphMode === 'cumulative'
      ? 'TOTAL'
      : 'NEW JOINS';

  const secondaryReadoutLabel =
    graphMode === 'online'
      ? 'ALL USERS'
      : graphMode === 'cumulative'
      ? 'NEW JOINS'
      : 'CUMULATIVE';

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.backdrop} aria-hidden="true" />

      <main className={styles.main}>
        <div className={styles.shell}>
          {/* Top Telemetry Strip */}
          <div className={styles.topBar}>
            <div className={styles.topBarGroup}>
              <span className={`${styles.sourceBadge} ${sourceBadgeClass}`}>
                <span className={styles.pulseDot} />
                {sourceLabel}
              </span>
              <span className={styles.monoMeta}>
                GUILD ID <strong>{data.guildId}</strong>
              </span>
              <span className={styles.monoMeta}>
                UPDATED <strong>{formatUtcStamp(data.updatedAt)}</strong>
              </span>
              <span className={styles.monoMeta} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Database size={12} color={data.storageBackend === 'redis' ? '#10B981' : '#9398a4'} />
                STORE <strong>{data.storageBackend === 'redis' ? 'UPSTASH REDIS' : 'LOCAL JSON'}</strong>
              </span>
            </div>

            {data.success && (
              <span className={styles.monoMeta}>
                HUMANS <strong>{data.humanMembers}</strong> · BOTS <strong>{data.botMembers}</strong>
              </span>
            )}
          </div>

          {data.source === 'stale' && (
            <div className={styles.diagBanner} role="status">
              <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Stale Snapshot:</strong> {describeStatusNote(data.statusNote, data.guildId, true)}
              </div>
            </div>
          )}

          {!data.success ? (
            <section className={`${styles.frame} ${styles.frameCorner} ${styles.errorState}`}>
              <div className={styles.eyebrow}>
                <AlertTriangle size={15} />
                Discord Telemetry Unavailable
              </div>
              <h1 className={styles.heroTitle} style={{ marginTop: '10px' }}>
                Waiting for Live <span className={styles.heroTitleAccent}>Discord Connection</span>
              </h1>
              <p className={styles.heroLead} style={{ marginTop: '12px' }}>
                {describeStatusNote(data.statusNote, data.guildId, false)}
              </p>
              <div className={styles.heroActions} style={{ marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className={styles.btnPrimary}
                >
                  <RefreshCw size={14} className={refreshing ? styles.spin : undefined} />
                  {refreshing ? 'Retrying…' : 'Retry Discord Sync'}
                </button>
              </div>
            </section>
          ) : (
            <>
              {/* Asymmetric Hero Telemetry Split */}
              <section className={styles.heroGrid} aria-label="Discord server presence summary">
                <div className={`${styles.frame} ${styles.frameCorner} ${styles.heroIdentity}`}>
                  <div>
                    <div className={styles.guildHeader}>
                      <img
                        src={data.guildIconUrl || '/images/logo.png'}
                        alt={data.guildName}
                        className={styles.guildAvatar}
                      />
                      <div>
                        <span className={styles.eyebrow}>
                          <DiscordIcon size={14} color="#FF5900" />
                          Community Telemetry
                        </span>
                        <div className={styles.guildName}>{data.guildName}</div>
                      </div>
                    </div>

                    <h1 className={styles.heroTitle} style={{ marginTop: '18px' }}>
                      Discord <span className={styles.heroTitleAccent}>Analytics</span>
                    </h1>
                    <p className={styles.heroLead} style={{ marginTop: '10px' }}>
                      Live presence counts, total Discord server membership, persisted join history, and the latest community arrivals.
                    </p>
                  </div>

                  <div className={styles.heroActions}>
                    <a
                      href="https://discord.gg/UdnGPHmvcT"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.btnPrimary}
                    >
                      <DiscordIcon size={16} color="#FFFFFF" />
                      Join Discord Server
                      <ArrowUpRight size={15} />
                    </a>

                    <button
                      type="button"
                      onClick={handleRefresh}
                      disabled={refreshing}
                      className={styles.btnGhost}
                    >
                      <RefreshCw size={14} className={refreshing ? styles.spin : undefined} />
                      {refreshing ? 'Syncing Live…' : 'Sync Live Data'}
                    </button>
                  </div>
                </div>

                {/* Right Presence Panel */}
                <div className={`${styles.frame} ${styles.presencePanel}`}>
                  <div className={styles.presenceCounters}>
                    <div className={`${styles.counterCard} ${styles.counterOnline}`}>
                      <div className={styles.counterLabel}>
                        <span className={styles.pulseDot} style={{ color: '#10B981' }} />
                        Online Now
                      </div>
                      <div className={styles.counterValue}>{data.onlineMembers.toLocaleString()}</div>
                      <div className={styles.counterSub}>{onlinePct}% of guild active</div>
                    </div>

                    <div className={`${styles.counterCard} ${styles.counterTotal}`}>
                      <div className={styles.counterLabel}>
                        <Users size={13} color="#818CF8" />
                        All Users
                      </div>
                      <div className={styles.counterValue}>{data.totalMembers.toLocaleString()}</div>
                      <div className={styles.counterSub}>
                        {data.offlineMembers.toLocaleString()} offline · {data.botMembers} bots
                      </div>
                    </div>
                  </div>

                  <div className={styles.ratioBlock}>
                    <div className={styles.ratioMeta}>
                      <span>LIVE PRESENCE RATIO</span>
                      <strong>
                        {data.onlineMembers} / {data.totalMembers} ({onlinePct}%)
                      </strong>
                    </div>
                    <div className={styles.ratioTrack} aria-hidden="true">
                      <div className={styles.ratioFillOnline} style={{ width: `${onlinePct}%` }} />
                    </div>
                  </div>

                  <div className={styles.velocityRow}>
                    <div className={styles.velocityCell}>
                      <span>Last 24h</span>
                      <strong>+{data.joined24h}</strong>
                    </div>
                    <div className={styles.velocityCell}>
                      <span>Last 7d</span>
                      <strong>+{data.joined7d}</strong>
                    </div>
                    <div className={styles.velocityCell}>
                      <span>Last 30d</span>
                      <strong>+{data.joined30d}</strong>
                    </div>
                  </div>
                </div>
              </section>

              {/* Main Asymmetric Grid: 7 cols Graph + 5 cols Latest Joined Members */}
              <section className={styles.analyticsGrid} aria-label="Growth graph and recent joins">
                {/* Interactive Graph Panel */}
                <div className={`${styles.frame} ${styles.frameCorner}`}>
                  <div className={styles.panelHead}>
                    <div>
                      <h2 className={styles.panelTitle}>Member Growth &amp; Presence Graph</h2>
                      <p className={styles.panelSub}>
                        Hover or tap points to inspect server growth, daily joins, or recorded online counts.
                      </p>
                    </div>

                    <div className={styles.modeTabs} role="tablist" aria-label="Graph view mode">
                      <button
                        type="button"
                        role="tab"
                        aria-selected={graphMode === 'cumulative'}
                        className={`${styles.modeTab} ${graphMode === 'cumulative' ? styles.modeTabActive : ''}`}
                        onClick={() => {
                          setGraphMode('cumulative');
                          setHoveredIdx(null);
                        }}
                      >
                        <TrendingUp size={13} />
                        Cumulative
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={graphMode === 'monthly'}
                        className={`${styles.modeTab} ${graphMode === 'monthly' ? styles.modeTabActive : ''}`}
                        onClick={() => {
                          setGraphMode('monthly');
                          setHoveredIdx(null);
                        }}
                      >
                        <BarChart2 size={13} />
                        Monthly
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={graphMode === 'daily'}
                        className={`${styles.modeTab} ${graphMode === 'daily' ? styles.modeTabActive : ''}`}
                        onClick={() => {
                          setGraphMode('daily');
                          setHoveredIdx(null);
                        }}
                      >
                        <Calendar size={13} />
                        30 Days
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={graphMode === 'online'}
                        className={`${styles.modeTab} ${graphMode === 'online' ? styles.modeTabActive : ''}`}
                        onClick={() => {
                          setGraphMode('online');
                          setHoveredIdx(null);
                        }}
                      >
                        <Radio size={13} />
                        Online ({data.presenceHistory.length})
                      </button>
                    </div>
                  </div>

                  {/* Active Point Telemetry Bar */}
                  {activePoint && (
                    <div className={styles.readoutStrip}>
                      <div>
                        <span style={{ color: 'var(--d-text-dim)' }}>SELECTED </span>
                        <strong style={{ color: '#fff' }}>{activePoint.label}</strong>
                      </div>
                      <div className={styles.readoutStats}>
                        <span>
                          {primaryReadoutLabel}{' '}
                          <strong style={{ color: strokeAccent }}>
                            {graphMode === 'monthly' || graphMode === 'daily' ? `+${activePoint.primaryValue}` : activePoint.primaryValue}
                          </strong>
                        </span>
                        <span>
                          {secondaryReadoutLabel}{' '}
                          <strong style={{ color: '#fff' }}>
                            {graphMode === 'cumulative' ? `+${activePoint.secondaryValue}` : activePoint.secondaryValue}
                          </strong>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* SVG Chart */}
                  <div className={styles.chartWrap}>
                    {points.length === 0 ? (
                      <div
                        style={{
                          height: '100%',
                          display: 'grid',
                          placeItems: 'center',
                          color: 'var(--d-text-muted)',
                          fontFamily: 'var(--font-discord-mono), monospace',
                          fontSize: '0.8rem',
                        }}
                      >
                        No data points recorded for this view yet.
                      </div>
                    ) : (
                      <>
                        <svg
                          width="100%"
                          height="100%"
                          viewBox={`0 0 ${chartW} ${chartH}`}
                          preserveAspectRatio="none"
                          style={{ overflow: 'visible' }}
                          aria-label="Discord analytics graph"
                        >
                          <defs>
                            <linearGradient id="discordAreaOrange" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#FF5900" stopOpacity="0.32" />
                              <stop offset="70%" stopColor="#FF5900" stopOpacity="0.06" />
                              <stop offset="100%" stopColor="#FF5900" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="discordAreaEmerald" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10B981" stopOpacity="0.32" />
                              <stop offset="70%" stopColor="#10B981" stopOpacity="0.06" />
                              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                            </linearGradient>
                          </defs>

                          {/* Horizontal Grid & Y Ticks */}
                          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                            const y = padT + innerH * (1 - ratio);
                            const tickVal = Math.round(ratio * maxVal);
                            return (
                              <g key={ratio}>
                                <line
                                  x1={padL}
                                  y1={y}
                                  x2={chartW - padR}
                                  y2={y}
                                  stroke="rgba(255,255,255,0.06)"
                                  strokeDasharray={ratio === 0 ? undefined : '3 4'}
                                />
                                <text
                                  x={padL - 10}
                                  y={y + 3.5}
                                  fill="#5d6370"
                                  fontSize="10"
                                  fontFamily="var(--font-discord-mono), monospace"
                                  textAnchor="end"
                                >
                                  {tickVal}
                                </text>
                              </g>
                            );
                          })}

                          {/* Active Crosshair */}
                          {activePoint && (
                            <line
                              x1={activePoint.x}
                              y1={padT}
                              x2={activePoint.x}
                              y2={padT + innerH}
                              stroke="rgba(255,255,255,0.16)"
                              strokeDasharray="3 3"
                            />
                          )}

                          {graphMode === 'cumulative' || graphMode === 'online' ? (
                            <>
                              {areaPath && (
                                <path
                                  d={areaPath}
                                  fill={graphMode === 'online' ? 'url(#discordAreaEmerald)' : 'url(#discordAreaOrange)'}
                                />
                              )}
                              {linePath && (
                                <path
                                  d={linePath}
                                  fill="none"
                                  stroke={strokeAccent}
                                  strokeWidth="2.8"
                                  strokeLinejoin="round"
                                  strokeLinecap="round"
                                />
                              )}
                            </>
                          ) : (
                            <>
                              {areaPath && (
                                <path
                                  d={areaPath}
                                  fill={graphMode === 'daily' ? 'url(#discordAreaEmerald)' : 'url(#discordAreaOrange)'}
                                />
                              )}
                              {points.map((pt) => {
                                const barHeight = Math.max(2, padT + innerH - pt.y);
                                const isActive = activePoint?.index === pt.index;
                                return (
                                  <rect
                                    key={pt.key}
                                    x={pt.x - barWidth / 2}
                                    y={pt.y}
                                    width={barWidth}
                                    height={barHeight}
                                    fill={strokeAccent}
                                    fillOpacity={isActive ? 0.95 : 0.45}
                                    stroke={isActive ? '#FFFFFF' : 'none'}
                                    strokeWidth={isActive ? 1 : 0}
                                  />
                                );
                              })}
                              {linePath && (
                                <path
                                  d={linePath}
                                  fill="none"
                                  stroke={strokeAccent}
                                  strokeWidth="2"
                                  strokeOpacity="0.9"
                                />
                              )}
                            </>
                          )}

                          {/* Data Nodes + Hit Targets + X Labels */}
                          {points.map((pt) => {
                            const isActive = activePoint?.index === pt.index;
                            const labelStep = points.length > 16 ? 5 : points.length > 8 ? 2 : 1;
                            const showLabel =
                              pt.index === 0 ||
                              pt.index === points.length - 1 ||
                              pt.index % labelStep === 0;

                            return (
                              <g
                                key={pt.key}
                                onMouseEnter={() => setHoveredIdx(pt.index)}
                                onMouseLeave={() => setHoveredIdx(null)}
                                onClick={() => setHoveredIdx(pt.index)}
                                style={{ cursor: 'pointer' }}
                              >
                                <rect
                                  x={pt.x - Math.max(12, innerW / Math.max(1, points.length) / 2)}
                                  y={padT}
                                  width={Math.max(24, innerW / Math.max(1, points.length))}
                                  height={innerH + 16}
                                  fill="transparent"
                                />
                                {isActive && (
                                  <circle
                                    cx={pt.x}
                                    cy={pt.y}
                                    r="9"
                                    fill={strokeAccent}
                                    fillOpacity="0.24"
                                  />
                                )}
                                {(graphMode === 'cumulative' || graphMode === 'online' || isActive || pt.primaryValue > 0) && (
                                  <circle
                                    cx={pt.x}
                                    cy={pt.y}
                                    r={isActive ? '4.8' : graphMode === 'daily' ? '2.4' : '3.6'}
                                    fill={isActive ? '#FFFFFF' : strokeAccent}
                                    stroke={isActive ? strokeAccent : '#08090c'}
                                    strokeWidth="1.8"
                                  />
                                )}
                                {showLabel && (
                                  <text
                                    x={pt.x}
                                    y={chartH - 8}
                                    fill={isActive ? '#FFFFFF' : '#6f7685'}
                                    fontSize="9.5"
                                    fontWeight={isActive ? '700' : '500'}
                                    fontFamily="var(--font-discord-mono), monospace"
                                    textAnchor="middle"
                                  >
                                    {pt.label}
                                  </text>
                                )}
                              </g>
                            );
                          })}
                        </svg>

                        {/* Hover Tooltip */}
                        {hoveredIdx !== null && activePoint && (
                          <div
                            className={styles.tooltip}
                            style={{
                              top: `${Math.max(6, Math.min(activePoint.y - 54, chartH - 88))}px`,
                              left: `clamp(8px, calc(${(activePoint.x / chartW) * 100}% - 74px), calc(100% - 160px))`,
                            }}
                          >
                            <div style={{ color: 'var(--d-text-muted)', marginBottom: '4px' }}>
                              {activePoint.label}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                              <span style={{ color: 'var(--d-text-dim)' }}>{primaryReadoutLabel}</span>
                              <strong style={{ color: strokeAccent }}>
                                {graphMode === 'monthly' || graphMode === 'daily' ? `+${activePoint.primaryValue}` : activePoint.primaryValue}
                              </strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '2px' }}>
                              <span style={{ color: 'var(--d-text-dim)' }}>{secondaryReadoutLabel}</span>
                              <strong style={{ color: '#fff' }}>
                                {graphMode === 'cumulative' ? `+${activePoint.secondaryValue}` : activePoint.secondaryValue}
                              </strong>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Graph Summary Footer */}
                  <div className={styles.chartSummary}>
                    <div className={styles.summaryBox}>
                      <span>Peak Month</span>
                      <strong>
                        {peakMonth ? `${peakMonth.label} (+${peakMonth.newJoins})` : '—'}
                      </strong>
                    </div>
                    <div className={styles.summaryBox}>
                      <span>Monthly Avg</span>
                      <strong>~{data.avgMonthlyJoins} / mo</strong>
                    </div>
                    <div className={styles.summaryBox}>
                      <span>Latest Month</span>
                      <strong style={{ color: '#38BDF8' }}>
                        {latestMonth ? `+${latestMonth.newJoins} (${latestMonth.label})` : '—'}
                      </strong>
                    </div>
                    <div className={styles.summaryBox}>
                      <span>Monthly Growth</span>
                      <strong style={{ color: '#10B981' }}>{data.monthlyGrowthRate}</strong>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Last Joined Members */}
                <div className={styles.frame}>
                  <div className={styles.panelHead}>
                    <div>
                      <h2 className={styles.panelTitle}>Last Joined Members</h2>
                      <p className={styles.panelSub}>
                        Most recent {data.recentMembers.length} human arrivals sorted newest first.
                      </p>
                    </div>
                    <span
                      className={styles.monoMeta}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    >
                      <Activity size={13} color="#10B981" />
                      {filteredMembers.length} shown
                    </span>
                  </div>

                  <div className={styles.memberControls}>
                    <div className={styles.searchBox}>
                      <Search size={14} color="#5d6370" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Filter by display name or @username…"
                        aria-label="Filter recently joined members"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          aria-label="Clear search"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#9398a4',
                            cursor: 'pointer',
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    <div className={styles.filterRow} role="group" aria-label="Filter by Discord role group">
                      {(
                        [
                          ['all', `All (${groupCounts.all})`],
                          ['support', `Staff (${groupCounts.support})`],
                          ['player', `Players (${groupCounts.player})`],
                          ['partner', `Partners (${groupCounts.partner})`],
                          ['user', `Members (${groupCounts.user})`],
                        ] as [RoleFilter, string][]
                      ).map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setRoleFilter(key)}
                          className={`${styles.filterPill} ${roleFilter === key ? styles.filterPillActive : ''}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.memberList}>
                    {filteredMembers.length === 0 ? (
                      <div
                        style={{
                          padding: '36px 12px',
                          textAlign: 'center',
                          color: 'var(--d-text-muted)',
                          fontSize: '0.84rem',
                        }}
                      >
                        No recently joined members match your filter.
                      </div>
                    ) : (
                      filteredMembers.map((member: RecentMemberItem, idx: number) => {
                        const isLatest = idx === 0 && roleFilter === 'all' && !searchQuery.trim();
                        return (
                          <div
                            key={member.id}
                            className={`${styles.memberRow} ${isLatest ? styles.memberRowLatest : ''}`}
                          >
                            <div className={styles.memberLeft}>
                              <img
                                src={member.avatarUrl}
                                alt={member.displayName}
                                className={styles.memberAvatar}
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = '/images/logo.png';
                                }}
                              />
                              <div className={styles.memberIdentity}>
                                <div className={styles.memberNameLine}>
                                  <span className={styles.memberName}>{member.displayName}</span>
                                  {isLatest && (
                                    <span className={`${styles.tag} ${styles.tagLatest}`}>Latest</span>
                                  )}
                                  <span className={`${styles.tag} ${GROUP_TAG_CLASS[member.group]}`}>
                                    {GROUP_LABEL[member.group]}
                                  </span>
                                </div>
                                <div className={styles.memberHandle}>@{member.username}</div>
                              </div>
                            </div>

                            <div className={styles.memberTime}>
                              <span className={styles.memberRelative}>
                                {formatRelativeTime(member.joinedAt, isMounted)}
                              </span>
                              <span className={styles.memberExact}>{formatUtcStamp(member.joinedAt)}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </section>

              {/* Bottom Composition Strip */}
              <section
                className={`${styles.frame} ${styles.compositionPanel}`}
                aria-label="Discord server role distribution"
              >
                <div className={styles.panelHead} style={{ marginBottom: '12px' }}>
                  <div>
                    <h2 className={styles.panelTitle}>Server Composition</h2>
                    <p className={styles.panelSub}>
                      Breakdown across FAZIX Discord roles ({data.humanMembers} human accounts, {data.botMembers} bots).
                    </p>
                  </div>
                </div>

                <div className={styles.stackedTrack} aria-hidden="true">
                  {roleSegments.map((seg) => (
                    <div
                      key={seg.key}
                      style={{
                        width: `${Math.max(seg.count > 0 ? 1.5 : 0, seg.pct)}%`,
                        backgroundColor: seg.color,
                        height: '100%',
                      }}
                    />
                  ))}
                </div>

                <div className={styles.roleLegend}>
                  {roleSegments.map((seg) => (
                    <div key={seg.key} className={styles.roleCard}>
                      <div className={styles.roleHead}>
                        <span className={styles.roleSwatch} style={{ backgroundColor: seg.color }} />
                        <span>{seg.label}</span>
                      </div>
                      <div className={styles.roleCount}>{seg.count}</div>
                      <div className={styles.rolePct}>{seg.pct.toFixed(1)}% of roster</div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
