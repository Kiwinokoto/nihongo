import test from "node:test";
import assert from "node:assert/strict";
import {existsSync,readFileSync} from "node:fs";
import {join,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {ADVANCED,ADVANCED_STORAGE_KEY,CATEGORIES,REWARD_THRESHOLD,answersFor,
 parseAdvanced,rememberAdvanced,advancedCount,rewardUnlocked} from "../assets/advanced-kana-data.js";
const root=join(dirname(fileURLToPath(import.meta.url)),"..");
const read=path=>readFileSync(join(root,path),"utf8");
test("advanced hiragana and katakana content has no duplicate cards",()=>{
 assert.equal(ADVANCED.hiragana.length,70);
 assert.equal(ADVANCED.katakana.length,94);
 for(const [script,cards]of Object.entries(ADVANCED)){
  assert.equal(new Set(cards.map(c=>c.id)).size,cards.length);
  assert.ok(cards.every(c=>c.script===script&&c.glyph&&c.read&&c.note!==undefined));
  for(const category of CATEGORIES.filter(c=>!c.script||c.script===script)){
   assert.ok(cards.some(c=>c.category===category.id),script+" "+category.id);
  }
 }
});
test("reading patterns include dakuten, handakuten, yoon, sokuon and long vowels",()=>{
 const find=(script,glyph)=>ADVANCED[script].find(c=>c.glyph===glyph);
 assert.equal(find("hiragana","が").read,"ga");
 assert.equal(find("katakana","パ").read,"pa");
 assert.equal(find("hiragana","きゃ").read,"kya");
 assert.equal(find("katakana","シュ").read,"shu");
 assert.equal(find("hiragana","っ").read,"small tsu");
 assert.equal(find("katakana","ッ").read,"small tsu");
 assert.equal(find("katakana","ファ").read,"fa");
 assert.equal(find("katakana","ティ").read,"ti");
 assert.equal(find("katakana","コーヒー").read,"kōhī");
 assert.equal(find("hiragana","がっこう").read,"gakkō");
 assert.match(find("hiragana","ぢ").note,/less common/i);
 assert.match(find("hiragana","づ").note,/じ\/ず/);
});
test("reading choices distinguish written variants without inventing sound differences",()=>{
 for(const list of Object.values(ADVANCED)){
  const byGroup=Object.groupBy(list,x=>x.category);
  for(const [_,group] of Object.entries(byGroup)){
   for(const card of group){
    const answers=answersFor(card,group);
    assert.equal(answers[0],card.read);
    assert.equal(new Set(answers).size,answers.length);
    assert.ok(answers.length>=3);
   }
  }
 }
 const ji=ADVANCED.hiragana.filter(c=>["じ","ぢ"].includes(c.glyph));
 assert.equal(ji.length,2);
 assert.equal(ji[0].read,ji[1].read);
});
test("advanced progress uses one isolated browser storage key and validates untrusted saves",()=>{
 assert.equal(ADVANCED_STORAGE_KEY,"kotoba-no-tabi.advanced-kana.v1");
 assert.deepEqual(parseAdvanced(null),{hiragana:[],katakana:[]});
 assert.deepEqual(parseAdvanced("{bad"),{hiragana:[],katakana:[]});
 assert.deepEqual(parseAdvanced('{"hiragana":["forged","hiragana-voiced-が","hiragana-voiced-が"],"katakana":["no"]}'),
  {hiragana:["hiragana-voiced-が"],katakana:[]});
 const state=parseAdvanced(null);
 const a=ADVANCED.hiragana[0],b=ADVANCED.katakana[0];
 assert.equal(rememberAdvanced(state,a),true);
 assert.equal(rememberAdvanced(state,a),false);
 assert.equal(rememberAdvanced(state,b),true);
 assert.equal(rememberAdvanced(state,{id:"invalid",script:"hiragana"}),false);
 assert.deepEqual([state.hiragana.length,state.katakana.length],[1,1]);
});
test("the travellers postcard requires eight *different* earned readings",()=>{
 const state=parseAdvanced(null);
 assert.equal(rewardUnlocked(state),false);
 assert.equal(REWARD_THRESHOLD,8);
 for(const c of ADVANCED.hiragana.slice(0,7))rememberAdvanced(state,c);
 assert.equal(advancedCount(state),7);
 assert.equal(rewardUnlocked(state),false);
 rememberAdvanced(state,ADVANCED.katakana[0]);
 assert.equal(rewardUnlocked(state),true);
});
test("independent scene is original and no handwriting auto-grading ships",()=>{
 assert.match(read("assets/advanced-kana.js"),/travellers-closeup\.svg/);
 assert.match(read("assets/advanced-kana.js"),/rewardUnlocked\(state\)/);
 assert.doesNotMatch(read("assets/advanced-kana.js"),/kotoba-no-tabi\.progress\.v1|kotoba-no-tabi\.katakana\.v1|fetch\(/);
 assert.match(read("tools/draw_destinations.py"),/def travellers_reward/);
 assert.ok(existsSync(join(root,"assets/art/travellers-closeup.svg")));
 assert.match(read("index.html"),/id="advanced-dialog"/);
});
