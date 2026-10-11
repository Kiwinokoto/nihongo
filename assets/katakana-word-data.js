// Short, optional real-word reading in Katakana Station. No save keys or mastery.
export const KATAKANA_WORDS=Object.freeze([
  {id:"bus",kana:"バス",reading:"basu",meaning:"Bus",place:"Outside the station",note:"The first ride through town."},
  {id:"hotel",kana:"ホテル",reading:"hoteru",meaning:"Hotel",place:"Along a quiet street",note:"A place to put down your bags."},
  {id:"menu",kana:"メニュー",reading:"menyū",meaning:"Menu",place:"At a little restaurant",note:"Look at what is being served today."},
  {id:"ramen",kana:"ラーメン",reading:"rāmen",meaning:"Ramen noodles",place:"Under a warm shop lantern",note:"A bowl of savoury noodles."},
  {id:"konbini",kana:"コンビニ",reading:"konbini",meaning:"Convenience store",place:"Near the corner",note:"An everyday place for snacks and essentials."},
  {id:"camera",kana:"カメラ",reading:"kamera",meaning:"Camera",place:"On a lovely forest path",note:"Take a picture to remember the view."},
  {id:"taxi",kana:"タクシー",reading:"takushī",meaning:"Taxi",place:"Beside the road",note:"Another way to cross the city."},
  {id:"ticket",kana:"チケット",reading:"chiketto",meaning:"Ticket",place:"At the station counter",note:"Keep it ready for the journey."}
].map(item=>Object.freeze(item)));

export function shuffledWords(items,random=Math.random){
 const arr=[...items];
 for(let i=arr.length-1;i>0;i--){
  const j=Math.floor(random()*(i+1));
  [arr[i],arr[j]]=[arr[j],arr[i]];
 }
 return arr;
}
export function choicesForWord(word,words=KATAKANA_WORDS,random=Math.random){
 const index=words.findIndex(item=>item.id===word.id);
 if(index<0||words.length<4)throw new Error("Word quiz needs four known words");
 const other=words.filter(item=>item.id!==word.id);
 return shuffledWords([word,...shuffledWords(other,random).slice(0,3)],random);
}
