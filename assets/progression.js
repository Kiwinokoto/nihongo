// Pure learning state helpers. V1 localStorage data migrates without losing collected kana.
export const STORAGE_KEY = "kotoba-no-tabi.progress.v1";
export const DAY = 24 * 60 * 60 * 1000;
export const ROWS = Object.freeze([
  {id:"vowels",title:"The first vowels",subtitle:"a · i · u · e · o",kana:"あいうえお"},
  {id:"k",title:"The K sounds",subtitle:"ka · ki · ku · ke · ko",kana:"かきくけこ"},
  {id:"s",title:"The S sounds",subtitle:"sa · shi · su · se · so",kana:"さしすせそ"},
  {id:"t",title:"The T sounds",subtitle:"ta · chi · tsu · te · to",kana:"たちつてと"},
  {id:"n",title:"The N sounds",subtitle:"na · ni · nu · ne · no",kana:"なにぬねの"},
  {id:"h",title:"The H sounds",subtitle:"ha · hi · fu · he · ho",kana:"はひふへほ"},
  {id:"m",title:"The M sounds",subtitle:"ma · mi · mu · me · mo",kana:"まみむめも"},
  {id:"y",title:"The Y sounds",subtitle:"ya · yu · yo",kana:"やゆよ"},
  {id:"r",title:"The R sounds",subtitle:"ra · ri · ru · re · ro",kana:"らりるれろ"},
  {id:"w",title:"The last little sounds",subtitle:"wa · wo · n",kana:"わをん"}
]);
const ROMAJI = "a i u e o|ka ki ku ke ko|sa shi su se so|ta chi tsu te to|na ni nu ne no|ha hi fu he ho|ma mi mu me mo|ya yu yo|ra ri ru re ro|wa wo n".split("|");
export const KANA = Object.freeze(ROWS.flatMap((row,i)=>
  [...row.kana].map((glyph,j)=>Object.freeze({glyph,romaji:ROMAJI[i].split(" ")[j],row:i}))
));
export const ALL_KANA = Object.freeze(KANA.map(k=>k.glyph));
const KNOWN = new Set(ALL_KANA);
export const NEW_PROGRESS = () => ({mastered:[],traced:[],review:{}});
function safeList(items){return Array.isArray(items)?[...new Set(items.filter(v=>typeof v==="string" && KNOWN.has(v)))]:[];}
export function normaliseProgress(data,now=Date.now()){
  if (!data || typeof data!=="object" || Array.isArray(data)) return NEW_PROGRESS();
  const mastered=safeList(data.mastered),traced=safeList(data.traced);
  const review={};
  for(const glyph of mastered){
    const r=data.review && typeof data.review==="object" ? data.review[glyph] : null;
    review[glyph]={
      level:Number.isInteger(r?.level)?Math.max(0,Math.min(5,r.level)):1,
      nextAt:Number.isFinite(r?.nextAt) && r.nextAt>0?r.nextAt:now+DAY,
      lastAt:Number.isFinite(r?.lastAt) && r.lastAt>=0?r.lastAt:now
    };
  }
  return {mastered,traced,review};
}
export function parseProgress(raw,now=Date.now()){
  try {return normaliseProgress(JSON.parse(raw || "{}"),now);}
  catch {return NEW_PROGRESS();}
}
export function isRowUnlocked(state,index){
  return index===0 || (index>0 && index<ROWS.length && [...ROWS[index-1].kana].every(c=>state.mastered.includes(c)));
}
export function currentRow(state){
  for(let i=0;i<ROWS.length;i++)if(isRowUnlocked(state,i)&&[...ROWS[i].kana].some(c=>!state.mastered.includes(c)))return i;
  return ROWS.length-1;
}
export function completedInRow(state,index){
  return [...ROWS[index].kana].filter(g=>state.mastered.includes(g)).length;
}
export function dueKana(state,now=Date.now()){
  return state.mastered.filter(g=>(state.review[g]?.nextAt??Infinity)<=now);
}
export function markTraced(state,glyph){
  if(KNOWN.has(glyph)&&!state.traced.includes(glyph))state.traced.push(glyph);
}
const INTERVALS = [DAY,3*DAY,7*DAY,14*DAY,30*DAY];
export function markCorrect(state,glyph,now=Date.now()){
  if(!KNOWN.has(glyph))return false;
  const first=!state.mastered.includes(glyph);
  if(first)state.mastered.push(glyph);
  const old=state.review[glyph];
  const level=first||old?.level===0?1:Math.min(5,(old?.level||1)+1);
  state.review[glyph]={level,lastAt:now,nextAt:now+INTERVALS[level-1]};
  return first;
}
export function markIncorrect(state,glyph,now=Date.now()){
  if(!state.mastered.includes(glyph))return;
  const previous=state.review[glyph];
  state.review[glyph]={level:0,lastAt:now,nextAt:now+60*60*1000};
}
