"""Private, loopback-only HTTP test harness: NOT a production login service.

Never place this server behind Traefik. X-Stage-Subject is deliberately untrusted
and may be used only for local test identities alongside a random dev token.
"""
import hmac
import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from uuid import uuid4
from sync_core.engine import SyncStore, SyncError

def make_handler(store, token):
    if not isinstance(token,str) or len(token)<32:
        raise RuntimeError("Long test token required")
    class Handler(BaseHTTPRequestHandler):
        server_version="KotobaLoopbackTest/0"
        sys_version=""
        def log_message(self,*args):
            pass # Never log learner content or development tokens.
        def reply(self,status,obj):
            data=json.dumps(obj,ensure_ascii=False).encode("utf-8")
            self.send_response(status)
            self.send_header("Content-Type","application/json; charset=utf-8")
            self.send_header("Cache-Control","no-store")
            self.send_header("X-Content-Type-Options","nosniff")
            self.send_header("Content-Length",str(len(data)))
            self.end_headers()
            self.wfile.write(data)
        def authorized(self):
            if not hmac.compare_digest(self.headers.get("X-Stage-Token",""),token):
                self.reply(403,{"error":"Forbidden"})
                return False
            return True
        def payload(self):
            try: length=int(self.headers.get("Content-Length",""))
            except (TypeError,ValueError): raise SyncError("Content-Length required")
            if length<0 or length>90_000: raise SyncError("Oversized body")
            try: value=json.loads(self.rfile.read(length))
            except (UnicodeError,ValueError): raise SyncError("Invalid JSON")
            if not isinstance(value,dict): raise SyncError("Object required")
            return value
        def handle_sync(self):
            if not self.authorized(): return
            try:
                if self.path=="/dev/register" and self.command=="POST":
                    if self.payload(): raise SyncError("Use empty registration body")
                    subject=str(uuid4())
                    store.register_subject(subject)
                    return self.reply(201,{"subject":subject})
                subject=self.headers.get("X-Stage-Subject","")
                if self.path=="/v1/state" and self.command=="GET":
                    return self.reply(200,{"state":store.snapshot(subject)})
                if self.path=="/v1/events" and self.command=="POST":
                    body=self.payload()
                    if set(body)!={"events"}: raise SyncError("Unsupported envelope")
                    return self.reply(200,store.apply_events(subject,body["events"]))
                if self.path=="/v1/legacy-import" and self.command=="POST":
                    body=self.payload()
                    if set(body)!={"import_id","device_id","keys"}: raise SyncError("Unsupported envelope")
                    return self.reply(200,store.import_legacy(subject,body["import_id"],body["device_id"],body["keys"]))
                return self.reply(404,{"error":"Not found"})
            except SyncError: return self.reply(400,{"error":"Invalid sync request"})
            except Exception: return self.reply(500,{"error":"Internal staging error"})
        def do_POST(self): self.handle_sync()
        def do_GET(self):
            if self.path=="/healthz": return self.reply(200,{"mode":"loopback-test-only"})
            self.handle_sync()
    return Handler

def loopback_server(store,token,port=0):
    return ThreadingHTTPServer(("127.0.0.1",port),make_handler(store,token))

if __name__=="__main__":
    if os.environ.get("KOTOBA_SYNC_TEST_ONLY")!="1":
        raise SystemExit("Refusing to expose test server; enable explicit test flag")
    token=os.environ.get("KOTOBA_SYNC_DEV_TOKEN","")
    db=os.environ.get("KOTOBA_SYNC_TEST_DB","/tmp/kotoba-test-sync.sqlite3")
    server=loopback_server(SyncStore(db),token,int(os.environ.get("KOTOBA_SYNC_TEST_PORT","18719")))
    try: server.serve_forever()
    finally: server.server_close()
