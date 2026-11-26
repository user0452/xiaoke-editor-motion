import React from 'react';
import {INK, sketchRect, sketchLine, mulberry32, boilSeed} from '../lib/sketch';
import {seg, pop, easeOut, lerp} from '../lib/anim';

const HAND: React.CSSProperties = {fontFamily: 'var(--font-hand)'};

/* big onomatopoeia sticker */
export const SfxText: React.FC<{
  t: number; t0: number; t1: number; x: number; y: number; size: number;
  fill: string; text: string; rot?: number; frame: number;
}> = ({t, t0, t1, x, y, size, fill, text, rot = -4, frame}) => {
  if (t < t0 || t > t1) return null;
  const ap = pop(seg(t, t0, t0 + 0.22));
  const out = 1 - seg(t, t1 - 0.18, t1);
  const shake = Math.sin(t * 40) * 1.2 * (1 - seg(t, t0, t0 + 0.4));
  return (
    <g transform={`translate(${x + shake} ${y}) rotate(${rot}) scale(${ap})`} opacity={out}>
      <text fontSize={size} fill={fill} textAnchor="middle" style={{...HAND, fontWeight: 700}} stroke={INK} strokeWidth={size * 0.16} paintOrder="stroke" strokeLinejoin="round">{text}</text>
      <path d={`M ${-size * text.length * 0.55} ${-size * 0.9} l -10 -8 M ${size * text.length * 0.55} ${-size * 0.9} l 10 -8`} stroke={INK} strokeWidth={2.4} strokeLinecap="round" opacity={0.8} />
    </g>
  );
};

/* speech bubble, tail points down-left toward (tx,ty) */
export const Bubble: React.FC<{t: number; t0: number; t1: number; x: number; y: number; w: number; text: string; tx?: number; ty?: number; frame: number; size?: number}> = ({t, t0, t1, x, y, w, text, tx, ty, frame, size = 16}) => {
  if (t < t0 || t > t1) return null;
  const ap = pop(seg(t, t0, t0 + 0.18));
  const out = 1 - seg(t, t1 - 0.15, t1);
  const h = size + 22;
  const s = boilSeed(frame, 61);
  return (
    <g transform={`translate(${x + w / 2} ${y + h / 2}) scale(${ap}) translate(${-(x + w / 2)} ${-(y + h / 2)})`} opacity={out}>
      <path d={sketchRect(x, y, w, h, 10, s, 0.9)} fill="#fffdf6" stroke={INK} strokeWidth={2} />
      <path d={`M ${x + w * 0.3} ${y + h - 1} L ${(tx ?? x + w * 0.25)} ${(ty ?? y + h + 16)} L ${x + w * 0.45} ${y + h - 1}`} fill="#fffdf6" stroke={INK} strokeWidth={2} />
      <text x={x + w / 2} y={y + h / 2 + size * 0.36} fontSize={size} textAnchor="middle" fill={INK} style={HAND}>{text}</text>
    </g>
  );
};

/* green correction stamp */
export const Stamp: React.FC<{t: number; t0: number; t1: number; frame: number; x: number; y: number}> = ({t, t0, t1, frame, x, y}) => {
  if (t < t0 || t > t1) return null;
  const p = seg(t, t0, t0 + 0.3);
  const sc = lerp(2.2, 1, easeOut(p));
  const out = 1 - seg(t, t1 - 0.3, t1);
  const s = boilSeed(frame, 71);
  return (
    <g transform={`translate(${x} ${y}) rotate(-8) scale(${sc})`} opacity={Math.min(1, p * 2) * out}>
      <path d={sketchRect(-86, -34, 172, 68, 6, s, 1.4)} fill="none" stroke="#4a9e5c" strokeWidth={3.4} />
      <path d={sketchRect(-78, -26, 156, 52, 4, s + 1, 1)} fill="none" stroke="#4a9e5c" strokeWidth={1.8} strokeDasharray="10 4" />
      <text fontSize={34} fill="#4a9e5c" textAnchor="middle" y={12} style={{...HAND, fontWeight: 700}}>已修正</text>
    </g>
  );
};

/* Ctrl+Z keycap */
export const Keycap: React.FC<{t: number; t0: number; t1: number; x: number; y: number; frame: number}> = ({t, t0, t1, x, y, frame}) => {
  if (t < t0 || t > t1) return null;
  const ap = pop(seg(t, t0, t0 + 0.2));
  const press = Math.sin(seg(t, t0 + 0.2, t0 + 0.6) * Math.PI) * 6;
  const out = 1 - seg(t, t1 - 0.25, t1);
  const s = boilSeed(frame, 81);
  return (
    <g transform={`translate(${x} ${y + press}) scale(${ap})`} opacity={out}>
      <path d={sketchRect(-110, -30, 220, 78, 12, s, 1.2)} fill="#b8b2a6" stroke={INK} strokeWidth={2.4} />
      <path d={sketchRect(-104, -40, 208, 74, 10, s + 1, 1)} fill="#fffdf6" stroke={INK} strokeWidth={2.4} />
      <text fontSize={38} fill={INK} textAnchor="middle" y={10} style={{fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 700}}>Ctrl+Z</text>
    </g>
  );
};

