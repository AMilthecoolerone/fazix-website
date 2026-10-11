'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import type { NewsTicker } from '@/lib/newsStore';

interface TopNewsBannerProps {
  initialTicker?: NewsTicker | null;
  onSelectArticleId?: (articleId: string) => void;
}

export const TopNewsBanner: React.FC<TopNewsBannerProps> = ({
  initialTicker = null,
  onSelectArticleId
}) => {
  const [ticker, setTicker] = useState<NewsTicker | null>(initialTicker);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  // Check dismissal in sessionStorage for the given ticker id
  const checkDismissal = useCallback((item: NewsTicker | null) => {
    if (!item) return false;
    try {
      const dismissedKey = `fazix_dismissed_ticker_${item.id}_${item.updatedAt}`;
      return sessionStorage.getItem(dismissedKey) === 'true';
    } catch {
      return false;
    }
  }, []);

  // Fetch latest ticker from API
  const fetchTicker = useCallback(async () => {
    try {
      const res = await fetch(`/api/news/ticker?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) {
        const nextTicker: NewsTicker | null = data.ticker || null;
        setTicker(nextTicker);
        if (nextTicker && !checkDismissal(nextTicker)) {
          setIsDismissed(false);
          setIsVisible(true);
        }
      }
    } catch (err) {
      // Non-blocking error
      console.debug('[TopNewsBanner] Polling error:', err);
    }
  }, [checkDismissal]);

  useEffect(() => {
    fetchTicker();

    // Poll every 4 seconds for real-time Discord bot updates
    const interval = setInterval(fetchTicker, 4000);

    // Refresh on tab focus
    const handleFocus = () => fetchTicker();
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchTicker]);

  // Synchronize CSS variable so entire layout adjusts seamlessly
  useEffect(() => {
    const isShowing = Boolean(isVisible && ticker?.isActive && !isDismissed);
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty(
        '--top-banner-height',
        isShowing ? '38px' : '0px'
      );
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--top-banner-height', '0px');
      }
    };
  }, [isVisible, ticker, isDismissed]);

  // Handle dismiss click
  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    setTimeout(() => {
      setIsDismissed(true);
      if (ticker) {
        try {
          const dismissedKey = `fazix_dismissed_ticker_${ticker.id}_${ticker.updatedAt}`;
          sessionStorage.setItem(dismissedKey, 'true');
        } catch {
          // ignore storage errors
        }
      }
    }, 200);
  };

  // Handle click on ticker item
  const handleClick = (e: React.MouseEvent) => {
    if (!ticker) return;

    if (ticker.articleId) {
      e.preventDefault();
      // If parent supplied handler, call it
      if (onSelectArticleId) {
        onSelectArticleId(ticker.articleId);
        return;
      }

      // Fire custom event for any listening component (like Home)
      window.dispatchEvent(
        new CustomEvent('open-fazix-article', {
          detail: { articleId: ticker.articleId }
        })
      );

      // Also scroll to news section if on home page
      const newsSection = document.getElementById('news');
      if (newsSection) {
        newsSection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (ticker.link) {
      if (ticker.link.startsWith('#')) {
        e.preventDefault();
        const targetId = ticker.link.replace('#', '');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.href = `/${ticker.link}`;
        }
      } else if (ticker.link.startsWith('http')) {
        e.preventDefault();
        window.open(ticker.link, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = ticker.link;
      }
    }
  };

  if (!ticker || !ticker.isActive || isDismissed) {
    return null;
  }

  // Dynamically calculate items so that each half covers at least 3200px width.
  // This guarantees an infinite, gap-free marquee across every monitor resolution (including ultrawide/4K).
  const textLength = Math.max(1, (ticker.text || '').length);
  const approxItemWidth = Math.max(80, textLength * 9 + 75);
  const repeatPerHalf = Math.max(4, Math.ceil(3200 / approxItemWidth));
  const loopItems = Array.from({ length: repeatPerHalf * 2 }, (_, i) => i);

  // Speed: calibrated to ~70px/s for a comfortable, relaxed, easily readable ticker pace
  const halfTrackWidth = repeatPerHalf * approxItemWidth;
  const durationSeconds = Math.max(30, Math.round(halfTrackWidth / 70));
  const animationDuration = `${durationSeconds}s`;

  return (
    <aside
      aria-label="Breaking news announcement ticker"
      className="top-news-banner"
      style={{
        opacity: isVisible ? 1 : 0,
        height: isVisible ? '38px' : '0px',
        borderBottom: isVisible ? '1px solid rgba(255, 89, 0, 0.22)' : 'none'
      }}
    >
      <div className="top-news-banner-gradient-accent" />

      {/* Marquee Track flowing across the screen */}
      <div className="top-news-ticker-viewport" onClick={handleClick} style={{ paddingLeft: '16px' }}>
        <div
          className="top-news-ticker-track"
          title="Click to view details (Hover to pause)"
          style={{ animationDuration }}
        >
          {loopItems.map((idx) => (
            <div key={idx} className="top-news-item">
              <span className="top-news-item-headline" style={{ fontWeight: 600 }}>
                {ticker.text}
              </span>
              <span style={{ color: '#444450', fontSize: '0.75rem' }}>◆</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Controls: Dismiss X */}
      <div className="top-news-controls">
        <button
          onClick={handleDismiss}
          className="top-news-dismiss-btn"
          aria-label="Dismiss news announcement"
          title="Dismiss"
        >
          <X size={15} />
        </button>
      </div>
    </aside>
  );
};
