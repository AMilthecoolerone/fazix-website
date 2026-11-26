'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Send, Star, Check, X, Trash2, ExternalLink, Film } from 'lucide-react';
import type { Clip, ClipStatus } from '@/lib/clips';
import { CLIP_CATEGORIES, embedUrl } from '@/lib/clipUtils';
import { api, timeAgo } from './api';

const PILL: Record<ClipStatus, string> = { pending: 'amber', approved: 'green', featured: 'violet', rejected: 'red' };

export function ClipsPanel({ staff, search }: { staff: boolean; search: string }) {
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ClipStatus | 'all'>(staff ? 'pending' : 'all');
  const [form, setForm] = useState({ title: '', url: '', category: 'Goal', description: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const load = useCallback(async () => {
    try {
      setClips((await api<{ clips: Clip[] }>('/api/clips')).clips);
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

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const { clip } = await api<{ clip: Clip }>('/api/clips', { method: 'POST', body: form });
      setClips((c) => [clip, ...c]);
      setForm({ title: '', url: '', category: form.category, description: '' });
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  }

  async function review(id: string, status: ClipStatus) {
    try {
      const { clip } = await api<{ clip: Clip }>(`/api/clips/${id}`, { method: 'PATCH', body: { status } });
      setClips((c) => c.map((x) => (x.id === id ? clip : x)));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this clip?')) return;
    try {
      await api(`/api/clips/${id}`, { method: 'DELETE' });
      setClips((c) => c.filter((x) => x.id !== id));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  const visible = useMemo(
    () => clips.filter((c) => (filter === 'all' || c.status === filter) && (!search || `${c.title} ${c.submittedBy.name}`.toLowerCase().includes(search.toLowerCase()))),
    [clips, filter, search]
  );
  const counts = useMemo(() => {
    const out: Record<string, number> = { all: clips.length };
    for (const c of clips) out[c.status] = (out[c.status] || 0) + 1;
    return out;
  }, [clips]);

  return (
    <div className="dx">
      <div>
        <p className="dx-sub">
          {staff ? 'Members send in their best plays. Approve the good ones and feature the best for socials.' : 'Send us your best plays. Staff review every clip and the best ones get posted.'}
        </p>
      </div>
      {error && <div className="dx-error">{error}</div>}

      <form className="dx-card" onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h3 className="dx-h" style={{ fontSize: '0.9rem' }}>Submit a clip</h3>
        <div className="dx-grid2">
          <label className="dx-field">
            Title
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={120} placeholder="Ceiling double tap in overtime" />
          </label>
          <label className="dx-field">
            Link
            <input required type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="YouTube, Twitch, Medal, TikTok, Streamable…" />
          </label>
        </div>
        <div className="dx-grid2">
          <label className="dx-field">
            Category
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CLIP_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="dx-field">
            Note for staff (optional)
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={1000} />
          </label>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'flex-end' }}>
          {sent && <span style={{ color: '#4ADE80', fontSize: '0.8rem' }}>Sent! Staff will review it.</span>}
          <button className="dx-btn primary" disabled={sending}>
            <Send size={13} /> {sending ? 'Sending…' : 'Submit clip'}
          </button>
        </div>
      </form>

      <div className="dx-bar">
        <h3 className="dx-h" style={{ fontSize: '0.9rem' }}>{staff ? 'Review queue' : 'Your clips'}</h3>
        <div className="dx-tabs">
          {(['pending', 'approved', 'featured', 'rejected', 'all'] as const).map((f) => (
            <button key={f} className={`dx-tab ${filter === f ? 'is-active' : ''}`} onClick={() => setFilter(f)}>
              {f[0].toUpperCase() + f.slice(1)} {counts[f] ? `(${counts[f]})` : ''}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="dx-card dx-empty">Loading…</div>
      ) : visible.length === 0 ? (
        <div className="dx-card dx-empty">
          <Film size={22} style={{ marginBottom: 8 }} />
          <div>No clips here.</div>
        </div>
      ) : (
        <div className="dx-clip-grid">
          {visible.map((c) => {
            const embed = embedUrl(c);
            return (
              <div key={c.id} className="dx-card" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 12 }}>
                {embed ? (
                  <iframe className="dx-embed" src={embed} title={c.title} loading="lazy" allow="encrypted-media; picture-in-picture" allowFullScreen />
                ) : (
                  <a href={c.url} target="_blank" rel="noreferrer noopener" className="dx-embed" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#A0A0AC', textDecoration: 'none', background: '#07070A' }}>
                    <ExternalLink size={16} /> Open on {c.platform === 'other' ? 'site' : c.platform}
                  </a>
                )}
                <div>
                  <div style={{ fontWeight: 700 }}>{c.title}</div>
                  <div className="dx-meta" style={{ marginTop: 4 }}>
                    <span className={`dx-pill ${PILL[c.status]}`}>{c.status}</span>
                    <span>{c.category}</span>
                    <span>{c.submittedBy.name}</span>
                    <span>{timeAgo(c.createdAt)}</span>
                  </div>
                  {c.description && <p style={{ color: '#A0A0AC', margin: '8px 0 0', fontSize: '0.8rem' }}>{c.description}</p>}
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 'auto' }}>
                  {staff && (
                    <>
                      <button className="dx-btn" disabled={c.status === 'approved'} onClick={() => review(c.id, 'approved')}>
                        <Check size={13} /> Approve
                      </button>
                      <button className="dx-btn" disabled={c.status === 'featured'} onClick={() => review(c.id, 'featured')}>
                        <Star size={13} /> Feature
                      </button>
                      <button className="dx-btn" disabled={c.status === 'rejected'} onClick={() => review(c.id, 'rejected')}>
                        <X size={13} /> Reject
                      </button>
                    </>
                  )}
                  <a className="dx-btn ghost" href={c.url} target="_blank" rel="noreferrer noopener" title="Open">
                    <ExternalLink size={13} />
                  </a>
                  {(staff || c.status === 'pending') && (
                    <button className="dx-btn ghost" onClick={() => remove(c.id)} title="Delete">
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
