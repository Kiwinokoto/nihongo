# Kanji shrine — first word-centred walk (11 October 2026)

The shrine gate on the existing map opens **immediately**, without collecting hiragana or katakana. The user-approved forest/torii/waterfall illustration is the site's original visual asset, optimised as `assets/art/kanji-shrine.webp` (1200 × 720, ~215 KB), stored in the public repository and served locally. It is **not** one of the inspiration photos from a web query, and not a newly generated alternative. Its source was generated in this conversation, then supplied again by the owner. Keep this visual in the shrine; do not replace the map artwork, homepage hero or journal.

Eight contextual gates (some phrase-level readings use on-yomi rather than the isolated character's kun-yomi):

| Character | Encounter | Reading | Meaning |
|---|---|---|---|
| 森 | 森の中 | もりのなか | Inside the forest |
| 駅 | 駅前 | えきまえ | In front of the station |
| 道 | 山道 | やまみち | Mountain path |
| 店 | お店 | おみせ | Shop |
| 食 | 食堂 | しょくどう | Dining hall |
| 旅 | 旅行 | りょこう | Trip |
| 雨 | 雨の日 | あめのひ | Rainy day |
| 海 | 海辺 | うみべ | Seaside |

Each card presents a word and short Japanese sentence with optional readings/translations, a listen button reusing existing Japanese-voice detection, and four English choices for the contextual meaning. Wrong answers invite reattempt. A session-only explored count is not saved and does not grant any kana, story milestone, handwriting or speaking proficiency. Existing story milestone titled 'kanji' remains a *future* achievement, not automatically unlocked by opening the destination.

Audio: the browser's installed Japanese voice is used when available; no constructed speech from the five local vowel clips, no remote TTS. With no native voice, learners have written text and an explicit status message.

Tests: Node checks contextual data, 8 unique gates, 4-option quizzes, no persistent state, and map entry. Browser QA must verify portrait/mobile/desktop readability, actual image loading, eight cards including incorrect answer retry, choice+reveal paths, no storage writes, and unaffected old map destinations. Real macOS/Safari and native Japanese listening still need field QA.

## Production release and field-test limits

PR #34 squash-merged as application commit 65046ba221c0f95fa24727a0636d227a5635afe0, deployed to the personal VPS isolated Docker service nihongo-web on 11 October 2026. Current Docker image sha256:72051fc9220856a957ab965ce7235ae871268406be877ae1548e2c447a45896f; rollback image nihongo-rollback:fbdd8a6 preserved. Valid HTTPS, homepage and /healthz 200, original image checksum checked over the public URL. No changes in the list of 71 other running containers.

57/57 Node tests passed at release. Chromium on the *public domain* at 1350px and 390px walked all eight kanji, wrong-choice correction, caption/reveal, 8 explored, audio-control presence and return to the katakana map stop, without browser JS errors, document overflow, or any new localStorage changes. These are simulated desktop/mobile tests, **not** physical Apple Safari or fluent speaker certification. Five bundled vowel recordings and existing kanji/story milestones remain untouched.

The user-owned original generated illustration was transferred into the public GitHub repository in an optimised WebP derivative (1200×720, 214506 bytes, SHA-256 be52e628229373ddf14297cbee48d695519462c990c792b8b467d72566758f35). Temporary transfer copies used for transport were deleted from Drive after committing; the public site hosts its own local file.
