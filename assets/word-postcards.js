import {
  WORDS, WORD_STORAGE_KEY, parseWordProgress,
  isWordReady, availableWords, collectWord
} from "./word-trails.js";
import {renderLanternTeaser,renderLanternEvening} from "./lantern-evening.js";

function getState(){
  try{return parseWordProgress(localStorage.getItem(WORD_STORAGE_KEY));}
  catch{return {collected:[]};}
}
export function learnedWordCount(){return getState().collected.length;}
function storeState(state,feedback){
  try{localStorage.setItem(WORD_STORAGE_KEY,JSON.stringify(state));return true;}
  catch{feedback.textContent="Your browser couldn't save these postcards. Please check storage settings.";return false;}
}
function shuffle(items){
  const a=[...items];
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}
export function renderWordPostcards(panel,masteredKana,speakJapanese,onBack){
  const state=getState(),ready=availableWords(masteredKana);
  const upcoming=WORDS.filter(w=>!isWordReady(w,masteredKana)).slice(0,3);
  panel.innerHTML=`<div class="word-postcards">
    <div class="postcard-heading">
      <span class="panel-kicker">A GARDEN FULL OF LITTLE DISCOVERIES</span>
      <h3>Words along the path</h3>
      <p>As you learn hiragana, real Japanese words appear here. Discover their meanings, then try a little memory challenge. Nothing is compulsory.</p>
      <div class="postcard-actions"><span class="postcard-count" id="postcard-count"></span><button type="button" class="soft-button" id="back-to-chart">← Back to my kana chart</button></div>
    </div>
    <div class="word-grid" id="word-grid"></div>
    <div id="postcard-study" class="postcard-study" aria-live="polite"></div>
    <div id="lantern-discovery"></div>
  </div>`;
  const grid=panel.querySelector("#word-grid"),study=panel.querySelector("#postcard-study");
  const feedback=()=>study.querySelector("#word-feedback");
  const updateLantern=()=>{
    renderLanternTeaser(panel.querySelector("#lantern-discovery"),state,()=>{
      renderLanternEvening(panel,()=>renderWordPostcards(panel,masteredKana,speakJapanese,onBack),speakJapanese);
    });
  };
  updateLantern();
  const updateCount=()=>{panel.querySelector("#postcard-count").textContent=`${state.collected.length} of ${WORDS.length} postcards collected`;};
  updateCount();
  panel.querySelector("#back-to-chart").addEventListener("click",onBack);
  if(!ready.length){
    const note=document.createElement("p");note.className="postcard-empty";
    note.textContent="Your first words will bloom as soon as you collect a few hiragana. ✿";
    grid.append(note);
  }
  for(const word of [...ready,...upcoming]){
    const unlocked=isWordReady(word,masteredKana);
    const button=document.createElement("button");button.type="button";
    button.className="word-card"+(unlocked?"":" word-locked")+(state.collected.includes(word.id)?" word-earned":"");
    button.disabled=!unlocked;button.dataset.word=word.id;
    button.setAttribute("aria-label",unlocked?`Study Japanese word ${word.kana}`:`Upcoming Japanese word, not yet unlocked`);
    button.innerHTML=`<span class="word-symbol" aria-hidden="true">${word.symbol}</span>
      <strong lang="ja">${unlocked?word.kana:"···"}</strong>
      <small>${!unlocked?"🔒 Later":state.collected.includes(word.id)?"✓ Collected":"Discover ✧"}</small>`;
    button.addEventListener("click",()=>studyWord(word,button));
    grid.append(button);
  }
  function studyWord(word,card){
    grid.querySelectorAll(".word-card").forEach(b=>b.setAttribute("aria-pressed",String(b===card)));
    study.innerHTML=`<div class="postcard-detail">
      <div class="postcard-visual" aria-hidden="true">${word.symbol}</div>
      <div class="postcard-content">
        <span class="panel-kicker">A LITTLE WORD POSTCARD</span>
        <div class="postcard-word" lang="ja">${word.kana}</div>
        <p class="postcard-reading">${word.romaji} · <strong>${word.meaning}</strong></p>
        <p class="postcard-note">${word.description}</p>
        <div class="postcard-actions"><button type="button" class="soft-button" id="postcard-listen">♫ Listen</button>
        <button type="button" class="primary" id="postcard-quiz">Remember this word ↗</button></div>
        <p class="feedback" id="audio-feedback" role="status"></p>
      </div>
    </div><div id="postcard-question"></div>`;
    study.querySelector("#postcard-listen").addEventListener("click",()=>speakJapanese(word.kana));
    study.querySelector("#postcard-quiz").addEventListener("click",()=>{
      const choices=shuffle([word,...shuffle(WORDS.filter(w=>w.id!==word.id)).slice(0,3)]);
      const area=study.querySelector("#postcard-question");
      area.innerHTML=`<div class="word-question"><h4>What does <span lang="ja">${word.kana}</span> mean?</h4>
        <div id="word-choices" class="word-choices"></div>
        <p id="word-feedback" class="feedback" role="status"></p></div>`;
      for(const option of choices){
        const btn=document.createElement("button");btn.className="soft-button";btn.type="button";
        btn.textContent=option.meaning;
        btn.addEventListener("click",()=>{
          if(option.id!==word.id){
            btn.classList.add("wrong");feedback().textContent="Not quite. That's okay — look at the postcard and try again.";return;
          }
          area.querySelectorAll("button").forEach(b=>b.disabled=true);
          btn.classList.add("correct");
          const fresh=collectWord(state,word.id,masteredKana);
          if(fresh && !storeState(state,feedback())){
            state.collected=state.collected.filter(id=>id!==word.id);
            return;
          }
          card.classList.add("word-earned");
          card.querySelector("small").textContent="✓ Collected";
          updateCount();
          updateLantern();
          feedback().textContent="A lovely new word for your journey! ✿";
        });
        area.querySelector("#word-choices").append(btn);
      }
    });
    study.scrollIntoView({behavior:"smooth",block:"nearest"});
  }
}
