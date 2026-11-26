'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUp, Copy, GitBranch, GripVertical, Plus, Trash2, ChevronDown } from 'lucide-react';
import {
  CONDITION_SOURCES,
  HAS_OPTIONS,
  QUESTION_TYPES,
  TYPE_LABEL,
  conditionOptions,
  uid,
  type FormSection,
  type Question,
  type QuestionType,
} from '@/lib/careerForm';

interface Props {
  sections: FormSection[];
  onChange: (sections: FormSection[]) => void;
}

function newQuestion(type: QuestionType): Question {
  const q: Question = { id: uid('q'), type, label: '', required: true, showIf: null };
  if (HAS_OPTIONS.includes(type)) q.options = ['Option 1', 'Option 2'];
  if (type === 'scale') {
    q.min = 1;
    q.max = 5;
  }
  if (type === 'consent') q.label = 'I agree to FAZIX storing my answers to review this application.';
  return q;
}

export function FormBuilder({ sections, onChange }: Props) {
  const [open, setOpen] = useState<string | null>(null);
  const [adding, setAdding] = useState<string | null>(null); // section id with the type menu open
  const [drag, setDrag] = useState<{ section: string; index: number } | null>(null);
  const [over, setOver] = useState<string | null>(null);

  const all = sections.flatMap((s) => s.questions);
  const setSection = (sid: string, patch: Partial<FormSection>) => onChange(sections.map((s) => (s.id === sid ? { ...s, ...patch } : s)));
  const setQuestion = (sid: string, qid: string, patch: Partial<Question>) =>
    onChange(sections.map((s) => (s.id === sid ? { ...s, questions: s.questions.map((q) => (q.id === qid ? { ...q, ...patch } : q)) } : s)));

  function moveQuestion(sid: string, from: number, to: number) {
    const s = sections.find((x) => x.id === sid)!;
    if (to < 0 || to >= s.questions.length || from === to) return;
    const qs = [...s.questions];
    const [q] = qs.splice(from, 1);
    qs.splice(to, 0, q);
    setSection(sid, { questions: qs });
  }

  function moveToSection(fromSid: string, qid: string, toSid: string) {
    const q = sections.find((s) => s.id === fromSid)!.questions.find((x) => x.id === qid)!;
    onChange(
      sections.map((s) =>
        s.id === fromSid ? { ...s, questions: s.questions.filter((x) => x.id !== qid) } : s.id === toSid ? { ...s, questions: [...s.questions, q] } : s
      )
    );
  }

  function removeQuestion(sid: string, qid: string) {
    // Also clear conditions that pointed at this question.
    onChange(
      sections.map((s) => ({
        ...s,
        questions: s.questions.filter((q) => !(s.id === sid && q.id === qid)).map((q) => (q.showIf?.questionId === qid ? { ...q, showIf: null } : q)),
      }))
    );
  }

  function moveSection(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= sections.length) return;
    const next = [...sections];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="fb">
      <p className="dx-sub" style={{ margin: 0 }}>
        Each section is one step of the application. Name, Discord and email are always asked first.
      </p>

      {sections.map((s, si) => (
        <section key={s.id} className="fb-section" aria-label={`Step ${si + 2}: ${s.title}`}>
          <div className="fb-section-head">
            <span className="fb-step">Step {si + 2}</span>
            <input className="fb-section-title" value={s.title} onChange={(e) => setSection(s.id, { title: e.target.value })} placeholder="Section title" maxLength={120} aria-label="Section title" />
            <span className="fb-tools">
              <button type="button" onClick={() => moveSection(si, -1)} disabled={si === 0} aria-label="Move section up"><ArrowUp size={14} /></button>
              <button type="button" onClick={() => moveSection(si, 1)} disabled={si === sections.length - 1} aria-label="Move section down"><ArrowDown size={14} /></button>
              <button
                type="button"
                onClick={() => (s.questions.length === 0 || confirm(`Delete "${s.title}" and its ${s.questions.length} questions?`)) && onChange(sections.filter((x) => x.id !== s.id))}
                aria-label="Delete section"
              >
                <Trash2 size={14} />
              </button>
            </span>
          </div>
          <input
            className="fb-section-desc"
            value={s.description || ''}
            onChange={(e) => setSection(s.id, { description: e.target.value })}
            placeholder="Short intro for this step (optional)"
            maxLength={500}
            aria-label="Section description"
          />

          <ol className="fb-questions">
            {s.questions.map((q, qi) => {
              const isOpen = open === q.id;
              const earlier = all.slice(0, all.indexOf(q)).filter((x) => CONDITION_SOURCES.includes(x.type));
              const source = q.showIf ? all.find((x) => x.id === q.showIf!.questionId) : undefined;
              const brokenRule = Boolean(q.showIf && (!source || all.indexOf(source) > all.indexOf(q)));
              return (
                <li
                  key={q.id}
                  className={`fb-q ${isOpen ? 'is-open' : ''} ${over === q.id && drag?.index !== qi ? 'is-over' : ''} ${drag?.section === s.id && drag.index === qi ? 'is-dragging' : ''}`}
                  onDragOver={(e) => {
                    if (drag?.section !== s.id) return;
                    e.preventDefault();
                    setOver(q.id);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (drag?.section === s.id) moveQuestion(s.id, drag.index, qi);
                    setDrag(null);
                    setOver(null);
                  }}
                >
                  <div className="fb-q-row">
                    <button
                      type="button"
                      className="fb-grip"
                      draggable
                      onDragStart={(e) => {
                        setDrag({ section: s.id, index: qi });
                        e.dataTransfer.effectAllowed = 'move';
                        const row = (e.currentTarget as HTMLElement).closest('li');
                        if (row) e.dataTransfer.setDragImage(row, 20, 20);
                      }}
                      onDragEnd={() => {
                        setDrag(null);
                        setOver(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                          moveQuestion(s.id, qi, qi + (e.key === 'ArrowUp' ? -1 : 1));
                        }
                      }}
                      aria-label={`Reorder "${q.label || 'question'}". Drag, or use the arrow keys`}
                    >
                      <GripVertical size={14} />
                    </button>
                    <button type="button" className="fb-q-summary" onClick={() => setOpen(isOpen ? null : q.id)} aria-expanded={isOpen}>
                      <span className="fb-type">{TYPE_LABEL[q.type]}</span>
                      <span className={`fb-q-label ${q.label ? '' : 'is-empty'}`}>{q.label || 'Untitled question'}</span>
                      {q.showIf && (
                        <span className={`fb-cond ${brokenRule ? 'is-broken' : ''}`} title={brokenRule ? 'This rule points at a question further down, so it will be removed when you save.' : `Only shown if "${source?.label}" is ${q.showIf.equals}`}>
                          <GitBranch size={12} /> if {q.showIf.equals}
                        </span>
                      )}
                      {q.required && <span className="fb-req">Required</span>}
                      <ChevronDown size={14} className="fb-chev" />
                    </button>
                  </div>

                  {isOpen && (
                    <div className="fb-edit">
                      <div className="dx-grid2">
                        <label className="dx-field fb-span2">
                          Question
                          <input autoFocus value={q.label} onChange={(e) => setQuestion(s.id, q.id, { label: e.target.value })} maxLength={300} placeholder="What do you want to ask?" />
                        </label>
                        <label className="dx-field">
                          Answer type
                          <select
                            value={q.type}
                            onChange={(e) => {
                              const t = e.target.value as QuestionType;
                              const fresh = newQuestion(t);
                              setQuestion(s.id, q.id, {
                                type: t,
                                options: HAS_OPTIONS.includes(t) ? (q.options?.length ? q.options : fresh.options) : undefined,
                                min: fresh.min,
                                max: fresh.max,
                                maxLength: undefined,
                              });
                            }}
                          >
                            {QUESTION_TYPES.map((t) => (
                              <option key={t.type} value={t.type}>{t.label}</option>
                            ))}
                          </select>
                        </label>
                        <label className="dx-field">
                          Help text
                          <input value={q.help || ''} onChange={(e) => setQuestion(s.id, q.id, { help: e.target.value })} maxLength={300} placeholder="Shown under the question" />
                        </label>

                        {HAS_OPTIONS.includes(q.type) && (
                          <label className="dx-field fb-span2">
                            Options, one per line
                            <textarea
                              rows={Math.min(8, Math.max(3, (q.options || []).length + 1))}
                              value={(q.options || []).join('\n')}
                              onChange={(e) => setQuestion(s.id, q.id, { options: e.target.value.split('\n') })}
                              onBlur={(e) => setQuestion(s.id, q.id, { options: Array.from(new Set(e.target.value.split('\n').map((o) => o.trim()).filter(Boolean))) })}
                            />
                          </label>
                        )}
                        {(q.type === 'short_text' || q.type === 'long_text' || q.type === 'url' || q.type === 'email' || q.type === 'number') && (
                          <label className="dx-field">
                            Placeholder
                            <input value={q.placeholder || ''} onChange={(e) => setQuestion(s.id, q.id, { placeholder: e.target.value })} maxLength={120} />
                          </label>
                        )}
                        {(q.type === 'short_text' || q.type === 'long_text') && (
                          <label className="dx-field">
                            Character limit
                            <input
                              type="number"
                              min={10}
                              max={q.type === 'short_text' ? 200 : 4000}
                              value={q.maxLength ?? ''}
                              placeholder={q.type === 'short_text' ? '200' : '4000'}
                              onChange={(e) => setQuestion(s.id, q.id, { maxLength: e.target.value ? Number(e.target.value) : undefined })}
                            />
                          </label>
                        )}
                        {(q.type === 'number' || q.type === 'scale') && (
                          <>
                            <label className="dx-field">
                              {q.type === 'scale' ? 'Scale starts at' : 'Minimum'}
                              <input type="number" value={q.min ?? ''} min={q.type === 'scale' ? 0 : undefined} max={q.type === 'scale' ? 1 : undefined} onChange={(e) => setQuestion(s.id, q.id, { min: e.target.value === '' ? undefined : Number(e.target.value) })} />
                            </label>
                            <label className="dx-field">
                              {q.type === 'scale' ? 'Scale ends at' : 'Maximum'}
                              <input type="number" value={q.max ?? ''} min={q.type === 'scale' ? 3 : undefined} max={q.type === 'scale' ? 10 : undefined} onChange={(e) => setQuestion(s.id, q.id, { max: e.target.value === '' ? undefined : Number(e.target.value) })} />
                            </label>
                          </>
                        )}
                      </div>

                      {brokenRule && (
                        <div className="dx-note fb-broken">
                          This question depends on &quot;{source?.label}&quot;, which now comes after it. Move it below that question, or the rule is removed when you save.
                        </div>
                      )}
                      <div className="fb-cond-edit">
                        <GitBranch size={14} />
                        <span>Only show if</span>
                        <select
                          className="dx-input"
                          value={q.showIf?.questionId || ''}
                          onChange={(e) => {
                            const src = earlier.find((x) => x.id === e.target.value);
                            setQuestion(s.id, q.id, { showIf: src ? { questionId: src.id, equals: conditionOptions(src)[0] || '' } : null });
                          }}
                          disabled={earlier.length === 0}
                          aria-label="Depends on question"
                        >
                          <option value="">{earlier.length ? 'Always show' : 'Always show (add a yes/no or choice question above to use this)'}</option>
                          {earlier.map((x) => (
                            <option key={x.id} value={x.id}>{x.label || 'Untitled question'}</option>
                          ))}
                          {brokenRule && source && <option value={source.id}>{source.label} (comes later)</option>}
                        </select>
                        {source && (
                          <>
                            <span>is</span>
                            <select className="dx-input" value={q.showIf!.equals} onChange={(e) => setQuestion(s.id, q.id, { showIf: { questionId: source.id, equals: e.target.value } })} aria-label="Answer that shows this question">
                              {conditionOptions(source).map((o) => (
                                <option key={o}>{o}</option>
                              ))}
                            </select>
                          </>
                        )}
                      </div>

                      <div className="fb-edit-foot">
                        <label className="dx-check">
                          <input type="checkbox" checked={q.required} onChange={(e) => setQuestion(s.id, q.id, { required: e.target.checked })} /> Required
                        </label>
                        {sections.length > 1 && (
                          <select className="dx-input fb-move" value={s.id} onChange={(e) => moveToSection(s.id, q.id, e.target.value)} aria-label="Move to step">
                            {sections.map((x, xi) => (
                              <option key={x.id} value={x.id}>{x.id === s.id ? `In step ${si + 2}` : `Move to step ${xi + 2}: ${x.title}`}</option>
                            ))}
                          </select>
                        )}
                        <span style={{ flex: 1 }} />
                        <button type="button" className="dx-btn ghost" onClick={() => moveQuestion(s.id, qi, qi - 1)} disabled={qi === 0} aria-label="Move up"><ArrowUp size={13} /></button>
                        <button type="button" className="dx-btn ghost" onClick={() => moveQuestion(s.id, qi, qi + 1)} disabled={qi === s.questions.length - 1} aria-label="Move down"><ArrowDown size={13} /></button>
                        <button
                          type="button"
                          className="dx-btn ghost"
                          onClick={() => {
                            const copy = { ...q, id: uid('q'), label: q.label ? `${q.label} (copy)` : '' };
                            const qs = [...s.questions];
                            qs.splice(qi + 1, 0, copy);
                            setSection(s.id, { questions: qs });
                            setOpen(copy.id);
                          }}
                        >
                          <Copy size={13} /> Duplicate
                        </button>
                        <button type="button" className="dx-btn ghost danger" onClick={() => removeQuestion(s.id, q.id)}>
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>

          {adding === s.id ? (
            <div className="fb-types" role="menu" aria-label="Choose a question type">
              {QUESTION_TYPES.map((t) => (
                <button
                  key={t.type}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    const q = newQuestion(t.type);
                    setSection(s.id, { questions: [...s.questions, q] });
                    setAdding(null);
                    setOpen(q.id);
                  }}
                >
                  <strong>{t.label}</strong>
                  <span>{t.hint}</span>
                </button>
              ))}
              <button type="button" className="fb-types-cancel" onClick={() => setAdding(null)}>Cancel</button>
            </div>
          ) : (
            <button type="button" className="dx-btn fb-add" onClick={() => setAdding(s.id)}>
              <Plus size={14} /> Add question
            </button>
          )}
        </section>
      ))}

      <button type="button" className="dx-btn" style={{ alignSelf: 'flex-start' }} onClick={() => onChange([...sections, { id: uid('sec'), title: 'New section', questions: [] }])}>
        <Plus size={14} /> Add section
      </button>
    </div>
  );
}
