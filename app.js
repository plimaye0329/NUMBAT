const PROJECT_COLORS = { GBPS: "#e3a857", MGBS: "#4fb8c4" };
const PROJECT_LABELS = { GBPS: "GBPS (Parkes)", MGBS: "MGBS (MeerKAT)" };

const COLUMNS = [
  { key: "psrj", label: "PSRJ" },
  { key: "period_ms", label: "Period (ms)" },
  { key: "dm", label: "DM (pc cm⁻³)" },
  { key: "binary", label: "Binary" },
  { key: "disc_date", label: "Disc. date" },
  { key: "project", label: "Project" }
];

let sortState = { key: "disc_date", dir: "desc" };
let hiddenColumns = new Set();

function renderStats() {
  const total = PULSARS.length;
  const gbps = PULSARS.filter(p => p.project === "GBPS").length;
  const mgbs = PULSARS.filter(p => p.project === "MGBS").length;

  const bar = document.getElementById("stats-bar");
  bar.innerHTML = `
    <div class="stat">
      <span class="stat-value">${total}</span>
      <span class="stat-label">Total discoveries</span>
    </div>
    <div class="stat stat-gbps">
      <span class="stat-value">${gbps}</span>
      <span class="stat-label">GBPS (Parkes)</span>
    </div>
    <div class="stat stat-mgbs">
      <span class="stat-value">${mgbs}</span>
      <span class="stat-label">MGBS (MeerKAT)</span>
    </div>
  `;

  document.getElementById("last-updated").textContent =
    "Last updated: " + new Date().toISOString().slice(0, 16).replace("T", " ");
}

function renderScatter() {
  const xKey = document.getElementById("x-axis-select").value;
  const yKey = document.getElementById("y-axis-select").value;
  const logX = document.getElementById("log-x").checked;
  const logY = document.getElementById("log-y").checked;
  const axisLabel = key => COLUMNS.find(c => c.key === key).label;

  const traces = ["GBPS", "MGBS"].map(project => {
    const pts = PULSARS.filter(p => p.project === project);
    return {
      x: pts.map(p => p[xKey]),
      y: pts.map(p => p[yKey]),
      customdata: pts.map(p => p.psrj),
      text: pts.map(p => p.psrj),
      mode: "markers",
      type: "scatter",
      name: PROJECT_LABELS[project],
      marker: { color: PROJECT_COLORS[project], size: 10, opacity: 0.85 },
      hovertemplate: "%{text}<extra></extra>"
    };
  });

  const layout = {
    paper_bgcolor: "#171b24",
    plot_bgcolor: "#171b24",
    font: { color: "#e9e7e2", family: "Inter, sans-serif" },
    margin: { t: 30, r: 20, l: 60, b: 55 },
    xaxis: { title: axisLabel(xKey), type: logX ? "log" : "linear", gridcolor: "#2a3040" },
    yaxis: { title: axisLabel(yKey), type: logY ? "log" : "linear", gridcolor: "#2a3040" },
    legend: { orientation: "h", y: -0.2 },
    height: 500
  };

  Plotly.newPlot("scatter", traces, layout, { responsive: true, displaylogo: false });

  document.getElementById("scatter").on("plotly_click", evt => {
    const psrj = evt.points[0].customdata;
    openModal(psrj);
  });
}

