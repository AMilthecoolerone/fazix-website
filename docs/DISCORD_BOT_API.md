# FAZIX Esports — Discord Bot & Website News API

Secure communication API between the FAZIX Discord Bot and the `fazix-esport.xyz` website.

Allows moderators and Discord bots to:
1. **Push live breaking news tickers & banners** with a pulsing badge that scroll across the top of every screen on the website.
2. **Publish full articles & announcements** that appear immediately in the "LATEST NEWS & ARTICLES" section and homepage modal.
3. **Control banner visibility** (activate, update, or dismiss remotely).

---

## 1. Security & Authentication

Every modifying request must be authenticated with the secret token configured in your `.env.local` file:

```env
FAZIX_DISCORD_BOT_SECRET="your_secure_secret_token_here"
```

### Supported Authentication Headers:
- **`Authorization: Bearer <token>`** (Recommended)
- **`X-Fazix-Secret: <token>`**
- **`X-Fazix-Key: <token>`**

> **Timing Attack Protection**: The server validates tokens using constant-time SHA-256 buffer comparison (`crypto.timingSafeEqual`) to prevent timing attacks.

---

## 2. Rate Limiting & Protection

All endpoints are protected by rate limiting with automatic anti-brute-force defense:

| Endpoint | Method | Rate Limit | Purpose |
| :--- | :--- | :--- | :--- |
| `/api/news` | `GET` | 120 req / min | Public article & banner retrieval |
| `/api/news` | `POST` | 60 actions / min | Bot news publishing / ticker update |
| `/api/news` | `DELETE` | 30 req / min | Article / ticker deletion |
| `/api/news/ticker` | `GET` | 120 req / min | Lightweight banner polling |
| `/api/news/ticker` | `POST` | 60 req / min | Bot fast ticker updates |
| `/api/news/ticker` | `DELETE` | 30 req / min | Bot ticker clearing |
| `/api/news/status` | `GET` | 30 req / min | Bot connectivity / heartbeat test |

### Rate Limit Headers Returned
Every response includes standard rate-limit tracking headers:
- `X-RateLimit-Limit`: Maximum requests allowed in the window
- `X-RateLimit-Remaining`: Requests remaining in the current window
- `X-RateLimit-Reset`: Unix timestamp (seconds) when the quota resets

### Anti-Brute-Force Lockout
If a client provides an invalid or missing token 5 consecutive times, the client's IP is automatically locked out for **15 minutes**.
When locked out or rate-limited, the server returns **`HTTP 429 Too Many Requests`**:
```json
{
  "success": false,
  "error": "Too many failed authentication attempts. Access locked for 15 minute(s).",
  "retryAfterSeconds": 900
}
```
Header: `Retry-After: 900`

---

## 2. API Endpoints

### `GET /api/news`
**Public** — Fetches active news articles and the currently active top announcement ticker.

#### Query Parameters:
- `tickerOnly=true` — Returns only the active top ticker object for fast polling.
- `limit=N` — Maximum articles to return (default: 20, max: 50).

#### Response (200 OK):
```json
{
  "success": true,
  "ticker": {
    "id": "ticker-1791495294423",
    "badge": "BREAKING",
    "text": "FAZIX QUALIFIES FOR RLCS EUROPE REGIONAL 1 MAIN EVENT — SWISS STAGE BEGINS FRIDAY AT 17:00 CET",
    "link": "#news",
    "articleId": "news-1",
    "priority": "high",
    "isActive": true,
    "updatedAt": "2026-10-08T21:34:54.423Z"
  },
  "articles": [
    {
      "id": "news-1",
      "title": "RLCS REGIONAL 1 MAIN EVENT QUALIFIER",
      "date": "October 4, 2026",
      "readTime": "4 min read",
      "image": "https://images.unsplash.com/...",
      "summary": "A clutch Game 7 overtime victory...",
      "content": ["..."],
      "badge": "RLCS",
      "author": "FAZIX Esports"
    }
  ],
  "count": 4,
  "total": 4,
  "lastUpdated": "2026-10-08T21:34:54.423Z"
}
```

---

### `POST /api/news`
**Authenticated** — Used by the Discord bot to publish articles or update the top ticker banner.

#### Action 1: Set / Update Top Ticker Banner
```json
POST /api/news
Headers:
  Authorization: Bearer <YOUR_SECRET>
  Content-Type: application/json

Body:
{
  "action": "set_ticker",
  "badge": "RLCS LIVE",
  "text": "FAZIX vs Karmine Corp Game 5 Overtime live now on twitch.tv/fazix_esports!",
  "link": "https://twitch.tv/fazix_esports",
  "priority": "urgent"
}
```

