import React from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { deserializeSession, SESSION_COOKIE_NAME } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'FAZIX Esports Portal | Player & Manager Dashboard',
  description: 'Official FAZIX Rocket League competitive dashboard for players, managers, and coaching staff.',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    redirect('/login');
  }

  const session = deserializeSession(sessionCookie);
  if (!session) {
    redirect('/login');
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        margin: 0,
        padding: 0,
        backgroundColor: '#131316',
        color: '#FFFFFF',
        fontFamily: 'var(--font-helvetica), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {children}
    </div>
  );
}