function formatBinary(v) {
  if (v === true) return "Binary";
  if (v === false) return "Isolated";
  return "Unknown";
}
function getFilteredSortedData(filters) {
  let rows = PULSARS.filter(row =>
    COLUMNS.every(col => {
      const f = (filters[col.key] || "").toLowerCase();
      if (!f) return true;
      const val = col.key === "binary" ? formatBinary(row.binary) : String(row[col.key]);
      return val.toLowerCase().includes(f);
    })
  );

  const { key, dir } = sortState;
  rows.sort((a, b) => {
    let av = a[key], bv = b[key];
    if (key === "binary") { av = formatBinary(av); bv = formatBinary(bv); }
    if (typeof av === "number" && typeof bv === "number") {
      return dir === "asc" ? av - bv : bv - av;
    }
    av = String(av); bv = String(bv);
    return dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  return rows;
}

function renderTable() {
  const headerRow = document.getElementById("table-header-row");
  const filterRow = document.getElementById("table-filter-row");
  headerRow.innerHTML = "";
  filterRow.innerHTML = "";

  COLUMNS.forEach(col => {
    if (hiddenColumns.has(col.key)) return;

    const th = document.createElement("th");
    let arrow = "";
    if (sortState.key === col.key) arrow = sortState.dir === "asc" ? " ▲" : " ▼";
    th.innerHTML = `${col.label}<span class="sort-arrow">${arrow}</span>`;
    th.addEventListener("click", () => {
      if (sortState.key === col.key) {
        sortState.dir = sortState.dir === "asc" ? "desc" : "asc";
      } else {
        sortState = { key: col.key, dir: "asc" };
      }
      renderTable();
    });
    headerRow.appendChild(th);

    const td = document.createElement("td");
    const input = document.createElement("input");
    input.placeholder = "filter…";
    input.dataset.key = col.key;
    input.value = currentFilters[col.key] || "";
    input.addEventListener("input", e => {
      currentFilters[col.key] = e.target.value;
      renderTableBody();
    });
    td.appendChild(input);
    filterRow.appendChild(td);
  });

  renderTableBody();
}

let currentFilters = {};

function renderTableBody() {
  const tbody = document.getElementById("table-body");
  tbody.innerHTML = "";
  const rows = getFilteredSortedData(currentFilters);

  rows.forEach(row => {
    const tr = document.createElement("tr");
    tr.addEventListener("click", () => openModal(row.psrj));

    COLUMNS.forEach(col => {
      if (hiddenColumns.has(col.key)) return;
      const td = document.createElement("td");
      if (col.key === "project") {
        td.innerHTML = `<span class="badge badge-${row.project.toLowerCase()}">${row.project}</span>`;
      } else if (col.key === "binary") {
        td.textContent = formatBinary(row.binary);
      } else {
        td.textContent = row[col.key];
      }
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}

function renderColumnToggle() {
  const menu = document.getElementById("toggle-columns-menu");
  menu.innerHTML = "";
  COLUMNS.forEach(col => {
    const label = document.createElement("label");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = !hiddenColumns.has(col.key);
    cb.addEventListener("change", () => {
      if (cb.checked) hiddenColumns.delete(col.key);
      else hiddenColumns.add(col.key);
      renderTable();
    });
    label.appendChild(cb);
    label.appendChild(document.createTextNode(col.label));
    menu.appendChild(label);
  });
}

function openModal(psrj) {
  const p = PULSARS.find(x => x.psrj === psrj);
  if (!p) return;

  document.getElementById("modal-title").textContent = p.psrj;

  const img = document.getElementById("modal-image");
  const missing = document.getElementById("modal-image-missing");
  if (p.png) {
    img.src = p.png;
    img.classList.remove("hidden");
    missing.classList.add("hidden");
    img.onerror = () => { img.classList.add("hidden"); missing.classList.remove("hidden"); };
  } else {
    img.classList.add("hidden");
    missing.classList.remove("hidden");
  }

  document.getElementById("modal-params").innerHTML = `
    <dt>Period</dt><dd>${p.period_ms} ms</dd>
    <dt>Dispersion measure</dt><dd>${p.dm} pc cm⁻³</dd>
    <dt>Binary</dt><dd>${formatBinary(p.binary)}</dd>
  `;

  document.getElementById("modal-discovery").innerHTML = `
    <dt>Discovery date</dt><dd>${p.disc_date}</dd>
    <dt>Observation date</dt><dd>${p.obs_date || "—"}</dd>
    <dt>Observation band</dt><dd>${p.obs_band || "—"}</dd>
    <dt>Discovery S/N</dt><dd>${p.snr ?? "—"}</dd>
    <dt>Pipeline</dt><dd>${p.pipeline || "—"}</dd>
    <dt>Project</dt><dd>${PROJECT_LABELS[p.project] || p.project}</dd>
  `;

  document.getElementById("modal-overlay").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal-overlay").classList.add("hidden");
}

function setupTabs() {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => { b.classList.remove("active"); b.setAttribute("aria-selected", "false"); });
      document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      document.getElementById(btn.dataset.tab + "-panel").classList.add("active");
      if (btn.dataset.tab === "graph") renderScatter();
    });
  });
}

function setupGraphControls() {
  ["x-axis-select", "y-axis-select", "log-x", "log-y"].forEach(id => {
    document.getElementById(id).addEventListener("change", renderScatter);
  });
}

function setupColumnToggle() {
  const btn = document.getElementById("toggle-columns-btn");
  const menu = document.getElementById("toggle-columns-menu");
  btn.addEventListener("click", e => {
    e.stopPropagation();
    menu.classList.toggle("hidden");
  });
  document.addEventListener("click", () => menu.classList.add("hidden"));
  menu.addEventListener("click", e => e.stopPropagation());
}

function setupModal() {
  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-overlay").addEventListener("click", e => {
    if (e.target.id === "modal-overlay") closeModal();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
  });
}

renderStats();
renderColumnToggle();
renderTable();
setupTabs();
setupGraphControls();
setupColumnToggle();
setupModal();
renderScatter();
