import { getSession, jsonError, clampText } from '@/lib/session';
import { getJob, validateAnswers, addApplication } from '@/lib/jobs';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rateLimit';
import { notifyStaff } from '@/lib/notify';

export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const limit = checkRateLimit('job-apply', getClientIp(req), { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!limit.success) return rateLimitResponse(limit);

  const { id } = await params;
  const job = await getJob(id);
  if (!job || job.status !== 'open') return jsonError(404, 'This position is not open.');

  const body = await req.json().catch(() => ({}));
  if (clampText(body.website, 100)) return Response.json({ ok: true }); // honeypot

  const session = await getSession();
  const name = clampText(body.name, 80) || session?.displayName || '';
  const discord = clampText(body.discord, 80) || session?.username || '';
  const email = clampText(body.email, 160);
  if (!name) return jsonError(400, 'Your name is required.');
  if (!discord) return jsonError(400, 'Your Discord username is required.');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return jsonError(400, 'That email address looks wrong.');

  const result = validateAnswers(job, body.answers);
  if ('error' in result) return jsonError(400, result.error);

  const app = await addApplication({
    jobId: job.id,
    jobTitle: job.title,
    applicant: {
      name,
      discord,
      email: email || undefined,
      discordId: session ? session.id : undefined,
      avatarUrl: session ? session.avatarUrl : undefined,
    },
    answers: result.answers,
  });
  await notifyStaff(`📝 New application for **${job.title}** from **${name}** (${discord}). Review it in the dashboard.`);
  return Response.json({ ok: true, id: app.id }, { status: 201 });
}
