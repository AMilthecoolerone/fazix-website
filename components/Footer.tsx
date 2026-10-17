'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Sliders } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { TRANSLATIONS } from '@/lib/translations';

export const Footer: React.FC = () => {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language] || TRANSLATIONS.EN;

  return (
    <footer
      style={{
        backgroundColor: '#111114',
        borderTop: '1px solid #1C1C22',
        padding: '70px 0 36px 0',
        color: '#FFFFFF',
        fontFamily: 'var(--font-helvetica)',
        position: 'relative'
      }}
      aria-label="Site Footer"
    >
      <div className="container">
        {/* Top Columns Grid */}
        <div className="footer-grid-layout">
          {/* Logo & Brand Wordmark */}
          <div style={{ minWidth: '180px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <img
                src="/images/logo.png"
                alt="FAZIX Logo"
                style={{ width: '38px', height: '38px', objectFit: 'contain' }}
              />
              <span style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                color: '#FFFFFF'
              }}>
                FAZIX
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#888892', lineHeight: 1.6, maxWidth: '220px' }}>
              {t.footer.brandDesc}
            </p>
          </div>

          {/* Column 1: COMPETITION */}
          <div>
            <h4 style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              marginBottom: '18px'
            }}>
              {t.footer.colCompetition}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>

              <li>
                <a
                  href="/apply"
                  style={{ color: '#FF701E', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFA166')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#FF701E')}
                >
                  {t.footer.linkApplyRoster}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: COMMUNITY */}
          <div>
            <h4 style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              marginBottom: '18px'
            }}>
              {t.footer.colCommunity}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <a
                  href="https://discord.gg/UdnGPHmvcT"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#8E8E98', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#8E8E98')}
                >
                  {t.footer.linkDiscord}
                </a>
              </li>
              <li>
                <a
                  href="https://www.twitch.tv/fazix_esports"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#8E8E98', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#8E8E98')}
                >
                  {t.footer.linkTwitch}
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/UdnGPHmvcT"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#8E8E98', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#8E8E98')}
                >
                  {t.footer.linkSixMans}
                </a>
              </li>
              <li>
                <a
                  href="https://www.twitch.tv/fazix_esports"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#8E8E98', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#8E8E98')}
                >
                  {t.footer.linkWatchParties}
                </a>
              </li>
              <li>
                <a
                  href="/creators"
                  style={{ color: '#8E8E98', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#8E8E98')}
                >
                  {t.footer.linkCreators}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: COMPANY */}
          <div>
            <h4 style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              marginBottom: '18px'
            }}>
              {t.footer.colCompany}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <a
                  href="/#about"
                  style={{ color: '#8E8E98', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#8E8E98')}
                >
                  {t.footer.linkAbout}
                </a>
              </li>

              <li>
                <a
                  href="/#news"
                  style={{ color: '#8E8E98', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#8E8E98')}
                >
                  {t.footer.linkNews}
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  style={{ color: '#8E8E98', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#8E8E98')}
                >
                  <span>Player & Staff Portal</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: GETTING STARTED + ORANGE CONTACT US BUTTON */}
          <div>
            <h4 style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              marginBottom: '18px'
            }}>
              {t.footer.colGettingStarted}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <li>
                <a
                  href="/apply"
                  style={{ color: '#FFFFFF', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}
                >
                  {t.footer.linkApplyTeam}
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  style={{ color: '#8E8E98', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#8E8E98')}
                >
                  {t.footer.linkContactMgmt}
                </a>
              </li>
            </ul>

            {/* Rounded Orange Pill Button (From User Reference Image) */}
            <a
              href="/contact"
              style={{
                backgroundColor: '#FF5900',
                color: '#FFFFFF',
                fontFamily: 'var(--font-helvetica)',
                fontSize: '0.86rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: '9999px',
                padding: '9px 24px',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'background-color 0.2s',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FF701E')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FF5900')}
            >
              {t.nav.companyDropdown.contactTitle}
            </a>
          </div>
        </div>

        {/* Bottom Bar (Matching PlayVS reference image) */}
        <div style={{
          paddingTop: '32px',
          borderTop: '1px solid #1C1C22',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          {/* Social Icons & Copyright */}
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
              {/* YouTube */}
              <a
                href="https://www.youtube.com/@Fazix-eSports"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                style={{ color: '#FFFFFF', opacity: 0.8, textDecoration: 'none', transition: 'opacity 0.2s', minWidth: '40px', minHeight: '40px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* Twitch */}
              <a
                href="https://www.twitch.tv/fazix_esports"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitch"
                style={{ color: '#FFFFFF', opacity: 0.8, textDecoration: 'none', transition: 'opacity 0.2s', minWidth: '40px', minHeight: '40px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
                </svg>
              </a>

              {/* Discord */}
              <a
                href="https://discord.gg/UdnGPHmvcT"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
                style={{ color: '#FFFFFF', opacity: 0.8, textDecoration: 'none', transition: 'opacity 0.2s', minWidth: '40px', minHeight: '40px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/fazix_esports/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={{ color: '#FFFFFF', opacity: 0.8, textDecoration: 'none', transition: 'opacity 0.2s', minWidth: '40px', minHeight: '40px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@fazix_esports"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                style={{ color: '#FFFFFF', opacity: 0.8, textDecoration: 'none', transition: 'opacity 0.2s', minWidth: '40px', minHeight: '40px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.525.02c1.31 0 2.6.45 3.63 1.25.1.08.19.16.28.25.99.99 1.57 2.33 1.61 3.73v.15a6.57 6.57 0 0 0 3.96 1.41v3.42a9.98 9.98 0 0 1-3.95-.91v7.62c0 4.45-3.62 8.06-8.07 8.06-4.45 0-8.06-3.61-8.06-8.06 0-4.45 3.61-8.07 8.06-8.07.45 0 .9.04 1.34.12v3.6a4.57 4.57 0 0 0-1.34-.2 4.55 4.55 0 1 0 4.55 4.55V.02h3.29z" />
                </svg>
              </a>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6A6A74' }}>
              {t.footer.copyright}
            </div>
          </div>

          {/* Center/Right Imprints & Policies */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px 20px',
            fontSize: '0.78rem',
            color: '#8E8E98'
          }}>
            <Link
              href="/privacy"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontWeight: 600
              }}
            >
              <Shield size={14} color="#FF5900" /> {t.footer.privacy}
            </Link>
            <Link href="/imprint" style={{ color: '#8E8E98', textDecoration: 'none' }}>
              {t.footer.imprint}
            </Link>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-cookie-settings'));
                }
              }}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: '#8E8E98',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontFamily: 'inherit',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#8E8E98')}
            >
              <Sliders size={13} color="#FF5900" /> {t.footer.cookieSettings}
            </button>
            <Link href="/contact" style={{ color: '#8E8E98', textDecoration: 'none' }}>
              {t.footer.dsgvoRequests}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
