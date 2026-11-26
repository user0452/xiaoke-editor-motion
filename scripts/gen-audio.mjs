// Procedurally synthesizes the soundtrack (cheerful lo-fi BGM + cartoon SFX).
// Run: npm run audio  → writes public/audio/*.wav (committed so renders work offline).
import {writeFileSync, mkdirSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const SR = 22050;
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'audio');
mkdirSync(outDir, {recursive: true});

const buf = (dur) => new Float32Array(Math.ceil(dur * SR));

function tone(b, start, freq, dur, {vol = 0.4, decay = 8, slideTo = 0, harmonics = [1, 0.35, 0.12]} = {}) {
  const s0 = Math.floor(start * SR);
  const n = Math.floor(dur * SR);
  let phase = 0;
  for (let i = 0; i < n && s0 + i < b.length; i++) {
    const t = i / SR;
    const f = slideTo ? freq + (slideTo - freq) * Math.min(1, t / dur) : freq;
    phase += (2 * Math.PI * f) / SR;
    const env = Math.exp(-decay * t) * Math.min(1, t / 0.004);
    let v = 0;
    harmonics.forEach((h, k) => {
      v += h * Math.sin(phase * (k + 1));
    });
    b[s0 + i] += v * env * vol;
  }
}

function noise(b, start, dur, {vol = 0.3, decay = 20, lp = 3000, sweepTo = 0, shape = 'exp'} = {}) {
  const s0 = Math.floor(start * SR);
  const n = Math.floor(dur * SR);
  let last = 0;
  for (let i = 0; i < n && s0 + i < b.length; i++) {
    const t = i / SR;
    const cutoff = sweepTo ? lp + (sweepTo - lp) * (t / dur) : lp;
    const a = Math.min(1, (2 * Math.PI * cutoff) / SR);
    last += a * (Math.random() * 2 - 1 - last);
    const env = shape === 'sin' ? Math.sin(Math.PI * (t / dur)) ** 2 : Math.exp(-decay * t);
    b[s0 + i] += last * env * vol;
  }
}

function writeWav(name, b) {
  const n = b.length;
  const data = Buffer.alloc(44 + n * 2);
  data.write('RIFF', 0);
  data.writeUInt32LE(36 + n * 2, 4);
  data.write('WAVE', 8);
  data.write('fmt ', 12);
  data.writeUInt32LE(16, 16);
  data.writeUInt16LE(1, 20);
  data.writeUInt16LE(1, 22);
  data.writeUInt32LE(SR, 24);
  data.writeUInt32LE(SR * 2, 28);
  data.writeUInt16LE(2, 32);
  data.writeUInt16LE(16, 34);
  data.write('data', 36);
  data.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const v = Math.max(-1, Math.min(1, b[i]));
    data.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
  }
  writeFileSync(join(outDir, name), data);
  console.log('wrote', name, (data.length / 1024).toFixed(0) + 'KB');
}

/* ---------- BGM: 112 BPM, C-Am-F-G, marimba plucks ---------- */
const BPM = 112;
const BEAT = 60 / BPM;
const bgm = buf(30);
const chords = [
  {root: 261.63, scale: [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5]},
  {root: 220.0, scale: [440.0, 523.25, 587.33, 659.25, 783.99, 880.0]},
  {root: 174.61, scale: [349.23, 440.0, 523.25, 587.33, 659.25, 783.99]},
  {root: 196.0, scale: [392.0, 493.88, 587.33, 659.25, 783.99, 987.77]},
];
const patterns = [
  [0, 2, 4, 2, 5, 4, 2, 1],
  [0, 2, 3, 2, 4, 3, 2, 0],
  [2, 4, 5, 4, 3, 2, 1, 0],
  [0, 1, 2, 4, 3, 2, 1, 2],
];
for (let bar = 0; bar * 4 * BEAT < 29.5; bar++) {
  const ch = chords[bar % 4];
  const pat = patterns[bar % 4];
  const barStart = bar * 4 * BEAT;
  for (let e = 0; e < 8; e++) {
    const at = barStart + e * BEAT * 0.5;
    if (at > 29.4) break;
    const note = ch.scale[pat[e]];
    tone(bgm, at, note, 0.3, {vol: e % 2 === 0 ? 0.16 : 0.1, decay: 9});
  }
  for (let beat = 0; beat < 4; beat++) {
    const at = barStart + beat * BEAT;
    if (at > 29.4) break;
    // kick
    tone(bgm, at, 110, 0.1, {vol: 0.22, decay: 16, slideTo: 45, harmonics: [1]});
    // bass on 1 & 3
    if (beat % 2 === 0) tone(bgm, at, ch.root / 2, 0.4, {vol: 0.18, decay: 5, harmonics: [1, 0.2]});
    // hat offbeat
    noise(bgm, at + BEAT * 0.5, 0.04, {vol: 0.05, decay: 40, lp: 7000});
  }
  // sparkle bell every 2 bars
  if (bar % 2 === 1) tone(bgm, barStart + 3.5 * BEAT, ch.scale[5] * 2, 0.4, {vol: 0.05, decay: 6});
}
writeWav('bgm.wav', bgm);

/* ---------- SFX ---------- */
const pop = buf(0.12);
tone(pop, 0, 480, 0.1, {vol: 0.5, decay: 30, slideTo: 900, harmonics: [1]});
noise(pop, 0, 0.02, {vol: 0.15, decay: 60, lp: 4000});
writeWav('pop.wav', pop);

const whoosh = buf(0.3);
noise(whoosh, 0, 0.28, {vol: 0.5, lp: 500, sweepTo: 5000, shape: 'sin'});
writeWav('whoosh.wav', whoosh);

const thud = buf(0.25);
tone(thud, 0, 150, 0.2, {vol: 0.6, decay: 14, slideTo: 48, harmonics: [1]});
noise(thud, 0, 0.06, {vol: 0.25, decay: 40, lp: 900});
writeWav('thud.wav', thud);

const ding = buf(0.8);
tone(ding, 0, 1318.5, 0.7, {vol: 0.35, decay: 3.5, harmonics: [1]});
tone(ding, 0, 1975.5, 0.6, {vol: 0.15, decay: 4, harmonics: [1]});
tone(ding, 0.02, 2637, 0.4, {vol: 0.08, decay: 5, harmonics: [1]});
writeWav('ding.wav', ding);

const click = buf(0.05);
noise(click, 0, 0.03, {vol: 0.35, decay: 90, lp: 3000});
writeWav('click.wav', click);

const key = buf(0.1);
noise(key, 0, 0.04, {vol: 0.4, decay: 60, lp: 1500});
tone(key, 0, 220, 0.06, {vol: 0.2, decay: 40, harmonics: [1]});
writeWav('key.wav', key);

const sparkle = buf(0.5);
[1046.5, 1318.5, 1568, 2093].forEach((f, i) => tone(sparkle, i * 0.06, f, 0.3, {vol: 0.16, decay: 8, harmonics: [1]}));
writeWav('sparkle.wav', sparkle);

console.log('audio done');