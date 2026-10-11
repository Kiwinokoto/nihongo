# Kotoba no Tabi — working agreement

> **Production verified (11 October 2026):** Kanji Shrine PR #34 merged and application commit 65046ba221c0f95fa24727a0636d227a5635afe0 deployed in only nihongo-web. Original owner-approved illustrated scene locally hosted as assets/art/kanji-shrine.webp (1200×720, SHA256 be52e628...); healthy Docker image sha256:72051fc92208..., valid TLS, homepage and /healthz 200, 71 other container names unchanged. Prior image tagged nihongo-rollback:fbdd8a6. 57/57 Node tests and desktop/mobile Chromium walked all eight gates **on the public domain**; no site JS page errors, horizontal overflow, or storage mutation. Mac/Safari physical testing, Japanese teacher review, and audio voice fidelity remain pending. Later markdown-only merges require no rebuild.

> **New chapter under test (11/10/2026):** first eight-kanji shrine walk, open without kana prerequisites, with the exact owner-approved woodland torii scene optimised to 1200px WebP. No progress storage, no handwriting grading or story unlock manipulation; see docs/KANJI_SHRINE.md. Browser and production validation must be recorded before claiming release. Preserve the old map/hero/art and live Nginx app until successful preflight.

> **Latest verified release (11/10/2026):** The eight-word Katakana town practice is live at nihongo.kiwinokoto.fr. PR #32 merged, deployed app commit fbdd8a68d82176df62ec1525ad285452cafe3019; Docker image c449e613b5f0... healthy, domain/health HTTPS 200, old image retained as nihongo-rollback:2e4e3a4. Node 54/54 and public desktop/mobile Chromium (1350/390px) passed, including shared handwriting retry. Other 71 containers unchanged. Real Safari and Japanese-human audio review remain pending. Later documentation-only HEAD may be newer than app; do not redeploy just for docs.

> **Katakana town word walk (11/10/2026):** Optional Words around town enters from Katakana Station only, away from the homepage/map. Eight authentic katakana words, hidden-until-requested readings, four-choice meanings and Japanese whole-word audio only when the OS/browser supplies a ja voice. The quiz is session-only: no storage, achievement, basic-kana recognition or handwriting-grade changes. See docs/KATAKANA_WORDS.md; human Japanese proofreading, real Mac/Safari and a full recorded-audio set remain pending.

> **Déploiement confirmé (11/10/2026) :** PR #30 fusionnée, application `2e4e3a41ccafc77b67c636c91e94fd5bdbe7207d` sur `nihongo.kiwinokoto.fr`, conteneur `nihongo-web` sain, HTTPS/healthz `200`, nouvel asset vérifié, autres conteneurs inchangés. Image de retour arrière `nihongo-rollback:a3a660d`. **51 tests Node** et syntaxe OK ; pas de nouvelle E2E Chromium, ni test Safari/Mac réel. Un futur commit uniquement documentaire ne justifie pas de redéploiement.


> **Quality follow-up (11/10/2026):** In the shared hiragana/katakana mixed check, a learner can now choose **Draw this character again** after revealing the reference. This restarts the *same unsaved writing prompt*, blank canvas and hidden model; it never collects a kana, increments the checkpoint, changes self-ratings, or grades handwriting. Keep this escape hatch while reviewing pedagogy and accessibility.

> **Passation actuelle (11/10/2026) :** lire d'abord [docs/HANDOFF_NEXT_CHAT.md](docs/HANDOFF_NEXT_CHAT.md). Les 28 branches des PR #1–#28, toutes fusionnées, ont été nettoyées ; `main` est la seule branche à conserver après la PR de documentation. Prochaine session : **sans RDC Mint**, avec connecteur GitHub et accès VPS autorisé. Le commit déployé `a3a660d` peut être derrière `main` pour des raisons **documentaires**, ne pas redéployer de simples docs. Vérifier AgentCtl ; une session concurrente utilisait `host:vps-personal/docker` pendant la clôture. Ne pas confondre contrôle sonore automatique et autoévaluation de l'écriture.

