import { requireStaff } from '@/lib/session';
import { listApplications } from '@/lib/jobs';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const session = await requireStaff();
  if (session instanceof Response) return session;
  const jobId = new URL(req.url).searchParams.get('jobId') || undefined;
  return Response.json({ applications: await listApplications(jobId) });
}
