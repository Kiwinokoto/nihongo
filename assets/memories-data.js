// An optional illustrated journal. Data and unlocks depend on the EXISTING
// locally earned milestones; no story views or preference state is persisted.
export const MEMORIES=Object.freeze([
 Object.freeze({
  id:"first-step",milestone:"first-step",number:"I",title:"The First Steps",
  introduction:"A new place, new words, and a wider world.",
  source:"/assets/memories/first-steps.webp",
  alt:"Two adult travellers walk side by side along a blossom-lined stone path above a Japanese lakeside village and Mount Fuji.",
  copy:"Their journey begins on a quiet road. They have barely spoken, yet somehow they keep choosing the same path.",
  locked:"Complete your first learning activity to reveal this memory."
 }),
 Object.freeze({
  id:"closer",milestone:"advanced",number:"II",title:"A Closer View",
  introduction:"Some journeys bring people closer.",
  source:"/assets/memories/closer-view.webp",
  alt:"In a springtime Japanese village, the dark-haired traveller smiles at his fair-haired companion, who rests a hand on his shoulder.",
  copy:"Under the cherry blossoms, one smile answers another. The two little charms on their bags catch the same sunlight.",
  locked:"Recognise eight different advanced kana readings to reveal this memory."
 }),
 Object.freeze({
  id:"next-stop",milestone:"katakana",number:"III",title:"The Next Stop",
  introduction:"Some promises are made without words.",
  source:"/assets/memories/next-stop.webp",
  alt:"A nostalgic mountain railway station with a cream-and-orange train, vintage luggage and a blue travelling bag carrying a blossom charm.",
  copy:"The train is waiting. Someone has left a familiar bag by the bench — but whose footsteps will arrive first?",
  locked:"Collect all 46 basic katakana to reveal this memory."
 })
]);
export function memoryAccess(milestones){
 const unlocked=new Set((milestones||[]).filter(x=>x.unlocked===true).map(x=>x.id));
 return MEMORIES.map(x=>({...x,unlocked:unlocked.has(x.milestone)}));
}
