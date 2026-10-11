// A genuine welcome stop: not a second entry to the same hiragana lesson.
// Inspect installed Japanese browser voices locally (never recorded/stored).
export function japaneseVoices(engine){
 if(!engine||typeof engine.getVoices!=="function")return [];
 return engine.getVoices().filter(v=>v.lang?.toLowerCase().startsWith("ja"));
}
export function renderStartingVillage(root,{onHiragana,onKatakana,onFood,speakJapanese}){
 root.innerHTML=`<div class="village-intro">
   <div class="village-hero">
     <img src="/assets/village.svg" alt="A peaceful Japanese village with blossom trees and little houses" width="1000" height="620">
   </div>
   <span class="panel-kicker">FIRST STOP · はじまりの村</span>
   <h3>Welcome to your little journey.</h3>
   <p>From this village, every path is yours to choose. Begin with a sound, discover another writing system, or follow the delicious smell of grilled fish.</p>
   <div class="village-paths">
    <button type="button" id="village-hiragana"><span aria-hidden="true">🌸</span><span><strong>Hiragana garden</strong><small>Sounds and flowing shapes · ひらがな</small></span><span>↗</span></button>
    <button type="button" id="village-katakana"><span aria-hidden="true">🚃</span><span><strong>Katakana station</strong><small>A second alphabet for familiar sounds · カタカナ</small></span><span>↗</span></button>
    <button type="button" id="village-food"><span aria-hidden="true">🍢</span><span><strong>The little food lane</strong><small>Fish, skewers and savoury discoveries · やたい</small></span><span>↗</span></button>
   </div>
   <div class="village-voices">
     <div><span class="panel-kicker">A SMALL SOUND CHECK</span>
     <h4>Can this browser speak Japanese?</h4>
     <p>Voices depend on your device and browser. We'll only inspect what is installed here — no microphone, downloads or accounts.</p></div>
     <div class="village-voice-actions">
       <button type="button" class="soft-button" id="village-voice-check">Check Japanese voices</button>
       <button type="button" class="soft-button" id="village-voice-test">♫ Try こんにちは</button>
     </div>
     <p class="feedback" id="village-voice-result" role="status">Japanese audio availability hasn't been checked yet.</p>
   </div>
 </div>`;
 for(const [id,fn] of [["village-hiragana",onHiragana],["village-katakana",onKatakana],["village-food",onFood]]){
  root.querySelector("#"+id).addEventListener("click",fn);
 }
 const status=root.querySelector("#village-voice-result");
 const inspect=()=>{
  if(!("speechSynthesis" in window)){
   status.textContent="This browser doesn't support speech synthesis. You can still explore everything in writing.";
   return;
  }
  const voices=japaneseVoices(window.speechSynthesis);
  status.textContent=voices.length
   ? `${voices.length} Japanese voice${voices.length===1?"":"s"} available: ${voices.map(v=>v.name).join(", ")}.`
   : "No Japanese voice is currently listed. The browser may load voices later, or your device may need a Japanese speech pack.";
 };
 root.querySelector("#village-voice-check").addEventListener("click",inspect);
 root.querySelector("#village-voice-test").addEventListener("click",()=>speakJapanese("こんにちは",status));
 const onVoicesChanged=()=>{if(root.isConnected&&status.dataset.checked==="yes")inspect()};
 // Do not leave an event listener active after the dialog is closed.
 if("speechSynthesis" in window){
  window.speechSynthesis.addEventListener?.("voiceschanged",onVoicesChanged);
 }
 root.querySelector("#village-voice-check").addEventListener("click",()=>{status.dataset.checked="yes"});
 return ()=>window.speechSynthesis?.removeEventListener?.("voiceschanged",onVoicesChanged);
}
