"""Isolated event-sourced synchronization core. No login or public HTTP exposure.

This module accepts an account subject ONLY from a future trusted auth layer.
Never trust a caller-provided account ID in a public HTTP request.
Python 3.8+, standard-library SQLite and JSON only.
"""
import json
import sqlite3
import time
from pathlib import Path
from uuid import UUID

KEYS = {
    "hiragana": "kotoba-no-tabi.progress.v1",
    "katakana": "kotoba-no-tabi.katakana.v1",
    "advanced": "kotoba-no-tabi.advanced-kana.v1",
    "words": "kotoba-no-tabi.word-postcards.v1",
    "food": "kotoba-no-tabi.food-lane.v1",
}
REVIEW_DAY = 86_400_000
INTERVALS = [REVIEW_DAY, 3 * REVIEW_DAY, 7 * REVIEW_DAY, 14 * REVIEW_DAY, 30 * REVIEW_DAY]
MAX_EVENTS = 64
MAX_IMPORT_BYTES = 65_536

class SyncError(ValueError):
    pass

def canonical_uuid(value):
    if not isinstance(value, str):
        raise SyncError("Expected UUID")
    try:
        valid = UUID(value)
    except (ValueError, AttributeError, TypeError):
        raise SyncError("Invalid UUID")
    if valid.version != 4 or str(valid) != value:
        raise SyncError("UUID must be canonical v4")
    return value

def strict_int(value, smallest, largest):
    if type(value) is not int or not smallest <= value <= largest:
        raise SyncError("Invalid integer")
    return value

def valid_ids(raw, allowed):
    if not isinstance(raw, list):
        return []
    return list(dict.fromkeys(x for x in raw if isinstance(x, str) and x in allowed))

