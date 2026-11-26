import React from 'react';
import {INK, PANEL, sketchRect, sketchLine, sketchCircle, mulberry32, boilSeed} from '../lib/sketch';
import {seg, pop, easeOut, lerp} from '../lib/anim';
import {T, X0, PPS, clipLayout, playheadSec, sliders, stickerText, exportProgress, gapP} from '../lib/timing';

const HAND: React.CSSProperties = {fontFamily: 'var(--font-hand)'};

const Txt: React.FC<{
  x: number; y: number; size: number; children: React.ReactNode; fill?: string;
  anchor?: 'start' | 'middle' | 'end'; outline?: number; outlineColor?: string; opacity?: number; bold?: boolean;
}> = ({x, y, size, children, fill = INK, anchor = 'start', outline = 0, outlineColor = INK, opacity = 1, bold}) => (
  <text x={x} y={y} fontSize={size} fill={fill} textAnchor={anchor} opacity={opacity}
    style={{...HAND, fontWeight: bold ? 700 : 400}}
    stroke={outline ? outlineColor : 'none'} strokeWidth={outline} paintOrder="stroke" strokeLinejoin="round">
    {children}
  </text>
);

const Panel: React.FC<{x: number; y: number; w: number; h: number; seed: number; appear?: number; r?: number}> = ({x, y, w, h, seed, appear = 1, r = 10}) => (
  <g opacity={appear} transform={appear < 1 ? `translate(${x + w / 2} ${y + h / 2}) scale(${0.9 + 0.1 * appear}) translate(${-(x + w / 2)} ${-(y + h / 2)})` : undefined}>
    <path d={sketchRect(x, y, w, h, r, seed, 1.3)} fill={PANEL} stroke={INK} strokeWidth={2.2} />
  </g>
);

/* ---------------- top bar ---------------- */
export const TopBar: React.FC<{t: number; frame: number}> = ({t, frame}) => {
  const s = boilSeed(frame, 11);
  const prog = exportProgress(t);
  const rendering = prog >= 0 && prog < 100;
  const done = prog >= 100;
  const tc = `00:00:${String(Math.floor(t)).padStart(2, '0')}:${String(Math.floor((t % 1) * 30)).padStart(2, '0')}`;
  return (
    <g>
      <path d={sketchRect(24, 14, 1232, 44, 10, s, 1.2)} fill="#fffdf6" stroke={INK} strokeWidth={2.2} />
      {[[42, '#e05252'], [58, '#f2b53a'], [74, '#7fd67f']].map(([cx, c], i) => (
        <circle key={i} cx={cx as number} cy={36} r={5} fill={c as string} stroke={INK} strokeWidth={1.6} />
      ))}
      {/* tiny robot mascot icon */}
      <g transform="translate(104 36) scale(0.34)">
        <rect x={-30} y={-24} width={60} height={48} rx={7} fill="#c8524a" stroke={INK} strokeWidth={4} />
        <rect x={-18} y={22} width={10} height={12} fill="#c8524a" stroke={INK} strokeWidth={3} />
        <rect x={8} y={22} width={10} height={12} fill="#c8524a" stroke={INK} strokeWidth={3} />
        <path d="M -16 -26 v -8 M -8 -26 v -10 M 0 -26 v -8 M 8 -26 v -10" stroke={INK} strokeWidth={3} />
      </g>
      <Txt x={130} y={42} size={17}>小克剪辑_最终版_打死不改(3).mp4</Txt>
      <rect x={566} y={20} width={148} height={28} rx={7} fill="#2b2620" />
      <Txt x={640} y={40} size={16} fill="#fffdf6" anchor="middle">{tc}</Txt>
      <Txt x={730} y={40} size={12} fill="#a89f92" opacity={0.6 + 0.4 * Math.sin(t * 2)}>· 已自动保存</Txt>
      <path d={sketchRect(990, 22, 62, 26, 7, s + 1, 0.8)} fill={rendering || done ? '#fdf3d0' : '#fffdf6'} stroke={INK} strokeWidth={1.8} />
      <Txt x={1021} y={40} size={13} anchor="middle">1080p</Txt>
      <g>
        <path d={sketchRect(1064, 20, 180, 30, 9, s + 2, 0.9)} fill={done ? '#7fd67f' : rendering ? '#f7d648' : '#7fd6c2'} stroke={INK} strokeWidth={2.2} />
        {rendering && (
          <g clipPath="url(#export-hatch)" opacity={0.25}>
            {Array.from({length: 14}, (_, i) => (
              <path key={i} d={`M ${1064 + i * 16} 52 l 14 -34`} stroke={INK} strokeWidth={4} />
            ))}
          </g>
        )}
        <clipPath id="export-hatch"><rect x={1066} y={22} width={176} height={26} rx={8} /></clipPath>
        {done ? (
          <Txt x={1154} y={41} size={16} fill="#fffdf6" anchor="middle" bold>完成 ✓</Txt>
        ) : rendering ? (
          <Txt x={1154} y={41} size={15} anchor="middle" bold>{`渲染中 ${prog < 99 ? Math.floor(prog) : prog}%`}</Txt>
        ) : (
          <g>
            <path d="M 1110 40 V 30 M 1105 34 L 1110 29 L 1115 34 M 1103 42 H 1117" stroke="#fffdf6" strokeWidth={2.4} fill="none" strokeLinecap="round" />
            <Txt x={1160} y={41} size={16} fill="#fffdf6" anchor="middle" bold>导出</Txt>
          </g>
        )}
      </g>
    </g>
  );
};

