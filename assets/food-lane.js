// Self-contained savoury food-lane mini-activity. No profile, analytics or backend.
import {DISHES, FOOD_KEY, parseFoodProgress, markDishOrdered, orderLine} from "./food-lane-data.js";

function load(){
 try{return parseFoodProgress(localStorage.getItem(FOOD_KEY));}
 catch{return {ordered:[]};}
}
function save(state){
 try{localStorage.setItem(FOOD_KEY,JSON.stringify(state));return true;}
 catch{return false;}
}
function shuffle(list){
 const out=[...list];
 for(let i=out.length-1;i>0;i--){
  const j=Math.floor(Math.random()*(i+1));
  [out[i],out[j]]=[out[j],out[i]];
 }
 return out;
}
export function renderFoodLane(root,speak){
 const state=load();
 let active=DISHES[0].id;
 root.innerHTML=`<section class="food-lane">
  <div class="food-welcome">
    <div class="food-welcome-art" role="img" aria-label="A Japanese evening street of small food stalls and glowing lanterns">
      <img src="/assets/food-lane.svg" alt="" width="900" height="300">
    </div>
    <div class="food-welcome-copy">
      <span class="panel-kicker">A LITTLE CULINARY DETOUR · 屋台</span>
      <h3>Little bites, big discoveries.</h3>
      <p>Grilled fish, comforting skewers, octopus and even delightfully sticky nattō. Explore a few savoury Japanese favourites and practise ordering.</p>
    </div>
  </div>
  <div class="food-layout">
    <div class="food-menu-area">
      <div class="food-menu-heading"><h4>Choose something delicious</h4><span id="food-tally" aria-live="polite"></span></div>
      <div id="food-menu" class="food-menu" aria-label="Japanese dishes"></div>
    </div>
    <div id="food-detail" class="food-detail" aria-live="polite"></div>
  </div>
  <div class="food-courtesy">
    <span aria-hidden="true">🍵</span><span><strong>A lovely little custom:</strong> <span lang="ja">いただきます</span> (<em>itadakimasu</em>) is traditionally said before eating, expressing gratitude for the food and those who prepared it.</span>
  </div>
  <p class="food-footnote">This is an optional discovery. Your hiragana, postcards and story progress will never change here.</p>
 </section>`;
 const menu=root.querySelector("#food-menu");
 const detail=root.querySelector("#food-detail");
 const updateTally=()=>{
  root.querySelector("#food-tally").textContent=`${state.ordered.length} / ${DISHES.length} dishes ordered`;
 };
 const updateMenu=()=>{
  menu.replaceChildren();
  for(const dish of DISHES){
   const b=document.createElement("button");
   b.type="button";b.className="food-menu-item";
   b.dataset.dish=dish.id;
   b.setAttribute("aria-pressed",String(active===dish.id));
   b.innerHTML=`<span class="food-dish-emoji" aria-hidden="true">${dish.symbol}</span>
    <span class="food-menu-name"><strong lang="ja">${dish.jp}</strong><small>${dish.name}</small></span>
    <span class="food-menu-check">${state.ordered.includes(dish.id)?"✓":"→"}</span>`;
   b.addEventListener("click",()=>{active=dish.id;updateMenu();showDetail();});
   menu.append(b);
  }
  updateTally();
 };
 const showDetail=()=>{
  const dish=DISHES.find(d=>d.id===active);
  detail.innerHTML=`<div class="food-detail-top"><span class="food-detail-emoji" aria-hidden="true">${dish.symbol}</span>
    <div><span class="panel-kicker">${dish.kind}</span>
    <h4><ruby lang="ja">${dish.jp}<rt>${dish.kana}</rt></ruby></h4>
    <p class="food-roman">${dish.romaji} · ${dish.name}</p></div>
   </div>
   <p class="food-description">${dish.detail}</p>
   <p class="food-note">✦ ${dish.note}</p>
   <div class="food-order-phrase"><span>TRY SAYING</span>
    <p lang="ja">${orderLine(dish)}</p>
    <small>${dish.romaji} o kudasai. · ${dish.name}, please.</small></div>
   <div class="food-detail-actions">
     <button type="button" class="soft-button" id="food-hear">♫ Hear my order</button>
     <button type="button" class="primary" id="food-challenge">Try ordering ↗</button>
   </div>
   <p id="audio-feedback" class="feedback" role="status"></p>
   <div id="food-question"></div>`;
  detail.querySelector("#food-hear").addEventListener("click",()=>speak(orderLine(dish)));
  detail.querySelector("#food-challenge").addEventListener("click",()=>showChallenge(dish));
 };
 const showChallenge=(dish)=>{
  const area=detail.querySelector("#food-question");
  const choices=shuffle([dish,...shuffle(DISHES.filter(d=>d.id!==dish.id)).slice(0,3)]);
  area.innerHTML=`<div class="food-question"><span class="panel-kicker">A SMALL ORDERING CHALLENGE</span>
    <h5>What are you ordering?</h5><p class="food-quiz-japanese" lang="ja">${orderLine(dish)}</p>
    <div class="food-choice-grid" id="food-choices"></div>
    <p id="food-feedback" class="feedback" role="status"></p>
    <button type="button" id="food-next" class="soft-button" hidden>Discover another dish →</button>
  </div>`;
  const feedback=area.querySelector("#food-feedback");
  for(const option of choices){
   const b=document.createElement("button");b.type="button";b.className="soft-button food-choice";
   b.textContent=option.name;
   b.addEventListener("click",()=>{
    if(b.disabled)return;
    if(option.id!==dish.id){
     b.classList.add("wrong");feedback.textContent="Not this one — take another look at the Japanese name.";return;
    }
    if(!state.ordered.includes(dish.id)){
     const snapshot=[...state.ordered];
     markDishOrdered(state,dish.id);
     if(!save(state)){
      state.ordered=snapshot;
      feedback.textContent="Your browser couldn't save this order. Check site storage settings.";
      return;
     }
    }
    area.querySelectorAll(".food-choice").forEach(choice=>choice.disabled=true);
    b.classList.add("correct");
    feedback.textContent="いただきます! ✿ Your order is ready.";
    area.querySelector("#food-next").hidden=false;
    updateMenu();
   });
   area.querySelector("#food-choices").append(b);
  }
  area.querySelector("#food-next").addEventListener("click",()=>{
   const next=DISHES.find(x=>!state.ordered.includes(x.id) && x.id!==dish.id) ||
     DISHES[(DISHES.findIndex(x=>x.id===dish.id)+1)%DISHES.length];
   active=next.id;updateMenu();showDetail();
  });
 };
 updateMenu();showDetail();
}
