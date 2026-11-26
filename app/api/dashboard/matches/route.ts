import { requireStaff, jsonError } from '@/lib/session';
import { listMatches, createMatch, sanitizeMatch } from '@/lib/matches';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await requireStaff();
  if (session instanceof Response) return session;
  return Response.json({ matches: await listMatches() });
}

export async function POST(req: Request) {
  const session = await requireStaff();
  if (session instanceof Response) return session;
  const input = sanitizeMatch(await req.json().catch(() => ({})));
  if (!input.opponent) return jsonError(400, 'Enter the opponent.');
  return Response.json({ match: await createMatch(input, session.displayName) }, { status: 201 });
}
