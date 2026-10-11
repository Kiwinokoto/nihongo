// Generates an exact, auditable whitelist from the browser curriculum.
import {writeFileSync} from "node:fs";
import {KANA} from "../../assets/progression.js";
import {KATA} from "../../assets/katakana-progress.js";
import {ADVANCED} from "../../assets/advanced-kana-data.js";
import {WORDS} from "../../assets/word-trails.js";
import {DISHES} from "../../assets/food-lane-data.js";
const data={
 hiragana:KANA.map(x=>x.glyph),
 katakana:KATA.map(x=>x.glyph),
 advanced_hiragana:ADVANCED.hiragana.map(x=>x.id),
 advanced_katakana:ADVANCED.katakana.map(x=>x.id),
 words:WORDS.map(x=>x.id),food:DISHES.map(x=>x.id)
};
const json=JSON.stringify(data,null,2)+"\n";
if(process.argv.includes("--check")){
 const {readFileSync}=await import("node:fs");
 const present=readFileSync(new URL("./curriculum.json",import.meta.url),"utf8");
 if(present!==json){console.error("Stale server curriculum; regenerate and review.");process.exit(1);}
}else{
 writeFileSync(new URL("./curriculum.json",import.meta.url),json);
}
