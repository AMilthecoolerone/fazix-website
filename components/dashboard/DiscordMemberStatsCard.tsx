'use client';

import React, { useState, useEffect, useMemo, useSyncExternalStore } from 'react';
import {
  Users,
  TrendingUp,
  UserPlus,
  RefreshCw,
  Search,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { DiscordIcon } from '@/components/icons/DiscordIcon';

interface MemberJoinStat {
  monthKey: string;
  label: string;
  newJoins: number;
  cumulative: number;
}

interface RecentMemberItem {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  joinedAt: string;
  roles: string[];
}

interface DiscordMembersData {
  success: boolean;
  source?: string;
  statusNote?: string;
  guildId?: string;
  totalMembers: number;
  onlineMembers: number;
  guildName: string;
  guildIconUrl: string | null;
  growthTimeline: MemberJoinStat[];
  recentMembers: RecentMemberItem[];
  monthlyGrowthRate: string;
  avgMonthlyJoins?: number;
  updatedAt: string;
}

interface DiscordMemberStatsCardProps {
  colors: {
    cardBg: string;
    cardBorder: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    badgeMutedBg: string;
    inputBg: string;
    inputBorder: string;
    itemHoverBg: string;
  };
}

const EMPTY_DATA: DiscordMembersData = {
  success: false,
  totalMembers: 0,
  onlineMembers: 0,
  guildName: 'Discord Server',
  guildIconUrl: '/images/logo.png',
  monthlyGrowthRate: '0.0%',
  avgMonthlyJoins: 0,
  updatedAt: '',
  growthTimeline: [],
  recentMembers: [],
};

export function DiscordMemberStatsCard({ colors }: DiscordMemberStatsCardProps) {
  const [data, setData] = useState<DiscordMembersData>(EMPTY_DATA);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'cumulative' | 'monthly' | 'members'>('cumulative');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const isMounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  const fetchStats = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      const res = await fetch(isManualRefresh ? '/api/discord/members?refresh=1' : '/api/discord/members');
      const json: DiscordMembersData = await res.json();
      if (json && typeof json.totalMembers === 'number') {
        setData(json);
      }
    } catch (err) {
      console.error('Failed to fetch Discord member stats:', err);
    } finally {
      setLoading(false);
      if (isManualRefresh) {
        setTimeout(() => setRefreshing(false), 450);
      }
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Format relative join date/time
  const formatJoinedDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      if (!isMounted) {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
      }
      const diffMs = Math.max(0, Date.now() - date.getTime());
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffHours < 1) return 'Just now';
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  const timeline = data.growthTimeline;
  const totalMembers = data.totalMembers;
  const onlineMembers = data.onlineMembers;
  const growthRate = data.monthlyGrowthRate;
  const recentMembers = data.recentMembers;
  const avgMonthly =
    typeof data.avgMonthlyJoins === 'number'
      ? data.avgMonthlyJoins
      : timeline.length > 0
      ? Number((timeline.reduce((s, t) => s + t.newJoins, 0) / timeline.length).toFixed(1))
      : 0;

  // Filtered members for "Who Joined When" view
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return recentMembers;
    const q = searchQuery.toLowerCase();
    return recentMembers.filter(
      (m) =>
        m.displayName.toLowerCase().includes(q) ||
        m.username.toLowerCase().includes(q)
    );
  }, [recentMembers, searchQuery]);

  // SVG Chart Dimensions & Calculations
  const chartWidth = 440;
  const chartHeight = 150;
  const paddingLeft = 36;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 26;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  // Max value based on viewMode
  const maxValue = useMemo(() => {
    if (!timeline.length) return 200;
    if (viewMode === 'monthly') {
      const maxMonthly = Math.max(...timeline.map((t) => t.newJoins), 10);
      return Math.ceil(maxMonthly / 10) * 10;
    }
    const maxCum = Math.max(...timeline.map((t) => t.cumulative), 100);
    return Math.ceil(maxCum / 50) * 50;
  }, [timeline, viewMode]);

  // Compute SVG Points
  const chartPoints = useMemo(() => {
    if (!timeline.length) return [];
    return timeline.map((item, index) => {
      const val = viewMode === 'monthly' ? item.newJoins : item.cumulative;
      const x = paddingLeft + (index / (timeline.length - 1)) * innerWidth;
      const y = paddingTop + innerHeight - (val / maxValue) * innerHeight;
      return { x, y, val, item, index };
    });
  }, [timeline, viewMode, maxValue, innerWidth, innerHeight]);

  // Smooth SVG path
  const svgPathD = useMemo(() => {
    if (chartPoints.length < 2) return '';
    return chartPoints.reduce((acc, curr, idx) => {
      if (idx === 0) return `M ${curr.x} ${curr.y}`;
      // Linear segment for precision linear representation
      return `${acc} L ${curr.x} ${curr.y}`;
    }, '');
  }, [chartPoints]);

  // Area under path
  const svgAreaD = useMemo(() => {
    if (chartPoints.length < 2) return '';
    const first = chartPoints[0];
    const last = chartPoints[chartPoints.length - 1];
    const bottomY = paddingTop + innerHeight;
    return `${svgPathD} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`;
  }, [svgPathD, chartPoints, paddingTop, innerHeight]);

  // Active highlighted point (either hovered or the last point by default)
  const activePoint = hoveredPointIndex !== null && chartPoints[hoveredPointIndex]
    ? chartPoints[hoveredPointIndex]
    : chartPoints[chartPoints.length - 1] || null;

  return (
    <div
      style={{
        backgroundColor: colors.cardBg,
        border: `1px solid ${colors.cardBorder}`,
        borderRadius: '16px',
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        minHeight: '380px',
      }}
    >
      {/* Top Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              backgroundColor: 'rgba(88, 101, 242, 0.14)',
              border: '1px solid rgba(88, 101, 242, 0.28)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DiscordIcon size={16} color="#5865F2" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: colors.textPrimary, letterSpacing: '-0.01em' }}>
                Discord Server Members
              </span>
              <span
                style={{
                  fontSize: '0.66rem',
                  fontWeight: 700,
                  backgroundColor: 'rgba(88, 101, 242, 0.16)',
                  color: '#818CF8',
                  padding: '2px 7px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(88, 101, 242, 0.3)',
                }}
              >
                {data.guildName || 'Discord Server'}
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', color: colors.textMuted, display: 'block', marginTop: '1px' }}>
              {loading ? 'Connecting to Discord...' : data.success ? 'Live server roster & join analytics' : `Unavailable (${data.statusNote || 'check bot config'})`}
            </span>
          </div>
        </div>

        {/* Header Right: Online Pulse & Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              color: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.28)',
              padding: '3px 8px',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 8px #10B981',
              }}
            />
            {onlineMembers} Online
          </span>

          <button
            type="button"
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            title="Refresh member statistics live from Discord"
            style={{
              padding: '4px 8px',
              borderRadius: '8px',
              backgroundColor: colors.badgeMutedBg,
              border: `1px solid ${colors.cardBorder}`,
              color: colors.textSecondary,
              fontSize: '0.72rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              cursor: refreshing ? 'wait' : 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <RefreshCw
              size={12}
              color="#8E8E9A"
              style={{
                animation: refreshing ? 'spin 0.75s linear infinite' : 'none',
              }}
            />
            <span>{refreshing ? 'Syncing...' : 'Sync'}</span>
          </button>
        </div>
      </div>

      {/* Key Numbers Row (3 Highlight Stats) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.25fr 1fr 1fr',
          gap: '10px',
          padding: '12px 14px',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: `1px solid ${colors.cardBorder}`,
          borderRadius: '12px',
          marginBottom: '14px',
        }}
      >
        <div>
          <span style={{ fontSize: '0.68rem', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, display: 'block' }}>
            Total Members
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
            <span style={{ fontSize: '1.65rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1 }}>
              {totalMembers}
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <TrendingUp size={11} />
              {growthRate}
            </span>
          </div>
          <span style={{ fontSize: '0.68rem', color: colors.textSecondary, marginTop: '3px', display: 'block' }}>
            Active Discord guild
          </span>
        </div>

        <div>
          <span style={{ fontSize: '0.68rem', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, display: 'block' }}>
            Latest Month
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
            <span style={{ fontSize: '1.65rem', fontWeight: 900, color: '#38BDF8', letterSpacing: '-0.02em', lineHeight: 1 }}>
              +{timeline[timeline.length - 1]?.newJoins ?? 0}
            </span>
            <span style={{ fontSize: '0.68rem', color: colors.textSecondary }}>joins</span>
          </div>
          <span style={{ fontSize: '0.68rem', color: colors.textSecondary, marginTop: '3px', display: 'block' }}>
            {timeline[timeline.length - 1]?.label || 'Current pace'}
          </span>
        </div>

        <div>
          <span style={{ fontSize: '0.68rem', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, display: 'block' }}>
            Avg Growth
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
            <span style={{ fontSize: '1.65rem', fontWeight: 900, color: '#A78BFA', letterSpacing: '-0.02em', lineHeight: 1 }}>
              ~{avgMonthly}
            </span>
            <span style={{ fontSize: '0.68rem', color: colors.textSecondary }}>/mo</span>
          </div>
          <span style={{ fontSize: '0.68rem', color: colors.textSecondary, marginTop: '3px', display: 'block' }}>
            Monthly average
          </span>
        </div>
      </div>

      {/* View Toggle Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '10px',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            padding: '3px',
            borderRadius: '8px',
            border: `1px solid ${colors.cardBorder}`,
            gap: '2px',
          }}
        >
          <button
            type="button"
            onClick={() => setViewMode('cumulative')}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: viewMode === 'cumulative' ? '#5865F2' : 'transparent',
              color: viewMode === 'cumulative' ? '#FFFFFF' : colors.textSecondary,
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.15s ease',
            }}
          >
            <TrendingUp size={12} />
            <span>Linear Growth</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('monthly')}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: viewMode === 'monthly' ? '#5865F2' : 'transparent',
              color: viewMode === 'monthly' ? '#FFFFFF' : colors.textSecondary,
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.15s ease',
            }}
          >
            <UserPlus size={12} />
            <span>Monthly Joins</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('members')}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: viewMode === 'members' ? '#5865F2' : 'transparent',
              color: viewMode === 'members' ? '#FFFFFF' : colors.textSecondary,
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.15s ease',
            }}
          >
            <Users size={12} />
            <span>Who Joined When ({recentMembers.length})</span>
          </button>
        </div>

        {viewMode !== 'members' && activePoint && (
          <div style={{ fontSize: '0.7rem', color: colors.textSecondary, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: colors.textMuted }}>Highlight:</span>
            <strong style={{ color: '#FFFFFF' }}>{activePoint.item.label}</strong>
            <span style={{ color: '#5865F2', fontWeight: 700 }}>
              {viewMode === 'monthly' ? `+${activePoint.item.newJoins} joined` : `${activePoint.item.cumulative} members`}
            </span>
          </div>
        )}
      </div>

      {/* Main Content Area: Chart vs Member List */}
      {viewMode !== 'members' ? (
        <div style={{ position: 'relative', width: '100%', height: `${chartHeight}px`, marginTop: '2px' }}>
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="memberGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5865F2" stopOpacity="0.32" />
                <stop offset="65%" stopColor="#5865F2" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#5865F2" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="lineStrokeGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="60%" stopColor="#5865F2" />
                <stop offset="100%" stopColor="#818CF8" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 0.33, 0.66, 1].map((ratio) => {
              const y = paddingTop + innerHeight * (1 - ratio);
              const gridVal = Math.round(ratio * maxValue);
              return (
                <g key={ratio}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={chartWidth - paddingRight}
                    y2={y}
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={paddingLeft - 8}
                    y={y + 3.5}
                    fill="#5E5E6C"
                    fontSize="9"
                    fontWeight="600"
                    textAnchor="end"
                  >
                    {gridVal}
                  </text>
                </g>
              );
            })}

            {/* Area Fill */}
            {svgAreaD && <path d={svgAreaD} fill="url(#memberGrowthGrad)" />}

            {/* Linear Trendline */}
            {svgPathD && (
              <path
                d={svgPathD}
                fill="none"
                stroke="url(#lineStrokeGrad)"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Interactive Data Points along the line */}
            {chartPoints.map((pt) => {
              const isHovered = hoveredPointIndex === pt.index;
              const isLatest = pt.index === chartPoints.length - 1;

              return (
                <g
                  key={pt.index}
                  onMouseEnter={() => setHoveredPointIndex(pt.index)}
                  onMouseLeave={() => setHoveredPointIndex(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Invisible hit target for smooth hovering */}
                  <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />

                  {/* Outer pulse circle if hovered or latest */}
                  {(isHovered || isLatest) && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="7.5"
                      fill="#5865F2"
                      fillOpacity={isHovered ? 0.35 : 0.2}
                    />
                  )}

                  {/* Core Point Dot */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? '4.8' : '3.6'}
                    fill={isHovered ? '#FFFFFF' : '#5865F2'}
                    stroke={isHovered ? '#5865F2' : '#FFFFFF'}
                    strokeWidth="2"
                    style={{ transition: 'all 0.15s ease' }}
                  />

                  {/* X Axis Label */}
                  <text
                    x={pt.x}
                    y={chartHeight - 6}
                    fill={isHovered ? '#FFFFFF' : '#6B7280'}
                    fontSize="9.5"
                    fontWeight={isHovered ? '700' : '500'}
                    textAnchor="middle"
                  >
                    {pt.item.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Interactive Floating Tooltip when hovering over a point */}
          {activePoint && (
            <div
              style={{
                position: 'absolute',
                top: `${Math.max(4, Math.min(activePoint.y - 48, chartHeight - 70))}px`,
                left: `${Math.max(12, Math.min(activePoint.x - 65, chartWidth - 145))}px`,
                backgroundColor: '#12121A',
                border: '1px solid rgba(88, 101, 242, 0.45)',
                borderRadius: '8px',
                padding: '6px 10px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.8)',
                zIndex: 20,
                fontSize: '0.7rem',
                pointerEvents: 'none',
                minWidth: '120px',
              }}
            >
              <div style={{ color: '#A0A0B0', fontWeight: 600, fontSize: '0.65rem' }}>
                {activePoint.item.label}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginTop: '2px' }}>
                <span style={{ color: colors.textSecondary }}>New Joins:</span>
                <strong style={{ color: '#38BDF8' }}>+{activePoint.item.newJoins}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginTop: '1px' }}>
                <span style={{ color: colors.textSecondary }}>Cumulative:</span>
                <strong style={{ color: '#FFFFFF' }}>{activePoint.item.cumulative}</strong>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* "Who Joined When" Linear Feed View */
        <div style={{ display: 'flex', flexDirection: 'column', height: `${chartHeight}px` }}>
          {/* Search Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: colors.inputBg,
              border: `1px solid ${colors.inputBorder}`,
              borderRadius: '8px',
              padding: '4px 10px',
              marginBottom: '8px',
            }}
          >
            <Search size={13} color="#656574" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search who joined by name or @handle..."
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                color: colors.textPrimary,
                fontSize: '0.74rem',
                width: '100%',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.textMuted,
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Chronological Linear Member Timeline Feed */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              paddingRight: '4px',
            }}
          >
            {filteredMembers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: colors.textMuted, fontSize: '0.74rem' }}>
                No members found matching &quot;{searchQuery}&quot;
              </div>
            ) : (
              filteredMembers.map((member, idx) => (
                <div
                  key={member.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    backgroundColor: idx === 0 ? 'rgba(88, 101, 242, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${idx === 0 ? 'rgba(88, 101, 242, 0.25)' : colors.cardBorder}`,
                    fontSize: '0.74rem',
                    transition: 'all 0.12s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    {/* Discord Avatar with fallback */}
                    <img
                      src={member.avatarUrl}
                      alt={member.displayName}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/images/logo.png';
                      }}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: '#1E1E28',
                        objectFit: 'cover',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {member.displayName}
                        </span>
                        {idx === 0 && (
                          <span
                            style={{
                              fontSize: '0.6rem',
                              fontWeight: 700,
                              color: '#34D399',
                              backgroundColor: 'rgba(16, 185, 129, 0.15)',
                              padding: '1px 5px',
                              borderRadius: '4px',
                            }}
                          >
                            Latest Join
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.66rem', color: colors.textMuted, display: 'block' }}>
                        @{member.username}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.68rem', color: '#818CF8', fontWeight: 600, display: 'block' }}>
                      {formatJoinedDate(member.joinedAt)}
                    </span>
                    <span style={{ fontSize: '0.64rem', color: colors.textMuted }}>
                      {new Date(member.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Mini Recent Joiners Ticker (Visible underneath the chart when in chart mode) */}
      {viewMode !== 'members' && recentMembers.length > 0 && (
        <div
          style={{
            marginTop: '10px',
            paddingTop: '10px',
            borderTop: `1px solid ${colors.cardBorder}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: colors.textMuted, flexShrink: 0 }}>
            <Clock size={12} color="#8E8E9A" />
            <span>Latest Joins:</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {recentMembers.slice(0, 4).map((m) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: colors.badgeMutedBg,
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: '9999px',
                  padding: '2px 8px 2px 4px',
                  fontSize: '0.68rem',
                  whiteSpace: 'nowrap',
                }}
              >
                <img
                  src={m.avatarUrl}
                  alt={m.displayName}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/logo.png';
                  }}
                  style={{ width: '16px', height: '16px', borderRadius: '50%' }}
                />
                <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{m.displayName}</span>
                <span style={{ color: colors.textMuted, fontSize: '0.62rem' }}>• {formatJoinedDate(m.joinedAt)}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setViewMode('members')}
            style={{
              background: 'none',
              border: 'none',
              color: '#818CF8',
              fontSize: '0.68rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              flexShrink: 0,
            }}
          >
            <span>All</span>
            <ArrowUpRight size={11} />
          </button>
        </div>
      )}

      {/* Footer Matrix Status (Matching dashboard aesthetic) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6px 14px',
          paddingTop: '10px',
          marginTop: viewMode === 'members' ? '10px' : '6px',
          borderTop: `1px solid ${colors.cardBorder}`,
          fontSize: '0.72rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.textMuted }}>
          <span>Discord Gateway:</span>
          <strong style={{ color: data.success ? '#10B981' : '#F59E0B' }}>
            {loading ? 'Connecting...' : data.success ? 'Connected (v10 Bot)' : 'Unavailable'}
          </strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.textMuted }}>
          <span>Guild ID:</span>
          <strong style={{ color: '#FFFFFF' }}>{data.guildId || '—'}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.textMuted }}>
          <span>Active Presences:</span>
          <strong style={{ color: '#38BDF8' }}>{onlineMembers} online</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.textMuted }}>
          <span>Verified Roster:</span>
          <strong style={{ color: data.success ? '#10B981' : colors.textMuted }}>
            {data.success ? 'Synchronized' : 'Waiting'}
          </strong>
        </div>
      </div>
    </div>
  );
}
