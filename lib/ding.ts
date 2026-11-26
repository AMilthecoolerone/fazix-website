/**
 * A short two-note "ding", synthesised with the Web Audio API (no audio file).
 * Browsers only allow sound after a user action, so call prepareDing() inside a
 * click handler and playDing() later, e.g. when a request finishes.
 */

let ctx: AudioContext | null = null;

export function prepareDing(): void {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx ||= new AC();
    if (ctx.state === 'suspended') void ctx.resume();
  } catch {
    ctx = null;
  }
}

/** Plays the chime after `delay` seconds. Silently does nothing if audio is unavailable. */
export function playDing(delay = 0): void {
  if (!ctx) return;
  try {
    const start = ctx.currentTime + delay;
    const master = ctx.createGain();
    master.gain.value = 0.18;
    master.connect(ctx.destination);
    // Two bell-like notes (E6 then B6), each with a soft overtone and a quick decay.
    [
      { freq: 1318.5, at: 0 },
      { freq: 1975.5, at: 0.09 },
    ].forEach(({ freq, at }) => {
      for (const [mult, level] of [
        [1, 1],
        [2.76, 0.18],
      ] as const) {
        const osc = ctx!.createOscillator();
        const gain = ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq * mult;
        const t = start + at;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(level, t + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + (mult === 1 ? 1.1 : 0.35));
        osc.connect(gain).connect(master);
        osc.start(t);
        osc.stop(t + 1.2);
      }
    });
  } catch {
    // ignore: sound is a nice-to-have
  }
}
