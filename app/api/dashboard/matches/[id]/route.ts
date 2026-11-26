import { requireStaff, jsonError } from '@/lib/session';
import { updateMatch, deleteMatch, sanitizeMatch } from '@/lib/matches';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireStaff();
  if (session instanceof Response) return session;
  const { id } = await params;
  const input = sanitizeMatch(await req.json().catch(() => ({})));
  if (!input.opponent) return jsonError(400, 'Enter the opponent.');
  const match = await updateMatch(id, input);
  return match ? Response.json({ match }) : jsonError(404, 'Match not found.');
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireStaff();
  if (session instanceof Response) return session;
  const { id } = await params;
  return (await deleteMatch(id)) ? Response.json({ ok: true }) : jsonError(404, 'Match not found.');
}
