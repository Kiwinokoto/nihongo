// Kotoba no Tabi — a tiny, dependency-free learning journey.
// Tracing is ungraded practice; recognition and timed revision build a collection.
import {
  KANA, ROWS, ALL_KANA, STORAGE_KEY, parseProgress, currentRow,
  isRowUnlocked, completedInRow, dueKana, markTraced, markCorrect, markIncorrect
} from "./progression.js";
import {renderWordPostcards,learnedWordCount} from "./word-postcards.js";
import {renderFoodLane} from "./food-lane.js";
import {renderKatakanaStation} from "./katakana-station.js";
import {renderStartingVillage} from "./starting-village.js";
import {speakJapanese as playJapanese, stopJapaneseAudio} from "./japanese-audio.js";
import {enableBackdropDismiss} from "./dialog-dismiss.js";
import {renderAdvancedKana} from "./advanced-kana.js";
import {KATA_STORAGE_KEY,readKata} from "./katakana-progress.js";
import {ADVANCED_STORAGE_KEY,parseAdvanced,advancedCount} from "./advanced-kana-data.js";
import {WORD_STORAGE_KEY,parseWordProgress} from "./word-trails.js";
import {FOOD_KEY,parseFoodProgress} from "./food-lane-data.js";
import {milestoneStatus,unlockedScenes} from "./story-milestones.js";
import {renderLittleMemories} from "./little-memories.js";
import {renderKanaCheckpoint} from "./kana-checkpoint.js";

const $ = (id) => document.getElementById(id);
const STARTER_COUNT = ALL_KANA.length;
function loadProgress() {
  try {return parseProgress(localStorage.getItem(STORAGE_KEY));}
  catch {return parseProgress(null);}
}
const progress = loadProgress();
let rowIndex = currentRow(progress);
let selected = KANA.findIndex(k => k.row===rowIndex && !progress.mastered.includes(k.glyph));
if(selected<0)selected=KANA.findIndex(k=>k.row===rowIndex);
let tab="discover", answered=false, strokes=[], activeStroke=null, canvasObserver=null;
let checkpointCleanup=null;
let guideCounts={};
fetch("/assets/kana-guide-counts.json")
  .then(res=>res.ok?res.json():{})
  .then(data=>{guideCounts=data;if(tab==="trace")updateStrokeCount();})
  .catch(()=>{});

