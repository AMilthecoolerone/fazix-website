import { requireStaff, jsonError } from '@/lib/session';
import { updateJob, deleteJob, sanitizeJob } from '@/lib/jobs';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireStaff();
  if (session instanceof Response) return session;
  const { id } = await params;
  const input = sanitizeJob(await req.json().catch(() => ({})));
  if (!input.title) return jsonError(400, 'Give the job a title.');
  const job = await updateJob(id, input);
  return job ? Response.json({ job }) : jsonError(404, 'Job not found.');
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireStaff();
  if (session instanceof Response) return session;
  const { id } = await params;
  return (await deleteJob(id)) ? Response.json({ ok: true }) : jsonError(404, 'Job not found.');
}
