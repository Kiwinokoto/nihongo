// Lantern Evening: an original optional mini-story.
// No reading preferences, story clicks, or personal attributes are persisted.
export const LANTERN_PANELS = Object.freeze([
  Object.freeze({
    title:"A note between lanterns",
    image:"/assets/stories/lantern-1.svg",
    alt:"At a lantern-lit Japanese festival, an adult traveller in a green coat waits by the stalls with a small notebook.",
    prose:"Yesterday evening, someone left a small promise in the traveller's notebook. Tonight, a warm lantern glows above the same little meeting place.",
    japanese:"また、あした。",
    romaji:"Mata, ashita.",
    translation:"See you tomorrow.",
    word:"あした",
    meaning:"tomorrow"
  }),
  Object.freeze({
    title:"A familiar face",
    image:"/assets/stories/lantern-2.svg",
    alt:"Two adult travellers in green and blue coats meet face to face under the festival lanterns, wearing matching little charms.",
    prose:"There, beyond the paper lanterns, is a familiar blue coat. Two little charms catch the same light. Neither traveller seems surprised.",
    japanese:"ここだよ。",
    romaji:"Koko da yo.",
    translation:"Here I am.",
    word:"ここ",
    meaning:"here"
  }),
  Object.freeze({
    title:"One umbrella, two paths",
    image:"/assets/stories/lantern-3.svg",
    alt:"Soft rain falls at the evening festival as two adult travellers stand close together beneath one large paper umbrella.",
    prose:"A gentle rain begins. An umbrella opens — just wide enough for two. And this time, they walk away together.",
    japanese:"いっしょに いこう。",
    romaji:"Issho ni ikō.",
    translation:"Let's go together.",
    word:"いっしょに",
    meaning:"together"
  })
]);
export function canOpenLanternEvening(state){
  return !!state && Array.isArray(state.collected) && state.collected.length>=1;
}
export function renderLanternTeaser(container,state,onOpen){
  const ready=canOpenLanternEvening(state);
  container.innerHTML=`<div class="lantern-teaser ${ready?"lantern-ready":"lantern-asleep"}">
    <div class="lantern-emblem" aria-hidden="true">🏮</div>
    <div class="lantern-teaser-copy">
      <span class="panel-kicker">A LITTLE SECRET IN THE GARDEN</span>
      <h4>Lantern Evening</h4>
      <p>${ready?"A quiet story is waiting beyond the stalls. Three little moments, just for the curious.":"The lanterns wake after your first word postcard. No hurry."}</p>
    </div>
    <button class="soft-button" id="lantern-enter" type="button" ${ready?"":"disabled"}>
      ${ready?"Follow the lanterns ↗":"Sleeping lanterns ✧"}
    </button>
  </div>`;
  if(ready)container.querySelector("#lantern-enter").addEventListener("click",onOpen);
}
export function renderLanternEvening(panel,onBack,speakJapanese){
  // Keep the three small illustrations ready as the reader turns the pages.
  // No prefetching until this optional story is explicitly opened.
  for(const part of LANTERN_PANELS){
    const preload=new Image();preload.src=part.image;
  }
  let page=0;
  panel.innerHTML=`<div class="lantern-story">
    <div class="lantern-story-top"><button type="button" class="soft-button" id="lantern-back">← Back to word postcards</button>
      <span class="panel-kicker">AN OPTIONAL LITTLE STORY · 物語</span></div>
    <div id="lantern-scene" aria-live="polite"></div>
    <div class="lantern-story-controls">
      <button class="soft-button" id="lantern-prev" type="button">← Previous</button>
      <span id="lantern-counter" aria-label="Story progress"></span>
      <button class="primary" id="lantern-next" type="button">Next moment →</button>
    </div>
    <p class="lantern-endnote">A story for a quiet evening. No learning progress is changed by visiting.</p>
  </div>`;
  const back=()=>onBack();
  panel.querySelector("#lantern-back").addEventListener("click",back);
  const prev=panel.querySelector("#lantern-prev"),next=panel.querySelector("#lantern-next");
  const scene=panel.querySelector("#lantern-scene");
  const render=()=>{
    const part=LANTERN_PANELS[page];
    scene.innerHTML=`<section class="lantern-chapter" aria-label="Lantern Evening, moment ${page+1}">
      <div class="lantern-picture"><img src="${part.image}" alt="${part.alt}" width="1000" height="580"></div>
      <div class="lantern-caption">
        <div class="panel-kicker">MOMENT ${String(page+1).padStart(2,"0")} · ${page===0?"THE PROMISE":page===1?"THE MEETING":"THE WALK"}</div>
        <h3>${part.title}</h3>
        <p class="lantern-narrative">${part.prose}</p>
        <div class="lantern-phrase">
          <div class="lantern-phrase-header"><span>A LITTLE JAPANESE</span><span lang="ja">${part.word}</span> · ${part.meaning}</div>
          <p class="lantern-japanese" lang="ja">${part.japanese}</p>
          <p class="lantern-romaji">${part.romaji}</p>
          <p class="lantern-translation">“${part.translation}”</p>
          <button type="button" class="soft-button" id="lantern-listen">♫ Hear this line</button>
          <p class="feedback" id="audio-feedback" role="status"></p>
        </div>
      </div>
    </section>`;
    scene.querySelector("#lantern-listen").addEventListener("click",()=>speakJapanese(part.japanese));
    prev.disabled=page===0;
    next.textContent=page===LANTERN_PANELS.length-1?"Return to the garden ✿":"Next moment →";
    panel.querySelector("#lantern-counter").textContent=`${page+1} / ${LANTERN_PANELS.length}`;
  };
  prev.addEventListener("click",()=>{
    if(page>0){page--;render();scene.scrollIntoView({block:"nearest",behavior:"smooth"});}
  });
  next.addEventListener("click",()=>{
    if(page===LANTERN_PANELS.length-1){back();return;}
    page++;render();scene.scrollIntoView({block:"nearest",behavior:"smooth"});
  });
  render();
}
