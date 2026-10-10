import test from "node:test";
import assert from "node:assert/strict";
import {
  ROWS, KANA, ALL_KANA, DAY, normaliseProgress, parseProgress,
  isRowUnlocked, completedInRow, currentRow, dueKana, markCorrect,
  markIncorrect, markTraced
} from "../assets/progression.js";

test("hiragana chart includes all 46 unique standard characters in ten groups",()=>{
  assert.equal(ROWS.length,10);
  assert.equal(KANA.length,46);
  assert.equal(new Set(ALL_KANA).size,46);
  assert.equal(ROWS.map(r=>[...r.kana].length).reduce((a,b)=>a+b),46);
  assert.equal(KANA[0].romaji,"a");
  assert.equal(KANA.at(-1).romaji,"n");
});
test("v1 browser progress migrates without loss or invalid extra characters",()=>{
  const state=normaliseProgress({mastered:["あ","い","UNKNOWN","あ"],traced:["あ","no"]},5000);
  assert.deepEqual(state.mastered,["あ","い"]);
  assert.deepEqual(state.traced,["あ"]);
  assert.equal(state.review["あ"].nextAt,5000+DAY);
  assert.deepEqual(parseProgress("bad-json"),{mastered:[],traced:[],review:{}});
});
test("next row opens only after completing previous row",()=>{
  const state=normaliseProgress({});
  assert.equal(currentRow(state),0);
  assert.equal(isRowUnlocked(state,1),false);
  for(const kana of [...ROWS[0].kana])markCorrect(state,kana,1_000);
  assert.equal(completedInRow(state,0),5);
  assert.equal(isRowUnlocked(state,1),true);
  assert.equal(isRowUnlocked(state,2),false);
  assert.equal(currentRow(state),1);
});
test("spaced review gets due after one day, then three days and a miss shortens interval",()=>{
  const state=normaliseProgress({});
  const base=1_000_000;
  assert.equal(markCorrect(state,"あ",base),true);
  assert.equal(markCorrect(state,"あ",base+DAY),false);
  assert.deepEqual(dueKana(state,base+DAY),[]);
  assert.deepEqual(dueKana(state,base+4*DAY),["あ"]);
  markIncorrect(state,"あ",base+4*DAY);
  assert.equal(state.mastered.length,1);
  assert.deepEqual(dueKana(state,base+4*DAY),[]);
  assert.deepEqual(dueKana(state,base+4*DAY+60*60*1000),["あ"]);
  const afterReload=normaliseProgress(JSON.parse(JSON.stringify(state)),base+4*DAY);
  markCorrect(afterReload,"あ",base+4*DAY+60*60*1000);
  assert.equal(afterReload.review["あ"].level,1);
  assert.equal(afterReload.review["あ"].nextAt,base+5*DAY+60*60*1000);
});
test("self-reported drawing practice never grants a collected kana",()=>{
  const state=normaliseProgress({});
  markTraced(state,"あ");
  assert.deepEqual(state.traced,["あ"]);
  assert.deepEqual(state.mastered,[]);
  markCorrect(state,"あ",100);
  assert.deepEqual(state.mastered,["あ"]);
});
