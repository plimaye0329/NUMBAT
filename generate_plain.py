#!/usr/bin/env python3
"""
Generate plain.html from data.json.

plain.html is a plain static HTML table with every value baked directly
into the markup (no JavaScript required to read it) -- intended for
scrapers or anyone who wants to parse the catalog without executing JS.

Run this after every edit to data.json:

    python3 generate_plain.py

It overwrites plain.html.
"""

import json
import html
from pathlib import Path

DATA_FILE = Path(__file__).parent / "data.json"
OUTPUT_FILE = Path(__file__).parent / "plain.html"

COLUMNS = [
    ("psrj", "PSRJ"),
    ("ra_deg", "RA (deg)"),
    ("dec_deg", "Dec (deg)"),
    ("period_ms", "Period (ms)"),
    ("dm", "DM (pc cm^-3)"),
    ("disc_date", "Disc. date"),
    ("project", "Project"),
    ("png", "Diagnostic plot"),
    ("obs_date", "Obs. date"),
    ("obs_band", "Obs. band"),
    ("snr", "Discovery S/N"),
    ("pipeline", "Pipeline"),
]


def esc(value):
    if value is None:
        return ""
    return html.escape(str(value))


def build_row(entry):
    cells = []
    for key, _ in COLUMNS:
        value = entry.get(key, "")
        if key == "png" and value:
            cells.append(f'<td><a href="{esc(value)}">{esc(value)}</a></td>')
        else:
            cells.append(f"<td>{esc(value)}</td>")
    return "<tr>\n      " + "\n      ".join(cells) + "\n    </tr>"


def build_table(entries):
    header = "\n      ".join(f"<th>{esc(label)}</th>" for _, label in COLUMNS)
    rows = "\n    ".join(build_row(e) for e in entries)
    return f"""  <table>
    <thead>
      <tr>
      {header}
      </tr>
    </thead>
    <tbody>
    {rows}
    </tbody>
  </table>"""


def main():
    entries = json.loads(DATA_FILE.read_text())
    total = len(entries)
    gbps = sum(1 for e in entries if e.get("project") == "GBPS")
    mgbs = sum(1 for e in entries if e.get("project") == "MGBS")

    table_html = build_table(entries)

    page = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>NUMBAT Pulsar Catalog - Plain Table</title>
<style>
  body {{ font-family: monospace; margin: 2rem; }}
  table {{ border-collapse: collapse; width: 100%; }}
  th, td {{ border: 1px solid #999; padding: 4px 8px; text-align: left; }}
  th {{ background: #eee; }}
</style>
</head>
<body>
<h1>NUMBAT Pulsar Catalog</h1>
<p>Plain, script-free table generated from data.json. Total discoveries: {total} (GBPS: {gbps}, MGBS: {mgbs}).</p>
<p>Machine-readable source: <a href="data.json">data.json</a></p>
{table_html}
</body>
</html>
"""
    OUTPUT_FILE.write_text(page)
    print(f"Wrote {OUTPUT_FILE} ({total} entries)")


if __name__ == "__main__":
    main()
