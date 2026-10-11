# Words around town — optional katakana practice (2026-10-11)

The station now includes eight everyday katakana words without gating the 46 basics. Each round shuffles the words, shows a Japanese word and location cue, optionally reveals its romanisation, and asks for English meaning among four choices. Wrong answers are retriable; completion is a session summary, not certified mastery.

| Japanese | Hepburn | Sense | Special reading |
|---|---|---|---|
| バス | basu | Bus | basic kana |
| ホテル | hoteru | Hotel | basic kana |
| メニュー | menyū | Menu | small ュ, long vowel ー |
| ラーメン | rāmen | Ramen noodles | long vowel ー |
| コンビニ | konbini | Convenience store | shortened loanword |
| カメラ | kamera | Camera | basic kana |
| タクシー | takushī | Taxi | long vowel ー |
| チケット | chiketto | Ticket | small ッ doubles following consonant |

Small characters and long vowels were introduced in the optional advanced-kana workshop; a learner may try this activity before mastering them. Fluent Japanese proofreading remains outstanding before formal curriculum reuse.

## Scope and honest audio

- assets/katakana-word-data.js: fixed eight-word list and pure choice generator; assets/katakana-words.js: transient UI state.
- Only Katakana Station opens the activity, not the hero or map. No storage, tracking, reward, mastery, phoneme or handwriting score.
- Listening calls the existing Japanese speech helper with a full word. An OS/browser ja voice is required for this: the five isolated vowel recordings cannot form words. An unavailable voice is reported rather than substituted.
- Regression: 54/54 Node; local Chromium at desktop and 390px completed the eight-word session, wrong-answer retry, no word storage and drawing reattempt in both scripts. Real Mac/Safari still untested.
