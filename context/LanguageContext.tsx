'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode } from '@/lib/translations';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'EN', label: 'English', flag: '🇬🇧' },
  { code: 'DE', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'FR', label: 'Français', flag: '🇫🇷' },
  { code: 'ES', label: 'Español', flag: '🇪🇸' },
];

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'EN',
  setLanguage: () => {},
  languages: LANGUAGES,
});

const STORAGE_KEY = 'fazix_selected_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('EN');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
      if (stored && (stored === 'EN' || stored === 'DE' || stored === 'FR' || stored === 'ES')) {
        setLanguageState(stored);
        document.documentElement.lang = stored.toLowerCase();
        return;
      }

      // Check browser preference if nothing stored
      if (typeof navigator !== 'undefined' && navigator.language) {
        const nav = navigator.language.toLowerCase();
        if (nav.startsWith('de')) {
          setLanguageState('DE');
          document.documentElement.lang = 'de';
        } else if (nav.startsWith('fr')) {
          setLanguageState('FR');
          document.documentElement.lang = 'fr';
        } else if (nav.startsWith('es')) {
          setLanguageState('ES');
          document.documentElement.lang = 'es';
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = lang.toLowerCase();
        const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
        document.cookie = `fazix_lang=${lang}; path=/; max-age=31536000; SameSite=Lax${secure}`;
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('fazix-language-change', { detail: lang }));
      }
    } catch {
      // ignore
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
