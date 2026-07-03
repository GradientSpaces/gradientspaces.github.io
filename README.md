# Gradient Spaces website

A standalone static website for the Gradient Spaces Lab at Stanford. It is fully
self-contained: all images live in this repo and no page depends on the previous
site at gradientspaces.stanford.edu.

## Files

- `index.html`: typographic home page with news, featured projects, and connect links.
- `people.html`: roster page populated from structured lab data.
- `research.html`: research themes, featured projects, publications, and datasets.
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
- **Publications**: edit `data.js` → `publications`. Entries with an `image` are
  eligible for the featured-project cards; the first three with images are shown.
- **Metrics**: the publication/dataset counts and year range on the research page
  are computed automatically from `data.js`.
- **News**: edit the news items directly in `index.html`.

## Design direction

- Sparse fixed header and narrow max-width layout.
- Large stacked typography on the homepage.
- Stanford cardinal accent with neutral text and restrained secondary colors.

Open `index.html` in a browser to preview. No build step is required.
