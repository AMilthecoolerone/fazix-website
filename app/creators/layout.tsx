import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Content Creators & Streamers | FAZIX Esports',
  description: 'Meet the official FAZIX Esports content creators, casters, and community streamers.',
};

export default function CreatorsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
