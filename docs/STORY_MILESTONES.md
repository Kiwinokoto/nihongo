# Story scenes and earned milestones — Pass 10

## Principle

The homepage remains **map-first**, with the original quiet wide panorama
as the first scene. A small static hero carousel is available **only after**
a genuine saved accomplishment. There is **no autoplay** and no network
account or story-preference storage. The original learning and localStorage
keys remain the authoritative source of learner achievement.

Desktop navigation: small previous/next buttons, arrow keys when the scene
region is focused. Mobile: buttons and horizontal swipe. Scene transitions
are brief and obey `prefers-reduced-motion`.

## Milestones and rewards

| Milestone | Condition | Reward |
| --- | --- | --- |
| The first little discovery | ONE successfully collected basic hiragana, basic katakana, advanced reading, vocabulary postcard or completed food order | Unlock the short station teaser in the hero and journal. No waiting for an entire row. Drawing-only practice or listening alone does not count because it does not demonstrate recognition and no comparable reliable saved completion exists. |
| Hiragana garden | 46/46 basic hiragana recognised | A completion marker in the travel journal (no change to the 46-kana progression). |
| Katakana station | 46/46 basic katakana recognised | A distinct completion marker in the journal. |
| A closer chapter | 8 distinct advanced kana readings recognised, across either script | Unlock the original close-up portrait of the two adult travellers both in the existing advanced workshop and in the hero carousel. |
| Kanji shrine | Future content not shipped | Visible **coming later** journal step, never incorrectly shown as earned. |

The teaser reuses the existing original **station panorama**. The close-up
reuses the existing original `assets/art/travellers-closeup.svg`. The hero,
main map, original art and travel journal remain self-contained in the
static app. No new imagery or licensed external character art is required.

`assets/story-milestones.js` owns the pure unlock rules, from existing
locally stored achievements. `assets/app.js` only renders the journal and
hero; it does not write a new story save key. The app recomputes milestones
on load, cross-tab storage updates and the close of learning dialogs.
Existing learners instantly receive scenes they have already earned.
The carousel starts at scene one after a reload; scene preference is not
tracked. Rewards are optional and never gate kana, vocabulary or food.

## Future work

- Optional richer standalone `Stories / Little memories` space once enough
  chapters exist. Do not crowd the homepage with menus or extra entry points.
- Illustrated *new* chapters for the two full 46-kana achievements rather than
  substituting a duplicated existing image as an artificial reward.
- Expand the kanji shrine later with narrative tie-ins, without treating a
  learner's existing Chinese literacy as evidence of Japanese vocabulary mastery.
- Test with Angela on Mac/Safari and phone; true Japanese audio and fluent
  cultural proofreading remain field checks.
