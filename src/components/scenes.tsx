import React from 'react';
import {INK, sketchCircle, sketchLine, sketchRect, mulberry32} from '../lib/sketch';

// All scenes are drawn in a 184 x 286 local space (the phone screen).
export const SCENE_W = 184;
export const SCENE_H = 286;

const Sparkle: React.FC<{x: number; y: number; s: number; c?: string; o?: number}> = ({x, y, s, c = '#fff', o = 1}) => (
  <path d={`M ${x} ${y - s} Q ${x + s * 0.18} ${y - s * 0.18} ${x + s} ${y} Q ${x + s * 0.18} ${y + s * 0.18} ${x} ${y + s} Q ${x - s * 0.18} ${y + s * 0.18} ${x - s} ${y} Q ${x - s * 0.18} ${y - s * 0.18} ${x} ${y - s} Z`} fill={c} opacity={o} />
);

export const NightCity: React.FC<{t: number; seed: number; sleepy?: boolean}> = ({t, seed, sleepy}) => {
  const rnd = mulberry32(seed + 5);
  const stars = Array.from({length: 16}, () => ({x: rnd() * 184, y: rnd() * 120, r: 0.8 + rnd() * 1.2, p: rnd() * 6}));
  const back = [
    [0, 150, 26, 136], [24, 132, 22, 154], [44, 158, 26, 128], [68, 120, 24, 166], [90, 146, 22, 140],
    [110, 128, 26, 158], [134, 152, 22, 134], [154, 136, 30, 150],
  ];
  const front = [
    [-4, 176, 30, 110], [26, 190, 26, 96], [50, 170, 30, 116], [78, 196, 26, 90], [102, 178, 30, 108],
    [130, 192, 26, 94], [154, 174, 34, 112],
  ];
  const win = (bx: number, by: number, bw: number, bh: number, s: number, dim = false) => {
    const r2 = mulberry32(s);
    const out: React.ReactNode[] = [];
    for (let yy = by + 8; yy < by + bh - 6; yy += 12) {
      for (let xx = bx + 5; xx < bx + bw - 6; xx += 9) {
        if (r2() > 0.55) out.push(<rect key={`${xx}-${yy}`} x={xx} y={yy} width={4} height={5} fill="#f7d648" opacity={dim ? 0.75 : 0.95} />);
      }
    }
    return out;
  };
  const tw = 0.6 + 0.4 * Math.sin(t * 2.2);
  return (
    <g>
      <defs>
        <linearGradient id={`night-sky-${seed}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#33376e" />
          <stop offset="0.6" stopColor="#4b4f96" />
          <stop offset="1" stopColor="#6a6cb8" />
        </linearGradient>
      </defs>
      <rect width={184} height={286} fill={`url(#night-sky-${seed})`} />
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={0.35 + 0.55 * Math.abs(Math.sin(t * 1.5 + s.p))} />
      ))}
      <Sparkle x={40} y={92} s={5} o={tw} />
      <Sparkle x={126} y={120} s={4} o={1 - tw * 0.5} />
      {/* moon */}
      <g transform="translate(138 62)">
        <path d="M 6 -22 A 22 22 0 1 0 6 22 A 17 17 0 1 1 6 -22 Z" fill="#f7d648" stroke={INK} strokeWidth={2} />
        {sleepy && (
          <g stroke={INK} strokeWidth={1.6} fill="none" strokeLinecap="round">
            <path d="M -8 -2 q 3 3 6 0" />
            <path d="M -10 8 q 4 4 8 0" />
          </g>
        )}
      </g>
      {back.map((b, i) => (
        <g key={i}>
          <rect x={b[0]} y={b[1]} width={b[2]} height={b[3]} fill="#3a3e7c" stroke="#2c3060" strokeWidth={1.5} />
          {win(b[0], b[1], b[2], b[3], seed + i * 31, true)}
        </g>
      ))}
      {front.map((b, i) => (
        <g key={i}>
          <rect x={b[0]} y={b[1]} width={b[2]} height={b[3]} fill="#2c3060" stroke="#232750" strokeWidth={1.5} />
          {win(b[0], b[1], b[2], b[3], seed + 100 + i * 17)}
        </g>
      ))}
      {/* shooting star for the outro */}
      {sleepy && <path d="M 30 26 L 78 60" stroke="#fff" strokeWidth={2} strokeLinecap="round" opacity={0.8} />}
    </g>
  );
};

