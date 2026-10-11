'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { TRANSLATIONS, type LanguageCode } from '@/lib/translations';
import {
  ArrowLeft,
  ArrowUpRight,
  Tv,
  Sparkles,
  ExternalLink,
  Shield,
  Trophy,
  Play,
  Share2
} from 'lucide-react';

interface Creator {
  id: string;
  name: string;
  handle: string;
  role: string;
  platform: 'twitch' | 'youtube' | 'tiktok';
  avatar: string;
  description: string;
  games: string[];
  tags: string[];
  channelUrl: string;
  secondaryUrl?: string;
  secondaryLabel?: string;
  country: string;
  featured?: boolean;
}

const CREATORS_DATA: Record<LanguageCode, Creator[]> = {
  EN: [
    {
      id: 'r3ulex',
      name: 'r3ulex',
      handle: '@r3ulex',
      role: 'Twitch Streamer & Variety Creator',
      platform: 'twitch',
      avatar: '/images/creators/r3ulex.png',
      description:
        'High-energy Rocket League streamer and variety entertainer. Live regularly with ranked competitive grinds, community viewer 1v1s, bootcamp watch parties, and Valheim adventures.',
      games: ['Rocket League', 'Valheim', 'Variety Gaming'],
      tags: ['Live Streams', 'Ranked Grind', 'Bootcamps', 'Viewer Games'],
      channelUrl: 'https://www.twitch.tv/r3ulex',
      secondaryUrl: 'https://www.youtube.com/@r3ulex-live',
      secondaryLabel: 'YouTube VODs',
      country: 'Austria / Germany',
      featured: true
    },
    {
      id: 'kenorll',
      name: 'Kenorll',
      handle: '@kenorll',
      role: 'Twitch Streamer & Rocket League Talent',
      platform: 'twitch',
      avatar: '/images/creators/kenorll.jpeg',
      description:
        'Austrian Rocket League player and competitive creator streaming high-level ranked 2v2 and 3v3 gameplay, mechanical grinds, and community matches.',
      games: ['Rocket League'],
      tags: ['Live Streams', 'Ranked Grind', 'Mechanics', 'Rocket League'],
      channelUrl: 'https://www.twitch.tv/kenorll',
      country: 'Austria'
    },
    {
      id: 'fazix-youtube',
      name: 'FAZIX Media & Comms',
      handle: '@Fazix-eSports',
      role: 'Official YouTube Channel',
      platform: 'youtube',
      avatar: '/images/logo.png',
      description:
        'The central video hub for FAZIX Esports. In-depth RLCS European qualifiers breakdowns, unfiltered team voice comms, tournament recap mini-docs, and exclusive bootcamp behind-the-scenes.',
      games: ['Rocket League', 'RLCS Europe'],
      tags: ['Voice Comms', 'RLCS Highlights', 'Documentaries', 'Match Recaps'],
      channelUrl: 'https://www.youtube.com/@Fazix-eSports',
      secondaryUrl: 'https://www.youtube.com/@Fazix-eSports/videos',
      secondaryLabel: 'Latest Uploads',
      country: 'Europe'
    }
  ],
  DE: [
    {
      id: 'r3ulex',
      name: 'r3ulex',
      handle: '@r3ulex',
      role: 'Twitch Streamer & Variety Creator',
      platform: 'twitch',
      avatar: '/images/creators/r3ulex.png',
      description:
        'Energiegeladener Rocket League Streamer und Entertainer. Regelmäßig live mit Ranked-Grinds, Community-Viewer-1v1s, Bootcamp Watch Parties und Valheim Abenteuern.',
      games: ['Rocket League', 'Valheim', 'Variety Gaming'],
      tags: ['Live Streams', 'Ranked Grind', 'Bootcamps', 'Viewer Games'],
      channelUrl: 'https://www.twitch.tv/r3ulex',
      secondaryUrl: 'https://www.youtube.com/@r3ulex-live',
      secondaryLabel: 'YouTube VODs',
      country: 'Österreich / Deutschland',
      featured: true
    },
    {
      id: 'kenorll',
      name: 'Kenorll',
      handle: '@kenorll',
      role: 'Twitch Streamer & Rocket League Talent',
      platform: 'twitch',
      avatar: '/images/creators/kenorll.jpeg',
      description:
        'Österreichischer Rocket League Spieler und Content Creator. Regelmäßige High-Rank 2v2- und 3v3-Streams, Mechanik-Training und Community-Matches.',
      games: ['Rocket League'],
      tags: ['Live Streams', 'Ranked Grind', 'Mechanics', 'Rocket League'],
      channelUrl: 'https://www.twitch.tv/kenorll',
      country: 'Österreich'
    },
    {
      id: 'fazix-youtube',
      name: 'FAZIX Media & Comms',
      handle: '@Fazix-eSports',
      role: 'Offizieller YouTube-Kanal',
      platform: 'youtube',
      avatar: '/images/logo.png',
      description:
        'Der zentrale Video-Hub von Fazix Esports. Analysen europäischer RLCS Qualifiers, Voice-Comms der Teams, Turnier-Recaps und exklusive Einblicke in Bootcamps.',
      games: ['Rocket League', 'RLCS Europe'],
      tags: ['Voice Comms', 'RLCS Highlights', 'Dokumentationen', 'Turnier-Recaps'],
      channelUrl: 'https://www.youtube.com/@Fazix-eSports',
      secondaryUrl: 'https://www.youtube.com/@Fazix-eSports/videos',
      secondaryLabel: 'Neueste Uploads',
      country: 'Europa'
    }
  ],
  FR: [
    {
      id: 'r3ulex',
      name: 'r3ulex',
      handle: '@r3ulex',
      role: 'Streameur Twitch & Créateur Variety',
      platform: 'twitch',
      avatar: '/images/creators/r3ulex.png',
      description:
        'Streameur Rocket League dynamique et animateur variety. En direct avec des grinds classés, des 1v1 avec la commu, des watch parties et des sessions Valheim.',
      games: ['Rocket League', 'Valheim', 'Variety Gaming'],
      tags: ['Live Streams', 'Ranked Grind', 'Bootcamps', 'Parties Commu'],
      channelUrl: 'https://www.twitch.tv/r3ulex',
      secondaryUrl: 'https://www.youtube.com/@r3ulex-live',
      secondaryLabel: 'VODs YouTube',
      country: 'Autriche / Allemagne',
      featured: true
    },
    {
      id: 'kenorll',
      name: 'Kenorll',
      handle: '@kenorll',
      role: 'Streameur Twitch & Talent Rocket League',
      platform: 'twitch',
      avatar: '/images/creators/kenorll.jpeg',
      description:
        'Joueur autrichien de Rocket League et créateur compétitif. Diffusions de parties classées 2v2/3v3 de haut niveau, entraînements mécaniques et matchs avec la commu.',
      games: ['Rocket League'],
      tags: ['Live Streams', 'Ranked Grind', 'Mécaniques', 'Rocket League'],
      channelUrl: 'https://www.twitch.tv/kenorll',
      country: 'Autriche'
    },
    {
      id: 'fazix-youtube',
      name: 'FAZIX Media & Comms',
      handle: '@Fazix-eSports',
      role: 'Chaîne YouTube officielle',
      platform: 'youtube',
      avatar: '/images/logo.png',
      description:
        'Le centre vidéo officiel de Fazix Esports. Analyses des qualifications européennes RLCS, communications vocales d’équipe, récapitulatifs de tournois et coulisses de bootcamps.',
      games: ['Rocket League', 'RLCS Europe'],
      tags: ['Comms Vocales', 'Highlights RLCS', 'Documentaires', 'Résumés de Match'],
      channelUrl: 'https://www.youtube.com/@Fazix-eSports',
      secondaryUrl: 'https://www.youtube.com/@Fazix-eSports/videos',
      secondaryLabel: 'Dernières vidéos',
      country: 'Europe'
    }
  ],
  ES: [
    {
      id: 'r3ulex',
      name: 'r3ulex',
      handle: '@r3ulex',
      role: 'Streamer en Twitch y Creador Variado',
      platform: 'twitch',
      avatar: '/images/creators/r3ulex.png',
      description:
        'Streamer de Rocket League lleno de energía y creador multidisciplinar. En directo con grind competitivo en rankeds, 1v1 con espectadores, watch parties y Valheim.',
      games: ['Rocket League', 'Valheim', 'Variety Gaming'],
      tags: ['Directos', 'Ranked Grind', 'Bootcamps', 'Partidas con Fans'],
      channelUrl: 'https://www.twitch.tv/r3ulex',
      secondaryUrl: 'https://www.youtube.com/@r3ulex-live',
      secondaryLabel: 'VODs en YouTube',
      country: 'Austria / Alemania',
      featured: true
    },
    {
      id: 'kenorll',
      name: 'Kenorll',
      handle: '@kenorll',
      role: 'Streamer en Twitch y Talento Rocket League',
      platform: 'twitch',
      avatar: '/images/creators/kenorll.jpeg',
      description:
        'Jugador austriaco de Rocket League y creador competitivo. Retransmisiones de rankeds de alto nivel en 2v2 y 3v3, entrenamientos mecánicos y partidas comunitarias.',
      games: ['Rocket League'],
      tags: ['Directos', 'Ranked Grind', 'Mecánicas', 'Rocket League'],
      channelUrl: 'https://www.twitch.tv/kenorll',
      country: 'Austria'
    },
    {
      id: 'fazix-youtube',
      name: 'FAZIX Media & Comms',
      handle: '@Fazix-eSports',
      role: 'Canal Oficial de YouTube',
      platform: 'youtube',
      avatar: '/images/logo.png',
      description:
        'El canal de vídeo oficial de Fazix Esports. Análisis de clasificatorios europeos de RLCS, audios de voz del equipo sin filtro, resúmenes de torneos y grabaciones de bootcamps.',
      games: ['Rocket League', 'RLCS Europe'],
      tags: ['Voice Comms', 'Highlights RLCS', 'Documentales', 'Resúmenes de Partida'],
      channelUrl: 'https://www.youtube.com/@Fazix-eSports',
      secondaryUrl: 'https://www.youtube.com/@Fazix-eSports/videos',
      secondaryLabel: 'Últimas subidas',
      country: 'Europa'
    }
  ]
};

