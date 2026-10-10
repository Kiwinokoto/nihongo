import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {join,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {DISHES,FOOD_KEY,parseFoodProgress,markDishOrdered,orderLine} from "../assets/food-lane-data.js";

const root=join(dirname(fileURLToPath(import.meta.url)),"..");
test("six savoury dishes include grilled fish, chicken, octopus and fermented foods",()=>{
 assert.equal(DISHES.length,6);
 assert.equal(new Set(DISHES.map(d=>d.id)).size,6);
 for(const id of ["yakizakana","yakitori","takoyaki","natto","okonomiyaki","unagi"]){
  assert.ok(DISHES.some(d=>d.id===id));
 }
 for(const d of DISHES){
  for(const key of ["id","jp","kana","name","romaji","symbol","detail","note"])assert.ok(d[key],key);
  assert.match(orderLine(d),/をください。$/);
  assert.ok(!d.detail.includes("https:"));
 }
 assert.equal(orderLine(DISHES[0]),"焼き魚をください。");
});
test("optional orders never add unknown dishes or duplicate progress",()=>{
 const state=parseFoodProgress("");
 assert.equal(markDishOrdered(state,"not-food"),false);
 assert.equal(markDishOrdered(state,"yakizakana"),true);
 assert.equal(markDishOrdered(state,"yakizakana"),false);
 assert.deepEqual(state.ordered,["yakizakana"]);
 assert.equal(FOOD_KEY,"kotoba-no-tabi.food-lane.v1");
});
test("corrupted state is reset and valid saved food orders survive",()=>{
 assert.deepEqual(parseFoodProgress("{broken"),{ordered:[]});
 assert.deepEqual(parseFoodProgress("[]"),{ordered:[]});
 assert.deepEqual(parseFoodProgress('{"ordered":["natto","natto","fake",27,"takoyaki"]}'),{ordered:["natto","takoyaki"]});
});
test("new mini-game uses only original local art and no learner tracking",()=>{
 const script=readFileSync(join(root,"assets/food-lane.js"),"utf8");
 assert.ok(existsSync(join(root,"assets/food-lane.svg")));
 assert.match(readFileSync(join(root,"assets/food-lane.svg"),"utf8"),/^<svg /);
 assert.match(script,/food-lane\.svg/);
 assert.doesNotMatch(script,/fetch\(|google-analytics|gtag\(|localStorage\.setItem\(["']kotoba-no-tabi\.progress\.v1/);
 const html=readFileSync(join(root,"index.html"),"utf8");
 assert.match(html,/id="food-dialog"/);
 assert.match(html,/data-place="tea"/);
});
