// Advanced kana reading patterns, intentionally separate from the 46+46 base kana.
// "Small" characters are combining marks, not new independent basic syllables.
// Classical/rare spellings and loanword pronunciation are explained, not invented audio.
export const ADVANCED_STORAGE_KEY="kotoba-no-tabi.advanced-kana.v1";
const VOICED=[
 ["がぎぐげご","ga gi gu ge go"],["ざじずぜぞ","za ji zu ze zo"],
 ["だぢづでど","da ji zu de do"],["ばびぶべぼ","ba bi bu be bo"],
 ["ぱぴぷぺぽ","pa pi pu pe po"]
];
const BLENDS=[
 ["き","ky"],["し","sh"],["ち","ch"],["に","ny"],["ひ","hy"],["み","my"],["り","ry"],
 ["ぎ","gy"],["じ","j"],["び","by"],["ぴ","py"]
];
const SMALL=[["ぁ","small a"],["ぃ","small i"],["ぅ","small u"],["ぇ","small e"],["ぉ","small o"],["ゃ","small ya"],["ゅ","small yu"],["ょ","small yo"],["っ","small tsu"]];
const BORROWED=[
 ["ウィ","wi"],["ウェ","we"],["ウォ","wo"],
 ["ファ","fa"],["フィ","fi"],["フェ","fe"],["フォ","fo"],
 ["ティ","ti"],["ディ","di"],["トゥ","tu"],["ドゥ","du"],
 ["シェ","she"],["ジェ","je"],["チェ","che"],
 ["ツァ","tsa"],["ツィ","tsi"],["ツェ","tse"],["ツォ","tso"],
 ["ヴァ","va"],["ヴィ","vi"],["ヴ","vu"],["ヴェ","ve"],["ヴォ","vo"]
];
const H_RHYTHM=[
 ["がっこう","gakkō","The small っ doubles the next consonant in gakkō (school)."],
 ["きょう","kyō","きょ is one contracted sound; う lengthens its vowel in 'today'."],
 ["おかあさん","okaasan","The extra あ lengthens the 'a' sound in 'mother'."]
];
const K_RHYTHM=[
 ["コーヒー","kōhī","ー lengthens the preceding vowel: coffee."],
 ["サッカー","sakkā","Small ッ doubles the next consonant; ー lengthens the vowel: soccer."],
 ["パーティー","pātī","A long vowel mark and small ィ appear in party."],
 ["コンピューター","konpyūtā","A contracted ピュ plus two long vowels: computer."]
];
const KATA_FROM_HIRA=Object.fromEntries([..."ぁぃぅぇぉゃゅょっ"].map((x,i)=>[x,[..."ァィゥェォャュョッ"][i]]));
function toKata(text){
 return [...text].map(c=>KATA_FROM_HIRA[c]||(c.codePointAt(0)>=0x3041&&c.codePointAt(0)<=0x3096?String.fromCodePoint(c.codePointAt(0)+96):c)).join("");
}
const item=(glyph,read,category,script,note="",example="")=>
 Object.freeze({id:script+"-"+category+"-"+glyph,glyph,read,category,script,note,example});
function items(script){
 const kata=script==="katakana",conv=s=>kata?toKata(s):s;
 const result=[];
 for(const [letters,readings]of VOICED){
  [...letters].forEach((g,i)=>{
   const read=readings.split(" ")[i];
   const rare=g==="ぢ"||g==="づ";
   const info=rare?"A less common spelling; its pronunciation generally overlaps with じ/ず. Learn the written form, not a made-up sound difference.":
    g.startsWith("ぱ")||"ぱぴぷぺぽ".includes(g)?"The little circle ゜ gives the p-sound.":"Two tiny strokes ゛ voice the consonant.";
   result.push(item(conv(g),read,"voiced",script,info));
  });
 }
 for(const [base,prefix]of BLENDS){
  ["ゃ","ゅ","ょ"].forEach((small,i)=>{
   const vowel=["a","u","o"][i];
   const r=prefix==="sh"?"sh"+vowel:prefix==="ch"?"ch"+vowel:prefix==="j"?"j"+vowel:prefix+vowel;
   result.push(item(conv(base+small),r,"blends",script,
     "A full-sized consonant kana joins a small ゃ/ゅ/ょ. Read them as one contracted syllable, not two."));
  });
 }
 for(const [g,label]of SMALL){
  result.push(item(conv(g),label,"small",script,
   g==="っ"?"Small っ/ッ marks a pause that doubles the next consonant; it has no standalone syllable here.":
   "A small kana changes the neighbouring sound. It is not usually pronounced as its own full syllable."));
 }
 if(kata){
  for(const [g,read]of BORROWED){
   result.push(item(g,read,"borrowed",script,
    "A common modern katakana loanword spelling. Actual pronunciation varies by speaker and word."));
  }
 }
 const samples=kata?K_RHYTHM:H_RHYTHM;
 for(const [glyph,read,note]of samples)result.push(item(glyph,read,"rhythm",script,note));
 return Object.freeze(result);
}
export const ADVANCED=Object.freeze({hiragana:items("hiragana"),katakana:items("katakana")});
export const CATEGORIES=Object.freeze([
 Object.freeze({id:"voiced",title:"Voiced sounds",subtitle:"Dakuten ゛ and handakuten ゜ turn familiar kana into new sounds.",example:"か → が · は → ぱ"}),
 Object.freeze({id:"blends",title:"Little combinations",subtitle:"Small ゃ/ゅ/ょ combine with a consonant kana: the pair forms one sound.",example:"きゃ = kya · しゅ = shu"}),
 Object.freeze({id:"small",title:"Tiny helpers",subtitle:"Small kana change nearby sounds; they aren't each a separate spoken syllable.",example:"がっこう · きゃ"}),
 Object.freeze({id:"borrowed",title:"Sounds from afar",subtitle:"Katakana combines kana to represent words borrowed from other languages.",example:"ファ = fa · ティ = ti",script:"katakana"}),
 Object.freeze({id:"rhythm",title:"Long sounds & little pauses",subtitle:"Read whole words: long vowels, contracted sounds and doubled consonants.",example:"がっこう / サッカー"})
]);
export const REWARD_THRESHOLD=8;
export function parseAdvanced(raw){
 let data;
 try{data=JSON.parse(raw||"{}")}catch{return {hiragana:[],katakana:[]}}
 if(!data||Array.isArray(data)||typeof data!=="object")return {hiragana:[],katakana:[]};
 const clean=script=>{
  const allowed=new Set(ADVANCED[script].map(x=>x.id));
  return Array.isArray(data[script])?[...new Set(data[script].filter(v=>typeof v==="string"&&allowed.has(v)))]:[];
 };
 return {hiragana:clean("hiragana"),katakana:clean("katakana")};
}
export function rememberAdvanced(state,entry){
 if(!entry||!ADVANCED[entry.script]?.some(x=>x.id===entry.id))return false;
 if(state[entry.script].includes(entry.id))return false;
 state[entry.script].push(entry.id);
 return true;
}
export function advancedCount(state){return state.hiragana.length+state.katakana.length}
export function rewardUnlocked(state){return advancedCount(state)>=REWARD_THRESHOLD}
export function answersFor(entry,group){
 // Distinct answer labels: ぢ/じ and づ/ず legitimately share spoken values.
 const choices=[entry.read],other=new Set();
 for(const item of group){
  if(item.id!==entry.id && item.read!==entry.read)other.add(item.read);
 }
 for(const choice of other){
  if(choices.length===4)break;
  choices.push(choice);
 }
 return choices;
}
