# HandEdit project page

Academic project website for **HandEdit: A Unified Benchmark for Egocentric Human-to-Robot Dexterous Hand Image Editing**.

## Local preview

Serve the repository root over HTTP so that videos and browser features behave as they will on GitHub Pages:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## Teaser video

The hero is already implemented as a video player. Add or replace:

```text
assets/videos/teaser.mp4
```

The page keeps `assets/figures/fig1-teaser.webp` as its poster and Open Graph image. No HTML or CSS change is required when the final MP4 is added.

Recommended format: MP4/H.264, 16:9, 1920x1080, web-optimized fast start. If narration carries essential information, add a captions track before public release.

## Embodiment-transfer keyframes

The transfer matrix uses eight strictly curated scenes. Each scene contains one Human row and three synchronized robot rows, with eight or ten synchronized frames per row:

```text
assets/transfer/
  cut/
  pour/
  place/
  mixer/
  laptop/
  tongs/
  chair/
  rearrange/
```

Frame files use zero-padded sequential names under `assets/transfer/<task>/<embodiment>/`. The accompanying `assets/transfer/manifest.json` records titles, row labels, frame counts, and aspect ratios.

## Main files

- `index.html` — semantic page structure and paper content
- `assets/style.css` — academic visual system and responsive layout
- `assets/main.js` — transfer matrix, embodiment explorer, leaderboard, tabs, lightbox, and navigation
- `assets/figures/` — paper figures and teaser poster
- `assets/renders/` — canonical hand and hand-arm renders
- `assets/transfer/` — optimized synchronized keyframes

## Release checklist

Before the public release:

1. Replace anonymous author, affiliation, repository, and BibTeX details.
2. Remove `noindex,nofollow,noarchive` from `index.html`.
3. Add canonical, `og:url`, and social card metadata.
4. Add the final teaser video and captions if needed.
5. Confirm all reported values against the camera-ready paper.

GitHub Pages serves the repository as a static site; `.nojekyll` is included so assets are published without Jekyll processing.
