import { getSession, isStaff, requireUser, jsonError, clampText } from '@/lib/session';
import { listClips, addClip, CLIP_CATEGORIES } from '@/lib/clips';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rateLimit';
import { notifyStaff } from '@/lib/notify';

export const dynamic = 'force-dynamic';

/** ?scope=public → approved/featured clips for the site. Otherwise staff see all, members see their own. */
export async function GET(req: Request) {
  const clips = await listClips();
  if (new URL(req.url).searchParams.get('scope') === 'public') {
    return Response.json({
      clips: clips
        .filter((c) => c.status === 'approved' || c.status === 'featured')
        .map(({ reviewNote: _n, reviewedBy: _r, ...c }) => c),
    });
  }
  const session = await getSession();
  if (!session) return jsonError(401, 'Not signed in.');
  return Response.json({ clips: isStaff(session) ? clips : clips.filter((c) => c.submittedBy.id === session.id) });
}

export async function POST(req: Request) {
  const session = await requireUser({ write: true });
  if (session instanceof Response) return session;
  const limit = checkRateLimit('clip-submit', session.id, { limit: 10, windowMs: 60 * 60 * 1000 });
  if (!limit.success) return rateLimitResponse(limit);

  const body = await req.json().catch(() => ({}));
  const title = clampText(body.title, 120);
  const url = clampText(body.url, 500);
  if (!title) return jsonError(400, 'Give your clip a title.');
  if (!/^https:\/\/\S+$/i.test(url)) return jsonError(400, 'Paste a link to the clip starting with https://');
  const category = CLIP_CATEGORIES.includes(body.category) ? body.category : 'Other';

  const clip = await addClip({
    title,
    url,
    category,
    description: clampText(body.description, 1000),
    submittedBy: { id: session.id, name: session.displayName, avatarUrl: session.avatarUrl },
  });
  await notifyStaff(`🎬 New clip submitted by **${session.displayName}**: ${title} <${url}>`);
  return Response.json({ clip }, { status: 201 });
}
