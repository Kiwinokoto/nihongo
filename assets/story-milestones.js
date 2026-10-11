// Story milestones are derived from existing local achievements. Never store
// individual story views or change learning/mastery progress for narrative rewards.
export const MILESTONES=Object.freeze([
  Object.freeze({id:"first-step",title:"First little discovery",target:"Complete any one recognition or ordering activity",scene:"first-step"}),
  Object.freeze({id:"hiragana",title:"The hiragana garden",target:"Collect all 46 basic hiragana",scene:null}),
  Object.freeze({id:"katakana",title:"The katakana station",target:"Collect all 46 basic katakana",scene:null}),
  Object.freeze({id:"advanced",title:"A closer chapter",target:"Collect 8 different advanced readings",scene:"closer"}),
  Object.freeze({id:"kanji",title:"Beyond the shrine",target:"A future kanji journey — not available yet",scene:null})
]);
export const SCENES=Object.freeze([
  Object.freeze({id:"welcome",title:"The first horizon",subtitle:"Every journey begins somewhere.",src:"/assets/art/village-path.svg",alt:"A peaceful village in Japan, with two travellers on the path"}),
  Object.freeze({id:"first-step",title:"A new path appears",subtitle:"Two travellers wait at the station. Their story is only beginning.",src:"/assets/art/katakana-platform.svg",alt:"A warm mountain railway station with a train and two travellers"}),
  Object.freeze({id:"closer",title:"Not so far apart",subtitle:"A quiet promise, and two matching charms.",src:"/assets/art/travellers-closeup.svg",alt:"Two adult male travellers at the station, closer together, wearing matching blossom charms"})
]);
const positive=(x)=>Number.isFinite(x)&&x>0?Math.floor(x):0;
export function milestoneStatus(counts){
 const hiragana=positive(counts?.hiragana);
 const katakana=positive(counts?.katakana);
 const advanced=positive(counts?.advanced);
 const words=positive(counts?.words);
 const food=positive(counts?.food);
 const first=hiragana+katakana+advanced+words+food>0;
 const achieved={
  "first-step":first,
  "hiragana":hiragana>=46,
  "katakana":katakana>=46,
  "advanced":advanced>=8,
  "kanji":false
 };
 const progress={
  "first-step":{done:first?1:0,target:1},
  "hiragana":{done:Math.min(hiragana,46),target:46},
  "katakana":{done:Math.min(katakana,46),target:46},
  "advanced":{done:Math.min(advanced,8),target:8},
  "kanji":null
 };
 return MILESTONES.map(m=>({...m,unlocked:achieved[m.id],progress:progress[m.id]}));
}
export function unlockedScenes(status){
 const unlocked=new Set(status.filter(m=>m.unlocked).map(m=>m.scene));
 return SCENES.filter(s=>s.id==="welcome"||unlocked.has(s.id));
}
