import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {KANA} from "../assets/progression.js";
import {KATA} from "../assets/katakana-progress.js";
import {ADVANCED} from "../assets/advanced-kana-data.js";
import {WORDS} from "../assets/word-trails.js";
import {DISHES} from "../assets/food-lane-data.js";

test("staged server allowlist matches the actual learning curriculum",()=>{
 const catalog=JSON.parse(readFileSync(new URL("../sync_core/curriculum.json",import.meta.url),"utf8"));
 assert.deepEqual(catalog.hiragana,KANA.map(x=>x.glyph));
 assert.deepEqual(catalog.katakana,KATA.map(x=>x.glyph));
 assert.deepEqual(catalog.advanced_hiragana,ADVANCED.hiragana.map(x=>x.id));
 assert.deepEqual(catalog.advanced_katakana,ADVANCED.katakana.map(x=>x.id));
 assert.deepEqual(catalog.words,WORDS.map(x=>x.id));
 assert.deepEqual(catalog.food,DISHES.map(x=>x.id));
});

test("prototype auth headers are never exposed by production static compose",()=>{
 const compose=readFileSync(new URL("../deploy/compose.yml",import.meta.url),"utf8");
 const app=readFileSync(new URL("../assets/app.js",import.meta.url),"utf8");
 assert.doesNotMatch(compose,/sync_core|staging_http|KOTOBA_SYNC_TEST_ONLY/);
 assert.doesNotMatch(app,/X-Stage-Subject|X-Stage-Token/);
});
