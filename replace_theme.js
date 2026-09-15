const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'frontend', 'src', 'App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

// Tailwind classes
content = content.replace(/text-white/g, 'text-[var(--text-primary)]');
content = content.replace(/hover:text-white/g, 'hover:text-[var(--text-primary)]');
content = content.replace(/text-slate-300/g, 'text-[var(--text-secondary)]');
content = content.replace(/text-slate-400/g, 'text-[var(--text-muted)]');
content = content.replace(/text-slate-500/g, 'text-[var(--text-muted)]');
content = content.replace(/text-slate-600/g, 'text-[var(--text-muted)]');
content = content.replace(/bg-\[\#061b12\]/g, 'bg-[var(--surface)]');
content = content.replace(/bg-\[\#03140D\]/g, 'bg-[var(--background)]');
content = content.replace(/bg-\[\#08251a\]/g, 'bg-[var(--surface-secondary)]');
content = content.replace(/border-white\/\[0\.0[5678]\]/g, 'border-[var(--border)]');
content = content.replace(/hover:bg-white\/\[0\.0[456]\]/g, 'hover:bg-[var(--surface-hover)]');

// Inline styles replacements
content = content.replace(/rgba\(2,8,23,\.55\)/g, 'var(--surface)');
content = content.replace(/rgba\(7,28,20,\.82\)/g, 'var(--surface)');
content = content.replace(/rgba\(255,255,255,\.025\)/g, 'var(--surface-secondary)');
content = content.replace(/rgba\(255,255,255,\.0[3456]\)/g, 'var(--surface-hover)');
content = content.replace(/rgba\(255,255,255,\.0[78]\)/g, 'var(--surface-hover)');
content = content.replace(/rgba\(255,255,255,\.12\)/g, 'var(--surface-hover)');
content = content.replace(/#0a1522/g, 'var(--surface)');
content = content.replace(/rgba\(2,12,7,\.92\)/g, 'var(--surface)');

// Root gradient replacement for the main App div
content = content.replace(
  /background:"linear-gradient\(135deg,#03140d,#05251a 45%,#06131b\)"/g,
  'background:"var(--background)"'
);

// Map container background
content = content.replace(
  /background:"rgba\(3,14,8,\.92\)"/g,
  'background:"var(--surface)"'
);
content = content.replace(
  /background:"rgba\(2,10,5,\.95\)"/g,
  'background:"var(--surface)"'
);

// Map markers
content = content.replace(
  /background:"rgba\(0,0,0,\.75\)"/g,
  'background:"var(--surface)", color:"var(--text-primary)"'
);
content = content.replace(
  /border-white\/30/g,
  'border-[var(--border)]'
);

// Replace hover states in inline styles, wait, better not to regex too aggressively on inline styles.
// We handled the main rgba(255,255,255,...) which were borders and backgrounds.

fs.writeFileSync(appPath, content);
console.log('Replaced successfully');
