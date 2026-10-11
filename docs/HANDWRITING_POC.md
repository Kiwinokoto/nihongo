# Prototype plan — forgiving kana handwriting recognition

**Status:** Design / feasibility checked against the live AnimCJK source; not implemented, not a grade.

## What exists already
- 46 standard base **hiragana** and 46 standard base **katakana**, with stroke-order SVGs,
  pointer-based free drawing, 4-choice recognition quizzes and independent local progress.
- The pinned AnimCJK SVG contains animated centerline `<path clip-path ... d="...">`
  geometry with stroke-delay markers (`--d`) and reference coordinates in a 1024-square
  viewBox. Some strokes consist of **multiple subpaths with the same animation delay**:
  stroke data must be grouped and cleaned, not blindly count paths.
- Writing currently tracks self-reported practice, NOT correctness or stroke order.
  Existing collected kana must not be affected by an experimental handwriting engine.

## Missing from full kana literacy
- Basic 46+46 only: derived dakuten/handakuten sounds (が / ぱ, ガ / パ),
  small っ / ッ (gemination), contracted combinations (きゃ / キャ),
  long vowels and ー, borrowed-sound combinations (ファ / ティ), and common
  words / reading rules. Do not label the current lessons 'all Japanese kana'.

## Suggested POC
1. **Isolated, optional demo**: first five vowel kana; no mastery unlock or teacher
   reporting, no upload; use exactly the pointer strokes the app already collects.
2. **Reference geometry**: extract, group and simplify AnimCJK animated stroke paths,
   preserving stroke *orientation*; resample each expected stroke to 32–64 points.
3. **Forgiving alignment**: normalise user-drawn bounding box and centre/scale within
   reasonable limits, keeping aspect ratio; match sequential strokes using a bounded
   dynamic-time-warping (DTW) / nearest-segment distance and angle compatibility.
   Penalise reversal or missing strokes distinctly, but tolerate mouse wobble, short
   pauses and minor overshoots. Compare to a small curated set of genuine handwriting
   variants, not just a perfectly drawn font.
4. **Feedback, not binary condemnation**: 'Looks good', 'Let's revisit this stroke',
   'Try again', with the exact uncertain part illustrated and **skip / manual practice**
   always available. Never claim handwriting is objectively correct based on one trace.
5. **Calibration**: first validate all basic shapes and synthetic perturbations, then
   *opt-in* testing with actual mouse, trackpad, touchscreen and stylus samples across
   learners, including motor-accessibility considerations. Measure false refusals,
   false acceptances, pen-up segmentation, writing style variance and performance.
6. **Possible ADA reuse**: reuse the matching core as an independent library, but do
   NOT assume Japanese-stroke order, Arabic joining or Latin cursive share one rubric.
   Different scripts need their own templates and language/pedagogical validation.

### Effort and risk
- Rough prototype for five vowels: approximately **1–3 development days**, depending on
  the desired demo fidelity, once the test harness is ready.
- Reliable 46+46 kana recognition with variants and diverse devices: **several
  iterations of testing and threshold calibration**; definitely not a trivial CSS
  add-on. The evaluation corpus and false-negative costs are the hard part.
- Before using in a CFA assessment: pedagogy/accessibility approval, manual alternative,
  minimised learner data, no hidden surveillance or irreversible automatic grade.

**Next decision:** experiment on five vowel kana without changing the existing progress
model, and review results with real user drawings before expanding.
