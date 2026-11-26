import React from 'react';
import {INK, sketchRect, sketchLine, boilSeed} from '../lib/sketch';
import {seg, pop, easeOut, lerp} from '../lib/anim';
import {T, outroScene} from '../lib/timing';
import {NightCity, Ramen, Shiba, Disco} from './scenes';
import {Phone} from './Phone';
import {Robot, Dust} from './Robot';
import {Confetti} from './effects';

const HAND: React.CSSProperties = {fontFamily: 'var(--font-hand)'};

const SocialOverlay: React.FC<{t: number}> = ({t}) => {
  const likes = t < 28 ? '5.4w' : t < 29 ? '10.1w' : '10.2w';
  const comments = t < 28 ? '1232' : '2333';
  return (
    <g>
      {/* avatar */}
      <g transform="translate(162 66)">
        <circle r={17} fill="#c8524a" stroke="#fffdf6" strokeWidth={2.5} />
        <circle cx={-5} cy={-2} r={2} fill={INK} />
        <circle cx={5} cy={-2} r={2} fill={INK} />
        <path d="M -4 5 q 4 3 8 0" stroke={INK} strokeWidth={1.6} fill="none" />
      </g>
      <g transform="translate(162 122)">
        <path d="M 0 8 C -12 -4 -6 -14 0 -7 C 6 -14 12 -4 0 8 Z" fill="#e86a8a" stroke="#fffdf6" strokeWidth={1.4} />
        <text y={26} fontSize={13} fill="#fffdf6" textAnchor="middle" style={HAND}>{likes}</text>
      </g>
      <g transform="translate(162 176)">
        <rect x={-11} y={-9} width={22} height={16} rx={5} fill="#fffdf6" />
        <path d="M -4 7 l -3 6 l 7 -6" fill="#fffdf6" />
        <circle cx={-5} cy={-1} r={1.6} fill={INK} />
        <circle cx={0} cy={-1} r={1.6} fill={INK} />
        <circle cx={5} cy={-1} r={1.6} fill={INK} />
        <text y={26} fontSize={13} fill="#fffdf6" textAnchor="middle" style={HAND}>{comments}</text>
      </g>
      <g transform="translate(162 228)">
        <path d="M -8 6 L 8 -6 M 8 -6 h -8 M 8 -6 v 8" stroke="#fffdf6" strokeWidth={3} fill="none" strokeLinecap="round" />
        <text y={24} fontSize={13} fill="#fffdf6" textAnchor="middle" style={HAND}>分享</text>
      </g>
      <text x={14} y={252} fontSize={15} fill="#fffdf6" style={HAND}>@小克 · Opus 5.5</text>
      <text x={14} y={272} fontSize={12} fill="#fffdf6" opacity={0.9} style={HAND}>#AI剪辑 #卡点 #code2video</text>
    </g>
  );
};