/* trash can */
export const Trash: React.FC<{t: number; t0: number; t1: number; x: number; y: number; frame: number}> = ({t, t0, t1, x, y, frame}) => {
  if (t < t0 || t > t1) return null;
  const rise = easeOut(seg(t, t0, t0 + 0.25));
  const out = 1 - seg(t, t1 - 0.25, t1);
  const shake = t > 7.7 && t < 8.1 ? Math.sin(t * 60) * 3 : 0;
  const lidOpen = t < 7.9 ? 55 : 55 * (1 - seg(t, 7.9, 8.15));
  const s = boilSeed(frame, 91);
  return (
    <g transform={`translate(${x + shake} ${y + (1 - rise) * 120})`} opacity={out * rise}>
      <g transform={`translate(28 -52) rotate(${-lidOpen})`}>
        <ellipse cx={0} cy={0} rx={34} ry={8} fill="#c8c2b6" stroke={INK} strokeWidth={2.2} />
        <rect x={-6} y={-10} width={12} height={8} rx={3} fill="#c8c2b6" stroke={INK} strokeWidth={2} />
      </g>
      <path d="M -32 -48 L -26 40 L 26 40 L 32 -48 Z" fill="#c8c2b6" stroke={INK} strokeWidth={2.4} />
      <ellipse cx={0} cy={-48} rx={32} ry={8} fill="#8a857c" stroke={INK} strokeWidth={2.2} />
      {[-18, -9, 0, 9, 18].map((xx) => (
        <path key={xx} d={`M ${xx} -38 L ${xx * 0.82} 34`} stroke="#8a857c" strokeWidth={2.4} />
      ))}
    </g>
  );
};

/* icon flying along a dotted arc */
export const FlyingIcon: React.FC<{t: number; t0: number; t1: number; from: [number, number]; to: [number, number]; kind: 'swirl' | 'page'}> = ({t, t0, t1, from, to, kind}) => {
  if (t < t0 || t > t1 + 0.1) return null;
  const p = easeOut(seg(t, t0, t1));
  const mx = (from[0] + to[0]) / 2 + 60;
  const my = Math.min(from[1], to[1]) - 90;
  const x = (1 - p) * (1 - p) * from[0] + 2 * (1 - p) * p * mx + p * p * to[0];
  const y = (1 - p) * (1 - p) * from[1] + 2 * (1 - p) * p * my + p * p * to[1];
  return (
    <g>
      <path d={`M ${from[0]} ${from[1]} Q ${mx} ${my} ${x} ${y}`} stroke="#a89f92" strokeWidth={2} strokeDasharray="2 7" fill="none" />
      <g transform={`translate(${x} ${y}) rotate(${p * 200})`}>
        <circle r={15} fill="#fffdf6" stroke={INK} strokeWidth={2} />
        {kind === 'swirl' ? (
          <path d="M 0 0 m 0 -8 a 8 8 0 1 1 -8 8 a 5.5 5.5 0 1 0 5.5 -5.5 a 3 3 0 1 1 -3 3" stroke="#4a9e8f" strokeWidth={2.6} fill="none" strokeLinecap="round" />
        ) : (
          <g stroke={INK} strokeWidth={1.6} fill="#fffdf6">
            <rect x={-6} y={-8} width={12} height={16} rx={1.5} />
            <path d="M -3 -4 h 6 M -3 0 h 6 M -3 4 h 4" strokeWidth={1.2} />
          </g>
        )}
      </g>
    </g>
  );
};

/* confetti field */
export const Confetti: React.FC<{t: number; t0: number; seed: number; n?: number; burst?: [number, number]}> = ({t, t0, seed, n = 40, burst}) => {
  if (t < t0) return null;
  const rnd = mulberry32(seed);
  const cols = ['#f2b53a', '#e86a8a', '#6fc7c2', '#8f7bd8', '#7fd67f', '#e05252'];
  const age = t - t0;
  return (
    <g>
      {Array.from({length: n}, (_, i) => {
        const a = rnd() * Math.PI * 2;
        const v = 60 + rnd() * 160;
        const bx = burst ? burst[0] : rnd() * 1280;
        const by = burst ? burst[1] : -20;
        const x = burst ? bx + Math.cos(a) * v * age * 0.6 : bx + Math.sin(age * 2 + i) * 24;
        const y = burst ? by + Math.sin(a) * v * age * 0.6 + 120 * age * age : by + age * (40 + rnd() * 60);
        const rot = age * (120 + rnd() * 240) + i * 30;
        const o = burst ? Math.max(0, 1 - age / 1.6) : 0.85;
        if (y > 740 || o <= 0) return null;
        return <rect key={i} x={-4} y={-2.5} width={8} height={5} fill={cols[i % cols.length]} transform={`translate(${x} ${y}) rotate(${rot})`} opacity={o} />;
      })}
    </g>
  );
};