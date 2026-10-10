// Kotoba no Tabi — intentionally dependency-free prototype.
// Learning achievements require recognition. Drawing is practice, never automatically graded.
const KANA = [
  ["あ","a"],["い","i"],["う","u"],["え","e"],["お","o"],
  ["か","ka"],["き","ki"],["く","ku"],["け","ke"],["こ","ko"],
  ["さ","sa"],["し","shi"],["す","su"],["せ","se"],["そ","so"],
  ["た","ta"],["ち","chi"],["つ","tsu"],["て","te"],["と","to"],
  ["な","na"],["に","ni"],["ぬ","nu"],["ね","ne"],["の","no"],
  ["は","ha"],["ひ","hi"],["ふ","fu"],["へ","he"],["ほ","ho"],
  ["ま","ma"],["み","mi"],["む","mu"],["め","me"],["も","mo"],
  ["や","ya"],["ゆ","yu"],["よ","yo"],["ら","ra"],["り","ri"],
  ["る","ru"],["れ","re"],["ろ","ro"],["わ","wa"],["を","wo"],["ん","n"]
];
const STARTER = KANA.slice(0,5);
const STORAGE_KEY = "kotoba-no-tabi.progress.v1";
const $ = (id) => document.getElementById(id);
const safeList = (value) => Array.isArray(value) ? [...new Set(value.filter(v => typeof v === "string" && STARTER.some(([k]) => k === v)))] : [];
function loadProgress() {
  try {
    const data=JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {mastered:safeList(data.mastered),traced:safeList(data.traced)};
  } catch { return {mastered:[],traced:[]}; }
}
const progress=loadProgress();
let selected=0, tab="discover", answered=false, strokes=[], activeStroke=null;
function saveProgress() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }
  catch { showFeedback("Progress could not be saved. Check browser storage settings."); }
  updateProgress();
}
function updateProgress() {
  const count=progress.mastered.length;
  $("header-progress").textContent=`${count}/5`;
  $("overview-progress").textContent=`${count} of 5 sounds collected`;
  $("lesson-count").textContent=`${count} / 5 collected`;
  $("progress-fill").style.width=`${count*20}%`;
}
const PLACES={
  start:{n:"WELCOME · YOUR JOURNEY BEGINS",emoji:"🏡",title:"The starting village",jp:"はじまりの村",description:"Every adventure begins with a small hello. Take the first path towards the blossoms and meet your first five sounds.",fact:"Your first steps",status:"READY",button:"Let's begin"},
  garden:{n:"STOP 01 · YOUR FIRST ADVENTURE",emoji:"🌸",title:"The hiragana garden",jp:"ひらがなの庭",description:"Five little sounds are waiting among the blossoms. Listen, recognise and draw each one.",fact:"5 sounds to discover",status:"READY",button:"Enter the garden"},
  tea:{n:"A LITTLE FURTHER · SOON",emoji:"🍵",title:"The tea house",jp:"おちゃや",description:"Warm tea, delicious wagashi and little everyday conversations. This stop is being prepared.",fact:"Speaking & listening",status:"COMING SOON",button:"The tea house is not ready yet"},
  shrine:{n:"BEYOND THE FOREST · SOON",emoji:"⛩️",title:"The kanji shrine",jp:"かんじの神社",description:"Learn meaningful characters among quiet trees and lanterns. This stop is being prepared.",fact:"Meaning & writing",status:"COMING SOON",button:"The shrine is not ready yet"},
  train:{n:"THE NEXT JOURNEY · SOON",emoji:"🚃",title:"Katakana station",jp:"カタカナのえき",description:"Catch a little train towards the world of katakana. This stop is being prepared.",fact:"A new alphabet",status:"COMING SOON",button:"The station is not ready yet"}
};
let place="garden";
function selectPlace(id) {
  if (!(id in PLACES)) return;
  place=id; const p=PLACES[id];
  $("place-number").textContent=p.n; $("place-emoji").textContent=p.emoji;
  $("place-title").textContent=p.title; $("place-japanese").textContent=p.jp;
  $("place-description").textContent=p.description;
  $("place-fact").textContent="✦ "+p.fact; $("place-status").textContent=p.status;
  $("place-status").className=p.status==="READY"?"available":"locked-status";
  $("place-action").disabled=p.status!=="READY";
  $("place-action").textContent=p.button+(p.status==="READY"?" ↗":"");
  document.querySelectorAll("[data-place]").forEach(b=>{
    b.classList.toggle("current",b.dataset.place===id);
    b.setAttribute("aria-pressed",String(b.dataset.place===id));
  });
}
function openLesson(){selectTab("discover");$("lesson-dialog").showModal();}
function openJournal(){
  $("journal-description").textContent=progress.mastered.length
    ? `You've collected ${progress.mastered.length} little sound${progress.mastered.length===1?"":"s"}. What a lovely start!`
    : "Your first five hiragana are waiting. Every discovery counts.";
  $("journal-cards").replaceChildren(...STARTER.map(([glyph,romaji])=>{
    const cell=document.createElement("span");cell.className=progress.mastered.includes(glyph)?"earned":"";
    cell.textContent=glyph;const note=document.createElement("small");
    note.textContent=progress.mastered.includes(glyph)?"✓ collected":romaji;
    cell.append(note);return cell;
  }));
  $("journal-dialog").showModal();
}
function speakJapanese(text) {
  const feedback=$("audio-feedback");
  if (!("speechSynthesis" in window)) { feedback.textContent="Japanese audio isn't available in this browser.";return; }
  const voices=speechSynthesis.getVoices();
  const voice=voices.find(v=>v.lang?.toLowerCase().startsWith("ja"));
  if(!voice){ feedback.textContent="Japanese voice not installed on this device. You can still practise reading and tracing.";return; }
  speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance(text);
  utterance.lang="ja-JP";utterance.voice=voice;utterance.rate=.75;
  utterance.onerror=()=>{feedback.textContent="Couldn't play the Japanese voice this time.";};
  speechSynthesis.speak(utterance); feedback.textContent="Listening…";
}
function showFeedback(message){const out=$("panel-feedback");if(out)out.textContent=message;}
function renderPicker(){
  const picker=$("kana-picker"); picker.replaceChildren();
  STARTER.forEach(([glyph,roman],i)=>{
    const b=document.createElement("button");b.type="button";
    b.className=i===selected?"active":"";
    b.setAttribute("aria-pressed",String(i===selected));
    b.innerHTML=`<strong>${glyph}</strong><small>${roman}${progress.mastered.includes(glyph)?" ✓":""}</small>`;
    b.addEventListener("click",()=>{selected=i;answered=false;strokes=[];renderLesson();});
    picker.append(b);
  });
}
function selectTab(next) {
  tab=next;answered=false;strokes=[];
  document.querySelectorAll(".lesson-tabs [role=tab]").forEach(b=>{
    b.setAttribute("aria-selected",String(b.dataset.tab===tab));
    b.tabIndex=b.dataset.tab===tab?0:-1;
  });
  renderLesson();
}
function renderLesson(){
  renderPicker();
  const [glyph,roman]=STARTER[selected];
  const panel=$("lesson-panel");
  if(tab==="discover"){
    panel.innerHTML=`<div class="discover-panel">
      <div class="big-kana" lang="ja">${glyph}</div>
      <div class="panel-copy"><span class="panel-kicker">MEET A NEW FRIEND · ${selected+1} OF 5</span>
      <h3>This is <em>${roman}</em>.</h3>
      <p>Say it gently: <strong>${roman}</strong>. Look at its shape and listen whenever you like. Then try drawing it yourself.</p>
      <div class="actions-row"><button class="soft-button" id="hear-sound">♫ Hear the sound</button>
      <button class="primary" id="next-to-trace">Let's draw ↗</button></div>
      <p class="feedback" id="audio-feedback" role="status"></p></div></div>`;
    $("hear-sound").addEventListener("click",()=>speakJapanese(glyph));
    $("next-to-trace").addEventListener("click",()=>selectTab("trace"));
  } else if(tab==="trace"){
    panel.innerHTML=`<div class="trace-layout">
      <div><div class="trace-box" id="trace-box"><div class="trace-ghost" id="trace-ghost" lang="ja">${glyph}</div>
        <canvas id="trace-canvas" aria-label="Draw the Japanese character ${glyph} using your mouse, finger or pen"></canvas></div>
        <div class="trace-controls"><button class="soft-button" id="undo-stroke">↶ Undo</button>
        <button class="soft-button" id="clear-strokes">Clear</button><button class="soft-button" id="toggle-guide">Hide guide</button></div></div>
      <div class="panel-copy"><span class="panel-kicker">AN INK-BRUSH MOMENT</span><h3>Trace <span lang="ja">${glyph}</span> with care.</h3>
      <p>Follow the pale shape with your finger, stylus or mouse. This is a gentle drawing exercise, not an automatic handwriting assessment.</p>
      <div class="actions-row"><button class="primary" id="save-trace">I've practised this ↗</button></div>
      <p class="feedback" id="panel-feedback" role="status">${progress.traced.includes(glyph)?"You've practised this one before.":""}</p></div></div>`;
    setupCanvas();
    $("undo-stroke").addEventListener("click",()=>{strokes.pop();redraw();});
    $("clear-strokes").addEventListener("click",()=>{strokes=[];redraw();});
    $("toggle-guide").addEventListener("click",()=>{
      const ghost=$("trace-ghost");ghost.hidden=!ghost.hidden;
      $("toggle-guide").textContent=ghost.hidden?"Show guide":"Hide guide";
    });
    $("save-trace").addEventListener("click",()=>{
      if(!strokes.some(s=>s.length>1)){showFeedback("Draw at least one stroke first — there's no rush.");return;}
      if(!progress.traced.includes(glyph))progress.traced.push(glyph);
      saveProgress();showFeedback("Lovely practice! You can now test your recognition.");
      $("save-trace").textContent="Practised ✓";
      const btn=document.createElement("button");btn.className="soft-button";btn.textContent="Try a little quiz →";
      btn.addEventListener("click",()=>selectTab("practice"));
      $("save-trace").after(btn);
    });
  } else if(tab==="practice"){renderPractice(glyph,roman);}
  else {renderCollection();}
}
function renderPractice(glyph,roman){
  const panel=$("lesson-panel");
  const pool=STARTER.filter(([g])=>g!==glyph).map(([g])=>g);
  const options=[glyph,...pool.sort(()=>Math.random()-.5).slice(0,3)].sort(()=>Math.random()-.5);
  panel.innerHTML=`<div class="practice-panel">
    <div class="panel-copy"><span class="panel-kicker">A TINY CHALLENGE</span>
    <h3>Which character sounds like <em>“${roman}”</em>?</h3>
    <p>Choose the right hiragana. Mistakes are just part of the journey.</p>
    <div class="actions-row"><button class="soft-button" id="hear-practice">♫ Listen</button></div>
    <p class="feedback" id="audio-feedback" role="status"></p></div>
    <div><div class="choices" id="practice-choices"></div><p class="feedback" id="panel-feedback" role="status"></p>
    <button class="soft-button" id="next-sound" hidden>Next little sound →</button></div></div>`;
  $("hear-practice").addEventListener("click",()=>speakJapanese(glyph));
  for(const option of options){
    const b=document.createElement("button");b.type="button";b.textContent=option;
    b.lang="ja";b.setAttribute("aria-label",`Hiragana ${option}`);
    b.addEventListener("click",()=>{
      if(answered)return;
      if(option!==glyph){
        b.classList.add("wrong");showFeedback("Not quite. Try another one — you can do it.");return;
      }
      answered=true;b.classList.add("correct");
      document.querySelectorAll(".choices button").forEach(x=>x.disabled=true);
      if(!progress.mastered.includes(glyph)){progress.mastered.push(glyph);saveProgress();}
      showFeedback("Beautiful! ✿ You've collected this sound.");
      $("next-sound").hidden=false;
    });
    $("practice-choices").append(b);
  }
  $("next-sound").addEventListener("click",()=>{selected=(selected+1)%5;answered=false;renderLesson();});
}
function renderCollection(){
  const panel=$("lesson-panel");
  panel.innerHTML=`<p class="collection-help">Your complete hiragana chart: the first five are ready to practise. The remaining sounds will arrive in a future chapter.</p><div class="collection-grid" id="collection-grid"></div>`;
  KANA.forEach(([glyph,roman],i)=>{
    const cell=document.createElement("button");cell.type="button";cell.disabled=i>=5;
    cell.innerHTML=`<strong>${glyph}</strong><small>${i<5?(progress.mastered.includes(glyph)?"✓ collected":roman):"soon"}</small>`;
    cell.addEventListener("click",()=>{selected=i;selectTab("discover");});
    $("collection-grid").append(cell);
  });
}
function setupCanvas(){
  const canvas=$("trace-canvas"), box=$("trace-box");
  // Coordinates are normalised so changing zoom or device pixel ratio keeps the strokes.
  const point=event=>{
    const r=canvas.getBoundingClientRect();
    return {x:Math.max(0,Math.min(1,(event.clientX-r.left)/r.width)),
            y:Math.max(0,Math.min(1,(event.clientY-r.top)/r.height))};
  };
  canvas.addEventListener("pointerdown",event=>{
    if(event.button!==0 && event.pointerType==="mouse")return;
    event.preventDefault();canvas.setPointerCapture(event.pointerId);
    activeStroke=[point(event)];strokes.push(activeStroke);redraw();
  });
  canvas.addEventListener("pointermove",event=>{
    if(!activeStroke)return;
    activeStroke.push(point(event));redraw();
  });
  const stop=()=>{activeStroke=null;};
  canvas.addEventListener("pointerup",stop);
  canvas.addEventListener("pointercancel",stop);
  const resize=()=>redraw();
  const observer=new ResizeObserver(resize);observer.observe(box);
  $("lesson-dialog").addEventListener("close",()=>observer.disconnect(),{once:true});
  redraw();
}
function redraw(){
  const canvas=$("trace-canvas");if(!canvas)return;
  const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;
  const dpr=Math.min(3,window.devicePixelRatio||1);
  canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);
  const ctx=canvas.getContext("2d");ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.strokeStyle="#346d5c";ctx.fillStyle="#346d5c";ctx.lineWidth=7;
  ctx.lineJoin="round";ctx.lineCap="round";
  for(const stroke of strokes){
    if(!stroke.length)continue;
    ctx.beginPath();ctx.moveTo(stroke[0].x*rect.width,stroke[0].y*rect.height);
    if(stroke.length===1){ctx.arc(stroke[0].x*rect.width,stroke[0].y*rect.height,3,0,Math.PI*2);ctx.fill();continue;}
    for(const pt of stroke.slice(1))ctx.lineTo(pt.x*rect.width,pt.y*rect.height);
    ctx.stroke();
  }
}
document.querySelectorAll("[data-place]").forEach(b=>b.addEventListener("click",()=>selectPlace(b.dataset.place)));
$("place-action").addEventListener("click",()=>{if(place==="start"||place==="garden")openLesson();});
$("start-journey").addEventListener("click",()=>{selectPlace("garden");openLesson();});
$("open-journal").addEventListener("click",openJournal);
$("close-lesson").addEventListener("click",()=>$("lesson-dialog").close());
$("close-journal").addEventListener("click",()=>$("journal-dialog").close());
$("journal-garden").addEventListener("click",()=>{$("journal-dialog").close();openLesson();});
document.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>selectTab(b.dataset.tab)));
document.querySelectorAll(".lesson-tabs [role=tab]").forEach((b,i,all)=>b.addEventListener("keydown",e=>{
  if(e.key!=="ArrowLeft" && e.key!=="ArrowRight")return;
  e.preventDefault();const next=all[(i+(e.key==="ArrowRight"?1:all.length-1))%all.length];
  selectTab(next.dataset.tab);next.focus();
}));
$("lesson-dialog").addEventListener("close",()=>{if("speechSynthesis" in window)speechSynthesis.cancel();});
window.addEventListener("storage",event=>{if(event.key===STORAGE_KEY){Object.assign(progress,loadProgress());updateProgress();}});
updateProgress();selectPlace("garden");
