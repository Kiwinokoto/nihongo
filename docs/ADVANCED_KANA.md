# Beyond the first kana — extra reading patterns

**Status:** optional client-side reading workshop, not a full Japanese curriculum or an
automatic handwriting/voice evaluator. This is a working teaching scaffold that still
requires review by a fluent Japanese speaker/educator.

## Available patterns

| Topic | Hiragana | Katakana | Notes |
|---|---:|---:|---|
| Voicing: dakuten / handakuten | 25 | 25 | 4 voiced rows ×5 + p-row ×5. The rare ぢ / づ and ヂ / ヅ are spellings, not distinct modern standard pronunciations from じ / ず. |
| Yōon with small ya/yu/yo | 33 | 33 | 11 common bases ×3, e.g. きゃ/キャ, じゅ/ジュ. |
| Small vowel, ya/yu/yo, and tsu markers | 9 | 9 | Important **helper signs**, not nine separately pronounceable new syllables. |
| Common contemporary loanword combinations | — | 23 | Examples: ファ fa, ティ ti, ヴァ va; usage, perceived sound and transliteration can vary. |
| Whole-word length / doubled-consonant examples | 3 | 4 | Examples: がっこう, きょう, コーヒー, サッカー, コンピューター. |

**Total: 70 hiragana and 94 katakana reading *cards***. These counts include
**combinations and full words**, not 164 new individual base kana. The original
46+46 basic-kana progression is unchanged. The workshop is accessible from
either foundational lesson without needing to clear all ten rows.

For each family the learner sees a short English explanation, Japanese
forms and romanisation, then chooses the reading from alternatives.
Cards recognised correctly are collected under one independent browser key,
`kotoba-no-tabi.advanced-kana.v1`. The question is **visual reading**, not
pronunciation or handwriting assessment. The native Japanese TTS voice is
optional and unavailable on some systems; no new external audio is loaded.

## Two travellers: distinct chapters

The original panorama stays in the home hero and village as the distant
chapter. At **8 different correct advanced reading answers** across both
scripts, the workshop offers a separate, optional close-up postcard of the
same original adult travellers. The close-up asset is generated reproducibly
at `assets/art/travellers-closeup.svg` by `tools/draw_destinations.py`.
There is no separate preference log, story-view tracking, automatic
popup or personal-account requirement.

## What is deliberately not complete

- Exhaustive loanword transliteration (many rare combinations) and historical kana
  spellings are not covered.
- Full contextual word reading/meaning practice, sound change, multiple
  romanisation systems and nuances of Japanese pitch accent are not assessed.
- Small kana and long marks are introduced as spelling/reading conventions,
  not scored as individual isolated vocalisations.
- Visual writing models currently show the **basic** 46+46 only.
  Automatic comparison of drawn stroke direction, order and shape is still
  an isolated future pilot in `docs/HANDWRITING_POC.md` and must not
  be represented as validated or part of current learner assessments.

## Verification and feedback

1. Tests check every card has a stable unique identifier and sound text;
   mismatched/corrupted browser saves are normalised.
2. Browser checks exercise both alphabets, multiple quizzes, correct/wrong
   choices, saved progress, the optional eight-answer reward and full
   legacy regressions on desktop and simulated mobile.
3. Fluent Japanese editorial QA and a real Mac/Safari test with Angela
   remain needed. Especially verify writing systems, pronunciations of
   borrowed phonemes, accessible audio fallbacks, and context for examples.
