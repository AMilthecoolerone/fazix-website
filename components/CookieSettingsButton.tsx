'use client';

import React from 'react';
import { Sliders } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { TRANSLATIONS } from '@/lib/translations';

export function CookieSettingsButton() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language] || TRANSLATIONS.EN;

  return (
    <button
      type="button"
      id="cookie-consent-reopen-btn"
      onClick={() => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('open-cookie-settings'));
        }
      }}
      style={{
        backgroundColor: '#1C1C26',
        border: '1px solid #FF5900',
        color: '#FFFFFF',
        padding: '10px 18px',
        borderRadius: '6px',
        fontSize: '0.86rem',
        fontWeight: 700,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'background-color 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 89, 0, 0.18)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#1C1C26';
      }}
    >
      <Sliders size={15} color="#FF5900" /> {t.footer.cookieSettings}
    </button>
  );
}

