'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { DiscordIcon } from '@/components/icons/DiscordIcon';
import { ShieldCheck, Swords, Handshake, Users, ChevronRight, Sparkles } from 'lucide-react';
import { UserGroup } from '@/lib/auth';

const GROUP_OPTIONS: Array<{
  id: UserGroup;
  title: string;
  badge: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; color?: string; style?: React.CSSProperties }>;
}> = [
  {
    id: 'support',
    title: 'Support Team',
    badge: 'Staff & Management',
    desc: 'Tickets desk management, application reviews & Discord announcements',
    icon: ShieldCheck
  },
  {
    id: 'player',
    title: 'Esports team (player)',
    badge: '2,185 SSL MMR',
    desc: 'Bo7 scrim lobbies, tournament schedules & competitive RL tracker',
    icon: Swords
  },
  {
    id: 'partner',
    title: 'Partners',
    badge: 'Official Partner',
    desc: 'Discord sponsored ads queue & partner priority communications',
    icon: Handshake
  },
  {
    id: 'user',
    title: 'Normal people (Users)',
    badge: 'Community',
    desc: 'Roster trial application, ticket desk & community hub',
    icon: Users
  }
];

function LoginContent() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');

  const [isLoading, setIsLoading] = useState(false);
  const [loadingGroup, setLoadingGroup] = useState<UserGroup | null>(null);

  const handleDiscordLogin = () => {
    setIsLoading(true);
    window.location.href = '/api/auth/discord';
  };

  const handleGroupLogin = (groupId: UserGroup) => {
    setLoadingGroup(groupId);
    window.location.href = `/api/auth/demo?group=${groupId}`;
  };

  const formatErrorMessage = (err: string | null) => {
    if (!err) return null;
    const lower = err.toLowerCase();
    if (lower.includes('discord_credentials_not_configured')) {
      return 'Discord OAuth credentials are not fully set in .env.local yet. You can sign in using any of the 4 test groups below.';
    }
    if (lower.includes('access_denied') || lower.includes('denied')) {
      return 'Discord login authorization was cancelled.';
    }
    if (lower.includes('redirect_uri')) {
      return 'Redirect URI mismatch on Discord. Please make sure both "http://localhost:3000/api/auth/callback/discord" and "https://fazix-esport.xyz/api/auth/callback/discord" are added in Discord Developer Portal > OAuth2 > Redirects.';
    }
    if (lower.includes('invalid_client') || lower.includes('secret')) {
      return 'Discord Client Secret is invalid. Please double-check DISCORD_CLIENT_SECRET in .env.local.';
    }
    if (lower.includes('token_exchange_failed')) {
      return `Discord token exchange error: ${decodeURIComponent(err)}. Please try again.`;
    }
    if (lower.includes('user_fetch_failed')) {
      return 'Could not retrieve Discord profile details. Please retry.';
    }
    return `Authentication note: ${decodeURIComponent(err)}`;
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#09090C',
        color: '#FFFFFF',
        fontFamily: 'var(--font-helvetica), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '36px 20px 28px 20px',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Section: Centered Logo */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '10px',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          title="Return to FAZIX Homepage"
        >
          <img
            src="/images/logo.png"
            alt="FAZIX Esports"
            style={{
              width: '52px',
              height: '52px',
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 4px 14px rgba(0, 0, 0, 0.6))',
            }}
          />
        </Link>
      </div>

      {/* Middle Section: Sign-in Card Form */}
      <main
        style={{
          width: '100%',
          maxWidth: '430px',
          margin: 'auto 0',
          padding: '20px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        {/* Error Alert if any */}
        {errorParam && (
          <div
            style={{
              backgroundColor: '#161313',
              border: '1px solid #7F1D1D',
              borderRadius: '10px',
              padding: '12px 14px',
              marginBottom: '18px',
              color: '#FCA5A5',
              fontSize: '0.84rem',
              lineHeight: 1.45,
            }}
          >
            {formatErrorMessage(errorParam)}
          </div>
        )}

        {/* Title */}
        <h1
          style={{
            fontSize: '1.85rem',
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '-0.025em',
            margin: '0 0 6px 0',
            lineHeight: 1.2,
          }}
        >
          Sign in
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '0.92rem',
            color: '#8E8E9A',
            margin: '0 0 22px 0',
            fontWeight: 400,
            lineHeight: 1.4,
          }}
        >
          Sign in with Discord or choose an access group
        </p>

        {/* Primary Action Button: Login by Discord */}
        <button
          id="btn-discord-login"
          type="button"
          onClick={handleDiscordLogin}
          disabled={isLoading || loadingGroup !== null}
          style={{
            width: '100%',
            height: '48px',
            backgroundColor: isLoading ? '#E2E2E8' : '#FFFFFF',
            color: '#000000',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.96rem',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            cursor: isLoading ? 'wait' : 'pointer',
            transition: 'background-color 0.18s ease, transform 0.12s ease',
            outline: 'none',
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#EDEDF2';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          <DiscordIcon size={20} color="#000000" />
          <span>{isLoading ? 'Connecting to Discord...' : 'Login with Discord'}</span>
        </button>

        {/* Subtle Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            margin: '22px 0 16px 0',
          }}
        >
          <div style={{ flex: 1, height: '1px', backgroundColor: '#1C1C24' }} />
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#656574',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={12} color="#656574" />
            Or select test group
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#1C1C24' }} />
        </div>

        {/* 4 User Group Selector Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {GROUP_OPTIONS.map((grp) => {
            const Icon = grp.icon;
            const isThisLoading = loadingGroup === grp.id;

            return (
              <button
                key={grp.id}
                type="button"
                onClick={() => handleGroupLogin(grp.id)}
                disabled={isLoading || loadingGroup !== null}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  backgroundColor: '#0F0F14',
                  border: '1px solid #1C1C24',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  cursor: isThisLoading ? 'wait' : 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.15s ease, border-color 0.15s ease, transform 0.12s ease',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isThisLoading) {
                    e.currentTarget.style.backgroundColor = '#15151C';
                    e.currentTarget.style.borderColor = '#2D2D3A';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isThisLoading) {
                    e.currentTarget.style.backgroundColor = '#0F0F14';
                    e.currentTarget.style.borderColor = '#1C1C24';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      backgroundColor: '#181822',
                      border: '1px solid #282834',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={17} color="#FFFFFF" />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          color: '#FFFFFF',
                          lineHeight: 1.2,
                        }}
                      >
                        {grp.title}
                      </span>
                      <span
                        style={{
                          fontSize: '0.64rem',
                          fontWeight: 700,
                          backgroundColor: '#1F1F2B',
                          color: '#A0A0B0',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {grp.badge}
                      </span>
                    </div>

                    <span
                      style={{
                        fontSize: '0.72rem',
                        color: '#767684',
                        marginTop: '3px',
                        lineHeight: 1.3,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {grp.desc}
                    </span>
                  </div>
                </div>

                <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', color: '#6A6A78' }}>
                  {isThisLoading ? (
                    <span style={{ fontSize: '0.72rem', color: '#FFFFFF' }}>Entering...</span>
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Terms of Service notice */}
        <p
          style={{
            fontSize: '0.8rem',
            color: '#70707E',
            textAlign: 'center',
            marginTop: '20px',
            marginBottom: '0',
            lineHeight: 1.5,
          }}
        >
          By continuing, you agree to our{' '}
          <Link
            href="/imprint"
            style={{
              color: '#FFFFFF',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
              fontWeight: 500,
            }}
          >
            Terms of service
          </Link>
        </p>
      </main>

      {/* Bottom Section: Privacy Policy Link */}
      <footer
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: '8px',
        }}
      >
        <Link
          href="/privacy"
          style={{
            color: '#70707E',
            fontSize: '0.8rem',
            fontWeight: 500,
            textDecoration: 'none',
            letterSpacing: '0.01em',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#70707E')}
        >
          Privacy policy
        </Link>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#09090C',
            color: '#9CA3AF',
          }}
        >
          Loading sign in...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
