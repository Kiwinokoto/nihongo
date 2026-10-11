// A common, deliberately honest, two-skill checkpoint for both basic kana scripts.
// Sound recognition can be checked objectively; handwriting cannot yet be scored.
// The checkpoint has no save key: it preserves the established recognition progress.
const shuffle=values=>{
  const a=[...values];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
  return a;
};
// Avoid revealing the answer in recognition immediately before asking for handwriting.
export function planKanaCheckpoint(items){
  const order=shuffle(items),length=order.length,tasks=[];
  for(let i=0;i<length;i++){
    tasks.push({type:"recognition",item:order[i]});
    tasks.push({type:"writing",item:order[(i+(length===3?2:Math.max(2,Math.floor(length/2))))%length]});
  }
  return tasks;
}
export function renderKanaCheckpoint(root,{items,script,speak,onRecognised}){
  const tasks=planKanaCheckpoint(items);
  let index=0,correct=0,writingYes=0,writingRetry=0,observer=null;
  let drawing=[],active=null,answered=false;
  const cleanup=()=>{observer?.disconnect();observer=null;active=null;};
  const $=selector=>root.querySelector(selector);
  const button=(selector,fn)=>$(selector).addEventListener("click",fn);
  function startNext(){
    cleanup();drawing=[];answered=false;
    if(index>=tasks.length){summary();return;}
    const {type,item}=tasks[index];
    const glyph=item.glyph,romaji=item.romaji;
    const label=type==="recognition"?"Recognise the sound":"Write from memory";
    const head=`<header class="checkpoint-heading">
      <span class="panel-kicker">CHECK YOURSELF · ${script==="hiragana"?"HIRAGANA":"KATAKANA"} · ${index+1}/${tasks.length}</span>
      <h3>${label}</h3>
      <p>Two skills, one gentle check. ${type==="writing"?"Handwriting is a self-check, not an automatic score.":"Choose the matching kana."}</p>
      <div class="checkpoint-rail"><span style="width:${Math.round(100*index/tasks.length)}%"></span></div>
      </header>`;
    if(type==="recognition"){
      const pool=shuffle(items.filter(k=>k.glyph!==glyph)).slice(0,3);
      const opts=shuffle([item,...pool]);
      root.innerHTML=head+`<div class="checkpoint-recognition">
        <div class="checkpoint-prompt"><p>Which kana sounds like <strong>“${romaji}”</strong>?</p>
          <button class="soft-button" id="checkpoint-listen" type="button">♫ Listen</button></div>
        <div><div class="checkpoint-choices" id="checkpoint-choices"></div>
          <p id="checkpoint-feedback" class="feedback" role="status"></p>
          <button class="primary" id="checkpoint-continue" hidden type="button">Continue →</button></div>
      </div>`;
      button("#checkpoint-listen",()=>speak(glyph,$("#checkpoint-feedback")));
      for(const choice of opts){
        const b=document.createElement("button");b.type="button";b.lang="ja";b.textContent=choice.glyph;
        b.setAttribute("aria-label",`${script} ${choice.glyph}`);
        b.addEventListener("click",()=>{
          if(answered)return;
          if(choice.glyph!==glyph){
            b.classList.add("wrong");$("#checkpoint-feedback").textContent="Try once more. No penalty.";
            return;
          }
          answered=true;correct++;onRecognised(glyph);
          b.classList.add("correct");
          $("#checkpoint-choices").querySelectorAll("button").forEach(el=>el.disabled=true);
          $("#checkpoint-feedback").textContent="Correct! A new sound for your collection. ✿";
          $("#checkpoint-continue").hidden=false;
        });
        $("#checkpoint-choices").append(b);
      }
      button("#checkpoint-continue",()=>{index++;startNext()});
    }else{
      root.innerHTML=head+`<div class="checkpoint-writing">
        <div><div class="checkpoint-paper" id="checkpoint-paper">
          <canvas id="checkpoint-canvas" aria-label="Draw the ${script} character for ${romaji} from memory using a mouse, pen or finger"></canvas>
        </div><div class="checkpoint-drawing-tools">
         <button class="soft-button" id="checkpoint-undo" type="button">↶ Undo</button>
         <button class="soft-button" id="checkpoint-clear" type="button">Clear</button>
        </div></div>
        <div class="checkpoint-prompt">
          <p>Draw <strong>“${romaji}”</strong> from memory.</p>
          <button class="soft-button" id="checkpoint-listen" type="button">♫ Listen</button>
          <p>Don't look at the model until you have tried. Then compare your own strokes.</p>
          <button class="primary" id="checkpoint-reveal" type="button" disabled>Compare with model ↗</button>
          <div id="checkpoint-model" class="checkpoint-model" hidden>
            <span class="panel-kicker">REFERENCE · SELF-CHECK</span>
            <strong lang="ja">${glyph}</strong>
            <p>Compare the shape and direction of your strokes. This site cannot grade writing yet.</p>
            <div class="checkpoint-rating">
              <button class="soft-button" id="checkpoint-yes" type="button">Looks close ✓</button>
              <button class="soft-button" id="checkpoint-retry" type="button">Needs more practice</button>
            </div>
          </div>
          <p id="checkpoint-feedback" class="feedback" role="status"></p>
        </div>
      </div>`;
      const canvas=$("#checkpoint-canvas");
      const coords=e=>{const r=canvas.getBoundingClientRect();return{
        x:Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),
        y:Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))
      }};
      const paint=()=>{
        const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;
        const dpr=Math.min(3,window.devicePixelRatio||1);
        canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);
        const ctx=canvas.getContext("2d");ctx.setTransform(dpr,0,0,dpr,0,0);
        ctx.strokeStyle="#336b5c";ctx.fillStyle="#336b5c";ctx.lineWidth=7;
        ctx.lineCap="round";ctx.lineJoin="round";
        for(const stroke of drawing){
          if(stroke.length<2)continue;
          ctx.beginPath();ctx.moveTo(stroke[0].x*r.width,stroke[0].y*r.height);
          for(const point of stroke.slice(1))ctx.lineTo(point.x*r.width,point.y*r.height);
          ctx.stroke();
        }
      };
      canvas.addEventListener("pointerdown",e=>{
        if(e.pointerType==="mouse"&&e.button!==0)return;
        e.preventDefault();canvas.setPointerCapture(e.pointerId);
        active=[coords(e)];drawing.push(active);paint();
      });
      canvas.addEventListener("pointermove",e=>{
        if(!active||!canvas.hasPointerCapture(e.pointerId))return;
        active.push(coords(e));paint();
      });
      canvas.addEventListener("pointerup",()=>{active=null;$("#checkpoint-reveal").disabled=!drawing.some(s=>s.length>1)});
      canvas.addEventListener("pointercancel",()=>{active=null;$("#checkpoint-reveal").disabled=!drawing.some(s=>s.length>1)});
      observer=new ResizeObserver(paint);observer.observe($("#checkpoint-paper"));paint();
      button("#checkpoint-listen",()=>speak(glyph,$("#checkpoint-feedback")));
      button("#checkpoint-undo",()=>{drawing.pop();paint();$("#checkpoint-reveal").disabled=!drawing.some(s=>s.length>1)});
      button("#checkpoint-clear",()=>{drawing=[];paint();$("#checkpoint-reveal").disabled=true});
      button("#checkpoint-reveal",()=>{
        if(!drawing.some(s=>s.length>1))return;
        $("#checkpoint-model").hidden=false;$("#checkpoint-reveal").hidden=true;
        // Only show stroke-order guidance AFTER the from-memory attempt.
        const guide=document.createElement("img");
        guide.className="checkpoint-stroke-guide";
        guide.src=`/assets/${script==="hiragana"?"strokes":"katakana-strokes"}/${glyph.codePointAt(0)}.svg`;
        guide.alt=`Animated ${script} stroke order for ${glyph}`;
        guide.lang="ja";
        $("#checkpoint-model").querySelector("strong").after(guide);
        $("#checkpoint-undo").disabled=true;$("#checkpoint-clear").disabled=true;
        canvas.style.pointerEvents="none";
      });
      button("#checkpoint-yes",()=>{writingYes++;index++;startNext()});
      button("#checkpoint-retry",()=>{writingRetry++;index++;startNext()});
    }
  }
  function summary(){
    root.innerHTML=`<div class="checkpoint-summary">
      <span aria-hidden="true" class="journal-symbol">✿</span>
      <span class="panel-kicker">CHECK COMPLETE</span>
      <h3>A little progress, every day.</h3>
      <p><strong>${correct}/${items.length}</strong> sounds recognised</p>
      <p><strong>${writingYes}/${items.length}</strong> writing attempts felt close; ${writingRetry} to practise again</p>
      <p>Recognition is checked. Writing is your own comparison, not an automatic assessment.</p>
      <button class="soft-button" id="checkpoint-restart" type="button">Try the row again ↗</button>
    </div>`;
    button("#checkpoint-restart",()=>{index=0;correct=0;writingYes=0;writingRetry=0;tasks.splice(0,tasks.length,...planKanaCheckpoint(items));startNext()});
  }
  startNext();
  return cleanup;
}
