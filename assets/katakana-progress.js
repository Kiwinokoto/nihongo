// Independent katakana practice state. Never touches hiragana progress.
import {ROWS as HIRA_ROWS} from "./progression.js";
export const KATA_STORAGE_KEY="kotoba-no-tabi.katakana.v1";
export const KATA_ROWS=Object.freeze([
 "アイウエオ","カキクケコ","サシスセソ","タチツテト","ナニヌネノ",
 "ハヒフヘホ","マミムメモ","ヤユヨ","ラリルレロ","ワヲン"
].map((s,i)=>Object.freeze({id:HIRA_ROWS[i].id,kana:s,title:HIRA_ROWS[i].title,subtitle:HIRA_ROWS[i].subtitle})));
export const KATA=Object.freeze(KATA_ROWS.flatMap((row,i)=>[...row.kana].map((glyph,j)=>
 Object.freeze({glyph,romaji:HIRA_ROWS[i].subtitle.split(" · ")[j],row:i}))));
const VALID=new Set(KATA.map(c=>c.glyph)),DAY=86400000,INTERVALS=[DAY,3*DAY,7*DAY,14*DAY,30*DAY];
export const blankKata=()=>({mastered:[],traced:[],review:{}});
export function normaliseKata(data,now=Date.now()){
 if(!data||typeof data!=="object"||Array.isArray(data))return blankKata();
 const clean=items=>Array.isArray(items)?[...new Set(items.filter(c=>VALID.has(c)))]:[];
 const mastered=clean(data.mastered),traced=clean(data.traced),review={};
 for(const c of mastered){
  const old=data.review?.[c];
  review[c]={
   level:Number.isInteger(old?.level)?Math.max(0,Math.min(5,old.level)):1,
   lastAt:Number.isFinite(old?.lastAt)?old.lastAt:now,
   nextAt:Number.isFinite(old?.nextAt)&&old.nextAt>0?old.nextAt:now+DAY
  };
 }
 return {mastered,traced,review};
}
export function readKata(raw,now=Date.now()){
 try{return normaliseKata(JSON.parse(raw||"{}"),now)}catch{return blankKata()}
}
export function kataRowOpen(state,index){
 return index===0||(index>0&&index<KATA_ROWS.length&&[...KATA_ROWS[index-1].kana].every(c=>state.mastered.includes(c)));
}
export function kataCurrentRow(state){
 for(let i=0;i<KATA_ROWS.length;i++){
  if(kataRowOpen(state,i)&&[...KATA_ROWS[i].kana].some(c=>!state.mastered.includes(c)))return i;
 }
 return KATA_ROWS.length-1;
}
export function kataDue(state,now=Date.now()){
 return state.mastered.filter(c=>(state.review[c]?.nextAt??Infinity)<=now);
}
export function traceKata(state,glyph){
 if(VALID.has(glyph)&&!state.traced.includes(glyph))state.traced.push(glyph);
}
export function correctKata(state,glyph,now=Date.now()){
 if(!VALID.has(glyph))return false;
 const first=!state.mastered.includes(glyph);
 if(first)state.mastered.push(glyph);
 const old=state.review[glyph];
 const level=first||old?.level===0?1:Math.min(5,(old?.level||1)+1);
 state.review[glyph]={level,lastAt:now,nextAt:now+INTERVALS[level-1]};
 return first;
}
export function incorrectKata(state,glyph,now=Date.now()){
 if(!state.mastered.includes(glyph))return;
 state.review[glyph]={level:0,lastAt:now,nextAt:now+3600000};
}
