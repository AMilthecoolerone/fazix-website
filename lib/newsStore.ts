import fs from 'fs';
import path from 'path';
import os from 'os';

export interface NewsArticle {
  id: string;
  title: string;
  date: string;
  readTime: string;
  image: string;
  summary: string;
  content: string[];
  badge?: string;
  author?: string;
  url?: string;
  pinned?: boolean;
  status?: 'published' | 'pending_review' | 'draft';
  source?: 'discord' | 'website' | 'system';
  createdAt: string;
}

export interface NewsTicker {
  id: string;
  badge: string; // e.g. "BREAKING", "LIVE", "RLCS", "ANNOUNCEMENT"
  text: string;  // Text scrolling across the top
  link?: string; // Optional URL (e.g. "#news" or external)
  articleId?: string; // Optional link to open full article modal
  priority?: 'normal' | 'high' | 'urgent';
  isActive: boolean;
  updatedAt: string;
}

export interface NewsDatabase {
  ticker: NewsTicker | null;
  articles: NewsArticle[];
  lastUpdated: string;
}

// Initial seed data - clean start (no articles, ticker inactive)
const SEED_ARTICLES: NewsArticle[] = [];

const SEED_TICKER: NewsTicker = {
  id: 'ticker-empty',
  badge: '',
  text: '',
  link: '#news',
  articleId: null,
  priority: 'normal',
  isActive: false,
  updatedAt: new Date().toISOString()
};

// In-memory cache
let inMemoryStore: NewsDatabase = {
  ticker: SEED_TICKER,
  articles: SEED_ARTICLES,
  lastUpdated: new Date().toISOString()
};

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'news.json');
const TMP_FILE = path.join(os.tmpdir(), 'fazix_news.json');

/**
 * Calculates reading time using ApiVerve Reading Time API (https://api.apiverve.com/v1/readingtime)
 * with graceful fallback to standard word-count formula (200 wpm).
 */
export async function calculateReadingTime(text: string, wpm: number = 200): Promise<string> {
  const apiKey = process.env.APIVERVE_API_KEY || process.env.READING_TIME_API_KEY;

  if (apiKey && text && text.trim().length > 0) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch('https://api.apiverve.com/v1/readingtime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey.trim(),
        },
        body: JSON.stringify({
          text: text.slice(0, 50000),
          wpm,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json?.status === 'ok' && json?.data?.reading_time_text) {
          return json.data.reading_time_text;
        }
      }
    } catch (error) {
      console.warn('[NewsStore] APIVerve reading time calculation fallback:', error);
    }
  }

  // Fallback calculation: average 200 words per minute
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / wpm));
  return `${minutes} min read`;
}

/**
 * Loads the news database from disk or memory (supports serverless /tmp fallback)
 */
export async function getNewsDatabase(): Promise<NewsDatabase> {
  // 1. Try reading from serverless /tmp if recently updated
  try {
    if (fs.existsSync(TMP_FILE)) {
      const raw = await fs.promises.readFile(TMP_FILE, 'utf8');
      const parsed = JSON.parse(raw) as NewsDatabase;
      if (parsed && Array.isArray(parsed.articles)) {
        inMemoryStore = parsed;
        return inMemoryStore;
      }
    }
  } catch {
    // Proceed to standard data file
  }

  // 2. Try reading from repo data/news.json
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = await fs.promises.readFile(DATA_FILE, 'utf8');
      const parsed = JSON.parse(raw) as NewsDatabase;
      if (parsed && Array.isArray(parsed.articles)) {
        inMemoryStore = parsed;
        return inMemoryStore;
      }
    }
  } catch (error) {
    console.warn('[NewsStore] Failed to read news.json, using in-memory store:', error);
  }

  // Ensure file is initialized
  await saveNewsDatabase(inMemoryStore).catch(() => {});
  return inMemoryStore;
}

/**
 * Saves the news database to disk atomically with /tmp fallback on serverless
 */
