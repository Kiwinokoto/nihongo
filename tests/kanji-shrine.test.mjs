import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {SHRINE_KANJI,shrineChoices} from "../assets/kanji-shrine-data.js";

test("the eight kanji are unique, contextual, and have explicit Japanese readings",()=>{
 assert.equal(SHRINE_KANJI.length,8);
 assert.equal(new Set(SHRINE_KANJI.map(x=>x.kanji)).size,8);
 assert.equal(new Set(SHRINE_KANJI.map(x=>x.meaning)).size,8);
 for(const k of SHRINE_KANJI){
  assert.ok(k.word.includes(k.kanji),k.word);
  assert.ok(k.sentence.includes(k.word),k.sentence);
  assert.match(k.reading,/^[ぁ-ゖー]+$/u);
  assert.ok(k.sentenceReading && k.sentenceMeaning && k.romaji && k.context);
 }
});
test("all meanings have exactly four different choices and one correct match",()=>{
 for(const item of SHRINE_KANJI){
  const choices=shrineChoices(item,SHRINE_KANJI,()=>0.42);
  assert.equal(choices.length,4);
  assert.equal(new Set(choices.map(x=>x.id)).size,4);
  assert.equal(choices.filter(x=>x.id===item.id).length,1);
 }
});
test("shrine is openly selectable from the map and uses no persistent progress keys",()=>{
 const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");
 const app=readFileSync(new URL("../assets/app.js",import.meta.url),"utf8");
 const ui=readFileSync(new URL("../assets/kanji-shrine.js",import.meta.url),"utf8");
 assert.match(html,/data-place="shrine" aria-label="Shrine of kanji, available"/);
 assert.match(html,/id="shrine-dialog"/);
 assert.match(app,/renderKanjiShrine\(\$\("shrine-content"\),speakJapanese\)/);
 assert.match(app,/status:"READY",button:"Enter the shrine"/);
 assert.match(ui,/speakJapanese\(entry\.sentence,/);
 assert.doesNotMatch(ui,/localStorage|sessionStorage|setItem|markCorrect|mastered/);
 assert.match(ui,/\/assets\/art\/kanji-shrine\.webp/);
});
