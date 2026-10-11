import json
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
from pathlib import Path
from uuid import uuid4
from sync_core.engine import SyncStore, KEYS
from sync_core.staging_http import loopback_server

def uid(): return str(uuid4())

class StageHttpTest(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.token="dev-only-"+"Z"*48
        self.server=loopback_server(SyncStore(Path(self.tmp.name)/"stage.db"),self.token)
        thread=threading.Thread(target=self.server.serve_forever,daemon=True)
        thread.start()
        self.addCleanup(self.server.server_close)
        self.addCleanup(self.server.shutdown)
        self.base="http://127.0.0.1:%d"%self.server.server_address[1]
    def req(self,path,body=None,subject="",token=None):
        hdr={"X-Stage-Token":self.token if token is None else token,"X-Stage-Subject":subject}
        if body is not None: hdr["Content-Type"]="application/json"
        request=urllib.request.Request(self.base+path,
           data=json.dumps(body).encode() if body is not None else None,headers=hdr,
           method="POST" if body is not None else "GET")
        try:
            with urllib.request.urlopen(request,timeout=5) as response:
                return response.status,json.load(response)
        except urllib.error.HTTPError as exc:
            return exc.code,json.load(exc)
    def test_requires_token_and_fails_unknown_account(self):
        self.assertEqual(self.server.server_address[0],"127.0.0.1")
        self.assertEqual(self.req("/v1/state",token="bad")[0],403)
        self.assertEqual(self.req("/v1/state",subject=uid())[0],400)
        self.assertEqual(self.req("/healthz")[1]["mode"],"loopback-test-only")
    def test_two_accounts_two_devices_and_idempotent_import(self):
        account=self.req("/dev/register",{})[1]["subject"]
        stranger=self.req("/dev/register",{})[1]["subject"]
        mac,phone=uid(),uid()
        seed={"import_id":uid(),"device_id":mac,
              "keys":{KEYS["hiragana"]:json.dumps({"mastered":["あ","い","う","え","お"]})}}
        self.assertTrue(self.req("/v1/legacy-import",seed,account)[1]["imported"])
        self.assertFalse(self.req("/v1/legacy-import",seed,account)[1]["imported"])
        def event(device,item,kind):
            return dict(event_id=uid(),device_id=device,seq=1,kind=kind,item=item,
                        op="recognize",base_version=0)
        phone_event=event(phone,"イ","katakana")
        mac_event=event(mac,"か","hiragana")
        self.assertEqual(self.req("/v1/events",{"events":[phone_event]},account)[0],200)
        answer=self.req("/v1/events",{"events":[mac_event]},account)[1]
        self.assertEqual(set(answer["state"]["hiragana"]["mastered"]),set("あいうえおか"))
        self.assertEqual(answer["state"]["katakana"]["mastered"],["イ"])
        self.assertEqual(self.req("/v1/events",{"events":[mac_event]},account)[1],answer)
        self.assertEqual(self.req("/v1/state",subject=stranger)[1]["state"]["revision"],0)
        self.assertEqual(self.req("/v1/events",{"events":[mac_event]},stranger)[0],400)

if __name__=="__main__": unittest.main()
