import type { Metadata } from 'next';
import { Chakra_Petch, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';

const chakraPetch = Chakra_Petch({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-discord-display',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-discord-body',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-discord-mono',
});

export const metadata: Metadata = {
  title: 'Discord Analytics | FAZIX Esports',
  description:
    'Live FAZIX Esports Discord telemetry: current online users, total server members, join velocity graphs, and recently joined members.',
  openGraph: {
    title: 'Discord Analytics | FAZIX Esports',
    description:
      'Live FAZIX Esports Discord telemetry: online users, total server size, growth chart, and latest joined members.',
  },
};

export default function DiscordLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${chakraPetch.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
    >
      {children}
    </div>
  );
}
