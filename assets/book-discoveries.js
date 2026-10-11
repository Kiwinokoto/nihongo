// Read-only, from the existing validated progress keys; no new profile.
import {discoveredGroups} from "./learning-snapshot.js";
export function renderBookDiscoveries(root,snapshot){
 root.replaceChildren();
 const header=document.createElement("header");header.className="memory-gallery-heading";
 header.innerHTML='<div><span class="memory-eyebrow">MY DISCOVERIES · これまでの学び</span><h3>What I’ve found along the way ✧</h3><p>Collected characters, recognised readings and places explored — all from your real journey.</p></div><span class="memory-petal" aria-hidden="true">✿</span>';
 root.append(header);
 const groups=discoveredGroups(snapshot);
 const count=groups.reduce((n,g)=>n+g.items.length,0);
 const summary=document.createElement("p");summary.className="book-overview";
 summary.textContent=count?count+" discoveries recorded in this browser. Visit them whenever you like.":"Your first discovery is waiting. Explore the map, then come back to see your collection grow.";
 root.append(summary);
 for(const group of groups){
  const section=document.createElement("section");section.className="book-discovery-section";
  const head=document.createElement("div");head.className="book-discovery-head";
  const title=document.createElement("div");
  const h=document.createElement("h4");h.textContent=group.symbol+" "+group.title;
  const p=document.createElement("p");p.textContent=group.subtitle;
  title.append(h,p);
  const n=document.createElement("span");n.className="book-discovery-count";n.textContent=group.items.length+" / "+group.total;
  head.append(title,n);section.append(head);
  if(group.items.length){
   const cards=document.createElement("div");cards.className="book-discovery-grid";
   for(const item of group.items){
    const cell=document.createElement("div");cell.className="book-discovery-token";
    const glyph=document.createElement("strong");glyph.lang="ja";glyph.textContent=item.label;
    const meaning=document.createElement("small");meaning.textContent=item.detail;
    cell.append(glyph,meaning);cards.append(cell);
   }
   section.append(cards);
  }else{
   const message=document.createElement("p");message.className="book-discovery-empty";
   message.textContent="Nothing collected here yet. Your next little discovery awaits.";
   section.append(message);
  }
  root.append(section);
 }
 const note=document.createElement("p");note.className="book-discovery-note";
 note.textContent="Practising does not always mean collecting. The word walk and kanji shrine can be revisited, but they do not store mastery scores. Your saved discoveries live only in this browser.";
 root.append(note);
}