/* ---------------- mini clip art ---------------- */
const MiniNight: React.FC<{w: number; h: number; seed: number}> = ({w, h, seed}) => {
  const rnd = mulberry32(seed);
  return (
    <g>
      <rect width={w} height={h} fill="#2c3060" />
      <path d={`M ${w * 0.62} ${h * 0.28} a ${h * 0.16} ${h * 0.16} 0 1 0 ${h * 0.16} ${h * 0.28} a ${h * 0.12} ${h * 0.12} 0 1 1 ${-h * 0.16} ${-h * 0.28} Z`} fill="#f7d648" />
      <path d={`M ${w * 0.2} ${h * 0.3} a ${h * 0.1} ${h * 0.1} 0 1 0 ${h * 0.1} ${h * 0.18} a ${h * 0.08} ${h * 0.08} 0 1 1 ${-h * 0.1} ${-h * 0.18} Z`} fill="#f7d648" opacity={0.9} />
      {Array.from({length: Math.floor(w / 14)}, (_, i) => {
        const bh = h * (0.3 + rnd() * 0.35);
        return <rect key={i} x={i * 14} y={h - bh} width={12} height={bh} fill="#3a3e7c" stroke="#232750" strokeWidth={1} />;
      })}
      {Array.from({length: Math.floor(w / 5)}, (_, i) => (
        <rect key={i} x={2 + i * 5} y={h - 6 - (i % 4) * 7} width={2.4} height={3} fill="#f7d648" opacity={rnd() > 0.4 ? 0.95 : 0.2} />
      ))}
    </g>
  );
};

const MiniBowl: React.FC<{cx: number; cy: number; s: number; chop?: boolean}> = ({cx, cy, s, chop}) => (
  <g transform={`translate(${cx} ${cy}) scale(${s})`}>
    {chop && <path d="M 26 -34 L 4 -8 M 32 -30 L 10 -6" stroke="#8a5a2b" strokeWidth={3} strokeLinecap="round" />}
    {chop && <path d="M 4 -8 q -1 10 1 16 M 9 -6 q 0 10 2 14" stroke="#f2d8a0" strokeWidth={2.4} fill="none" />}
    <path d="M -26 -6 Q -24 16 0 18 Q 24 16 26 -6 Z" fill="#fffdf6" stroke={INK} strokeWidth={1.8} />
    <path d="M -22 0 Q 0 8 22 0" stroke="#d94f4f" strokeWidth={1.6} fill="none" />
    <ellipse cx={0} cy={-6} rx={26} ry={6} fill="#e8b04b" stroke={INK} strokeWidth={1.8} />
    <ellipse cx={-8} cy={-7} rx={5} ry={2.6} fill="#fff" />
    <circle cx={8} cy={-7} r={3} fill="#fff" stroke="#e86a8a" strokeWidth={1} />
  </g>
);

const MiniRamen: React.FC<{w: number; h: number; n: number}> = ({w, h, n}) => (
  <g>
    <rect width={w} height={h} fill="#f7e3b0" />
    <rect y={h * 0.72} width={w} height={h * 0.28} fill="#d9a05b" />
    {Array.from({length: n}, (_, i) => (
      <MiniBowl key={i} cx={(w / n) * (i + 0.5)} cy={h * 0.58} s={h / 62} chop={i === n - 1} />
    ))}
  </g>
);

const MiniGray: React.FC<{w: number; h: number; seed: number}> = ({w, h, seed}) => (
  <g>
    <rect width={w} height={h} fill="#8a857c" />
    <g stroke="#6e6960" strokeWidth={2} opacity={0.7}>
      {Array.from({length: Math.floor(w / 9) + 4}, (_, i) => (
        <path key={i} d={`M ${i * 9 - 20} ${h + 4} L ${i * 9 + 14} -4`} />
      ))}
    </g>
    <MiniBowl cx={w * 0.5} cy={h * 0.6} s={h / 70} />
    <g opacity={0.5}><MiniBowl cx={w * 0.5} cy={h * 0.6} s={h / 70} /></g>
  </g>
);