## Purpose
Public, lighthearted Japanese-learning microsite for Angela: gentle storybook map, short audio/reading challenges, beginner kana tracing, future katakana/kanji spaces. The UI is in English.

## Source of truth / coordination
- Canonical GitHub repo: `Kiwinokoto/nihongo`; project identity in `.agentctl.json`.
- Before writing inspect GitHub branch/remote/latest commits and any local changes, then acquire AgentCtl lease `repo:Kiwinokoto/nihongo`. Never overwrite another agent's work or bypass a lease.
- For deployment acquire `service:nihongo`, `deploy:vps-personal/nihongo` and `host:vps-personal/docker` with a live session, and verify independent existing containers remain untouched.
- Develop on `dev/*`, run targeted tests and browser checks, use PR/CI protections; never force-push. Promote only after tests and user-authorised release.
- Keep repository public. Do not commit secrets, tokens, SSH keys, user profiles, source-machine paths, browser storage or logs.

## First pass (2026-10-10)
- Static zero-build HTML, CSS, vanilla JS, original procedurally generated SVG; no server data or user accounts.
- 46-kana chart displayed; first five vowels active. Discover, Japanese TTS if browser has a ja voice, tracing canvas, 4-way recognition challenge, local browser journal.
- Only recognition challenge grants the collected state. Tracing is self-reported practice with **no handwriting correctness or stroke-order recognition**. Do not describe it otherwise.
- Unimplemented tea house, katakana and shrine remain labelled coming soon. Do not unlock broken paths.
- Keep navigation small and explicit, informed by ADA's activity states and variable levels; no direct coupling to LGC Portail.
- No personal data is collected. LocalStorage progress is browser/device-specific; sync and backup are future work.
- SVGs are original and generated by `tools/draw_landscape.py`. Do not copy unlicensed reference images.

## Second pass — hiragana garden V2 (2026-10-10)
- 46 basic hiragana divided into ten contiguous rows (last rows may be shorter); next row unlocks after the previous row's recognition quizzes are collected.
- `assets/progression.js` is the pure, testable progression and review-state owner. V1 localStorage data must remain readable without reset. Review intervals are 1/3/7/14/30 days; wrong reviews become due again in one hour; offline clock cannot be trusted as an assessment authority.
- `assets/strokes/*.svg` are UNMODIFIED upstream AnimCJK Japanese kana SVGs, LGPL-3.0-or-later. Provenance/pinned source + full licence live under `licenses/`; reimport only intentionally using `tools/sync_kana_strokes.py`. Do not misattribute them as original artwork.
- Show visually correct animated stroke order and friendly stroke-count hints. **Never** grade handwriting shape, direction, or stroke order from free drawing: no reliable recogniser is implemented. Self-reported tracing must never unlock a row.
- Keep the public site as one compact garden; do not reopen unrelated paths until their real content exists.

## Third pass — creative direction and optional word postcards (2026-10-10)
- Future **BL romance easter-egg** direction is documented in `docs/CREATIVE_DIRECTION.md`, with official publisher references. It is only a design note: nothing romance-specific is visible in the live app yet. Use original, tasteful, optional adult characters and scenes; do not copy copyrighted characters/art or put romance into basic lessons. Do not store individual readers' preferences in this public repository.
- An extra "Little word postcards" view is accessible from **My collection**, not from the primary map. The main map, initial hero and existing lesson paths must stay untouched.
- `assets/word-trails.js` owns a limited vetted hiragana-only word list and pure readiness checks. `assets/word-postcards.js` owns the UI. Unlock requires collected kana, while the optional word meaning quiz collects postcards but must **not** unlock hiragana rows.
- Store these optional collectibles under a **separate localStorage key** `kotoba-no-tabi.word-postcards.v1`. Do not mutate the kana-progress schema or reset V1/V2 saves. No server-side tracking.
- If a real audio lesson is added later, don't imply a Japanese device TTS voice is universally available; preserve the fallback.

