import { requireStaff, jsonError } from '@/lib/session';
import { updateApplication, deleteApplication } from '@/lib/jobs';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireStaff();
  if (session instanceof Response) return session;
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const app = await updateApplication(id, { status: body.status, staffNotes: body.staffNotes, rating: body.rating }, session.displayName);
  return app ? Response.json({ application: app }) : jsonError(404, 'Application not found.');
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireStaff();
  if (session instanceof Response) return session;
  const { id } = await params;
  return (await deleteApplication(id)) ? Response.json({ ok: true }) : jsonError(404, 'Application not found.');
}