const MiniShibaHead: React.FC<{cx: number; cy: number; s: number; heart?: boolean}> = ({cx, cy, s, heart}) => (
  <g transform={`translate(${cx} ${cy}) scale(${s})`}>
    <path d="M -20 -8 L -26 -28 L -8 -20 Z" fill="#d98d4f" stroke={INK} strokeWidth={1.6} />
    <path d="M 20 -8 L 26 -28 L 8 -20 Z" fill="#d98d4f" stroke={INK} strokeWidth={1.6} />
    <ellipse cx={0} cy={0} rx={24} ry={21} fill="#d98d4f" stroke={INK} strokeWidth={1.8} />
    <path d="M -24 4 Q 0 22 24 4 Q 0 12 -24 4 Z" fill="#fffdf6" />
    <path d="M -12 -3 q 3 -4 6 0 M 6 -3 q 3 -4 6 0" stroke={INK} strokeWidth={1.8} fill="none" strokeLinecap="round" />
    <ellipse cx={0} cy={3} rx={2.6} ry={2} fill={INK} />
    <ellipse cx={-16} cy={4} rx={4} ry={2.6} fill="#f2b0c0" />
    <ellipse cx={16} cy={4} rx={4} ry={2.6} fill="#f2b0c0" />
    <path d="M -14 20 Q 0 30 14 20 L 14 34 L -14 34 Z" fill="#d98d4f" stroke={INK} strokeWidth={1.6} />
    <ellipse cx={0} cy={30} rx={8} ry={7} fill="#fffdf6" />
    {heart && <path d="M 20 -24 c -5 -6 -12 0 -6 6 l 6 5 l 6 -5 c 6 -6 -1 -12 -6 -6 Z" fill="#e86a8a" />}
  </g>
);

const MiniShiba: React.FC<{w: number; h: number; n: number}> = ({w, h, n}) => (
  <g>
    <rect width={w} height={h} fill="#cdeee2" />
    {Array.from({length: n}, (_, i) => (
      <MiniShibaHead key={i} cx={(w / n) * (i + 0.5)} cy={h * 0.42} s={h / 62} heart={i === 1} />
    ))}
  </g>
);

const MiniDisco: React.FC<{w: number; h: number; n: number; seed: number}> = ({w, h, n, seed}) => (
  <g>
    <rect width={w} height={h} fill="#7f6cc9" />
    <rect y={h * 0.62} width={w} height={h * 0.38} fill="#3b4a8f" />
    {Array.from({length: Math.floor(w / 12)}, (_, i) => (
      <rect key={i} x={i * 12} y={h * 0.66 + (i % 2) * 8} width={10} height={7} fill={['#6fc7c2', '#e8c94f', '#e86a8a'][i % 3]} opacity={0.85} />
    ))}
    {Array.from({length: n}, (_, i) => {
      const cx = (w / n) * (i + 0.5);
      return (
        <g key={i} transform={`translate(${cx} ${h * 0.5})`}>
          <circle cx={0} cy={-h * 0.3} r={h * 0.09} fill="#d8d8e8" stroke={INK} strokeWidth={1.2} />
          <path d={`M ${-8} -2 L ${-13} -12 M 8 -2 L 13 -12`} stroke="#c8524a" strokeWidth={3.4} strokeLinecap="round" />
          <rect x={-11} y={-9} width={22} height={18} rx={3} fill="#c8524a" stroke={INK} strokeWidth={1.5} />
          <rect x={-7} y={9} width={4} height={6} fill="#c8524a" />
          <rect x={3} y={9} width={4} height={6} fill="#c8524a" />
        </g>
      );
    })}
  </g>
);

/* ---------------- media panel ---------------- */
const THUMBS = [
  {label: '夜景.mp4', dur: '2.4s', kind: 'night'},
  {label: '拉面.mp4', dur: '4.6s', kind: 'ramen'},
  {label: '柴犬.mov', dur: '2.9s', kind: 'shiba'},
  {label: '小克蹦迪.mp4', dur: '2.8s', kind: 'disco'},
] as const;

const ThumbArt: React.FC<{kind: string; w: number; h: number; seed: number}> = ({kind, w, h, seed}) => {
  switch (kind) {
    case 'night': return <MiniNight w={w} h={h} seed={seed} />;
    case 'ramen': return <MiniRamen w={w} h={h} n={1} />;
    case 'shiba': return <MiniShiba w={w} h={h} n={1} />;
    default: return <MiniDisco w={w} h={h} n={1} seed={seed} />;
  }
};

