'use client';

import { useEffect, useRef, useState } from 'react';
import { GripVertical, Minus, Plus, Trash2, X } from 'lucide-react';
import { FORMAT_LABEL, MATCH_FORMATS, TEAMS, gamesToWin, maxGames, summarize, type GameScore, type Match, type MatchFormat } from '@/lib/matchUtils';
import { api } from './api';

type Draft = Pick<Match, 'team' | 'opponent' | 'event' | 'format' | 'date' | 'games' | 'forfeit' | 'vodUrl' | 'notes'>;

const gid = () => `g_${Math.random().toString(36).slice(2, 9)}`;

/** ISO → value for <input type="datetime-local"> in the viewer's time zone. */
function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function emptyDraft(defaultTeam: string): Draft {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  return { team: defaultTeam, opponent: '', event: '', format: 'bo5', date: d.toISOString(), games: [], forfeit: null, vodUrl: '', notes: '' };
}

function Stepper({ value, onChange, label, side }: { value: number; onChange: (n: number) => void; label: string; side: 'us' | 'them' }) {
  return (
    <div className={`me-stepper is-${side}`} role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(Math.max(0, value - 1))} disabled={value === 0} aria-label={`${label}: one less`}>
        <Minus size={14} />
      </button>
      <input
        inputMode="numeric"
        value={value}
        aria-label={label}
        onChange={(e) => {
          const n = parseInt(e.target.value.replace(/\D/g, ''), 10);
          onChange(Number.isNaN(n) ? 0 : Math.min(99, n));
        }}
        onFocus={(e) => e.target.select()}
      />
      <button type="button" onClick={() => onChange(Math.min(99, value + 1))} aria-label={`${label}: one more`}>
        <Plus size={14} />
      </button>
    </div>
  );
}

