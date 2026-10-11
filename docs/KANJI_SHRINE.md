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
