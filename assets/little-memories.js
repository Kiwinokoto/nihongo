import {memoryAccess} from "./memories-data.js";

// Rendered in its own modal rather than rewriting any page/map/lesson layout.
// All text and image URLs are fixed editorial constants, never saved user HTML.
export function renderLittleMemories(root,milestones,onReturn){
 const entries=memoryAccess(milestones);
 const total=entries.filter(x=>x.unlocked).length;
 let current=null;
 root.innerHTML=`<div class="memory-shell">
  <aside class="memory-sidebar">
    <div class="memory-sidebar-top"><span class="memory-flower" aria-hidden="true">✿</span>
      <span class="memory-eyebrow">旅のジャーナル</span></div>
    <h2 id="memories-title">Little Memories</h2>
    <p class="memory-sidebar-subtitle">A collection of quiet moments from your journey.</p>
    <p>Every new sound can lead to another discovery. Some stories take a little longer to unfold.</p>
    <div class="memory-sidebar-progress"><span aria-hidden="true">🌸</span>
      <span><strong>${total} / ${entries.length}</strong><small>illustrated memories discovered</small></span></div>
    <p class="memory-small-quote">Every word is a step closer to a new horizon.</p>
    <button class="soft-button" id="memory-return-journal" type="button">← Back to my journal</button>
  </aside>
  <div class="memory-content">
    <header class="memory-gallery-heading"><div><span class="memory-eyebrow">STORY SCENES · 小さな思い出</span>
      <h3>Scenes along the way <span aria-hidden="true">✧</span></h3>
      <p>Explore the moments you have earned. The next chapter will wait for you.</p>
    </div><span class="memory-petal" aria-hidden="true">✿</span></header>
    <div id="memory-gallery" class="memory-gallery"></div>
  </div></div>`;
 const gallery=root.querySelector("#memory-gallery");
 const back=root.querySelector("#memory-return-journal");
 back.addEventListener("click",()=>{
  if(current){current=null;showGallery();return;}
  onReturn();
 });
 function showGallery(){
  back.textContent="← Back to my journal";
  gallery.replaceChildren();
  for(const memory of entries){
   const card=document.createElement(memory.unlocked?"button":"div");
   card.className="memory-card"+(memory.unlocked?" unlocked":" locked");
   card.dataset.memoryId=memory.id;
   if(memory.unlocked){
    card.type="button";
    const image=document.createElement("img");
    image.src=memory.source;image.alt=memory.alt;image.loading="eager";image.decoding="async";
    card.append(image);
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
  const img=document.createElement("img");
  img.src=memory.source;img.alt=memory.alt;img.decoding="async";
  const info=document.createElement("div");info.className="memory-detail-copy";
  const kicker=document.createElement("span");
  kicker.className="memory-eyebrow";kicker.textContent="MEMORY "+memory.number+" · UNLOCKED";
  const h=document.createElement("h3");h.textContent=memory.title;
  const intro=document.createElement("p");intro.className="memory-detail-intro";intro.textContent=memory.introduction;
  const story=document.createElement("p");story.textContent=memory.copy;
  const hint=document.createElement("small");hint.textContent="A small story, just for the journey. ✿";
  info.append(kicker,h,intro,story,hint);
  article.append(img,info);
  gallery.append(article);
  const dialog=root.closest("dialog");if(dialog)dialog.scrollTop=0;
  back.focus();
 }
 showGallery();
}
