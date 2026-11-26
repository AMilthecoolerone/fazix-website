'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Pencil } from 'lucide-react';
import { DiscordIcon } from '@/components/icons/DiscordIcon';
import { prepareDing, playDing } from '@/lib/ding';
import {
  allQuestions,
  formatAnswer,
  isVisible,
  validateSection,
  type Answers,
  type AnswerValue,
  type FormSection,
  type Question,
} from '@/lib/careerForm';

export interface Applicant {
  name: string;
  username: string;
  avatarUrl?: string;
  email?: string;
}

interface Props {
  slug: string;
  jobTitle: string;
  sections: FormSection[];
  applicant: Applicant | null; // logged-in Discord user
  requireDiscord: boolean;
  preview?: boolean; // dashboard preview: no saving, no submit
}

const DETAILS = '__details';

function Field({ q, value, error, onChange }: { q: Question; value: AnswerValue | undefined; error?: string; onChange: (v: AnswerValue) => void }) {
  const id = `f-${q.id}`;
  const describedBy = [q.help && `${id}-help`, error && `${id}-err`].filter(Boolean).join(' ') || undefined;
  const str = typeof value === 'string' ? value : '';
  const common = { id, 'aria-invalid': Boolean(error) || undefined, 'aria-describedby': describedBy };

  let control: React.ReactNode;
  switch (q.type) {
    case 'long_text':
      control = <textarea {...common} rows={5} value={str} placeholder={q.placeholder} maxLength={q.maxLength || 4000} onChange={(e) => onChange(e.target.value)} />;
      break;
    case 'yes_no':
    case 'single_choice':
      control = (
        <div className="af-choices" role="radiogroup" aria-labelledby={`${id}-label`} aria-describedby={describedBy}>
          {(q.type === 'yes_no' ? ['Yes', 'No'] : q.options || []).map((o) => (
            <label key={o} className={`af-choice ${str === o ? 'is-on' : ''}`}>
              <input type="radio" name={id} checked={str === o} onChange={() => onChange(o)} />
              <span>{o}</span>
            </label>
          ))}
        </div>
      );
      break;
    case 'multi_choice': {
      const arr = Array.isArray(value) ? value : [];
      control = (
        <div className="af-choices" role="group" aria-labelledby={`${id}-label`} aria-describedby={describedBy}>
          {(q.options || []).map((o) => (
            <label key={o} className={`af-choice is-check ${arr.includes(o) ? 'is-on' : ''}`}>
              <input type="checkbox" checked={arr.includes(o)} onChange={(e) => onChange(e.target.checked ? [...arr, o] : arr.filter((x) => x !== o))} />
              <span>{o}</span>
            </label>
          ))}
        </div>
      );
      break;
    }
    case 'dropdown':
      control = (
        <select {...common} value={str} onChange={(e) => onChange(e.target.value)}>
          <option value="">Choose…</option>
          {(q.options || []).map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      );
      break;
    case 'scale': {
      const min = q.min ?? 1;
      const max = q.max ?? 5;
      control = (
        <div className="af-scale" role="radiogroup" aria-labelledby={`${id}-label`} aria-describedby={describedBy}>
          {Array.from({ length: max - min + 1 }, (_, i) => String(min + i)).map((n) => (
            <label key={n} className={str === n ? 'is-on' : ''}>
              <input type="radio" name={id} checked={str === n} onChange={() => onChange(n)} />
              <span>{n}</span>
            </label>
          ))}
        </div>
      );
      break;
    }
    case 'consent':
      return (
        <div className={`af-q ${error ? 'has-error' : ''}`}>
          <label className="af-consent">
            <input type="checkbox" {...common} checked={value === 'Yes'} onChange={(e) => onChange(e.target.checked ? 'Yes' : '')} />
            <span id={`${id}-label`}>{q.label}</span>
          </label>
          {q.help && <p id={`${id}-help`} className="af-help">{q.help}</p>}
          {error && <p id={`${id}-err`} className="af-err">{error}</p>}
        </div>
      );
    default:
      control = (
        <input
          {...common}
          type={q.type === 'email' ? 'email' : q.type === 'url' ? 'url' : q.type === 'date' ? 'date' : q.type === 'number' ? 'number' : 'text'}
          inputMode={q.type === 'number' ? 'numeric' : undefined}
          min={q.min}
          max={q.max}
          value={str}
          placeholder={q.placeholder || (q.type === 'url' ? 'https://' : undefined)}
          maxLength={q.type === 'short_text' ? q.maxLength || 200 : undefined}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }

  return (
    <div className={`af-q ${error ? 'has-error' : ''}`}>
      <label id={`${id}-label`} htmlFor={id} className="af-label">
        {q.label}
        {!q.required && <span className="af-optional"> (optional)</span>}
      </label>
      {q.help && <p id={`${id}-help`} className="af-help">{q.help}</p>}
      {control}
      {error && <p id={`${id}-err`} className="af-err">{error}</p>}
    </div>
  );
}

export function ApplicationForm({ slug, jobTitle, sections, applicant, requireDiscord, preview }: Props) {
  const storageKey = `fazix-apply-${slug}`;
  const all = useMemo(() => allQuestions({ sections }), [sections]);
  const steps = useMemo(() => [{ id: DETAILS, title: 'Your details' }, ...sections.map((s) => ({ id: s.id, title: s.title })), { id: 'review', title: 'Review' }], [sections]);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [details, setDetails] = useState({ name: applicant?.name || '', discord: applicant?.username || '', email: applicant?.email || '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [website, setWebsite] = useState('');
  const topRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  // Bring the success message into view and move focus to it for screen readers.
  useEffect(() => {
    if (state !== 'done') return;
    doneRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    doneRef.current?.focus({ preventScroll: true });
  }, [state]);

  // Restore a draft from this browser.
  useEffect(() => {
    if (preview) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const d = JSON.parse(raw);
        if (d.answers) setAnswers(d.answers);
        if (d.details && !applicant) setDetails((x) => ({ ...x, ...d.details }));
      }
    } catch {
      // storage unavailable; start fresh
    }
  }, [storageKey, preview, applicant]);

  useEffect(() => {
    if (preview || state === 'done') return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ answers, details }));
    } catch {
      // ignore
    }
  }, [answers, details, storageKey, preview, state]);

  if (requireDiscord && !applicant && !preview) {
    return (
      <div className="af-gate">
        <p>This position asks you to log in with Discord, so we know who&apos;s applying.</p>
        <a className="af-discord" href={`/api/auth/discord?next=${encodeURIComponent(`/careers/${slug}/apply`)}`}>
          <DiscordIcon size={18} /> Log in with Discord to apply
        </a>
      </div>
    );
  }

  const current = steps[step];
  const section = sections.find((s) => s.id === current.id);

  function go(to: number) {
    setStep(to);
    setErrors({});
    requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  function validateDetails(): Record<string, string> {
    const e: Record<string, string> = {};
    if (!applicant) {
      if (!details.name.trim()) e.name = 'Enter your name.';
      if (!details.discord.trim()) e.discord = 'Enter your Discord username.';
    }
    if (details.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) e.email = 'Enter a valid email address.';
    return e;
  }

  function next() {
    const e = current.id === DETAILS ? validateDetails() : section ? validateSection(section, answers, all) : {};
    setErrors(e);
    if (Object.keys(e).length) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>('.af-q.has-error input, .af-q.has-error textarea, .af-q.has-error select')?.focus());
      return;
    }
    go(step + 1);
  }

  async function submit() {
    if (preview) return;
    prepareDing(); // unlock audio while we still have the click
    setState('sending');
    setSubmitError(null);
    try {
      const res = await fetch(`/api/careers/${slug}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...details, answers, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Your application could not be sent. Try again in a minute.');
      setState('done');
      playDing(0.75); // lands as the tick draws in
      try {
        localStorage.removeItem(storageKey);
      } catch {
        // ignore
      }
    } catch (err) {
      setSubmitError((err as Error).message);
      setState('idle');
    }
  }

  if (state === 'done') {
    return (
      <div className="af-done is-sent" role="status" ref={doneRef} tabIndex={-1}>
        <svg className="af-check" viewBox="0 0 96 96" aria-hidden="true">
          <circle className="af-check-ring" cx="48" cy="48" r="44" />
          <circle className="af-check-circle" cx="48" cy="48" r="44" pathLength={1} />
          <path className="af-check-tick" d="M30 49.5 L42.5 62 L67 36" pathLength={1} />
        </svg>
        <h2>Application sent</h2>
        <p>
          Thanks for applying for {jobTitle}. The team reads every application and will contact you on Discord
          {details.discord ? ` (${details.discord})` : ''}.
        </p>
        <a href="/careers">See other open roles</a>
      </div>
    );
  }

  return (
    <div className="af" ref={topRef}>
      <ol className="af-steps" aria-label="Application progress">
        {steps.map((s, i) => (
          <li key={s.id} className={i < step ? 'is-done' : i === step ? 'is-current' : ''} aria-current={i === step ? 'step' : undefined}>
            <span className="af-steps-bar" />
            <span className="af-steps-name">{s.title}</span>
          </li>
        ))}
      </ol>
      <p className="af-count">
        Step {step + 1} of {steps.length}
      </p>

      <h2 className="af-title">{current.title}</h2>
      {section?.description && <p className="af-desc">{section.description}</p>}

      {current.id === DETAILS && (
        <div className="af-body">
          {applicant ? (
            <div className="af-me">
              {applicant.avatarUrl && <img src={applicant.avatarUrl} alt="" width={40} height={40} />}
              <div>
                <strong>{applicant.name}</strong>
                <span>Applying as @{applicant.username} on Discord</span>
              </div>
            </div>
          ) : (
            <>
              <div className={`af-q ${errors.name ? 'has-error' : ''}`}>
                <label htmlFor="af-name" className="af-label">Name</label>
                <input id="af-name" value={details.name} maxLength={80} autoComplete="name" onChange={(e) => setDetails({ ...details, name: e.target.value })} aria-invalid={Boolean(errors.name) || undefined} />
                {errors.name && <p className="af-err">{errors.name}</p>}
              </div>
              <div className={`af-q ${errors.discord ? 'has-error' : ''}`}>
                <label htmlFor="af-discord" className="af-label">Discord username</label>
                <p className="af-help">We&apos;ll contact you here. Or <a href={`/api/auth/discord?next=${encodeURIComponent(`/careers/${slug}/apply`)}`}>log in with Discord</a> to fill this in.</p>
                <input id="af-discord" value={details.discord} maxLength={80} onChange={(e) => setDetails({ ...details, discord: e.target.value })} aria-invalid={Boolean(errors.discord) || undefined} />
                {errors.discord && <p className="af-err">{errors.discord}</p>}
              </div>
            </>
          )}
          <div className={`af-q ${errors.email ? 'has-error' : ''}`}>
            <label htmlFor="af-email" className="af-label">
              Email <span className="af-optional">(optional)</span>
            </label>
            <input id="af-email" type="email" autoComplete="email" value={details.email} maxLength={160} onChange={(e) => setDetails({ ...details, email: e.target.value })} aria-invalid={Boolean(errors.email) || undefined} />
            {errors.email && <p className="af-err">{errors.email}</p>}
          </div>
        </div>
      )}

      {section && (
        <div className="af-body">
          {section.questions
            .filter((q) => isVisible(q, answers, all))
            .map((q) => (
              <Field key={q.id} q={q} value={answers[q.id]} error={errors[q.id]} onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))} />
            ))}
          {section.questions.length === 0 && <p className="af-desc">No questions in this step yet.</p>}
        </div>
      )}

      {current.id === 'review' && (
        <div className="af-body">
          <div className="af-review">
            <div className="af-review-head">
              <h3>Your details</h3>
              <button type="button" onClick={() => go(0)}>
                <Pencil size={13} /> Edit
              </button>
            </div>
            <dl>
              <dt>Name</dt>
              <dd>{details.name}</dd>
              <dt>Discord</dt>
              <dd>{details.discord}</dd>
              {details.email && (
                <>
                  <dt>Email</dt>
                  <dd>{details.email}</dd>
                </>
              )}
            </dl>
          </div>
          {sections.map((s, i) => (
            <div key={s.id} className="af-review">
              <div className="af-review-head">
                <h3>{s.title}</h3>
                <button type="button" onClick={() => go(i + 1)}>
                  <Pencil size={13} /> Edit
                </button>
              </div>
              <dl>
                {s.questions
                  .filter((q) => isVisible(q, answers, all) && q.type !== 'consent')
                  .map((q) => (
                    <div key={q.id} className="af-review-row">
                      <dt>{q.label}</dt>
                      <dd>{formatAnswer(answers[q.id]) || <span className="af-optional">No answer</span>}</dd>
                    </div>
                  ))}
              </dl>
            </div>
          ))}
          <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={website} onChange={(e) => setWebsite(e.target.value)} className="af-hp" />
          {submitError && <p className="af-err af-submit-err" role="alert">{submitError}</p>}
        </div>
      )}

      <div className="af-nav">
        {step > 0 ? (
          <button type="button" className="af-back" onClick={() => go(step - 1)}>
            <ArrowLeft size={16} /> Back
          </button>
        ) : (
          <span />
        )}
        {current.id === 'review' ? (
          <button type="button" className="af-next" onClick={submit} disabled={state === 'sending' || preview} title={preview ? 'Preview only' : undefined}>
            {preview ? 'Send application (preview)' : state === 'sending' ? 'Sending…' : 'Send application'}
          </button>
        ) : (
          <button type="button" className="af-next" onClick={next}>
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