## Fourth pass — Lantern Evening (2026-10-10)
- The optional, original three-scene Lantern Evening story is **inside word postcards**, not the main map, and appears only after collecting at least one *word* postcard. It must never gate kana or word progression. The story does not store view history or learner attributes.
- `assets/lantern-evening.js` owns the short narrative, navigation and translated Japanese phrases. `assets/stories/lantern-{1,2,3}.svg` are **original** SVG art generated by `tools/draw_lantern_evening.py`, not copied from manga/media. Preserve adult, mutual, gentle subtext and no identifying personal profile.
- Use device-provided Japanese voice only when installed. The phrases are beginner-friendly glimpses, **not** automatically mastered vocabulary. Request fluent-human proofreading before formal curriculum use. Do not claim writing or spoken-proficiency assessment.
- Regression tests must demonstrate clean V1-V3 progress and unchanged homepage/map, keyboard navigation, three scenes on desktop/mobile, image decoding and zero external assets.

## Fifth pass — small savoury food lane (2026-10-10)
- The former locked `tea` map stop becomes a **playable little food lane**, at the SAME location and without changing scenery, hero layout or other map stops.
- Food experience is **savoury-first**: grilled fish, yakitori, takoyaki, nattō with sticky strands, okonomiyaki and eel. This is an editorial/product direction, not a personal profile; do not record identifiable learner preferences in the public repo or browser.
- `assets/food-lane-data.js` is the pure six-dish menu and optional saved orders; `assets/food-lane.js` is the dialog-driven UI. `assets/food-lane.svg` is original art generated with `tools/draw_food_lane.py`.
- Food activity is available without gating kana; it must never modify the V1-V4 kana, word-postcard or story records. Its only localStorage key is `kotoba-no-tabi.food-lane.v1`.
- The ordering quiz demonstrates `Xをください`. The browser's Japanese TTS voice is optional; fallback must be clear. Do not claim complete conversational training, native audio recordings or mastery of kanji from this activity.
- Keep module independent and rollback-safe. Test current hiragana, postcards, lantern story and food lane together (desktop and simulated mobile).

## Sixth pass — village / katakana and local Japanese voice check (2026-10-11)
- Real starting village welcome panel (three practical onward paths + local browser voice check) replaces the previous duplicate "start" action. The **hero's Begin exploring still goes to Hiragana** so existing learning flows remain stable.
- Katakana station is a standalone dialog with 46 **basic** katakana divided into 10 rows, accessible directly from the map. Learner progress lives exclusively under `kotoba-no-tabi.katakana.v1`; no carryover of hiragana mastery. Mastery is by 4-choice recognition only. Tracing remains ungraded.
- Unmodified AnimCJK katakana SVGs under `assets/katakana-strokes/` sourced from pinned upstream `ec5e17cca76c87587790bcbce5ea0b4d4fb753d6` via `tools/sync_katakana_strokes.py`, with upstream LGPL-3-or-later attribution headers retained. See `licenses/ANIMCJK.md`. Do not pretend artwork is original.
- `assets/starting-village.js` inspects only voices exposed by `speechSynthesis.getVoices()` (ja*). No microphone, server storage or remote TTS. Unsupported voices must be surfaced honestly, not silently substituted with French/English. Actual device Japanese voice and quality are unverified.
- Keep source JS/CSS/HTML revalidated: nginx Cache-Control `no-cache, must-revalidate` on stable asset URLs (old page screenshots may be stale, but caching cause unproven). No external infra/service changes.
- Validate all earlier V2–V5 browser flows after any change. Real touch, Japanese TTS and linguistic proofreading still require field testing.

