# NUMBAT Pulsar Catalog

A webpage cataloging pulsar discoveries from NUMBAT (New Ultra deep survey
of Millisecond pulsars in the Bulge using Array based radio Telescopes),
covering:

- **GBPS** — Galactic Bulge Murriyang (Parkes) Survey
- **MGBS** — MeerKAT Galactic Bulge Survey

## Files

```
index.html          Interactive page (Graph + Table tabs, click-through modal)
style.css            Styling
app.js               Fetches data.json and renders the interactive page
data.json            THE catalog — single source of truth, edit this
generate_plain.py    Script that builds plain.html from data.json
plain.html           Plain, script-free HTML table (auto-generated — don't hand-edit)
assets/plots/        Diagnostic plot PNGs (add manually, any filenames)
```

`data.json` is the only file you edit by hand to add discoveries.
`index.html` reads it live in the browser. `plain.html` is a static,
pre-rendered copy of the same data for anyone (or any script) that wants
to read the catalog without running JavaScript — e.g. a scraper.

## Adding a new discovery

1. Open `data.json`. It's a plain JSON array — add a new object.

   ```json
   {
     "psrj": "J1815-3423",
     "ra_deg": 273.9,
     "dec_deg": -34.4,
     "period_ms": 5.71,
     "dm": 312.4,
     "disc_date": "2026-08-20",
     "project": "GBPS",
     "png": "assets/plots/J1815-3423.png",
     "obs_date": "2026-08-10",
     "obs_band": "UHF",
     "snr": 16.8,
     "pipeline": "PEASOUP"
   }
   ```

   Field notes:
   - `psrj` — pulsar name, string
   - `ra_deg`, `dec_deg` — position in decimal degrees, numbers
   - `period_ms` — spin period in ms, number
   - `dm` — dispersion measure in pc/cm³, number
   - `disc_date`, `obs_date` — `"YYYY-MM-DD"` strings
   - `project` — `"GBPS"` or `"MGBS"`
   - `png` — path to the diagnostic plot, relative to the repo root, or
     `""` if you haven't added the plot yet
   - `obs_band`, `pipeline` — free-text strings
   - `snr` — number

   **JSON syntax reminders:** every entry needs a comma after it except
   the last one in the array; keys and string values need double quotes;
   numbers don't. If the page breaks after an edit, this is the first
   thing to check — any JSON validator (or `python3 -m json.tool
   data.json`) will point out the exact problem.

2. If you have a diagnostic plot PNG, drop it into `assets/plots/`
   (any filename) and point `png` at it.

3. Regenerate the plain HTML table:

   ```
   python3 generate_plain.py
   ```

4. Save, commit, and push.

## Running locally to preview changes

`index.html` fetches `data.json` with JavaScript's `fetch()`, which most
browsers block when opening a file directly (`file://...`). Serve the
folder locally instead:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`. `plain.html` has no such restriction
and can be opened directly by double-clicking it.

## Publishing to GitHub Pages

1. Create a repository (e.g. `NUMBAT`), public.
2. Push this folder's contents to the default branch.
3. In the repo's **Settings → Pages**, set source to "Deploy from a
   branch", branch `main`, folder `/ (root)`. Save.
4. Site goes live at `https://<username>.github.io/NUMBAT/` within a
   couple of minutes.

Once live, the machine-readable catalog is directly fetchable at:

```
https://<username>.github.io/NUMBAT/data.json
```

and the plain HTML table at:

```
https://<username>.github.io/NUMBAT/plain.html
```

Share either of those links with anyone who wants to parse the catalog
programmatically, instead of the interactive `index.html` page.

## Notes for future changes

- To add/remove table columns on the interactive page, edit the
  `COLUMNS` array at the top of `app.js`, and add the matching key to
  `COLUMNS` in `generate_plain.py` if you want it in `plain.html` too.
- Colors: GBPS = amber (`#e3a857`), MGBS = teal (`#4fb8c4`), set in
  `PROJECT_COLORS` in `app.js` and `:root` in `style.css`.
