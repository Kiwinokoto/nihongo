import json
import tempfile
import unittest
from pathlib import Path
from uuid import uuid4
from sync_core.engine import SyncStore, SyncError, KEYS, REVIEW_DAY

def uid(): return str(uuid4())

class SyncTest(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.now=[1800000000.0]
        self.path=Path(self.tmp.name)/"db.sqlite3"
        self.store=SyncStore(self.path,clock=lambda:self.now[0])
        self.mac,self.phone,self.alice,self.bob=uid(),uid(),uid(),uid()
        self.store.register_subject(self.alice)
        self.store.register_subject(self.bob)
        self.seq={self.mac:0,self.phone:0}
    def event(self,device,kind,item,op,base=0):
        self.seq[device]+=1
        return dict(event_id=uid(),device_id=device,seq=self.seq[device],
                    kind=kind,item=item,op=op,base_version=base)
    def state(self,user=None): return self.store.snapshot(user or self.alice)

    def test_first_login_import_and_old_phone_do_not_lose_mac(self):
        now=int(self.now[0]*1000)
        original={KEYS["hiragana"]:json.dumps({"mastered":["あ","い","う","え","お","あ","fake"],
                    "review":{"あ":{"level":3,"lastAt":now-REVIEW_DAY,"nextAt":now+7*REVIEW_DAY}}}),
                  KEYS["words"]:json.dumps({"collected":["ie","not-valid"]})}
        first=self.store.import_legacy(self.alice,uid(),self.mac,original)
        self.assertEqual(set(first["state"]["hiragana"]["mastered"]),set("あいうえお"))
        self.assertEqual(first["state"]["words"]["collected"],["ie"])
        old_phone={KEYS["hiragana"]:json.dumps({"mastered":["あ"],"review":{"あ":{"level":1}}}),
                   KEYS["katakana"]:json.dumps({"mastered":["ア","イ"]})}
        import_id=uid()
        self.assertTrue(self.store.import_legacy(self.alice,import_id,self.phone,old_phone)["imported"])
        self.assertFalse(self.store.import_legacy(self.alice,import_id,self.phone,old_phone)["imported"])
        self.assertEqual(set(self.state()["katakana"]["mastered"]),{"ア","イ"})
        self.assertEqual(self.state()["hiragana"]["review"]["あ"]["level"],3)
        self.assertEqual(self.state()["revision"],2)

    def test_offline_union_and_retry_do_not_double_count(self):
        phone=self.event(self.phone,"katakana","イ","recognize")
        mac=self.event(self.mac,"hiragana","あ","recognize")
        self.store.apply_events(self.alice,[phone])
        first=self.store.apply_events(self.alice,[mac])
        repeat=self.store.apply_events(self.alice,[mac])
        self.assertEqual(first,repeat)
        self.assertEqual(self.state()["hiragana"]["mastered"],["あ"])
        self.assertEqual(self.state()["katakana"]["mastered"],["イ"])
        self.assertEqual(self.state()["revision"],2)

    def test_two_concurrent_reviews_one_level_and_then_real_followup(self):
        a=self.event(self.mac,"hiragana","あ","recognize",0)
        b=self.event(self.phone,"hiragana","あ","recognize",0)
        self.store.apply_events(self.alice,[a])
        due=self.state()["hiragana"]["review"]["あ"]["nextAt"]
        response=self.store.apply_events(self.alice,[b])
        self.assertEqual(response["decisions"],["concurrent-recognition-no-extra-level"])
        self.assertEqual(self.state()["hiragana"]["review"]["あ"]["level"],1)
        self.assertEqual(self.state()["hiragana"]["review"]["あ"]["nextAt"],due)
        self.assertEqual(len(self.store.audit_events(self.alice)),2)
        c=self.event(self.mac,"hiragana","あ","recognize",1)
        self.store.apply_events(self.alice,[c])
        self.assertEqual(self.state()["hiragana"]["review"]["あ"]["level"],2)

    def test_stale_miss_is_conservative(self):
        self.store.apply_events(self.alice,[self.event(self.mac,"katakana","ア","recognize")])
        before=self.state()["katakana"]["review"]["ア"]["nextAt"]
        self.now[0]+=200
        response=self.store.apply_events(self.alice,[self.event(self.phone,"katakana","ア","miss",0)])
        review=self.state()["katakana"]["review"]["ア"]
        self.assertEqual(response["decisions"],["concurrent-miss"])
        self.assertEqual(review["level"],0)
        self.assertLessEqual(review["nextAt"],before)

    def test_bad_actions_are_atomic_and_users_isolated(self):
        good=self.event(self.mac,"hiragana","う","recognize")
        bad=self.event(self.mac,"katakana","INVALID","recognize")
        with self.assertRaises(SyncError): self.store.apply_events(self.alice,[good,bad])
        self.assertEqual(self.state()["revision"],0)
        self.store.apply_events(self.alice,[good])
        with self.assertRaises(SyncError): self.store.apply_events(self.bob,[good])
        self.assertEqual(self.state(self.bob)["revision"],0)
        seq_collision=dict(good,event_id=uid(),item="い")
        with self.assertRaises(SyncError): self.store.apply_events(self.alice,[seq_collision])
        future=self.event(self.phone,"hiragana","う","recognize",600)
        with self.assertRaises(SyncError): self.store.apply_events(self.alice,[future])

    def test_corrupt_legacy_and_bad_clock_cannot_invent_progress(self):
        now=int(self.now[0]*1000)
        s={KEYS["hiragana"]:json.dumps({"mastered":["あ","invalid"],"review":{
           "あ":{"level":99,"lastAt":now+100*REVIEW_DAY,"nextAt":now+100*REVIEW_DAY}}}),
           KEYS["katakana"]:"bad-json",
           KEYS["advanced"]:json.dumps({"hiragana":["invalid"]}),
           KEYS["words"]:json.dumps({"collected":["invalid"]}),
           KEYS["food"]:json.dumps({"ordered":["unagi","other"]})}
        self.store.import_legacy(self.alice,uid(),self.mac,s)
        r=self.state()
        self.assertEqual(r["hiragana"]["mastered"],["あ"])
        self.assertLessEqual(r["hiragana"]["review"]["あ"]["nextAt"],now)
        self.assertEqual(r["advanced"]["hiragana"],[])
        self.assertEqual(r["food"]["ordered"],["unagi"])

    def test_trace_not_mastery_and_durable_reopen(self):
        e=self.event(self.phone,"hiragana","い","trace")
        self.store.apply_events(self.alice,[e])
        self.assertEqual(self.state()["hiragana"]["mastered"],[])
        self.assertEqual(self.state()["hiragana"]["traced"],["い"])
        restored=SyncStore(self.path,clock=lambda:self.now[0])
        self.assertEqual(restored.snapshot(self.alice)["hiragana"]["traced"],["い"])
        self.assertEqual(restored.apply_events(self.alice,[e])["state"]["revision"],1)

    def test_limits_and_unknown_account(self):
        with self.assertRaises(SyncError): self.store.apply_events(uid(),[])
        huge=[self.event(self.mac,"hiragana","あ","recognize") for _ in range(65)]
        with self.assertRaises(SyncError): self.store.apply_events(self.alice,huge)
        self.assertEqual(self.state()["revision"],0)

if __name__=="__main__": unittest.main()
