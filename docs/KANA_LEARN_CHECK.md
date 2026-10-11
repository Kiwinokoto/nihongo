# Kana learning versus checking — 2026-10-11

Both the **Hiragana garden** and **Katakana station** now distinguish:

1. **Learn & practise:** Discover (animated strokes, listening), Draw (free guided tracing, undo/clear, saved as `traced` only), Next shape. Neither tracing nor watching unlocks a kana.
2. **Check yourself:** Sound + writing check per row of 3–5 characters, alternating shuffled sound recognition and *write from memory*. The model stays hidden until at least one stroke is drawn. Reveal includes the original animated stroke-order illustration. **Recognising** a matching kana counts objectively toward the existing 46-character progress. **Writing** is intentionally *self-comparison* (“Looks close” / “Needs more practice”), shown only as an unsaved session summary. The software makes **no handwriting, stroke-direction, shape-similarity, or proficiency-certification claim**.
3. **Your progress:** existing due-review and collections. An optional “Recognise one” button preserves rapid single-sound practice and legacy workflows.

The check order is built in `assets/kana-checkpoint.js`, independent of both alphabet progress implementations. Every character appears exactly once per skill and writing prompts are offset from the preceding recognition prompt, avoiding a trivial copying task. Both module owners pass their own `onRecognised` callback into the same checkpoint.

## Compatibility

- No new persistent keys, migrations, services, dependencies or trackers.
- Existing `mastered`, `traced`, spaced-review, first-five-row gating, postcards, and Little Memories unlocks remain unchanged.
- Existing saves from before this pass still load. Writing self-ratings do not persist and cannot award or revoke recognitions.
- Cross-script imports never mix progress: hiragana writes only its previous storage key; katakana writes only its own.

## Test strategy

- Unit tests check task coverage for each row, including the last three-kana row, and the no-adjacent-answer-copy property.
- Browser E2E checks full 10-step mixed assessments in **both** scripts; one drawing answer deliberately marked “Needs more practice,” with a report distinct from objective recognition; real canvas strokes; no mastery awarded by brush only; 46 gating; reload; mobile width, accessibility labels and no page errors.
- Old visual selectors still point to legacy tabs; for historical browser scripts, `My collection` remains its previous label. Browser automation may need to scroll the larger drawing panel into view before drawing.
- Real Safari/macOS and stylus/touch field QA with Angela remains pending.

## Future proper handwriting evaluation

A truthful graded writing assessment requires tested shape, strokes/direction/order and forgiving tolerances for mouse/pen, calibration with fluent Japanese writers, and accessibility alternatives. Keep it **a separate technical module**. Until validated, never convert self-check into an automatic pass.

## Immediate retry for ungraded writing (quality follow-up, 2026-10-11)

After a learner has drawn, revealed the reference and compared it, **Draw this character again** resets the *same writing question* to a blank canvas with the model hidden. It does not advance the question index, store a self-rating, call `onRecognised`, or award mastery. The learner still chooses **Looks close** or **Needs more practice** to move forward. This option works in both hiragana and katakana because they share `assets/kana-checkpoint.js`.

This repeat is further practice after seeing the model, **not** an independent proficiency measure. Regression coverage includes 51 Node checks and JS syntax verification. A fresh desktop/mobile browser check of this button, and real Mac/Safari/touch validation, are still pending.