const TransIcon: React.FC<{kind: string; cx: number; cy: number}> = ({kind, cx, cy}) => {
  switch (kind) {
    case 'swirl':
      return <path d={`M ${cx} ${cy} m 0 -10 a 10 10 0 1 1 -10 10 a 7 7 0 1 0 7 -7 a 4 4 0 1 1 -4 4`} stroke="#4a9e8f" strokeWidth={3.4} fill="none" strokeLinecap="round" />;
    case 'page':
      return (
        <g stroke={INK} strokeWidth={2} fill="#fffdf6">
          <rect x={cx - 9} y={cy - 12} width={18} height={24} rx={2} />
          <path d={`M ${cx - 5} ${cy - 6} h 10 M ${cx - 5} ${cy - 1} h 10 M ${cx - 5} ${cy + 4} h 7`} strokeWidth={1.6} />
          <path d={`M ${cx + 3} ${cy + 12} l 6 -6 v 6 Z`} fill="#cdeee2" />
        </g>
      );
    case 'glitch':
      return (
        <g>
          <rect x={cx - 12} y={cy - 8} width={24} height={16} rx={3} fill="#b9a7e8" stroke={INK} strokeWidth={2} />
          <path d={`M ${cx - 16} ${cy - 3} h 8 M ${cx + 8} ${cy + 3} h 8`} stroke="#e86a8a" strokeWidth={3} />
        </g>
      );
    case 'zoom':
      return (
        <g stroke={INK} strokeWidth={2.2} fill="#fffdf6">
          <circle cx={cx - 2} cy={cy - 2} r={9} />
          <path d={`M ${cx + 5} ${cy + 5} L ${cx + 12} ${cy + 12}`} strokeWidth={3.4} stroke="#c8524a" />
          <path d={`M ${cx - 6} ${cy - 2} h 8 M ${cx - 2} ${cy - 6} v 8`} strokeWidth={1.8} />
        </g>
      );
    case 'slide':
      return (
        <g>
          <path d={`M ${cx - 14} ${cy - 6} h 8 M ${cx - 14} ${cy} h 10 M ${cx - 14} ${cy + 6} h 8`} stroke={INK} strokeWidth={2} strokeLinecap="round" />
          <rect x={cx - 2} y={cy - 9} width={16} height={18} rx={3} fill="#6fc7c2" stroke={INK} strokeWidth={2} />
          <path d={`M ${cx + 3} ${cy - 4} l 6 4 l -6 4 Z`} fill="#fffdf6" />
        </g>
      );
    default:
      return (
        <g>
          <rect x={cx - 10} y={cy - 10} width={14} height={14} rx={2} fill="#8f7bd8" stroke={INK} strokeWidth={1.8} />
          <rect x={cx - 2} y={cy - 2} width={14} height={14} rx={2} fill="none" stroke={INK} strokeWidth={1.6} strokeDasharray="3 3" />
        </g>
      );
  }
};

const TRANS_CARDS = [
  {label: '旋转', kind: 'swirl', bg: '#cfc3f0'},
  {label: '翻页', kind: 'page', bg: '#cdeee2'},
  {label: '故障', kind: 'glitch', bg: '#f6d4de'},
  {label: '缩放', kind: 'zoom', bg: '#bcd8f0'},
  {label: '滑动', kind: 'slide', bg: '#fdf3d0'},
  {label: '溶解', kind: 'dissolve', bg: '#e8e2d6'},
] as const;

