// Tiny animation math helpers (seconds-based).
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

export const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
export const easeIn = (p: number) => p * p * p;
export const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

// overshoot pop (like a sticker slamming in)
export const pop = (p: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
};

export const pulse = (t: number, period: number) => 0.5 + 0.5 * Math.sin((t / period) * Math.PI * 2);

// keyframe track: [time, value][] with smooth interpolation
export type Key = [number, number];
export function track(t: number, keys: Key[], ease: (p: number) => number = easeInOut): number {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, v0] = keys[i];
    const [t1, v1] = keys[i + 1];
    if (t <= t1) return lerp(v0, v1, ease(seg(t, t0, t1)));
  }
  return keys[keys.length - 1][1];
}

export const fmtTimecode = (t: number) => {
  const s = Math.floor(t);
  const f = Math.floor((t - s) * 30);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `00:00:${pad(s)}:${pad(f)}`;
};