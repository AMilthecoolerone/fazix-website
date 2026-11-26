import { NextResponse } from 'next/server';
import { getDiscordMembersData } from '@/lib/discordMembers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get('refresh') === '1';
  const data = await getDiscordMembersData({ forceRefresh });
  return NextResponse.json(data, { status: data.success ? 200 : 503 });
}
