'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Save, Trash2, ArrowUp, ArrowDown, X, ExternalLink, Inbox, Briefcase } from 'lucide-react';
import type { Job, JobQuestion, QuestionType, JobApplication, ApplicationStatus, JobStatus } from '@/lib/jobs';
import { api, timeAgo } from './api';

type JobDraft = Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>;

const EMPTY_JOB: JobDraft = {
  title: '',
  department: 'Staff',
  type: 'Volunteer',
  location: 'Remote',
  summary: '',
  description: '',
  requirements: [],
  status: 'draft',
  questions: [
    { id: 'q_age', label: 'How old are you?', type: 'number', required: true },
    { id: 'q_why', label: 'Why do you want to join FAZIX?', type: 'long', required: true },
  ],
};

const Q_LABEL: Record<QuestionType, string> = { short: 'Short text', long: 'Paragraph', number: 'Number', url: 'Link', select: 'Dropdown', checkbox: 'Checkbox' };
const JOB_PILL: Record<JobStatus, string> = { open: 'green', closed: 'red', draft: '' };
const APP_PILL: Record<ApplicationStatus, string> = { new: 'blue', reviewing: 'amber', interview: 'violet', accepted: 'green', rejected: 'red' };
const APP_STATUSES: ApplicationStatus[] = ['new', 'reviewing', 'interview', 'accepted', 'rejected'];

const qid = () => `q_${Math.random().toString(36).slice(2, 9)}`;