## Seventh pass — macOS audio fallback, modal comfort and destination art (2026-10-11)
- All five existing native modal dialogs now dismiss on backdrop click **only for fine-pointer mouse/trackpad input (never for pen or touch)**; the pointer must begin and end outside the dialog geometry. Never dismiss when clicking dialog content, dragging from inside, or accidentally touching outside on mobile. Escape and close buttons still work. Sticky modal headers keep close controls accessible after scrolling.
- `assets/starting-village.js` offers a collapsed macOS help section based on Apple's Accessibility → Read & Speak / System Voice, without changing locale or installing anything for users. Never claim that browsers can install voices automatically.
- `assets/japanese-audio.js` prefers a detected ja* native TTS voice; otherwise it plays **only five isolated locally hosted Japanese vowel recordings** under `assets/audio/kana/`. This covers the first 5 hiragana **and** katakana. The recordings are Commons PD-self from Hakatanoshio117117, transcoded to MP3 and sourced in `docs/AUDIO_SOURCES.md`, with source SHA256 pinned in `tools/fetch_kana_audio.py`. Other syllables/phrases need a native voice or a later vetted human-recorded set. Never auto-play a non-Japanese voice as Japanese.
- New original procedural panoramas: `assets/art/village-path.svg` and `assets/art/katakana-platform.svg` generated by `tools/draw_destinations.py`. Use only inside the village welcome and katakana station; preserve the original main-map/hero artwork and learner layout. Both include subtle, original adult traveller motifs; no copyrighted manga assets.
- Browser test on macOS/Safari remains pending; passing Chromium on Linux does NOT guarantee installed Japanese system voices, voice quality or accurate Mac UI steps across all OS releases. No changes to local learner progress schema or infrastructure.

## Eighth pass — calm home and visible original travellers (2026-10-11)
- The homepage must **not** send users directly to the hiragana lesson from a generic `Begin exploring` button. The map is the actual main navigation; a smaller decorative hero simply invites a destination choice. Keep all stops and existing teaching flows accessible from the map and journal.
- The same **original** `assets/art/village-path.svg` is used in the hero and village dialog; generated reproducibly by `tools/draw_destinations.py`, including two **adult male** travellers with distinct designs and matching little charms. No named licensed BL characters, no identifying reader profiles, no implication of official media partnerships.
- A subtle nonspoiler story hint in **Hiragana → My collection → Explore words** helps learners discover the optional Lantern Evening, which remains gated on one earned word postcard. No automatic story popups or effects on learning progress.
- The existing 46 basic hiragana + 46 basic katakana do **not** include all derived Japanese syllables; do not oversell completeness. Dakuten, handakuten, small kana, yōon, sokuon, long vowels and loanword variants are subsequent content.
- Candidate handwriting recognition is only **planned** under `docs/HANDWRITING_POC.md`: AnimCJK provides usable animated centreline vector paths, but the app does NOT automatically recognise or grade drawings. The experiment should be optional and isolated to five vowels with false-negative/false-positive calibration, not a production assessment or a CFA scoring method.

## Ninth pass — expanded kana readings and earned close-up (2026-10-11)
- Preserve the **46 basic hiragana and 46 basic katakana curricula and progress keys unchanged**. The derived-reading workshop is an optional, separate dialog opened from each; its own localStorage key is `kotoba-no-tabi.advanced-kana.v1` and it may be accessed before all basic rows are collected.
- `assets/advanced-kana-data.js` is the testable source of 70 hiragana and 94 katakana **reading cards**, NOT 164 extra independent letters. Groups cover 25 voiced kana, 33 contracted yōon per script, nine small helpers per script, plus modern katakana borrowed-sound combinations and whole-word rhythm examples. An advanced card is collected only after a correct **reading-choice** answer. Recognition here is reading practice, not graded writing or speaking.
- Carefully explain rare overlapping pronunciations: ぢ/じ and づ/ず are generally homophonous in modern standard Japanese; never create false audio distinctions. Small kana usually modify their neighbours. Long `ー` is taught in word context and is not a separately pronounced syllable. No new licensed audio: native ja TTS or the existing limited fallback, otherwise written practice.
- Reward postcard is derived from **eight unique advanced reading cards**, earned across either script, without storing story-reading history. This is an original **closer** image at `assets/art/travellers-closeup.svg` generated by the existing `tools/draw_destinations.py`, while the already-approved **wide** village image remains the home hero. The two adult male travellers and matching charms are all original; do not substitute unlicensed manga/media art or reveal the close-up before earning the milestone.
- The handwriting checker is **NOT** implemented; `docs/HANDWRITING_POC.md` remains a separate experiment. Future true writing checks must have device calibration, accessible bypass and human pedagogical review. The advanced kana lesson does not pretend to verify tracing.
- Keep the repo public, no private learner profiles, new dependencies, DB, analytics or secret keys. Test all old V2–V8 flows and new desktop/mobile workshop/reward, and verify deployed SHA independently.

