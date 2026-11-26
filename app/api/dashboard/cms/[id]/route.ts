import { requireStaff, jsonError } from '@/lib/session';
import { saveArticle, removeArticle, parseArticleBody } from '@/lib/cms';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireStaff();
  if (session instanceof Response) return session;
  const { id } = await params;
  const input = parseArticleBody(await req.json().catch(() => ({})));
  if (!input.title) return jsonError(400, 'Title is required.');
  try {
    return Response.json({ article: await saveArticle(id, input, session.displayName) });
  } catch {
    return jsonError(404, 'Article not found.');
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireStaff();
  if (session instanceof Response) return session;
  const { id } = await params;
  return (await removeArticle(id)) ? Response.json({ ok: true }) : jsonError(404, 'Article not found.');
}