export default function CreatorsPage() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language] || TRANSLATIONS.EN;
  const [activeTab, setActiveTab] = useState<'all' | 'twitch' | 'youtube' | 'tiktok'>('all');
  const [showEmbed, setShowEmbed] = useState(false);

  const creatorsList = CREATORS_DATA[language] || CREATORS_DATA.EN;

  const filteredCreators = creatorsList.filter((creator) => {
    if (activeTab === 'all') return true;
    return creator.platform === activeTab;
  });

  const featuredCreator = creatorsList.find((c) => c.featured) || creatorsList[0];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#FFFFFF', fontFamily: 'var(--font-helvetica)' }}>
      {/* Universal Top-Anchored Navbar with full mega-menu navigation */}
      <Navbar />

      <main style={{ paddingTop: '100px', paddingBottom: '100px', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle Background Glows */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '900px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(145, 70, 255, 0.08) 0%, rgba(255, 112, 30, 0.04) 40%, rgba(0, 0, 0, 0) 70%)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {/* Breadcrumb / Back Link */}
          <div style={{ marginBottom: '28px' }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#8E8E98',
                fontSize: '0.86rem',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#8E8E98')}
            >
              <ArrowLeft size={16} />
              <span>{t.creators.backHome}</span>
            </Link>
          </div>

          {/* Page Hero Header */}
          <div style={{ maxWidth: '850px', marginBottom: '56px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                backgroundColor: 'rgba(145, 70, 255, 0.12)',
                border: '1px solid rgba(145, 70, 255, 0.3)',
                borderRadius: '30px',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#BFA0FF',
                marginBottom: '18px'
              }}
            >
              <Tv size={14} color="#9146FF" />
              <span>{t.creators.badge}</span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-helvetica)',
                fontStyle: 'italic',
                fontWeight: 900,
                fontSize: 'clamp(2.5rem, 6.5vw, 4.8rem)',
                lineHeight: 0.96,
                letterSpacing: '-0.035em',
                textTransform: 'uppercase',
                margin: '0 0 20px',
                color: '#FFFFFF'
              }}
            >
              {t.creators.title}
            </h1>

            <p style={{ color: '#A0A0B0', fontSize: 'clamp(1rem, 1.2vw, 1.15rem)', lineHeight: 1.6, margin: '0 0 28px' }}>
              {t.creators.subtitle}
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
              <a
                href="https://www.twitch.tv/r3ulex"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#9146FF',
                  color: '#FFFFFF',
                  padding: '13px 28px',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 18px rgba(145, 70, 255, 0.35)',
                  transition: 'background-color 0.2s ease, transform 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#772CE8';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#9146FF';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>{t.creators.watchR3ulexBtn}</span>
                <ExternalLink size={16} />
              </a>

              <Link
                href="/apply"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  color: '#FFFFFF',
                  padding: '13px 26px',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background-color 0.2s ease, border-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
                }}
              >
                <span>{t.creators.applyBtn}</span>
                <Sparkles size={16} color="#FF701E" />
              </Link>
            </div>
          </div>

          {/* FEATURED CREATOR SPOTLIGHT: r3ulex */}
          <div style={{ marginBottom: '64px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '18px'
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#9146FF' }} />
              <h2
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#9146FF',
                  margin: 0
                }}
              >
                {t.creators.featuredBadge}
              </h2>
            </div>

            <div
              className="clean-card"
              style={{
                backgroundColor: '#0D0E13',
                border: '1px solid #242430',
                borderRadius: '14px',
                padding: 'clamp(24px, 3.5vw, 42px)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(145, 70, 255, 0.15)'
              }}
            >
              {/* Card Corner Ambient Gradient */}
              <div
                style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '-40px',
                  width: '240px',
                  height: '240px',
                  background: 'radial-gradient(circle, rgba(145, 70, 255, 0.18) 0%, rgba(0, 0, 0, 0) 70%)',
                  pointerEvents: 'none'
                }}
              />

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: 'clamp(20px, 3vw, 40px)',
                  alignItems: 'center'
                }}
              >
                {/* Creator Avatar with Twitch Glow */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div
                    style={{
                      width: 'clamp(110px, 14vw, 160px)',
                      height: 'clamp(110px, 14vw, 160px)',
                      borderRadius: '50%',
                      padding: '4px',
                      background: 'linear-gradient(135deg, #9146FF, #FF701E)',
                      boxShadow: '0 8px 30px rgba(145, 70, 255, 0.35)'
                    }}
                  >
                    <img
                      src={featuredCreator.avatar}
                      alt={`${featuredCreator.name} profile`}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        backgroundColor: '#161620',
                        display: 'block'
                      }}
                    />
                  </div>

                  {/* Pulsing Live Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '4px',
                      right: '12px',
                      backgroundColor: '#9146FF',
                      border: '2px solid #0D0E13',
                      borderRadius: '20px',
                      padding: '4px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      letterSpacing: '0.04em'
                    }}
                  >
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: '#FFFFFF',
                        display: 'inline-block'
                      }}
                    />
                    TWITCH
                  </div>
                </div>

                {/* Creator Details */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    <h3
                      style={{
                        fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)',
                        fontWeight: 900,
                        margin: 0,
                        lineHeight: 1.1,
                        color: '#FFFFFF'
                      }}
                    >
                      {featuredCreator.name}
                    </h3>
                    <span
                      style={{
                        color: '#8E8E98',
                        fontSize: '0.95rem',
                        fontWeight: 600
                      }}
                    >
                      {featuredCreator.handle}
                    </span>
                    <span
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        color: '#C0C0D0',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '4px',
                        textTransform: 'uppercase'
                      }}
                    >
                      {featuredCreator.country}
                    </span>
                  </div>

                  <p
                    style={{
                      color: '#9146FF',
                      fontSize: '1rem',
                      fontWeight: 700,
                      margin: '0 0 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Tv size={16} />
                    <span>{featuredCreator.role}</span>
                  </p>

                  <p
                    style={{
                      color: '#A0A0B2',
                      fontSize: '0.94rem',
                      lineHeight: 1.65,
                      margin: '0 0 20px',
                      maxWidth: '720px'
                    }}
                  >
                    {featuredCreator.description}
                  </p>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                    {featuredCreator.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          backgroundColor: '#161720',
                          border: '1px solid #282836',
                          color: '#C0C0D2',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          padding: '5px 12px',
                          borderRadius: '6px'
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <a
                      href={featuredCreator.channelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        backgroundColor: '#9146FF',
                        color: '#FFFFFF',
                        padding: '11px 24px',
                        borderRadius: '6px',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background-color 0.2s ease, transform 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#772CE8';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#9146FF';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <Tv size={16} />
                      <span>{t.creators.watchStreamBtn}</span>
                      <ExternalLink size={14} />
                    </a>

                    {featuredCreator.secondaryUrl && (
                      <a
                        href={featuredCreator.secondaryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          backgroundColor: '#161720',
                          border: '1px solid #2E303E',
                          color: '#FFFFFF',
                          padding: '11px 20px',
                          borderRadius: '6px',
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'background-color 0.2s ease, border-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#222330';
                          e.currentTarget.style.borderColor = '#444658';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#161720';
                          e.currentTarget.style.borderColor = '#2E303E';
                        }}
                      >
                        <Play size={15} color="#FF0000" />
                        <span>{featuredCreator.secondaryLabel || 'YouTube Channel'}</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => setShowEmbed(!showEmbed)}
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #2E303E',
                        color: '#9E9EA8',
                        padding: '11px 18px',
                        borderRadius: '6px',
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#FFFFFF';
                        e.currentTarget.style.borderColor = '#505264';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#9E9EA8';
                        e.currentTarget.style.borderColor = '#2E303E';
                      }}
                    >
                      <span>{showEmbed ? t.creators.hidePlayer : t.creators.showPlayer}</span>
                    </button>
                  </div>

                  {/* Inline Twitch Embedded Player Option */}
                  {showEmbed && (
                    <div
                      style={{
                        marginTop: '24px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        border: '1px solid #333346',
                        backgroundColor: '#000000',
                        aspectRatio: '16/9',
                        width: '100%',
                        maxWidth: '820px'
                      }}
                    >
                      <iframe
                        src="https://player.twitch.tv/?channel=r3ulex&parent=localhost&parent=fazix.gg&parent=fazix-esport.xyz&autoplay=false"
                        height="100%"
                        width="100%"
                        allowFullScreen
                        title="r3ulex Twitch Live Stream"
                        style={{ border: 'none', display: 'block' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CREATOR ROSTER LIST */}
          <div style={{ marginBottom: '80px' }}>
            {/* Header + Tabs Filter */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '28px',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: 'var(--font-helvetica)',
                    fontSize: 'clamp(1.4rem, 2.4vw, 2rem)',
                    fontWeight: 800,
                    margin: '0 0 6px',
                    color: '#FFFFFF'
                  }}
                >
                  {t.creators.rosterTitle}
                </h2>
                <p style={{ color: '#8E8E98', fontSize: '0.88rem', margin: 0 }}>
                  {t.creators.rosterSubtitle}
                </p>
              </div>

              {/* Filter Tabs */}
              <div
                style={{
                  display: 'inline-flex',
                  backgroundColor: '#121218',
                  border: '1px solid #22222E',
                  borderRadius: '8px',
                  padding: '4px',
                  gap: '4px'
                }}
              >
                {[
                  { id: 'all', label: t.creators.tabAll },
                  { id: 'twitch', label: 'Twitch' },
                  { id: 'youtube', label: 'YouTube' },
                  { id: 'tiktok', label: 'TikTok' }
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as 'all' | 'twitch' | 'youtube' | 'tiktok')}
                      style={{
                        padding: '7px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                        color: isActive ? '#000000' : '#8E8E98',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grid of Creators */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '24px'
              }}
            >
              {filteredCreators.map((creator) => (
                <div
                  key={creator.id}
                  className="clean-card"
                  style={{
                    backgroundColor: '#0F0F14',
                    border: '1px solid #22222C',
                    borderRadius: '12px',
                    padding: '26px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = creator.platform === 'twitch' ? '#9146FF' : '#FF701E';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.45)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = '#22222C';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div>
                    {/* Card Top: Avatar, Name & Platform Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                      <img
                        src={creator.avatar}
                        alt={`${creator.name} avatar`}
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          backgroundColor: '#1A1A24',
                          border: `2px solid ${creator.platform === 'twitch' ? '#9146FF' : '#333344'}`
                        }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                            {creator.name}
                          </h3>
                        </div>
                        <span style={{ color: '#8E8E98', fontSize: '0.8rem', fontWeight: 600 }}>
                          {creator.handle}
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        backgroundColor:
                          creator.platform === 'twitch'
                            ? 'rgba(145, 70, 255, 0.14)'
                            : creator.platform === 'youtube'
                              ? 'rgba(255, 0, 0, 0.12)'
                              : 'rgba(255, 255, 255, 0.1)',
                        color:
                          creator.platform === 'twitch'
                            ? '#C2A3FF'
                            : creator.platform === 'youtube'
                              ? '#FF6666'
                              : '#FFFFFF',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        marginBottom: '14px'
                      }}
                    >
                      <Tv size={13} />
                      <span>{creator.role}</span>
                    </div>

                    <p style={{ color: '#9E9EB0', fontSize: '0.88rem', lineHeight: 1.6, margin: '0 0 18px' }}>
                      {creator.description}
                    </p>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '22px' }}>
                      {creator.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            backgroundColor: '#171720',
                            color: '#9090A4'
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div>
                    <a
                      href={creator.channelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        width: '100%',
                        backgroundColor: creator.platform === 'twitch' ? '#9146FF' : '#1D1E28',
                        color: '#FFFFFF',
                        padding: '11px',
                        borderRadius: '6px',
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          creator.platform === 'twitch' ? '#772CE8' : '#282938';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          creator.platform === 'twitch' ? '#9146FF' : '#1D1E28';
                      }}
                    >
                      <span>{t.creators.visitChannel}</span>
                      <ArrowUpRight size={15} />
                    </a>
                  </div>
                </div>
              ))}

              {/* CARD: Apply as Creator Card */}
              <div
                className="clean-card"
                style={{
                  backgroundColor: 'rgba(255, 112, 30, 0.03)',
                  border: '1px dashed rgba(255, 112, 30, 0.35)',
                  borderRadius: '12px',
                  padding: '26px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'border-color 0.2s ease, transform 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FF701E';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 112, 30, 0.35)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255, 112, 30, 0.14)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '18px'
                    }}
                  >
                    <Sparkles size={22} color="#FF701E" />
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 10px', color: '#FFFFFF' }}>
                    {t.creators.joinCardTitle}
                  </h3>

                  <p style={{ color: '#9E9EB0', fontSize: '0.88rem', lineHeight: 1.6, margin: '0 0 18px' }}>
                    {t.creators.joinCardDesc}
                  </p>

                  <ul style={{ paddingLeft: '18px', color: '#8E8E98', fontSize: '0.8rem', lineHeight: 1.65, margin: '0 0 22px' }}>
                    <li>{t.creators.joinCardLi1}</li>
                    <li>{t.creators.joinCardLi2}</li>
                    <li>{t.creators.joinCardLi3}</li>
                  </ul>
                </div>

                <Link
                  href="/apply"
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    padding: '11px',
                    borderRadius: '6px',
                    fontSize: '0.86rem',
                    fontWeight: 800,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E5E5E5')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                >
                  <span>{t.creators.applyNowBtn}</span>
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
          </div>

          {/* PERKS / WHY JOIN THE CREATOR PROGRAM */}
          <div
            style={{
              backgroundColor: '#0C0C10',
              border: '1px solid #1E1E26',
              borderRadius: '14px',
              padding: 'clamp(28px, 4vw, 48px)',
              marginBottom: '40px'
            }}
          >
            <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 40px' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-helvetica)',
                  fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)',
                  fontWeight: 800,
                  margin: '0 0 10px',
                  color: '#FFFFFF'
                }}
              >
                {t.creators.whyJoinTitle}
              </h2>
              <p style={{ color: '#8E8E98', fontSize: '0.92rem', margin: 0, lineHeight: 1.6 }}>
                {t.creators.whyJoinSubtitle}
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '24px',
                marginBottom: '40px'
              }}
            >
              {[
                {
                  icon: <Trophy size={20} color="#FF701E" />,
                  title: t.creators.perk1Title,
                  desc: t.creators.perk1Desc
                },
                {
                  icon: <Sparkles size={20} color="#9146FF" />,
                  title: t.creators.perk2Title,
                  desc: t.creators.perk2Desc
                },
                {
                  icon: <Share2 size={20} color="#00D26A" />,
                  title: t.creators.perk3Title,
                  desc: t.creators.perk3Desc
                },
                {
                  icon: <Shield size={20} color="#3B82F6" />,
                  title: t.creators.perk4Title,
                  desc: t.creators.perk4Desc
                }
              ].map((perk) => (
                <div
                  key={perk.title}
                  style={{
                    backgroundColor: '#121218',
                    border: '1px solid #22222E',
                    borderRadius: '10px',
                    padding: '22px'
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '8px',
                      backgroundColor: '#1A1A24',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '14px'
                    }}
                  >
                    {perk.icon}
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 8px', color: '#FFFFFF' }}>
                    {perk.title}
                  </h4>
                  <p style={{ color: '#8E8E98', fontSize: '0.84rem', lineHeight: 1.58, margin: 0 }}>
                    {perk.desc}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <Link
                href="/apply"
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  padding: '14px 38px',
                  borderRadius: '6px',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 20px rgba(255, 255, 255, 0.15)',
                  transition: 'background-color 0.2s ease, transform 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E5E5E5';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>{t.creators.perksApplyBtn}</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* PlayVS-style Footer */}
      <Footer />
    </div>
  );
}
