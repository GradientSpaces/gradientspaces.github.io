# Gradient Spaces website

A standalone static website for the Gradient Spaces Lab at Stanford. It is fully
self-contained: all images live in this repo and no page depends on the previous
site at gradientspaces.stanford.edu.

## Files

- `index.html`: typographic home page with the lab logo, autoplay group gallery,
  news, featured projects, and connect links.
- `people.html`: roster page populated from structured lab data.
- `research.html`: expandable research themes, featured projects, publications,
  and datasets.
- `teaching.html`: current Gradient Spaces courses and course-site links.
- `data.js`: structured roster, publication, chapter, and dataset data — the single
  place to edit content.
- `styles.css`: shared responsive visual system.
- `script.js`: mobile navigation and data rendering for people/research pages.
- `assets/images/`: locally hosted group photo, project teasers, and headshots.
- `assets/favicon.svg`: site favicon.
- `404.html`: not-found page (picked up automatically by GitHub Pages and most static hosts).
- `robots.txt`: allows all crawlers.

## Editing content

- **People**: edit `data.js` → `people` (faculty / current / alumni). Add a headshot
  to `assets/images/people/` and set `photo`; omit `photo` to show initials instead.
  Set `website` to link a member's personal site (omit it to show no link).
- **Join the lab**: set `data.js` → `joinFormUrl` to the Google Form URL. Until
  then, the final card in the current-member grid remains inactive.
- **Publications**: edit `data.js` → `publications`. Entries with an `image` are
  eligible for the featured-project cards; the first three with images are shown.
  Use each publication's `topics` array to include it in the expandable research
  theme panels.
- **Paper teasers (GIF/video)**: every publication row has a media slot on the
  left. Drop a file into `assets/media/` and set `media: "assets/media/<file>"`
  on the publication in `data.js`. GIFs and images render as-is; `.mp4`/`.webm`
  files autoplay muted on loop (much smaller than GIFs — prefer them). Without
  `media`, the slot falls back to the entry's `image`, or shows an empty
  placeholder.
- **News**: edit the news items directly in `index.html`.
- **Group gallery**: replace the lunch and outing placeholders in `index.html`
  when new photos are available; the gallery advances automatically.

## Design direction

- Sparse fixed header and narrow max-width layout.
- Large stacked typography on the homepage.
- Stanford cardinal accent with neutral text and restrained secondary colors.

Open `index.html` in a browser to preview. No build step is required.