export const MediaPanel: React.FC<{t: number; frame: number}> = ({t, frame}) => {
  const s = boilSeed(frame, 21);
  const tab = t < T.tabTrans ? 0 : t < T.tabText ? 1 : 2;
  const appear = seg(t, 1.0, 1.3);
  const dragIdx = T.dragStarts.findIndex((d, i) => t >= d && t < T.clipsIn[i] + 0.15);
  return (
    <g opacity={appear}>
      <Panel x={24} y={66} w={258} h={316} seed={s} />
      {['素材', '转场', '文字'].map((label, i) => (
        <g key={label}>
          <path d={sketchRect(38 + i * 80, 78, 72, 26, 8, s + i, 0.8)} fill={tab === i ? '#f7d648' : '#fffdf6'} stroke={INK} strokeWidth={1.8} />
          <Txt x={74 + i * 80} y={96} size={14} anchor="middle">{label}</Txt>
        </g>
      ))}
      {tab === 0 && (
        <g>
          {THUMBS.map((th, i) => {
            const x = 38 + (i % 2) * 120;
            const y = 114 + Math.floor(i / 2) * 88;
            const ap = seg(t, 1.25 + i * 0.09, 1.45 + i * 0.09);
            const hl = dragIdx === i;
            return (
              <g key={th.label} opacity={ap} transform={`translate(${x + 55} ${y + 33}) scale(${0.8 + 0.2 * pop(ap)}) translate(${-(x + 55)} ${-(y + 33)})`}>
                <clipPath id={`th-${i}`}><rect x={x} y={y} width={110} height={66} rx={6} /></clipPath>
                <g clipPath={`url(#th-${i})`}><g transform={`translate(${x} ${y})`}><ThumbArt kind={th.kind} w={110} h={66} seed={s + i * 7} /></g></g>
                <path d={sketchRect(x, y, 110, 66, 6, s + 30 + i, 0.9)} fill="none" stroke={hl ? '#f2b53a' : INK} strokeWidth={hl ? 3.4 : 2} />
                <rect x={x + 76} y={y + 50} width={30} height={13} rx={4} fill="#2b2620" opacity={0.85} />
                <Txt x={x + 91} y={y + 60} size={9} fill="#fff" anchor="middle">{th.dur}</Txt>
                <Txt x={x + 55} y={y + 80} size={11} anchor="middle" fill="#6e6960">{th.label}</Txt>
              </g>
            );
          })}
          {[0, 1].map((i) => (
            <g key={i} opacity={0.7}>
              <rect x={38 + i * 120} y={292} width={110} height={58} rx={8} fill="none" stroke="#a89f92" strokeWidth={1.8} strokeDasharray="6 5" />
              <path d={`M ${93 + i * 120} 312 v 18 M ${84 + i * 120} 321 h 18`} stroke="#a89f92" strokeWidth={2.4} strokeLinecap="round" />
              <Txt x={93 + i * 120} y={364} size={10} anchor="middle" fill="#a89f92">导入素材</Txt>
            </g>
          ))}
        </g>
      )}
      {tab === 1 && (
        <g>
          {TRANS_CARDS.map((c, i) => {
            const x = 38 + (i % 2) * 120;
            const y = 114 + Math.floor(i / 2) * 82;
            const ap = seg(t, T.tabTrans + 0.05 + i * 0.05, T.tabTrans + 0.25 + i * 0.05);
            const selected = c.kind === 'swirl' && t >= T.swirlFly[0];
            const used = (c.kind === 'page' && t > T.pageFly[1]) || (c.kind === 'glitch' && t > 11.5);
            return (
              <g key={c.label} opacity={ap * (used ? 0.4 : 1)}>
                <path d={sketchRect(x, y, 110, 60, 8, s + 50 + i, 0.9)} fill={selected ? '#cfc3f0' : c.bg} stroke={INK} strokeWidth={selected ? 2.6 : 1.8} />
                <TransIcon kind={c.kind} cx={x + 55} cy={y + 30} />
                <Txt x={x + 55} y={y + 74} size={11} anchor="middle" fill="#6e6960">{c.label}</Txt>
              </g>
            );
          })}
        </g>
      )}
      {tab === 2 && (
        <g>
          {[
            {bg: '#fdf3d0', y: 114},
            {bg: '#f6d4de', y: 196},
            {bg: '#2a2440', y: 278},
          ].map((c, i) => {
            const ap = seg(t, T.tabText + 0.05 + i * 0.07, T.tabText + 0.25 + i * 0.07);
            return (
              <g key={i} opacity={ap}>
                <path d={sketchRect(38, c.y, 222, 62, 8, s + 70 + i, 0.9)} fill={c.bg} stroke={INK} strokeWidth={2} />
                {i === 0 && <Txt x={149} y={c.y + 42} size={26} anchor="middle" fill="#f2b53a" outline={5} bold>前方高能</Txt>}
                {i === 1 && (
                  <g>
                    <rect x={78} y={c.y + 16} width={142} height={32} rx={16} fill="#fffdf6" stroke="#e86a8a" strokeWidth={2} />
                    <Txt x={149} y={c.y + 39} size={18} anchor="middle" fill="#e86a8a">好耶～</Txt>
                  </g>
                )}
                {i === 2 && (
                  <text x={149} y={c.y + 40} fontSize={22} textAnchor="middle" fill="#e8d4ff" style={{...HAND, filter: 'drop-shadow(0 0 4px #b9a7e8) drop-shadow(0 0 8px #8f7bd8)'}}>霓虹 NEON</text>
                )}
              </g>
            );
          })}
        </g>
      )}
    </g>
  );
};

