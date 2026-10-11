import test from "node:test";
import assert from "node:assert/strict";
import {existsSync,readFileSync} from "node:fs";
import {dirname,join} from "node:path";
import {fileURLToPath} from "node:url";
import {japaneseVoices} from "../assets/starting-village.js";
import {KATA_ROWS,KATA,KATA_STORAGE_KEY,readKata,kataRowOpen,kataCurrentRow,kataDue,traceKata,correctKata,incorrectKata} from "../assets/katakana-progress.js";
const ROOT=join(dirname(fileURLToPath(import.meta.url)),"..");
test("46 katakana, corresponding rows and matching romaji",async()=>{
 const {KANA,ROWS}=await import("../assets/progression.js");
 assert.equal(KATA.length,46);assert.equal(KATA_ROWS.length,10);
 assert.equal(new Set(KATA.map(k=>k.glyph)).size,46);
 for(let i=0;i<46;i++){assert.equal(KATA[i].romaji,KANA[i].romaji);assert.equal(KATA[i].row,KANA[i].row)}
 for(let i=0;i<10;i++)assert.equal([...KATA_ROWS[i].kana].length,[...ROWS[i].kana].length);
 assert.equal(KATA_STORAGE_KEY,"kotoba-no-tabi.katakana.v1");
});
test("new katakana state is independent and only recognition unlocks",()=>{
 const state=readKata("{broken");
 assert.deepEqual(state,{mastered:[],traced:[],review:{}});
 traceKata(state,"ア");
 assert.deepEqual(state.mastered,[]);
 assert.deepEqual(state.traced,["ア"]);
 assert.equal(kataRowOpen(state,1),false);
 for(const c of KATA_ROWS[0].kana)correctKata(state,c,100);
 assert.equal(kataCurrentRow(state),1);
 assert.equal(kataRowOpen(state,1),true);
 assert.equal(kataRowOpen(state,2),false);
});
test("saved progress and review intervals survive restoration",()=>{
 const at=1_000_000,state=readKata("{}");
 correctKata(state,"ア",at);
 assert.deepEqual(kataDue(state,at+86_400_000),["ア"]);
 const other=readKata(JSON.stringify(state),at);
 incorrectKata(other,"ア",at+86_400_000);
 assert.equal(other.review["ア"].level,0);
 assert.deepEqual(kataDue(other,at+90_000_000),["ア"]);
 correctKata(other,"ア",at+90_000_000);
 assert.equal(other.review["ア"].level,1);
 assert.deepEqual(readKata('{"mastered":["ア","ア","あ","NOT_A_KANA"]}').mastered,["ア"]);
});
test("bundled katakana brush SVGs keep upstream licence",()=>{
 for(const k of KATA){
  const file=join(ROOT,"assets/katakana-strokes",k.glyph.codePointAt(0)+".svg");
  assert.ok(existsSync(file),file);
  assert.match(readFileSync(file,"utf8"),/Lesser General Public License/);
 }
 assert.match(readFileSync(join(ROOT,"tools/sync_katakana_strokes.py"),"utf8"),/ec5e17cca76c87587790bcbce5ea0b4d4fb753d6/);
});
test("Japanese voice detector is local and filters by language",()=>{
 assert.deepEqual(japaneseVoices(null),[]);
 assert.deepEqual(japaneseVoices({getVoices:()=>[{name:"French",lang:"fr-FR"},{name:"Japanese A",lang:"ja-JP"},{name:"Other",lang:"en-US"},{name:"Japanese B",lang:"JA"}]}).map(v=>v.name),["Japanese A","Japanese B"]);
});
test("the village now revisits real discoveries and keeps Mac voice help",()=>{
 const s=readFileSync(join(ROOT,"assets/starting-village.js"),"utf8");
 assert.match(s,/village-review-start/);
 assert.match(s,/village-open-book/);
 assert.match(s,/voice-help/);
 assert.doesNotMatch(s,/localStorage|sessionStorage|fetch\(/);
});