export async function saveNewsDatabase(data: NewsDatabase): Promise<void> {
  data.lastUpdated = new Date().toISOString();
  inMemoryStore = data;

  let saved = false;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      await fs.promises.mkdir(DATA_DIR, { recursive: true });
    }
    await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    saved = true;
  } catch (error) {
    console.warn('[NewsStore] Cannot write to data/news.json (serverless read-only filesystem), falling back to /tmp:', error);
  }

  // Serverless /tmp fallback
  if (!saved) {
    try {
      await fs.promises.writeFile(TMP_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (tmpErr) {
      console.warn('[NewsStore] Failed to write to /tmp fallback:', tmpErr);
    }
  }
}

/**
 * Formats a modern date string like "October 8, 2026"
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Adds a new article from Discord bot and optionally sets the top ticker badge
 */
export async function createArticle(params: {
  title: string;
  summary?: string;
  content: string | string[];
  image?: string;
  badge?: string;
  author?: string;
  readTime?: string;
  url?: string;
  pinned?: boolean;
  status?: 'published' | 'pending_review' | 'draft';
  setTicker?: boolean;
  tickerText?: string;
  tickerBadge?: string;
}): Promise<{ article: NewsArticle; ticker?: NewsTicker }> {
  const db = await getNewsDatabase();

  const id = `news-bot-${Date.now()}`;
  const now = new Date();
  const paragraphs = Array.isArray(params.content)
    ? params.content
    : params.content.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

  const fallbackSummary =
    paragraphs[0] && paragraphs[0].length > 180
      ? `${paragraphs[0].slice(0, 177)}...`
      : paragraphs[0] || params.title;

  const defaultImages = [
    '/images/news/news_qualifier.jpg',
    '/images/news/news_defense.jpg',
    '/images/news/news_hardware.jpg',
    '/images/news/news_bootcamp.jpg',
    '/images/rlcs_lan_stage.jpg'
  ];
  const pickedImage = defaultImages[db.articles.length % defaultImages.length];

  const fullText = [
    params.title,
    params.summary,
    ...paragraphs
  ].filter(Boolean).join(' ');

  const calculatedReadTime = params.readTime || (await calculateReadingTime(fullText));
  const articleStatus = params.status || 'published';

  const newArticle: NewsArticle = {
    id,
    title: params.title.trim().toUpperCase(),
    date: formatDate(now),
    readTime: calculatedReadTime,
    image: params.image || pickedImage,
    summary: params.summary?.trim() || fallbackSummary,
    content: paragraphs.length > 0 ? paragraphs : [params.summary || params.title],
    badge: (params.badge || 'UPDATE').trim().toUpperCase(),
    author: params.author || 'Discord Bot',
    url: params.url,
    pinned: Boolean(params.pinned),
    status: articleStatus,
    source: 'discord',
    createdAt: now.toISOString()
  };

  // Add new article to the beginning
  db.articles = [newArticle, ...db.articles];

  let updatedTicker: NewsTicker | undefined;

  // If setTicker is requested and article is published, update the top badge ticker
  if (params.setTicker && articleStatus === 'published') {
    updatedTicker = {
      id: `ticker-${Date.now()}`,
      badge: (params.tickerBadge || newArticle.badge || 'LIVE').trim().toUpperCase(),
      text: (params.tickerText || newArticle.title).trim(),
      link: params.url || '#news',
      articleId: newArticle.id,
      priority: 'high',
      isActive: true,
      updatedAt: now.toISOString()
    };
    db.ticker = updatedTicker;
  }

  await saveNewsDatabase(db);
  return { article: newArticle, ticker: updatedTicker };
}

/**
 * Sets or updates the top badge ticker directly
 */
export async function updateTicker(params: {
  badge?: string;
  text: string;
  link?: string;
  articleId?: string;
  priority?: 'normal' | 'high' | 'urgent';
  isActive?: boolean;
}): Promise<NewsTicker> {
  const db = await getNewsDatabase();

  const newTicker: NewsTicker = {
    id: `ticker-${Date.now()}`,
    badge: params.badge ? params.badge.trim().toUpperCase() : '',
    text: params.text.trim(),
    link: params.link || '#news',
    articleId: params.articleId,
    priority: params.priority || 'normal',
    isActive: params.isActive !== undefined ? params.isActive : true,
    updatedAt: new Date().toISOString()
  };

  db.ticker = newTicker;
  await saveNewsDatabase(db);
  return newTicker;
}

/**
 * Clears/Deactivates the top badge ticker
 */
export async function clearTicker(): Promise<void> {
  const db = await getNewsDatabase();
  if (db.ticker) {
    db.ticker.isActive = false;
    db.ticker.updatedAt = new Date().toISOString();
    await saveNewsDatabase(db);
  }
}

/**
 * Updates the editorial status of an article ('published', 'pending_review', 'draft')
 */
export async function updateArticleStatus(
  id: string,
  status: 'published' | 'pending_review' | 'draft'
): Promise<NewsArticle | null> {
  const db = await getNewsDatabase();
  const article = db.articles.find(a => a.id === id);
  if (!article) return null;

  article.status = status;
  await saveNewsDatabase(db);
  return article;
}

/**
 * Approves an article for public display (editorial release)
 */
export async function approveArticle(id: string): Promise<NewsArticle | null> {
  return updateArticleStatus(id, 'published');
}

/**
 * Deletes an article by ID
 */
export async function deleteArticle(id: string): Promise<boolean> {
  const db = await getNewsDatabase();
  const initialLength = db.articles.length;
  db.articles = db.articles.filter(a => a.id !== id);

  // If the active ticker referenced this article, unlink it
  if (db.ticker && db.ticker.articleId === id) {
    db.ticker.articleId = undefined;
  }

  const removed = db.articles.length < initialLength;
  if (removed) {
    await saveNewsDatabase(db);
  }
  return removed;
}

/**
 * Deletes all articles from the database
 */
export async function deleteAllArticles(): Promise<number> {
  const db = await getNewsDatabase();
  const count = db.articles.length;
  db.articles = [];

  // Clear article link from ticker if set
  if (db.ticker && db.ticker.articleId) {
    db.ticker.articleId = undefined;
  }

  await saveNewsDatabase(db);
  return count;
}
