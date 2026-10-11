// A homecoming stop: review only achievements actually stored in the browser.
// Japanese system voice help stays available even for an empty collection.
import {japaneseVoiceList} from "./japanese-audio.js";
import {villageReview} from "./learning-snapshot.js";
export const japaneseVoices=japaneseVoiceList;

export function renderStartingVillage(root,{onBook,speakJapanese,snapshot}){
 const questions=villageReview(snapshot);
 root.innerHTML=`<div class="village-intro">
   <div class="village-hero">
     <img src="/assets/art/village-path.svg" alt="A welcoming riverside village with cherry blossoms, traditional houses, a bridge and two travellers" width="1400" height="460">
   </div>
   <span class="panel-kicker">RETURN TO THE BEGINNING · はじまりの村</span>
   <h3>${questions.length?"Welcome home, traveller.":"Welcome to your little journey."}</h3>
   <p>${questions.length
    ?"There is something lovely about coming back to the beginning with new words in your pocket. What do you remember from your journey?"
    :"Every path begins somewhere. Look around the map, discover your first sound or word, then come home to see how far you've travelled."}</p>
   <div class="village-home-actions">
    <button type="button" class="primary" id="village-open-book">✿ Open my magic book ↗</button>
    ${questions.length?'<button type="button" class="soft-button" id="village-review-start">↶ A little homecoming review</button>':""}
   </div>
   <section class="village-revisit" id="village-revisit" aria-label="Your homecoming review">
    <span class="panel-kicker">${questions.length?"A WALK THROUGH WHAT YOU KNOW":"THE FIRST STEP"}</span>
    <p>${questions.length
     ?"Only things you have actually collected appear as questions. Wrong answers are just another chance — nothing is graded or saved."
     :"After collecting a few discoveries, this village will offer a short practice round drawn from your own journey."}</p>
    <div id="village-review-card" aria-live="polite"></div>
   </section>
   <div class="village-voices">
     <div><span class="panel-kicker">SOUND HELP · こえのガイド</span>
     <h4>Can this browser speak Japanese?</h4>
     <p>Voices depend on your device and browser. We'll only inspect what is installed here — no microphone, downloads or accounts.</p></div>
     <div class="village-voice-actions">
       <button type="button" class="soft-button" id="village-voice-check">Check Japanese voices</button>
       <button type="button" class="soft-button" id="village-voice-test">♫ Try こんにちは</button>
     </div>
     <p class="feedback" id="village-voice-result" role="status">Japanese audio availability hasn't been checked yet.</p>
     <p class="village-fallback-note">The first five hiragana and katakana also have locally hosted human-recorded sounds, even without an installed Japanese system voice.</p>
     <details class="voice-help"><summary>Using a Mac? How to install Japanese voices</summary>
       <ol>
         <li>Open <strong>Apple menu → System Settings → Accessibility → Read &amp; Speak</strong> (called <em>Spoken Content</em> on some older macOS versions).</li>
         <li>Next to <strong>System Voice</strong>, open voice settings / <strong>Manage Voices</strong>, choose <strong>Japanese</strong> and download an available voice.</li>
         <li>Let the download finish, restart this browser, then select <strong>Check Japanese voices</strong> again.</li>
       </ol>
       <p>Safari, Firefox, Chrome and Brave are all available on Mac; voice availability can differ. This site cannot install a system voice automatically.</p>
       <p><a href="https://support.apple.com/guide/mac-help/mchlp2290/mac" target="_blank" rel="noopener noreferrer">Apple's voice installation guide ↗</a></p>
     </details>
   </div>
 </div>`;
 const $=sel=>root.querySelector(sel);
 $("#village-open-book").addEventListener("click",onBook);
 const target=$("#village-review-card");
 if(questions.length){
  $("#village-review-start").addEventListener("click",()=>{
   let index=0,correct=0;
   const render=()=>{
    if(index===questions.length){
     target.innerHTML=`<div class="village-review-finish"><h4>Another little journey complete ✿</h4>
       <p>You recognised ${correct} of ${questions.length} familiar discoveries this time. It is practice, not a grade.</p>
       <button type="button" id="village-review-again" class="soft-button">Take another walk ↶</button></div>`;
     $("#village-review-again").addEventListener("click",()=>$("#village-review-start").click());return;
    }
    const q=questions[index];let answered=false;
    target.innerHTML=`<div class="village-review-question">
       <span class="panel-kicker">MEMORY ${index+1} OF ${questions.length} · ${q.kind}</span>
       <h4>${q.prompt}</h4><div class="village-review-glyph" lang="ja"></div>
       <div class="village-review-choices"></div><p class="feedback" role="status"></p>
       <button type="button" class="primary" id="village-review-next" hidden>${index===questions.length-1?"Finish this visit →":"Next memory →"}</button>
      </div>`;
    $(".village-review-glyph").textContent=q.glyph;
    const options=$(".village-review-choices"),feedback=$(".village-review-question .feedback");
    for(const value of q.choices){
     const b=document.createElement("button");b.type="button";b.className="soft-button";b.textContent=value;
     b.addEventListener("click",()=>{
      if(answered)return;
      if(value!==q.answer){b.classList.add("wrong");feedback.textContent="Not quite — try once more. Nothing is lost.";return;}
      answered=true;correct++;
      b.classList.add("correct");options.querySelectorAll("button").forEach(x=>x.disabled=true);
      feedback.textContent="You remembered! ✿";
      $("#village-review-next").hidden=false;
     });options.append(b);
    }
    $("#village-review-next").addEventListener("click",()=>{if(answered){index++;render();}});
   };
   render();
  });
 }
 const status=$("#village-voice-result");
 const inspect=()=>{
  if(!("speechSynthesis" in window)){status.textContent="This browser doesn't support speech synthesis. You can still explore everything in writing.";return;}
  const voices=japaneseVoices(window.speechSynthesis);
  status.textContent=voices.length
   ? `${voices.length} Japanese voice${voices.length===1?"":"s"} available: ${voices.map(v=>v.name).join(", ")}.`
   : "No Japanese voice is currently listed. The browser may load voices later, or your device may need a Japanese speech pack.";
 };
 $("#village-voice-check").addEventListener("click",()=>{status.dataset.checked="yes";inspect();});
 $("#village-voice-test").addEventListener("click",()=>speakJapanese("こんにちは",status));
 const onVoicesChanged=()=>{if(root.isConnected&&status.dataset.checked==="yes")inspect();};
 window.speechSynthesis?.addEventListener?.("voiceschanged",onVoicesChanged);
 return ()=>window.speechSynthesis?.removeEventListener?.("voiceschanged",onVoicesChanged);
}