export function MatchEditor({
  match,
  defaultTeam,
  onClose,
  onSaved,
  onDeleted,
}: {
  match: Match | null;
  defaultTeam: string;
  onClose: () => void;
  onSaved: (m: Match) => void;
  onDeleted: (id: string) => void;
}) {
  const [draft, setDraft] = useState<Draft>(() =>
    match
      ? { team: match.team, opponent: match.opponent, event: match.event, format: match.format, date: match.date, games: match.games, forfeit: match.forfeit, vodUrl: match.vodUrl, notes: match.notes }
      : emptyDraft(defaultTeam)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!match) firstFieldRef.current?.focus();
    else dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, match]);

  const s = summarize(draft);
  const need = gamesToWin(draft.format);
  const decided = s.result === 'win' || s.result === 'loss';
  const canAddGame = draft.games.length < maxGames(draft.format) && !decided;
  const opponentName = draft.opponent.trim() || 'Opponent';

  // Index of the game that decided the series; games after it don't count.
  let decidedAt = -1;
  {
    let u = 0;
    let t = 0;
    draft.games.forEach((g, i) => {
      if (decidedAt !== -1) return;
      if (g.us > g.them) u++;
      else if (g.them > g.us) t++;
      if (u >= need || t >= need) decidedAt = i;
    });
  }

  const setGame = (i: number, patch: Partial<GameScore>) => setDraft((d) => ({ ...d, games: d.games.map((g, k) => (k === i ? { ...g, ...patch } : g)) }));
  const moveGame = (from: number, to: number) =>
    setDraft((d) => {
      if (to < 0 || to >= d.games.length || from === to) return d;
      const games = [...d.games];
      const [g] = games.splice(from, 1);
      games.splice(to, 0, g);
      return { ...d, games };
    });

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const { match: saved } = match
        ? await api<{ match: Match }>(`/api/dashboard/matches/${match.id}`, { method: 'PATCH', body: draft })
        : await api<{ match: Match }>('/api/dashboard/matches', { method: 'POST', body: draft });
      onSaved(saved);
    } catch (e) {
      setError((e as Error).message);
      setSaving(false);
    }
  }

  async function remove() {
    if (!match || !confirm(`Delete the match against ${match.opponent}?`)) return;
    try {
      await api(`/api/dashboard/matches/${match.id}`, { method: 'DELETE' });
      onDeleted(match.id);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  const status =
    s.result === 'win'
      ? `${draft.team} win${draft.forfeit === 'them' ? ' by forfeit' : ''}`
      : s.result === 'loss'
        ? `${opponentName} win${draft.forfeit === 'us' ? ' by forfeit' : ''}`
        : s.result === 'live'
          ? `First to ${need}`
          : 'Not played yet';

  return (
    <div className="me-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="me" role="dialog" aria-modal="true" aria-labelledby="me-title" ref={dialogRef} tabIndex={-1}>
        <div className="me-head">
          <h2 id="me-title">{match ? 'Edit match' : 'Add match'}</h2>
          <button type="button" className="dx-btn ghost" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div className="me-fields">
          <label className="dx-field">
            Team
            <input list="me-teams" value={draft.team} onChange={(e) => setDraft({ ...draft, team: e.target.value })} maxLength={60} />
            <datalist id="me-teams">
              {TEAMS.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </label>
          <label className="dx-field">
            Opponent
            <input ref={firstFieldRef} value={draft.opponent} onChange={(e) => setDraft({ ...draft, opponent: e.target.value })} placeholder="Team Vitality" maxLength={80} />
          </label>
          <label className="dx-field">
            Event
            <input value={draft.event} onChange={(e) => setDraft({ ...draft, event: e.target.value })} placeholder="RLCS Open, scrim, 6mans cup…" maxLength={100} />
          </label>
          <label className="dx-field">
            Date and time
            <input
              type="datetime-local"
              value={toLocalInput(draft.date)}
              onChange={(e) => e.target.value && setDraft({ ...draft, date: new Date(e.target.value).toISOString() })}
            />
          </label>
        </div>

        <div className="me-format" role="radiogroup" aria-label="Series format">
          {MATCH_FORMATS.map((f) => (
            <button
              key={f}
              type="button"
              role="radio"
              aria-checked={draft.format === f}
              className={draft.format === f ? 'is-active' : ''}
              onClick={() => setDraft({ ...draft, format: f as MatchFormat, games: draft.games.slice(0, maxGames(f)) })}
            >
              {FORMAT_LABEL[f]}
            </button>
          ))}
        </div>

        {/* Scoreboard: FAZIX on the orange side, the opponent on blue, like the in-game top bar. */}
        <div className={`me-board is-${s.result}`} aria-live="polite">
          <div className="me-side is-us">
            <span className="me-team">{draft.team || 'Fazix'}</span>
            <span className="me-big">{s.usWins}</span>
          </div>
          <div className="me-mid">
            <span>{FORMAT_LABEL[draft.format]}</span>
            <strong>{status}</strong>
          </div>
          <div className="me-side is-them">
            <span className="me-big">{s.themWins}</span>
            <span className="me-team">{opponentName}</span>
          </div>
        </div>

        <ol className="me-games">
          {draft.games.map((g, i) => {
            const tied = g.us === g.them;
            const after = decidedAt !== -1 && i > decidedAt;
            return (
              <li
                key={g.id}
                className={`me-game ${dragIndex === i ? 'is-dragging' : ''} ${overIndex === i && dragIndex !== i ? 'is-over' : ''} ${after ? 'is-extra' : ''}`}
                draggable
                onDragStart={(e) => {
                  setDragIndex(i);
                  e.dataTransfer.effectAllowed = 'move';
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOverIndex(i);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragIndex !== null) moveGame(dragIndex, i);
                  setDragIndex(null);
                  setOverIndex(null);
                }}
                onDragEnd={() => {
                  setDragIndex(null);
                  setOverIndex(null);
                }}
              >
                <button
                  type="button"
                  className="me-grip"
                  aria-label={`Game ${i + 1}. Drag, or use the arrow keys, to reorder`}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                      e.preventDefault();
                      moveGame(i, i + (e.key === 'ArrowUp' ? -1 : 1));
                    }
                  }}
                >
                  <GripVertical size={14} />
                </button>
                <span className="me-gnum">Game {i + 1}</span>
                <Stepper side="us" label={`Game ${i + 1}, ${draft.team} goals`} value={g.us} onChange={(n) => setGame(i, { us: n })} />
                <span className="me-dash" aria-hidden="true">–</span>
                <Stepper side="them" label={`Game ${i + 1}, ${opponentName} goals`} value={g.them} onChange={(n) => setGame(i, { them: n })} />
                <label className="me-ot">
                  <input type="checkbox" checked={g.ot} onChange={(e) => setGame(i, { ot: e.target.checked })} />
                  OT
                </label>
                <span className={`me-res ${tied ? 'is-tied' : g.us > g.them ? 'is-win' : 'is-loss'}`}>{tied ? 'Tied' : g.us > g.them ? 'W' : 'L'}</span>
                <button type="button" className="me-x" aria-label={`Remove game ${i + 1}`} onClick={() => setDraft((d) => ({ ...d, games: d.games.filter((_, k) => k !== i) }))}>
                  <X size={14} />
                </button>
                {tied && <p className="me-hint">Rocket League games can&apos;t end level. Add the overtime goal and tick OT.</p>}
                {after && !tied && <p className="me-hint">The series was already decided, so this game doesn&apos;t count.</p>}
              </li>
            );
          })}
        </ol>

        <div className="me-addrow">
          <button
            type="button"
            className="dx-btn"
            disabled={!canAddGame}
            onClick={() => setDraft((d) => ({ ...d, games: [...d.games, { id: gid(), us: 0, them: 0, ot: false }] }))}
          >
            <Plus size={14} /> Add game {draft.games.length + 1}
          </button>
          <span className="dx-sub">
            {decided ? 'Series decided.' : draft.games.length === 0 ? 'Leave games empty for an upcoming match.' : `${maxGames(draft.format) - draft.games.length} game slots left.`}
          </span>
        </div>

        <div className="me-fields">
          <label className="dx-field">
            Forfeit
            <select value={draft.forfeit || ''} onChange={(e) => setDraft({ ...draft, forfeit: (e.target.value || null) as Draft['forfeit'] })}>
              <option value="">No forfeit</option>
              <option value="them">{opponentName} forfeited</option>
              <option value="us">{draft.team || 'We'} forfeited</option>
            </select>
          </label>
          <label className="dx-field">
            VOD or replay link
            <input type="url" value={draft.vodUrl} onChange={(e) => setDraft({ ...draft, vodUrl: e.target.value })} placeholder="https://" />
          </label>
          <label className="dx-field me-wide">
            Notes
            <textarea rows={2} value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} placeholder="Subs, what went well, what to review…" maxLength={1000} />
          </label>
        </div>

        {error && <div className="dx-error">{error}</div>}

        <div className="me-foot">
          {match && (
            <button type="button" className="dx-btn ghost" onClick={remove}>
              <Trash2 size={14} /> Delete
            </button>
          )}
          <span style={{ flex: 1 }} />
          <button type="button" className="dx-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="dx-btn primary" disabled={saving || !draft.opponent.trim()} onClick={save}>
            {saving ? 'Saving…' : 'Save match'}
          </button>
        </div>
      </div>
    </div>
  );
}
