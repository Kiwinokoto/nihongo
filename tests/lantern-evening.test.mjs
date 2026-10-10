import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { LANTERN_PANELS, canOpenLanternEvening } from "../assets/lantern-evening.js";

const root=join(dirname(fileURLToPath(import.meta.url)),"..");

test("an optional first-word bonus, never a hiragana prerequisite",()=>{
  assert.equal(canOpenLanternEvening(null),false);
  assert.equal(canOpenLanternEvening({collected:[]}),false);
  assert.equal(canOpenLanternEvening({collected:["ie"]}),true);
});
test("three readable, original story panels with distinct local illustrations",()=>{
  assert.equal(LANTERN_PANELS.length,3);
  assert.equal(new Set(LANTERN_PANELS.map(p=>p.image)).size,3);
  for(const part of LANTERN_PANELS){
    assert.ok(part.title&&part.prose&&part.japanese&&part.romaji&&part.translation);
    assert.ok(part.alt.includes("adult"),"characters must be unambiguously adult");
    assert.ok(part.image.startsWith("/assets/stories/"));
    const file=join(root,part.image.slice(1));
    assert.ok(existsSync(file),part.image);
    assert.match(readFileSync(file,"utf8"),/^<svg /);
  }
  assert.match(LANTERN_PANELS[0].japanese,/また/);
  assert.match(LANTERN_PANELS.at(-1).japanese,/いっしょに/);
});
test("story module does not persist reader preferences, age or completion",()=>{
  const source=readFileSync(join(root,"assets/lantern-evening.js"),"utf8");
  assert.doesNotMatch(source,/localStorage|sessionStorage|fetch\(|XMLHttpRequest/);
  assert.match(source,/optional little story|AN OPTIONAL LITTLE STORY/i);
});
