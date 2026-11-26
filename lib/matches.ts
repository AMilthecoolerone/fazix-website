import { readDoc, updateDoc, newId } from '@/lib/store';
import { clampText } from '@/lib/session';
import { MATCH_FORMATS, type Match, type MatchFormat, type GameScore } from '@/lib/matchUtils';

export type { Match, MatchFormat, GameScore } from '@/lib/matchUtils';

const KEY = 'matches';

export async function listMatches(): Promise<Match[]> {
  const matches = await readDoc<Match[]>(KEY, []);
  return matches.sort((a, b) => b.date.localeCompare(a.date));
}

/** Validates untrusted match input from the dashboard. */
export function sanitizeMatch(raw: Record<string, unknown>) {
  const format = MATCH_FORMATS.includes(raw.format as MatchFormat) ? (raw.format as MatchFormat) : 'bo5';
  const date = clampText(raw.date, 40);
  const games: GameScore[] = (Array.isArray(raw.games) ? raw.games : []).slice(0, 7).map((g: Record<string, unknown>) => ({
    id: clampText(g?.id, 40) || newId('g'),
    us: Math.max(0, Math.min(99, Math.floor(Number(g?.us) || 0))),
    them: Math.max(0, Math.min(99, Math.floor(Number(g?.them) || 0))),
    ot: Boolean(g?.ot),
  }));
  return {
    team: clampText(raw.team, 60) || 'Fazix Pro',
    opponent: clampText(raw.opponent, 80),
    event: clampText(raw.event, 100),
    format,
    date: Number.isNaN(Date.parse(date)) ? new Date().toISOString() : new Date(date).toISOString(),
    games,
    forfeit: raw.forfeit === 'us' || raw.forfeit === 'them' ? (raw.forfeit as 'us' | 'them') : null,
    vodUrl: /^https:\/\/\S+$/i.test(clampText(raw.vodUrl, 300)) ? clampText(raw.vodUrl, 300) : '',
    notes: clampText(raw.notes, 1000),
  };
}

export async function createMatch(input: ReturnType<typeof sanitizeMatch>, by: string): Promise<Match> {
  const now = new Date().toISOString();
  const match: Match = { ...input, id: newId('match'), createdBy: by, createdAt: now, updatedAt: now };
  await updateDoc<Match[], void>(KEY, [], (list) => {
    list.push(match);
  });
  return match;
}

export async function updateMatch(id: string, input: ReturnType<typeof sanitizeMatch>): Promise<Match | null> {
  return updateDoc<Match[], Match | null>(KEY, [], (list) => {
    const m = list.find((x) => x.id === id);
    if (!m) return null;
    Object.assign(m, input, { updatedAt: new Date().toISOString() });
    return m;
  });
}

export async function deleteMatch(id: string): Promise<boolean> {
  return updateDoc<Match[], boolean>(KEY, [], (list) => {
    const i = list.findIndex((x) => x.id === id);
    if (i === -1) return false;
    list.splice(i, 1);
    return true;
  });
}
