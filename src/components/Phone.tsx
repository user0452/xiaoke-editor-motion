import React from 'react';
import {INK} from '../lib/sketch';

export const PHONE_W = 200;
export const PHONE_H = 302;
export const SCREEN_X = 8;
export const SCREEN_Y = 8;
export const SCREEN_W = 184;
export const SCREEN_H = 286;

export const Phone: React.FC<{
  x: number;
  y: number;
  scale?: number;
  children: React.ReactNode;
  controls?: 'play' | 'pause' | 'none';
  seed: number;
}> = ({x, y, scale = 1, children, controls = 'play', seed}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    {/* side buttons */}
    <rect x={-3} y={64} width={4} height={22} rx={2} fill="#1e1a16" />
    <rect x={-3} y={94} width={4} height={34} rx={2} fill="#1e1a16" />
    <rect x={PHONE_W - 1} y={80} width={4} height={40} rx={2} fill="#1e1a16" />
    <rect x={0} y={0} width={PHONE_W} height={PHONE_H} rx={28} fill="#1e1a16" stroke={INK} strokeWidth={2.5} />
    <rect x={2} y={2} width={PHONE_W - 4} height={PHONE_H - 4} rx={26} fill="none" stroke="#4a443c" strokeWidth={1.4} />
    <clipPath id={`screen-clip-${seed}`}>
      <rect x={SCREEN_X} y={SCREEN_Y} width={SCREEN_W} height={SCREEN_H} rx={20} />
    </clipPath>
    <g clipPath={`url(#screen-clip-${seed})`}>
      <rect x={SCREEN_X} y={SCREEN_Y} width={SCREEN_W} height={SCREEN_H} fill="#14110e" />
      <g transform={`translate(${SCREEN_X} ${SCREEN_Y})`}>{children}</g>
    </g>
    {/* notch */}
    <rect x={PHONE_W / 2 - 22} y={12} width={44} height={10} rx={5} fill="#1e1a16" />
    {controls !== 'none' && (
      <g transform={`translate(${PHONE_W / 2} ${PHONE_H + 16})`} stroke={INK} fill="none" strokeWidth={2} strokeLinecap="round">
        <path d="M -34 -6 V 6 M -34 0 L -24 -6 M -34 0 L -24 6" />
        <circle cx={0} cy={0} r={11} fill="#fbf8f2" />
        {controls === 'play' ? (
          <path d="M -3 -5 L 6 0 L -3 5 Z" fill={INK} stroke="none" />
        ) : (
          <path d="M -3.5 -5 V 5 M 3.5 -5 V 5" strokeWidth={2.6} />
        )}
        <path d="M 34 -6 V 6 M 34 0 L 24 -6 M 34 0 L 24 6" />
      </g>
    )}
  </g>
);