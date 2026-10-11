import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {planKanaCheckpoint} from "../assets/kana-checkpoint.js";
import {KANA,ROWS} from "../assets/progression.js";
import {KATA,KATA_ROWS} from "../assets/katakana-progress.js";
test("mixed checkpoint has one recognition and one writing recall per kana",()=>{
 for(const [alphabet,rows] of [[KANA,ROWS],[KATA,KATA_ROWS]]){
  for(let row=0;row<rows.length;row++){
   const items=alphabet.filter(x=>x.row===row),tasks=planKanaCheckpoint(items);
   assert.equal(tasks.length,items.length*2);
   for(const t of ["recognition","writing"]){
    const segment=tasks.filter(x=>x.type===t);
    assert.equal(segment.length,items.length);
    assert.deepEqual(segment.map(x=>x.item.glyph).sort(),items.map(x=>x.glyph).sort());
   }
   for(let i=1;i<tasks.length;i++)
    assert.notEqual(tasks[i].item.glyph,tasks[i-1].item.glyph,
      "writing memory should not immediately follow a revealed version of the same kana");
  }
 }
});
test("new learning/check separation does not introduce graded handwriting claims",()=>{
 const app=readFileSync(new URL("../assets/app.js",import.meta.url),"utf8");
 const kata=readFileSync(new URL("../assets/katakana-station.js",import.meta.url),"utf8");
 const check=readFileSync(new URL("../assets/kana-checkpoint.js",import.meta.url),"utf8");
 const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");
 assert.match(app,/tab==="checkpoint"/);
 assert.match(kata,/mode==="checkpoint"/);
 assert.match(check,/writing is a self-check|Handwriting is a self-check/);
 assert.match(check,/cannot grade writing yet/);
 assert.doesNotMatch(check,/localStorage|sessionStorage|setItem/);
 assert.match(html,/LEARN &amp; PRACTISE|LEARN & PRACTISE/);
 assert.match(html,/CHECK YOURSELF/);
 assert.doesNotMatch(check,/correctKata|markCorrect/);
});