function saveProgress() {
  try {localStorage.setItem(STORAGE_KEY,JSON.stringify(progress));}
  catch {showFeedback("Your browser couldn't save progress. Please check your storage settings.");}
  updateProgress();
}
function updateProgress(){
  const total=progress.mastered.length;
  const rowTotal=[...ROWS[currentRow(progress)].kana].length;
  const rowDone=completedInRow(progress,currentRow(progress));
  $("header-progress").textContent=`${total}/${STARTER_COUNT}`;
  $("overview-progress").textContent=`${rowDone} of ${rowTotal} in this row · ${total} total`;
  $("lesson-count").textContent=`${total} / ${STARTER_COUNT} collected`;
  $("progress-fill").style.width=`${Math.round(100*total/STARTER_COUNT)}%`;
}
const PLACES={
  start:{n:"WELCOME · YOUR JOURNEY BEGINS",emoji:"🏡",title:"The starting village",jp:"はじまりの村",description:"Every adventure begins with a small hello. Take the first path towards the blossoms and meet your first sounds.",fact:"Your first steps",status:"READY",button:"Let's begin"},
  garden:{n:"STOP 01 · THE HIRAGANA GARDEN",emoji:"🌸",title:"The hiragana garden",jp:"ひらがなの庭",description:"Follow ten little paths of sounds. Listen, learn their stroke order, trace and collect all 46 basic hiragana.",fact:"46 hiragana to discover",status:"READY",button:"Enter the garden"},
  tea:{n:"STOP 02 · A TASTY LITTLE DETOUR",emoji:"🍢",title:"The little food lane",jp:"やたいのこみち",description:"Follow the savoury aromas: grilled fish, chicken skewers, octopus bites and wonderfully sticky nattō. Learn to order a favourite.",fact:"6 dishes to discover",status:"READY",button:"Explore the food lane"},
  shrine:{n:"BEYOND THE FOREST · SOON",emoji:"⛩️",title:"The kanji shrine",jp:"かんじの神社",description:"Learn meaningful characters among quiet trees and lanterns. This stop is being prepared.",fact:"Meaning & writing",status:"COMING SOON",button:"The shrine is not ready yet"},
  train:{n:"STOP 03 · ALL ABOARD",emoji:"🚃",title:"Katakana station",jp:"カタカナのえき",description:"A second beautiful set of shapes for sounds you already know. Discover and trace all 46 basic katakana, one row at a time.",fact:"46 katakana to collect",status:"READY",button:"Board the katakana train"}
};
let place="garden";
function selectPlace(id){
  if(!(id in PLACES))return;
  place=id;const p=PLACES[id];
  $("place-number").textContent=p.n;$("place-emoji").textContent=p.emoji;
  $("place-title").textContent=p.title;$("place-japanese").textContent=p.jp;
  $("place-description").textContent=p.description;
  $("place-fact").textContent="✦ "+p.fact;$("place-status").textContent=p.status;
  $("place-status").className=p.status==="READY"?"available":"locked-status";
  $("place-action").disabled=p.status!=="READY";
  $("place-action").textContent=p.button+(p.status==="READY"?" ↗":"");
  document.querySelectorAll("[data-place]").forEach(b=>{
    b.classList.toggle("current",b.dataset.place===id);
    b.setAttribute("aria-pressed",String(b.dataset.place===id));
  });
}
let closeKataSession=null,closeVillageSession=null;
function openKatakana(){
  closeKataSession?.();
  closeKataSession=renderKatakanaStation($("katakana-content"),speakJapanese,()=>openAdvanced("katakana"));
  $("katakana-dialog").showModal();
}
function openVillage(){
  closeVillageSession?.();
  const travel=(destination)=>{
    $("village-dialog").close();
    if(destination==="garden"){selectPlace("garden");openLesson();}
    if(destination==="train"){selectPlace("train");openKatakana();}
    if(destination==="tea"){selectPlace("tea");openFoodLane();}
  };
  closeVillageSession=renderStartingVillage($("village-content"),{
    onHiragana:()=>travel("garden"),
    onKatakana:()=>travel("train"),
    onFood:()=>travel("tea"),
    speakJapanese
  });
  $("village-dialog").showModal();
}
function openAdvanced(script){
  if($("lesson-dialog").open)$("lesson-dialog").close();
  if($("katakana-dialog").open)$("katakana-dialog").close();
  renderAdvancedKana($("advanced-content"),script,speakJapanese,(returnTo)=>{
    $("advanced-dialog").close();
    if(returnTo==="katakana")openKatakana();
    else openLesson("collection");
  });
  $("advanced-dialog").showModal();
}
function openFoodLane(){
  renderFoodLane($("food-content"),speakJapanese);
  $("food-dialog").showModal();
}
function openLesson(nextTab="discover"){
  rowIndex=currentRow(progress);
  const first=KANA.findIndex(k=>k.row===rowIndex&&!progress.mastered.includes(k.glyph));
  selected=first>=0?first:KANA.findIndex(k=>k.row===rowIndex);
  selectTab(nextTab);$("lesson-dialog").showModal();
}
// Derive story access from existing results, never from an invented click counter.
const stored=(key)=>{try{return localStorage.getItem(key);}catch{return null;}};
let heroSceneIndex=0;
let visibleScenes=[];
function earnedMilestones(){
  const hira=parseProgress(stored(STORAGE_KEY)).mastered.length;
  const kata=readKata(stored(KATA_STORAGE_KEY)).mastered.length;
  const advanced=advancedCount(parseAdvanced(stored(ADVANCED_STORAGE_KEY)));
  const words=parseWordProgress(stored(WORD_STORAGE_KEY)).collected.length;
  const food=parseFoodProgress(stored(FOOD_KEY)).ordered.length;
  return milestoneStatus({hiragana:hira,katakana:kata,advanced,words,food});
}
function refreshStoryScenes(){
  visibleScenes=unlockedScenes(earnedMilestones());
  heroSceneIndex=Math.min(heroSceneIndex,visibleScenes.length-1);
  const scene=visibleScenes[heroSceneIndex];
  const image=$("hero-scene-image");
  if(image.getAttribute("src")!==scene.src){
    image.src=scene.src;
    if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches){
      image.animate([{opacity:.5,transform:"scale(1.018)"},{opacity:1,transform:"scale(1)"}],
        {duration:280,easing:"ease-out"});
    }
  }
  image.alt=scene.alt;
  $("hero-story-caption").textContent=scene.title+" · "+scene.subtitle;
  const nav=$("hero-scene-controls");
  nav.hidden=visibleScenes.length<2;
  $("hero-scene-number").textContent="Scene "+(heroSceneIndex+1)+" of "+visibleScenes.length;
  $("hero-prev").disabled=heroSceneIndex===0;
  $("hero-next").disabled=heroSceneIndex>=visibleScenes.length-1;
}
function selectHeroScene(index){
  refreshStoryScenes();
  if(!Number.isInteger(index)||index<0||index>=visibleScenes.length)return;
  heroSceneIndex=index;
  refreshStoryScenes();
}
function renderMilestoneJournal(){
  const status=earnedMilestones();
  const target=$("journal-milestone-list");
  target.replaceChildren();
  for(const milestone of status){
    const row=document.createElement("section");
    row.className="milestone-row"+(milestone.unlocked?" complete":" upcoming");
    const icon=document.createElement("span");
    icon.className="milestone-symbol";
    icon.textContent=milestone.unlocked?"✿":"✧";
    icon.setAttribute("aria-hidden","true");
    const copy=document.createElement("div");
    copy.className="milestone-description";
    const title=document.createElement("strong");title.textContent=milestone.title;
    const detail=document.createElement("small");
    detail.textContent=milestone.unlocked?"Unlocked · "+milestone.target:
      milestone.progress?milestone.target+" · "+milestone.progress.done+"/"+milestone.progress.target:
      milestone.target;
    copy.append(title,detail);row.append(icon,copy);
    if(milestone.unlocked&&milestone.scene){
      const action=document.createElement("button");
      action.type="button";action.className="soft-button milestone-open";
      action.textContent="See scene ↗";
      action.addEventListener("click",()=>{
        refreshStoryScenes();
        const index=visibleScenes.findIndex(scene=>scene.id===milestone.scene);
        if(index<0)return;
        $("journal-dialog").close();
        selectHeroScene(index);
        $("hero-story").scrollIntoView({behavior:"smooth",block:"center"});
      });
      row.append(action);
    }
    target.append(row);
  }
}
function openLittleMemories(){
  // One native modal at a time; never keep two stacked dialogs.
  $("journal-dialog").close();
  renderLittleMemories($("memories-content"),earnedMilestones(),()=>{
    $("memories-dialog").close();
    renderJournal();
  });
  $("memories-dialog").showModal();
}
function renderJournal(){
  const total=progress.mastered.length,due=dueKana(progress).length,words=learnedWordCount();
  $("journal-description").textContent=(total
    ? `You've collected ${total} of ${STARTER_COUNT} hiragana. ${due?due+" ready for a little review.":"The next discovery is waiting."}`
    : "Every little discovery counts. Your first sounds are waiting.")
    +(words?` And ${words} little word postcard${words===1?"":"s"}!`:"");
  renderMilestoneJournal();
  const cards=$("journal-cards");cards.replaceChildren();
  ALL_KANA.forEach(glyph=>{
    if(!progress.mastered.includes(glyph))return;
    const cell=document.createElement("span");cell.className="earned";cell.textContent=glyph;
    const note=document.createElement("small");note.textContent=dueKana(progress).includes(glyph)?"review ✧":"✓";
    cell.append(note);cards.append(cell);
  });
  if(!cards.childElementCount){const n=document.createElement("p");n.textContent="Your first blossom is waiting 🌸";cards.append(n);}
  $("journal-garden").textContent=due?"Review my sounds ↗":"Visit the garden ↗";
  $("journal-dialog").showModal();
}
function speakJapanese(text,output=document.querySelector("dialog[open] #audio-feedback")||$("audio-feedback")){
  return playJapanese(text,output);
}
function showFeedback(message){const out=$("panel-feedback");if(out)out.textContent=message;}
function setRow(index){
  if(!isRowUnlocked(progress,index))return;
  rowIndex=index;
  selected=KANA.findIndex(k=>k.row===index&&!progress.mastered.includes(k.glyph));
  if(selected<0)selected=KANA.findIndex(k=>k.row===index);
  answered=false;strokes=[];activeStroke=null;
  renderLesson();
}
function renderRowBar(){
  const row=ROWS[rowIndex];
  $("row-number").textContent=`ROW ${rowIndex+1} OF ${ROWS.length}`;
  $("row-title").textContent=row.title;
  $("row-subtitle").textContent=row.subtitle;
  $("row-progress").textContent=`${completedInRow(progress,rowIndex)} / ${[...row.kana].length} collected`;
  $("previous-row").disabled=rowIndex===0;
  $("next-row").disabled=!isRowUnlocked(progress,rowIndex+1);
}
function renderPicker(){
  const picker=$("kana-picker");picker.replaceChildren();
  KANA.forEach((item,i)=>{
    if(item.row!==rowIndex)return;
    const b=document.createElement("button");
    b.type="button";b.className=i===selected?"active":"";
    b.setAttribute("aria-pressed",String(i===selected));
    b.innerHTML=`<strong lang="ja">${item.glyph}</strong><small>${item.romaji}${progress.mastered.includes(item.glyph)?" ✓":""}</small>`;
    b.addEventListener("click",()=>{selected=i;answered=false;strokes=[];renderLesson();});
    picker.append(b);
  });
}
function selectTab(next){
  checkpointCleanup?.();checkpointCleanup=null;
  tab=next;answered=false;strokes=[];activeStroke=null;
  document.querySelectorAll(".lesson-tabs [role=tab]").forEach(b=>{
    b.setAttribute("aria-selected",String(b.dataset.tab===tab));
    b.tabIndex=b.dataset.tab===tab?0:-1;
  });
  renderLesson();
}
function guideSrc(glyph){return `/assets/strokes/${glyph.codePointAt(0)}.svg`;}
function guideImage(glyph){
  return `<img class="stroke-demo" src="${guideSrc(glyph)}" alt="Animated stroke-order demonstration for ${glyph}" lang="ja">`;
}
function replayGuide(scope){
  const target=scope.querySelector(".stroke-demo");
  if(target)target.replaceWith(target.cloneNode());
}
function renderLesson(){
  checkpointCleanup?.();checkpointCleanup=null;
  $("lesson-rowbar").hidden=false; $("kana-picker").hidden=tab==="checkpoint";
  if(canvasObserver){canvasObserver.disconnect();canvasObserver=null;}
  renderRowBar();renderPicker();
  const {glyph,romaji}=KANA[selected];
  const panel=$("lesson-panel");
  if(tab==="discover"){
    panel.innerHTML=`<div class="discover-panel">
      <div class="guide-card">
        ${guideImage(glyph)}
        <button type="button" class="soft-button replay-guide">↻ Replay the strokes</button>
      </div>
      <div class="panel-copy">
        <span class="panel-kicker">A LITTLE DISCOVERY · ${romaji.toUpperCase()}</span>
        <h3>Meet <span lang="ja">${glyph}</span> · <em>${romaji}</em></h3>
        <p>Watch the brush draw each stroke in order. Listen to the sound, then give your own hand a try.</p>
        <div class="actions-row">
          <button class="soft-button" id="hear-sound">♫ Hear the sound</button>
          <button class="primary" id="next-to-trace">Let's draw ↗</button>
        </div>
        <p class="feedback" id="audio-feedback" role="status"></p>
      </div>
    </div>`;
    panel.querySelector(".replay-guide").addEventListener("click",()=>replayGuide(panel));
    $("hear-sound").addEventListener("click",()=>speakJapanese(glyph));
    $("next-to-trace").addEventListener("click",()=>selectTab("trace"));
  }else if(tab==="trace"){
    panel.innerHTML=`<div class="trace-layout">
      <div>
        <div class="trace-box" id="trace-box">
          <div class="trace-ghost" id="trace-ghost" lang="ja">${glyph}</div>
          <canvas id="trace-canvas" aria-label="Draw the Japanese character ${glyph} using your mouse, finger or pen"></canvas>
        </div>
        <div class="trace-controls">
          <button class="soft-button" id="undo-stroke">↶ Undo</button>
          <button class="soft-button" id="clear-strokes">Clear</button>
          <button class="soft-button" id="toggle-guide">Hide guide</button>
        </div>
      </div>
      <div class="panel-copy">
        <span class="panel-kicker">A QUIET INK-BRUSH MOMENT</span>
        <h3>Trace <span lang="ja">${glyph}</span> with care.</h3>
        <div class="mini-stroke-card">
          ${guideImage(glyph)}
          <div><strong>Stroke order</strong>
          <p id="stroke-count-hint">Watch the guide and follow the brush.</p>
          <button class="soft-button replay-guide">↻ Replay</button></div>
        </div>
        <p>Follow the pale character on the left. We count your brush movements, but <strong>we don't grade your handwriting</strong>.</p>
        <div class="actions-row">
          <button class="primary" id="save-trace">Save my drawing ✓</button>
          <button class="soft-button" id="trace-next" type="button">Next shape →</button>
          <button class="soft-button" id="skip-to-quiz">Go to checking →</button>
        </div>
        <p class="feedback" id="panel-feedback" role="status">${progress.traced.includes(glyph)?"You have practised this shape before.":""}</p>
      </div>
    </div>`;
    setupCanvas();updateStrokeCount();
    panel.querySelector(".replay-guide").addEventListener("click",()=>replayGuide(panel));
    $("undo-stroke").addEventListener("click",()=>{strokes.pop();redraw();});
    $("clear-strokes").addEventListener("click",()=>{strokes=[];redraw();});
    $("toggle-guide").addEventListener("click",()=>{
      const ghost=$("trace-ghost");ghost.hidden=!ghost.hidden;
      $("toggle-guide").textContent=ghost.hidden?"Show guide":"Hide guide";
    });
    $("skip-to-quiz").addEventListener("click",()=>selectTab("checkpoint"));
    $("trace-next").addEventListener("click",()=>{
      const next=KANA.find(k=>k.row===rowIndex && KANA.indexOf(k)>selected);
      if(next){selected=KANA.indexOf(next);selectTab("discover");}
      else if(isRowUnlocked(progress,rowIndex+1)){setRow(rowIndex+1);selectTab("discover");}
      else selectTab("discover");
    });
    $("save-trace").addEventListener("click",()=>{
      if(!strokes.some(s=>s.length>1)){showFeedback("Draw at least one line first. There is no rush.");return;}
      markTraced(progress,glyph);saveProgress();
      // Stay in the learning workshop; never turn a brush exercise into a test.
      $("save-trace").textContent="Saved ✓";
      $("save-trace").disabled=true;
      showFeedback("Drawing saved. This is practice, not a handwriting score. Continue learning or choose a separate check.");
    });
  }else if(tab==="checkpoint"){
    checkpointCleanup=renderKanaCheckpoint(panel,{
      items:KANA.filter(k=>k.row===rowIndex),script:"hiragana",speak:speakJapanese,
      onRecognised:got=>{
        markCorrect(progress,got);saveProgress();renderRowBar();renderPicker();
      }
    });
  }else if(tab==="practice"){
    renderPractice(glyph,romaji,false);
  }else if(tab==="review"){
    renderReview();
  }else{
    renderCollection();
  }
}
function updateStrokeCount(){
  const label=$("stroke-count-hint"),glyph=KANA[selected]?.glyph;
  if(!label||!glyph)return;
  const count=guideCounts[glyph];
  label.textContent=count
    ? `${count} brush stroke${count===1?"":"s"} in the example. Watch their order.`
    : "Watch the animated strokes in their correct order.";
}
function shuffle(items){
  const result=[...items];
  for(let i=result.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [result[i],result[j]]=[result[j],result[i]];
  }
  return result;
}
function nextSound(){
  const row=ROWS[rowIndex];
  const next=[...row.kana].find(c=>!progress.mastered.includes(c));
  if(next){
    selected=KANA.findIndex(k=>k.glyph===next);
    selectTab("practice");
    return;
  }
  if(isRowUnlocked(progress,rowIndex+1)){
    rowIndex+=1;
    selected=KANA.findIndex(k=>k.row===rowIndex);
    selectTab("practice");
    return;
  }
  selectTab("collection");
}
function renderPractice(glyph,romaji,isReview){
  const pool=KANA.filter(k=>k.glyph!==glyph && k.row<=rowIndex).map(k=>k.glyph);
  if(pool.length<3)pool.push(...KANA.filter(k=>k.glyph!==glyph).map(k=>k.glyph));
  const options=shuffle([glyph,...shuffle([...new Set(pool)]).slice(0,3)]);
  $("lesson-panel").innerHTML=`<div class="practice-panel">
    <div class="panel-copy">
      <span class="panel-kicker">${isReview?"A LITTLE REVISIT":"A TINY CHALLENGE"}</span>
      <h3>Which hiragana sounds like <em>“${romaji}”</em>?</h3>
      <p>Choose the matching shape. Need a hint? Use Discover or Trace above.</p>
      <button class="soft-button" id="hear-practice">♫ Listen</button>
      <p class="feedback" id="audio-feedback" role="status"></p>
    </div>
    <div>
      <div class="choices" id="practice-choices"></div>
      <p class="feedback" id="panel-feedback" role="status"></p>
      <button class="soft-button" id="next-sound" hidden>Next little discovery →</button>
    </div>
  </div>`;
  $("hear-practice").addEventListener("click",()=>speakJapanese(glyph));
  for(const option of options){
    const btn=document.createElement("button");btn.type="button";btn.textContent=option;
    btn.lang="ja";btn.setAttribute("aria-label",`Hiragana ${option}`);
    btn.addEventListener("click",()=>{
      if(answered)return;
      if(option!==glyph){
        btn.classList.add("wrong");
        markIncorrect(progress,glyph);
        if(progress.mastered.includes(glyph))saveProgress();
        showFeedback("Not quite. Have another try — the sound is still waiting.");return;
      }
      answered=true;btn.classList.add("correct");
      document.querySelectorAll(".choices button").forEach(b=>b.disabled=true);
      const beforeRows=ROWS.map((_,i)=>isRowUnlocked(progress,i));
      const first=markCorrect(progress,glyph);saveProgress();
      renderRowBar();renderPicker();
      const unlocked=ROWS.findIndex((_,i)=>!beforeRows[i]&&isRowUnlocked(progress,i));
      showFeedback(unlocked>=0
        ? `A new path is open! ✿ ${ROWS[unlocked].title} is ready.`
        : first?"Beautiful! ✿ A new sound for your collection."
          :"Nicely remembered! Your next review is scheduled.");
      $("next-sound").hidden=false;
      $("next-sound").textContent=isReview?"Back to my reviews →":unlocked>=0?"Try the next row →":"Next sound →";
    });
    $("practice-choices").append(btn);
  }
  $("next-sound").addEventListener("click",()=>{
    answered=false;
    if(isReview){selectTab("review");return;}
    nextSound();
  });
}
function renderReview(){
  const due=dueKana(progress);
  const panel=$("lesson-panel");
  panel.innerHTML=`<div class="review-header">
    <span class="panel-kicker">A FEW MOMENTS TO REMEMBER</span>
    <h3>${due.length?`${due.length} sound${due.length===1?" is":"s are"} ready to revisit.`:"All caught up. Lovely work!"}</h3>
    <p>Little reviews return over time: tomorrow, then after a few more days. There is no penalty for mistakes.</p>
    <div class="review-list" id="review-list"></div>
    <div class="actions-row"><button class="soft-button" id="return-to-discover">Back to exploring →</button></div>
  </div>`;
  $("return-to-discover").addEventListener("click",()=>selectTab("discover"));
  for(const glyph of due){
    const item=KANA.find(k=>k.glyph===glyph);
    const button=document.createElement("button");button.type="button";button.className="review-token";
    button.innerHTML=`<strong lang="ja">${glyph}</strong><small>${item.romaji}</small>`;
    button.addEventListener("click",()=>{
      rowIndex=item.row;selected=KANA.indexOf(item);answered=false;
      renderRowBar();renderPicker();renderPractice(item.glyph,item.romaji,true);
    });
    $("review-list").append(button);
  }
}
function renderCollection(){
  const panel=$("lesson-panel");
  panel.innerHTML=`<div class="collection-intro">
    <h3>Your hiragana collection</h3>
    <p>Finish a row's recognition challenges to open the next. You can always return to practise an unlocked row.</p>
    <div class="word-teaser">
      <div class="word-teaser-symbol" aria-hidden="true">🍡</div>
      <div><strong>Little word postcards</strong><p>Discover real Japanese words with the hiragana you know. Some postcards lead to quiet stories beyond the lanterns ✧</p></div>
      <button class="soft-button" id="open-word-postcards" type="button">Explore words ↗</button>
    </div>
  </div><div class="collection-sections" id="collection-sections"></div>`;
  $("open-word-postcards").addEventListener("click",()=>{
    $("lesson-rowbar").hidden=true; $("kana-picker").hidden=true;
    renderWordPostcards(panel,progress.mastered,speakJapanese,()=>{
      $("lesson-rowbar").hidden=false; $("kana-picker").hidden=false;renderCollection();
    });
  });
  ROWS.forEach((row,i)=>{
    const unlocked=isRowUnlocked(progress,i),done=completedInRow(progress,i);
    const section=document.createElement("section");section.className="collection-section";
    const label=document.createElement("div");label.className="collection-row-label";
    const heading=document.createElement("strong");heading.textContent=`${i+1}. ${row.title}`;
    const tally=document.createElement("small");
    tally.textContent=unlocked?`${done}/${[...row.kana].length} collected`:"🔒 Locked";
    label.append(heading,tally);section.append(label);
    const grid=document.createElement("div");grid.className="collection-grid";
    [...row.kana].forEach(glyph=>{
      const item=KANA.find(k=>k.glyph===glyph);
      const cell=document.createElement("button");
      cell.type="button";cell.disabled=!unlocked;
      cell.innerHTML=`<strong lang="ja">${glyph}</strong><small>${unlocked?(progress.mastered.includes(glyph)?"✓ collected":item.romaji):"soon"}</small>`;
      if(unlocked)cell.addEventListener("click",()=>{
        rowIndex=i;selected=KANA.indexOf(item);selectTab("discover");
      });
      grid.append(cell);
    });
    section.append(grid);$("collection-sections").append(section);
  });
}
function setupCanvas(){
  const canvas=$("trace-canvas"),box=$("trace-box");
  const point=e=>{
    const r=canvas.getBoundingClientRect();
    return {x:Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),
            y:Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))};
  };
  canvas.addEventListener("pointerdown",e=>{
    if(e.pointerType==="mouse"&&e.button!==0)return;
    e.preventDefault();canvas.setPointerCapture(e.pointerId);
    activeStroke=[point(e)];strokes.push(activeStroke);redraw();
  });
  canvas.addEventListener("pointermove",e=>{
    if(!activeStroke||!canvas.hasPointerCapture(e.pointerId))return;
    activeStroke.push(point(e));redraw();
  });
  const stop=()=>{activeStroke=null;};
  canvas.addEventListener("pointerup",stop);
  canvas.addEventListener("pointercancel",stop);
  canvasObserver=new ResizeObserver(redraw);
  canvasObserver.observe(box);redraw();
}
function redraw(){
  const canvas=$("trace-canvas");if(!canvas)return;
  const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;
  const dpr=Math.min(3,window.devicePixelRatio||1);
  canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);
  const ctx=canvas.getContext("2d");
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.strokeStyle="#346d5c";ctx.fillStyle="#346d5c";ctx.lineWidth=7;
  ctx.lineJoin="round";ctx.lineCap="round";
  for(const stroke of strokes){
    if(!stroke.length)continue;
    ctx.beginPath();ctx.moveTo(stroke[0].x*r.width,stroke[0].y*r.height);
    if(stroke.length===1){
      ctx.arc(stroke[0].x*r.width,stroke[0].y*r.height,3,0,Math.PI*2);
      ctx.fill();continue;
    }
    for(const p of stroke.slice(1))ctx.lineTo(p.x*r.width,p.y*r.height);
    ctx.stroke();
  }
}
document.querySelectorAll("[data-place]").forEach(b=>b.addEventListener("click",()=>selectPlace(b.dataset.place)));
$("place-action").addEventListener("click",()=>{
  if(place==="start")openVillage();
  else if(place==="garden")openLesson();
  else if(place==="tea")openFoodLane();
  else if(place==="train")openKatakana();
});
$("hero-prev").addEventListener("click",()=>selectHeroScene(heroSceneIndex-1));
$("hero-next").addEventListener("click",()=>selectHeroScene(heroSceneIndex+1));
$("hero-story").addEventListener("keydown",event=>{
  if(!["ArrowLeft","ArrowRight"].includes(event.key))return;
  event.preventDefault();
  selectHeroScene(heroSceneIndex+(event.key==="ArrowRight"?1:-1));
});
let touchX=null,touchY=null;
$("hero-story").addEventListener("touchstart",event=>{
  if(event.touches.length!==1)return;
  touchX=event.touches[0].clientX;touchY=event.touches[0].clientY;
},{passive:true});
$("hero-story").addEventListener("touchend",event=>{
  if(touchX===null||!event.changedTouches.length)return;
  const dx=event.changedTouches[0].clientX-touchX;
  const dy=event.changedTouches[0].clientY-touchY;
  touchX=null;touchY=null;
  if(Math.abs(dx)>48&&Math.abs(dx)>Math.abs(dy)*1.3){
    selectHeroScene(heroSceneIndex+(dx<0?1:-1));
  }
},{passive:true});
$("open-journal").addEventListener("click",renderJournal);
$("open-little-memories").addEventListener("click",openLittleMemories);
$("close-memories").addEventListener("click",()=>$("memories-dialog").close());
$("close-lesson").addEventListener("click",()=>$("lesson-dialog").close());
$("close-food").addEventListener("click",()=>$("food-dialog").close());
$("close-village").addEventListener("click",()=>$("village-dialog").close());
$("close-katakana").addEventListener("click",()=>$("katakana-dialog").close());
$("close-advanced").addEventListener("click",()=>$("advanced-dialog").close());
$("open-hiragana-advanced").addEventListener("click",()=>openAdvanced("hiragana"));
$("close-journal").addEventListener("click",()=>$("journal-dialog").close());
$("journal-garden").addEventListener("click",()=>{
  const due=dueKana(progress).length;
  $("journal-dialog").close();openLesson(due?"review":"discover");
});
$("previous-row").addEventListener("click",()=>setRow(rowIndex-1));
$("next-row").addEventListener("click",()=>setRow(rowIndex+1));
document.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>selectTab(b.dataset.tab)));
document.querySelectorAll(".lesson-tabs [role=tab]").forEach((b,i,all)=>b.addEventListener("keydown",e=>{
  if(e.key!=="ArrowLeft"&&e.key!=="ArrowRight")return;
  e.preventDefault();const next=all[(i+(e.key==="ArrowRight"?1:all.length-1))%all.length];
  selectTab(next.dataset.tab);next.focus();
}));
// Refresh newly earned scenes when any learning dialog closes. No new storage writes.
for(const dialog of document.querySelectorAll("dialog")){
  dialog.addEventListener("close",refreshStoryScenes);
}
// Background clicks dismiss modal dialogs on desktop/fine pointer devices.
document.querySelectorAll("dialog").forEach(dialog=>{
  enableBackdropDismiss(dialog,window.matchMedia("(pointer:fine)"));
  dialog.addEventListener("close",stopJapaneseAudio);
});
$("food-dialog").addEventListener("close",()=>{if("speechSynthesis" in window)speechSynthesis.cancel();});
$("village-dialog").addEventListener("close",()=>{closeVillageSession?.();closeVillageSession=null;if("speechSynthesis" in window)speechSynthesis.cancel();});
$("katakana-dialog").addEventListener("close",()=>{closeKataSession?.();closeKataSession=null;if("speechSynthesis" in window)speechSynthesis.cancel();});
$("lesson-dialog").addEventListener("close",()=>{
  if("speechSynthesis" in window)speechSynthesis.cancel();
  if(canvasObserver){canvasObserver.disconnect();canvasObserver=null;}
  checkpointCleanup?.();checkpointCleanup=null;
});
window.addEventListener("storage",event=>{
  if(event.key===STORAGE_KEY){
    Object.assign(progress,loadProgress());rowIndex=currentRow(progress);
    updateProgress();
    if($("lesson-dialog").open)renderLesson();
  }
  if([STORAGE_KEY,KATA_STORAGE_KEY,ADVANCED_STORAGE_KEY,WORD_STORAGE_KEY,FOOD_KEY,null].includes(event.key)){
    refreshStoryScenes();
    if($("journal-dialog").open)renderMilestoneJournal();
  }
});
updateProgress();refreshStoryScenes();selectPlace("garden");
