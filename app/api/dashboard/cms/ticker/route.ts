import { requireStaff, jsonError, clampText } from '@/lib/session';
import { getNewsDatabase, updateTicker, clearTicker } from '@/lib/newsStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await requireStaff();
  if (session instanceof Response) return session;
  return Response.json({ ticker: (await getNewsDatabase()).ticker });
}

export async function PUT(req: Request) {
  const session = await requireStaff({ write: true });
  if (session instanceof Response) return session;
  const body = await req.json().catch(() => ({}));
  const text = clampText(body.text, 200);
  if (!text) return jsonError(400, 'Ticker text is required.');
  const priority = (['normal', 'high', 'urgent'] as const).includes(body.priority) ? body.priority : 'normal';
  const ticker = await updateTicker({
    text,
    badge: clampText(body.badge, 24),
    link: clampText(body.link, 300) || undefined,
    articleId: clampText(body.articleId, 80) || undefined,
    priority,
    isActive: true,
  });
  return Response.json({ ticker });
}

export async function DELETE() {
  const session = await requireStaff({ write: true });
  if (session instanceof Response) return session;
  await clearTicker();
  return Response.json({ ok: true });
}
