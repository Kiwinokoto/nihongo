import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {KATAKANA_WORDS,choicesForWord,shuffledWords} from "../assets/katakana-word-data.js";

test("katakana town includes eight unique authentic written words and safe meanings",()=>{
 assert.equal(KATAKANA_WORDS.length,8);
 assert.equal(new Set(KATAKANA_WORDS.map(w=>w.id)).size,8);
 assert.equal(new Set(KATAKANA_WORDS.map(w=>w.kana)).size,8);
 assert.equal(new Set(KATAKANA_WORDS.map(w=>w.meaning)).size,8);
 for(const w of KATAKANA_WORDS){
  assert.match(w.kana,/^[ァ-ヶー]+$/u);
  assert.ok(w.reading && w.place && w.note);
 }
 assert.ok(KATAKANA_WORDS.some(w=>w.kana.includes("ー")));
 assert.ok(KATAKANA_WORDS.some(w=>w.kana.includes("ッ")));
});
test("all meaning challenges have four distinct choices with one answer",()=>{
 for(const word of KATAKANA_WORDS){
  const opts=choicesForWord(word,KATAKANA_WORDS,()=>0.5);
  assert.equal(opts.length,4);
  assert.equal(new Set(opts.map(x=>x.id)).size,4);
  assert.equal(opts.filter(x=>x.id===word.id).length,1);
 }
 assert.equal(shuffledWords(KATAKANA_WORDS).length,8);
});
test("town practice is independent of progress, only uses whole-word Japanese audio",()=>{
 const ui=readFileSync(new URL("../assets/katakana-words.js",import.meta.url),"utf8");
 const station=readFileSync(new URL("../assets/katakana-station.js",import.meta.url),"utf8");
 assert.doesNotMatch(ui,/localStorage|sessionStorage|markCorrect|correctKata|setItem/);
 assert.match(ui,/speakJapanese\(word\.kana,/);
 assert.match(station,/renderKatakanaWords\(panel,speakJapanese/);
 assert.match(station,/id="open-katakana-words"/);
});
