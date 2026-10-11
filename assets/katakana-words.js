// Optional whole-word reading. Session-only feedback; never scores basic kana.
import {KATAKANA_WORDS,shuffledWords,choicesForWord} from "./katakana-word-data.js";

export function renderKatakanaWords(root,speakJapanese,onReturn){
 const journey=shuffledWords(KATAKANA_WORDS);
 let index=0,matched=0;
 const $=selector=>root.querySelector(selector);
 function render(){
  if(index===journey.length){
   root.innerHTML=`<section class="kata-town">
     <span class="panel-kicker">A LITTLE DETOUR · COMPLETED</span>
     <h3>Eight signs along the way ✿</h3>
     <p>You matched ${matched} of ${journey.length} everyday words. This was a practice round, not a kana mastery check.</p>
     <div class="kata-town-actions"><button type="button" class="primary" id="kata-town-again">Another little walk ↗</button>
     <button type="button" class="soft-button" id="kata-town-back">← Back to katakana</button></div>
    </section>`;
   $("#kata-town-again").addEventListener("click",()=>{index=0;matched=0;renderKatakanaWords(root,speakJapanese,onReturn)});
   $("#kata-town-back").addEventListener("click",onReturn);
   return;
  }
  const word=journey[index],answers=choicesForWord(word);
  let answered=false;
  root.innerHTML=`<section class="kata-town">
    <span class="panel-kicker">WORDS AROUND TOWN · ${index+1} / ${journey.length}</span>
    <h3>A sign along the journey</h3>
    <p>Read the katakana as a whole word, then choose what it means. You can reveal the reading whenever you need it.</p>
    <div class="kata-town-card">
      <span class="kata-town-place">${word.place}</span>
      <strong class="kata-town-kana" lang="ja">${word.kana}</strong>
      <button class="soft-button" type="button" id="kata-town-reading-button">Show reading</button>
      <p id="kata-town-reading" class="kata-town-reading" hidden>${word.reading}</p>
      <div class="kata-town-audio"><button type="button" class="soft-button" id="kata-town-hear">♫ Hear the whole word</button>
      <p class="feedback" id="kata-town-audio-status" role="status"></p></div>
    </div>
    <div class="kata-town-question"><strong>What does <span lang="ja">${word.kana}</span> mean?</strong>
      <div id="kata-town-choices" class="kata-town-choices"></div>
      <p class="feedback" id="kata-town-feedback" role="status"></p>
    </div>
    <div class="kata-town-actions"><button type="button" class="primary" id="kata-town-next" hidden>${index===journey.length-1?"Finish this walk ↗":"Next sign →"}</button>
    <button type="button" class="soft-button" id="kata-town-back">← Back to katakana</button></div>
    <p class="kata-town-note">These are word-reading and meaning clues, not a speaking or handwriting score. Nothing is saved.</p>
  </section>`;
  $("#kata-town-reading-button").addEventListener("click",()=>{
   $("#kata-town-reading").hidden=false;
   $("#kata-town-reading-button").hidden=true;
  });
  $("#kata-town-hear").addEventListener("click",()=>speakJapanese(word.kana,$("#kata-town-audio-status")));
  const feedback=$("#kata-town-feedback");
  for(const choice of answers){
   const btn=document.createElement("button");
   btn.type="button";btn.className="soft-button";btn.textContent=choice.meaning;
   btn.addEventListener("click",()=>{
    if(answered)return;
    if(choice.id!==word.id){
     btn.classList.add("wrong");
     feedback.textContent="Not quite. You can reveal the reading and try again.";
     return;
    }
    answered=true;matched++;
    btn.classList.add("correct");
    $("#kata-town-choices").querySelectorAll("button").forEach(button=>button.disabled=true);
    $("#kata-town-reading").hidden=false;
    $("#kata-town-reading-button").hidden=true;
    feedback.textContent=word.note+" ✿";
    $("#kata-town-next").hidden=false;
   });
   $("#kata-town-choices").append(btn);
  }
  $("#kata-town-next").addEventListener("click",()=>{if(answered){index++;render();}});
  $("#kata-town-back").addEventListener("click",onReturn);
 }
 render();
}