#### Action 2: Publish Full Article (with optional top ticker)
```json
POST /api/news
Headers:
  Authorization: Bearer <YOUR_SECRET>
  Content-Type: application/json

Body:
{
  "action": "create_article",
  "title": "NEW ROSTER SIGNING: M80 DUO JOINS FAZIX",
  "badge": "ROSTER",
  "summary": "Announcing our new starting lineup ahead of the European Swiss stage.",
  "content": [
    "Following intensive trials throughout September, FAZIX is proud to announce...",
    "The new roster will make their competitive debut this Friday."
  ],
  "author": "Coach K4RMA",
  "image": "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
  "setTicker": true,
  "tickerBadge": "ROSTER ANNOUNCEMENT",
  "tickerText": "OFFICIAL: FAZIX signs new European starting roster ahead of RLCS Swiss Stage!"
}
```

#### Action 3: Clear / Deactivate Top Ticker
```json
POST /api/news
Headers:
  Authorization: Bearer <YOUR_SECRET>
  Content-Type: application/json

Body:
{
  "action": "clear_ticker"
}
```

#### Action 4: Delete an Article
```json
POST /api/news
Headers:
  Authorization: Bearer <YOUR_SECRET>
  Content-Type: application/json

Body:
{
  "action": "delete_article",
  "id": "news-bot-123456789"
}
```

---

### `GET /api/news/status`
**Authenticated** — Health check and connectivity verification for your bot.

```bash
curl -H "Authorization: Bearer YOUR_SECRET" http://localhost:3000/api/news/status
```

Response (200 OK):
```json
{
  "success": true,
  "status": "authenticated",
  "serverTime": "2026-10-08T21:35:00.000Z",
  "articlesCount": 4,
  "hasActiveTicker": true,
  "activeTicker": {
    "badge": "BREAKING",
    "text": "FAZIX QUALIFIES FOR RLCS EUROPE REGIONAL 1 MAIN EVENT...",
    "updatedAt": "2026-10-08T21:34:54.423Z"
  }
}
```

---

## 3. Discord Bot Integration Example (Discord.js v14)

```javascript
import { Client, GatewayIntentBits, SlashCommandBuilder } from 'discord.js';

const WEBSITE_API = process.env.FAZIX_API_URL || 'https://fazix-esport.xyz';
const BOT_SECRET = process.env.FAZIX_DISCORD_BOT_SECRET;

// 1. Slash command: /banner
export const bannerCommand = new SlashCommandBuilder()
  .setName('banner')
  .setDescription('Set or update the announcement text streaming across the top of the website')
  .addStringOption(opt =>
    opt.setName('text')
      .setDescription('Announcement text running across the top of the site')
      .setRequired(true))
  .addStringOption(opt =>
    opt.setName('link')
      .setDescription('Optional click link or #section')
      .setRequired(false));

// 2. Slash command: /news
export const newsCommand = new SlashCommandBuilder()
  .setName('news')
  .setDescription('Publish a new article to the FAZIX website')
  .addStringOption(opt =>
    opt.setName('title')
      .setDescription('Headline title of the article')
      .setRequired(true))
  .addStringOption(opt =>
    opt.setName('summary')
      .setDescription('Short summary shown in cards')
      .setRequired(true))
  .addStringOption(opt =>
    opt.setName('content')
      .setDescription('Full article body paragraphs (optional)')
      .setRequired(false))
  .addStringOption(opt =>
    opt.setName('badge')
      .setDescription('Tag badge (e.g. RLCS, ROSTER, OFFICIAL)')
      .setRequired(false))
  .addBooleanOption(opt =>
    opt.setName('show_on_banner')
      .setDescription('Also stream this headline on the top banner? (true/false)')
      .setRequired(false));
```

---

## 4. Testing Locally via CLI

You can test both commands right now from your terminal using the helper script:

```bash
# 1. Create or update top banner
node scripts/discord_news_bot.mjs --banner --text "Game 7 OT vs BDS starting right now!"

# 2. Create a news article
node scripts/discord_news_bot.mjs --news --title "NEW ROSTER SIGNING" --summary "Welcoming our substitute" --badge "ROSTER"

# 3. Clear the top banner
node scripts/discord_news_bot.mjs --clear-banner
```