export const Ramen: React.FC<{t: number; seed: number; banner?: boolean}> = ({t, seed, banner = true}) => {
  const steam = (x: number, ph: number) => {
    const dy = (t * 14 + ph) % 26;
    return <path d={`M ${x} ${118 - dy} q 4 -6 0 -12 q -4 -6 0 -12`} stroke="#fff" strokeWidth={2.4} fill="none" opacity={0.7 * (1 - dy / 26)} strokeLinecap="round" />;
  };
  return (
    <g>
      <rect width={184} height={286} fill="#f7e3b0" />
      <rect y={226} width={184} height={60} fill="#d9a05b" />
      <path d={sketchLine(0, 226, 184, 226, seed + 1, 1)} stroke={INK} strokeWidth={2} fill="none" />
      {banner && (
        <g>
          <rect x={0} y={0} width={184} height={44} fill="#3b4a8f" stroke={INK} strokeWidth={2} />
          <path d="M 61 0 V 44 M 122 0 V 44" stroke={INK} strokeWidth={2} />
          <circle cx={30} cy={24} r={5} fill="#fff" />
          <circle cx={153} cy={24} r={5} fill="#fff" />
          <text x={76} y={32} fontSize={24} fill="#fff" textAnchor="middle" style={{fontFamily: 'var(--font-hand)'}}>拉</text>
          <text x={107} y={32} fontSize={24} fill="#fff" textAnchor="middle" style={{fontFamily: 'var(--font-hand)'}}>面</text>
        </g>
      )}
      {steam(78, 0)}
      {steam(96, 12)}
      {/* chopsticks + lifted noodles */}
      <g>
        <path d="M 176 34 L 108 96 M 182 44 L 114 100" stroke="#8a5a2b" strokeWidth={4} strokeLinecap="round" />
        <path d="M 108 96 q -2 22 2 40 M 112 98 q 0 22 3 38 M 116 100 q 2 20 4 36" stroke="#f2d8a0" strokeWidth={3} fill="none" strokeLinecap="round" />
      </g>
      {/* bowl */}
      <g transform="translate(92 190)">
        <path d="M -62 -18 Q -60 34 0 38 Q 60 34 62 -18 Z" fill="#fffdf6" stroke={INK} strokeWidth={2.5} />
        <path d="M -58 -6 Q 0 6 58 -6" stroke="#d94f4f" strokeWidth={2} fill="none" />
        <path d="M -56 4 Q 0 16 56 4" stroke="#d94f4f" strokeWidth={2} fill="none" />
        {/* greek key band */}
        {Array.from({length: 9}, (_, i) => (
          <path key={i} d={`M ${-52 + i * 12} -2 h 8 v 6 h -5 v -3`} stroke="#d94f4f" strokeWidth={1.6} fill="none" />
        ))}
        <rect x={-16} y={38} width={32} height={7} fill="#fffdf6" stroke={INK} strokeWidth={2} />
        <ellipse cx={0} cy={-18} rx={62} ry={14} fill="#e8b04b" stroke={INK} strokeWidth={2.5} />
        <ellipse cx={0} cy={-20} rx={54} ry={10} fill="#f2d8a0" />
        {/* toppings */}
        <ellipse cx={-26} cy={-22} rx={12} ry={7} fill="#fff" stroke={INK} strokeWidth={1.6} />
        <ellipse cx={-26} cy={-22} rx={6} ry={3.6} fill="#f2b53a" />
        <circle cx={20} cy={-20} r={7} fill="#fff" stroke={INK} strokeWidth={1.6} />
        <path d="M 20 -20 q 4 -3 4 1 q 0 4 -5 3 q -4 -1 -2 -5" stroke="#e86a8a" strokeWidth={1.6} fill="none" />
        <rect x={2} y={-34} width={16} height={14} fill="#2f4f3f" stroke={INK} strokeWidth={1.6} transform="rotate(-8 10 -27)" />
        <ellipse cx={-6} cy={-16} rx={9} ry={4.5} fill="#e88a9a" stroke={INK} strokeWidth={1.4} />
        <path d="M -40 -24 q 10 -6 20 0 M -14 -26 q 10 -6 20 0" stroke="#e8c98a" strokeWidth={2.4} fill="none" />
      </g>
    </g>
  );
};

