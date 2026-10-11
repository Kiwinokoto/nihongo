// The katakana train: separate from hiragana and optional for every learner.
// Drawing is ungraded motor practice; only recognition collects a character.
import {KATA,KATA_ROWS,KATA_STORAGE_KEY,readKata,kataRowOpen,kataCurrentRow,kataDue,traceKata,correctKata,incorrectKata} from "./katakana-progress.js";
import {renderKanaCheckpoint} from "./kana-checkpoint.js";
import {renderKatakanaWords} from "./katakana-words.js";

export function renderKatakanaStation(root,speakJapanese,onAdvanced=()=>{}){
  function load(){try{return readKata(localStorage.getItem(KATA_STORAGE_KEY))}catch{return readKata(null)}}
  const progress=load();
  const store=(feedback)=>{
    try{localStorage.setItem(KATA_STORAGE_KEY,JSON.stringify(progress));return true}
    catch{feedback.textContent="This browser couldn't save your katakana progress.";return false}
  };
  const completed=(i)=>[...KATA_ROWS[i].kana].filter(c=>progress.mastered.includes(c)).length;
  let row=kataCurrentRow(progress),item=KATA.find(k=>k.row===row&&!progress.mastered.includes(k.glyph))||KATA.find(k=>k.row===row);
  let mode="discover",hasAnswered=false,strokes=[],stroke=null,observer=null;
  let checkpointCleanup=null;
  root.innerHTML=`<section class="kata-station">
    <div class="kata-banner">
      <img class="kata-banner-scene" src="/assets/art/katakana-platform.svg" alt="A nostalgic train at a lantern-lit mountain station, with cherry blossoms and two travellers" width="1400" height="460">
      <div class="kata-banner-copy"><span class="kata-emoji" aria-hidden="true">🚃</span><div>
      <span class="panel-kicker">THE KATAKANA STATION · カタカナ</span>
      <h3>Another beautiful set of sounds.</h3>
      <p>The same sounds as hiragana, dressed in different shapes. First listen and draw; then try a separate sound and writing check.</p></div></div>
    </div>
    <div class="kata-advanced-invite">
      <span>Meet the tiny marks, voiced sounds, and borrowed words beyond the first 46.</span>
      <div class="kata-extra-actions"><button type="button" id="open-katakana-words" class="soft-button">Words around town ↗</button>
      <button type="button" id="open-katakana-advanced" class="soft-button">Beyond the basics ✧</button></div>
    </div>
    <div class="kata-topline"><div><span id="kata-row-index" class="panel-kicker"></span><h4 id="kata-row-title"></h4><p id="kata-row-subtitle"></p></div>
      <div class="kata-controls"><span id="kata-progress"></span><button class="soft-button" id="kata-prev-row" aria-label="Previous katakana row">←</button>
      <button class="soft-button" id="kata-next-row" aria-label="Next unlocked katakana row">→</button></div>
    </div>
    <div class="kata-modes" aria-label="Katakana learning and checking">
      <div class="kana-mode-group"><span class="kana-mode-label">LEARN & PRACTISE</span>
        <button type="button" data-kata-mode="discover" aria-pressed="true">Discover</button>
        <button type="button" data-kata-mode="trace" aria-pressed="false">Draw</button></div>
      <div class="kana-mode-group"><span class="kana-mode-label">CHECK YOURSELF</span>
        <button type="button" data-kata-mode="checkpoint" aria-pressed="false">Sound + writing check</button>
        <button type="button" data-kata-mode="quiz" aria-pressed="false">Recognise one</button></div>
      <div class="kana-mode-group"><span class="kana-mode-label">YOUR PROGRESS</span>
        <button type="button" data-kata-mode="review" aria-pressed="false">Review</button>
        <button type="button" data-kata-mode="chart" aria-pressed="false">My collection</button></div>
    </div>
    <div class="kata-picker" id="kata-picker"></div>
    <div class="kata-content" id="kata-content"></div>
    <p class="kata-note">Practice is never graded. Only correctly recognising a shape collects it. Your hiragana and food progress stay untouched.</p>
  </section>`;
  const panel=root.querySelector("#kata-content");
  const picker=root.querySelector("#kata-picker");
  const button=(selector,handler)=>root.querySelector(selector).addEventListener("click",handler);
  const jvoice=(value)=>{
    const target=panel.querySelector(".kata-audio");
    speakJapanese(value,target);
  };
  function destroyCanvas(){if(observer){observer.disconnect();observer=null}stroke=null}
  function showMode(next){
    checkpointCleanup?.();checkpointCleanup=null;
    destroyCanvas();mode=next;hasAnswered=false;strokes=[];
    root.querySelectorAll("[data-kata-mode]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.kataMode===next)));
    render();
  }
  function setRow(i){
    if(!kataRowOpen(progress,i))return;
    row=i;item=KATA.find(k=>k.row===i&&!progress.mastered.includes(k.glyph))||KATA.find(k=>k.row===i);
    checkpointCleanup?.();checkpointCleanup=null;
    destroyCanvas();strokes=[];hasAnswered=false;render();
  }
  function overview(){
    const r=KATA_ROWS[row];
    root.querySelector("#kata-row-index").textContent=`ROW ${row+1} OF ${KATA_ROWS.length}`;
    root.querySelector("#kata-row-title").textContent=r.title;
    root.querySelector("#kata-row-subtitle").textContent=r.subtitle;
    root.querySelector("#kata-progress").textContent=`${progress.mastered.length}/46 collected`;
    root.querySelector("#kata-prev-row").disabled=row===0;
    root.querySelector("#kata-next-row").disabled=!kataRowOpen(progress,row+1);
    picker.replaceChildren();
    for(const k of KATA.filter(k=>k.row===row)){
      const b=document.createElement("button");b.type="button";b.className="kata-picker-cell";
      b.setAttribute("aria-pressed",String(k.glyph===item.glyph));
      b.innerHTML=`<strong lang="ja">${k.glyph}</strong><small>${k.romaji}${progress.mastered.includes(k.glyph)?" ✓":""}</small>`;
      b.addEventListener("click",()=>{item=k;showMode(mode==="chart"||mode==="review"?"discover":mode)});
      picker.append(b);
    }
    picker.hidden=["chart","review","checkpoint","words"].includes(mode);
    root.querySelector(".kata-topline").hidden=["chart","review","words"].includes(mode);
  }
  const guide=k=>`<img src="/assets/katakana-strokes/${k.glyph.codePointAt(0)}.svg" alt="Animated stroke order for ${k.glyph}" class="kata-guide" lang="ja" width="180" height="180">`;
  function redraw(){
    const canvas=panel.querySelector("#kata-canvas");if(!canvas)return;
    const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;
    const dpr=Math.min(window.devicePixelRatio||1,3);
    canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);
    const ctx=canvas.getContext("2d");ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.strokeStyle="#376e63";ctx.fillStyle="#376e63";ctx.lineWidth=7;ctx.lineCap="round";ctx.lineJoin="round";
    for(const points of strokes){
      if(points.length===0)continue;
      ctx.beginPath();ctx.moveTo(points[0].x*r.width,points[0].y*r.height);
      if(points.length===1){ctx.arc(points[0].x*r.width,points[0].y*r.height,3,0,Math.PI*2);ctx.fill();continue;}
      for(const p of points.slice(1))ctx.lineTo(p.x*r.width,p.y*r.height);
      ctx.stroke();
    }
  }
  function setupCanvas(){
    const canvas=panel.querySelector("#kata-canvas"),box=panel.querySelector(".kata-drawing");
    const xy=e=>{const r=canvas.getBoundingClientRect();return {
      x:Math.min(1,Math.max(0,(e.clientX-r.left)/r.width)),
      y:Math.min(1,Math.max(0,(e.clientY-r.top)/r.height))
    }};
    canvas.addEventListener("pointerdown",e=>{
      if(e.pointerType==="mouse"&&e.button!==0)return;
      e.preventDefault();canvas.setPointerCapture(e.pointerId);
      stroke=[xy(e)];strokes.push(stroke);redraw();
    });
    canvas.addEventListener("pointermove",e=>{if(stroke&&canvas.hasPointerCapture(e.pointerId)){stroke.push(xy(e));redraw()}});
    canvas.addEventListener("pointerup",()=>stroke=null);
    canvas.addEventListener("pointercancel",()=>stroke=null);
    observer=new ResizeObserver(redraw);observer.observe(box);redraw();
  }
  function shuffle(values){
    const a=[...values];
    for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
    return a;
  }
  function quiz(target,revision=false){
    const candidates=KATA.filter(k=>k.glyph!==target.glyph && k.row<=row);
    if(candidates.length<3)candidates.push(...KATA.filter(k=>k.glyph!==target.glyph));
    const others=shuffle([...new Set(candidates.map(k=>k.glyph))]).slice(0,3);
    const options=shuffle([target.glyph,...others]);
    panel.innerHTML=`<div class="kata-quiz">
      <div><span class="panel-kicker">${revision?"A GENTLE REVISIT":"A TINY CHALLENGE"}</span>
        <h4>Which character sounds like <em>“${target.romaji}”</em>?</h4>
        <p>Take your time. A mistake is only another chance to learn.</p>
        <button type="button" class="soft-button" id="kata-hear">♫ Listen</button>
        <p class="feedback kata-audio" role="status"></p></div>
      <div><div class="kata-choices" id="kata-choices"></div>
       <p id="kata-feedback" class="feedback" role="status"></p>
       <button type="button" id="kata-continue" class="primary" hidden>Next discovery →</button></div>
    </div>`;
    button("#kata-hear",()=>jvoice(target.glyph));
    const feedback=panel.querySelector("#kata-feedback");
    for(const ch of options){
      const b=document.createElement("button");b.type="button";b.textContent=ch;b.lang="ja";
      b.setAttribute("aria-label",`Katakana ${ch}`);
      b.addEventListener("click",()=>{
        if(hasAnswered)return;
        if(ch!==target.glyph){
          b.classList.add("wrong");incorrectKata(progress,target.glyph);store(feedback);
          feedback.textContent="Not quite! Try looking at the shape again.";return;
        }
        const previous=[...Array(KATA_ROWS.length)].map((_,i)=>kataRowOpen(progress,i));
        hasAnswered=true;
        correctKata(progress,target.glyph);
        if(!store(feedback)){hasAnswered=false;return;}
        b.classList.add("correct");
        panel.querySelectorAll(".kata-choices button").forEach(x=>x.disabled=true);
        overview();
        const unlocked=KATA_ROWS.findIndex((_,i)=>!previous[i]&&kataRowOpen(progress,i));
        feedback.textContent=unlocked>=0?`A new row is ready: ${KATA_ROWS[unlocked].title}! ✿`:"Beautiful — a new katakana for your collection! ✿";
        panel.querySelector("#kata-continue").hidden=false;
      });
      panel.querySelector("#kata-choices").append(b);
    }
    button("#kata-continue",()=>{
      if(revision){showMode("review");return;}
      const next=[...KATA_ROWS[row].kana].find(c=>!progress.mastered.includes(c));
      if(next){item=KATA.find(k=>k.glyph===next);}
      else if(kataRowOpen(progress,row+1)){row++;item=KATA.find(k=>k.row===row);}
      else{showMode("chart");return;}
      showMode("discover");
    });
  }
  function render(){
    overview();
    if(mode==="discover"){
      panel.innerHTML=`<div class="kata-discover">
        <div class="kata-guide-frame">${guide(item)}<button type="button" class="soft-button" id="kata-replay">↻ Replay strokes</button></div>
        <div class="kata-copy"><span class="panel-kicker">MEET A KATAKANA · ${item.romaji.toUpperCase()}</span>
          <h4><span lang="ja">${item.glyph}</span> · <em>${item.romaji}</em></h4>
          <p>Katakana often appears in loanwords and names. Watch the animated brush, listen to the sound, then make your own marks.</p>
          <div class="kata-actions"><button type="button" class="soft-button" id="kata-listen">♫ Hear this sound</button>
          <button type="button" class="primary" id="kata-to-trace">Let's draw ↗</button></div>
          <p class="feedback kata-audio" role="status"></p></div>
      </div>`;
      button("#kata-replay",()=>{const img=panel.querySelector(".kata-guide");img.replaceWith(img.cloneNode())});
      button("#kata-listen",()=>jvoice(item.glyph));
      button("#kata-to-trace",()=>showMode("trace"));
    }else if(mode==="trace"){
      panel.innerHTML=`<div class="kata-trace-layout">
        <div><div class="kata-drawing"><span id="kata-ghost" lang="ja">${item.glyph}</span>
          <canvas id="kata-canvas" aria-label="Draw katakana ${item.glyph} with your finger, pen or mouse"></canvas></div>
          <div class="kata-trace-buttons"><button class="soft-button" id="kata-undo">↶ Undo</button>
          <button class="soft-button" id="kata-clear">Clear</button>
          <button class="soft-button" id="kata-toggle">Hide guide</button></div></div>
        <div class="kata-copy"><span class="panel-kicker">TRY THE BRUSH YOURSELF</span><h4>Trace <span lang="ja">${item.glyph}</span>.</h4>
          <div class="kata-small-guide">${guide(item)}<button class="soft-button" id="kata-replay">↻ Replay</button></div>
          <p>Follow the pale letter. We don't grade your drawing or automatically check your stroke order.</p>
          <div class="kata-actions"><button class="primary" id="kata-practised">I've practised this ↗</button>
           <button class="soft-button" id="kata-next-shape">Next shape →</button>
           <button class="soft-button" id="kata-to-quiz">Go to checking →</button></div>
          <p class="feedback" id="kata-feedback" role="status"></p></div>
      </div>`;
      setupCanvas();
      button("#kata-replay",()=>{const img=panel.querySelector(".kata-guide");img.replaceWith(img.cloneNode())});
      button("#kata-undo",()=>{strokes.pop();redraw()});
      button("#kata-clear",()=>{strokes=[];redraw()});
      button("#kata-toggle",()=>{
        const el=panel.querySelector("#kata-ghost");el.hidden=!el.hidden;
        panel.querySelector("#kata-toggle").textContent=el.hidden?"Show guide":"Hide guide";
      });
      button("#kata-practised",()=>{
        const feedback=panel.querySelector("#kata-feedback");
        if(!strokes.some(s=>s.length>1)){feedback.textContent="Draw at least one line first. No rush.";return;}
        traceKata(progress,item.glyph);
        if(store(feedback)){
          feedback.textContent="Drawing saved. This isn't a handwriting grade. Continue learning or choose the separate check.";
          panel.querySelector("#kata-practised").textContent="Saved ✓";
          panel.querySelector("#kata-practised").disabled=true;
        }
      });
      button("#kata-to-quiz",()=>showMode("checkpoint"));
      button("#kata-next-shape",()=>{
        const following=KATA.find(k=>k.row===row && KATA.indexOf(k)>KATA.indexOf(item));
        if(following)item=following;
        else if(kataRowOpen(progress,row+1)){row++;item=KATA.find(k=>k.row===row);}
        showMode("discover");
      });
    }else if(mode==="checkpoint"){
      checkpointCleanup=renderKanaCheckpoint(panel,{
        items:KATA.filter(k=>k.row===row),script:"katakana",
        speak:speakJapanese,
        onRecognised:glyph=>{
          correctKata(progress,glyph);
          const feedback=panel.querySelector("#checkpoint-feedback");
          store(feedback);overview();
        }
      });
    }else if(mode==="quiz"){quiz(item);}
    else if(mode==="words"){renderKatakanaWords(panel,speakJapanese,()=>showMode("discover"));}
    else if(mode==="review"){
      const due=kataDue(progress);
      panel.innerHTML=`<div class="kata-reviews"><h4>${due.length?"A few sounds are ready for review.":"You're all caught up!"}</h4>
       <p>Collected sounds return after 1, 3, 7, 14 or 30 days. You can return any time.</p>
       <div id="kata-review-list" class="kata-review-list"></div><button class="soft-button" id="kata-back">Back to discovering →</button></div>`;
      const box=panel.querySelector("#kata-review-list");
      for(const glyph of due){
        const k=KATA.find(x=>x.glyph===glyph);
        const b=document.createElement("button");b.type="button";b.textContent=`${glyph} · ${k.romaji}`;
        b.className="soft-button";b.addEventListener("click",()=>{row=k.row;item=k;hasAnswered=false;overview();quiz(k,true)});
        box.append(b);
      }
      button("#kata-back",()=>showMode("discover"));
    }else{
      panel.innerHTML=`<div class="kata-chart"><h4>My katakana collection</h4><p>Collect every character in a row to unlock the next.</p>
      <div id="kata-chart-rows"></div></div>`;
      const chart=panel.querySelector("#kata-chart-rows");
      KATA_ROWS.forEach((r,i)=>{
        const open=kataRowOpen(progress,i),section=document.createElement("section");
        section.className="kata-chart-section";
        section.innerHTML=`<div><strong>${i+1}. ${r.title}</strong><small>${open?completed(i)+"/"+[...r.kana].length+" collected":"🔒 Locked"}</small></div><div class="kata-chart-cells"></div>`;
        for(const c of r.kana){
          const b=document.createElement("button");b.type="button";b.disabled=!open;
          b.innerHTML=`<strong lang="ja">${open?c:"·"}</strong><small>${progress.mastered.includes(c)?"✓":open?KATA.find(k=>k.glyph===c).romaji:"soon"}</small>`;
          b.addEventListener("click",()=>{row=i;item=KATA.find(k=>k.glyph===c);showMode("discover")});
          section.querySelector(".kata-chart-cells").append(b);
        }
        chart.append(section);
      });
    }
  }
  button("#open-katakana-advanced",onAdvanced);
  button("#open-katakana-words",()=>showMode("words"));
  button("#kata-prev-row",()=>setRow(row-1));
  button("#kata-next-row",()=>setRow(row+1));
  root.querySelectorAll("[data-kata-mode]").forEach(b=>b.addEventListener("click",()=>showMode(b.dataset.kataMode)));
  render();
  // Return a cleanup callback for the parent modal; avoid lingering observers.
  return ()=>{checkpointCleanup?.();destroyCanvas()};
}
