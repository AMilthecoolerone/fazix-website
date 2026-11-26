'use client';

import { useEffect, useMemo, useState } from 'react';
import { Eye, ExternalLink, Save, Trash2, X } from 'lucide-react';
import { PRESET_COMMITMENTS, PRESET_DEPARTMENTS, PRESET_LOCATIONS, PRESET_TYPES, slugify, type Job, type JobStatus } from '@/lib/careerForm';
import { ApplicationForm } from '@/components/careers/ApplicationForm';
import { FormBuilder } from './FormBuilder';
import { api } from '../api';

export type JobDraft = Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>;

export function toDraft(j: Job): JobDraft {
  const { id: _id, createdAt: _c, updatedAt: _u, createdBy: _b, ...rest } = j;
  return rest;
}

const STATUS_HELP: Record<JobStatus, string> = {
  draft: 'Only staff can see it.',
  open: 'Listed on /careers and accepting applications.',
  closed: 'Page stays up but nobody can apply.',
};

function PresetField({ label, value, onChange, presets, placeholder }: { label: string; value: string; onChange: (v: string) => void; presets: string[]; placeholder?: string }) {
  return (
    <div className="dx-field">
      <label>
        {label}
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={80} style={{ marginTop: 6 }} />
      </label>
      <div className="jb-presets" aria-label={`${label} presets`}>
        {presets.map((p) => (
          <button key={p} type="button" className={value === p ? 'is-on' : ''} aria-pressed={value === p} onClick={() => onChange(p)}>
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

function ListField({ label, value, onChange, placeholder }: { label: string; value: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [text, setText] = useState(value.join('\n'));
  useEffect(() => setText(value.join('\n')), [value]);
  return (
    <label className="dx-field">
      {label} <span className="jb-hint">One per line</span>
      <textarea
        rows={Math.max(3, value.length + 1)}
        value={text}
        placeholder={placeholder}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => onChange(text.split('\n').map((x) => x.trim()).filter(Boolean))}
      />
    </label>
  );
}

export function JobEditor({
  job,
  initial,
  onSaved,
  onDeleted,
  onDirtyChange,
}: {
  job: Job | null; // null = new, not saved yet
  initial: JobDraft;
  onSaved: (j: Job) => void;
  onDeleted: (id: string) => void;
  onDirtyChange: (dirty: boolean) => void;
}) {
  const [draft, setDraft] = useState<JobDraft>(initial);
  const [tab, setTab] = useState<'posting' | 'form' | 'settings'>('posting');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(job));

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(initial) || !job, [draft, initial, job]);
  useEffect(() => onDirtyChange(dirty), [dirty, onDirtyChange]);

  const set = (patch: Partial<JobDraft>) => setDraft((d) => ({ ...d, ...patch }));
  const questionCount = draft.sections.reduce((n, s) => n + s.questions.length, 0);
  const untitled = draft.sections.some((s) => s.questions.some((q) => !q.label.trim()));

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const { job: saved } = job
        ? await api<{ job: Job }>(`/api/dashboard/jobs/${job.id}`, { method: 'PATCH', body: draft })
        : await api<{ job: Job }>('/api/dashboard/jobs', { method: 'POST', body: draft });
      onSaved(saved);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!job || !confirm(`Delete "${job.title}"? Applications already received are kept.`)) return;
    try {
      await api(`/api/dashboard/jobs/${job.id}`, { method: 'DELETE' });
      onDeleted(job.id);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div className="jb-editor">
      <div className="jb-editor-head">
        <input className="jb-title" value={draft.title} onChange={(e) => set({ title: e.target.value, ...(slugTouched ? {} : { slug: slugify(e.target.value) }) })} placeholder="Job title" maxLength={120} aria-label="Job title" />
        <div className="jb-editor-actions">
          <select className={`dx-input jb-status is-${draft.status}`} value={draft.status} onChange={(e) => set({ status: e.target.value as JobStatus })} aria-label="Status" title={STATUS_HELP[draft.status]}>
            <option value="draft">Draft</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
          <button type="button" className="dx-btn" onClick={() => setPreview(true)}>
            <Eye size={14} /> Preview
          </button>
          {job && job.status !== 'draft' && (
            <a className="dx-btn ghost" href={`/careers/${job.slug}`} target="_blank" rel="noreferrer" aria-label="Open live page">
              <ExternalLink size={14} />
            </a>
          )}
          <button type="button" className="dx-btn primary" disabled={saving || !draft.title.trim() || !dirty} onClick={save}>
            <Save size={14} /> {saving ? 'Saving…' : job ? (dirty ? 'Save changes' : 'Saved') : 'Create job'}
          </button>
        </div>
      </div>
      <p className="jb-statusline">{STATUS_HELP[draft.status]}</p>
      {error && <div className="dx-error">{error}</div>}

      <div className="dx-tabs jb-tabs" role="tablist">
        {([
          ['posting', 'Job posting'],
          ['form', `Application form (${questionCount})`],
          ['settings', 'Settings'],
        ] as const).map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} className={`dx-tab ${tab === id ? 'is-active' : ''}`} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'posting' && (
        <div className="jb-grid">
          <div className="dx-grid2">
            <PresetField label="Department" value={draft.department} onChange={(v) => set({ department: v })} presets={PRESET_DEPARTMENTS} />
            <PresetField label="Type" value={draft.employmentType} onChange={(v) => set({ employmentType: v })} presets={PRESET_TYPES} />
            <PresetField label="Location" value={draft.location} onChange={(v) => set({ location: v })} presets={PRESET_LOCATIONS} />
            <PresetField label="Time commitment" value={draft.commitment} onChange={(v) => set({ commitment: v })} presets={PRESET_COMMITMENTS} placeholder="5–10 hours a week" />
          </div>
          <label className="dx-field">
            Summary <span className="jb-hint">Shown in the list on /careers</span>
            <input value={draft.summary} onChange={(e) => set({ summary: e.target.value })} maxLength={300} />
          </label>
          <label className="dx-field">
            About the role
            <textarea rows={5} value={draft.about} onChange={(e) => set({ about: e.target.value })} placeholder="What the team does and why this role matters." />
          </label>
          <div className="dx-grid2">
            <ListField label="What you'll do" value={draft.responsibilities} onChange={(v) => set({ responsibilities: v })} placeholder="Moderate chat and voice channels" />
            <ListField label="What we're looking for" value={draft.requirements} onChange={(v) => set({ requirements: v })} placeholder="16 or older" />
            <ListField label="Nice to have" value={draft.niceToHave} onChange={(v) => set({ niceToHave: v })} placeholder="Experience with Discord bots" />
            <ListField label="What you get" value={draft.perks} onChange={(v) => set({ perks: v })} placeholder="Staff role on the server" />
          </div>
        </div>
      )}

      {tab === 'form' && (
        <>
          {untitled && <div className="dx-note">Some questions have no text yet. They won&apos;t be saved until you write them.</div>}
          <FormBuilder sections={draft.sections} onChange={(sections) => set({ sections })} />
        </>
      )}

      {tab === 'settings' && (
        <div className="jb-grid">
          <label className="dx-field">
            Page address
            <span className="jb-slug">
              <span>/careers/</span>
              <input
                value={draft.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') });
                }}
                onBlur={() => set({ slug: slugify(draft.slug || draft.title) })}
                maxLength={60}
              />
            </span>
            {job && job.slug !== draft.slug && <span className="jb-hint">Changing this breaks links you already shared.</span>}
          </label>
          <label className="dx-field">
            Stop accepting applications on
            <input type="date" value={draft.closesAt ? draft.closesAt.slice(0, 10) : ''} onChange={(e) => set({ closesAt: e.target.value ? new Date(`${e.target.value}T23:59:59`).toISOString() : null })} />
            <span className="jb-hint">Leave empty to keep it open until you close it.</span>
          </label>
          <label className="dx-check jb-setting">
            <input type="checkbox" checked={draft.requireDiscord} onChange={(e) => set({ requireDiscord: e.target.checked })} />
            <span>
              <strong>Require Discord login to apply</strong>
              <small>You&apos;ll know exactly who applied, and each person can only apply once.</small>
            </span>
          </label>
          {job && (
            <div className="jb-danger">
              <button type="button" className="dx-btn danger" onClick={remove}>
                <Trash2 size={14} /> Delete job
              </button>
            </div>
          )}
        </div>
      )}

      {preview && (
        <div className="jb-preview" role="dialog" aria-modal="true" aria-label="Application preview" onMouseDown={(e) => e.target === e.currentTarget && setPreview(false)}>
          <div className="jb-preview-box">
            <div className="jb-preview-head">
              <span>Preview: what applicants see</span>
              <button type="button" className="dx-btn ghost" onClick={() => setPreview(false)} aria-label="Close preview">
                <X size={16} />
              </button>
            </div>
            <div className="jb-preview-body cr-page">
              <h1 className="cr-display cr-apply-title">{draft.title || 'Untitled job'}</h1>
              <ApplicationForm
                slug={draft.slug || 'preview'}
                jobTitle={draft.title}
                sections={draft.sections.map((s) => ({ ...s, questions: s.questions.filter((q) => q.label.trim()) }))}
                applicant={null}
                requireDiscord={false}
                preview
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
