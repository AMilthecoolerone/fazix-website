'use client';

import { useState } from 'react';
import type { JobQuestion } from '@/lib/jobs';
import { CheckCircle2 } from 'lucide-react';

interface Props {
  jobId: string;
  questions: JobQuestion[];
  defaults?: { name: string; discord: string; email: string };
}

export function JobApplyForm({ jobId, questions, defaults }: Props) {
  const [name, setName] = useState(defaults?.name ?? '');
  const [discord, setDiscord] = useState(defaults?.discord ?? '');
  const [email, setEmail] = useState(defaults?.email ?? '');
  const [answers, setAnswers] = useState<Record<string, string | boolean>>({});
  const [website, setWebsite] = useState(''); // honeypot
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);

  const set = (id: string, v: string | boolean) => setAnswers((a) => ({ ...a, [id]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState('sending');
    setError(null);
    try {
      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, discord, email, answers, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      setState('done');
    } catch (err) {
      setError((err as Error).message);
      setState('idle');
    }
  }

  if (state === 'done') {
    return (
      <div className="job-form-done">
        <CheckCircle2 size={28} color="#22C55E" />
        <div>
          <strong>Application sent.</strong>
          <p>Thanks! The team reviews every application and will reach out on Discord.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="job-form">
      <div className="job-form-row">
        <label>
          <span>Name *</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
        </label>
        <label>
          <span>Discord username *</span>
          <input required value={discord} onChange={(e) => setDiscord(e.target.value)} maxLength={80} />
        </label>
      </div>
      <label>
        <span>Email (optional)</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={160} />
      </label>

      {questions.map((q) => {
        const label = `${q.label}${q.required ? ' *' : ''}`;
        const value = (answers[q.id] as string) ?? '';
        if (q.type === 'checkbox') {
          return (
            <label key={q.id} className="job-form-check">
              <input type="checkbox" checked={answers[q.id] === true} onChange={(e) => set(q.id, e.target.checked)} required={q.required} />
              <span>{label}</span>
            </label>
          );
        }
        return (
          <label key={q.id}>
            <span>{label}</span>
            {q.type === 'long' ? (
              <textarea rows={5} required={q.required} value={value} placeholder={q.placeholder} onChange={(e) => set(q.id, e.target.value)} maxLength={4000} />
            ) : q.type === 'select' ? (
              <select required={q.required} value={value} onChange={(e) => set(q.id, e.target.value)}>
                <option value="">Choose…</option>
                {(q.options || []).map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            ) : (
              <input
                type={q.type === 'number' ? 'number' : q.type === 'url' ? 'url' : 'text'}
                required={q.required}
                value={value}
                placeholder={q.placeholder || (q.type === 'url' ? 'https://' : undefined)}
                onChange={(e) => set(q.id, e.target.value)}
                maxLength={500}
              />
            )}
          </label>
        );
      })}

      <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={website} onChange={(e) => setWebsite(e.target.value)} style={{ position: 'absolute', left: '-9999px' }} />

      {error && <p className="job-form-error">{error}</p>}
      <button type="submit" className="job-form-submit" disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : 'Submit application'}
      </button>
    </form>
  );
}
