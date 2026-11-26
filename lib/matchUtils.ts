/** Match types and scoring rules, safe to import from client components. */

export type MatchFormat = 'bo1' | 'bo3' | 'bo5' | 'bo7';
export const MATCH_FORMATS: MatchFormat[] = ['bo1', 'bo3', 'bo5', 'bo7'];
export const FORMAT_LABEL: Record<MatchFormat, string> = { bo1: 'Best of 1', bo3: 'Best of 3', bo5: 'Best of 5', bo7: 'Best of 7' };

export const TEAMS = ['Fazix Pro', 'Fazix Academy', 'Fazix Skyfall', 'Fazix Velour', 'Fazix OGs', 'Fazix Orbit', 'Fazix Vyro', 'Fazix Synchro'];

export interface GameScore {
  id: string;
  us: number;
  them: number;
  ot: boolean;
}

export interface Match {
  id: string;
  team: string;
  opponent: string;
  event: string;
  format: MatchFormat;
  date: string; // ISO
  games: GameScore[];
  forfeit: 'us' | 'them' | null; // who forfeited
  vodUrl: string;
  notes: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export function gamesToWin(format: MatchFormat): number {
  return Math.ceil(Number(format.slice(2)) / 2);
}

export function maxGames(format: MatchFormat): number {
  return Number(format.slice(2));
}

export type SeriesResult = 'win' | 'loss' | 'live' | 'upcoming';

export interface SeriesSummary {
  usWins: number;
  themWins: number;
  result: SeriesResult;
  goalsFor: number;
  goalsAgainst: number;
}

/** Rocket League games can't end level, so a tied game counts for nobody until it's fixed. */
export function summarize(m: Pick<Match, 'games' | 'format' | 'forfeit' | 'date'>): SeriesSummary {
  let usWins = 0;
  let themWins = 0;
  let goalsFor = 0;
  let goalsAgainst = 0;
  const need = gamesToWin(m.format);
  for (const g of m.games) {
    if (usWins >= need || themWins >= need) break; // games after the series was decided don't count
    goalsFor += g.us;
    goalsAgainst += g.them;
    if (g.us > g.them) usWins++;
    else if (g.them > g.us) themWins++;
  }
  let result: SeriesResult;
  if (m.forfeit === 'them') result = 'win';
  else if (m.forfeit === 'us') result = 'loss';
  else if (usWins >= need) result = 'win';
  else if (themWins >= need) result = 'loss';
  else if (m.games.length === 0) result = 'upcoming'; // scheduled, or no scores entered yet
  else result = 'live';
  return { usWins, themWins, result, goalsFor, goalsAgainst };
}
