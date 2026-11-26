import { getSession, jsonError, clampText } from '@/lib/session';
import { getJobBySlug, checkSubmission, addApplication, hasApplied } from '@/lib/jobs';
import { isJobAcceptingApplications } from '@/lib/careerForm';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rateLimit';
import { notifyStaff } from '@/lib/notify';

export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const limit = checkRateLimit('job-apply', getClientIp(req), { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!limit.success) return rateLimitResponse(limit);

  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job || !isJobAcceptingApplications(job)) return jsonError(404, 'This position is no longer accepting applications.');

  const body = await req.json().catch(() => ({}));
  if (clampText(body.website, 100)) return Response.json({ ok: true }); // honeypot for bots

  const session = await getSession();
  if (job.requireDiscord && !session) return jsonError(401, 'Log in with Discord to apply for this position.');
  if (session && (await hasApplied(job.id, session.id))) return jsonError(409, 'You have already applied for this position.');

  // Logged-in applicants are identified by their Discord account, not what they type.
  const name = session?.displayName || clampText(body.name, 80);
  const discord = session?.username || clampText(body.discord, 80);
  const email = clampText(body.email, 160) || session?.email || '';
  if (!name) return jsonError(400, 'Enter your name.');
  if (!discord) return jsonError(400, 'Enter your Discord username.');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return jsonError(400, 'Enter a valid email address.');

  const result = checkSubmission(job, body.answers);
  if ('error' in result) return jsonError(400, result.error);

  const app = await addApplication({
    jobId: job.id,
    jobTitle: job.title,
    applicant: { name, discord, email: email || undefined, discordId: session?.id, avatarUrl: session?.avatarUrl },
    answers: result.answers,
  });
  await notifyStaff(`📝 New application for **${job.title}** from **${name}** (${discord}). Review it in the dashboard.`);
  return Response.json({ ok: true, id: app.id }, { status: 201 });
}
