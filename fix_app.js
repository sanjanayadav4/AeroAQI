const fs = require('fs');

// 1. Append Weather override to index.css
const cssPath = 'c:/Users/sonis/Documents/FINAL/frontend/src/index.css';
let css = fs.readFileSync(cssPath, 'utf8');

const weatherOverride = `
/* WEATHER & ATMOSPHERE PROTECTION */
/* Revert the globally overridden variables back to dark mode specifically for the locked sections */
#weather-section, #weather-section * {
  --text-primary: #ffffff !important;
  --text-secondary: #cbd5e1 !important;
  --text-muted: #94a3b8 !important;
}
`;
if (!css.includes('#weather-section')) {
  fs.writeFileSync(cssPath, css + weatherOverride);
}

// 2. Fix remaining dark elements in App.jsx
const appPath = 'c:/Users/sonis/Documents/FINAL/frontend/src/App.jsx';
let app = fs.readFileSync(appPath, 'utf8');

// Line 1243
app = app.replace(
  /background:"rgba\(4,24,16,\.84\)",border:"1px solid rgba\(74,222,128,\.16\)",boxShadow:"0 35px 120px rgba\(0,0,0,\.58\),0 0 70px rgba\(34,197,94,\.08\)"/g,
  'background:"var(--surface)",border:"1px solid var(--border)",boxShadow:"var(--shadow-float)"'
);
// Line 1246
app = app.replace(
  /background:"linear-gradient\(135deg,rgba\(1,12,8,\.94\),rgba\(2,35,21,\.45\),rgba\(1,10,7,\.94\)\)"/g,
  'background:"linear-gradient(135deg,var(--surface),var(--surface-secondary),var(--surface))"'
);
// Line 1255 & 1740
app = app.replace(/text-slate-200\/80/g, 'text-[var(--text-secondary)]');
app = app.replace(/text-slate-200\/85/g, 'text-[var(--text-secondary)]');

// Line 1304
app = app.replace(/background:"#071a12"/g, 'background:"var(--background)"');

// Line 1505 (WRF Chem tab)
app = app.replace(/background:"rgba\(6,182,212,\.12\)"/g, 'background:"rgba(6,182,212,.08)"');

// Line 1640 Mobile Nav Panel
app = app.replace(/background: "rgba\(5, 20, 14, 0\.96\)"/g, 'background: "var(--surface)"');
app = app.replace(/boxShadow: "0 12px 30px rgba\(0,0,0,\.35\)"/g, 'boxShadow: "var(--shadow-float)"');

// Line 1734 About page hero
app = app.replace(
  /background:"#05200e",border:"1px solid rgba\(74,222,128,\.12\)",boxShadow:"0 24px 70px rgba\(0,0,0,\.35\)"/g,
  'background:"var(--surface)",border:"1px solid var(--border)",boxShadow:"var(--shadow-float)"'
);

// Line 1736 About page hero gradient
app = app.replace(
  /background:"linear-gradient\(90deg,rgba\(1,10,5,\.94\) 0%,rgba\(2,16,10,\.68\) 38%,rgba\(2,12,7,\.15\) 72%,rgba\(1,10,5,\.48\) 100%\)"/g,
  'background:"linear-gradient(90deg,var(--surface-secondary) 0%,var(--surface) 38%,transparent 72%,var(--surface-secondary) 100%)"'
);

// Line 1737 About page decorative bg
app = app.replace(
  /bg-\[radial-gradient\(circle_at_70%_35%,rgba\(34,197,94,\.12\),transparent_32%\),linear-gradient\(180deg,transparent,rgba\(1,10,5,\.52\)\)\]/g,
  'bg-[radial-gradient(circle_at_70%_35%,rgba(34,197,94,.06),transparent_32%),linear-gradient(180deg,transparent,var(--surface-secondary))]'
);

// Line 1743 About float cards
app = app.replace(/background:"rgba\(2,14,7,\.82\)"/g, 'background:"var(--surface)"');

// Line 1744 About marquee
app = app.replace(/background:"rgba\(1,10,5,\.6\)"/g, 'background:"var(--surface-secondary)"');

// Line 1755 AI Insights
app = app.replace(
  /background:"linear-gradient\(145deg,rgba\(7,40,27,\.9\),rgba\(5,18,14,\.95\)\)"/g,
  'background:"linear-gradient(145deg,var(--surface-secondary),var(--surface))"'
);
app = app.replace(/background:"rgba\(2,18,12,\.65\)"/g, 'background:"var(--surface)"');

// Line 1797 Search
app = app.replace(/background:"rgba\(2,8,23,\.6\)"/g, 'background:"var(--surface)"');

// Line 1802 Stations details card
app = app.replace(
  /background:"linear-gradient\(145deg,rgba\(34,197,94,\.05\),rgba\(6,18,38,\.45\)\)"/g,
  'background:"linear-gradient(145deg,var(--surface-secondary),var(--surface))"'
);

// Line 1892 ROOT div
app = app.replace(/background:"#03140D"/g, 'background:"var(--background)"');

// Line 1895 ROOT decorative circle
app = app.replace(/rgba\(22,163,74,\.07\)/g, 'rgba(16,185,129,.05)');

// Line 1899 Sidebar shadow
app = app.replace(/boxShadow:"4px 0 32px rgba\(0,0,0,\.4\)"/g, 'boxShadow:"var(--shadow-float)"');


fs.writeFileSync(appPath, app);
console.log('App.jsx and index.css updated successfully!');
