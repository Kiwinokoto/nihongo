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
