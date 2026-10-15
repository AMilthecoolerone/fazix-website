'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import type { NewsTicker } from '@/lib/newsStore';
import { useLanguage } from '@/context/LanguageContext';
import { TRANSLATIONS } from '@/lib/translations';
import { ChevronLeft, ChevronRight, ChevronDown, X, ArrowUpRight, Star, User, Shield, Newspaper } from 'lucide-react';

export interface HomeClientProps {
  initialArticles?: Article[];
  initialTicker?: NewsTicker | null;
}

interface Article {
  id: string;
  title: string;
  date: string;
  readTime: string;
  image: string;
  summary: string;
  content: string[];
  badge?: string;
  author?: string;
}

const ARTICLES_DATA: Article[] = [];

const PARTNERS = [
  { name: 'Beyond Modes', logo: '/images/partners/beyond_modes.png', href: 'https://discord.gg/7J9AaYSa4J' },
  { name: 'ROC E-Sports', logo: '/images/partners/roc_esports_transparent.png', href: 'https://discord.gg/ThnwcpuSuJ' },
];

// Single group: repeated 10 times (20 items = ~5200px wide) to guarantee seamless infinite loop
const PARTNERS_GROUP = Array.from({ length: 10 }, () => PARTNERS).flat();

interface RosterTier {
  id: 'academy' | 'main' | 'community';
  title: string;
  iconType: 'star' | 'user' | 'shield';
  image: string;
  description: string;
}

export interface TeamItem {
  id: string;
  name: string;
  tier: 'main' | 'academy' | 'community';
  image: string;
  accentColor: string;
  glowColor: string;
}

export const TEAMS_DATA: TeamItem[] = [
  {
    id: 'team-pro-main',
    name: 'Fazix eSports Main',
    tier: 'main',
    image: '/images/teams/fazix_main.jpg',
    accentColor: '#00E5FF',
    glowColor: 'rgba(0, 229, 255, 0.4)'
  },
  {
    id: 'team-pro-semi',
    name: 'Fazix eSports Semi',
    tier: 'main',
    image: '/images/teams/fazix_semi.jpg',
    accentColor: '#B800FF',
    glowColor: 'rgba(184, 0, 255, 0.4)'
  },
  {
    id: 'team-academy',
    name: 'Fazix eSports Academy',
    tier: 'academy',
    image: '/images/teams/fazix_academy.jpg',
    accentColor: '#FF4D00',
    glowColor: 'rgba(255, 77, 0, 0.4)'
  },
  {
    id: 'team-community-vyro',
    name: 'Fazix Vyro eSports',
    tier: 'community',
    image: '/images/teams/fazix_vyro.jpg',
    accentColor: '#00E640',
    glowColor: 'rgba(0, 230, 64, 0.4)'
  },
  {
    id: 'team-community-orbit',
    name: 'Fazix Orbit eSports',
    tier: 'community',
    image: '/images/teams/fazix_orbit.png',
    accentColor: '#0077FF',
    glowColor: 'rgba(0, 119, 255, 0.4)'
  },
  {
    id: 'team-community-skyfall',
    name: 'Fazix Skyfall eSports',
    tier: 'community',
    image: '/images/teams/fazix_skyfall.jpg',
    accentColor: '#00D4FF',
    glowColor: 'rgba(0, 212, 255, 0.45)'
  },
  {
    id: 'team-community-velour',
    name: 'Fazix Velour eSports',
    tier: 'community',
    image: '/images/teams/fazix_velour.jpg',
    accentColor: '#FF1E38',
    glowColor: 'rgba(255, 30, 56, 0.45)'
  },
  {
    id: 'team-community-ogs',
    name: 'Fazix OGs eSports',
    tier: 'community',
    image: '/images/teams/fazix_ogs.jpg',
    accentColor: '#FFD700',
    glowColor: 'rgba(255, 215, 0, 0.45)'
  }
];