## Tenth pass — earned hero chapters, milestones and single pronunciation (2026-10-11)
- Preserve the same **map-first home** and original artwork; a small, *manual* three-scene hero carousel now derives unlocks from existing saved achievements. Original distant village always shown first. **One recognised learning result** (hiragana, katakana, word postcard, advanced reading or food order) unlocks the teaser railway scene; ungraded drawing/listening alone does not. **Eight distinct advanced readings** unlock the existing two-adult-traveller closer portrait; legacy advanced reward stays available. The journal independently marks completion of all 46 basic hiragana, all 46 basic katakana, advanced milestone, and labels Kanji Shrine **future**. See `docs/STORY_MILESTONES.md`.
- `assets/story-milestones.js` owns pure threshold rules; `assets/app.js` reads V1–V9 progress locally, never writes a new story preference, read-history or saved milestone key. Cross-tab storage and dialog-close refresh are supported. Use manual arrow buttons/keyboard and mobile swipe; no autoplay, honours reduced motion. No other app progress/migrations changed.
- Audio: the five existing public-domain Commons vowel MP3s contained **three repetitions in their original recordings**. They are now trimmed to the *first* 0.65 s (about 0.7 s MP3) using updated `tools/fetch_kana_audio.py --force`; source SHA pins unchanged and docs/AUDIO_SOURCES.md updated. One click plays once; another click replays.
- 41 further basic-sound files were identified with public-domain metadata on Commons, including aliases `hu` for ふ and `Japanese N` for ん, but bulk import was **rate-limited (HTTP 429)**. Do **not** claim 46 locally recorded sounds or publish an incomplete manifest. `tools/sync_basic_kana_audio.py` is a future **throttled sequential** importer; review sources, retry only after provider permits, verify individual samples and licensing prior to enabling runtime mapping. Existing five-vowel audio remains the fallback for missing native Japanese voices.
- Preserve source-of-truth GitHub, AgentCtl leases and latest Docker image rollback; real Mac/Safari audio, Japanese educational copy and touch usability still need field validation.

## Eleventh pass — illustrated Little Memories gallery (2026-10-11)
- New **optional separate journal dialog** from `My journal → Little Memories`. It uses three earlier owner-provided AI-generated concept panoramas, optimized to `assets/memories/*.webp`, with real illustrated narrative in a soft pink sakura theme. Their authorial provenance, crop and dimensions are documented in `docs/LITTLE_MEMORIES.md`. No new image generation or scraped manga assets.
- **Do not touch existing hero, map, lessons or progress formats**. Original SVG map and the existing hero carousel still work as before. The story gallery is meant to have a different, richer visual language.
- Gallery milestones are derived solely from `assets/story-milestones.js`: first recognized result unlocks panoramic distant travellers, 8 advanced readings unlocks closer portrait, 46 basic katakana unlocks original railway image. Locked cards contain no image URL in the DOM and no media is requested for unrewarded scenes. Opening/reading has no new saved data.
- `assets/memories-data.js` owns pure content/unlock mapping; `assets/little-memories.js` owns the static DOM and gallery/detail navigation. Native dialog/backdrop/Escape behaviour retained. Confirmed 48 Node tests; check mobile and real-device behaviour. Keep text in English and the hidden romantic layer gentle and optional.

