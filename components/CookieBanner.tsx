'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, ChevronDown, ChevronUp, Check, X, Sliders } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { TRANSLATIONS } from '@/lib/translations';

export interface CookiePreferences {
  essential: boolean;
  preferences: boolean;
  analytics: boolean;
  timestamp: string;
}

const STORAGE_KEY = 'fazix_cookie_consent_v1';

function parseCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function writeCookie(name: string, value: string, maxAgeSeconds: number = 31536000) {
  if (typeof document === 'undefined') return;
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

export function CookieBanner() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language] || TRANSLATIONS.EN;
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    preferences: false,
    analytics: false,
  });

  const loadCurrentPreferences = () => {
    try {
      // 1. Try LocalStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed) {
          setPreferences({
            essential: true,
            preferences: Boolean(parsed.preferences),
            analytics: Boolean(parsed.analytics),
          });
          return true;
        }
      }

      // 2. Try document.cookie
      const cookieConsent = parseCookie('fazix_cookie_consent');
      if (cookieConsent) {
        const isAll = cookieConsent === 'all';
        const hasAnalytics = isAll || parseCookie('fazix_cookie_analytics') === '1';
        const hasPrefs = isAll || parseCookie('fazix_cookie_preferences') === '1';
        setPreferences({
          essential: true,
          preferences: hasPrefs,
          analytics: hasAnalytics,
        });
        return true;
      }
    } catch {
      return false;
    }
    return false;
  };

  useEffect(() => {
    const consentFound = loadCurrentPreferences();
    if (!consentFound) {
      const timer = setTimeout(() => setIsOpen(true), 600);
      return () => clearTimeout(timer);
    } else {
      setHasInteracted(true);
    }
  }, []);

  // Listen for user triggering cookie settings from footer or privacy page
  useEffect(() => {
    const handleOpenSettings = () => {
      loadCurrentPreferences();
      setShowDetails(true);
      setIsOpen(true);
    };

    window.addEventListener('open-cookie-settings', handleOpenSettings);
    return () => {
      window.removeEventListener('open-cookie-settings', handleOpenSettings);
    };
  }, []);

  const saveConsent = (prefs: { essential: boolean; preferences: boolean; analytics: boolean }) => {
    const payload: CookiePreferences = {
      ...prefs,
      essential: true,
      timestamp: new Date().toISOString(),
    };

    try {
      // 1. Persist to LocalStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

      // 2. Persist real HTTP/browser cookies
      const consentType = prefs.analytics && prefs.preferences ? 'all' : prefs.analytics ? 'analytics' : 'essential';
      writeCookie('fazix_cookie_consent', consentType);
      writeCookie('fazix_cookie_essential', '1');

      if (prefs.preferences) {
        writeCookie('fazix_cookie_preferences', '1');
        writeCookie('fazix_lang', language);
      } else {
        deleteCookie('fazix_cookie_preferences');
      }

      if (prefs.analytics) {
        writeCookie('fazix_cookie_analytics', '1');
      } else {
        deleteCookie('fazix_cookie_analytics');
      }

      // 3. Dispatch event for telemetry/scripts
      window.dispatchEvent(new CustomEvent('fazix-consent-updated', { detail: payload }));
    } catch {
      // Storage fallback
    }

    setHasInteracted(true);
    setIsOpen(false);
    setShowDetails(false);
  };

  const handleAcceptAll = () => {
    saveConsent({
      essential: true,
      preferences: true,
      analytics: true,
    });
  };

  const handleAcceptEssential = () => {
    saveConsent({
      essential: true,
      preferences: false,
      analytics: false,
    });
  };

  const handleSaveCustom = () => {
    saveConsent(preferences);
  };

  return (
    <>
      {/* Floating Reopen Badge (discrete shield in bottom-left when banner is closed) */}
      {!isOpen && hasInteracted && (
        <button
          type="button"
          onClick={() => {
            loadCurrentPreferences();
            setShowDetails(true);
            setIsOpen(true);
          }}
          aria-label={t.footer.cookieSettings}
          title={t.footer.cookieSettings}
          style={{
            position: 'fixed',
            bottom: '18px',
            left: '18px',
            zIndex: 99990,
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: '#0E0E14',
            border: '1px solid #282838',
            color: '#FF5900',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.65)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 89, 0, 0.15)';
            e.currentTarget.style.borderColor = '#FF5900';
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#0E0E14';
            e.currentTarget.style.borderColor = '#282838';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Shield size={18} />
        </button>
      )}

      {/* Main Banner Modal */}
      {isOpen && (
        <aside
      aria-label="Cookie & Datenschutz Einstellungen"
      role="region"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        right: '24px',
        maxWidth: '560px',
        margin: '0 auto',
        zIndex: 99999,
        backgroundColor: '#0D0D12',
        border: '1px solid #2A2A38',
        borderRadius: '12px',
        padding: '22px 24px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 89, 0, 0.15)',
        backdropFilter: 'blur(16px)',
        color: '#FFFFFF',
        fontFamily: 'var(--font-helvetica)',
        animation: 'cookieBannerFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 89, 0, 0.12)',
            border: '1px solid rgba(255, 89, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Shield size={20} color="#FF5900" />
        </div>
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              margin: '0 0 4px 0',
              color: '#FFFFFF',
            }}
          >
            {t.cookie.title}
          </h3>
          <p
            style={{
              fontSize: '0.84rem',
              lineHeight: 1.5,
              color: '#A0A0B0',
              margin: 0,
            }}
          >
            {t.cookie.desc}
          </p>
        </div>
      </div>

      {/* Granular Toggles when Details view is open */}
      {showDetails && (
        <div
          style={{
            backgroundColor: '#14141C',
            border: '1px solid #222230',
            borderRadius: '8px',
            padding: '14px 16px',
            marginBottom: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {/* Category: Essential */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#FFFFFF' }}>
                {t.cookie.essentialTitle}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#888898' }}>
                {t.cookie.essentialDesc}
              </div>
            </div>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#FF701E',
                backgroundColor: 'rgba(255, 89, 0, 0.12)',
                padding: '4px 10px',
                borderRadius: '4px',
              }}
            >
              ✓
            </span>
          </div>

          {/* Category: Preferences */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1E1E28', paddingTop: '10px' }}>
            <div style={{ paddingRight: '12px' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#FFFFFF' }}>
                {t.cookie.prefTitle}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#888898' }}>
                {t.cookie.prefDesc}
              </div>
            </div>
            <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={preferences.preferences}
                onChange={(e) => setPreferences((p) => ({ ...p, preferences: e.target.checked }))}
                style={{ width: '18px', height: '18px', accentColor: '#FF5900', cursor: 'pointer' }}
              />
            </label>
          </div>

          {/* Category: Analytics */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1E1E28', paddingTop: '10px' }}>
            <div style={{ paddingRight: '12px' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#FFFFFF' }}>
                {t.cookie.analyticsTitle}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#888898' }}>
                {t.cookie.analyticsDesc}
              </div>
            </div>
            <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) => setPreferences((p) => ({ ...p, analytics: e.target.checked }))}
                style={{ width: '18px', height: '18px', accentColor: '#FF5900', cursor: 'pointer' }}
              />
            </label>
          </div>
        </div>
      )}

      {/* Button Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          justifyContent: 'space-between',
        }}
      >
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          style={{
            background: 'none',
            border: 'none',
            color: '#9090A0',
            fontSize: '0.8rem',
            cursor: 'pointer',
            padding: '6px 0',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
          }}
        >
          <Sliders size={14} />
          {showDetails ? t.cookie.saveCustom : t.cookie.customize}
        </button>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {showDetails ? (
            <button
              type="button"
              onClick={handleSaveCustom}
              style={{
                backgroundColor: '#1E1E28',
                border: '1px solid #363648',
                color: '#FFFFFF',
                borderRadius: '6px',
                padding: '8px 16px',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {t.cookie.saveCustom}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAcceptEssential}
              style={{
                backgroundColor: '#161620',
                border: '1px solid #2E2E3E',
                color: '#E0E0E8',
                borderRadius: '6px',
                padding: '8px 16px',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {t.cookie.acceptEssential}
            </button>
          )}

          <button
            type="button"
            onClick={handleAcceptAll}
            style={{
              backgroundColor: '#FF5900',
              border: 'none',
              color: '#FFFFFF',
              borderRadius: '6px',
              padding: '8px 18px',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'opacity 0.15s ease',
            }}
          >
            {t.cookie.acceptAll}
          </button>
        </div>
      </div>

      {/* Footer Links */}
      <div
        style={{
          marginTop: '12px',
          paddingTop: '10px',
          borderTop: '1px solid #1C1C26',
          display: 'flex',
          gap: '14px',
          fontSize: '0.74rem',
          color: '#707080',
        }}
      >
        <Link href="/privacy" style={{ color: '#888898', textDecoration: 'none' }}>
          {t.footer.privacy}
        </Link>
        <span>·</span>
        <Link href="/imprint" style={{ color: '#888898', textDecoration: 'none' }}>
          {t.footer.imprint}
        </Link>
      </div>
    </aside>
      )}
    </>
  );
}

export default CookieBanner;
