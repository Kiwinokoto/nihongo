// Read-only view of real, validated existing achievements. Never creates a key.
import {STORAGE_KEY,parseProgress,KANA} from "./progression.js";
import {KATA_STORAGE_KEY,readKata,KATA} from "./katakana-progress.js";
import {ADVANCED_STORAGE_KEY,parseAdvanced,ADVANCED} from "./advanced-kana-data.js";
import {WORD_STORAGE_KEY,parseWordProgress,WORDS} from "./word-trails.js";
import {FOOD_KEY,parseFoodProgress,DISHES} from "./food-lane-data.js";

export function learningSnapshot(read){
 const safe=key=>{try{return read(key)}catch{return null}};
 return {
  hiragana:parseProgress(safe(STORAGE_KEY)),
  katakana:readKata(safe(KATA_STORAGE_KEY)),
  advanced:parseAdvanced(safe(ADVANCED_STORAGE_KEY)),
  words:parseWordProgress(safe(WORD_STORAGE_KEY)),
  food:parseFoodProgress(safe(FOOD_KEY))
 };
}
export function discoveredGroups(state){
 return [
  {id:"hiragana",title:"Hiragana garden",subtitle:"Characters collected through recognition",symbol:"🌸",total:46,
    items:KANA.filter(k=>state.hiragana.mastered.includes(k.glyph)).map(k=>({label:k.glyph,detail:k.romaji}))},
  {id:"katakana",title:"Katakana station",subtitle:"A second alphabet, collected through recognition",symbol:"🚃",total:46,
    items:KATA.filter(k=>state.katakana.mastered.includes(k.glyph)).map(k=>({label:k.glyph,detail:k.romaji}))},
  {id:"advanced",title:"Beyond the basics",subtitle:"Recognised readings, including combined sounds",symbol:"✧",total:ADVANCED.hiragana.length+ADVANCED.katakana.length,
    items:["hiragana","katakana"].flatMap(script=>ADVANCED[script].filter(k=>state.advanced[script].includes(k.id)).map(k=>({label:k.glyph,detail:k.read})))},
  {id:"words",title:"Word postcards",subtitle:"Words you actually collected",symbol:"💌",total:WORDS.length,
    items:WORDS.filter(w=>state.words.collected.includes(w.id)).map(w=>({label:w.kana,detail:w.meaning}))},
  {id:"food",title:"The little food lane",subtitle:"Dishes you ordered",symbol:"🍢",total:DISHES.length,
    items:DISHES.filter(w=>state.food.ordered.includes(w.id)).map(w=>({label:w.jp,detail:w.name}))}
 ];
}
// Each village question has a *previously collected target*. Distractors are
// normal written alternatives, never claimed to be previously learned.
export function villageQuestionPool(state){
 return [
  ...KANA.filter(k=>state.hiragana.mastered.includes(k.glyph)).map(k=>({
    id:"h-"+k.glyph,kind:"Hiragana",prompt:"How do you read this hiragana?",glyph:k.glyph,answer:k.romaji,
    alternatives:KANA.map(x=>x.romaji)})),
  ...KATA.filter(k=>state.katakana.mastered.includes(k.glyph)).map(k=>({
    id:"k-"+k.glyph,kind:"Katakana",prompt:"How do you read this katakana?",glyph:k.glyph,answer:k.romaji,
    alternatives:KATA.map(x=>x.romaji)})),
  ...["hiragana","katakana"].flatMap(script=>ADVANCED[script]
    .filter(k=>state.advanced[script].includes(k.id)).map(k=>({
      id:"a-"+k.id,kind:"Advanced reading",prompt:"How would you read this combination?",
      glyph:k.glyph,answer:k.read,alternatives:ADVANCED[script].map(x=>x.read)}))),
  ...WORDS.filter(w=>state.words.collected.includes(w.id)).map(w=>({
    id:"w-"+w.id,kind:"Word postcard",prompt:"What does this word mean?",
    glyph:w.kana,answer:w.meaning,alternatives:WORDS.map(x=>x.meaning)})),
  ...DISHES.filter(w=>state.food.ordered.includes(w.id)).map(w=>({
    id:"f-"+w.id,kind:"A taste of Japan",prompt:"Which dish is this?",
    glyph:w.jp,answer:w.name,alternatives:DISHES.map(x=>x.name)}))
 ];
}
const shuffle=(items,random)=>{
 const a=[...items];
 for(let i=a.length-1;i>0;i--){const j=Math.min(i,Math.floor(random()*(i+1)));[a[i],a[j]]=[a[j],a[i]];}
 return a;
};
export function villageReview(state,random=Math.random,limit=5){
 const pool=villageQuestionPool(state);
 const byKind=[...new Set(pool.map(q=>q.kind))];
 const first=shuffle(byKind,random).map(kind=>shuffle(pool.filter(q=>q.kind===kind),random)[0]);
 const seen=new Set(first.map(q=>q.id));
 const selected=first.slice(0,limit);
 for(const q of shuffle(pool.filter(q=>!seen.has(q.id)),random)){
  if(selected.length>=limit)break;
  selected.push(q);
 }
 return selected.map(q=>{
  const other=[...new Set(q.alternatives.filter(x=>x!==q.answer))];
  return {id:q.id,kind:q.kind,prompt:q.prompt,glyph:q.glyph,answer:q.answer,
    choices:shuffle([q.answer,...shuffle(other,random).slice(0,3)],random)};
 });
}
