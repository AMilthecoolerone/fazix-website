import { getSession, isStaff, requireStaff, jsonError } from '@/lib/session';
import { getJob, updateJob, deleteJob, sanitizeJob } from '@/lib/jobs';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await getJob(id);
  if (!job || (job.status !== 'open' && !isStaff(await getSession()))) return jsonError(404, 'Job not found.');
  return Response.json({ job });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireStaff();
  if (session instanceof Response) return session;
  const { id } = await params;
  const raw = await req.json().catch(() => ({}));
  // Status-only toggle, or a full edit.
  const patch = Object.keys(raw).length === 1 && 'status' in raw ? { status: sanitizeJob({ status: raw.status }).status } : sanitizeJob(raw);
  if ('title' in patch && !patch.title) return jsonError(400, 'Title is required.');
  const job = await updateJob(id, patch);
  return job ? Response.json({ job }) : jsonError(404, 'Job not found.');
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireStaff();
  if (session instanceof Response) return session;
  const { id } = await params;
  return (await deleteJob(id)) ? Response.json({ ok: true }) : jsonError(404, 'Job not found.');
}
