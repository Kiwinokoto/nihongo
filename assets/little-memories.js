import {memoryAccess} from "./memories-data.js";
import {renderBookDiscoveries} from "./book-discoveries.js";

// Rendered in its own modal rather than rewriting any page/map/lesson layout.
// All text and image URLs are fixed editorial constants, never saved user HTML.
export function renderLittleMemories(root,milestones,onReturn,snapshot,initialPage="memories"){
 const entries=memoryAccess(milestones);
 const total=entries.filter(x=>x.unlocked).length;
 let current=null;
 root.innerHTML=`<div class="memory-shell">
  <aside class="memory-sidebar">
    <div class="memory-sidebar-top"><span class="memory-flower" aria-hidden="true">✿</span>
      <span class="memory-eyebrow">旅のジャーナル</span></div>
    <h2 id="memories-title">My magic book</h2>
    <p class="memory-sidebar-subtitle">All your little discoveries and the stories they unlock.</p>
    <nav class="memory-book-navigation" aria-label="Pages of your travel book">
      <button type="button" data-book-page="discoveries" aria-pressed="false">✧ My Discoveries</button>
      <button type="button" data-book-page="memories" aria-pressed="true">✿ Little Memories</button>
    </nav>
    <p>Every new sound can lead to another discovery. Some stories take a little longer to unfold.</p>
    <div class="memory-sidebar-progress"><span aria-hidden="true">🌸</span>
      <span><strong>${total} / ${entries.length}</strong><small>illustrated memories discovered</small></span></div>
    <p class="memory-small-quote">Every word is a step closer to a new horizon.</p>
    <button class="soft-button" id="memory-return-journal" type="button">← Back to the map</button>
  </aside>
  <div class="memory-content">
    <div id="memory-scenes-pane">
    <header class="memory-gallery-heading"><div><span class="memory-eyebrow">STORY SCENES · 小さな思い出</span>
      <h3>Scenes along the way <span aria-hidden="true">✧</span></h3>
      <p>Explore the moments you have earned. The next chapter will wait for you.</p>
    </div><span class="memory-petal" aria-hidden="true">✿</span></header>
    <div id="memory-gallery" class="memory-gallery"></div>
    </div>
    <div id="memory-learning-pane" hidden></div>
  </div></div>`;
 const gallery=root.querySelector("#memory-gallery");
 const back=root.querySelector("#memory-return-journal");
 const scenes=root.querySelector("#memory-scenes-pane");
 const learning=root.querySelector("#memory-learning-pane");
 const pageButtons=root.querySelectorAll("[data-book-page]");
 renderBookDiscoveries(learning,snapshot);
 let page=initialPage==="discoveries"?"discoveries":"memories";
 const switchPage=next=>{
  page=next;current=null;
  scenes.hidden=next!=="memories";learning.hidden=next!=="discoveries";
  pageButtons.forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.bookPage===next)));
  back.textContent="← Back to the map";
  if(next==="memories")showGallery();
  const dialog=root.closest("dialog");if(dialog)dialog.scrollTop=0;
 };
 pageButtons.forEach(button=>button.addEventListener("click",()=>switchPage(button.dataset.bookPage)));
 back.addEventListener("click",()=>{
  if(current){current=null;showGallery();return;}
  onReturn();
 });
 function appendMemoryArt(container,memory,detail=false){
  // Locked cards never call this function: no preview or fetch before unlock.
  if(memory.panels){
   const joined=document.createElement("div");
   joined.className=detail?"memory-diptych-detail":"memory-diptych-preview";
   for(const panel of memory.panels){
    const img=document.createElement("img");
    img.src=panel.source;img.alt=panel.alt;
    img.loading="eager";img.decoding="async";
    joined.append(img);
   }
   container.append(joined);
  }else{
   const img=document.createElement("img");
   img.src=memory.source;img.alt=memory.alt;img.loading="eager";img.decoding="async";
   container.append(img);
  }
 }
 function showGallery(){
  back.textContent="← Back to the map";
  gallery.replaceChildren();
  for(const memory of entries){
   const card=document.createElement(memory.unlocked?"button":"div");
   card.className="memory-card"+(memory.unlocked?" unlocked":" locked");
   card.dataset.memoryId=memory.id;
   if(memory.unlocked){
    card.type="button";
    appendMemoryArt(card,memory);
    card.setAttribute("aria-label","Read "+memory.title);
    card.addEventListener("click",()=>showDetail(memory));
   }else{
    // Avoid loading or presenting a still-locked reward image.
    card.setAttribute("aria-label",memory.locked);
    card.classList.add("memory-hidden-art");
   }
   const status=document.createElement("span");
   status.className="memory-status";
   status.textContent=memory.unlocked?"✿ Unlocked":"♧ Locked";
   const panel=document.createElement("span");panel.className="memory-card-caption";
   const overline=document.createElement("small");overline.textContent="MEMORY "+memory.number;
   const name=document.createElement("strong");name.textContent=memory.title;
   const subtitle=document.createElement("span");
   subtitle.textContent=memory.unlocked?memory.introduction:memory.locked;
   panel.append(overline,name,subtitle);
   card.append(status,panel);
   gallery.append(card);
  }
 }
 function showDetail(memory){
  if(!memory.unlocked)return;
  current=memory.id;
  back.textContent="← All memories";
  gallery.replaceChildren();
  const article=document.createElement("article");
  article.className="memory-detail";
  appendMemoryArt(article,memory,true);
  const info=document.createElement("div");info.className="memory-detail-copy";
  const kicker=document.createElement("span");
  kicker.className="memory-eyebrow";kicker.textContent="MEMORY "+memory.number+" · UNLOCKED";
  const h=document.createElement("h3");h.textContent=memory.title;
  const intro=document.createElement("p");intro.className="memory-detail-intro";intro.textContent=memory.introduction;
  const story=document.createElement("p");story.textContent=memory.copy;
  const hint=document.createElement("small");hint.textContent="A small story, just for the journey. ✿";
  info.append(kicker,h,intro,story,hint);
  article.append(info);
  gallery.append(article);
  const dialog=root.closest("dialog");if(dialog)dialog.scrollTop=0;
  back.focus();
 }
 showGallery();
 switchPage(page);
}
