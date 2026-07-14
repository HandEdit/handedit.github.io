# HandEdit 

This static website is redesigned from the latest `HandEdit_NeurIPS_2026.pdf` manuscript and follows the clean academic project-page rhythm of ManipTrans while adding benchmark-specific components.

## What changed from Version 1

- Updated title to **HandEdit: A Unified Benchmark for Egocentric Human-to-Robot Dexterous Hand Image Editing**.
- Updated headline statistics to **200M+ edits, 300K+ clips, 26 embodiments, 600+ scenes, 1.1K+ objects, 400+ tasks**.
- Updated benchmark structure to the manuscript's current **Hand-only** and **Hand-Arm** tracks.
- Updated baseline count to **11 representative editors**.
- Added real benchmark values from the latest manuscript Tables 3-6.
- Added actual manuscript figures for overview, data curation, failure modes, and VLM-based judgment.
- Added paired demo cards: source human video on the left, retargeted robot or robot-arm video on the right.
- Added demo filtering, responsive paired video layout, automatic visible-video playback, figure lightbox, and best/second-best result highlighting.
- Refined the typography and page rhythm against leading robotics project pages, with a restrained 16px type scale, a more compact hero, wider media canvas, and denser benchmark sections.
- Added four optimized real demo pairs (about 11 MB total) and matching poster frames for fast GitHub Pages delivery.

## Preview locally

From this directory:

```bash
python -m http.server 8080
```

Open:

```text
http://localhost:8080/
```

Do not open `index.html` directly with `file://` if you want the JSON leaderboard to load; use a local HTTP server.

## Demo videos

The website ships with four lightweight source/robot pairs in `assets/videos/`:

```text
demo-01-source.mp4
demo-01-robot.mp4
demo-02-source.mp4
demo-02-robot.mp4
demo-03-source.mp4
demo-03-robot.mp4
demo-04-source.mp4
demo-04-robot.mp4
```

The page automatically loads them when the cards enter the viewport. Matching WebP poster images in `assets/demo/` remain visible while media loads.

To replace a pair, keep the same filenames and encode web-ready H.264 MP4 files with `faststart` enabled. To add more pairs, duplicate one `.demo-pair` block in `index.html`, update the filenames and `data-demo-scope`, then add the new videos.

## Result data

Edit:

```text
data/leaderboard.json
```

The JavaScript automatically highlights best and second-best values by metric direction.

## Anonymous deployment checklist

Before deploying during double-blind review:

- Use a domain/repository that does not reveal author or lab identity.
- Keep authors and affiliation anonymous.
- Remove identifying Git commit names/emails from any published repository history.
- Strip EXIF and video metadata from new media.
- Do not add analytics, tracking IDs, university logos, personal links, or identifiable cloud project names.
- Re-check the current NeurIPS policy before making a paper link public.

## GitHub Pages

For a simple static repository, upload the folder contents to the anonymous deployment repository and publish the root directory with GitHub Pages or another static host.
