'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, PlayCircle } from 'lucide-react';
import { summarize, FORMAT_LABEL, type Match } from '@/lib/matchUtils';
import type { Application as JobApplication } from '@/lib/careerForm';
import type { Clip } from '@/lib/clips';
import type { ArticleWithMeta } from '@/lib/cms';
import { MatchEditor } from './MatchEditor';
import { StaffNotes } from './StaffNotes';
import { api } from './api';

type Tab = 'jobs' | 'clips' | 'cms';

function when(iso: string): string {
  const d = new Date(iso);
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const day = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((day(d) - day(new Date())) / 86400000);
  if (diff === 0) return `Today, ${time}`;
  if (diff === 1) return `Tomorrow, ${time}`;
  return `${d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}, ${time}`;
}

export function OverviewPanel({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [counts, setCounts] = useState<{ apps: number; clips: number; drafts: number } | null>(null);
  const [team, setTeam] = useState('all');
  const [editing, setEditing] = useState<Match | 'new' | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<{ matches: Match[] }>('/api/dashboard/matches')
      .then((r) => setMatches(r.matches))
      .catch((e) => setError(e.message));
    Promise.all([
      api<{ applications: JobApplication[] }>('/api/dashboard/applications'),
      api<{ clips: Clip[] }>('/api/clips'),
      api<{ articles: ArticleWithMeta[] }>('/api/dashboard/cms'),
    ])
      .then(([a, c, n]) =>
        setCounts({
          apps: a.applications.filter((x) => x.status === 'new').length,
          clips: c.clips.filter((x) => x.status === 'pending').length,
          drafts: n.articles.filter((x) => x.status === 'pending_review').length,
        })
      )
      .catch(() => setCounts(null));
  }, []);

  const teams = useMemo(() => Array.from(new Set((matches || []).map((m) => m.team))).sort(), [matches]);
  const filtered = useMemo(() => (matches || []).filter((m) => team === 'all' || m.team === team), [matches, team]);
  const played = filtered.filter((m) => ['win', 'loss'].includes(summarize(m).result));
  const upcoming = filtered
    .filter((m) => summarize(m).result === 'upcoming' && new Date(m.date).getTime() > Date.now() - 3 * 3600 * 1000)
    .sort((a, b) => a.date.localeCompare(b.date));
  const next = upcoming[0];

  const record = useMemo(() => {
    let sw = 0, sl = 0, gw = 0, gl = 0, gf = 0, ga = 0;
    for (const m of played) {
      const s = summarize(m);
      if (s.result === 'win') sw++;
      else sl++;
      gw += s.usWins;
      gl += s.themWins;
      gf += s.goalsFor;
      ga += s.goalsAgainst;
    }
    return { sw, sl, gw, gl, diff: gf - ga, rate: sw + sl ? Math.round((sw / (sw + sl)) * 100) : null };
  }, [played]);
  const form = played.slice(0, 10).reverse(); // oldest → newest, newest on the right

  function saved(m: Match) {
    setMatches((list) => [m, ...(list || []).filter((x) => x.id !== m.id)].sort((a, b) => b.date.localeCompare(a.date)));
    setEditing(null);
  }

  const attention = counts
    ? ([
        counts.apps && { n: counts.apps, label: counts.apps === 1 ? 'new job application' : 'new job applications', tab: 'jobs' as Tab },
        counts.clips && { n: counts.clips, label: counts.clips === 1 ? 'clip to review' : 'clips to review', tab: 'clips' as Tab },
        counts.drafts && { n: counts.drafts, label: counts.drafts === 1 ? 'article waiting for review' : 'articles waiting for review', tab: 'cms' as Tab },
      ].filter(Boolean) as { n: number; label: string; tab: Tab }[])
    : [];

  return (
    <div className="ov">
      <div className="ov-main">
        <p className="ov-attn">
          {counts === null ? (
            ' '
          ) : attention.length === 0 ? (
            'Nothing is waiting on you.'
          ) : (
            attention.map((a, i) => (
              <span key={a.tab}>
                {i > 0 && (i === attention.length - 1 ? ' and ' : ', ')}
                <button type="button" onClick={() => onNavigate(a.tab)}>
                  {a.n} {a.label}
                </button>
              </span>
            ))
          )}
        </p>

        {error && <div className="dx-error">{error}</div>}

        <section aria-labelledby="ov-results">
          <div className="ov-bar">
            <h3 id="ov-results" className="ov-h">Results</h3>
            <div className="ov-bar-right">
              {teams.length > 1 && (
                <select className="dx-input ov-team" value={team} onChange={(e) => setTeam(e.target.value)} aria-label="Filter by team">
                  <option value="all">All teams</option>
                  {teams.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              )}
              <button type="button" className="dx-btn primary" onClick={() => setEditing('new')}>
                <Plus size={14} /> Add match
              </button>
            </div>
          </div>

          {matches !== null && played.length > 0 && (
            <div className="ov-record">
              <div className="ov-form" aria-label={`Last ${form.length} series, oldest first`}>
                {form.map((m) => {
                  const w = summarize(m).result === 'win';
                  return (
                    <button
                      key={m.id}
                      type="button"
                      className={`ov-chip ${w ? 'is-win' : 'is-loss'}`}
                      title={`${w ? 'Win' : 'Loss'} vs ${m.opponent}`}
                      onClick={() => setEditing(m)}
                    >
                      {w ? 'W' : 'L'}
                    </button>
                  );
                })}
              </div>
              <dl className="ov-stats">
                <div>
                  <dt>Series</dt>
                  <dd>{record.sw}–{record.sl}</dd>
                </div>
                <div>
                  <dt>Games</dt>
                  <dd>{record.gw}–{record.gl}</dd>
                </div>
                <div>
                  <dt>Goal difference</dt>
                  <dd>{record.diff > 0 ? `+${record.diff}` : record.diff}</dd>
                </div>
                <div>
                  <dt>Win rate</dt>
                  <dd>{record.rate}%</dd>
                </div>
              </dl>
            </div>
          )}

          {next && (
            <button type="button" className="ov-next" onClick={() => setEditing(next)}>
              <span className="ov-next-when">{when(next.date)}</span>
              <span className="ov-next-teams">
                {next.team} <span>vs</span> {next.opponent}
              </span>
              <span className="ov-next-event">
                {[next.event, FORMAT_LABEL[next.format]].filter(Boolean).join(', ')}
              </span>
              <span className="ov-next-cta">Enter result</span>
            </button>
          )}

          <ul className="ov-list">
            {matches === null && <li className="ov-empty">Loading…</li>}
            {matches !== null && filtered.length === 0 && (
              <li className="ov-empty">
                No matches yet. Add the last series you played, or schedule the next one.
              </li>
            )}
            {filtered
              .filter((m) => m !== next)
              .map((m) => {
                const s = summarize(m);
                return (
                  <li key={m.id} className="ov-item">
                    <button type="button" className={`ov-row is-${s.result}`} onClick={() => setEditing(m)}>
                      <span className="ov-row-date">{new Date(m.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                      <span className="ov-row-main">
                        <span className="ov-row-teams">
                          <span className="ov-row-us">{m.team}</span> vs {m.opponent}
                        </span>
                        <span className="ov-row-event">{m.event || FORMAT_LABEL[m.format]}</span>
                      </span>
                      <span className="ov-row-games" aria-label="Game scores">
                        {m.games.slice(0, 7).map((g) => (
                          <span key={g.id} className={g.us > g.them ? 'is-win' : g.them > g.us ? 'is-loss' : ''}>
                            {g.us}-{g.them}
                            {g.ot && <sup>OT</sup>}
                          </span>
                        ))}
                      </span>
                      <span className="ov-row-score">
                        {s.result === 'upcoming' ? (
                          <span className="ov-row-tag">Upcoming</span>
                        ) : s.result === 'live' ? (
                          <>
                            {s.usWins}–{s.themWins} <span className="ov-row-tag">Unfinished</span>
                          </>
                        ) : (
                          <>
                            {m.forfeit ? 'FF' : `${s.usWins}–${s.themWins}`}
                            <span className={`ov-row-wl is-${s.result}`}>{s.result === 'win' ? 'W' : 'L'}</span>
                          </>
                        )}
                      </span>
                    </button>
                    {m.vodUrl && (
                      <a className="ov-row-vod" href={m.vodUrl} target="_blank" rel="noreferrer noopener" aria-label={`Watch VOD vs ${m.opponent}`}>
                        <PlayCircle size={15} />
                      </a>
                    )}
                  </li>
                );
              })}
          </ul>
        </section>
      </div>

      <aside className="ov-side">
        <StaffNotes />
      </aside>

      {editing && (
        <MatchEditor
          match={editing === 'new' ? null : editing}
          defaultTeam={team === 'all' ? 'Fazix Pro' : team}
          onClose={() => setEditing(null)}
          onSaved={saved}
          onDeleted={(id) => {
            setMatches((list) => (list || []).filter((x) => x.id !== id));
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
