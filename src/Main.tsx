import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, Audio, staticFile, Sequence} from 'remotion';
import {loadFont} from '@remotion/google-fonts/ZCOOLKuaiLe';
import {loadFont as loadPen} from '@remotion/google-fonts/LongCang';
import {INK, PAPER, sketchRect, boilSeed} from './lib/sketch';
import {seg, lerp, track, easeIn, easeOut, easeInOut, pop} from './lib/anim';
import {T, X0, PPS, clipLayout, sliders, stickerText, phoneScene, hypeAmount} from './lib/timing';
import {TopBar, MediaPanel, AdjustPanel, Timeline} from './components/panels';
import {Phone} from './components/Phone';
import {NightCity, Ramen, Shiba, Disco, FocusBlur} from './components/scenes';
import {Robot, Dust, RobotProps} from './components/Robot';
import {SfxText, Bubble, Stamp, Keycap, Trash, FlyingIcon, Confetti} from './components/effects';
import {CodeWindow} from './components/CodeWindow';
import {Outro} from './components/Outro';

const {fontFamily} = loadFont();
const {fontFamily: penFamily} = loadPen();

const CAM_S: [number, number][] = [[0.9, 1], [2, 1], [3, 1.05], [4.5, 1.13], [12, 1.13], [13.2, 1.13], [15.3, 1.13], [16.3, 1.39], [20, 1.39], [20.6, 1.11], [23.2, 1.11], [24, 1.28], [26, 1.28], [26.6, 1], [30, 1]];
const CAM_X: [number, number][] = [[0.9, 640], [2, 640], [3, 620], [4.5, 580], [12, 580], [13.2, 620], [15.3, 620], [16.3, 820], [20, 820], [20.6, 640], [23.2, 640], [24, 784], [26, 784], [26.6, 640], [30, 640]];
const CAM_Y: [number, number][] = [[0.9, 360], [2, 360], [3, 390], [4.5, 382], [12, 382], [13.2, 382], [15.3, 382], [16.3, 263], [20, 263], [20.6, 381], [23.2, 381], [24, 278], [26, 278], [26.6, 360], [30, 360]];

const THUMB_POS: [number, number][] = [[93, 147], [213, 147], [93, 235], [213, 235]];
const CLIP_TARGET: [number, number][] = [[X0 + 1.2 * PPS, 499], [X0 + 4.7 * PPS, 499], [X0 + 8.45 * PPS, 499], [X0 + 11.3 * PPS, 499]];

