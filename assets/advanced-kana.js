// Optional advanced readings for BOTH syllabaries, independent of the 46-base-kana saves.
// Recognition is a gentle romanisation practice, NOT handwriting or speaking assessment.
import {ADVANCED,CATEGORIES,ADVANCED_STORAGE_KEY,REWARD_THRESHOLD,
  parseAdvanced,rememberAdvanced,advancedCount,rewardUnlocked,answersFor} from "./advanced-kana-data.js";

function shuffled(values) {
 const a=[...values];
 for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
 return a;
}
export function renderAdvancedKana(root,initialScript,speakJapanese,onReturn){
 let script=initialScript==="katakana"?"katakana":"hiragana";
 const state=(()=>{try{return parseAdvanced(localStorage.getItem(ADVANCED_STORAGE_KEY))}catch{return parseAdvanced(null)}})();
 let section="voiced",chosen=null,answered=false;
 const groups=()=>CATEGORIES.filter(c=>!c.script||c.script===script);
 const pool=()=>ADVANCED[script].filter(x=>x.category===section);
 const selected=()=>pool().find(x=>x.id===chosen)||pool()[0];
 const count=()=>ADVANCED[script].length;
 const persist=(item,msg)=>{
  const before=[...state[script]];
  rememberAdvanced(state,item);
  try{localStorage.setItem(ADVANCED_STORAGE_KEY,JSON.stringify(state));return true;}
  catch{state[script]=before;msg.textContent="Progress could not be saved on this device. Please check browser storage.";return false;}
 };
 root.innerHTML=`<section class="advanced">
   <div class="advanced-intro"><span class="panel-kicker">BEYOND THE FIRST 46 · かなのつづき</span>
    <h2>Little marks, new sounds.</h2>
    <p>The first 46 shapes are only the beginning. Here, tiny marks and combinations create new readings. Choose a card, explore it, then try a friendly reading challenge.</p>
   </div>
   <div class="advanced-toolbar">
      <div class="advanced-scripts" aria-label="Choose writing system">
       <button type="button" data-advanced-script="hiragana">Hiragana · ひらがな</button>
       <button type="button" data-advanced-script="katakana">Katakana · カタカナ</button>
      </div>
      <span id="advanced-progress" aria-live="polite"></span>
   </div>
   <div class="advanced-category-tabs" id="advanced-categories" aria-label="Reading topics"></div>
   <div class="advanced-topic-intro" id="advanced-topic-intro"></div>
   <div class="advanced-layout"><div class="advanced-card-bank" id="advanced-card-bank" aria-label="Choose an advanced reading"></div>
    <div id="advanced-lesson" class="advanced-lesson" aria-live="polite"></div></div>
   <section class="advanced-reward" id="advanced-reward"><div>
     <span class="panel-kicker">A STORY BEYOND THE PATH</span>
     <h3>A closer chapter ✧</h3>
     <p id="advanced-reward-message"></p></div>
     <button type="button" class="primary" id="advanced-reward-button">Open the postcard 🏮</button></section>
   <div class="advanced-end"><button id="advanced-return" class="soft-button">← Back to my journey</button>
    <p>These are reading clues, not individually scored handwriting or pronunciation tests. Your basic kana and other saves stay unchanged.</p></div>
 </section>`;
 const $=selector=>root.querySelector(selector);
 const scriptButtons=root.querySelectorAll("[data-advanced-script]");
 const activeTopic=()=>groups().find(c=>c.id===section);
 const updateReward=()=>{
   const earned=advancedCount(state),ready=rewardUnlocked(state);
   $("#advanced-reward-message").textContent=ready
    ? "Your discoveries have opened a quiet second scene. There is something waiting for you at the station."
    : `${earned} of ${REWARD_THRESHOLD} advanced readings recognised across your two alphabets. A closer scene is waiting farther along the path.`;
   $("#advanced-reward-button").disabled=!ready;
   $("#advanced-progress").textContent=`${state[script].length} / ${count()} readings collected`;
 };
 const renderGroups=()=>{
   $("#advanced-categories").replaceChildren();
   for(const category of groups()){
    const button=document.createElement("button");button.type="button";
    button.textContent=category.title;button.dataset.category=category.id;
    button.setAttribute("aria-pressed",String(category.id===section));
    button.addEventListener("click",()=>{section=category.id;chosen=null;answered=false;renderGroups();renderCards();});
    $("#advanced-categories").append(button);
   }
 };
 const renderCards=()=>{
   const topic=activeTopic();
   $("#advanced-topic-intro").innerHTML=`<strong>${topic.title}</strong><p>${topic.subtitle}</p><small>${topic.example}</small>`;
   $("#advanced-card-bank").replaceChildren();
   for(const card of pool()){
    const button=document.createElement("button");button.type="button";button.dataset.reading=card.id;
    button.className="advanced-card";button.setAttribute("aria-pressed",String(selected().id===card.id));
    button.innerHTML=`<strong lang="ja">${card.glyph}</strong>
      <small>${card.read}${state[script].includes(card.id)?" ✓":""}</small>`;
    button.addEventListener("click",()=>{chosen=card.id;answered=false;renderCards();});
    $("#advanced-card-bank").append(button);
   }
   renderLesson();
   updateReward();
 };
 const renderLesson=()=>{
   const card=selected();if(!card)return;
   const quizGroup=pool();
   const words=shuffled(answersFor(card,quizGroup));
   answered=false;
   $("#advanced-lesson").innerHTML=`<span class="panel-kicker">A LITTLE DISCOVERY</span>
    <div class="advanced-big-kana" lang="ja">${card.glyph}</div>
    <p class="advanced-reading">${card.read}</p>
    <p class="advanced-explanation">${card.note || activeTopic().subtitle}</p>
    <div class="advanced-audio-row"><button class="soft-button" type="button" id="advanced-hear">♫ Hear it</button>
       <p class="feedback" id="advanced-audio-feedback" role="status"></p></div>
    <div class="advanced-question"><strong>How would you read <span lang="ja">${card.glyph}</span>?</strong>
     <div id="advanced-choices" class="advanced-choices"></div>
     <p id="advanced-feedback" class="feedback" role="status"></p></div>
    <button type="button" id="advanced-next" class="soft-button" hidden>Next discovery →</button>`;
   $("#advanced-hear").addEventListener("click",()=>speakJapanese(card.glyph,$("#advanced-audio-feedback")));
   const feedback=$("#advanced-feedback");
   if(card.category==="small"){
    feedback.textContent="A small kana usually changes a neighbour. Here you are recognising its written role.";
   }
   for(const reading of words){
    const btn=document.createElement("button");btn.className="soft-button";btn.type="button";
    btn.textContent=reading;
    btn.addEventListener("click",()=>{
      if(answered)return;
      if(reading!==card.read){btn.classList.add("wrong");feedback.textContent="Not quite. Check the example and try again.";return;}
      if(!persist(card,feedback))return;
      answered=true;btn.classList.add("correct");$("#advanced-choices").querySelectorAll("button").forEach(x=>x.disabled=true);
      feedback.textContent="Lovely! A new reading for your journey. ✿";
      $("#advanced-next").hidden=false;
      $("#advanced-card-bank").querySelectorAll(".advanced-card").forEach(button=>{
       if(button.dataset.reading===card.id)button.querySelector("small").textContent=card.read+" ✓";
      });
      updateReward();
    });
    $("#advanced-choices").append(btn);
   }
   $("#advanced-next").addEventListener("click",()=>{
     const group=pool();
     const next=group.find(x=>!state[script].includes(x.id))||group[(group.findIndex(x=>x.id===card.id)+1)%group.length];
     chosen=next.id;renderCards();
   });
 };
 scriptButtons.forEach(btn=>btn.addEventListener("click",()=>{
  script=btn.dataset.advancedScript;
  section="voiced";chosen=null;answered=false;refresh();
 }));
 function renderReward(){
  root.innerHTML=`<section class="advanced-scene">
    <button type="button" class="soft-button" id="advanced-scene-return">← Back to reading discoveries</button>
    <div class="advanced-scene-art"><img src="/assets/art/travellers-closeup.svg"
      alt="Two adult male travellers at the station, with soft smiles and matching pink-blossom charms" width="615" height="409"></div>
    <div class="advanced-scene-copy">
      <span class="panel-kicker">A POSTCARD FROM THE JOURNEY · TWO TRAVELLERS</span>
      <h3>Not so far apart.</h3>
      <p>The festival lanterns are behind them now. At the morning station, one traveller touches the little charm on his bag. The other smiles — his is exactly the same.</p>
      <p>Neither asks whether the other will take the next train. Somehow, they both already know.</p>
      <div class="advanced-scene-japanese"><p lang="ja">また、いっしょに。</p><em>Mata, issho ni. · Together again.</em></div>
      <p class="advanced-scene-footnote">An optional story, not a test. Your discoveries stay yours.</p>
    </div>
   </section>`;
   $("#advanced-scene-return").addEventListener("click",()=>{
     renderAdvancedKana(root,script,speakJapanese,onReturn);
     const dialog=root.closest("dialog");if(dialog)dialog.scrollTop=0;
   });
   const dialog=root.closest("dialog");if(dialog)dialog.scrollTop=0;
 }
 $("#advanced-reward-button").addEventListener("click",()=>{if(rewardUnlocked(state))renderReward();});
 $("#advanced-return").addEventListener("click",()=>onReturn(script));
 function refresh(){
  scriptButtons.forEach(btn=>btn.setAttribute("aria-pressed",String(btn.dataset.advancedScript===script)));
  renderGroups();renderCards();
 }
 refresh();
}
