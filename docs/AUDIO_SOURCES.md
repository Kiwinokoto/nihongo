# Japanese pronunciation audio sources (Pass 7)

The five basic Japanese vowel examples are deliberately small, locally hosted
**human-recorded** pronunciation samples. This allows the earliest hiragana and
katakana lessons to play sound on Safari/Chrome/Firefox/Brave even when
`speechSynthesis.getVoices()` lists **no Japanese voices**.

## Provenance and licensing

All files are by **Hakatanoshio117117**, originally self-recorded in 2009,
published to Wikimedia Commons with a **public-domain dedication (PD-self)**.
The copyright holder explicitly permits use for any purpose without conditions
where a PD dedication cannot legally take effect.

| Shipped file | Source file on Commons | Pronunciation |
|---|---|---|
| `assets/audio/kana/a.mp3` | [Ja-A.oga](https://commons.wikimedia.org/wiki/File:Ja-A.oga) | あ / ア |
| `assets/audio/kana/i.mp3` | [Japanese I.ogg](https://commons.wikimedia.org/wiki/File:Japanese_I.ogg) | い / イ |
| `assets/audio/kana/u.mp3` | [Japanese U.ogg](https://commons.wikimedia.org/wiki/File:Japanese_U.ogg) | う / ウ |
| `assets/audio/kana/e.mp3` | [Ja-E.oga](https://commons.wikimedia.org/wiki/File:Ja-E.oga) | え / エ |
| `assets/audio/kana/o.mp3` | [Japanese O.ogg](https://commons.wikimedia.org/wiki/File:Japanese_O.ogg) | お / オ |

Source originals are Ogg Vorbis/Oga. Their **audio was transcoded to MP3**
(mono 22050 Hz using FFmpeg/libmp3lame, quality 4) for broad Safari
compatibility. No other edits are intended. To obtain exactly this selection,
use `python3 tools/fetch_kana_audio.py`; verify that the original files still
carry PD-self and that the source SHA-256 values match the pinned digests in the script.

These recordings are isolated sounds, **not** whole-word pronunciation
models. They are played only for an exact single-character match; do not
construct synthetic phrases from concatenating them. They have not yet been
audited by a fluent Japanese educator for pitch/accent consistency.

## Runtime fallback order

1. Japanese voice offered by the user's browser / operating system;
2. bundled human recording for the five vowels **only**;
3. informative written-only fallback without synthesizing Japanese in a
   voice from the wrong language.

No browser voice pack is installed by the application; no microphone,
user recording, remote TTS request, key, API quota, or voice-vendor account
is needed. Adding more licensed recordings requires checking each
file's licensing and pronunciation carefully. Do not scrape unlicensed media.


## One tap, one pronunciation (2026-10-11)

The original five Commons recordings contain **three repetitions of the same
vowel** (about 2.5–2.8 seconds each). The distributed local MP3 clips are
now **the first 0.65 seconds only** (first complete utterance and a little
trailing silence). The source files remain unchanged upstream, the checksums
above still pin the sources, and `tools/fetch_kana_audio.py --force` will
reproduce the same five trimmed files. This avoids surprising triple audio
without altering the browser speech-synthesis behaviour.

## Limited verification of further candidate recordings (2026-10-11)

The Commons source pages for [Japanese ki.ogg](https://commons.wikimedia.org/wiki/File:Japanese_ki.ogg) (き / キ; author Hakatanoshio117117, 14 October 2009) and [Japanese shi.ogg](https://commons.wikimedia.org/wiki/File:Japanese_shi.ogg) (し / シ; same author, 31 October 2009) display a public-domain dedication (PD-self). Both original recordings are several seconds long. **These are licence candidates, not shipped samples.** No new MP3s were imported; the count remains five.

Before shipping any more recordings: review exact source, licence and hash; listen to the actual sound and onset/offset; trim only at a verified natural utterance boundary; test MP3 playback on target browsers, and pin provenance. A fixed 0.65-second trim must not be assumed valid for every consonant. Respect Wikimedia limits; never concatenate isolated kana to imitate natural whole-word speech.
