'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { TopNewsBanner } from './TopNewsBanner';
import type { NewsTicker } from '@/lib/newsStore';
import { useLanguage } from '@/context/LanguageContext';
import {
  ChevronDown,
  Menu,
  X,
  Trophy,
  Users,
  Compass,
  Tv,
  Sparkles,
  FileText,
  HelpCircle,
  Award,
  Zap,
  Flame,
  ArrowRight,
  Globe,
  Check
} from 'lucide-react';

interface NavbarProps {
  onNavigate?: (sectionId: string) => void;
  activeSection?: string;
  initialTicker?: NewsTicker | null;
}

interface DropdownItem {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  href: string;
  isApply?: boolean;
}

import { TRANSLATIONS, LanguageCode } from '@/lib/translations';

const getDropdownData = (lang: LanguageCode): Record<string, DropdownItem[]> => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.EN;
  return {
    esports: [
      {
        title: t.nav.esportsDropdown.rlcsTitle,
        subtitle: t.nav.esportsDropdown.rlcsSubtitle,
        icon: <Trophy size={18} color="#FF701E" />,
        href: '/#esports'
      },
      {
        title: t.nav.esportsDropdown.academyTitle,
        subtitle: t.nav.esportsDropdown.academySubtitle,
        icon: <Zap size={18} color="#FFFFFF" />,
        href: '/#esports'
      },
      {
        title: t.nav.esportsDropdown.creatorsTitle,
        subtitle: t.nav.esportsDropdown.creatorsSubtitle,
        icon: <Tv size={18} color="#FF701E" />,
        href: '/creators'
      },
      {
        title: t.nav.esportsDropdown.joinTitle,
        subtitle: t.nav.esportsDropdown.joinSubtitle,
        icon: <Flame size={18} color="#FF5900" />,
        href: '/apply',
        isApply: true
      }
    ],
    creators: [
      {
        title: t.nav.creatorsDropdown.allTitle,
        subtitle: t.nav.creatorsDropdown.allSubtitle,
        icon: <Tv size={18} color="#FF701E" />,
        href: '/creators'
      },
      {
        title: t.nav.creatorsDropdown.youtubeTitle,
        subtitle: t.nav.creatorsDropdown.youtubeSubtitle,
        icon: <Flame size={18} color="#FFFFFF" />,
        href: 'https://www.youtube.com/@Fazix-eSports'
      },
      {
        title: t.nav.creatorsDropdown.tiktokTitle || 'Fazix TikTok',
        subtitle: t.nav.creatorsDropdown.tiktokSubtitle || 'Short clips, highlights & mechanical plays',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFFFFF">
            <path d="M12.525.02c1.31 0 2.6.45 3.63 1.25.1.08.19.16.28.25.99.99 1.57 2.33 1.61 3.73v.15a6.57 6.57 0 0 0 3.96 1.41v3.42a9.98 9.98 0 0 1-3.95-.91v7.62c0 4.45-3.62 8.06-8.07 8.06-4.45 0-8.06-3.61-8.06-8.06 0-4.45 3.61-8.07 8.06-8.07.45 0 .9.04 1.34.12v3.6a4.57 4.57 0 0 0-1.34-.2 4.55 4.55 0 1 0 4.55 4.55V.02h3.29z" />
          </svg>
        ),
        href: 'https://www.tiktok.com/@fazix_esports'
      },
      {
        title: t.nav.creatorsDropdown.applyTitle,
        subtitle: t.nav.creatorsDropdown.applySubtitle,
        icon: <Sparkles size={18} color="#FF701E" />,
        href: '/apply',
        isApply: true
      }
    ],
    partners: [
      {
        title: 'Beyond Modes',
        subtitle: t.nav.partnersDropdown.beyondSubtitle,
        icon: (
          <img
            src="/images/partners/beyond_modes.png"
            alt="Beyond Modes"
            style={{ width: '28px', height: '20px', objectFit: 'contain' }}
          />
        ),
        href: 'https://discord.gg/7J9AaYSa4J'
      },
      {
        title: 'ROC E-Sports',
        subtitle: t.nav.partnersDropdown.rocSubtitle,
        icon: (
          <img
            src="/images/partners/roc_esports_transparent.png"
            alt="ROC E-Sports"
            style={{ width: '22px', height: '22px', objectFit: 'contain' }}
          />
        ),
        href: 'https://discord.gg/ThnwcpuSuJ'
      },
      {
        title: t.nav.partnersDropdown.partnerWithTitle,
        subtitle: t.nav.partnersDropdown.partnerWithSubtitle,
        icon: <ArrowRight size={18} color="#FF701E" />,
        href: '/contact'
      }
    ],
    community: [
      {
        title: t.nav.communityDropdown.discordTitle,
        subtitle: t.nav.communityDropdown.discordSubtitle,
        icon: <Users size={18} color="#FF701E" />,
        href: 'https://discord.gg/UdnGPHmvcT'
      },
      {
        title: t.nav.communityDropdown.twitchTitle,
        subtitle: t.nav.communityDropdown.twitchSubtitle,
        icon: <Tv size={18} color="#FFFFFF" />,
        href: 'https://www.twitch.tv/fazix_esports'
      },
      {
        title: t.nav.communityDropdown.youtubeTitle,
        subtitle: t.nav.communityDropdown.youtubeSubtitle,
        icon: <Flame size={18} color="#FFFFFF" />,
        href: 'https://www.youtube.com/@Fazix-eSports'
      },
      {
        title: t.nav.communityDropdown.tiktokTitle,
        subtitle: t.nav.communityDropdown.tiktokSubtitle,
        icon: <Zap size={18} color="#FFFFFF" />,
        href: 'https://www.tiktok.com/@fazix_esports'
      }
    ],
    company: [
      {
        title: t.nav.companyDropdown.aboutTitle,
        subtitle: t.nav.companyDropdown.aboutSubtitle,
        icon: <Compass size={18} color="#FFFFFF" />,
        href: '/#about'
      },
      {
        title: t.nav.companyDropdown.careersTitle,
        subtitle: t.nav.companyDropdown.careersSubtitle,
        icon: <FileText size={18} color="#FFFFFF" />,
        href: '/apply'
      },
      {
        title: t.nav.companyDropdown.pressTitle,
        subtitle: t.nav.companyDropdown.pressSubtitle,
        icon: <Award size={18} color="#FFFFFF" />,
        href: '/fazix-press-kit.zip'
      },
      {
        title: t.nav.companyDropdown.contactTitle,
        subtitle: t.nav.companyDropdown.contactSubtitle,
        icon: <HelpCircle size={18} color="#FF701E" />,
        href: '/contact'
      }
    ]
  };
};

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeSection, initialTicker }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>(null);
  const [activeHoverMenu, setActiveHoverMenu] = useState<string | null>(null);
  const { language: selectedLang, setLanguage: setSelectedLang, languages: availableLanguages } = useLanguage();
  const [langDropdownOpen, setLangDropdownOpen] = useState<boolean>(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    if (langDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [langDropdownOpen]);

  // Lock body scroll on mobile when menu drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS.EN;
  const dropdownData = getDropdownData(selectedLang);

  const navItems = [
    { label: t.nav.items.esports, id: 'esports' },
    { label: t.nav.items.creators, id: 'creators' },
    { label: t.nav.items.partners, id: 'partners' },
    { label: t.nav.items.community, id: 'community' },
    { label: t.nav.items.company, id: 'company' },
  ];

  const handleMouseEnter = (id: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setActiveHoverMenu(id);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveHoverMenu(null);
    }, 140);
  };

  const handleLinkClick = (id: string, targetHref?: string) => {
    setActiveHoverMenu(null);
    setMobileOpen(false);

    if (targetHref) {
      if (targetHref.endsWith('.zip')) {
        const link = document.createElement('a');
        link.href = targetHref;
        link.download = 'fazix-press-kit.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }
      if (targetHref.startsWith('http')) {
        window.open(targetHref, '_blank', 'noopener,noreferrer');
        return;
      }
      if (targetHref.startsWith('/contact')) {
        window.location.href = '/contact';
        return;
      }
      if (targetHref.startsWith('/apply')) {
        window.location.href = '/apply';
        return;
      }
      if (targetHref.startsWith('/creators')) {
        window.location.href = '/creators';
        return;
      }
      if (targetHref.startsWith('/#')) {
        const targetId = targetHref.replace('/#', '');
        if (onNavigate) {
          onNavigate(targetId);
        } else {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.location.href = targetHref;
          }
        }
        return;
      }
    }

    if (id === 'creators') {
      window.location.href = '/creators';
      return;
    }

    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = `/#${id}`;
      }
    }
  };

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 100, width: '100%' }}>
      <TopNewsBanner
        initialTicker={initialTicker}
        onSelectArticleId={(articleId) => {
          if (onNavigate) {
            onNavigate('news');
          }
          window.dispatchEvent(
            new CustomEvent('open-fazix-article', { detail: { articleId } })
          );
        }}
      />
      <header
        style={{
          position: 'relative',
          backgroundColor: '#000000',
          borderBottom: 'none',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          fontFamily: 'var(--font-helvetica)'
        }}
        aria-label="Main Navigation"
      >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          width: '100%'
        }}
      >
        {/* Left Group: Logo + Left-Anchored Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* Logo - Wolf Mascot Logo */}
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none',
              cursor: 'pointer',
              flexShrink: 0
            }}
            aria-label="FAZIX Home"
          >
            <img
              src="/images/logo.png"
              alt="FAZIX Logo"
              style={{
                width: '40px',
                height: '40px',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </Link>

          {/* Nav Links Anchored to the Left */}
          <nav aria-label="Desktop menu" className="nav-desktop-links" style={{ display: 'none' }}>
            <ul style={{ display: 'flex', alignItems: 'center', gap: '8px', listStyle: 'none', margin: 0, padding: 0 }}>
              {navItems.map((item) => {
                const isHovered = activeHoverMenu === item.id;
                const isActive = activeSection === item.id;

                return (
                  <li
                    key={item.id}
                    style={{ position: 'relative' }}
                    onMouseEnter={() => handleMouseEnter(item.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      onClick={() => handleLinkClick(item.id)}
                      style={{
                        background: isHovered ? '#26292F' : 'transparent',
                        border: 'none',
                        color: isHovered || isActive ? '#FFFFFF' : '#C5C5CD',
                        fontFamily: 'var(--font-helvetica)',
                        fontSize: '0.92rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        position: 'relative',
                        transition: 'background 0.15s ease, color 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {item.label}

                      {/* Small Downward Arrow Pip when tab is active/hovered (as in Fnatic screenshot) */}
                      {isHovered && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '-7px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 0,
                            height: 0,
                            borderLeft: '6px solid transparent',
                            borderRight: '6px solid transparent',
                            borderBottom: '7px solid #25282F',
                            zIndex: 160
                          }}
                        />
                      )}
                    </button>

                    {/* Mega Dropdown Panel on Hover (Matching Fnatic Screenshot) */}
                    {isHovered && dropdownData[item.id] && (
                      <div
                        onMouseEnter={() => handleMouseEnter(item.id)}
                        onMouseLeave={handleMouseLeave}
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 6px)',
                          left: item.id === 'company' || item.id === 'community' ? 'auto' : 0,
                          right: item.id === 'company' || item.id === 'community' ? 0 : 'auto',
                          backgroundColor: '#25282F',
                          border: '1px solid #363B44',
                          borderRadius: '12px',
                          padding: '24px 26px',
                          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.75)',
                          minWidth: '560px',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gap: '16px 24px',
                          zIndex: 150,
                          animation: 'fadeInMenu 0.15s ease-out'
                        }}
                      >
                        {dropdownData[item.id].map((drop) => (
                          <a
                            key={drop.title}
                            href={drop.href}
                            target={drop.href.startsWith('http') ? '_blank' : undefined}
                            rel={drop.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            onClick={(e) => {
                              if (!drop.href.startsWith('http')) {
                                e.preventDefault();
                                handleLinkClick(item.id, drop.href);
                              }
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '14px',
                              padding: '10px 12px',
                              borderRadius: '8px',
                              textDecoration: 'none',
                              backgroundColor: drop.isApply ? 'rgba(255, 89, 0, 0.08)' : 'transparent',
                              border: drop.isApply ? '1px solid rgba(255, 89, 0, 0.3)' : '1px solid transparent',
                              transition: 'background 0.14s ease, border-color 0.14s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = drop.isApply ? 'rgba(255, 89, 0, 0.16)' : '#2D323A';
                              if (!drop.isApply) e.currentTarget.style.borderColor = '#3D434E';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = drop.isApply ? 'rgba(255, 89, 0, 0.08)' : 'transparent';
                              if (!drop.isApply) e.currentTarget.style.borderColor = 'transparent';
                            }}
                          >
                            {/* Icon Box */}
                            <div
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                backgroundColor: '#181A1F',
                                border: '1px solid #313640',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}
                            >
                              {drop.icon}
                            </div>

                            {/* Title & Subtitle */}
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span
                                style={{
                                  fontSize: '0.92rem',
                                  fontWeight: 700,
                                  color: drop.isApply ? '#FF701E' : '#FFFFFF',
                                  lineHeight: 1.2
                                }}
                              >
                                {drop.title}
                              </span>
                              <span
                                style={{
                                  fontSize: '0.78rem',
                                  color: '#969AA5',
                                  lineHeight: 1.3,
                                  marginTop: '3px'
                                }}
                              >
                                {drop.subtitle}
                              </span>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Right Side: Language Selector, Apply CTA Button & Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Language Selector (Left of Apply) */}
          <div ref={langDropdownRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              aria-label="Select Language"
              aria-expanded={langDropdownOpen}
              className="nav-lang-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: langDropdownOpen ? '#26292F' : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid',
                borderColor: langDropdownOpen ? '#FF701E' : 'rgba(255, 255, 255, 0.14)',
                color: '#FFFFFF',
                fontFamily: 'var(--font-helvetica)',
                fontSize: '0.86rem',
                fontWeight: 600,
                borderRadius: '6px',
                padding: '8px 11px',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease, border-color 0.15s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                if (!langDropdownOpen) {
                  e.currentTarget.style.backgroundColor = '#26292F';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.28)';
                }
              }}
              onMouseLeave={(e) => {
                if (!langDropdownOpen) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)';
                }
              }}
            >
              <Globe size={15} style={{ color: langDropdownOpen ? '#FF701E' : '#C5C5CD' }} />
              <span>{selectedLang}</span>
              <ChevronDown
                size={13}
                style={{
                  color: '#8E8E98',
                  transform: langDropdownOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>

            {/* Language Dropdown Menu */}
            {langDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  backgroundColor: '#1E2026',
                  border: '1px solid #313640',
                  borderRadius: '8px',
                  padding: '6px',
                  boxShadow: '0 16px 36px rgba(0, 0, 0, 0.75)',
                  minWidth: '150px',
                  zIndex: 200,
                  animation: 'fadeInMenu 0.15s ease-out',
                }}
              >
                {availableLanguages.map((lang) => {
                  const isSelected = selectedLang === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setSelectedLang(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '5px',
                        border: 'none',
                        background: isSelected ? 'rgba(255, 112, 30, 0.15)' : 'transparent',
                        color: isSelected ? '#FFFFFF' : '#C5C5CD',
                        fontFamily: 'var(--font-helvetica)',
                        fontSize: '0.85rem',
                        fontWeight: isSelected ? 600 : 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.15s ease, color 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = '#282C35';
                          e.currentTarget.style.color = '#FFFFFF';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#C5C5CD';
                        }
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1rem', lineHeight: 1 }}>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </span>
                      {isSelected && <Check size={14} color="#FF701E" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Portal / Dashboard CTA */}
          <Link
            href="/login"
            style={{
              color: '#C5C5CD',
              fontFamily: 'var(--font-helvetica)',
              fontSize: '0.86rem',
              fontWeight: 600,
              textDecoration: 'none',
              borderRadius: '6px',
              padding: '8px 12px',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#C5C5CD';
            }}
          >
            Portal
          </Link>

          {/* Apply Button CTA */}
          <Link
            href="/apply"
            className="nav-header-apply"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#000000',
              fontFamily: 'var(--font-helvetica)',
              fontWeight: 700,
              textDecoration: 'none',
              borderRadius: '6px',
              letterSpacing: '-0.01em',
              transition: 'background-color 0.15s ease, transform 0.1s ease',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E5E5E7')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
          >
            {t.nav.applyBtn}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            className="mobile-nav-toggle"
            style={{
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              minWidth: '44px',
              minHeight: '44px',
              padding: '8px',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
            }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            top: 'calc(70px + var(--top-banner-height, 0px))',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(9, 9, 12, 0.98)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            padding: '16px 18px 40px 18px',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 99,
            overflowY: 'auto',
          }}
        >
          {/* Nav Items Accordion */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexGrow: 1 }}>
            {navItems.map((item) => {
              const isExpanded = expandedMobileSection === item.id;
              const hasSubmenu = dropdownData[item.id] && dropdownData[item.id].length > 0;

              return (
                <div
                  key={item.id}
                  style={{
                    borderBottom: '1px solid #1C1C24',
                    paddingBottom: isExpanded ? '10px' : '0',
                  }}
                >
                  <div
                    onClick={() => {
                      if (hasSubmenu) {
                        setExpandedMobileSection(isExpanded ? null : item.id);
                      } else {
                        handleLinkClick(item.id);
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 6px',
                      color: '#FFFFFF',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      userSelect: 'none',
                    }}
                  >
                    <span>{item.label}</span>
                    {hasSubmenu ? (
                      <ChevronDown
                        size={18}
                        style={{
                          color: '#8E8E98',
                          transform: isExpanded ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.2s ease',
                        }}
                      />
                    ) : (
                      <ArrowRight size={16} color="#8E8E98" />
                    )}
                  </div>

                  {/* Submenu Accordion Panel */}
                  {isExpanded && hasSubmenu && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        padding: '8px 10px 12px 10px',
                        backgroundColor: '#14141A',
                        borderRadius: '8px',
                        marginTop: '4px',
                      }}
                    >
                      {dropdownData[item.id].map((sub) => (
                        <div
                          key={sub.title}
                          onClick={() => handleLinkClick(item.id, sub.href)}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            padding: '10px 8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                          }}
                        >
                          <div style={{ marginTop: '2px', flexShrink: 0 }}>{sub.icon}</div>
                          <div style={{ flexGrow: 1 }}>
                            <div style={{ color: '#FFFFFF', fontSize: '0.92rem', fontWeight: 600 }}>
                              {sub.title}
                            </div>
                            <div style={{ color: '#888892', fontSize: '0.78rem', marginTop: '2px', lineHeight: 1.3 }}>
                              {sub.subtitle}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Drawer Language Selector */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 6px',
              marginTop: '16px',
              borderTop: '1px solid #1C1C24',
            }}
          >
            <span
              style={{
                fontSize: '0.88rem',
                color: '#969AA5',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 600,
              }}
            >
              <Globe size={16} /> {t.nav.languageLabel}
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {availableLanguages.map((lang) => {
                const isSelected = selectedLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setSelectedLang(lang.code)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '5px',
                      border: isSelected ? '1px solid #FF701E' : '1px solid #282834',
                      backgroundColor: isSelected ? 'rgba(255, 112, 30, 0.15)' : '#16181F',
                      color: isSelected ? '#FFFFFF' : '#969AA5',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {lang.flag} {lang.code}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px', paddingTop: '16px', borderTop: '1px solid #202028' }}>
            <Link
              href="/apply"
              onClick={() => setMobileOpen(false)}
              className="btn btn-white"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '0.96rem',
                fontWeight: 700,
                textAlign: 'center',
                borderRadius: '6px',
                textDecoration: 'none',
              }}
            >
              {t.nav.applyBtn}
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '0.92rem',
                fontWeight: 700,
                textAlign: 'center',
                borderRadius: '6px',
                textDecoration: 'none',
                backgroundColor: '#FFFFFF',
                color: '#000000',
                border: 'none',
              }}
            >
              Player & Staff Portal
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="btn btn-outline"
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '0.92rem',
                fontWeight: 600,
                textAlign: 'center',
                borderRadius: '6px',
                textDecoration: 'none',
                backgroundColor: '#15151C',
                border: '1px solid #282834',
              }}
            >
              {t.nav.companyDropdown.contactTitle}
            </Link>
          </div>

          {/* Social Icons inside Mobile Drawer */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '22px', marginTop: '18px', paddingTop: '12px' }}>
            <a
              href="https://discord.gg/UdnGPHmvcT"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#A0A0A8', padding: '8px', minWidth: '40px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Discord"
            >
              <Users size={20} />
            </a>
            <a
              href="https://www.twitch.tv/fazix_esports"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#A0A0A8', padding: '8px', minWidth: '40px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Twitch"
            >
              <Tv size={20} />
            </a>
            <a
              href="https://www.youtube.com/@Fazix-eSports"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#A0A0A8', padding: '8px', minWidth: '40px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="YouTube"
            >
              <Flame size={20} />
            </a>
            <a
              href="https://www.tiktok.com/@fazix_esports"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#A0A0A8', padding: '8px', minWidth: '40px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="TikTok"
            >
              <Zap size={20} />
            </a>
          </div>
        </div>
      )}

      {/* Responsive Breakpoints & Dropdown Animation */}
      <style>{`
        .nav-header-apply {
          padding: 9px 20px;
          font-size: 0.9rem;
        }
        .nav-lang-btn {
          padding: 8px 11px;
          font-size: 0.86rem;
        }
        @media (max-width: 480px) {
          .nav-header-apply {
            padding: 7px 13px !important;
            font-size: 0.82rem !important;
          }
          .nav-lang-btn {
            padding: 7px 9px !important;
            font-size: 0.8rem !important;
          }
        }
        @keyframes fadeInMenu {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (min-width: 960px) {
          .nav-desktop-links {
            display: block !important;
          }
        }
        @media (max-width: 959px) {
          .mobile-nav-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  </div>
  );
};
