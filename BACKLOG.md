# Progress / handoff

## Shipped 2026-10-10
- [x] Original illustrated responsive storybook map and starter village
- [x] First five hiragana with reading, optional browser Japanese voice, mouse/touch/pen tracing, 4-choice recognition and local journal
- [x] Full 46-hiragana chart with future characters visibly locked
- [x] Live at https://nihongo.kiwinokoto.fr on personal VPS (Docker `nihongo-web` behind existing Traefik); deployed application commit `e7c764f084eee0ccb94547d498060082ea2acd3a` from PR #1
- [x] Production checks: valid Let's Encrypt cert, healthy container, HTTP 200 for page/`healthz`/JS/illustrations, Chromium end-to-end drawing → recognition → saved progress after reload, 390px mobile viewport without horizontal overflow, no page errors
- [ ] Test on Angela's real phone/touch device, including actual Japanese speech-synthesis voice
- [ ] Audit screen-reader/keyboard accessibility, cache/performance and cross-browser appearance

## Second pass — released (2026-10-10)
- [x] 46 official stroke-order animated kana SVGs from pinned AnimCJK source (attribution and LGPL texts bundled)
- [x] Ten groups of hiragana, progressive unlock, collection rows, retained V1 progress
- [x] Friendly number-of-strokes guidance, guide replay and deliberate no-grading writing practice
- [x] Locally scheduled reviews and wrong-answer retry (no account/server DB)
- [x] Node model tests (9/9), Chromium desktop + simulated mobile and production browser smoke
- [x] Merged via PR #3, deployed app commit `b3abfbf0c007da3ef744983cd27c524151cc32db`, verified container healthy, valid HTTPS, HTTP 200 for `/healthz`, page, modules, SVGs, and production Chromium flow (5 vowel quiz answers → K row, persistence, due review, no JS errors)
- [ ] Field-test real device touch/voice and keyboard/screen reader

## Next slices
- Optional evaluated handwriting matcher for free drawing; automatic writing verification is **not implemented**
- More hiragana rows, adaptive review and spaced repetition
- Tea-house conversations around food and everyday phrases
- Katakana station and first contextual kanji in the forest/shrine
- Optional progress export/backup or sync with a considered privacy model

## Design / safety
- Map stays simple; future destinations explicitly display "coming soon".
- No reusing unlicensed images from earlier searches. SVGs are original and generated with `tools/draw_landscape.py`.
- Drawing records self-reported practice only; recognition checks unlock collected sounds.
- Browser TTS only attempts Japanese when a ja voice is available.
- No learner profiles or secrets in GitHub, and no application analytics; standard reverse-proxy and HTTP server logs may record IP addresses.
- The runtime is static, no database. Progress is in localStorage only and may be lost if browser data is cleared.
- VPS source checkout at `/opt/nihongo` is the **deployed application commit**, while later doc-only changes may advance GitHub `main` without rebuild. Compare GitHub state before every future deploy.
