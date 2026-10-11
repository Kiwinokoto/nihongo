import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {join,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {MILESTONES,SCENES,milestoneStatus,unlockedScenes} from "../assets/story-milestones.js";
const root=join(dirname(fileURLToPath(import.meta.url)),"..");
const read=path=>readFileSync(join(root,path),"utf8");

test("first success is easy, regardless of which activity was collected",()=>{
 const fresh=milestoneStatus({});
 assert.equal(fresh[0].unlocked,false);
 assert.deepEqual(unlockedScenes(fresh).map(s=>s.id),["welcome"]);
 for(const category of ["hiragana","katakana","advanced","words","food"]){
  const a=milestoneStatus({[category]:1});
  assert.equal(a[0].unlocked,true,category);
  assert.deepEqual(unlockedScenes(a).map(s=>s.id),["welcome","first-step"]);
 }
 assert.equal(MILESTONES.length,5);
});
test("real 46/46 alphabet milestones and the eight-reading close-up remain independent",()=>{
 const h=milestoneStatus({hiragana:46});
 assert.equal(h.find(m=>m.id==="hiragana").unlocked,true);
 assert.equal(h.find(m=>m.id==="katakana").unlocked,false);
 assert.equal(h.find(m=>m.id==="advanced").unlocked,false);
 const k=milestoneStatus({katakana:46});
 assert.equal(k.find(m=>m.id==="katakana").unlocked,true);
 const advanced7=milestoneStatus({advanced:7});
 assert.equal(advanced7.find(m=>m.id==="advanced").unlocked,false);
 assert.deepEqual(unlockedScenes(advanced7).map(s=>s.id),["welcome","first-step"]);
 const advanced8=milestoneStatus({advanced:8});
 assert.equal(advanced8.find(m=>m.id==="advanced").unlocked,true);
 assert.deepEqual(unlockedScenes(advanced8).map(s=>s.id),["welcome","first-step","closer"]);
 assert.equal(milestoneStatus({hiragana:46,katakana:46,advanced:8}).find(m=>m.id==="kanji").unlocked,false);
});
test("corrupt numeric counts and phantom accomplishments never unlock scenes",()=>{
 const invalid=milestoneStatus({hiragana:-4,katakana:NaN,advanced:Infinity,food:-1,words:"10"});
 assert.equal(invalid.some(m=>m.unlocked),false);
 for(const m of invalid)if(m.progress)assert.equal(m.progress.done,0);
});
test("scene artwork is part of the existing original asset collection",()=>{
 for(const scene of SCENES){
  assert.match(scene.src,/^\/assets\/art\/[a-z-]+\.svg$/);
  assert.ok(read(scene.src.slice(1)).startsWith("<svg"));
  assert.ok(scene.alt&&scene.subtitle);
 }
 assert.equal(new Set(SCENES.map(s=>s.id)).size,SCENES.length);
 const html=read("index.html"),app=read("assets/app.js");
 assert.match(html,/id="hero-scene-controls"/);
 assert.match(html,/id="memories-dialog"/);
 assert.match(read("assets/little-memories.js"),/Scenes along the way/);
 assert.match(app,/refreshStoryScenes/);
 assert.match(app,/touchend/);
 assert.doesNotMatch(app,/story-milestones\.v1|story-preferences|story-views/);
});
