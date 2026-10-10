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

**Important:** tracing is not automatically checked for correctness, stroke order or recognisability. The app only marks that the learner has practised; mastery is awarded by the recognition quiz.

## Development

Requires only Python 3 and Node for tests (the website itself has no build step):

```sh
python3 tools/draw_landscape.py
node --check assets/app.js
node --test tests/*.test.mjs
python3 -m http.server 8787
```

Open http://localhost:8787 on a browser. The artwork generator uses only the Python standard library and its output is checked into version control for reproducible deployment.

## Production

Public URL: https://nihongo.kiwinokoto.fr

The isolated Compose service in `deploy/compose.yml` uses `traefik_network`, the existing personal VPS Traefik HTTPS resolver `letsencrypt`, and its own nginx container. No user accounts, database or environment secrets.

To deploy after review, pull the audited `main` revision into `/opt/nihongo`, check the AgentCtl deployment lease, then run `docker compose -f deploy/compose.yml up -d --build`. Verify `/healthz`, HTTPS/certificate, the main page, assets and browser interactions. Do not edit existing Traefik/application containers.

## Security & licensing

All visible SVG scenery is original code from `tools/draw_landscape.py`, not copied from reference images. No analytics and no personal information collected server-side. Google Fonts are loaded by the browser (a future privacy hardening could replace them with system fonts). All documentation and code are intended to remain public. Do not commit secrets, deployment files containing tokens or learner data.

See [AGENTS.md](AGENTS.md) for coordination and [BACKLOG.md](BACKLOG.md) for incremental roadmap.
