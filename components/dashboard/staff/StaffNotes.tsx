'use client';

import { useEffect, useState } from 'react';
import { Pin, Trash2 } from 'lucide-react';
import type { StaffNote } from '@/lib/staffNotes';
import { api, timeAgo } from './api';

/** Small shared notepad for staff. Enter posts, Shift+Enter adds a line. */
export function StaffNotes() {
  const [notes, setNotes] = useState<StaffNote[] | null>(null);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<{ notes: StaffNote[] }>('/api/dashboard/notes')
      .then((r) => setNotes(r.notes))
      .catch((e) => setError(e.message));
  }, []);

  const sort = (list: StaffNote[]) => [...list].sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.createdAt.localeCompare(a.createdAt));

  async function post() {
    const value = text.trim();
    if (!value) return;
    setText('');
    try {
      const { note } = await api<{ note: StaffNote }>('/api/dashboard/notes', { method: 'POST', body: { text: value } });
      setNotes((n) => sort([note, ...(n || [])]));
      setError(null);
    } catch (e) {
      setText(value);
      setError((e as Error).message);
    }
  }

  async function pin(n: StaffNote) {
    try {
      const { note } = await api<{ note: StaffNote }>(`/api/dashboard/notes/${n.id}`, { method: 'PATCH', body: { pinned: !n.pinned } });
      setNotes((list) => sort((list || []).map((x) => (x.id === n.id ? note : x))));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function remove(n: StaffNote) {
    try {
      await api(`/api/dashboard/notes/${n.id}`, { method: 'DELETE' });
      setNotes((list) => (list || []).filter((x) => x.id !== n.id));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <section className="sn" aria-labelledby="sn-title">
      <h3 id="sn-title" className="ov-h">Staff notes</h3>
      <textarea
        className="sn-input"
        rows={2}
        maxLength={280}
        placeholder="Leave a note for the team…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            post();
          }
        }}
        aria-describedby="sn-help"
      />
      <div id="sn-help" className="sn-help">
        <span>Enter to post</span>
        {text.length > 200 && <span>{280 - text.length} left</span>}
      </div>
      {error && <div className="dx-error">{error}</div>}
      <ul className="sn-list">
        {notes === null && <li className="sn-empty">Loading…</li>}
        {notes?.length === 0 && <li className="sn-empty">No notes yet.</li>}
        {notes?.map((n) => (
          <li key={n.id} className={`sn-note ${n.pinned ? 'is-pinned' : ''}`}>
            <p>{n.text}</p>
            <div className="sn-meta">
              <span>
                {n.author.name}, {timeAgo(n.createdAt)}
              </span>
              <span className="sn-actions">
                <button type="button" onClick={() => pin(n)} aria-label={n.pinned ? 'Unpin note' : 'Pin note'} aria-pressed={n.pinned}>
                  <Pin size={12} />
                </button>
                <button type="button" onClick={() => remove(n)} aria-label="Delete note">
                  <Trash2 size={12} />
                </button>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
