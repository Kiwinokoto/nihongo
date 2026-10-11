// Japanese audio: native browser voice first, then small, locally hosted,
// human-recorded vowel previews for devices with no Japanese TTS voice.
// These MP3s are derived from public-domain Wikimedia Commons Ogg files.
export const VOWEL_AUDIO=Object.freeze({
 "あ":"/assets/audio/kana/a.mp3","ア":"/assets/audio/kana/a.mp3",
 "い":"/assets/audio/kana/i.mp3","イ":"/assets/audio/kana/i.mp3",
 "う":"/assets/audio/kana/u.mp3","ウ":"/assets/audio/kana/u.mp3",
 "え":"/assets/audio/kana/e.mp3","エ":"/assets/audio/kana/e.mp3",
 "お":"/assets/audio/kana/o.mp3","オ":"/assets/audio/kana/o.mp3"
});
let currentClip=null;
export function japaneseVoiceList(synth){
 try{return synth?.getVoices?.().filter(v=>v.lang?.toLowerCase().startsWith("ja"))??[];}
 catch{return [];}
}
export function stopJapaneseAudio(){
 try{if("speechSynthesis" in window)window.speechSynthesis.cancel();}catch{}
 if(currentClip){currentClip.pause();currentClip.currentTime=0;currentClip=null;}
}
export function playbackKind(text,voices){
 return voices.length?"system":Object.hasOwn(VOWEL_AUDIO,text)?"recording":"unavailable";
}
export function speakJapanese(text,output){
 if(!output)return;
 stopJapaneseAudio();
 const synth=window.speechSynthesis;
 const voices=japaneseVoiceList(synth);
 const source=VOWEL_AUDIO[text];
 const preview=()=>{
  if(!source){output.textContent="No Japanese system voice for this phrase yet. You can still read and practise.";return;}
  try{
   const clip=new Audio(source);currentClip=clip;
   clip.onended=()=>{if(currentClip===clip)currentClip=null;};
   clip.onerror=()=>{if(currentClip===clip)currentClip=null;output.textContent="This local recording couldn't be played. The written exercise still works.";};
   output.textContent="Playing a recorded Japanese vowel…";
   const started=clip.play();
   if(started?.catch)started.catch(()=>{if(currentClip===clip){currentClip=null;output.textContent="Audio playback was blocked. Tap again or check the browser sound settings."; }});
  }catch{output.textContent="Recorded audio couldn't start on this browser.";}
 };
 if(!voices.length){preview();return;}
 try{
  const utterance=new SpeechSynthesisUtterance(text);
  utterance.voice=voices[0];utterance.lang="ja-JP";utterance.rate=.72;
  utterance.onerror=()=>{preview();};
  utterance.onend=()=>{if(output.isConnected)output.textContent="Japanese audio played.";};
  synth.speak(utterance);
  output.textContent=`Playing Japanese using ${voices[0].name}…`;
 }catch{preview();}
}
