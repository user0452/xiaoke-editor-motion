import {lerp, seg, track} from './anim';

// Master story timeline (seconds). 30s total.
export const T = {
  codeEnd: 0.9,
  robotIn: 1.7,
  kaigong: [2.0, 2.7] as const,
  dragStarts: [2.1, 2.7, 3.3, 3.9] as const,
  clipsIn: [2.55, 3.15, 3.75, 4.3] as const,
  audioIn: 4.1,
  focus: [5.6, 6.9] as const,
  zzz: [6.0, 7.0] as const,
  shua: [6.9, 7.7] as const,
  trashIn: 7.1,
  drop: 7.6,
  kuangdang: [7.7, 8.5] as const,
  gapClose: [7.9, 8.4] as const,
  qingshuang: [8.3, 9.0] as const,
  tabTrans: 8.9,
  swirlFly: [9.7, 10.4] as const,
  kongxin: [10.2, 11.1] as const,
  pageFly: [10.7, 11.4] as const,
  zoomBadge: 11.6,
  tabText: 11.9,
  textClipGrow: [12.2, 12.6] as const,
  type1: [12.7, 13.4] as const,
  undo: [13.5, 14.1] as const,
  keycap: [13.4, 14.7] as const,
  type2: [14.2, 14.9] as const,
  stamp: [15.0, 15.7] as const,
  flashPull: [16.2, 16.9] as const,
  satPull: [17.0, 17.5] as const,
  hype: [17.2, 18.1] as const,
  shades: 17.9,
  tailiang: [18.0, 18.9] as const,
  settle: [18.3, 18.8] as const,
  punchPull: [18.8, 19.5] as const,
  runRight: [20.0, 22.4] as const,
  beats: [20.3, 22.5] as const,
  kadianBtn: 21.0,
  kadianText: [22.0, 22.9] as const,
  leap: [22.7, 23.4] as const,
  render: [23.6, 25.9] as const,
  sweat: [25.0, 25.9] as const,
  ding: [25.9, 26.7] as const,
  outro: [26.5, 27.4] as const,
  paper: [27.0, 29.6] as const,
  naliele: 29.0,
};

export const X0 = 100; // timeline 0:00 pixel
export const PPS = 71; // pixels per second

// clip boundaries in timeline-seconds
export const PRE_CUT = {night: [0, 2.4], ramen: [2.4, 7.0], gray: [4.0, 6.2], shiba: [7.0, 9.9], disco: [9.9, 12.7]};
export const POST_CUT = {night: [0, 2.4], ramenA: [2.4, 4.0], ramenB: [4.0, 4.8], shiba: [4.8, 7.7], disco: [7.7, 10.5]};

export const gapP = (t: number) => seg(t, T.gapClose[0], T.gapClose[1]);

// current clip layout interpolated across the cut
export function clipLayout(t: number) {
  const p = gapP(t);
  const mix = (a: [number, number], b: [number, number]) => [lerp(a[0], b[0], p), lerp(a[1], b[1], p)] as [number, number];
  return {
    night: mix(PRE_CUT.night, POST_CUT.night),
    ramenA: mix([PRE_CUT.ramen[0], PRE_CUT.gray[0]], POST_CUT.ramenA),
    gray: PRE_CUT.gray,
    ramenB: mix([PRE_CUT.gray[1], PRE_CUT.ramen[1]], POST_CUT.ramenB),
    shiba: mix(PRE_CUT.shiba, POST_CUT.shiba),
    disco: mix(PRE_CUT.disco, POST_CUT.disco),
    cut: p >= 1,
  };
}

export function playheadSec(t: number): number {
  return track(t, [
    [0, 0.2], [4.4, 0.2], [5.2, 2.6], [5.6, 3.2], [6.9, 5.0], [8.9, 4.0],
    [9.0, 0.4], [10.2, 2.4], [11.2, 5.6], [12.2, 6.2], [15.6, 7.2],
    [16.3, 8.0], [20.0, 8.6], [23.4, 10.5], [30, 10.5],
  ]);
}

export function sliders(t: number) {
  const flash = track(t, [[0, 0], [T.flashPull[0], 0], [T.flashPull[1], 70], [30, 70]]);
  const sat = track(t, [[0, 100], [T.satPull[0], 100], [T.satPull[1], 300], [T.settle[0], 300], [T.settle[1], 110], [30, 110]]);
  const punch = track(t, [[0, 0], [T.punchPull[0], 0], [T.punchPull[1], 60], [30, 60]]);
  return {flash, sat, punch, speed: 1.0};
}

export type PhoneScene = 'black' | 'night' | 'ramen' | 'focus' | 'shiba' | 'disco';
export function phoneScene(t: number): PhoneScene {
  if (t < 4.4) return 'black';
  if (t < 5.2) return 'night';
  if (t < T.focus[0]) return 'ramen';
  if (t < T.focus[1]) return 'focus';
  if (t < 8.9) return 'ramen';
  if (t < 10.2) return 'night';
  if (t < 11.2) return 'ramen';
  if (t < 15.6) return 'shiba';
  return 'disco';
}

export function outroScene(t: number): PhoneScene {
  if (t < 27.2) return 'night';
  if (t < 28.0) return 'ramen';
  return 'disco';
}

// typed sticker text on the phone / text clip
export function stickerText(t: number): string {
  const full1 = '前方高能预';
  const full2 = '前方高能预警';
  if (t < T.type1[0]) return '';
  if (t < T.undo[0]) return full1.slice(0, Math.ceil(seg(t, T.type1[0], T.type1[1]) * full1.length));
  if (t < T.type2[0]) return '';
  if (t < T.type2[1]) return full2.slice(0, Math.ceil(seg(t, T.type2[0], T.type2[1]) * full2.length));
  return full2;
}

export const hypeAmount = (t: number) => {
  const up = seg(t, T.hype[0], T.hype[0] + 0.25);
  const down = 1 - seg(t, T.hype[1] - 0.3, T.hype[1]);
  return Math.min(up, down);
};

export const exportProgress = (t: number) => {
  if (t < T.render[0]) return -1;
  if (t < T.ding[0]) {
    const p = seg(t, T.render[0], T.render[1]);
    return Math.min(99.99, Math.round(p * 100 * 100) / 100);
  }
  return 100;
};