/* ---------------- adjust panel ---------------- */
export const AdjustPanel: React.FC<{t: number; frame: number}> = ({t, frame}) => {
  const s = boilSeed(frame, 31);
  const v = sliders(t);
  const appear = seg(t, 1.15, 1.45);
  const rows = [
    {label: '闪光', val: `${Math.round(v.flash)}%`, pct: v.flash / 100, active: t >= T.flashPull[0] && t < T.flashPull[1] + 0.1, red: false},
    {label: '饱和度', val: v.sat > 200 ? '爆表!!' : `${Math.round(v.sat)}%`, pct: Math.min(1, v.sat / 300), active: t >= T.satPull[0] && t < T.settle[1], red: v.sat > 200},
    {label: '缩放冲击', val: `${Math.round(v.punch)}%`, pct: v.punch / 100, active: t >= T.punchPull[0] && t < T.punchPull[1] + 0.1, red: false},
    {label: '速度', val: '1.0x', pct: 0.55, active: false, red: false},
  ];
  return (
    <g opacity={appear}>
      <Panel x={996} y={66} w={262} h={318} seed={s} />
      <Txt x={1012} y={98} size={21} bold>调整</Txt>
      <path d="M 1066 84 l 3 6 l 6 3 l -6 3 l -3 6 l -3 -6 l -6 -3 l 6 -3 Z" fill="#f2b53a" stroke={INK} strokeWidth={1} />
      <path d={sketchLine(1012, 110, 1242, 110, s + 3, 0.8)} stroke={INK} strokeWidth={1.4} opacity={0.5} />
      {rows.map((r, i) => {
        const ly = 138 + i * 60;
        const kx = 1014 + r.pct * 228;
        return (
          <g key={r.label}>
            <Txt x={1012} y={ly} size={15}>{r.label}</Txt>
            <Txt x={1242} y={ly} size={14} anchor="end" fill={r.red ? '#d92b2b' : '#6e6960'} bold={r.red}>{r.val}</Txt>
            <rect x={1014} y={ly + 10} width={228} height={8} rx={4} fill="#e8e2d6" stroke={INK} strokeWidth={1.4} />
            <rect x={1014} y={ly + 10} width={Math.max(8, r.pct * 228)} height={8} rx={4} fill={r.red ? '#d92b2b' : '#6fc7b2'} />
            {r.active && <circle cx={kx} cy={ly + 14} r={13} fill="none" stroke="#f2b53a" strokeWidth={3} opacity={0.9} />}
            <circle cx={kx} cy={ly + 14} r={9} fill={r.red ? '#f2b53a' : '#fffdf6'} stroke={INK} strokeWidth={2} />
          </g>
        );
      })}
    </g>
  );
};

/* ---------------- timeline ---------------- */
const ClipBox: React.FC<{x: number; w: number; y: number; h: number; seed: number; label?: string; children: React.ReactNode; border?: string; bw?: number}> = ({x, w, y, h, seed, label, children, border = INK, bw = 2}) => (
  <g>
    <clipPath id={`clip-${seed}`}><rect x={x} y={y} width={w} height={h} rx={7} /></clipPath>
    <g clipPath={`url(#clip-${seed})`}><g transform={`translate(${x} ${y})`}>{children}</g></g>
    <path d={sketchRect(x, y, w, h, 7, seed, 0.9)} fill="none" stroke={border} strokeWidth={bw} />
    {label && (
      <g>
        <path d={sketchRect(x + 4, y + 4, Math.min(w - 8, 14 + label.length * 10), 16, 4, seed + 5, 0.5)} fill="#fffdf6" stroke={INK} strokeWidth={1.3} />
        <Txt x={x + 10} y={y + 16} size={10}>{label}</Txt>
      </g>
    )}
  </g>
);

