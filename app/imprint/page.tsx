import React from 'react';
import type { Metadata } from 'next';
import { ImprintClient } from '@/components/ImprintClient';

export const metadata: Metadata = {
  title: 'Impressum | Legal Disclosure | FAZIX Esports',
  description: 'Legal disclosure and imprint of FAZIX Esports pursuant to § 5 DDG and § 18 MStV.',
};

export default function ImprintPage() {
  return <ImprintClient />;
}

