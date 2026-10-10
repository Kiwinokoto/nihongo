// Optional word postcards. Uses a separate browser key to leave all kana
// progress (and the V1/V2 migration path) completely untouched.
export const WORD_STORAGE_KEY="kotoba-no-tabi.word-postcards.v1";
export const WORDS=Object.freeze([
  {id:"ie",kana:"いえ",romaji:"ie",meaning:"house",symbol:"🏡",description:"A peaceful little house in the village."},
  {id:"ao",kana:"あお",romaji:"ao",meaning:"blue",symbol:"🩵",description:"The colour of a clear mountain sky."},
  {id:"ue",kana:"うえ",romaji:"ue",meaning:"above",symbol:"☁️",description:"Look up at the clouds drifting by."},
  {id:"ai",kana:"あい",romaji:"ai",meaning:"love",symbol:"💛",description:"A little word with a big heart."},
  {id:"iie",kana:"いいえ",romaji:"iie",meaning:"no",symbol:"🍃",description:"A gentle way to say no."},
  {id:"kaki",kana:"かき",romaji:"kaki",meaning:"persimmon",symbol:"🍊",description:"A sweet autumn fruit."},
  {id:"kao",kana:"かお",romaji:"kao",meaning:"face",symbol:"😊",description:"A friendly face at the station."},
  {id:"koko",kana:"ここ",romaji:"koko",meaning:"here",symbol:"📍",description:"Right here, where the path begins."},
  {id:"sushi",kana:"すし",romaji:"sushi",meaning:"sushi",symbol:"🍣",description:"A little bite of Japanese food."},
  {id:"okashi",kana:"おかし",romaji:"okashi",meaning:"sweets",symbol:"🍡",description:"A delicate treat for tea time."},
  {id:"suki",kana:"すき",romaji:"suki",meaning:"like / fond of",symbol:"🌷",description:"Something you enjoy or care for."},
  {id:"tsuki",kana:"つき",romaji:"tsuki",meaning:"moon",symbol:"🌙",description:"The moon above the shrine."},
  {id:"neko",kana:"ねこ",romaji:"neko",meaning:"cat",symbol:"🐈",description:"A cat curled up in the sunlight."},
  {id:"hana",kana:"はな",romaji:"hana",meaning:"flower",symbol:"🌼",description:"A flower in the garden (this reading can have other meanings)."},
  {id:"mochi",kana:"もち",romaji:"mochi",meaning:"mochi rice cake",symbol:"🍡",description:"A soft rice cake, often enjoyed as a sweet."},
  {id:"yama",kana:"やま",romaji:"yama",meaning:"mountain",symbol:"⛰️",description:"A mountain on the horizon."},
  {id:"yuki",kana:"ゆき",romaji:"yuki",meaning:"snow",symbol:"❄️",description:"Snow settling quietly on the mountain."},
  {id:"sakura",kana:"さくら",romaji:"sakura",meaning:"cherry blossoms",symbol:"🌸",description:"The pink blossoms that greet spring."},
  {id:"matsuri",kana:"まつり",romaji:"matsuri",meaning:"festival",symbol:"🏮",description:"Lanterns and laughter at a local festival."}
].map(item=>Object.freeze(item)));
const IDS=new Set(WORDS.map(w=>w.id));
export function parseWordProgress(raw){
  try{
    const value=JSON.parse(raw||"{}");
    if(!value || typeof value!=="object" || Array.isArray(value))return {collected:[]};
    return {collected:Array.isArray(value.collected)?
      [...new Set(value.collected.filter(id=>typeof id==="string" && IDS.has(id)))]:[]};
  }catch{return {collected:[]};}
}
export function isWordReady(word,masteredKana){
  if(!word||!Array.isArray(masteredKana))return false;
  const glyphs=new Set(masteredKana);
  return [...word.kana].every(g=>glyphs.has(g));
}
export function availableWords(masteredKana){return WORDS.filter(w=>isWordReady(w,masteredKana));}
export function collectWord(state,id,masteredKana){
  const word=WORDS.find(w=>w.id===id);
  if(!word||!isWordReady(word,masteredKana)||state.collected.includes(id))return false;
  state.collected.push(id);return true;
}