class SyncStore:
    def __init__(self, db_path, curriculum_path=None, clock=time.time):
        self.db_path = str(db_path)
        self.clock = clock
        source = curriculum_path or Path(__file__).with_name("curriculum.json")
        with open(source, "r", encoding="utf-8") as stream:
            catalog = json.load(stream)
        required = {"hiragana", "katakana", "advanced_hiragana",
                    "advanced_katakana", "words", "food"}
        if set(catalog) != required:
            raise SyncError("Curriculum manifest shape mismatch")
        self.allowed = {name: set(items) for name, items in catalog.items()}
        if any(not items for items in self.allowed.values()):
            raise SyncError("Empty curriculum not allowed")
        self._create_schema()

    def _connect(self):
        conn = sqlite3.connect(self.db_path, timeout=10, isolation_level=None)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys=ON")
        conn.execute("PRAGMA busy_timeout=10000")
        return conn

    def _create_schema(self):
        with self._connect() as conn:
            conn.execute("PRAGMA journal_mode=WAL")
            conn.executescript("""
                CREATE TABLE IF NOT EXISTS accounts(
                  subject TEXT PRIMARY KEY, revision INTEGER NOT NULL DEFAULT 0
                );
                CREATE TABLE IF NOT EXISTS collections(
                  subject TEXT NOT NULL REFERENCES accounts(subject),
                  kind TEXT NOT NULL, item TEXT NOT NULL,
                  PRIMARY KEY(subject,kind,item)
                );
                CREATE TABLE IF NOT EXISTS reviews(
                  subject TEXT NOT NULL REFERENCES accounts(subject),
                  kind TEXT NOT NULL, item TEXT NOT NULL,
                  version INTEGER NOT NULL, level INTEGER NOT NULL,
                  last_at INTEGER NOT NULL, next_at INTEGER NOT NULL,
                  PRIMARY KEY(subject,kind,item)
                );
                CREATE TABLE IF NOT EXISTS events(
                  event_id TEXT PRIMARY KEY,
                  subject TEXT NOT NULL REFERENCES accounts(subject),
                  device_id TEXT NOT NULL,
                  seq INTEGER NOT NULL,
                  body TEXT NOT NULL,
                  decision TEXT NOT NULL,
                  account_revision INTEGER NOT NULL,
                  received_at INTEGER NOT NULL,
                  UNIQUE(subject,device_id,seq)
                );
                CREATE TABLE IF NOT EXISTS imports(
                  import_id TEXT PRIMARY KEY,
                  subject TEXT NOT NULL REFERENCES accounts(subject),
                  device_id TEXT NOT NULL,
                  account_revision INTEGER NOT NULL
                );
            """)

    def register_subject(self, trusted_subject):
        """Only the future verified-login adapter can invoke this method."""
        subject = canonical_uuid(trusted_subject)
        with self._connect() as db:
            db.execute("INSERT OR IGNORE INTO accounts(subject) VALUES(?)", (subject,))
        return subject

    def _has_account(self, db, subject):
        if db.execute("SELECT 1 FROM accounts WHERE subject=?", (subject,)).fetchone() is None:
            raise SyncError("Unknown account")

    def _valid_event(self, event):
        if not isinstance(event, dict) or set(event) != {
            "event_id", "device_id", "seq", "kind", "item", "op", "base_version"
        }:
            raise SyncError("Unsupported event schema")
        canonical_uuid(event["event_id"])
        canonical_uuid(event["device_id"])
        strict_int(event["seq"], 1, 2**53 - 1)
        strict_int(event["base_version"], 0, 2**31 - 1)
        kind, item, op = event["kind"], event["item"], event["op"]
        if type(kind) is not str or type(item) is not str or type(op) is not str:
            raise SyncError("Invalid event fields")
        permitted = {
            "hiragana": {"recognize", "miss", "trace"},
            "katakana": {"recognize", "miss", "trace"},
            "advanced_hiragana": {"recognize"},
            "advanced_katakana": {"recognize"},
            "words": {"collect"},
            "food": {"order"},
        }
        if kind not in permitted or op not in permitted[kind] or item not in self.allowed[kind]:
            raise SyncError("Unknown learning action or item")
        if kind not in ("hiragana", "katakana") and event["base_version"] != 0:
            raise SyncError("Only base kana carry review versions")
        return json.dumps(event, ensure_ascii=False, separators=(",", ":"), sort_keys=True)

    def _apply(self, db, subject, event, now):
        kind, item, op = event["kind"], event["item"], event["op"]
        if op in ("collect", "order") or kind.startswith("advanced_"):
            db.execute("INSERT OR IGNORE INTO collections VALUES(?,?,?)", (subject, kind, item))
            return "collected"
        if op == "trace":
            db.execute("INSERT OR IGNORE INTO collections VALUES(?,?,?)", (subject, kind + "_traced", item))
            return "traced"
        old = db.execute(
            "SELECT version,level,last_at,next_at FROM reviews WHERE subject=? AND kind=? AND item=?",
            (subject, kind, item)
        ).fetchone()
        version = old["version"] if old is not None else 0
        base = event["base_version"]
        if base > version:
            raise SyncError("Future review version")
        if op == "miss":
            if old is None:
                return "uncollected-miss"
            # Stale concurrent misses make the next review *sooner*, never later.
            due = now + 3_600_000
            if base < version:
                due = min(old["next_at"], due)
            db.execute(
                "UPDATE reviews SET version=?,level=0,last_at=?,next_at=? "
                "WHERE subject=? AND kind=? AND item=?",
                (version + 1, now, due, subject, kind, item)
            )
            return "review-miss" if base == version else "concurrent-miss"
        # A true recognition grows the collection even when stale.
        db.execute("INSERT OR IGNORE INTO collections VALUES(?,?,?)", (subject, kind, item))
        if base < version:
            # Both offline devices started at the same review version; no double credit.
            return "concurrent-recognition-no-extra-level"
        level = 1 if old is None or old["level"] == 0 else min(5, old["level"] + 1)
        due = now + INTERVALS[level - 1]
        db.execute(
            "INSERT INTO reviews(subject,kind,item,version,level,last_at,next_at) "
            "VALUES(?,?,?,?,?,?,?) ON CONFLICT(subject,kind,item) DO UPDATE SET "
            "version=excluded.version,level=excluded.level,last_at=excluded.last_at,"
            "next_at=excluded.next_at",
            (subject, kind, item, version + 1, level, now, due)
        )
        return "recognized"

    def _snapshot(self, db, subject):
        self._has_account(db, subject)
        revision = db.execute(
            "SELECT revision FROM accounts WHERE subject=?", (subject,)
        ).fetchone()["revision"]
        groups = {kind: [] for kind in list(self.allowed) + ["hiragana_traced", "katakana_traced"]}
        for row in db.execute("SELECT kind,item FROM collections WHERE subject=? ORDER BY kind,item", (subject,)):
            if row["kind"] in groups:
                groups[row["kind"]].append(row["item"])
        reviews = {"hiragana": {}, "katakana": {}}
        for r in db.execute(
            "SELECT kind,item,version,level,last_at,next_at FROM reviews WHERE subject=?", (subject,)
        ):
            reviews[r["kind"]][r["item"]] = {
                "version": r["version"], "level": r["level"],
                "lastAt": r["last_at"], "nextAt": r["next_at"]
            }
        return {
            "revision": revision,
            "hiragana": {"mastered": groups["hiragana"], "traced": groups["hiragana_traced"], "review": reviews["hiragana"]},
            "katakana": {"mastered": groups["katakana"], "traced": groups["katakana_traced"], "review": reviews["katakana"]},
            "advanced": {"hiragana": groups["advanced_hiragana"], "katakana": groups["advanced_katakana"]},
            "words": {"collected": groups["words"]},
            "food": {"ordered": groups["food"]},
        }

    def snapshot(self, trusted_subject):
        subject = canonical_uuid(trusted_subject)
        with self._connect() as db:
            return self._snapshot(db, subject)

    def apply_events(self, trusted_subject, events):
        subject = canonical_uuid(trusted_subject)
        if not isinstance(events, list) or len(events) > MAX_EVENTS:
            raise SyncError("Maximum 64 events per batch")
        serialized = [self._valid_event(e) for e in events]
        now = int(self.clock() * 1000)
        with self._connect() as db:
            db.execute("BEGIN IMMEDIATE")
            self._has_account(db, subject)
            decisions = []
            for event, body in zip(events, serialized):
                found = db.execute("SELECT subject,body,decision FROM events WHERE event_id=?",
                                   (event["event_id"],)).fetchone()
                if found is not None:
                    if found["subject"] != subject or found["body"] != body:
                        raise SyncError("Event ID collision")
                    decisions.append(found["decision"])
                    continue
                clash = db.execute(
                    "SELECT event_id FROM events WHERE subject=? AND device_id=? AND seq=?",
                    (subject, event["device_id"], event["seq"])
                ).fetchone()
                if clash:
                    raise SyncError("Device sequence collision")
                decision = self._apply(db, subject, event, now)
                db.execute("UPDATE accounts SET revision=revision+1 WHERE subject=?", (subject,))
                revision = db.execute("SELECT revision FROM accounts WHERE subject=?",
                                      (subject,)).fetchone()["revision"]
                db.execute(
                    "INSERT INTO events VALUES(?,?,?,?,?,?,?,?)",
                    (event["event_id"], subject, event["device_id"], event["seq"],
                     body, decision, revision, now)
                )
                decisions.append(decision)
            return {"decisions": decisions, "state": self._snapshot(db, subject)}

    def _legacy_json(self, raw):
        if raw is None:
            return {}
        if not isinstance(raw, str) or len(raw.encode("utf-8")) > MAX_IMPORT_BYTES:
            raise SyncError("Oversized legacy content")
        try:
            value = json.loads(raw)
        except (ValueError, TypeError):
            return {}
        return value if isinstance(value, dict) else {}

    def import_legacy(self, trusted_subject, import_id, device_id, raw_keys):
        """One-time, idempotent per-import import; grow-only sets, never overwrite reviews."""
        subject = canonical_uuid(trusted_subject)
        canonical_uuid(import_id)
        canonical_uuid(device_id)
        if not isinstance(raw_keys, dict) or set(raw_keys) - set(KEYS.values()):
            raise SyncError("Unknown legacy store")
        if sum(len(str(v).encode("utf-8")) for v in raw_keys.values()) > MAX_IMPORT_BYTES:
            raise SyncError("Legacy import too large")
        legacy = {key: self._legacy_json(raw_keys.get(store)) for key, store in KEYS.items()}
        now = int(self.clock() * 1000)
        with self._connect() as db:
            db.execute("BEGIN IMMEDIATE")
            self._has_account(db, subject)
            found = db.execute("SELECT subject,device_id FROM imports WHERE import_id=?", (import_id,)).fetchone()
            if found:
                if found["subject"] != subject or found["device_id"] != device_id:
                    raise SyncError("Import ID collision")
                return {"imported": False, "state": self._snapshot(db, subject)}
            for kind in ("hiragana", "katakana"):
                source = legacy[kind]
                items = valid_ids(source.get("mastered"), self.allowed[kind])
                traced = valid_ids(source.get("traced"), self.allowed[kind])
                for glyph in items:
                    db.execute("INSERT OR IGNORE INTO collections VALUES(?,?,?)", (subject, kind, glyph))
                for glyph in traced:
                    db.execute("INSERT OR IGNORE INTO collections VALUES(?,?,?)", (subject, kind + "_traced", glyph))
                review_dict = source.get("review")
                if not isinstance(review_dict, dict):
                    review_dict = {}
                for glyph in items:
                    # An imported device must never overwrite an existing account schedule.
                    if db.execute("SELECT 1 FROM reviews WHERE subject=? AND kind=? AND item=?",
                                  (subject, kind, glyph)).fetchone():
                        continue
                    rec = review_dict.get(glyph)
                    if not isinstance(rec, dict):
                        rec = {}
                    level = rec.get("level", 1)
                    level = max(0, min(5, level)) if type(level) is int else 1
                    last = rec.get("lastAt", now)
                    due = rec.get("nextAt", now + REVIEW_DAY)
                    # Phone clocks may be broken. Refuse far-future postponements.
                    last = int(last) if type(last) in (int, float) and now - 365*REVIEW_DAY <= last <= now + 300_000 else now
                    due = int(due) if type(due) in (int, float) and now - 365*REVIEW_DAY <= due <= now + 30*REVIEW_DAY else now
                    db.execute(
                        "INSERT OR IGNORE INTO reviews VALUES(?,?,?,?,?,?,?)",
                        (subject, kind, glyph, 1, level, last, due)
                    )
            advanced = legacy["advanced"]
            for script in ("hiragana", "katakana"):
                allowed_kind = "advanced_" + script
                for ident in valid_ids(advanced.get(script), self.allowed[allowed_kind]):
                    db.execute("INSERT OR IGNORE INTO collections VALUES(?,?,?)",
                               (subject, allowed_kind, ident))
            for section, field, kind in (("words", "collected", "words"), ("food", "ordered", "food")):
                for item in valid_ids(legacy[section].get(field), self.allowed[kind]):
                    db.execute("INSERT OR IGNORE INTO collections VALUES(?,?,?)",
                               (subject, kind, item))
            db.execute("UPDATE accounts SET revision=revision+1 WHERE subject=?", (subject,))
            revision = db.execute("SELECT revision FROM accounts WHERE subject=?", (subject,)).fetchone()["revision"]
            db.execute("INSERT INTO imports VALUES(?,?,?,?)", (import_id, subject, device_id, revision))
            return {"imported": True, "state": self._snapshot(db, subject)}

    def export_user(self, trusted_subject):
        """Portable learning data, only after future authenticated export request."""
        return self.snapshot(trusted_subject)

    def delete_user(self, trusted_subject):
        """Irreversible erasure. Public route must require reauthentication."""
        subject = canonical_uuid(trusted_subject)
        with self._connect() as db:
            db.execute("BEGIN IMMEDIATE")
            self._has_account(db, subject)
            for table in ("events", "imports", "reviews", "collections"):
                db.execute("DELETE FROM " + table + " WHERE subject=?", (subject,))
            db.execute("DELETE FROM accounts WHERE subject=?", (subject,))
        return True

    def backup_database(self, destination):
        """Consistent SQLite online backup, restricted file, never overwrite."""
        import os
        target = Path(destination)
        if target.resolve() == Path(self.db_path).resolve():
            raise SyncError("Cannot overwrite live database")
        fd = os.open(str(target), os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
        os.close(fd)
        try:
            with self._connect() as live:
                with sqlite3.connect(str(target)) as backup:
                    live.backup(backup)
                    if backup.execute("PRAGMA quick_check").fetchone()[0] != "ok":
                        raise SyncError("Backup integrity check failed")
            return str(target)
        except Exception:
            target.unlink()
            raise

    def audit_events(self, trusted_subject):
        """For tests/operations only: events are immutable and include decisions."""
        subject = canonical_uuid(trusted_subject)
        with self._connect() as db:
            self._has_account(db, subject)
            return [dict(row) for row in db.execute(
                "SELECT event_id,device_id,seq,decision,account_revision FROM events "
                "WHERE subject=? ORDER BY account_revision", (subject,)
            )]
