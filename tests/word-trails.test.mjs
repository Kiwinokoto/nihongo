import test from "node:test";
import assert from "node:assert/strict";
import {ALL_KANA,normaliseProgress,markCorrect} from "../assets/progression.js";
import {WORDS,WORD_STORAGE_KEY,parseWordProgress,isWordReady,availableWords,collectWord} from "../assets/word-trails.js";

test("word postcard catalog is unique, contains only the 46 basic hiragana and has no external assets",()=>{
  assert.equal(WORD_STORAGE_KEY,"kotoba-no-tabi.word-postcards.v1");
  assert.ok(WORDS.length>=15);
  assert.equal(new Set(WORDS.map(w=>w.id)).size,WORDS.length);
  assert.equal(new Set(WORDS.map(w=>w.kana)).size,WORDS.length);
  for(const w of WORDS){
    assert.ok([...w.kana].every(c=>ALL_KANA.includes(c)),w.kana);
    for(const field of ["id","kana","romaji","meaning","description","symbol"])assert.ok(w[field],field);
  }
});
test("readiness depends on already-collected kana, including after a V1 restore",()=>{
  const old=normaliseProgress({mastered:["い","え"],traced:["あ"]});
  const ie=WORDS.find(w=>w.id==="ie"),kaki=WORDS.find(w=>w.id==="kaki");
  assert.equal(isWordReady(ie,old.mastered),true);
  assert.equal(isWordReady(kaki,old.mastered),false);
  assert.ok(availableWords(old.mastered).some(w=>w.id==="ie"));
  assert.ok(!availableWords(old.mastered).some(w=>w.id==="kaki"));
  markCorrect(old,"か",1000);markCorrect(old,"き",1000);
  assert.equal(isWordReady(kaki,old.mastered),true);
});
test("postcard saves are independent from kana progress and cannot collect a locked word",()=>{
  const kana=normaliseProgress({mastered:["い","え"]});
  const separate=parseWordProgress("{}");
  assert.equal(collectWord(separate,"kaki",kana.mastered),false);
  assert.equal(collectWord(separate,"ie",kana.mastered),true);
  assert.equal(collectWord(separate,"ie",kana.mastered),false);
  assert.deepEqual(separate.collected,["ie"]);
  assert.deepEqual(kana.mastered,["い","え"]);
});
test("bad/duplicate postcard data is normalized and unknown IDs are discarded",()=>{
  assert.deepEqual(parseWordProgress("{broken"),{collected:[]});
  assert.deepEqual(parseWordProgress("[]"),{collected:[]});
  assert.deepEqual(parseWordProgress('{"collected":["ie","ie","invalid",42,"sushi"]}'),{collected:["ie","sushi"]});
});
