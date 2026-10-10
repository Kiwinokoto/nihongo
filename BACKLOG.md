# Progress / handoff

## In scope now
- [x] Original illustrated responsive storybook map and starter village
- [x] First five hiragana with reading, TTS fallback, mouse/touch/pen tracing, 4-choice recognition, local progress journal
- [x] Full 46-hiragana chart with future characters visibly locked
- [ ] Validate in actual phone/touch browser with Angela
- [ ] Verify production HTTPS, caching, console and accessibility manually

## Next slices
- Better stroke-order animated models (check free resource licences before use)
- More hiragana rows with adaptive review and spaced repetition
- Small tea house dialogues, real phrases, deliberate pronunciation quality
- Katakana garden/station; first contextual kanji, without forcing handwriting early
- Synced learner progress/privacy and optional save/export; no account in V1

## Constraints / design decisions
- Do not copy assets from portal or previous picture searches without reuse permission.
- Correct recognition is distinct from writing practice; no false handwriting scoring.
- Map must remain legible on a small screen and never make inaccessible areas appear unlocked.
- Browser speech output depends on installed Japanese voices.
- No production-user data on GitHub and no secrets in public repository.
