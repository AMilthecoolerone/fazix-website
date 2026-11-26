import { requireStaff, jsonError } from '@/lib/session';
import { listJobs, createJob, sanitizeJob } from '@/lib/jobs';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await requireStaff();
  if (session instanceof Response) return session;
  return Response.json({ jobs: await listJobs() });
}

export async function POST(req: Request) {
  const session = await requireStaff();
  if (session instanceof Response) return session;
  const input = sanitizeJob(await req.json().catch(() => ({})));
  if (!input.title) return jsonError(400, 'Give the job a title.');
  return Response.json({ job: await createJob(input, session.displayName) }, { status: 201 });
}