export function JobsPanel({ canEdit, search }: { canEdit: boolean; search: string }) {
  const [view, setView] = useState<'applications' | 'jobs'>('applications');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [apps, setApps] = useState<JobApplication[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [j, a] = await Promise.all([
        api<{ jobs: Job[] }>('/api/jobs?all=1'),
        api<{ applications: JobApplication[] }>('/api/dashboard/applications'),
      ]);
      setJobs(j.jobs);
      setApps(a.applications);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const newCount = apps.filter((a) => a.status === 'new').length;

  return (
    <div className="dx">
      <div className="dx-bar">
        <div>
          <h2 className="dx-h">Jobs & applications</h2>
          <p className="dx-sub">
            Post positions on <a href="/jobs" target="_blank" rel="noreferrer" style={{ color: '#fff' }}>/jobs</a> with your own questions, then review who applied.
          </p>
        </div>
        <div className="dx-tabs">
          <button className={`dx-tab ${view === 'applications' ? 'is-active' : ''}`} onClick={() => setView('applications')}>
            Applications{newCount > 0 ? ` (${newCount} new)` : ''}
          </button>
          <button className={`dx-tab ${view === 'jobs' ? 'is-active' : ''}`} onClick={() => setView('jobs')}>
            Job posts ({jobs.length})
          </button>
        </div>
      </div>
      {!canEdit && <div className="dx-note">You&apos;re viewing as a demo account, so editing is turned off.</div>}
      {error && <div className="dx-error">{error}</div>}
      {loading ? (
        <div className="dx-card dx-empty">Loading…</div>
      ) : view === 'jobs' ? (
        <JobEditor jobs={jobs} setJobs={setJobs} apps={apps} canEdit={canEdit} search={search} setError={setError} />
      ) : (
        <ApplicationReview apps={apps} setApps={setApps} jobs={jobs} canEdit={canEdit} search={search} setError={setError} />
      )}
    </div>
  );
}

function JobEditor({
  jobs,
  setJobs,
  apps,
  canEdit,
  search,
  setError,
}: {
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  apps: JobApplication[];
  canEdit: boolean;
  search: string;
  setError: (e: string | null) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | 'new' | null>(null);
  const [draft, setDraft] = useState<JobDraft>(EMPTY_JOB);
  const [reqText, setReqText] = useState('');
  const [saving, setSaving] = useState(false);

  const visible = jobs.filter((j) => !search || `${j.title} ${j.department}`.toLowerCase().includes(search.toLowerCase()));

  function select(id: string | 'new') {
    const job = jobs.find((j) => j.id === id);
    const d: JobDraft = job
      ? { title: job.title, department: job.department, type: job.type, location: job.location, summary: job.summary, description: job.description, requirements: job.requirements, status: job.status, questions: job.questions }
      : { ...EMPTY_JOB, questions: EMPTY_JOB.questions.map((q) => ({ ...q, id: qid() })) };
    setSelectedId(id);
    setDraft(d);
    setReqText(d.requirements.join('\n'));
  }

  const setQ = (i: number, patch: Partial<JobQuestion>) => setDraft((d) => ({ ...d, questions: d.questions.map((q, k) => (k === i ? { ...q, ...patch } : q)) }));
  const moveQ = (i: number, dir: -1 | 1) =>
    setDraft((d) => {
      const qs = [...d.questions];
      const j = i + dir;
      if (j < 0 || j >= qs.length) return d;
      [qs[i], qs[j]] = [qs[j], qs[i]];
      return { ...d, questions: qs };
    });

  async function save() {
    setSaving(true);
    setError(null);
    const body = { ...draft, requirements: reqText.split('\n').map((r) => r.trim()).filter(Boolean) };
    try {
      const { job } =
        selectedId === 'new'
          ? await api<{ job: Job }>('/api/jobs', { method: 'POST', body })
          : await api<{ job: Job }>(`/api/jobs/${selectedId}`, { method: 'PATCH', body });
      setJobs((list) => (list.some((j) => j.id === job.id) ? list.map((j) => (j.id === job.id ? job : j)) : [job, ...list]));
      setSelectedId(job.id);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    const job = jobs.find((j) => j.id === selectedId);
    if (!job || !confirm(`Delete "${job.title}"? Applications already received are kept.`)) return;
    try {
      await api(`/api/jobs/${job.id}`, { method: 'DELETE' });
      setJobs((list) => list.filter((j) => j.id !== job.id));
      setSelectedId(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div className="dx-split">
      <div className="dx-card" style={{ padding: 10 }}>
        {canEdit && (
          <button className="dx-btn primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 10 }} onClick={() => select('new')}>
            <Plus size={14} /> New job
          </button>
        )}
        <div className="dx-list">
          {visible.length === 0 && <div className="dx-empty">No jobs yet.</div>}
          {visible.map((j) => (
            <button key={j.id} className={`dx-item ${selectedId === j.id ? 'is-active' : ''}`} onClick={() => select(j.id)}>
              <span className="dx-item-title">{j.title}</span>
              <span className="dx-meta">
                <span className={`dx-pill ${JOB_PILL[j.status]}`}>{j.status}</span>
                <span>{j.department}</span>
                <span>{apps.filter((a) => a.jobId === j.id).length} applied</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="dx-card">
        {!selectedId ? (
          <div className="dx-empty">
            <Briefcase size={22} style={{ marginBottom: 8 }} />
            <div>Pick a job to edit, or create a new one.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="dx-bar">
              <h3 className="dx-h">{selectedId === 'new' ? 'New job' : 'Edit job'}</h3>
              <div style={{ display: 'flex', gap: 6 }}>
                {selectedId !== 'new' && draft.status === 'open' && (
                  <a className="dx-btn ghost" href={`/jobs/${selectedId}`} target="_blank" rel="noreferrer">
                    <ExternalLink size={13} /> View
                  </a>
                )}
                {selectedId !== 'new' && (
                  <button className="dx-btn ghost" disabled={!canEdit} onClick={remove} title="Delete">
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
            <div className="dx-grid2">
              <label className="dx-field">
                Title
                <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Video Editor" maxLength={120} />
              </label>
              <label className="dx-field">
                Status
                <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as JobStatus })}>
                  <option value="draft">Draft (hidden)</option>
                  <option value="open">Open (accepting applications)</option>
                  <option value="closed">Closed</option>
                </select>
              </label>
            </div>
            <div className="dx-grid3">
              <label className="dx-field">
                Department
                <input value={draft.department} onChange={(e) => setDraft({ ...draft, department: e.target.value })} list="dx-departments" maxLength={60} />
                <datalist id="dx-departments">
                  {['Staff', 'Content', 'Esports', 'Management', 'Design', 'Development'].map((d) => (
                    <option key={d} value={d} />
                  ))}
                </datalist>
              </label>
              <label className="dx-field">
                Type
                <input value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })} maxLength={60} />
              </label>
              <label className="dx-field">
                Location
                <input value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} maxLength={60} />
              </label>
            </div>
            <label className="dx-field">
              Short summary (shown in the list)
              <input value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} maxLength={300} />
            </label>
            <label className="dx-field">
              Description
              <textarea rows={6} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
            </label>
            <label className="dx-field">
              Requirements (one per line)
              <textarea rows={4} value={reqText} onChange={(e) => setReqText(e.target.value)} />
            </label>

            <div className="dx-bar" style={{ marginTop: 6 }}>
              <h3 className="dx-h" style={{ fontSize: '0.9rem' }}>Application questions</h3>
              <span className="dx-sub">Name and Discord are always asked.</span>
            </div>
            {draft.questions.map((q, i) => (
              <div key={q.id} className="dx-q">
                <input className="dx-input" value={q.label} placeholder="Question" onChange={(e) => setQ(i, { label: e.target.value })} maxLength={200} />
                <select className="dx-input" value={q.type} onChange={(e) => setQ(i, { type: e.target.value as QuestionType })}>
                  {Object.entries(Q_LABEL).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
                <label className="dx-check">
                  <input type="checkbox" checked={q.required} onChange={(e) => setQ(i, { required: e.target.checked })} /> Required
                </label>
                <span style={{ display: 'flex', gap: 2 }}>
                  <button className="dx-btn ghost" style={{ padding: '0 6px' }} onClick={() => moveQ(i, -1)} disabled={i === 0} title="Move up"><ArrowUp size={13} /></button>
                  <button className="dx-btn ghost" style={{ padding: '0 6px' }} onClick={() => moveQ(i, 1)} disabled={i === draft.questions.length - 1} title="Move down"><ArrowDown size={13} /></button>
                  <button className="dx-btn ghost" style={{ padding: '0 6px' }} onClick={() => setDraft((d) => ({ ...d, questions: d.questions.filter((_, k) => k !== i) }))} title="Remove"><X size={13} /></button>
                </span>
                {q.type === 'select' && (
                  <input
                    className="dx-input"
                    style={{ gridColumn: '1 / -1' }}
                    placeholder="Options, comma separated (e.g. EU, NA, OCE)"
                    defaultValue={(q.options || []).join(', ')}
                    onBlur={(e) => setQ(i, { options: e.target.value.split(',').map((o) => o.trim()).filter(Boolean) })}
                  />
                )}
              </div>
            ))}
            <button className="dx-btn" style={{ alignSelf: 'flex-start' }} onClick={() => setDraft((d) => ({ ...d, questions: [...d.questions, { id: qid(), label: '', type: 'short', required: false }] }))}>
              <Plus size={13} /> Add question
            </button>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="dx-btn primary" disabled={!canEdit || saving || !draft.title} onClick={save}>
                <Save size={14} /> {saving ? 'Saving…' : selectedId === 'new' ? 'Create job' : 'Save changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ApplicationReview({
  apps,
  setApps,
  jobs,
  canEdit,
  search,
  setError,
}: {
  apps: JobApplication[];
  setApps: React.Dispatch<React.SetStateAction<JobApplication[]>>;
  jobs: Job[];
  canEdit: boolean;
  search: string;
  setError: (e: string | null) => void;
}) {
  const [statusFilter, setStatusFilter] = useState<'active' | ApplicationStatus | 'all'>('active');
  const [jobFilter, setJobFilter] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const visible = useMemo(
    () =>
      apps.filter(
        (a) =>
          (statusFilter === 'all' || (statusFilter === 'active' ? !['accepted', 'rejected'].includes(a.status) : a.status === statusFilter)) &&
          (!jobFilter || a.jobId === jobFilter) &&
          (!search || `${a.applicant.name} ${a.applicant.discord} ${a.jobTitle}`.toLowerCase().includes(search.toLowerCase()))
      ),
    [apps, statusFilter, jobFilter, search]
  );
  const selected = apps.find((a) => a.id === selectedId);

  async function patch(id: string, body: { status?: ApplicationStatus; staffNotes?: string }) {
    try {
      const { application } = await api<{ application: JobApplication }>(`/api/dashboard/applications/${id}`, { method: 'PATCH', body });
      setApps((list) => list.map((a) => (a.id === id ? application : a)));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this application permanently?')) return;
    try {
      await api(`/api/dashboard/applications/${id}`, { method: 'DELETE' });
      setApps((list) => list.filter((a) => a.id !== id));
      setSelectedId(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div className="dx-split">
      <div className="dx-card" style={{ padding: 10 }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          <select className="dx-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}>
            <option value="active">Open (to do)</option>
            <option value="all">All</option>
            {APP_STATUSES.map((s) => (
              <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <select className="dx-input" value={jobFilter} onChange={(e) => setJobFilter(e.target.value)}>
            <option value="">All jobs</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </select>
        </div>
        <div className="dx-list">
          {visible.length === 0 && (
            <div className="dx-empty">
              <Inbox size={22} style={{ marginBottom: 8 }} />
              <div>No applications here.</div>
            </div>
          )}
          {visible.map((a) => (
            <button
              key={a.id}
              className={`dx-item ${selectedId === a.id ? 'is-active' : ''}`}
              onClick={() => {
                setSelectedId(a.id);
                setNotes(a.staffNotes);
              }}
            >
              <span className="dx-item-title">{a.applicant.name}</span>
              <span className="dx-meta">
                <span className={`dx-pill ${APP_PILL[a.status]}`}>{a.status}</span>
                <span>{a.jobTitle}</span>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="dx-bar">
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                {selected.applicant.avatarUrl && <img src={selected.applicant.avatarUrl} alt="" width={36} height={36} style={{ borderRadius: '50%' }} />}
                <div>
                  <h3 className="dx-h">{selected.applicant.name}</h3>
                  <p className="dx-sub">
                    {selected.applicant.discord}
                    {selected.applicant.discordId && ' · verified via Discord login'}
                    {selected.applicant.email && ` · ${selected.applicant.email}`}
                  </p>
                </div>
              </div>
              <button className="dx-btn ghost" disabled={!canEdit} onClick={() => remove(selected.id)} title="Delete">
                <Trash2 size={13} />
              </button>
            </div>
            <div className="dx-meta">
              Applied for <strong style={{ color: '#fff' }}>{selected.jobTitle}</strong> · {timeAgo(selected.createdAt)}
              {selected.reviewedBy && ` · last updated by ${selected.reviewedBy}`}
            </div>
            <div className="dx-tabs">
              {APP_STATUSES.map((s) => (
                <button key={s} className={`dx-tab ${selected.status === s ? 'is-active' : ''}`} disabled={!canEdit} onClick={() => patch(selected.id, { status: s })}>
                  {s[0].toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            <dl style={{ margin: 0 }}>
              {selected.answers.map((ans) => (
                <div key={ans.questionId} className="dx-qa">
                  <dt>{ans.label}</dt>
                  <dd>
                    {/^https?:\/\//.test(ans.value) ? (
                      <a href={ans.value} target="_blank" rel="noreferrer noopener">{ans.value}</a>
                    ) : (
                      ans.value || <span style={{ color: '#6E6E7C' }}>No answer</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <label className="dx-field">
              Staff notes (only staff see these)
              <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </label>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="dx-btn" disabled={!canEdit || notes === selected.staffNotes} onClick={() => patch(selected.id, { staffNotes: notes })}>
                <Save size={13} /> Save notes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