export const Shiba: React.FC<{t: number; seed: number; mood?: 'happy' | 'calm'; hearts?: number}> = ({t, seed, mood = 'happy', hearts = 1}) => {
  const bob = Math.sin(t * 2.4) * 2;
  const wave = Math.sin(t * 3) * 8;
  return (
    <g>
      <rect width={184} height={286} fill="#cdeee2" />
      {Array.from({length: 24}, (_, i) => {
        const r2 = mulberry32(seed + i);
        return <circle key={i} cx={r2() * 184} cy={r2() * 286} r={1.4} fill="#fff" opacity={0.5} />;
      })}
      <g transform={`translate(92 ${170 + bob})`}>
        {/* body */}
        <path d="M -44 10 Q -46 96 0 98 Q 46 96 44 10 Z" fill="#d98d4f" stroke={INK} strokeWidth={2.5} />
        <ellipse cx={0} cy={58} rx={26} ry={34} fill="#fffdf6" />
        {/* waving paw */}
        <g transform={`rotate(${wave} 44 16)`}>
          <path d="M 40 18 q 18 -6 20 -22 q 10 4 6 20 q -4 14 -22 12 Z" fill="#d98d4f" stroke={INK} strokeWidth={2.2} />
        </g>
        {/* collar */}
        <path d="M -34 6 Q 0 20 34 6" stroke="#c94040" strokeWidth={7} fill="none" strokeLinecap="round" />
        <circle cx={0} cy={16} r={5} fill="#f2b53a" stroke={INK} strokeWidth={1.6} />
        {/* head */}
        <g transform="translate(0 -34)">
          <path d="M -40 -18 L -50 -52 L -18 -38 Z" fill="#d98d4f" stroke={INK} strokeWidth={2.4} />
          <path d="M 40 -18 L 50 -52 L 18 -38 Z" fill="#d98d4f" stroke={INK} strokeWidth={2.4} />
          <path d="M -40 -24 L -45 -44 L -26 -35 Z" fill="#e8a0b0" />
          <path d="M 40 -24 L 45 -44 L 26 -35 Z" fill="#e8a0b0" />
          <ellipse cx={0} cy={0} rx={46} ry={40} fill="#d98d4f" stroke={INK} strokeWidth={2.5} />
          <path d="M -46 6 Q -30 34 0 34 Q 30 34 46 6 Q 30 20 0 20 Q -30 20 -46 6 Z" fill="#fffdf6" />
          <ellipse cx={-24} cy={12} rx={13} ry={10} fill="#fffdf6" />
          <ellipse cx={24} cy={12} rx={13} ry={10} fill="#fffdf6" />
          <circle cx={-16} cy={-22} r={3.4} fill="#fffdf6" />
          <circle cx={16} cy={-22} r={3.4} fill="#fffdf6" />
          {mood === 'happy' ? (
            <g stroke={INK} strokeWidth={2.6} fill="none" strokeLinecap="round">
              <path d="M -24 -6 q 6 -7 12 0" />
              <path d="M 12 -6 q 6 -7 12 0" />
            </g>
          ) : (
            <g fill={INK}>
              <circle cx={-18} cy={-6} r={3.4} />
              <circle cx={18} cy={-6} r={3.4} />
            </g>
          )}
          <ellipse cx={-32} cy={6} rx={7} ry={4.5} fill="#f2b0c0" opacity={0.85} />
          <ellipse cx={32} cy={6} rx={7} ry={4.5} fill="#f2b0c0" opacity={0.85} />
          <path d="M -4 6 q 4 3 8 0" stroke={INK} strokeWidth={2.2} fill="none" strokeLinecap="round" />
          <ellipse cx={0} cy={4} rx={4.5} ry={3.4} fill={INK} />
          <path d="M 0 8 q 0 6 -6 7 M 0 8 q 0 6 6 7" stroke={INK} strokeWidth={2} fill="none" strokeLinecap="round" />
        </g>
      </g>
      {Array.from({length: hearts}, (_, i) => {
        const hx = 132 - i * 84;
        const hy = 62 + i * 26 + Math.sin(t * 2 + i * 2) * 5;
        return (
          <path key={i} d={`M ${hx} ${hy + 6} C ${hx - 9} ${hy - 4} ${hx - 4} ${hy - 11} ${hx} ${hy - 5} C ${hx + 4} ${hy - 11} ${hx + 9} ${hy - 4} ${hx} ${hy + 6} Z`} fill="#e86a8a" stroke={INK} strokeWidth={1.6} transform={`rotate(${i * 14 - 8} ${hx} ${hy})`} />
        );
      })}
    </g>
  );
};

