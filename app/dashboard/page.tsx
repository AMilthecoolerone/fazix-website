import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { deserializeSession, SESSION_COOKIE_NAME, DEMO_PROFILES } from '@/lib/auth';
import { DashboardClient } from '@/components/dashboard/DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    redirect('/login');
  }

  const session = deserializeSession(sessionCookie);
  if (!session) {
    redirect('/login');
  }

  return <DashboardClient initialSession={session} />;
}
