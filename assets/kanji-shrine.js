// Forest shrine: contextual reading, reveal and retriable meanings only.
// No persistent state. A listening button requests the existing JA speech helper.
import {SHRINE_KANJI,shrineChoices} from "./kanji-shrine-data.js";
export function renderKanjiShrine(root,speakJapanese){
 let index=0;
 const completed=new Set();
 const $=sel=>root.querySelector(sel);
 root.innerHTML=`<section class="shrine-walk">
   <div class="shrine-scene">
     <img src="/assets/art/kanji-shrine.webp" alt="Sunlight and cherry blossoms illuminate a forest shrine path, vermilion torii gates, mossy lanterns and a waterfall; two travellers walk toward the shrine" width="1619" height="971">
     <div class="shrine-scene-caption"><span class="panel-kicker">THE KANJI SHRINE · 漢字の神社</span><h3>Eight signs along the forest path.</h3><p>Words first. Meanings in context. No rush, no prerequisites.</p></div>
   </div>
   <nav class="shrine-path" aria-label="Choose a kanji along the shrine path"></nav>
   <div id="shrine-lesson" class="shrine-lesson"></div>
   <p class="shrine-footnote">A gentle reading walk, not a proficiency certificate. Your kana collection and memories remain untouched.</p>
 </section>`;
 const nav=$(".shrine-path"),lesson=$("#shrine-lesson");
 const buttons=[];
 SHRINE_KANJI.forEach((entry,i)=>{
  const b=document.createElement("button");b.type="button";b.dataset.shrineIndex=String(i);
  b.setAttribute("aria-label",`Visit kanji ${entry.kanji}: ${entry.word}`);
  b.innerHTML=`<strong lang="ja">${entry.kanji}</strong><small>${completed.has(i)?"✿":"0"+(i+1)}</small>`;
  b.addEventListener("click",()=>{index=i;renderLesson()});
  nav.append(b);buttons.push(b);
 });
 function renderLesson(){
  const entry=SHRINE_KANJI[index],options=shrineChoices(entry);
  let answered=false;
  buttons.forEach((b,i)=>{b.setAttribute("aria-pressed",String(i===index));b.querySelector("small").textContent=completed.has(i)?"✿":String(i+1).padStart(2,"0")});
  lesson.innerHTML=`<div class="shrine-lesson-head"><div>
    <span class="panel-kicker">GATE ${index+1} OF ${SHRINE_KANJI.length} · ${completed.size} EXPLORED</span>
    <p class="shrine-context">${entry.context}</p></div>
    <span class="shrine-glyph" lang="ja">${entry.kanji}</span></div>
    <div class="shrine-phrase"><strong lang="ja">${entry.word}</strong>
      <button type="button" class="soft-button" id="shrine-reveal">Show reading & meaning</button>
      <div id="shrine-revealed" hidden><p lang="ja">${entry.reading}</p><p>${entry.romaji} · <b>${entry.meaning}</b></p></div>
    </div>
    <div class="shrine-example"><span class="panel-kicker">A LITTLE SCENE</span>
      <p lang="ja">${entry.sentence}</p>
      <button type="button" class="soft-button" id="shrine-example-reveal">Show the sentence reading</button>
      <div id="shrine-example-revealed" hidden><p lang="ja">${entry.sentenceReading}</p><p>${entry.sentenceMeaning}</p></div>
      <div class="shrine-audio"><button type="button" class="soft-button" id="shrine-hear">♫ Hear the Japanese sentence</button><p id="shrine-audio-status" class="feedback" role="status"></p></div>
    </div>
    <div class="shrine-check"><strong>In this scene, what does <span lang="ja">${entry.word}</span> mean?</strong>
      <div class="shrine-choices" id="shrine-choices"></div><p id="shrine-feedback" class="feedback" role="status"></p>
    </div>
    <div class="shrine-actions"><button type="button" id="shrine-next" class="primary" hidden>${index===7?"Return to the first gate →":"Continue to the next gate →"}</button></div>`;
  $("#shrine-reveal").addEventListener("click",()=>{$("#shrine-revealed").hidden=false;$("#shrine-reveal").hidden=true;});
  $("#shrine-example-reveal").addEventListener("click",()=>{$("#shrine-example-revealed").hidden=false;$("#shrine-example-reveal").hidden=true;});
  $("#shrine-hear").addEventListener("click",()=>speakJapanese(entry.sentence,$("#shrine-audio-status")));
  for(const candidate of options){
   const b=document.createElement("button");b.type="button";b.className="soft-button";b.textContent=candidate.meaning;
   b.addEventListener("click",()=>{
    if(answered)return;
    if(candidate.id!==entry.id){b.classList.add("wrong");$("#shrine-feedback").textContent="Not this time. Look at the scene, reveal the reading, and try again.";return;}
    answered=true;completed.add(index);
    lesson.querySelector(".shrine-lesson-head .panel-kicker").textContent=`GATE ${index+1} OF ${SHRINE_KANJI.length} · ${completed.size} EXPLORED`;
    $("#shrine-choices").querySelectorAll("button").forEach(option=>option.disabled=true);
    b.classList.add("correct");
    $("#shrine-revealed").hidden=false;$("#shrine-reveal").hidden=true;
    $("#shrine-feedback").textContent="A new sign along the journey ✿";
    buttons[index].querySelector("small").textContent="✿";
    $("#shrine-next").hidden=false;
   });$("#shrine-choices").append(b);
  }
  $("#shrine-next").addEventListener("click",()=>{if(answered){index=(index+1)%SHRINE_KANJI.length;renderLesson();}});
 }
 renderLesson();
}
