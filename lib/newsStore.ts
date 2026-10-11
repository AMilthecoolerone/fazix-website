import fs from 'fs';
import path from 'path';

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

// Initial seed data reflecting FAZIX RLCS European roster & achievements
const SEED_ARTICLES: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'RLCS REGIONAL 1 MAIN EVENT QUALIFIER',
    date: 'October 4, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    summary: 'A clutch Game 7 overtime victory against Team BDS secures our starting 3v3 roster a direct spot in the RLCS Europe swiss stage.',
    content: [
      'Following a grueling seven-game series in the final qualifying round, FAZIX locked in their seed for the RLCS Europe Regional 1 Main Event.',
      'After dropping games two and four to heavy defensive counterattacks, captain Zenith converted a backboard ceiling pass from Aura at 2:48 into overtime to close out Champions Field.',
      'The starting roster will now enter a week-long bootcamp at the Fazix training facility in NRW to prepare for Friday’s swiss bracket matches.'
    ],
    badge: 'RLCS',
    author: 'FAZIX Esports',
    source: 'system',
    createdAt: '2026-10-04T19:00:00.000Z'
  },
  {
    id: 'news-2',
    title: 'BEHIND THE COMMS: GAME 5 DEFENSIVE HOLD',
    date: 'September 28, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    summary: 'Coach K4RMA and striker Zenith break down the backboard rotations, boost denial, and comms that held off a 12-shot barrage in overtime.',
    content: [
      'Defense in modern Rocket League is rarely about highlight goal-line saves. It is about closing down shooting lanes before the opponent gets clean contact on the ball.',
      'In this technical replay review, Head Coach K4RMA steps through the team’s communications during the 4-minute overtime hold against Karmine Corp.',
      'By managing small boost pad routes through the midfield, Vortex and Aura maintained third-man coverage without conceding midfield ball control.'
    ],
    badge: 'TACTICS',
    author: 'Coach K4RMA',
    source: 'system',
    createdAt: '2026-09-28T14:30:00.000Z'
  },
  {
    id: 'news-3',
    title: 'FAZIX RISING: 2026 ACADEMY LINEUP',
    date: 'September 19, 2026',
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=800&q=80',
    summary: 'Welcoming Pulse, Cypher, and Nexus to our developmental squad as they prepare for the weekly European open circuits.',
    content: [
      'FAZIX is pleased to announce our 2026 developmental lineup for Fazix Rising, our official academy team.',
      'Selected from over 140 applicants across the European ladder, Pulse (Denmark), Cypher (Sweden), and Nexus (Italy) will represent Fazix across regional open circuits and ranked 6mans brackets.',
      'The squad will train under academy coach Echo, with direct scrimmage access against our main RLCS team.'
    ],
    badge: 'ACADEMY',
    author: 'Fazix Management',
    source: 'system',
    createdAt: '2026-09-19T11:00:00.000Z'
  },
  {
    id: 'news-4',
    title: 'NRW BOOTCAMP & FACILITY PREP',
    date: 'September 12, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=800&q=80',
    summary: 'Two weeks of double practice blocks, tactical reviews with coach K4RMA, and LAN setup rehearsal ahead of the European playoffs.',
    content: [
      'The entire Fazix Rocket League squad has arrived at our team facility in North Rhine-Westphalia for a two-week intensive training camp.',
      'Training focuses on comms pacing under pressure, defensive clears off the backboard, and set-piece kickoffs.',
      'Fans can watch behind-the-scenes vlogs on our YouTube channel throughout the bootcamp.'
    ],
    badge: 'BOOTCAMP',
    author: 'Fazix Media',
    source: 'system',
    createdAt: '2026-09-12T16:00:00.000Z'
  }
];

const SEED_TICKER: NewsTicker = {
  id: 'ticker-seed-1',
  badge: 'BREAKING',
  text: 'FAZIX QUALIFIES FOR RLCS EUROPE REGIONAL 1 MAIN EVENT — SWISS STAGE BEGINS FRIDAY AT 17:00 CET',
  link: '#news',
  articleId: 'news-1',
  priority: 'high',
  isActive: true,
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

/**
 * Loads the news database from disk or memory
 */
export async function getNewsDatabase(): Promise<NewsDatabase> {
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
 * Saves the news database to disk atomically
 */
export async function saveNewsDatabase(data: NewsDatabase): Promise<void> {
  data.lastUpdated = new Date().toISOString();
  inMemoryStore = data;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      await fs.promises.mkdir(DATA_DIR, { recursive: true });
    }
    await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('[NewsStore] Failed to persist news.json to disk:', error);
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
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80'
  ];
  const pickedImage = defaultImages[db.articles.length % defaultImages.length];

  const newArticle: NewsArticle = {
    id,
    title: params.title.trim().toUpperCase(),
    date: formatDate(now),
    readTime: params.readTime || `${Math.max(2, Math.ceil((paragraphs.join(' ').split(' ').length) / 130))} min read`,
    image: params.image || pickedImage,
    summary: params.summary?.trim() || fallbackSummary,
    content: paragraphs.length > 0 ? paragraphs : [params.summary || params.title],
    badge: (params.badge || 'UPDATE').trim().toUpperCase(),
    author: params.author || 'Discord Bot',
    url: params.url,
    pinned: Boolean(params.pinned),
    source: 'discord',
    createdAt: now.toISOString()
  };

  // Add new article to the beginning
  db.articles = [newArticle, ...db.articles];

  let updatedTicker: NewsTicker | undefined;

  // If setTicker is requested, update the top badge ticker
  if (params.setTicker) {
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
