// Deterministic hand-drawn ("boiling line") geometry helpers.
export const INK = '#2b2620';
export const PAPER = '#f4efe6';
export const PANEL = '#fbf8f2';

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Wobbly rounded-rect path. `boil` changes the jitter seed so lines "boil" like hand-drawn animation.
export function sketchRect(
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  seed: number,
  amp = 1.4,
): string {
  const rnd = mulberry32(seed * 7919 + 13);
  const j = () => (rnd() - 0.5) * 2 * amp;
  const rr = Math.min(r, w / 2, h / 2);
  // subdivide each straight edge into 2 mid points for wobble
  const p: string[] = [];
  const tl = [x + rr, y];
  const tr = [x + w - rr, y];
  const br = [x + w, y + h - rr];
  const bl = [x + rr, y + h];
  p.push(`M ${tl[0] + j()} ${tl[1] + j()}`);
  p.push(`L ${(x + w / 2) + j()} ${y + j()} L ${tr[0] + j()} ${tr[1] + j()}`);
  p.push(`Q ${x + w + j()} ${y + j()} ${br[0] + j()} ${br[1] + j()}`);
  p.push(`L ${x + w + j()} ${y + h / 2 + j()} L ${x + w + j()} ${y + h - rr + j()}`);
  p.push(`Q ${x + w + j()} ${y + h + j()} ${x + w - rr + j()} ${y + h + j()}`);
  p.push(`L ${x + w / 2 + j()} ${y + h + j()} L ${bl[0] + j()} ${bl[1] + j()}`);
  p.push(`Q ${x + j()} ${y + h + j()} ${x + j()} ${y + h - rr + j()}`);
  p.push(`L ${x + j()} ${y + h / 2 + j()} L ${x + j()} ${y + rr + j()}`);
  p.push(`Q ${x + j()} ${y + j()} ${tl[0] + j()} ${tl[1] + j()}`);
  p.push('Z');
  return p.join(' ');
}

export function sketchLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  seed: number,
  amp = 1.2,
): string {
  const rnd = mulberry32(seed * 104729 + 7);
  const j = () => (rnd() - 0.5) * 2 * amp;
  const mx = (x1 + x2) / 2 + j();
  const my = (y1 + y2) / 2 + j();
  return `M ${x1 + j()} ${y1 + j()} Q ${mx} ${my} ${x2 + j()} ${y2 + j()}`;
}

export function sketchCircle(cx: number, cy: number, r: number, seed: number, amp = 0.8): string {
  const rnd = mulberry32(seed * 15485863 + 3);
  const j = () => (rnd() - 0.5) * 2 * amp;
  const k = r * 0.5523;
  return [
    `M ${cx + r + j()} ${cy + j()}`,
    `C ${cx + r + j()} ${cy + k + j()} ${cx + k + j()} ${cy + r + j()} ${cx + j()} ${cy + r + j()}`,
    `C ${cx - k + j()} ${cy + r + j()} ${cx - r + j()} ${cy + k + j()} ${cx - r + j()} ${cy + j()}`,
    `C ${cx - r + j()} ${cy - k + j()} ${cx - k + j()} ${cy - r + j()} ${cx + j()} ${cy - r + j()}`,
    `C ${cx + k + j()} ${cy - r + j()} ${cx + r + j()} ${cy - k + j()} ${cx + r + j()} ${cy + j()}`,
    'Z',
  ].join(' ');
}

export const boilSeed = (frame: number, base = 0) => base + Math.floor(frame / 7);