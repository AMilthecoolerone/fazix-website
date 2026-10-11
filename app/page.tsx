import { getNewsDatabase } from '@/lib/newsStore';
import { HomeClient } from '@/components/HomeClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  const db = await getNewsDatabase();
  return (
    <HomeClient
      initialArticles={db.articles}
      initialTicker={db.ticker}
    />
  );
}
