import React from 'react';
import {INK, sketchRect} from '../lib/sketch';

export type Eyes = 'dot' | 'happy' | 'narrow' | 'spiral' | 'wink';
export type Shades = 'none' | 'on' | 'head';

export interface RobotProps {
  x: number;
  y: number; // body center
  scale?: number;
  seed: number;
  eyes?: Eyes;
  shades?: Shades;
  blush?: boolean;
  arm?: {tx: number; ty: number; hold?: 'glove' | 'pencil' | 'none'} | null;
  armsUp?: boolean;
  walk?: number; // 0..1 phase, animates legs
  squash?: number; // 1 = normal, <1 squashed
  wave?: number; // right arm wave angle deg
}

const RED = '#c8524a';
const RED_D = '#8a352c';

export const Robot: React.FC<RobotProps> = ({
  x, y, scale = 1, seed, eyes = 'dot', shades = 'none', blush = false,
  arm = null, armsUp = false, walk = 0, squash = 1, wave = 0,
}) => {
  const legSwing = Math.sin(walk * Math.PI * 2) * 4;
  const ax = arm ? (arm.tx - x) / scale : 0;
  const ay = arm ? (arm.ty - y) / scale : 0;
  const eyeEl = (cx: number) => {
    switch (eyes) {
      case 'happy':
        return <path d={`M ${cx - 6} -2 q 6 -8 12 0`} stroke={INK} strokeWidth={2.6} fill="none" strokeLinecap="round" />;
      case 'narrow':
        return <path d={`M ${cx - 6} -4 h 12`} stroke={INK} strokeWidth={2.8} strokeLinecap="round" />;
      case 'spiral':
        return <path d={`M ${cx} -4 m -5 0 a 5 5 0 1 1 5 5 a 3 3 0 1 1 -3 -3 a 1.4 1.4 0 1 0 1.4 1.4`} stroke={INK} strokeWidth={1.8} fill="none" />;
      case 'wink':
        return cx < 0 ? <ellipse cx={cx} cy={-4} rx={3} ry={4.4} fill={INK} /> : <path d={`M ${cx - 6} -2 q 6 -8 12 0`} stroke={INK} strokeWidth={2.6} fill="none" strokeLinecap="round" />;
      default:
        return <ellipse cx={cx} cy={-4} rx={3} ry={4.6} fill={INK} />;
    }
  };
  const diamond = (cx: number) => (
    <path d={`M ${cx} -10 l 4.5 6 l -4.5 6 l -4.5 -6 Z`} fill="#f7d648" stroke={RED_D} strokeWidth={1} />
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${scale} ${scale * squash})`}>
      {/* stretchy arm (drawn under body) */}
      {arm && (
        <g>
          <path d={`M 20 4 Q ${(20 + ax) / 2} ${(4 + ay) / 2 + 6} ${ax} ${ay}`} stroke={INK} strokeWidth={12} fill="none" strokeLinecap="round" />
          <path d={`M 20 4 Q ${(20 + ax) / 2} ${(4 + ay) / 2 + 6} ${ax} ${ay}`} stroke={RED} strokeWidth={8} fill="none" strokeLinecap="round" />
          {arm.hold === 'pencil' ? (
            <g transform={`translate(${ax} ${ay}) rotate(${(Math.atan2(ay - 4, ax - 20) * 180) / Math.PI + 180})`}>
              <rect x={-4} y={-4} width={26} height={8} rx={2} fill="#f2b53a" stroke={INK} strokeWidth={1.8} />
              <path d="M 22 -4 L 32 0 L 22 4 Z" fill="#f7e3b0" stroke={INK} strokeWidth={1.6} />
              <path d="M 29 -1.4 L 32 0 L 29 1.4 Z" fill={INK} />
              <rect x={-8} y={-4} width={5} height={8} fill="#e88a9a" stroke={INK} strokeWidth={1.4} />
            </g>
          ) : arm.hold === 'none' ? null : (
            <circle cx={ax} cy={ay} r={6.5} fill="#fffdf6" stroke={INK} strokeWidth={2} />
          )}
        </g>
      )}
      {/* raised arms */}
      {armsUp && (
        <g>
          <path d="M -24 -8 L -36 -34" stroke={INK} strokeWidth={11} strokeLinecap="round" />
          <path d="M -24 -8 L -36 -34" stroke={RED} strokeWidth={7} strokeLinecap="round" />
          <path d="M 24 -8 L 36 -34" stroke={INK} strokeWidth={11} strokeLinecap="round" />
          <path d="M 24 -8 L 36 -34" stroke={RED} strokeWidth={7} strokeLinecap="round" />
          <circle cx={-37} cy={-36} r={6} fill="#fffdf6" stroke={INK} strokeWidth={2} />
          <circle cx={37} cy={-36} r={6} fill="#fffdf6" stroke={INK} strokeWidth={2} />
        </g>
      )}
      {/* waving arm */}
      {wave !== 0 && (
        <g transform={`rotate(${wave} 26 -6)`}>
          <path d="M 26 -6 L 44 -26" stroke={INK} strokeWidth={11} strokeLinecap="round" />
          <path d="M 26 -6 L 44 -26" stroke={RED} strokeWidth={7} strokeLinecap="round" />
          <circle cx={45} cy={-28} r={6} fill={RED} stroke={INK} strokeWidth={2} />
        </g>
      )}
      {/* legs */}
      <g>
        <rect x={-20 + legSwing} y={24} width={10} height={15} rx={2} fill={RED} stroke={INK} strokeWidth={2} />
        <rect x={8 - legSwing} y={24} width={10} height={15} rx={2} fill={RED} stroke={INK} strokeWidth={2} />
      </g>
      {/* side nubs */}
      <rect x={-39} y={-4} width={7} height={10} rx={2} fill={RED} stroke={INK} strokeWidth={2} />
      <rect x={32} y={-4} width={7} height={10} rx={2} fill={RED} stroke={INK} strokeWidth={2} />
      {/* body */}
      <path d={sketchRect(-33, -26, 66, 52, 7, seed, 1.1)} fill={RED} stroke={INK} strokeWidth={2.6} />
      {/* face */}
      {eyes === 'dot' ? (
        <g>{diamond(-12)}{diamond(12)}</g>
      ) : (
        <g>{eyeEl(-12)}{eyeEl(12)}</g>
      )}
      {blush && (
        <g fill="#e88a9a" opacity={0.8}>
          <ellipse cx={-20} cy={6} rx={6} ry={3.6} />
          <ellipse cx={20} cy={6} rx={6} ry={3.6} />
        </g>
      )}
      {/* sunglasses */}
      {shades === 'on' && (
        <g transform="translate(0 -6)">
          <path d="M -26 -2 H 26" stroke={INK} strokeWidth={3} />
          <rect x={-24} y={-4} width={19} height={11} rx={3} fill={INK} />
          <rect x={5} y={-4} width={19} height={11} rx={3} fill={INK} />
          <path d="M -20 -1 l 6 4 M 9 -1 l 6 4" stroke="#fff" strokeWidth={1.6} opacity={0.7} />
        </g>
      )}
      {shades === 'head' && (
        <g transform="translate(2 -28) rotate(-6)">
          <rect x={-22} y={-6} width={18} height={9} rx={3} fill={INK} />
          <rect x={4} y={-6} width={18} height={9} rx={3} fill={INK} />
          <path d="M -4 -3 H 4" stroke={INK} strokeWidth={2.4} />
          <path d="M -18 -4 l 5 3 M 8 -4 l 5 3" stroke="#fff" strokeWidth={1.4} opacity={0.7} />
        </g>
      )}
    </g>
  );
};

export const Dust: React.FC<{x: number; y: number; s?: number; o?: number}> = ({x, y, s = 1, o = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o} fill="#fffdf6" stroke={INK} strokeWidth={1.6}>
    <circle cx={-12} cy={0} r={8} />
    <circle cx={0} cy={-5} r={10} />
    <circle cx={12} cy={0} r={8} />
    <circle cx={0} cy={3} r={9} />
  </g>
);