const Sfx: React.FC<{at: number; name: string; vol?: number}> = ({at, name, vol = 0.5}) => (
  <Sequence from={Math.round(at * 30)} layout="none">
    <Audio src={staticFile(`audio/${name}.wav`)} volume={vol} />
  </Sequence>
);

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const s = boilSeed(frame, 1);
  const hype = hypeAmount(t);
  const cs = track(t, CAM_S);
  const cx = track(t, CAM_X);
  const cy = track(t, CAM_Y);
  const cam = `translate(${640 - cx * cs} ${360 - cy * cs}) scale(${cs})`;
  const L = clipLayout(t);
  const v = sliders(t);
  const scene = phoneScene(t);
  const txt = stickerText(t);
  const glitch = t > 13.6 && t < 14.15 ? 1 : 0;

  /* ---- robot state machine ---- */
  let robot: RobotProps | null = null;
  let extra: React.ReactNode = null;
  const base: RobotProps = {x: 200, y: 430, seed: s, eyes: 'dot'};
  if (t >= T.robotIn && t < 2.0) {
    const p = easeIn(seg(t, T.robotIn, 2.0));
    robot = {...base, y: lerp(-60, 430, p), eyes: 'dot'};
  } else if (t >= 2.0 && t < 4.45) {
    const i = T.dragStarts.findIndex((d, k) => t >= d && t < T.clipsIn[k] + 0.1);
    const land = 1 - 0.25 * Math.sin(seg(t, 2.0, 2.2) * Math.PI);
    if (i >= 0) {
      const p = easeInOut(seg(t, T.dragStarts[i] + 0.05, T.clipsIn[i]));
      const fx = lerp(THUMB_POS[i][0], CLIP_TARGET[i][0], p);
      const fy = lerp(THUMB_POS[i][1], CLIP_TARGET[i][1], p) - Math.sin(p * Math.PI) * 60;
      robot = {...base, squash: land, arm: {tx: fx, ty: fy, hold: 'glove'}};
      extra = (
        <g transform={`translate(${fx} ${fy}) rotate(${8 - p * 14})`}>
          <rect x={-35} y={-23} width={70} height={46} rx={5} fill={['#2c3060', '#f7e3b0', '#cdeee2', '#7f6cc9'][i]} stroke={INK} strokeWidth={2} />
          <circle cx={12} cy={-8} r={6} fill="#f7d648" opacity={i === 0 ? 1 : 0} />
        </g>
      );
    } else {
      robot = {...base, squash: land, eyes: t > 2.4 ? 'happy' : 'dot'};
    }
    if (t < 2.3) extra = <>{extra}<Dust x={180} y={468} s={0.9} o={1 - seg(t, 2.0, 2.3)} /><Dust x={225} y={470} s={0.7} o={1 - seg(t, 2.0, 2.3)} /></>;
  } else if (t >= 4.45 && t < T.focus[0]) {
    robot = {...base, eyes: 'dot'};
  } else if (t >= T.focus[0] && t < T.shua[0]) {
    robot = {...base, eyes: 'narrow', arm: {tx: X0 + 5.2 * PPS, ty: 468, hold: 'pencil'}};
  } else if (t >= T.shua[0] && t < 8.3) {
    robot = {...base, eyes: t > 7.8 ? 'happy' : 'narrow', arm: {tx: X0 + 5.8 * PPS, ty: 430, hold: 'pencil'}};
  } else if (t >= 8.3 && t < T.tabTrans) {
    robot = {...base, eyes: 'happy'};
  } else if (t >= T.tabTrans && t < T.tabText) {
    const reaching = t >= T.swirlFly[0] && t < T.pageFly[1];
    robot = {...base, eyes: 'dot', arm: reaching ? {tx: 250, ty: 190, hold: 'glove'} : null};
  } else if (t >= T.tabText && t < T.keycap[0]) {
    robot = {...base, eyes: t > 13.2 ? 'narrow' : 'dot'};
  } else if (t >= T.keycap[0] && t < 15.6) {
    robot = {x: 300, y: 518, seed: s, eyes: 'dot'};
    extra = (
      <g fill="#fffdf6" stroke={INK} strokeWidth={2}>
        <circle cx={272} cy={560} r={7} />
        <circle cx={328} cy={560} r={7} />
      </g>
    );
    if (t < 13.9) extra = <>{extra}<Dust x={262} y={566} s={0.7} o={1 - seg(t, 13.5, 13.9)} /><Dust x={338} y={566} s={0.7} o={1 - seg(t, 13.5, 13.9)} /></>;
  } else if (t >= 15.6 && t < 19.9) {
    const knobX = (pct: number) => 1014 + Math.min(1, pct) * 228;
    const target: [number, number] = t < T.satPull[0] ? [knobX(v.flash / 100), 152] : t < T.punchPull[0] ? [knobX(v.sat / 300), 212] : [knobX(v.punch / 100), 272];
    robot = {
      x: 540, y: 445, seed: s,
      eyes: hype > 0.3 ? 'spiral' : t > 18.6 ? 'happy' : 'narrow',
      shades: t >= T.shades ? (t < 18.6 ? 'on' : 'head') : 'none',
      arm: {tx: target[0], ty: target[1], hold: 'glove'},
    };
  } else if (t >= 19.9 && t < T.leap[0]) {
    const p = seg(t, T.runRight[0], T.runRight[1]);
    robot = {x: lerp(540, 660, p), y: 560 - Math.abs(Math.sin(t * 10)) * 10, seed: s, eyes: 'happy', shades: 'head', walk: t * 5};
    if (Math.floor(t * 5) % 2 === 0) extra = <Dust x={lerp(540, 660, p) - 30} y={596} s={0.6} o={0.8} />;
  } else if (t >= T.leap[0] && t < T.leap[1]) {
    const p = seg(t, T.leap[0], T.leap[1]);
    robot = {x: lerp(660, 936, p), y: lerp(560, 446, p) - Math.sin(p * Math.PI) * 130, seed: s, eyes: 'happy', shades: 'head'};
  } else if (t >= T.leap[1] && t < T.ding[0]) {
    robot = {x: 936, y: 446, seed: s, eyes: 'narrow', shades: 'head', arm: {tx: 1154, ty: 35, hold: 'glove'}};
  } else if (t >= T.ding[0] && t < 26.6) {
    robot = {x: 936, y: 430 - Math.abs(Math.sin((t - T.ding[0]) * 9)) * 22, seed: s, eyes: 'happy', shades: 'head', armsUp: true};
    extra = <><Dust x={905} y={470} s={0.8} o={0.9} /><Dust x={968} y={472} s={0.7} o={0.9} /></>;
  }

  const sceneEl =
    scene === 'night' ? <NightCity t={t} seed={2} /> :
    scene === 'ramen' ? <Ramen t={t} seed={3} /> :
    scene === 'focus' ? <FocusBlur t={t} seed={4} /> :
    scene === 'shiba' ? <Shiba t={t} seed={5} mood={t > 14.9 ? 'calm' : 'happy'} hearts={t > 13 ? 2 : 1} /> :
    scene === 'disco' ? <Disco t={t} seed={6} hype={hype} /> : null;

  const frameDraw = seg(t, 0.9, 1.15);
  const perim = 2 * (1260 + 704);
  const pencilP = seg(t, 1.0, 1.3);
  const pencilPos = (() => {
    const d = pencilP * 2 * (258 + 316);
    if (d < 258) return [24 + d, 66];
    if (d < 258 + 316) return [282, 66 + (d - 258)];
    if (d < 516 + 316) return [282 - (d - 574), 382];
    return [24, 382 - (d - 832)];
  })();

  const bg = hype > 0 ? `rgb(${Math.round(lerp(244, 253, hype))}, ${Math.round(lerp(239, 246, hype))}, ${Math.round(lerp(230, 200, hype))})` : PAPER;

  return (
    <AbsoluteFill style={{backgroundColor: bg, ['--font-hand' as string]: fontFamily, ['--font-pen' as string]: penFamily}}>
      <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', filter: `saturate(${1 + hype * 1.7})`}}>
        {t >= 0.9 && (
          <g transform={cam}>
            {/* outer frame */}
            <path d={sketchRect(10, 8, 1260, 704, 14, s, 1.6)} fill="none" stroke={INK} strokeWidth={2.6} strokeDasharray={perim * 1.3} strokeDashoffset={perim * 1.3 * (1 - frameDraw)} />
            <g opacity={seg(t, 0.92, 1.08)}><TopBar t={t} frame={frame} /></g>
            <MediaPanel t={t} frame={frame} />
            <AdjustPanel t={t} frame={frame} />
            <Timeline t={t} frame={frame} />
            {/* phone */}
            <g opacity={seg(t, 1.1, 1.35)}>
              <Phone x={540} y={64} seed={7} controls={scene === 'black' ? 'play' : t > 4.4 && t < 23.4 ? 'pause' : 'play'}>
                {sceneEl}
                {glitch > 0 && (
                  <g>
                    <g opacity={0.55} transform={`translate(${4 * Math.sin(t * 90)} 0)`} style={{filter: 'hue-rotate(120deg)'}}>{sceneEl}</g>
                    <g opacity={0.55} transform={`translate(${-4 * Math.sin(t * 70)} 2)`} style={{filter: 'hue-rotate(-120deg)'}}>{sceneEl}</g>
                    <rect y={60 + (frame % 5) * 40} width={184} height={10} fill="#fff" opacity={0.4} />
                  </g>
                )}
                {scene === 'shiba' && txt && (
                  <text x={92} y={216} fontSize={23} fill="#f2b53a" textAnchor="middle" style={{fontFamily, fontWeight: 700}} stroke={INK} strokeWidth={5} paintOrder="stroke" strokeLinejoin="round">{txt}</text>
                )}
              </Phone>
            </g>
            {/* drawing pencil */}
            {pencilP > 0 && pencilP < 1 && (
              <g transform={`translate(${pencilPos[0]} ${pencilPos[1]}) rotate(40)`}>
                <rect x={-3} y={-16} width={6} height={20} rx={2} fill="#f2b53a" stroke={INK} strokeWidth={1.4} />
                <path d="M -3 4 L 0 11 L 3 4 Z" fill={INK} />
              </g>
            )}
            {/* effects in world space */}
            <Trash t={t} t0={T.trashIn} t1={8.4} x={505} y={655} frame={frame} />
            <Keycap t={t} t0={T.keycap[0]} t1={T.keycap[1]} x={300} y={600} frame={frame} />
            <FlyingIcon t={t} t0={T.swirlFly[0]} t1={T.swirlFly[1]} from={[93, 145]} to={[X0 + 2.4 * PPS, 500]} kind="swirl" />
            <FlyingIcon t={t} t0={T.pageFly[0]} t1={T.pageFly[1]} from={[213, 145]} to={[X0 + L.shiba[0] * PPS, 500]} kind="page" />
            {robot && <Robot {...robot} />}
            {extra}
            <Bubble t={t} t0={T.kaigong[0]} t1={T.kaigong[1]} x={228} y={342} w={92} text="开工！" tx={210} ty={400} frame={frame} />
            <Bubble t={t} t0={T.zzz[0]} t1={T.zzz[1]} x={498} y={400} w={160} text="这段在发呆 zzz" tx={520} ty={452} frame={frame} size={14} />
            <Bubble t={t} t0={T.qingshuang[0]} t1={T.qingshuang[1]} x={196} y={318} w={92} text="清爽！" tx={210} ty={380} frame={frame} />
            <Bubble t={t} t0={T.tailiang[0]} t1={T.tailiang[1]} x={196} y={470} w={150} text="……太亮了" tx={300} ty={520} frame={frame} size={15} />
            <Bubble t={t} t0={T.sweat[0]} t1={T.sweat[1]} x={908} y={478} w={70} text="..." tx={940} ty={520} frame={frame} />
            {t >= T.sweat[0] && t < T.sweat[1] && <path d="M 900 560 q -5 8 0 12 q 6 -4 0 -12" fill="#8fd4e8" stroke={INK} strokeWidth={1.2} />}
            <SfxText t={t} t0={T.shua[0]} t1={T.shua[1]} x={700} y={350} size={40} fill="#e86a8a" text="唰！" frame={frame} />
            <SfxText t={t} t0={T.kuangdang[0]} t1={T.kuangdang[1]} x={660} y={480} size={38} fill="#f2b53a" text="哐当！" frame={frame} rot={3} />
            <SfxText t={t} t0={T.kongxin[0]} t1={T.kongxin[1]} x={480} y={330} size={32} fill="#4a9e8f" text="空心入网!" frame={frame} rot={-2} />
            <SfxText t={t} t0={T.undo[0]} t1={T.undo[1] + 0.1} x={300} y={400} size={34} fill="#4a9e8f" text="撤销!" frame={frame} />
            <SfxText t={t} t0={17.1} t1={18.4} x={820} y={100} size={44} fill="#e83e8c" text="饱和度:拉满" frame={frame} rot={-2} />
            <SfxText t={t} t0={T.kadianText[0]} t1={T.kadianText[1]} x={230} y={405} size={32} fill="#4a9e8f" text="卡点!" frame={frame} />
            <SfxText t={t} t0={T.ding[0]} t1={T.ding[1]} x={930} y={120} size={38} fill="#4a9e5c" text="叮!" frame={frame} />
            <SfxText t={t} t0={26.0} t1={26.7} x={900} y={335} size={30} fill="#b8a03a" text="DONE!" frame={frame} rot={2} />
            <Stamp t={t} t0={T.stamp[0]} t1={16.0} frame={frame} x={960} y={205} />
            <Confetti t={t} t0={T.ding[0]} seed={3} n={30} burst={[1100, 180]} />
          </g>
        )}
      </svg>
      {/* screen-space layers */}
      <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute'}}>
        <CodeWindow t={t} frame={frame} />
        <Outro t={t} frame={frame} />
      </svg>
      {/* audio */}
      <Audio src={staticFile('audio/bgm.wav')} volume={(f) => {
        const tt = f / fps;
        return 0.42 * Math.min(1, tt / 0.5) * (1 - seg(tt, 29, 30));
      }} />
      <Sfx at={0.85} name="whoosh" vol={0.3} />
      <Sfx at={2.0} name="thud" vol={0.4} />
      {T.clipsIn.map((c, i) => <Sfx key={i} at={c} name="pop" vol={0.45} />)}
      <Sfx at={6.9} name="whoosh" vol={0.5} />
      <Sfx at={7.75} name="thud" vol={0.55} />
      <Sfx at={8.9} name="click" vol={0.35} />
      <Sfx at={9.7} name="whoosh" vol={0.35} />
      <Sfx at={10.4} name="pop" vol={0.45} />
      <Sfx at={10.7} name="whoosh" vol={0.3} />
      <Sfx at={11.4} name="pop" vol={0.4} />
      <Sfx at={11.6} name="pop" vol={0.4} />
      <Sfx at={11.9} name="click" vol={0.35} />
      <Sfx at={12.2} name="click" vol={0.3} />
      <Sfx at={13.55} name="key" vol={0.5} />
      <Sfx at={15.0} name="thud" vol={0.5} />
      <Sfx at={16.2} name="click" vol={0.3} />
      <Sfx at={17.0} name="click" vol={0.3} />
      <Sfx at={17.2} name="sparkle" vol={0.4} />
      <Sfx at={18.8} name="click" vol={0.3} />
      <Sfx at={21.0} name="pop" vol={0.4} />
      <Sfx at={22.7} name="whoosh" vol={0.35} />
      <Sfx at={25.9} name="ding" vol={0.6} />
      <Sfx at={26.1} name="sparkle" vol={0.35} />
    </AbsoluteFill>
  );
};