## Twelfth pass — five Little Memories, completed diptych (2026-10-11)
- The owner-provided paired high-resolution concept file contained **two distinct standalone illustrations** (village/bridge above, railway below). The original gallery shipped only the lower panel. Add the upper panel as `assets/memories/blossom-bridge.webp`; the gallery now has **four individual artworks, five narrative moments**, with the fifth a *composition of the two existing panels*, not a fifth independent generated image. Never claim otherwise. Full source/crop detail: `docs/LITTLE_MEMORIES.md`.
- Add reward for all 46 hiragana and a conjunction of both all 46 hiragana **and** all 46 katakana. Keep first-activity, 8-advanced and 46-katakana achievements unchanged. No storage schema changes or story preference tracking; neither locked art nor locked diptych components may be fetched.
- Code changes isolated to `assets/memories-data.js`, `assets/little-memories.js`, `assets/styles.css`, new image, tests and handoff. **Never rework or replace the approved hero/map/lesson UI** for this pass. Real device Mac/Safari remains unverified.

## Thirteenth pass — simple hero and frictionless kana flow (2026-10-11)
- User observed that the hero was too verbose and its scene badge too visible. Preserve its artwork, scene unlock data, manual arrows, keyboard and touch swipe, but remove redundant visible footnote (privacy notice remains in journal), visually hide story caption/scene counter while keeping screen-reader status, and fade small arrow buttons until hover/focus. Do **not** move high-detail narrative art out of Little Memories.
- Hiragana learning flow: after a correct recognition, `Next sound` enters the next unanswered kana **recognition directly**, including the first unlocked kana of the next row; users may still choose Discover/Trace tabs. After a valid ungraded drawing, one `I've practised this` click stores tracing and navigates directly to recognition. Drawing never grants mastery. The old flow required extra navigation after every answer or trace; this looked like double validation. V1 progress schema and 46-kana unlock thresholds untouched.
- Browser regression should start from persisted 2/5, complete 5/5 via three recognition answers, unlock K row, test traced-but-not-mastered until answered, reload persistence, mobile width and older saved data. Also verify old V2–V12 flows and unchanged story milestones.

## Fourteenth pass — separate learning from mixed assessment (2026-10-11)
- Explicit user feedback: the thirteenth-pass trace→quiz transition and quiz→quiz loop conflated **learning** with **checking**. For **both** basic scripts, group UI into Learn & practise (Discover/Draw), Check yourself (mixed Sound + writing check, optional Recognise one), and Your progress (Review/Collection). Save-drawing stays in learning, never launches a quiz automatically; learner can voluntarily switch.
- Shared no-dependency `assets/kana-checkpoint.js` runs a mixed check of each unlocked row: objective recognition + hidden-model handwritten recall. Offset interleaving prevents simply copying the immediately preceding answer. Writing uses **manual self-comparison** with stroke-order SVG only revealed after a drawing, never an automatically graded result. No changes to original recognition/mastery criteria, saved progress schema, or story rewards. `docs/KANA_LEARN_CHECK.md` explains the limitations and acceptance tests.
- Scope: `index.html`, `assets/app.js`, `assets/katakana-station.js`, `assets/kana-checkpoint.js`, `assets/styles.css`, `tests/kana-checkpoint.test.mjs`, docs/backlog/handoff. No new external images, data collection, dependency, DB or service. Verify existing stored 2/5 and both alphabets; test real Mac/Safari separately before claiming cross-browser completeness.

## Checks
`node --check assets/app.js`
`node --test tests/*.test.mjs`
`python3 tools/draw_landscape.py` (must be reproducible)
Browser tests desktop + 390px: animation loads, rows unlock after 5 recognition answers, V1 migration, drawing does not grant mastery, due review, reload progress and no horizontal overflow. Test actual Japanese audio and touch with Angela before describing them as field-validated.

## Handoff
Before ending: verify branch/HEAD/local status/remote divergence, record shipped vs blocked features in `BACKLOG.md`, release owned leases. Deploy using Docker/Traefik configuration under `deploy/` only after preflight. Do not install new server services beyond this isolated compose stack.
