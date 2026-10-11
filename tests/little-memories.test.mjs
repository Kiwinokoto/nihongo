import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,statSync} from "node:fs";
import {dirname,join} from "node:path";
import {fileURLToPath} from "node:url";
import {MEMORIES,memoryAccess} from "../assets/memories-data.js";
import {milestoneStatus} from "../assets/story-milestones.js";
const root=join(dirname(fileURLToPath(import.meta.url)),"..");
test("illustrated journal unlocks only from existing achievements",()=>{
 const start=memoryAccess(milestoneStatus({}));
 assert.equal(start.length,3);
 assert.deepEqual(start.map(x=>x.unlocked),[false,false,false]);
 assert.deepEqual(memoryAccess(milestoneStatus({words:1})).map(x=>x.unlocked),[true,false,false]);
 assert.deepEqual(memoryAccess(milestoneStatus({advanced:8})).map(x=>x.unlocked),[true,true,false]);
 assert.deepEqual(memoryAccess(milestoneStatus({katakana:46})).map(x=>x.unlocked),[true,false,true]);
 assert.deepEqual(memoryAccess(milestoneStatus({hiragana:46,katakana:46,advanced:8})).map(x=>x.unlocked),[true,true,true]);
});
test("illustration assets are optimized bundled webp, not random third-party URLs",()=>{
 for(const scene of MEMORIES){
  assert.match(scene.source,/^\/assets\/memories\/[a-z-]+\.webp$/);
  const path=join(root,scene.source.slice(1));const bytes=readFileSync(path);
  assert.equal(bytes.toString("ascii",0,4),"RIFF");
  assert.equal(bytes.toString("ascii",8,12),"WEBP");
  assert.ok(statSync(path).size<600_000);
  assert.ok(scene.alt.length>50);
 }
 assert.equal(new Set(MEMORIES.map(x=>x.id)).size,MEMORIES.length);
});
test("separate optional modal does not modify hero, map or learning progress",()=>{
 const html=readFileSync(join(root,"index.html"),"utf8");
 const app=readFileSync(join(root,"assets/app.js"),"utf8");
 const journal=readFileSync(join(root,"assets/little-memories.js"),"utf8");
 assert.match(html,/id="open-little-memories"/);
 assert.match(html,/id="memories-dialog"/);
 assert.match(html,/id="hero-scene-image"/);
 assert.match(html,/assets\/landscape\.svg/);
 assert.match(app,/renderLittleMemories/);
 assert.doesNotMatch(journal,/localStorage|setItem|fetch\(/);
 assert.doesNotMatch(journal,/innerHTML\s*\+=/);
 assert.match(journal,/if\(memory\.unlocked\)/);
});
