import { NewsArticle, getNewsDatabase, upsertArticle, deleteArticle, calculateReadingTime } from '@/lib/newsStore';
import { readDoc, updateDoc, newId } from '@/lib/store';
import { clampText } from '@/lib/session';

/**
 * Dashboard CMS for news articles. The live article stays in the news store the public
 * site reads from; every save also appends a snapshot here so staff can diff and restore.
 */

export type ArticleStatus = 'published' | 'pending_review' | 'draft';

export interface ArticleVersion {
  id: string;
  articleId: string;
  version: number;
  snapshot: NewsArticle;
  editedBy: string;
  note: string;
  createdAt: string;
}

type VersionDb = Record<string, ArticleVersion[]>;
const VERSIONS_KEY = 'cms-versions';
const MAX_VERSIONS = 50;

export interface ArticleInput {
  title: string;
  summary: string;
  content: string;
  image?: string;
  badge?: string;
  status: ArticleStatus;
  pinned?: boolean;
  note?: string;
}

export interface ArticleWithMeta extends NewsArticle {
  version: number;
  updatedAt?: string;
  updatedBy?: string;
}

export async function listArticles(): Promise<ArticleWithMeta[]> {
  const [db, versions] = await Promise.all([getNewsDatabase(), readDoc<VersionDb>(VERSIONS_KEY, {})]);
  return db.articles.map((a) => {
    const v = versions[a.id] || [];
    const last = v[v.length - 1];
    return { ...a, version: last?.version ?? 1, updatedAt: last?.createdAt ?? a.createdAt, updatedBy: last?.editedBy ?? a.author };
  });
}

export async function getVersions(articleId: string): Promise<ArticleVersion[]> {
  const versions = await readDoc<VersionDb>(VERSIONS_KEY, {});
  return [...(versions[articleId] || [])].reverse();
}

async function recordVersion(article: NewsArticle, editedBy: string, note: string): Promise<number> {
  return updateDoc<VersionDb, number>(VERSIONS_KEY, {}, (db) => {
    const list = db[article.id] || [];
    const version = (list[list.length - 1]?.version ?? 0) + 1;
    list.push({ id: newId('ver'), articleId: article.id, version, snapshot: article, editedBy, note, createdAt: new Date().toISOString() });
    db[article.id] = list.slice(-MAX_VERSIONS);
    return version;
  });
}

function toParagraphs(content: string): string[] {
  return content.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

export async function saveArticle(id: string | null, input: ArticleInput, editor: string): Promise<ArticleWithMeta> {
  const db = await getNewsDatabase();
  const existing = id ? db.articles.find((a) => a.id === id) : undefined;
  if (id && !existing) throw new Error('Article not found');

  const paragraphs = toParagraphs(input.content);
  const now = new Date();
  const readTime = await calculateReadingTime([input.title, input.summary, ...paragraphs].join(' '));

  const article: NewsArticle = {
    ...(existing || {
      id: `news-cms-${Date.now()}`,
      date: now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      createdAt: now.toISOString(),
      source: 'website' as const,
      author: editor,
    }),
    title: input.title.trim().toUpperCase(),
    summary: input.summary.trim() || (paragraphs[0] || input.title).slice(0, 180),
    content: paragraphs.length ? paragraphs : [input.summary || input.title],
    image: input.image?.trim() || existing?.image || '/images/news/news_qualifier.jpg',
    badge: (input.badge || existing?.badge || 'UPDATE').trim().toUpperCase(),
    status: input.status,
    pinned: Boolean(input.pinned),
    readTime,
  };

  await upsertArticle(article);
  const version = await recordVersion(article, editor, input.note?.trim() || (existing ? 'Edited' : 'Created'));
  return { ...article, version, updatedAt: now.toISOString(), updatedBy: editor };
}

export async function restoreVersion(articleId: string, versionId: string, editor: string): Promise<ArticleWithMeta> {
  const versions = await readDoc<VersionDb>(VERSIONS_KEY, {});
  const target = (versions[articleId] || []).find((v) => v.id === versionId);
  if (!target) throw new Error('Version not found');
  await upsertArticle(target.snapshot);
  const version = await recordVersion(target.snapshot, editor, `Restored v${target.version}`);
  return { ...target.snapshot, version, updatedAt: new Date().toISOString(), updatedBy: editor };
}

export async function removeArticle(articleId: string): Promise<boolean> {
  const removed = await deleteArticle(articleId);
  await updateDoc<VersionDb, void>(VERSIONS_KEY, {}, (db) => {
    delete db[articleId];
  });
  return removed;
}

export function parseArticleBody(body: Record<string, unknown>): ArticleInput {
  const status = (['published', 'pending_review', 'draft'] as const).includes(body.status as ArticleStatus)
    ? (body.status as ArticleStatus)
    : 'draft';
  return {
    title: clampText(body.title, 160),
    summary: clampText(body.summary, 400),
    content: clampText(body.content, 20000),
    image: clampText(body.image, 500),
    badge: clampText(body.badge, 24),
    note: clampText(body.note, 200),
    pinned: Boolean(body.pinned),
    status,
  };
}

