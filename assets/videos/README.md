# Demo video slots

Put your real videos in this folder using these filenames:

- `demo-01-source.mp4` and `demo-01-robot.mp4`
- `demo-02-source.mp4` and `demo-02-robot.mp4`
- `demo-03-source.mp4` and `demo-03-robot.mp4`
- `demo-04-source.mp4` and `demo-04-robot.mp4`

The website already uses `<video muted loop playsinline>` and will autoplay real files when visible. Until the MP4s are added, the page shows poster images extracted from the latest manuscript figures.

Recommended export for GitHub Pages:

```bash
ffmpeg -i input.mp4 -vf "scale='min(1280,iw)':-2" -c:v libx264 -crf 26 -preset medium -movflags +faststart -an output.mp4
```

For many demos, keep each clip short (roughly 3-10 seconds) and preferably under 10-15 MB.
