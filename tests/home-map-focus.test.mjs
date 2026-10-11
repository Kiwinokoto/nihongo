import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {dirname,join} from "node:path";
const root=join(dirname(fileURLToPath(import.meta.url)),"..");
const read=(f)=>readFileSync(join(root,f),"utf8");

test("main landing page encourages map exploration instead of hardwiring hiragana CTA",()=>{
 const html=read("index.html"),script=read("assets/app.js");
 assert.doesNotMatch(html,/id="start-journey"/);
 assert.doesNotMatch(script,/\$\("start-journey"\)/);
 assert.match(html,/Your little world/);
 assert.match(html,/data-place="start"/);
 assert.match(html,/data-place="garden"/);
 assert.match(html,/data-place="train"/);
 assert.match(html,/data-place="tea"/);
 assert.doesNotMatch(html,/class="welcome-footnote"/);
 assert.match(html,/Your little world/);
 assert.match(html,/id="hero-scene-controls"/);
 assert.match(read("assets/styles.css"),/hero-scene-controls:hover/);
});
test("original scene is shared by compact hero and starting village, never replacing map",()=>{
 const html=read("index.html"),village=read("assets/starting-village.js"),art=read("assets/art/village-path.svg");
 assert.match(html,/welcome-illustration[\s\S]{0,220}village-path\.svg/);
 assert.match(village,/village-path\.svg/);
 assert.match(html,/class="map-art" src="\/assets\/landscape\.svg"/);
 assert.match(art,/xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
 assert.match(read("tools/draw_destinations.py"),/def ikemen_travellers/);
 assert.match(read("tools/draw_destinations.py"),/matching tiny blossom charm/);
});
test("story hint is discoverable but still gated behind collected word postcards",()=>{
 const app=read("assets/app.js"),teaser=read("assets/lantern-evening.js");
 assert.match(app,/Some postcards lead to quiet stories/);
 assert.match(teaser,/renderLanternTeaser/);
 assert.match(teaser,/collected/);
});
