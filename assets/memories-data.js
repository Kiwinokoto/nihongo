// Five story *moments*, drawn from four standalone original illustrations.
// The last moment deliberately joins two earlier views into the complete diptych.
// All unlocks use existing achievements; no story-view or preference storage.
export const MEMORIES=Object.freeze([
 Object.freeze({
  id:"first-step",milestone:"first-step",number:"I",title:"The First Steps",
  introduction:"A new place, new words, and a wider world.",
  source:"/assets/memories/first-steps.webp",
  alt:"Two adult travellers walk together along a blossom-lined stone path above a Japanese lakeside village and Mount Fuji.",
  copy:"Their journey begins on a quiet road. They have barely spoken, yet somehow they keep choosing the same path.",
  locked:"Complete your first learning activity to reveal this memory."
 }),
 Object.freeze({
  id:"blossom-bridge",milestone:"hiragana",number:"II",title:"The Bridge in Bloom",
  introduction:"Some paths open with just a little patience.",
  source:"/assets/memories/blossom-bridge.webp",
  alt:"Blossoming trees frame a wooden bridge across a small river in a warmly lit traditional Japanese village.",
  copy:"Farther along the path, a wooden bridge crosses a stream. Cherry blossoms drift onto the water; the village seems to be waiting for something.",
  locked:"Collect all 46 basic hiragana to cross the blossom bridge."
 }),
 Object.freeze({
  id:"next-stop",milestone:"katakana",number:"III",title:"The Next Stop",
  introduction:"Some promises are made without words.",
  source:"/assets/memories/next-stop.webp",
  alt:"A nostalgic mountain railway station with a cream-and-orange train, vintage luggage and a blue travelling bag carrying a blossom charm.",
  copy:"The train is waiting. Someone has left a familiar bag by the bench — but whose footsteps will arrive first?",
  locked:"Collect all 46 basic katakana to reveal this memory."
 }),
 Object.freeze({
  id:"closer",milestone:"advanced",number:"IV",title:"A Closer View",
  introduction:"Some journeys bring people closer.",
  source:"/assets/memories/closer-view.webp",
  alt:"In a springtime Japanese village, the dark-haired traveller smiles at his fair-haired companion, who rests a hand on his shoulder.",
  copy:"Under the cherry blossoms, one smile answers another. The two little charms on their bags catch the same sunlight.",
  locked:"Recognise eight different advanced kana readings to reveal this memory."
 }),
 Object.freeze({
  id:"two-paths",requirements:Object.freeze(["hiragana","katakana"]),number:"V",title:"Two Paths, One Journey",
  introduction:"The picture is finally whole.",
  panels:Object.freeze([
   Object.freeze({source:"/assets/memories/blossom-bridge.webp",alt:"The blossom-lined village and bridge, the first half of a continuous illustrated journey."}),
   Object.freeze({source:"/assets/memories/next-stop.webp",alt:"The railway station, the second half of the same illustrated journey."})
  ]),
  copy:"The village and the station were never two separate destinations. Together they tell one story: a road crossed, a train waiting, and the promise of another journey.",
  locked:"Collect all 46 basic hiragana AND all 46 basic katakana to complete the picture."
 })
]);
export function memoryAccess(milestones){
 const unlocked=new Set((milestones||[]).filter(x=>x.unlocked===true).map(x=>x.id));
 return MEMORIES.map(x=>({...x,unlocked:(x.requirements??[x.milestone]).every(id=>unlocked.has(id))}));
}
