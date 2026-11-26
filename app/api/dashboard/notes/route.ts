import { requireStaff, jsonError, clampText } from '@/lib/session';
import { listNotes, addNote } from '@/lib/staffNotes';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await requireStaff();
  if (session instanceof Response) return session;
  return Response.json({ notes: await listNotes() });
}

export async function POST(req: Request) {
  const session = await requireStaff();
  if (session instanceof Response) return session;
  const body = await req.json().catch(() => ({}));
  const text = clampText(body.text, 280);
  if (!text) return jsonError(400, 'Write something first.');
  const note = await addNote(text, { id: session.id, name: session.displayName, avatarUrl: session.avatarUrl });
  return Response.json({ note }, { status: 201 });
}
