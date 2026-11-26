import { getSession, isStaff, requireStaff, jsonError } from '@/lib/session';
import { listJobs, createJob, sanitizeJob } from '@/lib/jobs';

export const dynamic = 'force-dynamic';

/** Public: open jobs. Staff with ?all=1: every job incl. drafts/closed. */
export async function GET(req: Request) {
  const all = new URL(req.url).searchParams.get('all') === '1';
  const staff = all && isStaff(await getSession());
  return Response.json({ jobs: await listJobs({ publicOnly: !staff }) });
}

export async function POST(req: Request) {
  const session = await requireStaff();
  if (session instanceof Response) return session;
  const input = sanitizeJob(await req.json().catch(() => ({})));
  if (!input.title) return jsonError(400, 'Title is required.');
  return Response.json({ job: await createJob(input, session.displayName) }, { status: 201 });
}
