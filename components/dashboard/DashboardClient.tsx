'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserSession } from '@/lib/auth';
import {
  LayoutDashboard,
  Trophy,
  Users,
  Briefcase,
  Settings,
  LogOut,
  Search,
  Bell,
  Check,
  ChevronRight,
  PanelLeft,
  ChevronsUpDown,
  Swords,
  Shield,
  Star,
  UserCheck,
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PhoneCall,
  Radio,
  Activity,
  Headphones,
  Wifi,
  RefreshCw,
  TrendingUp,
  Globe
} from 'lucide-react';
import { DiscordMemberStatsCard } from './DiscordMemberStatsCard';

export type UserGroup = 'support' | 'player' | 'partner' | 'user';

interface DashboardClientProps {
  initialSession: UserSession;
}

export interface ApplicationItem {
  id: string;
  ign: string;
  realName: string;
  role: 'Main Roster' | 'Academy' | 'Content Creator';
  discord: string;
  mmr: number;
  country: string;
  status: 'Pending' | 'Under Review' | 'Accepted' | 'Declined';
  appliedAt: string;
}

export interface TeamMember {
  id: string;
  ign: string;
  realName: string;
  role: string;
  team: 'Main Roster' | 'Academy' | 'Creators';
  rank: string;
  mmr: number;
  status: 'Starter' | 'Substitute' | 'Active';
}

