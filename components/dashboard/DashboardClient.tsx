'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { UserSession } from '@/lib/auth';
import { BarChart3, Briefcase, Clapperboard, FileText, LayoutDashboard, LogOut, Search } from 'lucide-react';
import { OverviewPanel } from './staff/OverviewPanel';
import { CmsPanel } from './staff/CmsPanel';
import { JobsPanel } from './staff/JobsPanel';
import { ClipsPanel } from './staff/ClipsPanel';
import { AnalyticsPanel } from './staff/AnalyticsPanel';

type DashboardTab = 'overview' | 'analytics' | 'cms' | 'jobs' | 'clips';

const NAV_ITEMS: { id: DashboardTab; label: string; icon: React.ComponentType<{ size?: number }>; staff?: boolean }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, staff: true },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, staff: true },
  { id: 'cms', label: 'Content', icon: FileText, staff: true },
  { id: 'jobs', label: 'Jobs', icon: Briefcase, staff: true },
  { id: 'clips', label: 'Clips', icon: Clapperboard },
];

// Colours for the Discord analytics card, which takes them as a prop.
const CARD_COLORS = {
  cardBg: '#0B0B0F',
  cardBorder: 'rgba(255, 255, 255, 0.07)',
  cardHoverBorder: 'rgba(255, 255, 255, 0.16)',
  textPrimary: '#FFFFFF',
  textSecondary: '#8E8E9A',
  textMuted: '#5E5E6C',
  badgeMutedBg: '#13131A',
  badgeMutedText: '#90909C',
  inputBg: '#0B0B0F',
  inputBorder: 'rgba(255, 255, 255, 0.08)',
  itemHoverBg: '#111116',
  modalBg: '#0B0B0F',
};

export function DashboardClient({ initialSession }: { initialSession: UserSession }) {
  const router = useRouter();
  const isStaff = (initialSession.eligibleGroups || [initialSession.role]).includes('support');

  const navItems = NAV_ITEMS.filter((item) => !item.staff || isStaff);
  const [activeTab, setActiveTab] = useState<DashboardTab>(navItems[0].id);
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const active = navItems.find((i) => i.id === activeTab) || navItems[0];

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => undefined);
    router.push('/login');
  }

  return (
    <div className="db">
      <aside className="db-side">
        <Link href="/" className="db-brand">
          <img src="/images/logo.png" alt="" width={26} height={26} />
          <span>FAZIX</span>
        </Link>

        <nav className="db-nav">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={`db-link ${activeTab === id ? 'is-active' : ''}`}
              onClick={() => {
                setActiveTab(id);
                setSearch('');
              }}
              aria-current={activeTab === id ? 'page' : undefined}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="db-user">
          {menuOpen && (
            <div className="db-menu">
              <button type="button" onClick={logout}>
                <LogOut size={14} /> Log out
              </button>
            </div>
          )}
          <button type="button" className="db-user-btn" onClick={() => setMenuOpen((o) => !o)}>
            <img src={initialSession.avatarUrl || '/images/logo.png'} alt="" width={30} height={30} />
            <span className="db-user-text">
              <strong>{initialSession.displayName}</strong>
              <small>{isStaff ? 'Staff' : `@${initialSession.username}`}</small>
            </span>
          </button>
        </div>
      </aside>

      <main className="db-main">
        <header className="db-head">
          <h1>{active.label}</h1>
          {active.id !== 'analytics' && active.id !== 'overview' && (
            <label className="db-search">
              <Search size={14} />
              <input type="search" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </label>
          )}
        </header>

        <div className="db-body">
          {isStaff && activeTab === 'overview' && <OverviewPanel onNavigate={(tab) => { setActiveTab(tab); setSearch(''); }} />}
          {activeTab === 'clips' && <ClipsPanel staff={isStaff} search={search} />}
          {isStaff && activeTab === 'cms' && <CmsPanel search={search} />}
          {isStaff && activeTab === 'jobs' && <JobsPanel search={search} />}
          {isStaff && activeTab === 'analytics' && <AnalyticsPanel colors={CARD_COLORS} />}
        </div>
      </main>
    </div>
  );
}