export const Disco: React.FC<{t: number; seed: number; hype?: number}> = ({t, seed, hype = 0}) => {
  const beat = Math.abs(Math.sin(t * Math.PI * 1.87));
  const bounce = beat * (6 + hype * 5);
  const sway = Math.sin(t * Math.PI * 1.87) * (4 + hype * 4);
  const floorShift = (t * 30) % 24;
  const skyTop = hype > 0.5 ? '#c93bd4' : '#7f6cc9';
  const skyBot = hype > 0.5 ? '#e86ad4' : '#c9a0e8';
  const tiles = ['#3b4a8f', '#6fc7c2', '#e8c94f', '#e86a8a', '#5a5fa8', '#8fd4e8'];
  return (
    <g>
      <defs>
        <linearGradient id={`disco-sky-${seed}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={skyTop} />
          <stop offset="1" stopColor={skyBot} />
        </linearGradient>
      </defs>
      <rect width={184} height={170} fill={`url(#disco-sky-${seed})`} />
      {/* light rays */}
      <g opacity={0.35}>
        <path d="M 92 40 L 20 170 L 52 170 Z" fill="#fff" />
        <path d="M 92 40 L 132 170 L 164 170 Z" fill="#fff" />
        <path d="M 92 40 L 76 170 L 108 170 Z" fill="#ffe89a" />
      </g>
      {/* mirror ball */}
      <g transform="translate(92 40)">
        <path d="M 0 -40 V -22" stroke={INK} strokeWidth={2} />
        <circle r={20} fill="#d8d8e8" stroke={INK} strokeWidth={2} />
        {[-12, -4, 4, 12].map((yy) => (
          <path key={yy} d={`M ${-Math.sqrt(400 - yy * yy)} ${yy} H ${Math.sqrt(400 - yy * yy)}`} stroke="#a8a8c8" strokeWidth={1.2} />
        ))}
        {[-10, 0, 10].map((xx) => (
          <path key={xx} d={`M ${xx} -18 V 18`} stroke="#a8a8c8" strokeWidth={1.2} />
        ))}
        <rect x={-6} y={-4} width={7} height={6} fill="#f7d648" opacity={0.9} />
        <rect x={4} y={6} width={6} height={5} fill="#fff" opacity={0.9} />
      </g>
      {/* bokeh */}
      {Array.from({length: 7}, (_, i) => {
        const r2 = mulberry32(seed + 40 + i);
        return <circle key={i} cx={r2() * 184} cy={60 + r2() * 100} r={4 + r2() * 6} fill={['#8fd4e8', '#e8a0d4', '#f7e3a0'][i % 3]} opacity={0.35} />;
      })}
      {/* floor */}
      <rect y={170} width={184} height={116} fill="#2c3060" />
      {Array.from({length: 6}, (_, row) => {
        const y0 = 170 + row * 20 + (row > 0 ? floorShift * (row / 6) : 0);
        const h = 14 + row * 3;
        const spread0 = 30 + row * 26;
        const spread1 = 30 + (row + 1) * 26;
        return Array.from({length: 8}, (_, col) => {
          const c = tiles[(col + row) % tiles.length];
          const x0a = 92 - spread0 + (col * spread0 * 2) / 8;
          const x0b = 92 - spread0 + ((col + 1) * spread0 * 2) / 8;
          const x1a = 92 - spread1 + (col * spread1 * 2) / 8;
          const x1b = 92 - spread1 + ((col + 1) * spread1 * 2) / 8;
          return <path key={`${row}-${col}`} d={`M ${x0a} ${y0} L ${x0b} ${y0} L ${x1b} ${y0 + h} L ${x1a} ${y0 + h} Z`} fill={c} opacity={0.9} />;
        });
      })}
      {/* dancing robot */}
      <g transform={`translate(${92 + sway} ${176 - bounce}) rotate(${sway * 0.6})`}>
        <path d="M -26 -6 L -38 -34" stroke="#c8524a" strokeWidth={7} strokeLinecap="round" />
        <path d="M 26 -6 L 38 -34" stroke="#c8524a" strokeWidth={7} strokeLinecap="round" />
        <circle cx={-39} cy={-36} r={5} fill="#c8524a" stroke={INK} strokeWidth={1.6} />
        <circle cx={39} cy={-36} r={5} fill="#c8524a" stroke={INK} strokeWidth={1.6} />
        <rect x={-14} y={26} width={9} height={14} fill="#c8524a" stroke={INK} strokeWidth={1.6} />
        <rect x={5} y={26} width={9} height={14} fill="#c8524a" stroke={INK} strokeWidth={1.6} />
        <path d={sketchRect(-30, -24, 60, 52, 6, seed + 9, 1)} fill="#c8524a" stroke={INK} strokeWidth={2.4} />
        <path d="M -14 -6 l 4 -5 l 4 5 l -4 5 Z" fill="#f7d648" />
        <path d="M 6 -6 l 4 -5 l 4 5 l -4 5 Z" fill="#f7d648" />
        <path d="M -6 8 q 6 5 12 0" stroke={INK} strokeWidth={2} fill="none" strokeLinecap="round" />
      </g>
      <Sparkle x={36} y={120} s={6} c="#fff" o={0.5 + beat * 0.5} />
      <Sparkle x={150} y={96} s={5} c="#f7d648" o={1 - beat * 0.5} />
      <Sparkle x={120} y={210} s={5} c="#fff" o={0.4 + beat * 0.6} />
      <Sparkle x={52} y={236} s={4} c="#f7d648" o={0.8 - beat * 0.4} />
    </g>
  );
};

// Blurred "focusing" version of the ramen shot.
export const FocusBlur: React.FC<{t: number; seed: number}> = ({t, seed}) => (
  <g>
    <g filter={`url(#blur-${seed})`} opacity={0.85}>
      <g style={{filter: 'grayscale(0.9)'}}>
        <Ramen t={t} seed={seed} banner={false} />
      </g>
    </g>
    <defs>
      <filter id={`blur-${seed}`} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="4" />
      </filter>
    </defs>
    <rect width={184} height={286} fill="#9a958c" opacity={0.35} />
    <g stroke="#fff" strokeWidth={3} fill="none" opacity={0.9}>
      <path d="M 20 44 V 24 H 40" />
      <path d="M 144 24 H 164 V 44" />
      <path d="M 164 242 V 262 H 144" />
      <path d="M 40 262 H 20 V 242" />
    </g>
    <g transform="translate(92 120)">
      <circle r={14} fill="none" stroke="#fff" strokeWidth={3} opacity={0.85} strokeDasharray="60 28" transform={`rotate(${t * 160})`} />
    </g>
    <text x={92} y={168} fontSize={20} fill="#fff" textAnchor="middle" style={{fontFamily: 'var(--font-hand)'}} stroke={INK} strokeWidth={0.8} paintOrder="stroke">对焦中...</text>
  </g>
);

export const SCENES = {night: NightCity, ramen: Ramen, shiba: Shiba, disco: Disco} as const;
export type SceneId = keyof typeof SCENES;