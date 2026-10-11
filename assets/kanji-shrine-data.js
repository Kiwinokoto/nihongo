// A small word-first kanji walk, independent of beginner kana and achievements.
export const SHRINE_KANJI=Object.freeze([
 {id:"mori",kanji:"森",word:"森の中",reading:"もりのなか",romaji:"mori no naka",meaning:"Inside the forest",sentence:"森の中は静かです。",sentenceReading:"もりのなかはしずかです。",sentenceMeaning:"It is quiet in the forest.",context:"Between the ancient cedar trees"},
 {id:"eki",kanji:"駅",word:"駅前",reading:"えきまえ",romaji:"ekimae",meaning:"In front of the station",sentence:"駅前で会いましょう。",sentenceReading:"えきまえであいましょう。",sentenceMeaning:"Let's meet in front of the station.",context:"Where two travellers meet"},
 {id:"michi",kanji:"道",word:"山道",reading:"やまみち",romaji:"yamamichi",meaning:"Mountain path",sentence:"この山道を歩きます。",sentenceReading:"このやまみちをあるきます。",sentenceMeaning:"We walk along this mountain path.",context:"Stone steps under the torii gates"},
 {id:"mise",kanji:"店",word:"お店",reading:"おみせ",romaji:"omise",meaning:"Shop",sentence:"お店はもう開いています。",sentenceReading:"おみせはもうあいています。",sentenceMeaning:"The shop is already open.",context:"A tiny shop on the way"},
 {id:"shoku",kanji:"食",word:"食堂",reading:"しょくどう",romaji:"shokudō",meaning:"Dining hall",sentence:"食堂で昼ご飯を食べます。",sentenceReading:"しょくどうでひるごはんをたべます。",sentenceMeaning:"We eat lunch in the dining hall.",context:"The warm light of a little dining hall"},
 {id:"tabi",kanji:"旅",word:"旅行",reading:"りょこう",romaji:"ryokō",meaning:"Trip",sentence:"旅行の準備をします。",sentenceReading:"りょこうのじゅんびをします。",sentenceMeaning:"I'm preparing for a trip.",context:"A journey beyond the mountains"},
 {id:"ame",kanji:"雨",word:"雨の日",reading:"あめのひ",romaji:"ame no hi",meaning:"Rainy day",sentence:"雨の日は家で本を読みます。",sentenceReading:"あめのひはいえでほんをよみます。",sentenceMeaning:"On rainy days, I read at home.",context:"When the forest smells of rain"},
 {id:"umi",kanji:"海",word:"海辺",reading:"うみべ",romaji:"umibe",meaning:"Seaside",sentence:"海辺で写真を撮りました。",sentenceReading:"うみべでしゃしんをとりました。",sentenceMeaning:"I took a photo by the sea.",context:"Beyond the last mountain"}
].map(x=>Object.freeze(x)));
export function shrineChoices(entry,items=SHRINE_KANJI,random=Math.random){
 if(!items.some(x=>x.id===entry.id)||items.length<4)throw new Error("Expected four different shrine words");
 const shuffled=values=>{
  const a=[...values];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
 };
 return shuffled([entry,...shuffled(items.filter(x=>x.id!==entry.id)).slice(0,3)]);
}