export function HomeClient({ initialArticles, initialTicker }: HomeClientProps) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language] || TRANSLATIONS.EN;
  const aboutText = t.about;

  const rosterTiers: RosterTier[] = [
    {
      id: 'academy',
      title: 'ACADEMY',
      iconType: 'star',
      image: '/images/teams/fazix_academy.jpg',
      description: t.roster.tierAcademyDesc
    },
    {
      id: 'main',
      title: 'PRO',
      iconType: 'user',
      image: '/images/teams/fazix_main.jpg',
      description: t.roster.tierMainDesc
    },
    {
      id: 'community',
      title: 'COMMUNITY',
      iconType: 'shield',
      image: '/images/teams/fazix_vyro.jpg',
      description: t.roster.tierCommunityDesc
    }
  ];

  const [selectedTier, setSelectedTier] = useState<'all' | 'main' | 'academy' | 'community'>('all');
  const [showRosterDetails, setShowRosterDetails] = useState(false);
  const [articles, setArticles] = useState<Article[]>(
    initialArticles && initialArticles.length > 0 ? initialArticles : []
  );
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const newsSliderRef = useRef<HTMLDivElement>(null);
  const newsSectionRef = useRef<HTMLElement>(null);
  const aboutSectionRef = useRef<HTMLElement>(null);
  const newsAnimFrameRef = useRef<number | null>(null);
  const newsTargetScrollRef = useRef<number | null>(null);
  const tickerContainerRef = useRef<HTMLDivElement>(null);
  const [headerOpacity, setHeaderOpacity] = useState(0.15);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [aboutHeaderOpacity, setAboutHeaderOpacity] = useState(0.15);
  const [aboutScrollProgress, setAboutScrollProgress] = useState(0);
  const [tickerProgress, setTickerProgress] = useState(0);
  const [showHeroScroll, setShowHeroScroll] = useState(true);

  const scrollNews = (direction: 'left' | 'right') => {
    const container = newsSliderRef.current;
    if (!container) return;

    // Calculate exact stride dynamically from rendered card boundaries (card width + responsive gap)
    const cards = Array.from(container.children) as HTMLElement[];
    let stride = 460;
    if (cards.length >= 2) {
      const firstRect = cards[0].getBoundingClientRect();
      const secondRect = cards[1].getBoundingClientRect();
      const diff = Math.round(secondRect.left - firstRect.left);
      if (diff > 50) stride = diff;
    } else if (cards.length === 1) {
      stride = Math.round(cards[0].offsetWidth + 24);
    }

    const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
    if (maxScroll <= 0) return;

    // Use queued target if user clicks multiple times in rapid succession, or current scroll position
    const currentBase = newsTargetScrollRef.current !== null ? newsTargetScrollRef.current : container.scrollLeft;
    const currentIndex = Math.round(currentBase / stride);
    const targetIndex = direction === 'left' ? Math.max(0, currentIndex - 1) : Math.min(cards.length - 1, currentIndex + 1);

    let targetScroll = targetIndex * stride;
    if (targetScroll > maxScroll) targetScroll = maxScroll;
    if (targetScroll < 0) targetScroll = 0;

    // Skip if already resting at bounds
    if (targetScroll === container.scrollLeft && newsTargetScrollRef.current === null) return;

    newsTargetScrollRef.current = targetScroll;

    // Cancel active animation frame
    if (newsAnimFrameRef.current !== null) {
      cancelAnimationFrame(newsAnimFrameRef.current);
    }

    const startScroll = container.scrollLeft;
    const distance = targetScroll - startScroll;
    const duration = 520; // 520ms silky smooth glide
    const startTime = performance.now();

    // Cubic-out easing: responsive start, gentle fluid deceleration into destination
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    // Temporarily disable CSS snap during RAF animation so browser snap engine doesn't stutter or fight
    container.style.scrollSnapType = 'none';

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(progress);

      container.scrollLeft = startScroll + distance * eased;

      if (progress < 1) {
        newsAnimFrameRef.current = requestAnimationFrame(step);
      } else {
        container.scrollLeft = targetScroll;
        container.style.scrollSnapType = 'x mandatory';
        newsAnimFrameRef.current = null;
        newsTargetScrollRef.current = null;
      }
    };

    newsAnimFrameRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const container = newsSliderRef.current;
    if (!container) return;

    const stopGlide = () => {
      if (newsAnimFrameRef.current !== null) {
        cancelAnimationFrame(newsAnimFrameRef.current);
        newsAnimFrameRef.current = null;
        newsTargetScrollRef.current = null;
        container.style.scrollSnapType = 'x mandatory';
      }
    };

    container.addEventListener('touchstart', stopGlide, { passive: true });
    container.addEventListener('wheel', stopGlide, { passive: true });

    return () => {
      container.removeEventListener('touchstart', stopGlide);
      container.removeEventListener('wheel', stopGlide);
      if (newsAnimFrameRef.current !== null) {
        cancelAnimationFrame(newsAnimFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const scrollY = window.scrollY || document.documentElement.scrollTop;

      // Hide hero scroll down indicator once user starts scrolling
      setShowHeroScroll(scrollY < 30);

      // 1. News section scroll animation: glides smoothly and locks into place (stops) once in view
      if (newsSectionRef.current) {
        const rect = newsSectionRef.current.getBoundingClientRect();
        // Starts gliding as the section approaches viewport and completely stops once settled in view (25% from top)
        const start = windowHeight * 1.15;
        const end = windowHeight * 0.25;
        const rawProgress = (start - rect.top) / (start - end);
        const progress = Math.min(1, Math.max(0, rawProgress));

        // Smooth cubic easing curve
        const eased = progress * progress * (3 - 2 * progress);
        setScrollProgress(eased);
        setHeaderOpacity(0.15 + eased * 0.85);
      }

      // 2. Esports Ticker scroll animation (Identical slow runway & cubic easing as Latest News)
      if (tickerContainerRef.current) {
        const rect = tickerContainerRef.current.getBoundingClientRect();
        const start = windowHeight * 1.30;
        const end = -windowHeight * 0.45;
        const rawProgress = (start - rect.top) / (start - end);
        const progress = Math.min(1, Math.max(0, rawProgress));

        // Smooth cubic easing curve identical to Latest News
        const eased = progress * progress * (3 - 2 * progress);
        setTickerProgress(eased);
      }

      // 3. About Us section scroll animation: identical smooth glide and lock-in easing curve as Latest News
      if (aboutSectionRef.current) {
        const rect = aboutSectionRef.current.getBoundingClientRect();
        const start = windowHeight * 1.15;
        const end = windowHeight * 0.25;
        const rawProgress = (start - rect.top) / (start - end);
        const progress = Math.min(1, Math.max(0, rawProgress));

        // Smooth cubic easing curve identical to Latest News
        const eased = progress * progress * (3 - 2 * progress);
        setAboutScrollProgress(eased);
        setAboutHeaderOpacity(0.15 + eased * 0.85);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Auto-scroll news slider to beginning if new article is published
  const prevFirstArticleIdRef = useRef<string | null>(articles[0]?.id || null);
  useEffect(() => {
    const currentFirstId = articles[0]?.id || null;
    if (prevFirstArticleIdRef.current && currentFirstId && prevFirstArticleIdRef.current !== currentFirstId) {
      if (newsSliderRef.current) {
        newsSliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }
    prevFirstArticleIdRef.current = currentFirstId;
  }, [articles]);

  // Fetch dynamic news from API (populated by Discord bot) & listen for ticker clicks
  useEffect(() => {
    let isMounted = true;
    const fetchLatestNews = async () => {
      try {
        const res = await fetch(`/api/news?_t=${Date.now()}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        });
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.articles) && data.articles.length > 0) {
          setArticles(data.articles);
        }
      } catch {
        // Retain fallback articles
      }
    };

    fetchLatestNews();

    // Auto-poll every 3.5 seconds so articles published from Discord appear immediately
    const pollInterval = setInterval(fetchLatestNews, 3500);

    // Refresh immediately on window focus or visibility change
    const handleFocus = () => fetchLatestNews();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchLatestNews();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    // Listen for custom event from TopNewsBanner when an article announcement is clicked
    const handleOpenArticle = (e: Event) => {
      const customEvent = e as CustomEvent<{ articleId: string }>;
      const targetId = customEvent.detail?.articleId;
      if (!targetId) return;

      const newsSec = document.getElementById('news');
      if (newsSec) {
        newsSec.scrollIntoView({ behavior: 'smooth' });
      }

      setArticles((currentArticles) => {
        const targetArticle = currentArticles.find((a) => a.id === targetId);
        if (targetArticle) {
          setActiveArticle(targetArticle);
        } else {
          // If not in state yet, fetch immediately and open
          fetch(`/api/news?_t=${Date.now()}`, { cache: 'no-store' })
            .then((r) => r.json())
            .then((d) => {
              if (d.success && Array.isArray(d.articles)) {
                setArticles(d.articles);
                const found = d.articles.find((a: Article) => a.id === targetId);
                if (found) setActiveArticle(found);
              }
            })
            .catch(() => { });
        }
        return currentArticles;
      });
    };

    window.addEventListener('open-fazix-article', handleOpenArticle);
    return () => {
      isMounted = false;
      clearInterval(pollInterval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('open-fazix-article', handleOpenArticle);
    };
  }, []);

  const handleNavigate = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#FFFFFF', fontFamily: 'var(--font-helvetica)' }}>
      {/* Left-Anchored Navbar with Wolf Logo, Hover Mega-Menus, and Apply CTA */}
      <Navbar onNavigate={handleNavigate} initialTicker={initialTicker} />

      <main>
        {/* Hero Section: 100% Viewport Height Coverage with Team Vitality / RLCS Championship Arena Background */}
        <section
          id="hero"
          aria-label="Hero Spotlight"
          className="hero-section"
        >
          {/* Background Image Layer: RLCS Arena with Stadium Screen, Lasers, Crowd */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              overflow: 'hidden',
              pointerEvents: 'none'
            }}
          >
            <img
              src="/images/rlcs_lan_stage.jpg"
              alt="Rocket League Champions Field Arena Stage"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 42%',
                transform: 'scale(1.02)'
              }}
            />
            {/* Top-to-Bottom Gradient: Ensures navbar integration and 100% black transition into the rosters section */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.45) 40%, rgba(0, 0, 0, 0.85) 85%, #000000 100%)'
              }}
            />
            {/* Left Vignette: Protects hero typography readability on all screen widths */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.7) 48%, rgba(0, 0, 0, 0.25) 100%)'
              }}
            />
            {/* Subtle radial warmth */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at 80% 30%, rgba(255, 89, 0, 0.08) 0%, transparent 60%)'
              }}
            />
          </div>

          <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '30px', paddingBottom: '60px', width: '100%' }}>
            <div style={{ maxWidth: '820px' }}>
              <h1
                style={{
                  fontFamily: 'var(--font-helvetica)',
                  fontSize: 'clamp(2.3rem, 7.5vw, 5.2rem)',
                  fontWeight: 700,
                  lineHeight: 1.02,
                  letterSpacing: '-0.035em',
                  color: '#FFFFFF',
                  marginBottom: '18px',
                  textShadow: '0 4px 24px rgba(0, 0, 0, 0.8)'
                }}
              >
                {t.hero.title}
              </h1>

              <p
                style={{
                  fontSize: 'clamp(1rem, 3.2vw, 1.2rem)',
                  color: '#D0D0D8',
                  lineHeight: 1.6,
                  marginBottom: '32px',
                  maxWidth: '640px',
                  textShadow: '0 2px 12px rgba(0, 0, 0, 0.9)'
                }}
              >
                {t.hero.subtitle}
              </p>

              {/* Responsive CTAs: stacks cleanly on mobile */}
              <div className="hero-buttons-group">
                <Link
                  href="/apply"
                  className="btn btn-white"
                  style={{
                    padding: '16px 36px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderRadius: '6px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(255, 255, 255, 0.15)'
                  }}
                >
                  {t.hero.applyBtn}
                </Link>
                <a
                  href="https://discord.gg/UdnGPHmvcT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{
                    padding: '16px 32px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderRadius: '6px',
                    textDecoration: 'none',
                    backgroundColor: 'rgba(10, 10, 14, 0.65)',
                    backdropFilter: 'blur(10px)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>{t.hero.discordBtn}</span>
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* Viewport Scroll Indicator: Smoothly fades out when user scrolls past hero */}
          <div
            onClick={() => handleNavigate('partners')}
            style={{
              position: 'absolute',
              bottom: '28px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              color: '#8E8E98',
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'opacity 0.25s ease, color 0.2s ease',
              opacity: showHeroScroll ? 1 : 0,
              pointerEvents: showHeroScroll ? 'auto' : 'none'
            }}
          >
            <span>{t.hero.scroll}</span>
            <ChevronDown size={16} className="hero-scroll-indicator" />
          </div>
        </section>

        {/* Sponsors and Partners Section (Positioned directly above Latest News) */}
        <section
          id="partners"
          aria-label="Sponsors and Partners"
          style={{
            padding: '44px 0 52px 0',
            backgroundColor: 'transparent',
            overflow: 'hidden',
            scrollMarginTop: '80px'
          }}
        >
          {/* Centered Title with Flanking Horizontal Accent Lines matching reference */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(14px, 2.5vw, 24px)',
              marginBottom: '28px',
              padding: '0 16px'
            }}
          >
            <div
              style={{
                height: '1.5px',
                width: 'clamp(36px, 6vw, 75px)',
                backgroundColor: 'rgba(255, 255, 255, 0.45)',
                flexShrink: 0
              }}
            />
            <h2
              style={{
                fontFamily: 'var(--font-helvetica)',
                fontStyle: 'italic',
                fontWeight: 900,
                fontSize: 'clamp(1.15rem, 2.6vw, 1.7rem)',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                margin: 0,
                whiteSpace: 'nowrap',
                textAlign: 'center'
              }}
            >
              {t.partners.title}
            </h2>
            <div
              style={{
                height: '1.5px',
                width: 'clamp(36px, 6vw, 75px)',
                backgroundColor: 'rgba(255, 255, 255, 0.45)',
                flexShrink: 0
              }}
            />
          </div>

          {/* Continuous Infinite Marquee Track Moving Left */}
          <div className="marquee-container" style={{ padding: '6px 0' }}>
            <div className="partners-track">
              {/* Group 1 */}
              <div className="partners-group">
                {PARTNERS_GROUP.map((partner, idx) => (
                  <a
                    key={`p1-${partner.name}-${idx}`}
                    href={partner.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${partner.name} Discord`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px 24px',
                      minWidth: '180px',
                      height: '56px',
                      flexShrink: 0,
                      opacity: 0.8,
                      textDecoration: 'none',
                      cursor: 'pointer',
                      transition: 'opacity 0.2s ease, transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.transform = 'scale(1.04)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.8';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <img
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      style={{
                        maxHeight:
                          partner.name === 'ROC E-Sports'
                            ? '48px'
                            : partner.name === 'Beyond Modes'
                              ? '38px'
                              : '36px',
                        maxWidth: partner.name === 'Beyond Modes' ? '180px' : '160px',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain'
                      }}
                    />
                  </a>
                ))}
              </div>

              {/* Group 2 (identical duplicate so the loop never ends or shows gaps) */}
              <div className="partners-group" aria-hidden="true">
                {PARTNERS_GROUP.map((partner, idx) => (
                  <a
                    key={`p2-${partner.name}-${idx}`}
                    href={partner.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={-1}
                    aria-label={`${partner.name} Discord`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px 24px',
                      minWidth: '180px',
                      height: '56px',
                      flexShrink: 0,
                      opacity: 0.8,
                      textDecoration: 'none',
                      cursor: 'pointer',
                      transition: 'opacity 0.2s ease, transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.transform = 'scale(1.04)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.8';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <img
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      style={{
                        maxHeight:
                          partner.name === 'ROC E-Sports'
                            ? '48px'
                            : partner.name === 'Beyond Modes'
                              ? '38px'
                              : '36px',
                        maxWidth: partner.name === 'Beyond Modes' ? '180px' : '160px',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain'
                      }}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Latest News & Articles Section */}
        <section
          ref={newsSectionRef}
          id="news"
          aria-label="Latest News"
          style={{
            padding: '80px 0',
            backgroundColor: '#000000',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div className="container">
            {/* Scroll-Responsive Display Heading (LATEST & NEWS glide together into a cohesive lockup) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginBottom: '36px',
                userSelect: 'none',
                padding: '6px 0',
                position: 'relative'
              }}
            >
              {/* LATEST: Top line, cushioned left padding so it is never cut off */}
              <div
                style={{
                  fontFamily: 'var(--font-helvetica)',
                  fontStyle: 'italic',
                  fontWeight: 900,
                  fontSize: 'clamp(2.8rem, 8.5vw, 5.8rem)',
                  lineHeight: 0.95,
                  letterSpacing: '-0.035em',
                  textTransform: 'uppercase',
                  color: '#FFFFFF',
                  opacity: headerOpacity,
                  paddingLeft: 'clamp(24px, 4vw, 44px)',
                  transform: `translateX(calc(${(1 - scrollProgress) * -1} * min(45px, 5vw)))`,
                  transition: 'transform 0.85s cubic-bezier(0.15, 0.9, 0.25, 1), opacity 0.75s ease-out',
                  willChange: 'transform, opacity'
                }}
              >
                {t.news.latest}
              </div>

              {/* NEWS: Sits directly below LATEST and glides in from the right to meet it */}
              <div
                style={{
                  fontFamily: 'var(--font-helvetica)',
                  fontStyle: 'italic',
                  fontWeight: 900,
                  fontSize: 'clamp(2.8rem, 8.5vw, 5.8rem)',
                  lineHeight: 0.95,
                  letterSpacing: '-0.035em',
                  textTransform: 'uppercase',
                  color: '#FFFFFF',
                  opacity: headerOpacity,
                  paddingLeft: 'clamp(80px, 14vw, 180px)',
                  transform: `translateX(calc(${1 - scrollProgress} * min(260px, 30vw)))`,
                  transition: 'transform 0.85s cubic-bezier(0.15, 0.9, 0.25, 1), opacity 0.75s ease-out',
                  willChange: 'transform, opacity'
                }}
              >
                {t.news.news}
              </div>
            </div>

            {/* Header controls: Subtitle + Slider Arrows */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '26px',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              <p
                style={{
                  fontSize: '0.88rem',
                  color: '#8A8A96',
                  margin: 0,
                  maxWidth: '560px'
                }}
              >
                {t.news.subtitle}
              </p>

              {/* Slider Navigation Arrows - only rendered when articles exist */}
              {articles.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => scrollNews('left')}
                    aria-label="Previous news"
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: '#111116',
                      border: '1px solid #22222E',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#FF701E';
                      e.currentTarget.style.color = '#FF701E';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#22222E';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollNews('right')}
                    aria-label="Next news"
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: '#111116',
                      border: '1px solid #22222E',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#FF701E';
                      e.currentTarget.style.color = '#FF701E';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#22222E';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* News Content: Empty state if no articles, horizontal slider if articles exist */}
            {articles.length === 0 ? (
              <div
                style={{
                  backgroundColor: '#111116',
                  border: '1px dashed #272733',
                  borderRadius: '12px',
                  padding: 'clamp(44px, 6vw, 68px) clamp(24px, 4vw, 44px)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '16px',
                  maxWidth: '680px',
                  margin: '12px auto 24px auto',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)'
                }}
              >
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 112, 30, 0.1)',
                    border: '1px solid rgba(255, 112, 30, 0.28)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FF701E'
                  }}
                >
                  <Newspaper size={26} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-helvetica)',
                      fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                      fontWeight: 800,
                      fontStyle: 'italic',
                      textTransform: 'uppercase',
                      letterSpacing: '-0.01em',
                      color: '#FFFFFF',
                      margin: 0
                    }}
                  >
                    {t.news.noNewsTitle}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: '#8A8A96',
                      maxWidth: '460px',
                      margin: 0,
                      lineHeight: 1.55
                    }}
                  >
                    {t.news.noNewsDesc}
                  </p>
                </div>
                <a
                  href="https://discord.gg/UdnGPHmvcT"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginTop: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '11px 22px',
                    borderRadius: '6px',
                    backgroundColor: '#181820',
                    border: '1px solid #2B2B38',
                    color: '#FFFFFF',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#FF701E';
                    e.currentTarget.style.color = '#FF701E';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#2B2B38';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                >
                  Join FAZIX Discord for Live Alerts
                  <ArrowUpRight size={15} />
                </a>
              </div>
            ) : (
              <div
                ref={newsSliderRef}
                className="no-scrollbar"
                style={{
                  display: 'flex',
                  gap: 'clamp(20px, 3.5vw, 36px)',
                  overflowX: 'auto',
                  scrollSnapType: 'x mandatory',
                  padding: '12px 4px 24px 4px',
                  WebkitOverflowScrolling: 'touch',
                  scrollBehavior: 'auto'
                }}
              >
              {articles.map((article) => (
                <article
                  key={article.id}
                  onClick={() => setActiveArticle(article)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flex: '0 0 clamp(340px, 56vw, 530px)',
                    scrollSnapAlign: 'start',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Left: Image Box */}
                  <div
                    style={{
                      width: 'clamp(180px, 28vw, 270px)',
                      height: 'clamp(180px, 24vw, 240px)',
                      flexShrink: 0,
                      borderRadius: '6px',
                      overflow: 'hidden',
                      position: 'relative',
                      zIndex: 1,
                      backgroundColor: '#141418',
                      boxShadow: '0 10px 24px rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    <img
                      src={article.image}
                      alt={article.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, transparent 40%, rgba(0, 0, 0, 0.6) 100%)'
                      }}
                    />
                  </div>

                  {/* Right: Overlapping Dark Box (matching Photo 1) */}
                  <div
                    style={{
                      width: 'clamp(200px, 32vw, 300px)',
                      minHeight: 'clamp(170px, 22vw, 220px)',
                      marginLeft: 'clamp(-45px, -5.5vw, -65px)',
                      flexShrink: 0,
                      backgroundColor: '#1E1E22',
                      border: '1px solid #2A2A34',
                      borderRadius: '6px',
                      padding: 'clamp(16px, 2.2vw, 22px)',
                      position: 'relative',
                      zIndex: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      boxShadow: '0 14px 36px rgba(0, 0, 0, 0.75)',
                      transition: 'border-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#FF701E';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#2A2A34';
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.7rem',
                        color: '#FF701E',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        marginBottom: '6px'
                      }}
                    >
                      {article.date} · {article.readTime}
                    </div>

                    <h3
                      style={{
                        fontFamily: 'var(--font-helvetica)',
                        fontStyle: 'italic',
                        fontWeight: 800,
                        fontSize: 'clamp(0.98rem, 1.6vw, 1.25rem)',
                        lineHeight: 1.2,
                        textTransform: 'uppercase',
                        letterSpacing: '-0.02em',
                        color: '#FFFFFF',
                        marginBottom: '8px'
                      }}
                    >
                      {article.title}
                    </h3>

                    <p
                      style={{
                        fontSize: '0.8rem',
                        color: '#B0B0BC',
                        lineHeight: 1.45,
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {article.summary}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
          </div>
        </section>

        {/* Esports Active Rosters Section: Styled matching reference photo */}
        <section
          id="esports"
          aria-label="Active Rosters"
          style={{
            padding: '70px 0 84px 0',
            backgroundColor: '#000000',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* Giant Repeating Ticker Rows (PRO * ACADEMY * COMMUNITY) scroll-driven */}
          <div
            ref={tickerContainerRef}
            style={{ overflow: 'hidden', width: '100%', marginBottom: '44px', userSelect: 'none' }}
          >
            {/* Row 1: Slides Left slowly on scroll down (matching Latest News) */}
            <div
              className="ticker-track-left"
              style={{
                marginBottom: '6px',
                transform: `translateX(calc(-80px - ${tickerProgress} * min(150px, 12vw)))`,
                transition: 'transform 0.85s cubic-bezier(0.15, 0.9, 0.25, 1)',
                willChange: 'transform'
              }}
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={`ticker-1-${i}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'clamp(14px, 2.5vw, 26px)',
                    marginRight: 'clamp(14px, 2.5vw, 26px)',
                    fontFamily: 'var(--font-helvetica)',
                    fontStyle: 'italic',
                    fontWeight: 900,
                    fontSize: 'clamp(2.5rem, 6.2vw, 5rem)',
                    lineHeight: 1.02,
                    letterSpacing: '-0.03em',
                    textTransform: 'uppercase',
                    color: '#FFFFFF'
                  }}
                >
                  <span>PRO</span>
                  <span style={{ opacity: 0.85 }}>*</span>
                  <span>ACADEMY</span>
                  <span style={{ opacity: 0.85 }}>*</span>
                  <span>COMMUNITY</span>
                  <span style={{ opacity: 0.85 }}>*</span>
                </div>
              ))}
            </div>

            {/* Row 2: Slides Right slowly on scroll down (matching Latest News) */}
            <div
              className="ticker-track-right"
              style={{
                transform: `translateX(calc(-360px + ${tickerProgress} * min(150px, 12vw)))`,
                transition: 'transform 0.85s cubic-bezier(0.15, 0.9, 0.25, 1)',
                willChange: 'transform'
              }}
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={`ticker-2-${i}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'clamp(14px, 2.5vw, 26px)',
                    marginRight: 'clamp(14px, 2.5vw, 26px)',
                    fontFamily: 'var(--font-helvetica)',
                    fontStyle: 'italic',
                    fontWeight: 900,
                    fontSize: 'clamp(2.5rem, 6.2vw, 5rem)',
                    lineHeight: 1.02,
                    letterSpacing: '-0.03em',
                    textTransform: 'uppercase',
                    color: '#FFFFFF'
                  }}
                >
                  <span style={{ opacity: 0.85 }}>*</span>
                  <span>ACADEMY</span>
                  <span style={{ opacity: 0.85 }}>*</span>
                  <span>PRO</span>
                  <span style={{ opacity: 0.85 }}>*</span>
                  <span>COMMUNITY</span>
                </div>
              ))}
            </div>
          </div>

          <div className="container">
            {/* 3 Tier Cards: ACADEMY, MAIN (PRO), COMMUNITY (Podium stepped layout with PRO elevated in middle) */}
            <div
              className="rosters-podium-grid"
            >
              {rosterTiers.map((tier) => {
                const isSelected = showRosterDetails && selectedTier === tier.id;
                const isMain = tier.id === 'main';
                return (
                  <div
                    key={tier.id}
                    onClick={() => {
                      setSelectedTier(tier.id);
                      setShowRosterDetails(true);
                    }}
                    className={`roster-tier-card ${isMain ? 'roster-tier-main' : ''}`}
                    style={{
                      backgroundColor: '#1E1E22',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: isSelected ? '1px solid #FF701E' : isMain ? '1px solid #363642' : '1px solid #282830',
                      boxShadow: isSelected
                        ? '0 0 24px rgba(255, 112, 30, 0.35)'
                        : isMain
                          ? '0 16px 36px rgba(0, 0, 0, 0.65)'
                          : '0 8px 24px rgba(0, 0, 0, 0.4)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Top Picture / Team Logo */}
                    <div style={{ height: isMain ? '215px' : '195px', width: '100%', overflow: 'hidden', backgroundColor: '#07070A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                      <img
                        src={tier.image}
                        alt={`${tier.title} team emblem`}
                        style={{
                          maxHeight: '100%',
                          maxWidth: '100%',
                          objectFit: 'contain',
                          filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.85))'
                        }}
                      />
                    </div>

                    {/* Bottom Card Content */}
                    <div style={{ padding: '22px 22px 26px 22px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      {/* Icon */}
                      <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                        {tier.iconType === 'star' && <Star size={16} color="#FFFFFF" strokeWidth={2.4} />}
                        {tier.iconType === 'user' && <User size={16} color="#FFFFFF" strokeWidth={2.4} />}
                        {tier.iconType === 'shield' && <Shield size={16} color="#FFFFFF" strokeWidth={2.4} />}
                      </div>

                      {/* Title */}
                      <h3
                        style={{
                          fontFamily: 'var(--font-helvetica)',
                          fontStyle: 'italic',
                          fontWeight: 900,
                          fontSize: '1.25rem',
                          lineHeight: 1.1,
                          letterSpacing: '-0.02em',
                          textTransform: 'uppercase',
                          color: '#FFFFFF',
                          marginBottom: '10px'
                        }}
                      >
                        {tier.title}
                      </h3>

                      {/* Description */}
                      <p
                        style={{
                          fontSize: '0.84rem',
                          color: '#C4C4CE',
                          lineHeight: 1.55,
                          margin: 0
                        }}
                      >
                        {tier.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Centered Outline Button matching reference photo */}
            <div style={{ marginTop: '38px', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => setShowRosterDetails(!showRosterDetails)}
                style={{
                  backgroundColor: 'transparent',
                  color: '#FFFFFF',
                  border: '1px solid #FFFFFF',
                  borderRadius: '0px',
                  padding: '13px 36px',
                  fontFamily: 'var(--font-helvetica)',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'background-color 0.18s ease, color 0.18s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = '#000000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
              >
                {showRosterDetails ? (language === 'DE' ? 'TEAMS EINKLAPPEN' : 'COLLAPSE TEAMS') : (language === 'DE' ? 'ALLE TEAMS ENTDECKEN' : 'EXPLORE ALL TEAMS')}
              </button>
            </div>

            {/* Expandable Detailed Teams Grid */}
            {showRosterDetails && (
              <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #1C1C24' }}>
                {/* Team Tier Filter Switcher */}
                <div
                  className="no-scrollbar"
                  style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '32px',
                    overflowX: 'auto',
                    paddingBottom: '6px',
                    WebkitOverflowScrolling: 'touch',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                  }}
                >
                  {[
                    { id: 'all' as const, label: language === 'DE' ? 'ALLE TEAMS' : 'ALL TEAMS', count: TEAMS_DATA.length },
                    { id: 'main' as const, label: 'PRO', count: TEAMS_DATA.filter((t) => t.tier === 'main').length },
                    { id: 'academy' as const, label: 'ACADEMY', count: TEAMS_DATA.filter((t) => t.tier === 'academy').length },
                    { id: 'community' as const, label: 'COMMUNITY', count: TEAMS_DATA.filter((t) => t.tier === 'community').length }
                  ].map((tab) => {
                    const isActive = selectedTier === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setSelectedTier(tab.id)}
                        style={{
                          backgroundColor: isActive ? '#FFFFFF' : '#141418',
                          color: isActive ? '#000000' : '#A0A0A8',
                          border: '1px solid',
                          borderColor: isActive ? '#FFFFFF' : '#23232A',
                          padding: '11px 24px',
                          borderRadius: 'var(--radius-md)',
                          fontFamily: 'var(--font-helvetica)',
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          display: 'inline-flex',
                          alignItems: 'center',
                          transition: 'all 0.18s ease'
                        }}
                      >
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Teams Grid: responsive cards */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
                    gap: '24px'
                  }}
                >
                  {(selectedTier === 'all' ? TEAMS_DATA : TEAMS_DATA.filter((t) => t.tier === selectedTier)).map((team) => (
                    <article
                      key={team.id}
                      style={{
                        backgroundColor: '#111116',
                        borderRadius: '10px',
                        border: '1px solid #22222E',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = team.accentColor;
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = `0 14px 34px rgba(0, 0, 0, 0.7), 0 0 24px ${team.glowColor}`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#22222E';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4)';
                      }}
                    >
                      {/* Emblem Picture Container */}
                      <div
                        style={{
                          height: '270px',
                          backgroundColor: '#07070A',
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          padding: '24px'
                        }}
                      >
                        {/* Subtle radial ambient glow behind wolf logo */}
                        <div
                          style={{
                            position: 'absolute',
                            width: '180px',
                            height: '180px',
                            borderRadius: '50%',
                            background: `radial-gradient(circle, ${team.glowColor} 0%, transparent 70%)`,
                            filter: 'blur(32px)',
                            opacity: 0.65,
                            pointerEvents: 'none'
                          }}
                        />

                        <img
                          src={team.image}
                          alt={team.name}
                          style={{
                            maxHeight: '100%',
                            maxWidth: '100%',
                            objectFit: 'contain',
                            position: 'relative',
                            zIndex: 1,
                            filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.85))',
                            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                          }}
                        />
                      </div>

                      {/* Card Body - Clean Centered Team Name */}
                      <div style={{ padding: '22px 24px 26px 24px', textAlign: 'center' }}>
                        <h3
                          style={{
                            fontFamily: 'var(--font-helvetica)',
                            fontStyle: 'italic',
                            fontWeight: 900,
                            fontSize: '1.4rem',
                            lineHeight: 1.15,
                            letterSpacing: '-0.02em',
                            textTransform: 'uppercase',
                            color: '#FFFFFF',
                            margin: 0
                          }}
                        >
                          {team.name}
                        </h3>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* About Us Showcase Section (Origin Story with Authentic Austrian Force / Fazix Heritage) */}
        <section
          ref={aboutSectionRef}
          id="about"
          aria-label="About Us"
          style={{
            padding: '90px 0 110px',
            backgroundColor: '#000000',
            position: 'relative',
            overflow: 'hidden'
          }}
        >

          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            {/* Scroll-Responsive Display Heading (ABOUT & US glide together into a cohesive lockup, identical to Latest News) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginBottom: '36px',
                userSelect: 'none',
                padding: '6px 0',
                position: 'relative'
              }}
            >
              {/* ABOUT: Top line glides in from left */}
              <div
                style={{
                  fontFamily: 'var(--font-helvetica)',
                  fontStyle: 'italic',
                  fontWeight: 900,
                  fontSize: 'clamp(2.8rem, 8.5vw, 5.8rem)',
                  lineHeight: 0.95,
                  letterSpacing: '-0.035em',
                  textTransform: 'uppercase',
                  color: '#FFFFFF',
                  opacity: aboutHeaderOpacity,
                  paddingLeft: 'clamp(24px, 4vw, 44px)',
                  transform: `translateX(calc(${(1 - aboutScrollProgress) * -1} * min(45px, 5vw)))`,
                  transition: 'transform 0.85s cubic-bezier(0.15, 0.9, 0.25, 1), opacity 0.75s ease-out',
                  willChange: 'transform, opacity'
                }}
              >
                {t.about.titlePart1}
              </div>

              {/* US: Sits directly below ABOUT and glides in from right to meet it */}
              <div
                style={{
                  fontFamily: 'var(--font-helvetica)',
                  fontStyle: 'italic',
                  fontWeight: 900,
                  fontSize: 'clamp(2.8rem, 8.5vw, 5.8rem)',
                  lineHeight: 0.95,
                  letterSpacing: '-0.035em',
                  textTransform: 'uppercase',
                  color: '#FFFFFF',
                  opacity: aboutHeaderOpacity,
                  paddingLeft: 'clamp(80px, 14vw, 180px)',
                  transform: `translateX(calc(${1 - aboutScrollProgress} * min(260px, 30vw)))`,
                  transition: 'transform 0.85s cubic-bezier(0.15, 0.9, 0.25, 1), opacity 0.75s ease-out',
                  willChange: 'transform, opacity'
                }}
              >
                {t.about.titlePart2}
              </div>
            </div>

            {/* About Us Showcase Grid (Dark aesthetic with authentic flanking photos and lorem ipsum story) */}
            <div
              style={{
                backgroundColor: 'transparent',
                borderRadius: '14px',
                overflow: 'hidden',
                padding: 'clamp(10px, 2vw, 24px) 0',
                position: 'relative'
              }}
            >
              <div className="about-showcase-grid">
                {/* Left Photo: Rocket League Champions Field Arena */}
                <div className="about-photo-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img
                    src="/images/champions_field.webp"
                    alt="Rocket League Champions Field Arena"
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '380px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      border: '1px solid #242434',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
                      display: 'block'
                    }}
                  />
                </div>

                {/* Center Content: Dark Aesthetic Lorem Ipsum Story and Red APPLY Button */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'left',
                    padding: 'clamp(8px, 1.5vw, 16px)'
                  }}
                >
                  <div style={{ color: '#D4D4E2', fontSize: 'clamp(0.88rem, 1.05vw, 0.98rem)', lineHeight: 1.72 }}>
                    <p style={{ margin: '0 0 14px', fontWeight: 400 }}>
                      {aboutText.p1}
                    </p>
                    <p style={{ margin: '0 0 14px', fontWeight: 400 }}>
                      {aboutText.p2}
                    </p>
                    <p style={{ margin: '0 0 24px', fontWeight: 400 }}>
                      {aboutText.p3}
                    </p>
                  </div>

                  {/* Call to Action Button: White 'Apply Now' */}
                  <Link
                    href="/apply"
                    style={{
                      backgroundColor: '#FFFFFF',
                      color: '#000000',
                      padding: '13px 40px',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
                      boxShadow: '0 4px 18px rgba(255, 255, 255, 0.15)',
                      marginTop: '4px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#E5E5E5';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 24px rgba(255, 255, 255, 0.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 18px rgba(255, 255, 255, 0.15)';
                    }}
                  >
                    {aboutText.applyButton}
                  </Link>
                </div>

                {/* Right Photo: Rocket League DFH Stadium Arena */}
                <div className="about-photo-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img
                    src="/images/dfh_stadium.webp"
                    alt="Rocket League DFH Stadium Arena"
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '380px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      border: '1px solid #242434',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
                      display: 'block'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* PlayVS-style Footer with Imprints (No Chat Widget) */}
      <Footer />

      {/* Article Modal */}
      {activeArticle && (
        <div className="modal-overlay" onClick={() => setActiveArticle(null)}>
          <div
            className="clean-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '680px',
              width: '100%',
              backgroundColor: '#101014',
              borderRadius: '10px',
              overflow: 'hidden',
              position: 'relative',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <button
              onClick={() => setActiveArticle(null)}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                background: 'rgba(0, 0, 0, 0.7)',
                border: '1px solid #33333E',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <X size={18} />
            </button>

            <div style={{ height: 'clamp(170px, 30vw, 240px)', width: '100%', position: 'relative' }}>
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 40%, #101014 100%)'
              }} />
            </div>

            <div style={{ padding: 'clamp(20px, 4vw, 32px)', overflowY: 'auto' }}>
              <div style={{
                fontSize: '0.8rem',
                color: '#FF701E',
                fontWeight: 600,
                marginBottom: '8px'
              }}>
                {activeArticle.date} · {activeArticle.readTime}
              </div>

              <h2 style={{
                fontSize: 'clamp(1.35rem, 4.5vw, 1.75rem)',
                fontWeight: 700,
                color: '#FFFFFF',
                lineHeight: 1.25,
                marginBottom: '16px'
              }}>
                {activeArticle.title}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', color: '#D0D0D8', fontSize: '0.94rem', lineHeight: 1.7 }}>
                {activeArticle.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default HomeClient;

