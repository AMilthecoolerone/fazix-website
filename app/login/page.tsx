'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { DiscordIcon } from '@/components/icons/DiscordIcon';

const ERRORS: Record<string, string> = {
  discord_credentials_not_configured: 'Discord login isn’t set up yet. Add DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET to the environment.',
  access_denied: 'You cancelled the Discord login.',
  state_mismatch: 'That login link expired. Please try again.',
  user_fetch_failed: 'Couldn’t load your Discord profile. Please try again.',
  auth_internal_error: 'Something went wrong while signing in. Please try again.',
};

function errorMessage(err: string | null): string | null {
  if (!err) return null;
  if (ERRORS[err]) return ERRORS[err];
  if (/redirect_uri/i.test(err)) return 'Discord rejected the redirect URL. Add this site’s /api/auth/callback/discord URL in the Discord Developer Portal → OAuth2 → Redirects.';
  return 'Discord login failed. Please try again.';
}

function LoginContent() {
  const error = errorMessage(useSearchParams().get('error'));
  const [loading, setLoading] = useState(false);

  return (
    <div className="login">
      <Link href="/" className="login-logo" aria-label="FAZIX home">
        <img src="/images/logo.png" alt="" width={44} height={44} />
      </Link>

      <main className="login-box">
        <h1>Sign in to FAZIX</h1>
        <p>Use your Discord account. Staff tools unlock automatically if you have a staff role on the server.</p>

        {error && <div className="login-error">{error}</div>}

        <a
          href="/api/auth/discord"
          className="login-discord"
          aria-disabled={loading}
          onClick={(e) => {
            if (loading) e.preventDefault();
            setLoading(true);
          }}
        >
          <DiscordIcon size={20} />
          {loading ? 'Redirecting to Discord…' : 'Continue with Discord'}
        </a>

        <small>
          By continuing you agree to our <Link href="/imprint">terms</Link> and <Link href="/privacy">privacy policy</Link>.
        </small>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="login" />}>
      <LoginContent />
    </Suspense>
  );
}
