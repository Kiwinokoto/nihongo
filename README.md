# Kotoba no Tabi 🌸 · ことばの旅

A quiet little Japanese-learning journey. A public, dependency-free static website for reading, listening, recognising and drawing Japanese characters.

## What's playable

- A storybook village and a small map (other destinations are intentionally marked **coming soon**)
- The first five hiragana: あ い う え お
- Listening via the browser **only when a Japanese voice is installed**; otherwise an honest fallback
- Draw with mouse, touch or pen, undo and clear
- A short reading-recognition quiz; success adds a sound to your journal
- LocalStorage progress. Private to that browser/device, **not synced or backed up**
- Full 46-character hiragana chart preview; the other 41 characters await future lessons

**Important:** tracing is not automatically checked for correctness, stroke order or recognisability. The app only marks that the learner has practised; recognition quiz success collects the sound.

## Development

Requires only Python 3 and Node for tests (the website itself has no build step):

```sh
python3 tools/draw_landscape.py
node --check assets/app.js
node --test tests/*.test.mjs
python3 -m http.server 8787
```

Open http://localhost:8787 in a browser. The artwork generator uses only the Python standard library and its output is checked into version control.

## Production

Live URL: https://nihongo.kiwinokoto.fr

Released application revision: `e7c764f084eee0ccb94547d498060082ea2acd3a` (PR #1, 10 October 2026). Live HTTPS, assets, service health and desktop/mobile Chromium smoke tests passed. See `BACKLOG.md` for pending real-device and accessibility checks.

An isolated Compose service in `deploy/compose.yml` uses `traefik_network`, the existing personal VPS Traefik HTTPS resolver `letsencrypt`, and its own nginx container. No user accounts, database or environment secrets.

To deploy after review, compare audited GitHub `main` against the running revision and any local changes, acquire the AgentCtl deployment leases, update `/opt/nihongo`, then run `docker compose -f deploy/compose.yml up -d --build`. Verify `/healthz`, HTTPS/certificate, assets and browser interactions. Do not change other services.

## Security, privacy & licensing

All SVG scenery is original code from `tools/draw_landscape.py`; no imagery was copied from reference searches. No learner accounts, user profiles, application analytics or application-side form submissions. **Normal HTTP/Traefik access logs may still record visitor IP addresses.** Progress is saved in the visitor's own browser and is not encrypted or synced. Google Fonts are requested by the visitor's browser (a future privacy hardening could replace these with system fonts). Never commit secrets, tokens, private data or deployment credentials.

See `AGENTS.md` for coordination and `BACKLOG.md` for the next small increments.