export const Outro: React.FC<{t: number; frame: number}> = ({t, frame}) => {
  if (t < T.outro[0]) return null;
  const fade = seg(t, T.outro[0], T.outro[1]);
  const s = boilSeed(frame, 111);
  const phoneIn = easeOut(seg(t, T.outro[0], T.outro[1] + 0.2));
  const scene = outroScene(t);
  const paperIn = easeOut(seg(t, T.paper[0], T.paper[0] + 0.4));
  const line1 = seg(t, 27.3, 27.8);
  const line2 = seg(t, 28.0, 28.4);
  const line3 = seg(t, 28.5, 28.8);
  const underline = seg(t, 28.8, 29.1);
  const line4 = seg(t, 29.2, 29.5);
  const wave = t > 29.2 ? Math.sin((t - 29.2) * 9) * 14 - 20 : 0;
  return (
    <g>
      {/* fade the editor */}
      <rect width={1280} height={720} fill="#f4efe6" opacity={fade * 0.82} />
      <Confetti t={t} t0={26.6} seed={7} n={26} />
      {/* big phone */}
      <g transform={`translate(${lerp(560, 450, phoneIn)} ${lerp(120, 128, phoneIn)}) scale(${lerp(1, 1.52, phoneIn)})`} opacity={phoneIn}>
        <Phone x={0} y={0} seed={201} controls="none">
          {scene === 'night' && <NightCity t={t} seed={202} sleepy />}
          {scene === 'ramen' && <Ramen t={t} seed={203} />}
          {scene === 'disco' && <Disco t={t} seed={204} />}
          <SocialOverlay t={t} />
          {t >= T.naliele && (
            <g transform={`translate(92 120) rotate(-3) scale(${pop(seg(t, T.naliele, T.naliele + 0.25))})`}>
              <text fontSize={34} fill="#f2b53a" textAnchor="middle" style={{...HAND, fontWeight: 700}} stroke={INK} strokeWidth={6} paintOrder="stroke" strokeLinejoin="round">拿捏了!</text>
            </g>
          )}
        </Phone>
        {/* sparkles around phone */}
        <g fill="#f2b53a">
          <path d="M -24 60 l 3 7 l 7 3 l -7 3 l -3 7 l -3 -7 l -7 -3 l 7 -3 Z" opacity={0.6 + 0.4 * Math.sin(t * 3)} />
          <path d="M 224 140 l 3 7 l 7 3 l -7 3 l -3 7 l -3 -7 l -7 -3 l 7 -3 Z" fill="#fffdf6" opacity={0.6 + 0.4 * Math.sin(t * 3 + 2)} />
          <path d="M -18 240 l 2.5 6 l 6 2.5 l -6 2.5 l -2.5 6 l -2.5 -6 l -6 -2.5 l 6 -2.5 Z" opacity={0.5 + 0.5 * Math.sin(t * 4 + 1)} />
        </g>
      </g>
      {/* paper note */}
      <g transform={`translate(${lerp(-380, 0, paperIn)} 0) rotate(-1.5 228 325)`} opacity={paperIn}>
        <path d={sketchRect(45, 162, 365, 328, 6, s, 1.4)} fill="#fffdf6" stroke={INK} strokeWidth={2.4} />
        <rect x={170} y={154} width={92} height={16} fill="#f2b53a" opacity={0.85} transform="rotate(-2 216 162)" />
        {[220, 254, 288, 322, 356, 390, 424, 458].map((yy) => (
          <path key={yy} d={sketchLine(62, yy, 392, yy, s + yy, 0.6)} stroke="#c8c2b6" strokeWidth={1.1} opacity={0.6} />
        ))}
        {line1 > 0 && (
          <text x={76} y={244} fontSize={27} fill={INK} style={HAND}>{'30 秒剪完,'.slice(0, Math.ceil(line1 * 7))}</text>
        )}
        {line2 > 0 && (
          <text x={76} y={352} fontSize={46} fill={INK} style={HAND}>{'Opus'.slice(0, Math.ceil(line2 * 4))}</text>
        )}
        {line3 > 0 && (
          <text x={196} y={352} fontSize={46} fill={INK} style={HAND}>{' 5.5'.slice(0, Math.ceil(line3 * 4))}</text>
        )}
        {underline > 0 && (
          <path d={`M 76 368 Q ${76 + 280 * underline * 0.5} ${372} ${76 + 280 * underline} 366`} stroke="#d94f4f" strokeWidth={3.4} fill="none" strokeLinecap="round" />
        )}
        {line4 > 0 && (
          <text x={388} y={440} fontSize={21} fill={INK} textAnchor="end" style={HAND}>{'— 小克 收工 ✦'.slice(0, Math.ceil(line4 * 9))}</text>
        )}
      </g>
      {/* waving robot */}
      <g transform={`translate(0 ${lerp(60, 0, easeOut(seg(t, 26.8, 27.4)))})`} opacity={seg(t, 26.7, 27.1)}>
        {t < 27.6 && <Dust x={1000} y={580} s={1.1} o={1 - seg(t, 27.2, 27.6)} />}
        {t < 27.6 && <Dust x={1062} y={584} s={0.9} o={1 - seg(t, 27.2, 27.6)} />}
        <Robot x={1025} y={530} scale={1.12} seed={s} eyes={t > 29.4 ? 'wink' : 'happy'} shades="head" blush wave={wave} />
      </g>
    </g>
  );
};