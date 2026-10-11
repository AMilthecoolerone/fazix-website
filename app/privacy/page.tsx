import React from 'react';
import type { Metadata } from 'next';
import { PrivacyClient } from '@/components/PrivacyClient';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung | Privacy Policy | FAZIX Esports',
  description: 'Datenschutzerklärung der FAZIX Esports Organisation gemäß EU-Datenschutz-Grundverordnung (EU-DSGVO).',
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}

