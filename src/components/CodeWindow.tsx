import React from 'react';
import {INK, sketchRect, boilSeed} from '../lib/sketch';
import {seg, easeIn} from '../lib/anim';

const HAND: React.CSSProperties = {fontFamily: 'var(--font-hand)'};

type Span = {text: string; color: string};
const LINES: Span[][] = [
  [
    {text: 'const ', color: '#7f6cc9'},
    {text: '剪辑软件', color: '#4a9e8f'},
    {text: ' = ', color: INK},
    {text: '小克', color: '#c8524a'},
    {text: '.写代码()', color: INK},
  ],
  [
    {text: '剪辑软件', color: '#4a9e8f'},
    {text: '.画出(', color: INK},
    {text: '时间轴, 预览, 面板', color: '#f2b53a'},
    {text: ')', color: INK},
  ],
  [
    {text: '小克', color: '#c8524a'},
    {text: '.钻进去()', color: INK},
  ],
];
const WINDOWS: [number, number][] = [[0.05, 0.38], [0.4, 0.66], [0.68, 0.88]];

const TypedLine: React.FC<{spans: Span[]; p: number; y: number; cursor: boolean; t: number}> = ({spans, p, y, cursor, t}) => {
  const total = spans.reduce((a, s) => a + s.text.length, 0);
  let remain = Math.ceil(p * total);
  let x = 376;
  const out: React.ReactNode[] = [];
  spans.forEach((s, i) => {
    const n = Math.max(0, Math.min(s.text.length, remain));
    remain -= n;
    if (n > 0) {
      const piece = s.text.slice(0, n);
      out.push(
        <text key={i} x={x} y={y} fontSize={21} fill={s.color} style={HAND}>{piece}</text>,
      );
      x += piece.length * 21 * ( /[一-鿿]/.test(piece) ? 1 : 0.62);
    }
  });
  if (cursor && Math.floor(t * 4) % 2 === 0) {
    out.push(<rect key="cur" x={x + 2} y={y - 17} width={9} height={21} fill="#c8524a" />);
  }
  return <g>{out}</g>;
};

export const CodeWindow: React.FC<{t: number; frame: number}> = ({t, frame}) => {
  if (t > 1.05) return null;
  const fly = easeIn(seg(t, 0.82, 1.05));
  const s = boilSeed(frame, 101);
  const activeLine = WINDOWS.findIndex(([a, b]) => t >= a && t < b + 0.02);
  return (
    <g transform={`translate(${640 - fly * 210} ${348 - fly * 140}) rotate(${-3 * fly}) scale(${1 - fly * 0.45}) translate(-640 -348)`} opacity={1 - fly}>
      <path d={sketchRect(313, 247, 654, 201, 10, s, 1.2)} fill="#fffdf6" stroke={INK} strokeWidth={2.4} />
      <path d="M 315 285 H 965" stroke={INK} strokeWidth={1.6} opacity={0.6} />
      <rect x={315} y={249} width={650} height={35} fill="#efe9df" opacity={0.7} />
      {[[337, '#e05252'], [353, '#f2b53a'], [369, '#7fd67f']].map(([cx, c], i) => (
        <circle key={i} cx={cx as number} cy={267} r={5} fill={c as string} stroke={INK} strokeWidth={1.5} />
      ))}
      <text x={640} y={272} fontSize={13} fill="#8a8276" textAnchor="middle" style={HAND}>小克.js — 终端</text>
      {[1, 2, 3].map((n, i) => (
        <text key={n} x={344} y={326 + i * 40} fontSize={14} fill="#b8b2a6" textAnchor="middle" style={HAND}>{n}</text>
      ))}
      {LINES.map((spans, i) => {
        const [a, b] = WINDOWS[i];
        const p = seg(t, a, b);
        if (p <= 0) return null;
        return <TypedLine key={i} spans={spans} p={p} y={326 + i * 40} cursor={activeLine === i || (i === 2 && t >= 0.68)} t={t} />;
      })}
      {fly > 0 && (
        <g stroke={INK} strokeWidth={2.4} strokeLinecap="round" opacity={0.8}>
          <path d="M 880 460 l 40 34 M 900 452 l 44 38" />
        </g>
      )}
    </g>
  );
};