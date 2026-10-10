// Six everyday savoury Japanese dishes, no learner profile or server storage.
// This is an accessible optional micro-game, NOT a full course or restaurant guide.
export const FOOD_KEY="kotoba-no-tabi.food-lane.v1";
export const DISHES=Object.freeze([
 {id:"yakizakana",jp:"焼き魚",kana:"やきざかな",romaji:"yakizakana",name:"Grilled fish",symbol:"🐟",kind:"From the grill",detail:"A simple Japanese favourite: fish grilled until the skin is fragrant and crisp.",note:"Yaki means grilled. Sakana means fish."},
 {id:"yakitori",jp:"焼き鳥",kana:"やきとり",romaji:"yakitori",name:"Chicken skewers",symbol:"🍢",kind:"From the grill",detail:"Bite-sized grilled chicken on skewers, often seasoned with salt or a savoury-sweet tare glaze.",note:"Tori means bird; here it means chicken."},
 {id:"takoyaki",jp:"たこ焼き",kana:"たこやき",romaji:"takoyaki",name:"Octopus balls",symbol:"🐙",kind:"Street-food favourite",detail:"Soft round batter bites with pieces of octopus inside; a famous Osaka street snack.",note:"Tako means octopus."},
 {id:"natto",jp:"納豆",kana:"なっとう",romaji:"nattō",name:"Fermented soybeans",symbol:"🫘",kind:"Home-style textures",detail:"Fermented soybeans with a distinctive aroma and wonderfully sticky, stretchy strands.",note:"Often eaten with rice as part of a Japanese breakfast."},
 {id:"okonomiyaki",jp:"お好み焼き",kana:"おこのみやき",romaji:"okonomiyaki",name:"Savoury cabbage pancake",symbol:"🥬",kind:"Street-food favourite",detail:"A hearty griddled dish with cabbage and other ingredients, topped with savoury sauce.",note:"Okonomi means 'as you like it'."},
 {id:"unagi",jp:"うなぎ",kana:"うなぎ",romaji:"unagi",name:"Grilled eel",symbol:"🍚",kind:"From the grill",detail:"Tender eel, often grilled with a glossy tare glaze and served over rice.",note:"Unagi means freshwater eel."}
].map(Object.freeze));
const IDS=new Set(DISHES.map(d=>d.id));
export function parseFoodProgress(raw){
 try{
  const data=JSON.parse(raw||"{}");
  if(!data||typeof data!=="object"||Array.isArray(data))return {ordered:[]};
  return {ordered:Array.isArray(data.ordered)?[...new Set(data.ordered.filter(v=>typeof v==="string"&&IDS.has(v)))]:[]};
 }catch{return {ordered:[]};}
}
export function markDishOrdered(state,id){
 if(!IDS.has(id)||state.ordered.includes(id))return false;
 state.ordered.push(id);return true;
}
export function orderLine(dish){
 if(!dish||!IDS.has(dish.id))return "";
 return `${dish.jp}をください。`;
}
