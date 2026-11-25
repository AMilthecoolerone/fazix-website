'use client';

import { useEffect, useState } from 'react';
import { DiscordMemberStatsCard } from '../DiscordMemberStatsCard';
import type { JobApplication, Job } from '@/lib/jobs';
import type { Clip } from '@/lib/clips';
import { api } from './api';

type Colors = React.ComponentProps<typeof DiscordMemberStatsCard>['colors'];

/** Discord growth + a quick read on site activity (jobs, applications, clips). */
export function AnalyticsPanel({ colors }: { colors: Colors }) {
  const [stats, setStats] = useState<{ openJobs: number; apps: number; newApps: number; apps7d: number; clips: number; pendingClips: number } | null>(null);

  useEffect(() => {
    Promise.all([
      api<{ jobs: Job[] }>('/api/jobs?all=1'),
      api<{ applications: JobApplication[] }>('/api/dashboard/applications'),
      api<{ clips: Clip[] }>('/api/clips'),
    ])
      .then(([j, a, c]) => {
        const weekAgo = Date.now() - 7 * 86400 * 1000;
        setStats({
          openJobs: j.jobs.filter((x) => x.status === 'open').length,
          apps: a.applications.length,
          newApps: a.applications.filter((x) => x.status === 'new').length,
          apps7d: a.applications.filter((x) => new Date(x.createdAt).getTime() > weekAgo).length,
          clips: c.clips.length,
          pendingClips: c.clips.filter((x) => x.status === 'pending').length,
        });
      })
      .catch(() => setStats(null));
  }, []);

  const tiles: [string, number | undefined][] = [
    ['Open jobs', stats?.openJobs],
    ['Applications (7 days)', stats?.apps7d],
    ['Unread applications', stats?.newApps],
    ['Total applications', stats?.apps],
    ['Clips waiting for review', stats?.pendingClips],
    ['Clips submitted', stats?.clips],
  ];

  return (
    <div className="dx">
      <div>
        <p className="dx-sub">Discord server growth and what&apos;s happening on the site.</p>
      </div>
      <div className="dx-stats">
        {tiles.map(([label, value]) => (
          <div key={label} className="dx-stat">
            <span>{label}</span>
            <b>{value ?? '–'}</b>
          </div>
        ))}
      </div>
      <DiscordMemberStatsCard colors={colors} />
    </div>
  );
}
