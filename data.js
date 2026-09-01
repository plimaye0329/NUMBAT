// NUMBAT pulsar discovery catalog.
//
// Add one object per pulsar to the PULSARS array below.
// Fields:
//   psrj        - string, pulsar name, e.g. "J1723-2837"
//   period_ms   - number, spin period in milliseconds
//   dm          - number, dispersion measure in pc/cm^3
//   binary      - true, false, or "unknown"
//   disc_date   - string, "YYYY-MM-DD"
//   project     - "GBPS" (Murriyang/Parkes) or "MGBS" (MeerKAT)
//   png         - path to the diagnostic plot PNG, relative to index.html
//                 (drop the file into assets/plots/ and point to it here;
//                 leave as "" if you haven't added the plot yet)
//   obs_date    - string, "YYYY-MM-DD" (optional, shown in modal)
//   obs_band    - string, e.g. "UHF", "L-band" (optional, shown in modal)
//   snr         - number, discovery S/N (optional, shown in modal)
//   pipeline    - string, e.g. "PEASOUP" (optional, shown in modal)

const PULSARS = [
  {
    psrj: "J1742-2731",
    period_ms: 333.27,
    dm: 330.17,
    binary: false,
    disc_date: "2026-08-10",
    project: "GBPS",
    png: "assets/plots/GBPS_cand1.png",
    obs_date: "2026-06-22",
    obs_band: "CryoPAF-High",
    snr: 20.6,
    pipeline: "Presto"
  },
  
  {
    psrj: "J1738-2845",
    period_ms: 4.59,
    dm: 390.83,
    binary: "True",
    disc_date: "2026-08-02",
    project: "GBPS",
    png: "assets/plots/GBPS_cand2.png",
    obs_date: "2026-08-24",
    obs_band: "CryoPAF-High",
    snr: 15.5,
    pipeline: "Presto"
  },
  {
    psrj: "J1736-2706",
    period_ms: 315.59,
    dm: 177.56,
    binary: false,
    disc_date: "2025-02-24",
    project: "MGBS",
    png: "",
    obs_date: "--",
    obs_band: "MeerKAT L-Band",
    snr: "-",
    pipeline: "Peasoup"
  }
  
  
];
