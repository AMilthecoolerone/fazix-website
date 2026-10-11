import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact & Inquiries | FAZIX Esports',
  description: 'Get in touch with the management and team at FAZIX Esports for partnerships, press, or general inquiries.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
