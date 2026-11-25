import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Tiny key/value document store used by the staff dashboard (CMS, jobs, clips).
 *
 * Backends, in order of preference:
 *  1. Upstash Redis / Vercel KV over REST — set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
 *     (or KV_REST_API_URL + KV_REST_API_TOKEN). Required for durable data on Vercel.
 *  2. JSON files in ./data (local dev / self-hosted), falling back to the OS temp dir
 *     when the project directory is read-only. Temp-dir data does NOT survive redeploys.
 */

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '';
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '';
const KEY_PREFIX = 'fazix:';

const DATA_DIR = path.join(process.cwd(), 'data');
const TMP_DIR = path.join(os.tmpdir(), 'fazix-data');

export function storeBackend(): 'redis' | 'file' {
  return REDIS_URL && REDIS_TOKEN ? 'redis' : 'file';
}

async function redis(command: unknown[]): Promise<unknown> {
  const res = await fetch(REDIS_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Redis request failed: ${res.status}`);
  const json = (await res.json()) as { result?: unknown; error?: string };
  if (json.error) throw new Error(json.error);
  return json.result;
}

function safeName(key: string): string {
  return key.replace(/[^a-z0-9_-]/gi, '_') + '.json';
}

export async function readDoc<T>(key: string, fallback: T): Promise<T> {
  if (storeBackend() === 'redis') {
    const raw = (await redis(['GET', KEY_PREFIX + key])) as string | null;
    return raw ? (JSON.parse(raw) as T) : fallback;
  }
  for (const dir of [TMP_DIR, DATA_DIR]) {
    try {
      const raw = await fs.promises.readFile(path.join(dir, safeName(key)), 'utf8');
      return JSON.parse(raw) as T;
    } catch {
      // try next location
    }
  }
  return fallback;
}

export async function writeDoc<T>(key: string, value: T): Promise<void> {
  const body = JSON.stringify(value, null, 2);
  if (storeBackend() === 'redis') {
    await redis(['SET', KEY_PREFIX + key, body]);
    return;
  }
  try {
    await fs.promises.mkdir(DATA_DIR, { recursive: true });
    await fs.promises.writeFile(path.join(DATA_DIR, safeName(key)), body, 'utf8');
    // Remove a stale temp copy so reads see the canonical file.
    await fs.promises.rm(path.join(TMP_DIR, safeName(key)), { force: true });
  } catch {
    await fs.promises.mkdir(TMP_DIR, { recursive: true });
    await fs.promises.writeFile(path.join(TMP_DIR, safeName(key)), body, 'utf8');
  }
}

// Serialise read-modify-write cycles per key within one server instance.
const locks = new Map<string, Promise<unknown>>();

export async function updateDoc<T, R>(
  key: string,
  fallback: T,
  mutate: (doc: T) => R | Promise<R>
): Promise<R> {
  const prev = locks.get(key) ?? Promise.resolve();
  const run = prev.then(async () => {
    const doc = await readDoc<T>(key, fallback);
    const result = await mutate(doc);
    await writeDoc(key, doc);
    return result;
  });
  locks.set(key, run.catch(() => undefined));
  return run;
}

export function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
