'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Save, Trash2, History, RotateCcw, Megaphone, Pin, ExternalLink } from 'lucide-react';
import type { ArticleVersion, ArticleWithMeta, ArticleStatus } from '@/lib/cms';
import type { NewsTicker } from '@/lib/newsStore';
import { api, lineDiff, timeAgo } from './api';

interface Draft {
  title: string;
  summary: string;
  content: string;
  image: string;
  badge: string;
  status: ArticleStatus;
  pinned: boolean;
  note: string;
}

const EMPTY: Draft = { title: '', summary: '', content: '', image: '', badge: 'UPDATE', status: 'draft', pinned: false, note: '' };
const STATUS_PILL: Record<ArticleStatus, string> = { published: 'green', pending_review: 'amber', draft: '' };
const STATUS_LABEL: Record<ArticleStatus, string> = { published: 'Published', pending_review: 'In review', draft: 'Draft' };

function toDraft(a: ArticleWithMeta): Draft {
  return {
    title: a.title,
    summary: a.summary,
    content: a.content.join('\n\n'),
    image: a.image,
    badge: a.badge || '',
    status: a.status || 'published',
    pinned: Boolean(a.pinned),
    note: '',
  };
}

function snapshotText(a: { title: string; summary: string; content: string[]; badge?: string; status?: string }) {
  return [`# ${a.title}`, `[${a.badge || ''}] (${a.status || 'published'})`, '', a.summary, '', ...a.content].join('\n');
}

