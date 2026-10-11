import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,statSync} from "node:fs";
import {dirname,join} from "node:path";
import {fileURLToPath} from "node:url";
import {MEMORIES,memoryAccess} from "../assets/memories-data.js";
import {milestoneStatus} from "../assets/story-milestones.js";
const root=join(dirname(fileURLToPath(import.meta.url)),"..");
const flags=counts=>memoryAccess(milestoneStatus(counts)).map(m=>m.unlocked);
test("five memories unlock from independent, real milestones",()=>{
 assert.equal(MEMORIES.length,5);
 assert.deepEqual(flags({}),[false,false,false,false,false]);
 assert.deepEqual(flags({words:1}),[true,false,false,false,false]);
 assert.deepEqual(flags({hiragana:46}),[true,true,false,false,false]);
 assert.deepEqual(flags({katakana:46}),[true,false,true,false,false]);
 assert.deepEqual(flags({advanced:8}),[true,false,false,true,false]);
 assert.deepEqual(flags({hiragana:46,katakana:45}),[true,true,false,false,false]);
 assert.deepEqual(flags({hiragana:45,katakana:46}),[true,false,true,false,false]);
 assert.deepEqual(flags({hiragana:46,katakana:46}),[true,true,true,false,true]);
 assert.deepEqual(flags({hiragana:46,katakana:46,advanced:8}),[true,true,true,true,true]);
});
test("four separate webp illustrations, fifth moment recomposes the original diptych",()=>{
 const sources=[];
 for(const memory of MEMORIES){
  const pictures=memory.panels??[memory];
  for(const picture of pictures){
   assert.match(picture.source,/^\/assets\/memories\/[a-z-]+\.webp$/);
   const path=join(root,picture.source.slice(1));
   const bytes=readFileSync(path);
   assert.equal(bytes.toString("ascii",0,4),"RIFF");
   assert.equal(bytes.toString("ascii",8,12),"WEBP");
   assert.ok(statSync(path).size<600_000);
   assert.ok(picture.alt.length>50);
   sources.push(picture.source);
  }
 }
 assert.equal(new Set(sources).size,4);
 assert.deepEqual(MEMORIES[4].requirements,["hiragana","katakana"]);
 assert.deepEqual(MEMORIES[4].panels.map(p=>p.source),[
  "/assets/memories/blossom-bridge.webp","/assets/memories/next-stop.webp"
 ]);
 assert.equal(new Set(MEMORIES.map(m=>m.id)).size,MEMORIES.length);
});
test("journal remains isolated from original hero, map, learning and learner tracking",()=>{
 const html=readFileSync(join(root,"index.html"),"utf8");
 const app=readFileSync(join(root,"assets/app.js"),"utf8");
 const journal=readFileSync(join(root,"assets/little-memories.js"),"utf8");
 assert.match(html,/id="open-journal"/);
 assert.doesNotMatch(html,/id="journal-dialog"/);
 assert.match(journal,/data-book-page="discoveries"/);
 assert.match(journal,/data-book-page="memories"/);
 assert.match(html,/id="memories-dialog"/);
 assert.match(html,/id="hero-scene-image"/);
 assert.match(html,/assets\/landscape\.svg/);
 assert.match(app,/renderLittleMemories/);
 assert.doesNotMatch(journal,/localStorage|setItem|fetch\(/);
 assert.doesNotMatch(journal,/innerHTML\s*\+=/);
 assert.match(journal,/if\(memory\.unlocked\)/);
 assert.match(journal,/memory\.panels/);
});
