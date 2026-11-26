import { getDiscordMembersData } from '@/lib/discordMembers';
import { DiscordAnalyticsClient } from '@/components/discord/DiscordAnalyticsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DiscordAnalyticsPage() {
  const initialData = await getDiscordMembersData();
  return <DiscordAnalyticsClient initialData={initialData} />;
}
