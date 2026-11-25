import { requireStaff, jsonError } from '@/lib/session';
import { listArticles, saveArticle, parseArticleBody } from '@/lib/cms';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await requireStaff();
  if (session instanceof Response) return session;
  return Response.json({ articles: await listArticles() });
}

export async function POST(req: Request) {
  const session = await requireStaff({ write: true });
  if (session instanceof Response) return session;
  const input = parseArticleBody(await req.json().catch(() => ({})));
  if (!input.title) return jsonError(400, 'Title is required.');
  const article = await saveArticle(null, input, session.displayName);
  return Response.json({ article }, { status: 201 });
}
