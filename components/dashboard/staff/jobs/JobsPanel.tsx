'use client';

import { useCallback, useEffect, useState } from 'react';
import { Briefcase, Plus } from 'lucide-react';
import { JOB_TEMPLATES, blankSections, slugify, type Application, type Job } from '@/lib/careerForm';
import { JobEditor, toDraft, type JobDraft } from './JobEditor';
import { ApplicationsView } from './ApplicationsView';
import { api, timeAgo } from '../api';

const STATUS_PILL = { open: 'green', closed: 'red', draft: '' } as const;

function draftFromTemplate(id: string | null): JobDraft {
  const t = JOB_TEMPLATES.find((x) => x.id === id);
  const base: JobDraft = {
    title: '',
    slug: '',
    department: 'Staff',
    employmentType: 'Volunteer',
    location: 'Remote',
    commitment: '',
    summary: '',
    about: '',
    responsibilities: [],
    requirements: [],
    niceToHave: [],
    perks: [],
    status: 'draft',
    closesAt: null,
    requireDiscord: true,
    sections: t ? t.sections() : blankSections(),
  };
  const merged = { ...base, ...(t?.job || {}) } as JobDraft;
  return { ...merged, slug: slugify(merged.title) };
}

export function JobsPanel({ search }: { search: string }) {
  const [view, setView] = useState<'applications' | 'jobs'>('applications');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ job: Job | null; initial: JobDraft; key: string } | null>(null);
  const [picking, setPicking] = useState(false);
  const [dirty, setDirty] = useState(false);

  const load = useCallback(async () => {
    try {
      const [j, a] = await Promise.all([api<{ jobs: Job[] }>('/api/dashboard/jobs'), api<{ applications: Application[] }>('/api/dashboard/applications')]);
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

  // Warn before leaving the page with unsaved job edits.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  const leaveOk = () => !dirty || confirm('You have unsaved changes to this job. Discard them?');

  function openJob(j: Job) {
    if (editing?.job?.id === j.id || !leaveOk()) return;
    setPicking(false);
    setEditing({ job: j, initial: toDraft(j), key: j.id + j.updatedAt });
  }

  function startNew(templateId: string | null) {
    setPicking(false);
    setEditing({ job: null, initial: draftFromTemplate(templateId), key: `new-${Date.now()}` });
  }

  const newCount = apps.filter((a) => a.status === 'new').length;
  const visibleJobs = jobs.filter((j) => !search || `${j.title} ${j.department}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="dx">
      <div className="dx-bar">
        <p className="dx-sub" style={{ margin: 0 }}>
          Open roles show on{' '}
          <a href="/careers" target="_blank" rel="noreferrer" style={{ color: '#fff' }}>
            /careers
          </a>
          , linked from Careers &amp; Staff in the menu.
        </p>
        <div className="dx-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={view === 'applications'} className={`dx-tab ${view === 'applications' ? 'is-active' : ''}`} onClick={() => setView('applications')}>
            Applications{newCount ? ` (${newCount} new)` : ''}
          </button>
          <button type="button" role="tab" aria-selected={view === 'jobs'} className={`dx-tab ${view === 'jobs' ? 'is-active' : ''}`} onClick={() => setView('jobs')}>
            Jobs ({jobs.length})
          </button>
        </div>
      </div>
      {error && <div className="dx-error">{error}</div>}

      {loading ? (
        <div className="dx-card dx-empty">Loading…</div>
      ) : view === 'applications' ? (
        <ApplicationsView apps={apps} setApps={setApps} jobs={jobs} search={search} setError={setError} />
      ) : (
        <div className="jb-layout">
          <div className="dx-card jb-joblist">
            <button type="button" className="dx-btn primary jb-new" onClick={() => leaveOk() && (setEditing(null), setPicking(true))}>
              <Plus size={14} /> New job
            </button>
            <div className="dx-list">
              {visibleJobs.length === 0 && <div className="dx-empty">No jobs yet.</div>}
              {visibleJobs.map((j) => {
                const count = apps.filter((a) => a.jobId === j.id).length;
                return (
                  <button key={j.id} type="button" className={`dx-item ${editing?.job?.id === j.id ? 'is-active' : ''}`} onClick={() => openJob(j)}>
                    <span className="dx-item-title">{j.title}</span>
                    <span className="dx-meta">
                      <span className={`dx-pill ${STATUS_PILL[j.status]}`}>{j.status}</span>
                      <span>{j.department}</span>
                      <span>{count} {count === 1 ? 'applicant' : 'applicants'}</span>
                    </span>
                    <span className="dx-meta">Edited {timeAgo(j.updatedAt)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="dx-card jb-main">
            {picking ? (
              <div className="jb-templates">
                <h3 className="dx-h">Start from a template</h3>
                <p className="dx-sub">Everything is editable afterwards.</p>
                <div className="jb-template-grid">
                  {JOB_TEMPLATES.map((t) => (
                    <button key={t.id} type="button" onClick={() => startNew(t.id)}>
                      <strong>{t.name}</strong>
                      <span>{t.description}</span>
                      <small>{t.sections().reduce((n, s) => n + s.questions.length, 0)} questions in {t.sections().length} steps</small>
                    </button>
                  ))}
                  <button type="button" className="is-blank" onClick={() => startNew(null)}>
                    <strong>Blank job</strong>
                    <span>Start with one question</span>
                  </button>
                </div>
              </div>
            ) : editing ? (
              <JobEditor
                key={editing.key}
                job={editing.job}
                initial={editing.initial}
                onDirtyChange={setDirty}
                onSaved={(j) => {
                  setJobs((list) => (list.some((x) => x.id === j.id) ? list.map((x) => (x.id === j.id ? j : x)) : [j, ...list]));
                  setEditing({ job: j, initial: toDraft(j), key: j.id + j.updatedAt });
                }}
                onDeleted={(id) => {
                  setJobs((list) => list.filter((x) => x.id !== id));
                  setEditing(null);
                  setDirty(false);
                }}
              />
            ) : (
              <div className="dx-empty">
                <Briefcase size={22} style={{ marginBottom: 8 }} />
                <div>Pick a job to edit, or create a new one.</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
