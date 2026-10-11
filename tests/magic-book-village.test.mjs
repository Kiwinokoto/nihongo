import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {learningSnapshot,discoveredGroups,villageReview,villageQuestionPool} from "../assets/learning-snapshot.js";
import {STORAGE_KEY} from "../assets/progression.js";
import {KATA_STORAGE_KEY} from "../assets/katakana-progress.js";
import {ADVANCED_STORAGE_KEY,ADVANCED} from "../assets/advanced-kana-data.js";
import {WORD_STORAGE_KEY} from "../assets/word-trails.js";
import {FOOD_KEY} from "../assets/food-lane-data.js";
const sample={
 [STORAGE_KEY]:JSON.stringify({mastered:["あ","い","x","あ"],traced:["う"]}),
 [KATA_STORAGE_KEY]:JSON.stringify({mastered:["ア","イ"]}),
 [ADVANCED_STORAGE_KEY]:JSON.stringify({hiragana:[ADVANCED.hiragana[0].id],katakana:[]}),
 [WORD_STORAGE_KEY]:JSON.stringify({collected:["ie","kaki","not-real"]}),
 [FOOD_KEY]:JSON.stringify({ordered:["yakitori"]})
};
const read=key=>sample[key]??null;
test("book reads and normalizes five existing learning keys without creating a sixth",()=>{
 const before=JSON.stringify(sample),keys=[];
 const state=learningSnapshot(key=>{keys.push(key);return read(key)});
 assert.deepEqual(keys,[STORAGE_KEY,KATA_STORAGE_KEY,ADVANCED_STORAGE_KEY,WORD_STORAGE_KEY,FOOD_KEY]);
 const groups=discoveredGroups(state);
 assert.deepEqual(groups.map(g=>g.items.length),[2,2,1,2,1]);
 assert.deepEqual(groups.find(g=>g.id==="words").items.map(i=>i.label),["いえ","かき"]);
 assert.equal(JSON.stringify(sample),before);
 const fresh=discoveredGroups(learningSnapshot(()=>null));
 assert.deepEqual(fresh.map(g=>g.items.length),[0,0,0,0,0]);
});
test("review only targets collected entries and has unique 4-option choices",()=>{
 const state=learningSnapshot(read),pool=villageQuestionPool(state);
 assert.equal(pool.length,8);
 const known=new Set(pool.map(p=>p.id));
 const round=villageReview(state,()=>0.45);
 assert.equal(round.length,5);
 assert.equal(new Set(round.map(q=>q.id)).size,5);
 assert.equal(new Set(round.map(q=>q.kind)).size,5);
 for(const q of round){
  assert.ok(known.has(q.id));
  assert.equal(q.choices.length,4);
  assert.equal(new Set(q.choices).size,4);
  assert.equal(q.choices.filter(c=>c===q.answer).length,1);
 }
 const first=villageReview(learningSnapshot(key=>key===STORAGE_KEY?JSON.stringify({mastered:["あ"]}):null),()=>0.1);
 assert.equal(first.length,1);
 assert.equal(first[0].glyph,"あ");
 assert.deepEqual(villageReview(learningSnapshot(()=>null)),[]);
});
test("corrupt saves are safely ignored, and writing-only practice cannot invent a question",()=>{
 const broken=learningSnapshot(key=>key===STORAGE_KEY?JSON.stringify({traced:["あ"],mastered:["NOT_A_KANA"]}):"{bad");
 assert.deepEqual(discoveredGroups(broken).map(g=>g.items.length),[0,0,0,0,0]);
 assert.deepEqual(villageReview(broken),[]);
});
test("one magic book has two views, no old journal modal, and village writes no progress",()=>{
 const root=new URL("../",import.meta.url);
 const html=readFileSync(new URL("index.html",root),"utf8");
 const app=readFileSync(new URL("assets/app.js",root),"utf8");
 const village=readFileSync(new URL("assets/starting-village.js",root),"utf8");
 assert.match(html,/id="open-voice-help"/);
 assert.match(html,/id="open-journal"/);
 assert.match(html,/id="memories-dialog"/);
 assert.doesNotMatch(html,/id="journal-dialog"|journal-milestone-list/);
 assert.match(app,/openMagicBook/);
 assert.doesNotMatch(app,/renderMilestoneJournal|renderJournal\(/);
 assert.match(village,/villageReview\(snapshot\)/);
 assert.ok(readFileSync(new URL("assets/styles.css",root),"utf8").includes("#village-review-next[hidden]{display:none!important}"));
 assert.doesNotMatch(village,/localStorage|sessionStorage|setItem/);
});
