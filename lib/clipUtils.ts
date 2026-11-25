/** Clip helpers safe to import from client components. */
export type ClipPlatform = 'youtube' | 'twitch' | 'medal' | 'tiktok' | 'streamable' | 'other';

export function detectPlatform(url: string): ClipPlatform {
  const host = (() => {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return '';
    }
  })();
  if (/(^|\.)youtube\.com$|^youtu\.be$/.test(host)) return 'youtube';
  if (/(^|\.)twitch\.tv$/.test(host)) return 'twitch';
  if (/(^|\.)medal\.tv$/.test(host)) return 'medal';
  if (/(^|\.)tiktok\.com$/.test(host)) return 'tiktok';
  if (/(^|\.)streamable\.com$/.test(host)) return 'streamable';
  return 'other';
}

/** YouTube/Streamable embed URL for previews, or null. */
export function embedUrl(clip: { url: string; platform: ClipPlatform }): string | null {
  try {
    const u = new URL(clip.url);
    if (clip.platform === 'youtube') {
      const id = u.hostname.includes('youtu.be')
        ? u.pathname.slice(1)
        : u.searchParams.get('v') || u.pathname.match(/\/(shorts|embed)\/([\w-]+)/)?.[2];
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (clip.platform === 'streamable') return `https://streamable.com/e${u.pathname}`;
  } catch {
    // ignore
  }
  return null;
}

export const CLIP_CATEGORIES = ['Goal', 'Save', 'Freestyle', 'Funny', 'Tournament', 'Other'];