export function CmsPanel({ canEdit, search }: { canEdit: boolean; search: string }) {
  const [articles, setArticles] = useState<ArticleWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | 'new' | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<'all' | ArticleStatus>('all');
  const [view, setView] = useState<'edit' | 'history' | 'ticker'>('edit');
  const [versions, setVersions] = useState<ArticleVersion[]>([]);
  const [compareId, setCompareId] = useState<string | null>(null);
  const [ticker, setTicker] = useState<Partial<NewsTicker>>({});

  const load = useCallback(async () => {
    try {
      const [{ articles }, { ticker }] = await Promise.all([
        api<{ articles: ArticleWithMeta[] }>('/api/dashboard/cms'),
        api<{ ticker: NewsTicker | null }>('/api/dashboard/cms/ticker'),
      ]);
      setArticles(articles);
      setTicker(ticker || {});
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

  const selected = articles.find((a) => a.id === selectedId) || null;
  const dirty = selected ? JSON.stringify({ ...toDraft(selected), note: '' }) !== JSON.stringify({ ...draft, note: '' }) : selectedId === 'new' && draft.title !== '';

  const visible = useMemo(
    () =>
      articles.filter(
        (a) => (filter === 'all' || (a.status || 'published') === filter) && (!search || `${a.title} ${a.summary}`.toLowerCase().includes(search.toLowerCase()))
      ),
    [articles, filter, search]
  );

  function select(id: string | 'new') {
    if (dirty && !confirm('Discard unsaved changes?')) return;
    setSelectedId(id);
    setView('edit');
    setCompareId(null);
    setDraft(id === 'new' ? EMPTY : toDraft(articles.find((a) => a.id === id)!));
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const { article } =
        selectedId === 'new'
          ? await api<{ article: ArticleWithMeta }>('/api/dashboard/cms', { method: 'POST', body: draft })
          : await api<{ article: ArticleWithMeta }>(`/api/dashboard/cms/${selectedId}`, { method: 'PATCH', body: draft });
      setArticles((list) => [article, ...list.filter((a) => a.id !== article.id)]);
      setSelectedId(article.id);
      setDraft(toDraft(article));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!selected || !confirm(`Delete "${selected.title}" and its whole version history?`)) return;
    try {
      await api(`/api/dashboard/cms/${selected.id}`, { method: 'DELETE' });
      setArticles((list) => list.filter((a) => a.id !== selected.id));
      setSelectedId(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function openHistory() {
    if (!selected) return;
    setView('history');
    setCompareId(null);
    try {
      setVersions((await api<{ versions: ArticleVersion[] }>(`/api/dashboard/cms/${selected.id}/versions`)).versions);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function restore(v: ArticleVersion) {
    if (!selected || !confirm(`Restore v${v.version}? The current content is kept as a version too.`)) return;
    try {
      const { article } = await api<{ article: ArticleWithMeta }>(`/api/dashboard/cms/${selected.id}/versions`, { method: 'POST', body: { versionId: v.id } });
      setArticles((list) => list.map((a) => (a.id === article.id ? article : a)));
      setDraft(toDraft(article));
      await openHistory();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function saveTicker(active: boolean) {
    try {
      if (active) {
        const res = await api<{ ticker: NewsTicker }>('/api/dashboard/cms/ticker', { method: 'PUT', body: ticker });
        setTicker(res.ticker);
      } else {
        await api('/api/dashboard/cms/ticker', { method: 'DELETE' });
        setTicker((t) => ({ ...t, isActive: false }));
      }
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  const compare = versions.find((v) => v.id === compareId);
  const compareBase = compare ? versions[versions.indexOf(compare) + 1] : undefined;

  return (
    <div className="dx">
      <div className="dx-bar">
        <div>
          <h2 className="dx-h">Content (CMS)</h2>
          <p className="dx-sub">News articles and the top banner on the website. Every save is kept as a version you can restore.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="dx-btn" onClick={() => { setSelectedId(null); setView('ticker'); }}>
            <Megaphone size={14} /> Top banner
          </button>
          {canEdit && (
            <button className="dx-btn primary" onClick={() => select('new')}>
              <Plus size={14} /> New article
            </button>
          )}
        </div>
      </div>

      {!canEdit && <div className="dx-note">You&apos;re viewing as a demo account, so editing is turned off.</div>}
      {error && <div className="dx-error">{error}</div>}

      <div className="dx-split">
        <div className="dx-card" style={{ padding: 10 }}>
          <div className="dx-tabs" style={{ marginBottom: 10 }}>
            {(['all', 'published', 'pending_review', 'draft'] as const).map((f) => (
              <button key={f} className={`dx-tab ${filter === f ? 'is-active' : ''}`} onClick={() => setFilter(f)}>
                {f === 'all' ? 'All' : STATUS_LABEL[f]}
              </button>
            ))}
          </div>
          <div className="dx-list">
            {loading && <div className="dx-empty">Loading…</div>}
            {!loading && visible.length === 0 && <div className="dx-empty">No articles yet.</div>}
            {visible.map((a) => (
              <button key={a.id} className={`dx-item ${selectedId === a.id ? 'is-active' : ''}`} onClick={() => select(a.id)}>
                <span className="dx-item-title">
                  {a.pinned && <Pin size={11} style={{ marginRight: 5, verticalAlign: -1 }} />}
                  {a.title}
                </span>
                <span className="dx-meta">
                  <span className={`dx-pill ${STATUS_PILL[a.status || 'published']}`}>{STATUS_LABEL[a.status || 'published']}</span>
                  <span>v{a.version}</span>
                  <span>{timeAgo(a.updatedAt)}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="dx-card">
          {view === 'ticker' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="dx-bar">
                <h3 className="dx-h">Top banner</h3>
                <span className={`dx-pill ${ticker.isActive ? 'green' : ''}`}>{ticker.isActive ? 'Live' : 'Off'}</span>
              </div>
              <div className="dx-grid3">
                <label className="dx-field">
                  Badge
                  <input value={ticker.badge || ''} onChange={(e) => setTicker({ ...ticker, badge: e.target.value })} placeholder="LIVE" maxLength={24} />
                </label>
                <label className="dx-field">
                  Priority
                  <select value={ticker.priority || 'normal'} onChange={(e) => setTicker({ ...ticker, priority: e.target.value as NewsTicker['priority'] })}>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </label>
                <label className="dx-field">
                  Linked article
                  <select value={ticker.articleId || ''} onChange={(e) => setTicker({ ...ticker, articleId: e.target.value || undefined })}>
                    <option value="">None</option>
                    {articles.filter((a) => a.status === 'published').map((a) => (
                      <option key={a.id} value={a.id}>{a.title}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="dx-field">
                Text
                <input value={ticker.text || ''} onChange={(e) => setTicker({ ...ticker, text: e.target.value })} maxLength={200} placeholder="FAZIX qualify for the RLCS Major!" />
              </label>
              <label className="dx-field">
                Link (optional)
                <input value={ticker.link || ''} onChange={(e) => setTicker({ ...ticker, link: e.target.value })} placeholder="#news or https://…" />
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="dx-btn primary" disabled={!canEdit || !ticker.text} onClick={() => saveTicker(true)}>
                  <Megaphone size={14} /> {ticker.isActive ? 'Update banner' : 'Go live'}
                </button>
                {ticker.isActive && (
                  <button className="dx-btn danger" disabled={!canEdit} onClick={() => saveTicker(false)}>
                    Turn off
                  </button>
                )}
              </div>
            </div>
          ) : !selectedId ? (
            <div className="dx-empty">Pick an article to edit, or create a new one.</div>
          ) : view === 'history' && selected ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="dx-bar">
                <h3 className="dx-h">Version history · {selected.title}</h3>
                <button className="dx-btn ghost" onClick={() => setView('edit')}>Back to editor</button>
              </div>
              {versions.length === 0 && <div className="dx-empty">No saved versions yet. This article was created before versioning.</div>}
              <div className="dx-list">
                {versions.map((v, i) => (
                  <div key={v.id} className={`dx-item ${compareId === v.id ? 'is-active' : ''}`} style={{ cursor: 'default' }}>
                    <div className="dx-bar">
                      <span>
                        <strong>v{v.version}</strong> <span style={{ color: '#8E8E9A' }}>· {v.note}</span>
                        {i === 0 && <span className="dx-pill green" style={{ marginLeft: 8 }}>Current</span>}
                      </span>
                      <span style={{ display: 'flex', gap: 6 }}>
                        <button className="dx-btn ghost" onClick={() => setCompareId(compareId === v.id ? null : v.id)}>
                          {compareId === v.id ? 'Hide changes' : 'Changes'}
                        </button>
                        {i > 0 && (
                          <button className="dx-btn" disabled={!canEdit} onClick={() => restore(v)}>
                            <RotateCcw size={13} /> Restore
                          </button>
                        )}
                      </span>
                    </div>
                    <span className="dx-meta">
                      {v.editedBy} · {timeAgo(v.createdAt)}
                    </span>
                    {compareId === v.id && compare && (
                      <div className="dx-diff">
                        {lineDiff(compareBase ? snapshotText(compareBase.snapshot) : '', snapshotText(compare.snapshot)).map((l, k) =>
                          l.type === 'same' ? <span key={k} style={{ display: 'block', color: '#8E8E9A' }}>{l.text || ' '}</span> : <span key={k} className={l.type}>{(l.type === 'add' ? '+ ' : '- ') + l.text}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="dx-bar">
                <h3 className="dx-h">{selectedId === 'new' ? 'New article' : `Editing v${selected?.version ?? 1}`}</h3>
                <div style={{ display: 'flex', gap: 6 }}>
                  {selected && (
                    <>
                      {selected.status === 'published' && (
                        <a className="dx-btn ghost" href="/#news" target="_blank" rel="noreferrer">
                          <ExternalLink size={13} /> View
                        </a>
                      )}
                      <button className="dx-btn ghost" onClick={openHistory}>
                        <History size={13} /> History
                      </button>
                      <button className="dx-btn ghost" disabled={!canEdit} onClick={remove} title="Delete">
                        <Trash2 size={13} />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <label className="dx-field">
                Title
                <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} maxLength={160} />
              </label>
              <div className="dx-grid3">
                <label className="dx-field">
                  Status
                  <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as ArticleStatus })}>
                    <option value="draft">Draft</option>
                    <option value="pending_review">In review</option>
                    <option value="published">Published</option>
                  </select>
                </label>
                <label className="dx-field">
                  Badge
                  <input value={draft.badge} onChange={(e) => setDraft({ ...draft, badge: e.target.value })} maxLength={24} />
                </label>
                <label className="dx-field">
                  Image URL
                  <input value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} placeholder="/images/news/…" />
                </label>
              </div>
              <label className="dx-field">
                Summary
                <textarea rows={2} value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} maxLength={400} />
              </label>
              <label className="dx-field">
                Body <span style={{ fontWeight: 400, color: '#6E6E7C' }}>Leave a blank line between paragraphs.</span>
                <textarea rows={12} value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} />
              </label>
              <div className="dx-bar">
                <label className="dx-check">
                  <input type="checkbox" checked={draft.pinned} onChange={(e) => setDraft({ ...draft, pinned: e.target.checked })} /> Pin to top
                </label>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input className="dx-input" style={{ flex: 1 }} placeholder="What changed? (optional, shows in history)" value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} maxLength={200} />
                <button className="dx-btn primary" disabled={!canEdit || saving || !draft.title || !dirty} onClick={save}>
                  <Save size={14} /> {saving ? 'Saving…' : selectedId === 'new' ? 'Create' : 'Save version'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