export const Timeline: React.FC<{t: number; frame: number}> = ({t, frame}) => {
  const s = boilSeed(frame, 41);
  const L = clipLayout(t);
  const px = (sec: number) => X0 + sec * PPS;
  const appear = seg(t, 1.25, 1.55);
  const tracksOn = seg(t, 1.7, 1.95);
  const ph = px(playheadSec(t));
  const grayHl = t >= T.focus[0] && t < T.drop;
  // gray segment lift & drop
  const lift = easeOut(seg(t, T.shua[0], T.shua[0] + 0.4));
  const drop = seg(t, T.drop, T.drop + 0.3);
  const gx = px(L.gray[0]);
  const gw = (L.gray[1] - L.gray[0]) * PPS;
  const grayVisible = t >= T.clipsIn[1] && t < T.drop + 0.3;
  const beatCount = Math.floor(seg(t, T.beats[0], T.beats[1]) * 26);
  const audioW = lerp(1136, 1055, gapP(t));
  const total = gapP(t) >= 1 ? '0:10.5' : '0:12.7';
  const txt = stickerText(t);
  const textGrow = seg(t, T.textClipGrow[0], T.textClipGrow[1]);
  const tx0 = px(L.shiba[0] + 0.1);
  const tw = (L.shiba[1] - L.shiba[0] - 0.2) * PPS * textGrow;
  return (
    <g opacity={appear}>
      <Panel x={24} y={390} w={1232} h={316} seed={s} />
      {/* ruler */}
      <path d={sketchLine(88, 412, 1244, 412, s + 1, 0.7)} stroke={INK} strokeWidth={1.6} />
      {Array.from({length: 17}, (_, i) => (
        <g key={i}>
          <path d={`M ${X0 + i * PPS} 404 V 412`} stroke={INK} strokeWidth={1.4} />
          {i % 2 === 0 && <Txt x={X0 + i * PPS} y={400} size={11} anchor="middle" fill="#8a8276">{`0:${String(i).padStart(2, '0')}`}</Txt>}
          {i < 16 && <path d={`M ${X0 + i * PPS + PPS / 2} 408 V 412`} stroke={INK} strokeWidth={1} opacity={0.6} />}
        </g>
      ))}
      <g opacity={tracksOn}>
        {/* track buttons */}
        <path d={sketchRect(33, 424, 44, 30, 8, s + 2, 0.7)} fill="#fdf3d0" stroke={INK} strokeWidth={1.8} />
        <Txt x={55} y={445} size={15} anchor="middle" bold>T</Txt>
        <path d={sketchRect(33, 462, 44, 74, 8, s + 3, 0.7)} fill="#cdeee2" stroke={INK} strokeWidth={1.8} />
        <path d="M 49 489 L 63 499 L 49 509 Z" fill={INK} />
        <path d={sketchRect(33, 548, 44, 44, 8, s + 4, 0.7)} fill="#cfc3f0" stroke={INK} strokeWidth={1.8} />
        <path d="M 52 562 v 16 a 4 3 0 1 1 -3 -3 M 52 562 l 8 -3 v 14" stroke={INK} strokeWidth={2.2} fill="none" strokeLinecap="round" />
        {/* text clip */}
        {textGrow > 0 && (
          <g>
            <path d={sketchRect(tx0, 424, tw, 30, 6, s + 6, 0.7)} fill="#f7d648" stroke={INK} strokeWidth={1.8} />
            <Txt x={tx0 + 8} y={444} size={12} bold>T</Txt>
            {txt && <Txt x={tx0 + 24} y={444} size={12}>{txt}</Txt>}
          </g>
        )}
        {/* video clips */}
        {t >= T.clipsIn[0] && (
          <ClipBox x={px(L.night[0])} w={(L.night[1] - L.night[0]) * PPS} y={462} h={74} seed={s + 10} label="夜景.mp4">
            <MiniNight w={(L.night[1] - L.night[0]) * PPS} h={74} seed={s + 10} />
          </ClipBox>
        )}
        {t >= T.clipsIn[1] && (
          <ClipBox x={px(L.ramenA[0])} w={(L.ramenA[1] - L.ramenA[0]) * PPS} y={462} h={74} seed={s + 11} label="拉面.mp4">
            <MiniRamen w={(L.ramenA[1] - L.ramenA[0]) * PPS} h={74} n={2} />
          </ClipBox>
        )}
        {grayVisible && (
          <g transform={`translate(${gx + gw / 2 + lift * 60 - drop * 60} ${499 - lift * 60 + drop * 130}) rotate(${-14 * lift + drop * 20}) scale(${1 - drop * 0.5}) translate(${-(gx + gw / 2)} -499)`} opacity={1 - drop}>
            <ClipBox x={gx} w={gw} y={462} h={74} seed={s + 12} border={grayHl ? '#f2b53a' : INK} bw={grayHl ? 3 : 2}>
              <MiniGray w={gw} h={74} seed={s + 12} />
            </ClipBox>
          </g>
        )}
        {t >= T.clipsIn[1] && (
          <ClipBox x={px(L.ramenB[0])} w={(L.ramenB[1] - L.ramenB[0]) * PPS} y={462} h={74} seed={s + 13}>
            <MiniRamen w={(L.ramenB[1] - L.ramenB[0]) * PPS} h={74} n={1} />
          </ClipBox>
        )}
        {t >= T.clipsIn[2] && (
          <ClipBox x={px(L.shiba[0])} w={(L.shiba[1] - L.shiba[0]) * PPS} y={462} h={74} seed={s + 14} label="柴犬.mov">
            <MiniShiba w={(L.shiba[1] - L.shiba[0]) * PPS} h={74} n={3} />
          </ClipBox>
        )}
        {t >= T.clipsIn[3] && (
          <ClipBox x={px(L.disco[0])} w={(L.disco[1] - L.disco[0]) * PPS} y={462} h={74} seed={s + 15} label="小克蹦迪.mp4">
            <MiniDisco w={(L.disco[1] - L.disco[0]) * PPS} h={74} n={4} seed={s + 15} />
          </ClipBox>
        )}
        {/* transition badges */}
        {t >= T.swirlFly[1] && (
          <g transform={`translate(${px(2.4)} 500) scale(${pop(seg(t, T.swirlFly[1], T.swirlFly[1] + 0.25))})`}>
            <circle r={13} fill="#fffdf6" stroke={INK} strokeWidth={2} />
            <TransIcon kind="swirl" cx={0} cy={0} />
          </g>
        )}
        {t >= T.pageFly[1] && (
          <g transform={`translate(${px(L.shiba[0])} 500) scale(${pop(seg(t, T.pageFly[1], T.pageFly[1] + 0.25))})`}>
            <circle r={13} fill="#fffdf6" stroke={INK} strokeWidth={2} />
            <g transform="scale(0.8)"><TransIcon kind="page" cx={0} cy={0} /></g>
          </g>
        )}
        {t >= T.zoomBadge && (
          <g transform={`translate(${px(L.disco[0])} 500) scale(${pop(seg(t, T.zoomBadge, T.zoomBadge + 0.25))})`}>
            <circle r={13} fill="#fffdf6" stroke={INK} strokeWidth={2} />
            <g transform="scale(0.8)"><TransIcon kind="glitch" cx={0} cy={0} /></g>
          </g>
        )}
        {/* audio track */}
        {t >= T.audioIn && (
          <g opacity={seg(t, T.audioIn, T.audioIn + 0.3)}>
            <path d={sketchRect(X0, 552, audioW, 40, 7, s + 16, 0.8)} fill="#cfc3f0" stroke={INK} strokeWidth={1.8} />
            <Txt x={X0 + 8} y={566} size={10} fill="#5a4a9a">♩ bgm_小克.wav</Txt>
            <g stroke="#8f7bd8" strokeWidth={1.6} opacity={0.8}>
              {Array.from({length: Math.floor(audioW / 5)}, (_, i) => {
                const h2 = 3 + Math.abs(Math.sin(i * 0.55) * 10 + Math.sin(i * 0.21) * 6);
                return <path key={i} d={`M ${X0 + 4 + i * 5} ${580 - h2} V ${580 + h2 * 0.4}`} />;
              })}
            </g>
          </g>
        )}
        {/* beat markers */}
        {Array.from({length: beatCount}, (_, i) => {
          const bx = X0 + 8 + i * (1040 / 26);
          const ap = pop(seg(t, T.beats[0] + (i / 26) * (T.beats[1] - T.beats[0]), T.beats[0] + (i / 26) * (T.beats[1] - T.beats[0]) + 0.15));
          return <path key={i} d={`M ${bx - 7} 598 L ${bx + 7} 598 L ${bx} 610 Z`} fill="#f2b53a" stroke={INK} strokeWidth={1.4} transform={`translate(${bx} 604) scale(${ap}) translate(${-bx} -604)`} />;
        })}
        {/* 卡点 button */}
        {t >= T.kadianBtn && (
          <g transform={`translate(1206 569) scale(${pop(seg(t, T.kadianBtn, T.kadianBtn + 0.25))}) translate(-1206 -569)`}>
            <path d={sketchRect(1163, 552, 86, 34, 8, s + 17, 0.8)} fill="#f7d648" stroke={INK} strokeWidth={2} />
            <path d="M 1176 563 l 10 0 l -5 8 Z" fill={INK} />
            <Txt x={1216} y={575} size={15} anchor="middle" bold>卡点</Txt>
          </g>
        )}
        {/* playhead */}
        <path d={`M ${ph} 414 V 640`} stroke="#e04545" strokeWidth={2.4} />
        <path d={`M ${ph - 8} 396 L ${ph + 8} 396 L ${ph + 8} 406 L ${ph} 414 L ${ph - 8} 406 Z`} fill="#e04545" stroke={INK} strokeWidth={1.4} />
        {/* zoom slider + footer */}
        <g opacity={0.7}>
          <path d="M 50 684 h 10 M 108 684 h 10 M 113 679 v 10" stroke="#8a8276" strokeWidth={2} strokeLinecap="round" />
          <path d="M 64 684 H 104" stroke="#8a8276" strokeWidth={1.6} />
          <circle cx={84} cy={684} r={5} fill="#fffdf6" stroke="#8a8276" strokeWidth={1.6} />
        </g>
        {t >= 19.8 && <Txt x={1240} y={690} size={11} anchor="end" fill="#a89f92">{`片段 4 · 总时长 ${total}`}</Txt>}
      </g>
    </g>
  );
};