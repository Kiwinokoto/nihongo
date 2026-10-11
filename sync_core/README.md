# Multi-device synchronization — isolated prototype

This directory is **not a public login service**. The sync logic is deliberately developed and tested separately from the live static Nginx site. Do not expose the staging harness or its development identity header to Traefik, the public Internet, or other containers.

- `engine.py` contains the SQLite event ledger, validation, idempotency, per-kana causal revision policy and carefully bounded legacy import.
- `curriculum.json` is generated from the actual site curriculum; run `node sync_core/build_curriculum.mjs --check` to detect drift.
- `staging_http.py` (later pass) is a localhost-only protocol test harness, **not production authentication**.
- `test_engine.py` exercises Mac/phone concurrency, review conflicts, event retries, imports and account separation.

The actual public experience currently has only browser-local saves. No sync queue is attached to lessons and no email-code login is deployed. **Do not call this feature live until authenticated API, secure delivery, CSP/CSRF, backups and two-device tests are in place.**
