# The magic travel book and homecoming village · 11 October 2026

## Why

The old My journal opened a second modal, Little Memories, and duplicated story requirements in an administrative "Scenes along the way" list. The parent dialog's title also scrolled beneath its sticky modal header. The initial Starting Village mainly linked to three already visible map destinations.

## New learning design

The header's always-available **My magic book** opens one modal preserving the illustrated Little Memories styling and images. Within it:
- **My Discoveries**: hiragana recognized (out of 46), katakana recognized (out of 46), validated optional advanced readings, collected word postcards, and ordered dishes. These reflect the existing five localStorage keys only. An empty collection is explicitly empty. Tracing does not count as recognition, and the kanji shrine + words-around-town exercise do not claim stored mastery.
- **Little Memories**: exactly the existing five story reward illustrations and lock conditions from memories-data.js. Clicking an earned scene still opens its beautiful story and the return path works; locked artwork remains unrequested until genuinely earned. All existing source files, milestones and achievements were preserved, without a synthetic "future kanji" checklist in the book.
- One-click access from the global header and from the village. Only one modal opens at a time. Readable portrait/tablet/desktop styling.

The Starting Village opens with a warm greeting and the same small original village illustration. For zero achieved entries it offers an introduction and the book, never a fake test. If any of the five existing validated collections has real entries, a **session-only homecoming review** offers up to five questions about previously collected targets, with four distinct options, retry after wrong choice, and a summary described as practice. It tries one item per available category before filling the rest. Distractors are ordinary known dictionary alternatives and **never claimed to be previously learned**. Correct answers **do not** write progress or unlock story rewards. No timer, score, sound pronunciation grading or handwriting assessment.

Mac Japanese voice setup and voice detection are still presented in the village; an independently accessible **Sound help** button in the header opens that section directly. Audio availability depends on an installed Japanese system voice, except the five pre-existing vowel recordings.

## Compatibility / testing

No database, new dependency, API, telemetry, localStorage key or data migration. Existing key names remain identical; all five parsers normalize corrupt or stale values. Cross-tab storage updates refresh a visible book without overwriting saves. All site artwork and other map stops remain unchanged.

Node **61/61** after introducing four new tests plus update of deprecated journal assertions. Isolated Chromium (1350px and 390px) passed: empty fresh visit, all five discovery groups from seeded legacy saves, earned/unearned memory cards, unlocked scene details, one-book navigation and return, five valid mixed review questions, hidden next control until correct, direct Mac sound help, original key/value data unchanged, no console page errors or document horizontal overflow. Real Safari/Mac human pass and Japanese voice pronunciation remain separately pending.
