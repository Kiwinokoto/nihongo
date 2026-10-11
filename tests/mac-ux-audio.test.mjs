import test from "node:test";
import assert from "node:assert/strict";
import {existsSync,readFileSync} from "node:fs";
import {join,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {outsideDialog} from "../assets/dialog-dismiss.js";
import {VOWEL_AUDIO,japaneseVoiceList,playbackKind} from "../assets/japanese-audio.js";
const ROOT=join(dirname(fileURLToPath(import.meta.url)),"..");

test("backdrop geometry distinguishes outside from dialog content, including edges",()=>{
 const box={left:120,top:90,right:700,bottom:650};
 assert.equal(outsideDialog(box,90,300),true);
 assert.equal(outsideDialog(box,400,40),true);
 assert.equal(outsideDialog(box,710,250),true);
 assert.equal(outsideDialog(box,400,700),true);
 assert.equal(outsideDialog(box,400,300),false);
 assert.equal(outsideDialog(box,120,90),false);
});
test("five human-recorded vowels cover both kana scripts, with no false word fallback",()=>{
 assert.equal(Object.keys(VOWEL_AUDIO).length,10);
 const text="あいうえお",kata="アイウエオ";
 for(let i=0;i<5;i++)assert.equal(VOWEL_AUDIO[text[i]],VOWEL_AUDIO[kata[i]]);
 assert.equal(playbackKind("あ",[]),"recording");
 assert.equal(playbackKind("ア",[]),"recording");
 assert.equal(playbackKind("か",[]),"unavailable");
 assert.equal(playbackKind("こんにちは",[]),"unavailable");
 assert.equal(playbackKind("こんにちは",[{lang:"ja-JP"}]),"system");
});
test("licensed, bundled audio exists locally as playable MP3 files",()=>{
 for(const filename of ["a","i","u","e","o"]){
  const bytes=readFileSync(join(ROOT,"assets","audio","kana",filename+".mp3"));
  assert.ok(bytes.length>1000);
  assert.ok(bytes.subarray(0,3).toString()==="ID3"||(bytes[0]===0xff&&(bytes[1]&0xf0)===0xf0));
 }
 assert.ok(existsSync(join(ROOT,"docs/AUDIO_SOURCES.md")));
});
test("voice diagnostic sees only Japanese voices and does not force locale substitution",()=>{
 assert.deepEqual(japaneseVoiceList(undefined),[]);
 assert.deepEqual(japaneseVoiceList({getVoices:()=>[{lang:"en-US",name:"A"},{lang:"ja-JP",name:"B"}]}).map(x=>x.name),["B"]);
});
test("new illustrations are original generated SVG files and source is reproducible",()=>{
 const source=readFileSync(join(ROOT,"tools/draw_destinations.py"),"utf8");
 assert.match(source,/village-path.svg/);
 assert.match(source,/katakana-platform.svg/);
 for(const name of ["village-path.svg","katakana-platform.svg"]){
  const art=readFileSync(join(ROOT,"assets/art",name),"utf8");
  assert.match(art,/^<svg/);
  assert.ok(art.includes("viewBox"));
 }
});
