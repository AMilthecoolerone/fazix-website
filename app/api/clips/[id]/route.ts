import { requireStaff, requireUser, isStaff, jsonError } from '@/lib/session';
import { reviewClip, deleteClip } from '@/lib/clips';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireStaff({ write: true });
  if (session instanceof Response) return session;
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const clip = await reviewClip(id, { status: body.status, reviewNote: body.reviewNote }, session.displayName);
  return clip ? Response.json({ clip }) : jsonError(404, 'Clip not found.');
}

/** Staff can delete any clip; members can delete their own. */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireUser({ write: true });
  if (session instanceof Response) return session;
  const { id } = await params;
  const ok = await deleteClip(id, isStaff(session) ? undefined : session.id);
  return ok ? Response.json({ ok: true }) : jsonError(404, 'Clip not found.');
}
