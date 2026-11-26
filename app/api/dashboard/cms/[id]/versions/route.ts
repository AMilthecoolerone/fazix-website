import { requireStaff, jsonError, clampText } from '@/lib/session';
import { getVersions, restoreVersion } from '@/lib/cms';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireStaff();
  if (session instanceof Response) return session;
  const { id } = await params;
  return Response.json({ versions: await getVersions(id) });
}

/** Restore: body { versionId } */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireStaff();
  if (session instanceof Response) return session;
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  try {
    return Response.json({ article: await restoreVersion(id, clampText(body.versionId, 80), session.displayName) });
  } catch {
    return jsonError(404, 'Version not found.');
  }
}
