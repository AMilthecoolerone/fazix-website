'use client';

import { useMemo, useState } from 'react';
import { Copy, Inbox, Star, Trash2, Check } from 'lucide-react';
import { APPLICATION_STATUSES, STATUS_LABEL, formatAnswer, type Application, type ApplicationStatus, type Job } from '@/lib/careerForm';
import { api, timeAgo } from '../api';

const PILL: Record<ApplicationStatus, string> = { new: 'blue', reviewing: 'amber', interview: 'violet', accepted: 'green', rejected: 'red' };

export function ApplicationsView({
  apps,
  setApps,
  jobs,
  search,
  setError,
}: {
  apps: Application[];
  setApps: React.Dispatch<React.SetStateAction<Application[]>>;
  jobs: Job[];
  search: string;
  setError: (e: string | null) => void;
}) {
  const [status, setStatus] = useState<ApplicationStatus | 'open' | 'all'>('open');
  const [jobId, setJobId] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  const scoped = useMemo(() => apps.filter((a) => !jobId || a.jobId === jobId), [apps, jobId]);
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: scoped.length, open: 0 };
    for (const a of scoped) {
      c[a.status] = (c[a.status] || 0) + 1;
      if (a.status !== 'accepted' && a.status !== 'rejected') c.open++;
    }
    return c;
  }, [scoped]);
  const visible = useMemo(
    () =>
      scoped.filter(
        (a) =>
          (status === 'all' || (status === 'open' ? a.status !== 'accepted' && a.status !== 'rejected' : a.status === status)) &&
          (!search || `${a.applicant.name} ${a.applicant.discord} ${a.jobTitle}`.toLowerCase().includes(search.toLowerCase()))
      ),
    [scoped, status, search]
  );
  const selected = apps.find((a) => a.id === selectedId);
  const sections = useMemo(() => {
    if (!selected) return [];
    const map = new Map<string, Application['answers']>();
    for (const a of selected.answers) map.set(a.section, [...(map.get(a.section) || []), a]);
    return Array.from(map.entries());
  }, [selected]);

  async function patch(id: string, body: { status?: ApplicationStatus; staffNotes?: string; rating?: number | null }) {
    try {
      const { application } = await api<{ application: Application }>(`/api/dashboard/applications/${id}`, { method: 'PATCH', body });
      setApps((list) => list.map((a) => (a.id === id ? application : a)));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this application permanently? This cannot be undone.')) return;
    try {
      await api(`/api/dashboard/applications/${id}`, { method: 'DELETE' });
      setApps((list) => list.filter((a) => a.id !== id));
      setSelectedId(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  function select(a: Application) {
    setSelectedId(a.id);
    setNotes(a.staffNotes);
    setCopied(false);
    if (a.status === 'new') patch(a.id, { status: 'reviewing' });
  }

  return (
    <div className="dx-split">
      <div className="dx-card jb-inbox">
        <select className="dx-input" value={jobId} onChange={(e) => setJobId(e.target.value)} aria-label="Filter by job">
          <option value="">All jobs</option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>{j.title}</option>
          ))}
        </select>
        <div className="jb-statuses" role="tablist" aria-label="Filter by status">
          {(['open', ...APPLICATION_STATUSES, 'all'] as const).map((s) => (
            <button key={s} type="button" role="tab" aria-selected={status === s} className={status === s ? 'is-on' : ''} onClick={() => setStatus(s)}>
              {s === 'open' ? 'To do' : s === 'all' ? 'All' : STATUS_LABEL[s]}
              <span>{counts[s] || 0}</span>
            </button>
          ))}
        </div>
        <div className="dx-list">
          {visible.length === 0 && (
            <div className="dx-empty">
              <Inbox size={22} style={{ marginBottom: 8 }} />
              <div>{apps.length === 0 ? 'No applications yet. Open a job to start receiving them.' : 'Nothing here.'}</div>
            </div>
          )}
          {visible.map((a) => (
            <button key={a.id} type="button" className={`dx-item ${selectedId === a.id ? 'is-active' : ''}`} onClick={() => select(a)}>
              <span className="dx-item-title">
                {a.status === 'new' && <span className="jb-dot" aria-label="Unread" />}
                {a.applicant.name}
              </span>
              <span className="dx-meta">
                <span className={`dx-pill ${PILL[a.status]}`}>{STATUS_LABEL[a.status]}</span>
                <span>{a.jobTitle}</span>
                {a.rating && <span>{'★'.repeat(a.rating)}</span>}
                <span>{timeAgo(a.createdAt)}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="dx-card">
        {!selected ? (
          <div className="dx-empty">Pick an application to read it.</div>
        ) : (
          <article className="jb-app">
            <header className="jb-app-head">
              {selected.applicant.avatarUrl ? <img src={selected.applicant.avatarUrl} alt="" width={44} height={44} /> : <span className="jb-avatar">{selected.applicant.name.slice(0, 1).toUpperCase()}</span>}
              <div className="jb-app-who">
                <h3>{selected.applicant.name}</h3>
                <p>
                  <button
                    type="button"
                    className="jb-copy"
                    onClick={() => {
                      navigator.clipboard?.writeText(selected.applicant.discord).catch(() => undefined);
                      setCopied(true);
                    }}
                    aria-label={`Copy Discord username ${selected.applicant.discord}`}
                  >
                    @{selected.applicant.discord} {copied ? <Check size={12} /> : <Copy size={12} />}
                  </button>
                  {selected.applicant.discordId ? <span className="dx-pill green">Verified Discord</span> : <span className="dx-pill">Not logged in</span>}
                </p>
                {selected.applicant.email && (
                  <p>
                    <a href={`mailto:${selected.applicant.email}`}>{selected.applicant.email}</a>
                  </p>
                )}
              </div>
              <button type="button" className="dx-btn ghost" onClick={() => remove(selected.id)} aria-label="Delete application">
                <Trash2 size={14} />
              </button>
            </header>
            <p className="jb-applied">
              Applied for <strong>{selected.jobTitle}</strong> on {new Date(selected.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>

            <div className="jb-pipeline" role="radiogroup" aria-label="Status">
              {APPLICATION_STATUSES.map((s) => (
                <button key={s} type="button" role="radio" aria-checked={selected.status === s} className={`is-${s} ${selected.status === s ? 'is-on' : ''}`} onClick={() => patch(selected.id, { status: s })}>
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>

            <div className="jb-rating" role="radiogroup" aria-label="Rating">
              <span>Rating</span>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={selected.rating === n}
                  aria-label={`${n} out of 5`}
                  className={(selected.rating || 0) >= n ? 'is-on' : ''}
                  onClick={() => patch(selected.id, { rating: selected.rating === n ? null : n })}
                >
                  <Star size={16} />
                </button>
              ))}
            </div>

            {sections.map(([title, answers]) => (
              <section key={title} className="jb-answers">
                <h4>{title}</h4>
                <dl>
                  {answers.map((a) => (
                    <div key={a.questionId} className="dx-qa">
                      <dt>{a.label}</dt>
                      <dd>
                        {a.type === 'url' && typeof a.value === 'string' && /^https?:\/\//.test(a.value) ? (
                          <a href={a.value} target="_blank" rel="noreferrer noopener">{a.value}</a>
                        ) : a.type === 'consent' ? (
                          a.value === 'Yes' ? 'Agreed' : 'Not agreed'
                        ) : (
                          formatAnswer(a.value) || <span style={{ color: '#6E6E7C' }}>No answer</span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}

            <label className="dx-field">
              Staff notes <span className="jb-hint">Only staff can see these</span>
              <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </label>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" className="dx-btn" disabled={notes === selected.staffNotes} onClick={() => patch(selected.id, { staffNotes: notes })}>
                Save notes
              </button>
            </div>

            {selected.history.length > 0 && (
              <section className="jb-history">
                <h4>History</h4>
                <ol>
                  {[...selected.history].reverse().map((h, i) => (
                    <li key={i}>
                      <span>{h.action}</span> by {h.by}, {timeAgo(h.at)}
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </article>
        )}
      </div>
    </div>
  );
}
