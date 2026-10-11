# Account & multi-device learning — isolated sync core

**Status on 11 October 2026:** Implemented + tested **server-side sync kernel only**. No public registration, login, cookies, SMTP configuration, production API or browser-side event capture exists yet. The deployed static site and its five localStorage saves are still unchanged. The account architecture is being built under [issue #39](https://github.com/Kiwinokoto/nihongo/issues/39).

## Architecture

A small Python 3.8+ standard-library SQLite core lives in `sync_core/engine.py`. A fixed manifest `curriculum.json` derives from the **real** JS site dictionaries; `node sync_core/build_curriculum.mjs --check` rejects drift. The ledger stores separate subjects, immutable idempotent events (UUIDs + device sequence), valid collected item sets, per-kana review version and due date, and one-time legacy-import IDs. Transactions use SQLite `BEGIN IMMEDIATE` and WAL.

The protocol test fixture `sync_core/staging_http.py` can run **only** with explicit `KOTOBA_SYNC_TEST_ONLY=1`, a long random development token, and **127.0.0.1** binding. It deliberately uses `X-Stage-Subject` to simulate a future *verified* identity and is **insecure by design for any public use**. Do not attach it to Traefik or use it as a production login adapter. The test suite starts and stops an ephemeral localhost server; it does not create accounts in the real site.

### Collision policy, concretely

1. Acquired values are a grow-only union of IDs permitted by the pinned curriculum. `trace` never equals `recognize`. Extra bogus IDs in import JSON are dropped.
2. Every learning action has an event UUID, device UUID, increasing local sequence and per-glyph `base_version`; an identical HTTP retry produces the same decision and no extra revision. Reuse of a UUID or device sequence with changed content is rejected.
3. Each basic kana has a server-side schedule version. Two offline `recognize` events from **the same baseline** count at most one level change. The second event is retained for audit, but does not double-credit. An actual later review with the new server version may advance. A conflicting incorrect answer resets or advances the next review *earlier*, never later.
4. An offline client may sometimes get **conservative rather than optimistic** credit for several reviews attempted before reconnecting; a future client event-parent model or reconciliation can refine this without ever fabricating mastery. Device wall clocks are never trusted for event ordering.
5. The first verified login will ask before importing the five **existing** localStorage keys. A one-time import is idempotent. Older phone data adds legitimately acquired items but cannot replace an existing server review level or due date. Unreasonable legacy timestamps are bounded; a backup/restore path is tested.
6. A logged-in learner will ultimately get their own account-scoped browser progress and outbox. Switching accounts in the **same** browser must preserve separate states, not rebind the global legacy keys to a second person. Anonymous practice remains usable. **Neither account namespacing nor the queue wiring is implemented in this phase.**
7. `export_user`, `delete_user`, and `backup_database` are tested core methods. A protected live API must still enforce reauthentication for deletion/export and schedule private, offsite-backed backups.

### No access yet to public accounts

The verified e-mail OTP login, optional Argon2id password, secure HTTPS-only cookie session, CSRF, anti-abuse limits, SMTP setup, rate limiting, account recovery, logout, expiration, deletion and audit need an established authentication framework and a separate security review **before** any public rollout. A raw e-mail address is not authentication; do not add an unverified account form to production.

Staging must also test browser event capture and account switching, multi-tab offline edits, actual Mac/Safari and Android/iOS, and restore from backup. Sensitive database files, tokens and SMTP credentials must **never** be placed in GitHub or the public static web directory.

## Commands in isolated temporary checkout

```sh
node sync_core/build_curriculum.mjs --check
python3 -m unittest discover -s sync_core -p 'test_*.py' -v
node --test tests/*.test.mjs
```

The Python suite uses a temporary SQLite DB and loopback-only HTTP fixture, asserting two account separation, offline Mac/phone edits, review conflicts, old localStorage import, duplicate requests, corrupt data, 0600 backup and restore, and account erasure.

This entire `sync_core/` directory is **not copied into the production Nginx image** by `deploy/Dockerfile`, which copies only `assets/` and `index.html`. A GitHub merge does **not** activate accounts or sync in production. Any later API rollout requires an independent approved Compose service, durable volume, AgentCtl locks, and recovery procedure.
