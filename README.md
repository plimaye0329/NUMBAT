# NUMBAT Pulsar Catalog

A static webpage cataloging pulsar discoveries from NUMBAT (New Ultra deep
survey of Millisecond pulsars in the Bulge using Array based radio
Telescopes), covering:

- **GBPS** — Galactic Bulge Murriyang (Parkes) Survey
- **MGBS** — MeerKAT Galactic Bulge Survey

## Adding a new discovery

1. Open `data.js`.
2. Copy one of the existing objects in the `PULSARS` array and fill in the
   new pulsar's details. Field descriptions are in the comment at the top
   of the file.
3. If you have a diagnostic plot PNG for this pulsar, drop it anywhere
   inside `assets/plots/` and set the `png` field to its path, e.g.
   `"assets/plots/J1723-2837.png"`. If you don't have one yet, leave
   `png: ""` — the modal will show "Diagnostic plot not yet added"
   instead of a broken image.
4. Save, commit, and push. That's it — no build step.

## Running locally to preview changes

Just open `index.html` in a browser, or serve the folder locally, e.g.:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Publishing to GitHub Pages

1. Create a new repository (either `<username>.github.io` for a user site,
   or any repo name for a project site).
2. Push the contents of this folder to the repository's default branch.
3. In the repo settings, go to **Pages** and set the source to the branch
   you pushed (root folder).
4. Your site will be live at `https://<username>.github.io/` (user site)
   or `https://<username>.github.io/<repo-name>/` (project site) within a
   few minutes.

## File structure

```
index.html          Page structure
style.css            Styling
data.js              The pulsar catalog — edit this to add discoveries
app.js               Stats bar, scatter plot, table, and modal logic
assets/plots/        Diagnostic plot PNGs (add manually, any filenames)
```

## Notes for future changes

- To add/remove table columns, edit the `COLUMNS` array at the top of
  `app.js` and add the matching field to each pulsar object in `data.js`.
- The scatter plot's x/y axis dropdowns pull from `COLUMNS` labels, so any
  new numeric field (e.g. distance, S/N) can be added as an axis option
  in `index.html`'s `<select>` elements.
- Colors: GBPS = amber (`#e3a857`), MGBS = teal (`#4fb8c4`), set in
  `PROJECT_COLORS` in `app.js` and `:root` in `style.css`.
