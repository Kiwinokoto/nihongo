# Kotoba no Tabi — creative direction and future easter eggs

Status: **first optional scene implemented in Pass 4**, further ideas remain design research. The BL touch is deliberately allusive; there are no explicit romantic images or mandatory stories.

## The atmosphere we are protecting

A miniature, welcoming, luminous Japan: sakura blossoms, quiet forests, temple paths,
beautiful local food, soft lantern light, small acts of kindness. The interactive map
must remain simple and readable; the learning activity always comes first.

For a future adult-reader layer, add **subtle boys' love (BL) story echoes** as optional
discoveries. They are a warm wink to readers who recognise them, not a genre label
splashed across the site. These preferences are project design ideas, not an identifiable
learner profile. Do not record private reading habits or infer age from browsing.

### Implemented: Lantern Evening (Pass 4)

After collecting any one vocabulary postcard, the learner may independently open
a small three-moment festival scene from the vocabulary view. It is never forced
and does not change language progress:
1. An adult traveller finds a promise in a small notebook (`また、あした。`).
2. Two original adult travellers recognise one another beneath festival lanterns,
   with matching tiny charms (`ここだよ。`).
3. A light rain starts; they share one umbrella (`いっしょに いこう。`).

Three original SVGs generated reproducibly from the Python standard library,
stored under `assets/stories/`. No copied artwork or published fictional characters.
Romance is a possible gentle reading, but no explicit label or preference data
appears in the learner UI. The Japanese lines should get a fluent-human check
before being reused as formal teaching material.

### Other optional scene sketches (NOT yet implemented)

1. **The tea house, two cups.** Two adult travellers have ordered matching tea and
   left a folded note: `また、あした。` ("See you tomorrow"). The learner can
   practise `ふたり` ("two people", once introduced) or a natural dialogue.
2. **Bookshop / forest path.** Two bookmarks placed side by side, a pressed flower,
   a tiny note and a knowing reply: `いっしょに いこう。` ("Let's go together").
   Could support a future short adult conversation module.
3. **Optional "two travellers" postcards.** Only after the learner actively opens a
   small side story. Adult characters, warm personalities, mutual respect; romantic
   subtext can stay understated.

These are **new original characters and stories**, not borrowed manga figures or
re-created copyrighted panels. Never place sexuality or romantic content in the
foundational kana lesson; no coercive pairing, fan-service, stereotypes, or
adult/child ambiguity. The experience should remain all-ages comfortable by default.
Future romance scenes, if added, should be opt-in and suitable for adults without
explicit imagery. Do not gate language progress behind side stories.

### Editorial reference shelf (inspiration, NOT redistributable assets)

- **Sasaki and Miyano**, Shou Harusono — everyday tenderness and the pleasure of
  mutual discovery; publisher: https://yenpress.com/series/sasaki-and-miyano
- **Given**, Natsuki Kizu — emotions expressed gently through music and relationships;
  publisher: https://www.sublimemanga.com/given
- **Seaside Stranger / Umibe no Étranger**, Kii Kanna — soft light, coastal air,
  expressive silence and gentle emotional atmosphere;
  publisher: https://sevenseasentertainment.com/series/seaside-stranger/

Use these to discuss *mood*, not as an asset source: no copied covers, character
designs, named cameos, logos, lines, panels or imitation of a living artist's
identifiable style. All shipped artwork and narratives must be independently made
and properly licensed. The original SVG map is not to be overwritten casually.

## Food and everyday cultural discoveries

The food strand should be **savoury-first**, not exclusively sweets or tea:
fish grilled over charcoal, chicken skewers, octopus dishes, Japanese home
cooking, and distinctive fermented or sticky textures are central. Beautiful
wagashi can still appear, but only as one part of Japanese cuisine.

Pass 5 activates the old tea-house map stop as a small food lane without
changing the map's scenery or location. Its six menu items support a simple
`Xをください` ordering game. The street scene is original procedural SVG,
not borrowed food photography or artwork.

A learner may try food vocabulary regardless of hiragana level. Keep any
food quizzes separate from foundational literacy progress, and avoid turning
private food interests into individual tracking/profiles.

## Before implementing another easter egg

- Gather the intended learner's opinion of overall site navigation, audio, and
  story tone; don't present the future sketches as established preferences.
- Prepare a 2–3 panel optional storyboard first; review the Japanese with a
  native-fluent proofreader or reliable teaching source before publishing.
- Implement behind a separate small feature, never by refactoring the map.
- Keep it discoverable only after the learner explicitly opts to enter.
- Mobile/keyboard/accessibility tests and unchanged main learning flow mandatory.


## Two travellers — visible art, optional unfolding story (2026-10-11)
The small adult travellers are now larger in the original village panorama and
the compact main hero. One has dark hair and a cool-toned coat; the other has
warm brown hair and lighter clothing. Each carries a matching blossom charm.
These are deliberately **original** figures with subtle mutual chemistry,
not existing manga characters. The friendship-versus-romance reading is left
to the viewer, and neither identity nor reader preference is stored.

A mild, nonspoiler clue in the word-postcard collection makes the optional
Lantern Evening easier to discover. Preserve its one-word-postcard unlock and
do not force narrative into literacy challenges. Deeper traveller lore should
remain elective, human-reviewed and copyright-safe.


## Earned close-up postcard — Pass 9 (2026-10-11)
Two complementary moments of the same original pair are deliberately
separated in time. Their distant, quiet appearance stays in the **welcome
village / hero**. A closer portrait, with matching charms and a small
continuation of the lantern-festival promise, appears only **after eight
correct optional advanced kana reading challenges**, counted across both
hiragana and katakana. The small story is not a primary navigation stop and
cannot change base-kana progress. It stays modestly romantic, original,
adult and non-explicit; no licensed manga artwork or characters are used.

The closer image is generated as `assets/art/travellers-closeup.svg` by
`tools/draw_destinations.py` from our **existing original procedural figures**.
It is a new original interpretation of the close-up concept; it is **not**
an import of any externally displayed reference illustration. User feedback
on final art and original Japanese dialogue is still needed.
