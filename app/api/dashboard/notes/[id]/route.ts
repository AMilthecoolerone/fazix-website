import { requireStaff, jsonError } from '@/lib/session';
import { setPinned, deleteNote } from '@/lib/staffNotes';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireStaff();
  if (session instanceof Response) return session;
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const note = await setPinned(id, Boolean(body.pinned));
  return note ? Response.json({ note }) : jsonError(404, 'Note not found.');
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireStaff();
  if (session instanceof Response) return session;
  const { id } = await params;
  return (await deleteNote(id)) ? Response.json({ ok: true }) : jsonError(404, 'Note not found.');
}
