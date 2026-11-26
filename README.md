# xiaoke-editor-motion

Hand-drawn style **Remotion** replica of the motion clip “小克 30 秒剪完一条视频”
(reference: <https://motionface.cc/?recording=e3ee409a-50f7-4b4a-af27-288226e47a57>).

A tiny red robot (“小克”) codes a video editor into existence, then drags clips, cuts the
boring part, adds transitions & stickers, undo-redoes a typo, pulls the saturation slider
to “爆表”, places beat markers, renders and ships the final vertical video — all in 30 s.

- **1280×720 · 30 fps · 900 frames (30 s)**
- Everything is code: wobbly “boiling” ink lines, SVG scenes (night city / ramen / shiba / disco),
  keyframed camera pans & zooms, and a **procedurally synthesized** soundtrack (no external assets).

## Quick start

```bash
npm install          # install deps (lockfile committed)
npm start            # open Remotion Studio at http://localhost:3000
npm run build        # render out/xiaoke-editor-motion.mp4 (H.264 + AAC)
npm run still        # render a single preview frame
npm run audio        # (optional) regenerate public/audio/*.wav from scripts/gen-audio.mjs
```

The synthesized BGM/SFX WAVs are committed under `public/audio/`, so renders work offline.

## Storyboard

| Time | Beat |
| --- | --- |
| 0.0–0.9 | Terminal types `const 剪辑软件 = 小克.写代码()` … `小克.钻进去()` |
| 0.9–1.7 | Editor draws itself in; robot drops onto the timeline — “开工！” |
| 2.1–4.4 | Drags 夜景 / 拉面 / 柴犬 / 小克蹦迪 onto the timeline, BGM waveform slides in |
| 5.6–8.4 | Spots the “对焦中… 这段在发呆 zzz” segment → “唰！” cut → trash can “哐当！” → “清爽！” |
| 8.9–11.9 | Transitions tab: 旋转 / 翻页 / 缩放 badges fly in — “空心入网!” |
| 11.9–15.7 | Sticker “前方高能预…” → Ctrl+Z “撤销!” → retypes “前方高能预警” → “已修正” stamp |
| 15.6–19.8 | Stretchy arm pulls 闪光 70% / 饱和度拉满 “爆表!!” (screen flash, sunglasses) / 缩放冲击 60% |
| 20.0–23.4 | Runs the timeline dropping beat markers — “卡点!” |
| 23.6–26.4 | Pulls the export button: 渲染中 99.99% → “叮! DONE!” → 完成 ✓ |
| 26.5–30 | UI fades, phone plays the published video (likes tick up), paper note: “30 秒剪完, Opus 5.5 — 小克 收工 ✦”, “拿捏了!” |

## Structure

```
src/
  Main.tsx               camera keyframes, robot state machine, event orchestration, audio cues
  Root.tsx / index.ts    composition registration
  lib/sketch.ts          seeded hand-drawn rect/line/circle paths (“boiling” ink)
  lib/anim.ts            easing / keyframe-track helpers
  lib/timing.ts          master story timeline, clip layout, slider & playhead curves
  components/
    panels.tsx           top bar, media/transition/text panel, adjust sliders, timeline
    scenes.tsx           phone-screen scenes: night city, ramen, shiba, disco, focus-blur
    Phone.tsx            phone shell + playback controls
    Robot.tsx            mascot: stretchy arm, eyes, sunglasses, walk/squash
    effects.tsx          SFX text, speech bubbles, stamp, Ctrl+Z keycap, trash, confetti
    CodeWindow.tsx       opening terminal typing
    Outro.tsx            faded UI, published-video phone, paper note, waving robot
scripts/gen-audio.mjs    procedural BGM (112 BPM) + cartoon SFX → public/audio/*.wav
```

## Notes

- Fonts: ZCOOL KuaiLe (hand lettering) + Long Cang, loaded via `@remotion/google-fonts`.
- The replica is a fan re-creation drawn from scratch in code; no frames or audio are copied
  from the reference video.