export function DashboardClient({ initialSession }: DashboardClientProps) {
  const router = useRouter();

  // ONLY DARK MODE (A Little Bit More Grey Dark Slate/Obsidian)
  const colors = {
    canvasBg: '#000000',
    tabBg: '#07070A',
    tabBorder: 'rgba(255, 255, 255, 0.08)',
    sidebarBg: '#000000',
    sidebarBorder: 'rgba(255, 255, 255, 0.04)',
    cardBg: '#0B0B0F',
    cardBorder: 'rgba(255, 255, 255, 0.07)',
    cardHoverBorder: 'rgba(255, 255, 255, 0.16)',
    textPrimary: '#FFFFFF',
    textSecondary: '#8E8E9A',
    textMuted: '#5E5E6C',
    inputBg: '#0B0B0F',
    inputBorder: 'rgba(255, 255, 255, 0.08)',
    itemHoverBg: '#111116',
    modalBg: '#0B0B0F',
    badgeMutedBg: '#13131A',
    badgeMutedText: '#90909C',
  };

  // Active User Group: Support Team
  const [activeGroup, setActiveGroup] = useState<UserGroup>('support');

  // Sidebar collapse toggle
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'teams' | 'apply' | 'settings'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  // Real-time Discord Voice Call state
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [selectedVoiceFilter, setSelectedVoiceFilter] = useState<'all' | 'RLCS' | 'Academy' | 'Creators' | 'Staff'>('all');
  const [listeningInRoom, setListeningInRoom] = useState<string | null>('RLCS EU Main Roster Comm');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<'ALL' | '1D' | '1W' | '1M' | '3M'>('1W');

  // Filter for teams roster view
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<'all' | 'Main Roster' | 'Academy' | 'Creators'>('all');

  // TEAMS & PLAYERS DATA
  const teamsData = [
    {
      id: 'main',
      name: 'RLCS European Main Roster',
      division: 'RLCS European Major Circuit',
      playersCount: 4,
      status: 'Active Roster',
      tag: 'RLCS EU',
    },
    {
      id: 'academy',
      name: 'FAZIX Academy Development',
      division: 'Rising Stars & Regional Cups (GC3)',
      playersCount: 4,
      status: 'Development',
      tag: 'ACADEMY',
    },
    {
      id: 'creators',
      name: 'FAZIX Content & Streaming Hub',
      division: 'Twitch, YouTube & Community Casters',
      playersCount: 4,
      status: 'Creator Hub',
      tag: 'CREATORS',
    },
  ];

  const [playersData] = useState<TeamMember[]>([
    { id: 'p1', ign: 'Veloce', realName: 'Marc Keller', role: 'Captain / 1st Man', team: 'Main Roster', rank: 'SSL (2,240 MMR)', mmr: 2240, status: 'Starter' },
    { id: 'p2', ign: 'Zenith_EU', realName: 'Lukas Meyer', role: 'Striker / 2nd Man', team: 'Main Roster', rank: 'SSL (2,190 MMR)', mmr: 2190, status: 'Starter' },
    { id: 'p3', ign: 'Kxng', realName: 'Liam O’Connor', role: 'Anchor / 3rd Man', team: 'Main Roster', rank: 'SSL (2,165 MMR)', mmr: 2165, status: 'Starter' },
    { id: 'p4', ign: 'VortexSpeed', realName: 'Finn Berg', role: 'Substitute & Flex', team: 'Main Roster', rank: 'SSL (2,140 MMR)', mmr: 2140, status: 'Substitute' },
    { id: 'p5', ign: 'Frxzen.rl', realName: 'Julian Meyer', role: 'Academy 1st Man', team: 'Academy', rank: 'GC3 (1,845 MMR)', mmr: 1845, status: 'Starter' },
    { id: 'p6', ign: 'Neo_RL', realName: 'Jan Schuster', role: 'Academy Playmaker', team: 'Academy', rank: 'GC3 (1,820 MMR)', mmr: 1820, status: 'Starter' },
    { id: 'p7', ign: 'Shift', realName: 'Daan van Dijk', role: 'Academy Defender', team: 'Academy', rank: 'GC3 (1,800 MMR)', mmr: 1800, status: 'Starter' },
    { id: 'p8', ign: 'AlexEU', realName: 'Alexandre Roux', role: 'Academy Substitute', team: 'Academy', rank: 'GC2 (1,760 MMR)', mmr: 1760, status: 'Substitute' },
    { id: 'p9', ign: 'Kenorll', realName: 'Lukas Steiner', role: 'Content Creator', team: 'Creators', rank: 'GC1 (1,680 MMR)', mmr: 1680, status: 'Active' },
    { id: 'p10', ign: 'r3ulex', realName: 'Moritz Schmidt', role: 'Streamer / Freestyler', team: 'Creators', rank: 'SSL (1,920 MMR)', mmr: 1920, status: 'Active' },
    { id: 'p11', ign: 'Striker', realName: 'David Hoffmann', role: 'Highlights Lead', team: 'Creators', rank: 'GC2 (1,740 MMR)', mmr: 1740, status: 'Active' },
    { id: 'p12', ign: 'Nexo', realName: 'Tim Becker', role: 'Community Caster', team: 'Creators', rank: 'Champ 3 (1,450 MMR)', mmr: 1450, status: 'Active' },
  ]);

  // APPLICATIONS DATA
  const [applications, setApplications] = useState<ApplicationItem[]>([
    {
      id: 'APP-901',
      ign: 'Frxzen.rl',
      realName: 'Julian Meyer',
      role: 'Academy',
      discord: 'frxzen#1337',
      mmr: 1845,
      country: 'Germany (EU)',
      status: 'Under Review',
      appliedAt: '2h ago'
    },
    {
      id: 'APP-902',
      ign: 'VortexSpeed',
      realName: 'Liam O’Connor',
      role: 'Main Roster',
      discord: 'vortex.speed',
      mmr: 2190,
      country: 'Ireland (EU)',
      status: 'Pending',
      appliedAt: 'Yesterday'
    }
  ]);

  // Logout Handler
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    router.push('/login');
  };

  // Filtered players
  const filteredPlayers = playersData.filter((player) => {
    const matchesTeam = selectedTeamFilter === 'all' || player.team === selectedTeamFilter;
    const matchesSearch =
      player.ign.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.realName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.rank.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTeam && matchesSearch;
  });

  const teamsCount = teamsData.length;
  const playersCount = playersData.length;
  const pendingAppsCount = applications.filter((a) => a.status === 'Pending' || a.status === 'Under Review').length;

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: colors.canvasBg,
        color: colors.textPrimary,
        display: 'flex',
        overflow: 'hidden',
        fontFamily: 'var(--font-helvetica)',
      }}
    >
      {/* ============================================================== */}
      {/* 1. LEFT SIDEBAR: DARK MODE ONLY, MONOCHROME LEFT ICONS         */}
      {/* EXACTLY MATCHING USER'S REFERENCE SCREENSHOT                   */}
      {/* ============================================================== */}
      <aside
        style={{
          width: sidebarCollapsed ? '76px' : '240px',
          backgroundColor: colors.sidebarBg,
          borderRight: `1px solid ${colors.sidebarBorder}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '20px 14px',
          boxSizing: 'border-box',
          flexShrink: 0,
          transition: 'width 0.18s ease',
          zIndex: 30,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Header Row: Clean Logo without rectangle + FAZIX wordmark + Collapse button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarCollapsed ? 'center' : 'space-between',
              marginBottom: '26px',
              padding: '0 6px',
            }}
          >
            <Link
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
              }}
            >
              {/* Natural logo without rectangle */}
              <img
                src="/images/logo.png"
                alt="FAZIX Logo"
                style={{
                  width: '30px',
                  height: '30px',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />

              {!sidebarCollapsed && (
                <span
                  style={{
                    fontSize: '1.22rem',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: colors.textPrimary,
                  }}
                >
                  FAZIX
                </span>
              )}
            </Link>

            {/* Sidebar Collapse Toggle Button */}
            {!sidebarCollapsed && (
              <button
                type="button"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: colors.textSecondary,
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = colors.textPrimary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = colors.textSecondary)}
                title="Toggle sidebar"
              >
                <PanelLeft size={17} />
              </button>
            )}
          </div>

          {/* Grouped Navigation Links (NO COLOR ON LEFT ICONS - EXACT REFERENCE MATCH) */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {/* 1. Dashboard Tab */}
            {(() => {
              const isActive = activeTab === 'overview';
              return (
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                    gap: '12px',
                    padding: isActive ? '8px 12px' : '9px 12px',
                    borderRadius: '10px',
                    border: isActive
                      ? '1px solid rgba(255, 255, 255, 0.09)'
                      : '1px solid transparent',
                    background: isActive
                      ? 'linear-gradient(90deg, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0.04) 28%, rgba(255, 255, 255, 0.01) 48%, transparent 65%), linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, rgba(0, 0, 0, 0.2) 100%), #0A0A0E'
                      : 'transparent',
                    boxShadow: isActive
                      ? 'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 4px 10px rgba(0, 0, 0, 0.4)'
                      : 'none',
                    color: isActive ? '#FFFFFF' : '#9E9EA8',
                    fontSize: '0.86rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = colors.itemHoverBg;
                      e.currentTarget.style.color = '#FFFFFF';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#9E9EA8';
                    }
                  }}
                >
                  {/* Squircle box for active item icon, subtle silver gradient with dark icon */}
                  {isActive ? (
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        background: 'linear-gradient(180deg, #D8D8E2 0%, #A2A2AD 100%)',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <LayoutDashboard size={13} color="#0E0E12" />
                    </div>
                  ) : (
                    <div style={{ width: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <LayoutDashboard size={17} color="#8E8E98" />
                    </div>
                  )}
                  {!sidebarCollapsed && <span>Dashboard</span>}
                </button>
              );
            })()}

            {/* 2. Teams & Rosters Tab */}
            {(() => {
              const isActive = activeTab === 'teams';
              return (
                <button
                  type="button"
                  onClick={() => setActiveTab('teams')}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                    gap: '12px',
                    padding: isActive ? '8px 12px' : '9px 12px',
                    borderRadius: '10px',
                    border: isActive
                      ? '1px solid rgba(255, 255, 255, 0.09)'
                      : '1px solid transparent',
                    background: isActive
                      ? 'linear-gradient(90deg, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0.04) 28%, rgba(255, 255, 255, 0.01) 48%, transparent 65%), linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, rgba(0, 0, 0, 0.2) 100%), #0A0A0E'
                      : 'transparent',
                    boxShadow: isActive
                      ? 'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 4px 10px rgba(0, 0, 0, 0.4)'
                      : 'none',
                    color: isActive ? '#FFFFFF' : '#9E9EA8',
                    fontSize: '0.86rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = colors.itemHoverBg;
                      e.currentTarget.style.color = '#FFFFFF';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#9E9EA8';
                    }
                  }}
                >
                  {isActive ? (
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        background: 'linear-gradient(180deg, #D8D8E2 0%, #A2A2AD 100%)',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Trophy size={13} color="#0E0E12" />
                    </div>
                  ) : (
                    <div style={{ width: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Trophy size={17} color="#8E8E98" />
                    </div>
                  )}
                  {!sidebarCollapsed && <span>Teams & Rosters</span>}
                </button>
              );
            })()}

            {/* 3. Applications Tab (with green Live pill like reference) */}
            {(() => {
              const isActive = activeTab === 'apply';
              return (
                <button
                  type="button"
                  onClick={() => setActiveTab('apply')}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                    padding: isActive ? '8px 12px' : '9px 12px',
                    borderRadius: '10px',
                    border: isActive
                      ? '1px solid rgba(255, 255, 255, 0.09)'
                      : '1px solid transparent',
                    background: isActive
                      ? 'linear-gradient(90deg, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0.04) 28%, rgba(255, 255, 255, 0.01) 48%, transparent 65%), linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, rgba(0, 0, 0, 0.2) 100%), #0A0A0E'
                      : 'transparent',
                    boxShadow: isActive
                      ? 'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 4px 10px rgba(0, 0, 0, 0.4)'
                      : 'none',
                    color: isActive ? '#FFFFFF' : '#9E9EA8',
                    fontSize: '0.86rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = colors.itemHoverBg;
                      e.currentTarget.style.color = '#FFFFFF';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#9E9EA8';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {isActive ? (
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          background: 'linear-gradient(180deg, #D8D8E2 0%, #A2A2AD 100%)',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Briefcase size={13} color="#0E0E12" />
                      </div>
                    ) : (
                      <div style={{ width: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Briefcase size={17} color="#8E8E98" />
                      </div>
                    )}
                    {!sidebarCollapsed && <span>Applications</span>}
                  </div>

                  {/* Green Live pill like reference in user screenshot */}
                  {!sidebarCollapsed && (
                    <span
                      style={{
                        fontSize: '0.66rem',
                        fontWeight: 700,
                        color: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.14)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        padding: '2px 7px',
                        borderRadius: '9999px',
                        letterSpacing: '0.02em',
                      }}
                    >
                      Live
                    </span>
                  )}
                </button>
              );
            })()}

            {/* 4. Settings Tab */}
            {(() => {
              const isActive = activeTab === 'settings';
              return (
                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                    gap: '12px',
                    padding: isActive ? '8px 12px' : '9px 12px',
                    borderRadius: '10px',
                    border: isActive
                      ? '1px solid rgba(255, 255, 255, 0.09)'
                      : '1px solid transparent',
                    background: isActive
                      ? 'linear-gradient(90deg, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0.04) 28%, rgba(255, 255, 255, 0.01) 48%, transparent 65%), linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, rgba(0, 0, 0, 0.2) 100%), #0A0A0E'
                      : 'transparent',
                    boxShadow: isActive
                      ? 'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 4px 10px rgba(0, 0, 0, 0.4)'
                      : 'none',
                    color: isActive ? '#FFFFFF' : '#9E9EA8',
                    fontSize: '0.86rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = colors.itemHoverBg;
                      e.currentTarget.style.color = '#FFFFFF';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#9E9EA8';
                    }
                  }}
                >
                  {isActive ? (
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        background: 'linear-gradient(180deg, #D8D8E2 0%, #A2A2AD 100%)',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Settings size={13} color="#0E0E12" />
                    </div>
                  ) : (
                    <div style={{ width: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Settings size={17} color="#8E8E98" />
                    </div>
                  )}
                  {!sidebarCollapsed && <span>Settings</span>}
                </button>
              );
            })()}
          </nav>
        </div>

        {/* BOTTOM USER PROFILE: MATCHING EXACTLY USER REFERENCE SCREENSHOT */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              gap: '12px',
              padding: '8px 6px',
              borderRadius: '10px',
              cursor: 'pointer',
              backgroundColor: showProfileMenu ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
              transition: 'background-color 0.15s ease',
              boxSizing: 'border-box',
              width: '100%',
            }}
            onMouseEnter={(e) => {
              if (!showProfileMenu) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
            }}
            onMouseLeave={(e) => {
              if (!showProfileMenu) e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Account settings & group switcher"
          >
            {/* Circular Avatar with distinct white/silver ring border from screenshot */}
            <div
              style={{
                position: 'relative',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                padding: '2px',
                border: '2px solid rgba(255, 255, 255, 0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxSizing: 'border-box',
              }}
            >
              <img
                src={initialSession.avatar || initialSession.avatarUrl || '/images/default-avatar.png'}
                alt="User Profile"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>

            {/* Name & Email text stack */}
            {!sidebarCollapsed && (
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', overflow: 'hidden', minWidth: 0 }}>
                <span
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    lineHeight: 1.25,
                    letterSpacing: '-0.01em',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                >
                  {initialSession.displayName || 'Amir Fadel'}
                </span>
                <span
                  style={{
                    fontSize: '0.74rem',
                    color: '#767684',
                    marginTop: '2px',
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                >
                  {initialSession.email || 'amir.fadel@fazix.gg'}
                </span>
              </div>
            )}
          </div>

          {/* Profile popover dropdown */}
          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                bottom: 'calc(100% + 8px)',
                left: 0,
                right: 0,
                backgroundColor: colors.modalBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: '14px',
                padding: '12px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.9)',
                zIndex: 60,
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', paddingLeft: '4px' }}>
                SWITCH ACTIVE GROUP
              </div>

              {[
                { id: 'support', label: 'Support Team' },
                { id: 'user', label: 'Normal people (Users)' },
                { id: 'player', label: 'Esports team (player)' },
                { id: 'partner', label: 'Partners' },
              ].map((grp) => (
                <button
                  key={grp.id}
                  type="button"
                  onClick={() => {
                    setActiveGroup(grp.id as UserGroup);
                    setShowProfileMenu(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: activeGroup === grp.id ? '#1E1E26' : 'transparent',
                    color: colors.textPrimary,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span>{grp.label}</span>
                  {activeGroup === grp.id && <Check size={14} color="#FFFFFF" />}
                </button>
              ))}

              <div style={{ borderTop: `1px solid ${colors.cardBorder}`, margin: '4px 0' }} />

              <button
                type="button"
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#EF4444',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <LogOut size={15} color="#EF4444" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ============================================================== */}
      {/* 2. FLOATING TAB RECTANGLE (COMPACT & LESS GREY)                */}
      {/* ============================================================== */}
      <div
        style={{
          flex: 1,
          height: '100vh',
          padding: '22px 34px 26px 16px',
          boxSizing: 'border-box',
          backgroundColor: colors.canvasBg,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        <main
          style={{
            flex: 1,
            backgroundColor: colors.tabBg,
            border: `1px solid ${colors.tabBorder}`,
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
            minWidth: 0,
          }}
        >
          {/* Top Tab Header Bar inside the Grey Rectangle Tab */}
          <div
            style={{
              height: '52px',
              padding: '0 20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
              gap: '16px',
            }}
          >
            {/* Active Tab Pill Indicator (Squircle icon + Tab title) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  background: 'linear-gradient(180deg, #D8D8E2 0%, #A2A2AD 100%)',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {activeTab === 'overview' && <LayoutDashboard size={14} color="#0E0E12" />}
                {activeTab === 'teams' && <Trophy size={14} color="#0E0E12" />}
                {activeTab === 'apply' && <Users size={14} color="#0E0E12" />}
                {activeTab === 'settings' && <Settings size={14} color="#0E0E12" />}
              </div>
              <span
                style={{
                  fontSize: '0.96rem',
                  fontWeight: 700,
                  color: colors.textPrimary,
                  letterSpacing: '-0.01em',
                }}
              >
                {activeTab === 'overview'
                  ? 'Dashboard'
                  : activeTab === 'teams'
                  ? 'Teams & Player Rosters'
                  : activeTab === 'apply'
                  ? 'Tryout & Scouting Applications'
                  : 'Settings'}
              </span>
            </div>

            {/* Top Right Controls: Search, Run AI button, Notification bell */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Search box with ⌘K badge */}
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: colors.inputBg,
                  border: `1px solid ${colors.inputBorder}`,
                  borderRadius: '10px',
                  height: '34px',
                  padding: '0 10px 0 32px',
                  width: '230px',
                  transition: 'border-color 0.15s ease',
                }}
              >
                <Search
                  size={14}
                  color="#6E6E7C"
                  style={{ position: 'absolute', left: '10px', pointerEvents: 'none' }}
                />
                <input
                  type="text"
                  placeholder="Search anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: colors.textPrimary,
                    fontSize: '0.8rem',
                    outline: 'none',
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    padding: '2px 5px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '0.66rem',
                    color: '#7E7E8E',
                    fontWeight: 700,
                    userSelect: 'none',
                  }}
                >
                  <span>⌘</span>
                  <span>K</span>
                </div>
              </div>

              {/* ✨ Run AI Button (matching screenshot) */}
              <button
                type="button"
                style={{
                  height: '34px',
                  padding: '0 12px',
                  borderRadius: '10px',
                  backgroundColor: colors.inputBg,
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1F1F2A')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.inputBg)}
              >
                <Sparkles size={13} color="#FFFFFF" />
                <span>Run AI</span>
              </button>

              {/* Notification Bell Button */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.inputBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#8E8E98',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  title="Notifications"
                >
                  <Bell size={15} color="#8E8E98" />
                  <span
                    style={{
                      position: 'absolute',
                      top: '7px',
                      right: '7px',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#F59E0B',
                    }}
                  />
                </button>

                {showNotifications && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '42px',
                      right: '0',
                      width: '290px',
                      backgroundColor: colors.modalBg,
                      border: `1px solid ${colors.cardBorder}`,
                      borderRadius: '14px',
                      padding: '16px',
                      boxShadow: '0 20px 45px rgba(0, 0, 0, 0.9)',
                      zIndex: 50,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: colors.textPrimary }}>Scouting Alerts</span>
                      <span style={{ fontSize: '0.7rem', color: colors.textSecondary }}>2 pending</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ padding: '8px 10px', backgroundColor: colors.badgeMutedBg, borderRadius: '8px', fontSize: '0.76rem', color: colors.textPrimary }}>
                        <strong>New Tryout:</strong> Frxzen submitted 1,845 MMR Academy application.
                      </div>
                      <div style={{ padding: '8px 10px', backgroundColor: colors.badgeMutedBg, borderRadius: '8px', fontSize: '0.76rem', color: colors.textPrimary }}>
                        <strong>Main Roster Trial:</strong> VortexSpeed trial replay uploaded.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Scrollable Tab Workspace Body */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '18px 22px 28px 22px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >

        {/* ============================================================== */}
        {/* TAB 1: REAL-TIME DISCORD MEMBER CALL & ANALYTICS (DASHBOARD)   */}
        {/* ============================================================== */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            {/* TOP ROW: 2 Cards (Left: Discord Member Stats & Linear Growth Chart, Right: Voice Concurrency & Live Call Analytics) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.08fr 1.25fr', gap: '16px' }}>
              {/* CARD 1: DISCORD MEMBER COUNT & WHO JOINED WHEN LINEAR STATISTIC */}
              <DiscordMemberStatsCard colors={colors} />

              {/* CARD 2: VOICE CONCURRENCY & CALL FORECAST */}
              <div
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: '16px',
                  padding: '20px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} color="#A78BFA" />
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: colors.textPrimary }}>
                      Voice Concurrency & Call Forecast
                    </span>
                  </div>

                  <button
                    type="button"
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      backgroundColor: colors.badgeMutedBg,
                      border: `1px solid ${colors.cardBorder}`,
                      color: colors.textSecondary,
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    <RefreshCw size={12} color="#8E8E9A" />
                    <span>Refresh</span>
                  </button>
                </div>

                {/* SVG Line / Area Graph */}
                <div style={{ position: 'relative', width: '100%', height: '170px' }}>
                  <svg width="100%" height="100%" viewBox="0 0 460 170" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="callAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    {[30, 65, 100, 135].map((y) => (
                      <line key={y} x1="30" y1={y} x2="450" y2={y} stroke="#171722" strokeDasharray="3 3" />
                    ))}

                    {/* Y-axis labels */}
                    <text x="8" y="34" fill="#6B7280" fontSize="10">60</text>
                    <text x="8" y="69" fill="#6B7280" fontSize="10">45</text>
                    <text x="8" y="104" fill="#6B7280" fontSize="10">30</text>
                    <text x="8" y="139" fill="#6B7280" fontSize="10">15</text>

                    {/* Blue Area & Curve (Voice Callers) */}
                    <path
                      d="M 40 135 Q 90 95, 140 70 T 240 45 T 320 100 T 390 55 T 445 130"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M 40 135 Q 90 95, 140 70 T 240 45 T 320 100 T 390 55 T 445 130 L 445 150 L 40 150 Z"
                      fill="url(#callAreaGrad)"
                    />

                    {/* Dashed Green Curve (Predicted Call Peak) */}
                    <path
                      d="M 40 90 Q 90 85, 140 95 T 240 68 T 320 115 T 390 80 T 445 95"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />

                    {/* Timeline dot */}
                    <circle cx="280" cy="62" r="4.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
                  </svg>

                  {/* Interactive Tooltip Card positioned at peak */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '48px',
                      backgroundColor: '#12121A',
                      border: '1px solid rgba(255, 255, 255, 0.14)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      boxShadow: '0 12px 28px rgba(0, 0, 0, 0.7)',
                      zIndex: 10,
                      fontSize: '0.72rem',
                      minWidth: '150px',
                    }}
                  >
                    <div style={{ color: '#A0A0B0', fontWeight: 600, marginBottom: '6px' }}>Oct 11, 2026 • 20:15</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ color: colors.textSecondary }}>Actual Callers:</span>
                      <strong style={{ color: '#FFFFFF' }}>42</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ color: colors.textSecondary }}>Predicted Peak:</span>
                      <strong style={{ color: '#FFFFFF' }}>36</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ color: colors.textSecondary }}>Deviation:</span>
                      <strong style={{ color: '#10B981' }}>+17% 🡑</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: colors.textSecondary }}>Voice Quality:</span>
                      <strong style={{ color: '#10B981' }}>High (HD)</strong>
                    </div>
                  </div>
                </div>

                {/* Dates Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px', fontSize: '0.7rem', color: colors.textMuted, marginTop: '4px' }}>
                  <span>8 Oct</span>
                  <span>9 Oct</span>
                  <span>10 Oct</span>
                  <span>11 Oct</span>
                  <span>12 Oct</span>
                  <span>13 Oct</span>
                  <span>14 Oct</span>
                  <span>15 Oct</span>
                </div>

                {/* AI Insight banner */}
                <div
                  style={{
                    marginTop: '12px',
                    padding: '10px 12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${colors.cardBorder}`,
                    borderRadius: '10px',
                    fontSize: '0.73rem',
                    color: colors.textSecondary,
                    lineHeight: 1.45,
                  }}
                >
                  <strong style={{ color: '#A78BFA' }}>✨ AI Voice Insight: </strong>
                  Peak voice channel concurrency spikes during EU Scrims (19:30–22:00 CET). 4 concurrent rooms active with zero audio packet loss. Automated bandwidth QoS prioritizing RLCS Main Roster room.
                </div>
              </div>
            </div>

            {/* BOTTOM ROW: 2 Cards (Left: Connected Voice Rooms, Right: Voice Radar & Heatmap) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: '16px' }}>
              {/* CARD 3: CONNECTED VOICE ROOMS & LIVE CALLERS */}
              <div
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: '16px',
                  padding: '20px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Volume2 size={16} color="#FFFFFF" />
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: colors.textPrimary }}>
                      Live Discord Voice Rooms
                    </span>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: colors.textSecondary, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>View:</span>
                    <select
                      value={selectedVoiceFilter}
                      onChange={(e) => setSelectedVoiceFilter(e.target.value as any)}
                      style={{
                        backgroundColor: colors.badgeMutedBg,
                        color: colors.textPrimary,
                        border: `1px solid ${colors.cardBorder}`,
                        borderRadius: '6px',
                        padding: '3px 8px',
                        fontSize: '0.74rem',
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="all">All Channels</option>
                      <option value="RLCS">RLCS EU</option>
                      <option value="Academy">Academy</option>
                      <option value="Creators">Creators</option>
                      <option value="Staff">Staff</option>
                    </select>
                  </div>
                </div>

                {/* Voice channels list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    {
                      id: 'v1',
                      name: 'RLCS EU Main Roster Comm',
                      category: 'RLCS',
                      workload: 'Live Scrim vs KC',
                      quality: '99%',
                      latency: '14ms',
                      bitrate: '128 kbps',
                      speaking: 'Veloce',
                      callers: ['Veloce (Capt)', 'Zenith_EU', 'Kxng', 'Coach Alex'],
                      tagColor: '#10B981',
                      status: 'Priority Comms',
                    },
                    {
                      id: 'v2',
                      name: 'FAZIX Academy Scrim Room',
                      category: 'Academy',
                      workload: 'Replay VOD Review',
                      quality: '94%',
                      latency: '19ms',
                      bitrate: '96 kbps',
                      speaking: 'Frxzen.rl',
                      callers: ['Frxzen.rl', 'Neo_RL', 'Shift'],
                      tagColor: '#F59E0B',
                      status: 'Active Review',
                    },
                    {
                      id: 'v3',
                      name: 'Community Lounge & Watchparty',
                      category: 'Creators',
                      workload: '18 Callers • 2 Streams',
                      quality: '88%',
                      latency: '22ms',
                      bitrate: '64 kbps',
                      speaking: 'r3ulex',
                      callers: ['r3ulex (Live 📺)', 'Striker', '+16 viewers'],
                      tagColor: '#3B82F6',
                      status: 'Public Watchparty',
                    },
                    {
                      id: 'v4',
                      name: 'Support Desk & Trials Q&A',
                      category: 'Staff',
                      workload: 'Trial Interview',
                      quality: '98%',
                      latency: '16ms',
                      bitrate: '96 kbps',
                      speaking: 'Amir Fadel',
                      callers: ['Amir Fadel (Staff)', 'VortexSpeed (Trial)'],
                      tagColor: '#8B5CF6',
                      status: 'Staff Only',
                    },
                  ]
                    .filter((room) => selectedVoiceFilter === 'all' || room.category === selectedVoiceFilter)
                    .map((room) => (
                      <div
                        key={room.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 14px',
                          backgroundColor: listeningInRoom === room.name ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255, 255, 255, 0.015)',
                          borderRadius: '10px',
                          border: listeningInRoom === room.name ? '1px solid rgba(59, 130, 246, 0.35)' : `1px solid ${colors.cardBorder}`,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '8px',
                              backgroundColor: colors.badgeMutedBg,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: `1px solid ${colors.cardBorder}`,
                            }}
                          >
                            <Volume2 size={16} color={listeningInRoom === room.name ? '#3B82F6' : '#FFFFFF'} />
                          </div>

                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: colors.textPrimary }}>
                                {room.name}
                              </span>
                              <span
                                style={{
                                  fontSize: '0.64rem',
                                  fontWeight: 700,
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  backgroundColor: `${room.tagColor}1F`,
                                  color: room.tagColor,
                                  border: `1px solid ${room.tagColor}40`,
                                }}
                              >
                                {room.status}
                              </span>
                            </div>

                            <div style={{ fontSize: '0.72rem', color: colors.textMuted, marginTop: '2px' }}>
                              {room.bitrate} • {room.latency} • Callers: <strong style={{ color: colors.textPrimary }}>{room.callers.join(', ')}</strong>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setListeningInRoom(listeningInRoom === room.name ? null : room.name)}
                          style={{
                            padding: '5px 12px',
                            borderRadius: '6px',
                            backgroundColor: listeningInRoom === room.name ? '#3B82F6' : colors.badgeMutedBg,
                            color: listeningInRoom === room.name ? '#FFFFFF' : colors.textPrimary,
                            border: `1px solid ${colors.cardBorder}`,
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                        >
                          <Headphones size={12} />
                          <span>{listeningInRoom === room.name ? 'Listening' : 'Listen In'}</span>
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              {/* CARD 4: DISCORD VOICE RADAR & REAL-TIME ACTIVITY */}
              <div
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: '16px',
                  padding: '20px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Globe size={16} color="#FFFFFF" />
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: colors.textPrimary }}>
                      Discord Voice Radar
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {(['ALL', '1D', '1W', '1M', '3M'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTimeFilter(t)}
                        style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          border: selectedTimeFilter === t ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
                          backgroundColor: selectedTimeFilter === t ? '#1E1E28' : 'transparent',
                          color: selectedTimeFilter === t ? '#FFFFFF' : colors.textMuted,
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dark Map / Radar Visual with Nodes */}
                <div
                  style={{
                    height: '140px',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    borderRadius: '10px',
                    border: `1px solid ${colors.cardBorder}`,
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Grid texture */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
                      backgroundSize: '16px 16px',
                    }}
                  />

                  {/* Node 1: Frankfurt EU Gateway */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '40%',
                      left: '52%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: '#10B981',
                        boxShadow: '0 0 12px #10B981',
                        border: '2px solid #FFFFFF',
                      }}
                    />
                    <span style={{ fontSize: '0.68rem', color: '#FFFFFF', fontWeight: 700, backgroundColor: 'rgba(0,0,0,0.7)', padding: '1px 5px', borderRadius: '4px' }}>
                      Frankfurt (18ms • 34c)
                    </span>
                  </div>

                  {/* Node 2: London EU Gateway */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '32%',
                      left: '26%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: '#3B82F6',
                        boxShadow: '0 0 10px #3B82F6',
                        border: '2px solid #FFFFFF',
                      }}
                    />
                    <span style={{ fontSize: '0.68rem', color: '#CBD5E1', fontWeight: 600, backgroundColor: 'rgba(0,0,0,0.7)', padding: '1px 5px', borderRadius: '4px' }}>
                      London (24ms)
                    </span>
                  </div>

                  {/* Node 3: Stockholm Gateway */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '18%',
                      left: '66%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#A855F7',
                        border: '1px solid #FFFFFF',
                      }}
                    />
                    <span style={{ fontSize: '0.66rem', color: '#94A3B8', backgroundColor: 'rgba(0,0,0,0.7)', padding: '1px 5px', borderRadius: '4px' }}>
                      Stockholm (31ms)
                    </span>
                  </div>
                </div>

                {/* Discord Voice Staff Controls */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    marginTop: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '10px',
                    border: `1px solid ${colors.cardBorder}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setIsMicMuted(!isMicMuted)}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '8px',
                        backgroundColor: isMicMuted ? 'rgba(239, 68, 68, 0.15)' : colors.badgeMutedBg,
                        border: isMicMuted ? '1px solid rgba(239, 68, 68, 0.4)' : `1px solid ${colors.cardBorder}`,
                        color: isMicMuted ? '#EF4444' : '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                      title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
                    >
                      {isMicMuted ? <MicOff size={14} /> : <Mic size={14} />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsDeafened(!isDeafened)}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '8px',
                        backgroundColor: isDeafened ? 'rgba(239, 68, 68, 0.15)' : colors.badgeMutedBg,
                        border: isDeafened ? '1px solid rgba(239, 68, 68, 0.4)' : `1px solid ${colors.cardBorder}`,
                        color: isDeafened ? '#EF4444' : '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                      title={isDeafened ? 'Undeafen' : 'Deafen'}
                    >
                      {isDeafened ? <VolumeX size={14} /> : <Headphones size={14} />}
                    </button>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: colors.textPrimary }}>
                      Room: <span style={{ color: '#10B981' }}>{listeningInRoom || 'Standby'}</span>
                    </div>
                    <div style={{ fontSize: '0.68rem', color: colors.textMuted }}>
                      Bitrate: 128 kbps • Ping: 18ms
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: TEAMS & PLAYER ROSTERS (TRANSFERRED FROM DASHBOARD)     */}
        {/* ============================================================== */}
        {activeTab === 'teams' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            {/* METRIC COUNTERS GRID (NO PERCENTAGES, CLEAN NUMBERS) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '14px',
              }}
            >
              {/* Card 1: TEAM COUNTER */}
              <div
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: '14px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: colors.textSecondary, display: 'block', marginBottom: '6px' }}>
                    Team Counter
                  </span>
                  <div
                    style={{
                      fontSize: '1.85rem',
                      fontWeight: 800,
                      color: colors.textPrimary,
                      letterSpacing: '-0.03em',
                      lineHeight: 1,
                    }}
                  >
                    {teamsCount}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: colors.textMuted, marginTop: '6px', display: 'block' }}>
                    Active FAZIX teams
                  </span>
                </div>

                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: colors.badgeMutedBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${colors.cardBorder}`,
                  }}
                >
                  <Trophy size={18} color="#FFFFFF" />
                </div>
              </div>

              {/* Card 2: PLAYER COUNTER */}
              <div
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: '14px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: colors.textSecondary, display: 'block', marginBottom: '6px' }}>
                    Player Counter
                  </span>
                  <div
                    style={{
                      fontSize: '1.85rem',
                      fontWeight: 800,
                      color: colors.textPrimary,
                      letterSpacing: '-0.03em',
                      lineHeight: 1,
                    }}
                  >
                    {playersCount}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: colors.textMuted, marginTop: '6px', display: 'block' }}>
                    Official roster players
                  </span>
                </div>

                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: colors.badgeMutedBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${colors.cardBorder}`,
                  }}
                >
                  <Users size={18} color="#FFFFFF" />
                </div>
              </div>

              {/* Card 3: Tryout Applications Counter */}
              <div
                onClick={() => setActiveTab('apply')}
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: '14px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = colors.cardHoverBorder)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = colors.cardBorder)}
              >
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: colors.textSecondary, display: 'block', marginBottom: '6px' }}>
                    Scouting Trials
                  </span>
                  <div
                    style={{
                      fontSize: '1.85rem',
                      fontWeight: 800,
                      color: colors.textPrimary,
                      letterSpacing: '-0.03em',
                      lineHeight: 1,
                    }}
                  >
                    {pendingAppsCount}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: colors.textMuted, marginTop: '6px', display: 'block' }}>
                    Applications under review
                  </span>
                </div>

                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: colors.badgeMutedBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${colors.cardBorder}`,
                  }}
                >
                  <Briefcase size={18} color="#FFFFFF" />
                </div>
              </div>

              {/* Card 4: Community Members */}
              <div
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: '14px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: colors.textSecondary, display: 'block', marginBottom: '6px' }}>
                    Discord Members
                  </span>
                  <div
                    style={{
                      fontSize: '1.85rem',
                      fontWeight: 800,
                      color: colors.textPrimary,
                      letterSpacing: '-0.03em',
                      lineHeight: 1,
                    }}
                  >
                    1,840
                  </div>
                  <span style={{ fontSize: '0.72rem', color: colors.textMuted, marginTop: '6px', display: 'block' }}>
                    Active community members
                  </span>
                </div>

                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: colors.badgeMutedBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${colors.cardBorder}`,
                  }}
                >
                  <Swords size={18} color="#FFFFFF" />
                </div>
              </div>
            </div>

            {/* TEAMS & ROSTERS HUB (3 Teams Cards + Player Rosters Table) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* 3 Teams Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {teamsData.map((tm) => (
                  <div
                    key={tm.id}
                    onClick={() => setSelectedTeamFilter(tm.name as any)}
                    style={{
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${colors.cardBorder}`,
                      borderRadius: '16px',
                      padding: '22px 24px',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = colors.cardHoverBorder)}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = colors.cardBorder)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          backgroundColor: colors.badgeMutedBg,
                          color: colors.textPrimary,
                          letterSpacing: '0.04em',
                        }}
                      >
                        {tm.tag}
                      </span>
                      <span style={{ fontSize: '0.76rem', color: colors.textSecondary, fontWeight: 700 }}>
                        {tm.playersCount} Players
                      </span>
                    </div>

                    <h4 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', fontWeight: 800, color: colors.textPrimary }}>
                      {tm.name}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: colors.textMuted }}>
                      {tm.division}
                    </p>
                  </div>
                ))}
              </div>

              {/* Roster Players List Table */}
              <div
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: '18px',
                  padding: '24px 28px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px 0', color: colors.textPrimary }}>
                      Player Rosters ({playersCount})
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: colors.textSecondary }}>
                      Manage registered players, competitive ranks, and roster assignments.
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {(['all', 'Main Roster', 'Academy', 'Creators'] as const).map((teamFilter) => {
                      const isSelected = selectedTeamFilter === teamFilter;
                      return (
                        <button
                          key={teamFilter}
                          type="button"
                          onClick={() => setSelectedTeamFilter(teamFilter)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '9999px',
                            border: isSelected ? '1px solid rgba(255, 255, 255, 0.2)' : `1px solid ${colors.cardBorder}`,
                            backgroundColor: isSelected ? '#1E1E26' : 'transparent',
                            color: isSelected ? '#FFFFFF' : colors.textSecondary,
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {teamFilter === 'all' ? 'All Teams' : teamFilter}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filteredPlayers.length === 0 ? (
                    <div style={{ padding: '36px', textAlign: 'center', color: colors.textMuted, fontSize: '0.86rem' }}>
                      No players match the search filter.
                    </div>
                  ) : (
                    filteredPlayers.map((player) => (
                      <div
                        key={player.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          backgroundColor: 'rgba(255, 255, 255, 0.015)',
                          borderRadius: '10px',
                          border: `1px solid rgba(255, 255, 255, 0.04)`,
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = colors.cardHoverBorder;
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.035)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.04)';
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.015)';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              backgroundColor: colors.badgeMutedBg,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '0.85rem',
                              color: colors.textPrimary,
                              border: `1px solid ${colors.cardBorder}`,
                            }}
                          >
                            {player.ign.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: colors.textPrimary }}>
                              {player.ign}{' '}
                              <span style={{ fontSize: '0.78rem', fontWeight: 500, color: colors.textSecondary }}>
                                ({player.realName})
                              </span>
                            </div>
                            <div style={{ fontSize: '0.74rem', color: colors.textMuted, marginTop: '2px' }}>
                              {player.role} • <strong style={{ color: colors.textPrimary }}>{player.team}</strong>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <span style={{ fontSize: '0.8rem', color: colors.textSecondary, fontWeight: 700 }}>
                            {player.rank}
                          </span>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '3px 9px',
                              borderRadius: '9999px',
                              backgroundColor: player.status === 'Starter' ? 'rgba(16, 185, 129, 0.12)' : colors.badgeMutedBg,
                              color: player.status === 'Starter' ? '#10B981' : colors.textPrimary,
                              border: `1px solid ${player.status === 'Starter' ? 'rgba(16, 185, 129, 0.25)' : colors.cardBorder}`,
                            }}
                          >
                            {player.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

          {/* ============================================================== */}
          {/* TAB: APPLICATIONS & TRYOUTS DESK                               */}
          {/* ============================================================== */}
          {activeTab === 'apply' && (
            <div
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: '18px',
                padding: '24px 28px',
              }}
            >
              <div style={{ marginBottom: '18px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px 0', color: colors.textPrimary }}>
                  Tryout & Scouting Applications
                </h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: colors.textSecondary }}>
                  Scouting staff review pipeline for competitive roster applicants.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {applications.map((app) => (
                  <div
                    key={app.id}
                    style={{
                      padding: '16px 20px',
                      backgroundColor: colors.itemHoverBg,
                      borderRadius: '12px',
                      border: `1px solid ${colors.cardBorder}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.94rem', fontWeight: 800, color: colors.textPrimary }}>
                          {app.ign}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: colors.textSecondary }}>
                          ({app.realName})
                        </span>
                        <span style={{ fontSize: '0.7rem', padding: '2px 7px', backgroundColor: colors.badgeMutedBg, color: colors.badgeMutedText, borderRadius: '4px' }}>
                          {app.role}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.76rem', color: colors.textMuted, marginTop: '4px' }}>
                        Discord: <strong style={{ color: colors.textPrimary }}>{app.discord}</strong> • Peak MMR: <strong style={{ color: colors.textPrimary }}>{app.mmr}</strong> • Region: {app.country} • Applied: {app.appliedAt}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          color: '#F59E0B',
                          backgroundColor: 'rgba(245, 158, 11, 0.12)',
                          border: '1px solid rgba(245, 158, 11, 0.25)',
                          padding: '4px 10px',
                          borderRadius: '9999px',
                        }}
                      >
                        {app.status}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          setApplications(applications.map((a) => (a.id === app.id ? { ...a, status: 'Accepted' as const } : a)));
                        }}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          backgroundColor: '#FFFFFF',
                          color: '#000000',
                          border: 'none',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Accept Trial
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB: SETTINGS                                                  */}
          {/* ============================================================== */}
          {activeTab === 'settings' && (
            <div
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: '18px',
                padding: '24px 28px',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 6px 0', color: colors.textPrimary }}>
                Support Staff Preferences
              </h3>
              <p style={{ fontSize: '0.82rem', color: colors.textSecondary, margin: '0 0 20px 0' }}>
                Discord notification webhook configurations and roster permissions.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '480px' }}>
                <div style={{ padding: '14px', backgroundColor: colors.itemHoverBg, borderRadius: '10px', border: `1px solid ${colors.cardBorder}` }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: colors.textPrimary }}>Scouting Ping Webhooks</div>
                  <div style={{ fontSize: '0.74rem', color: colors.textSecondary, marginTop: '2px' }}>
                    Send new GC3+ trial applications to #staff-scouting
                  </div>
                </div>
                <div style={{ padding: '14px', backgroundColor: colors.itemHoverBg, borderRadius: '10px', border: `1px solid ${colors.cardBorder}` }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: colors.textPrimary }}>Dark Theme Locked</div>
                  <div style={{ fontSize: '0.74rem', color: colors.textSecondary, marginTop: '2px' }}>
                    Dashboard interface locked to obsidian black mode
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  </div>
);
}
