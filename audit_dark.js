const fs = require('fs');
const content = fs.readFileSync('c:/Users/sonis/Documents/FINAL/frontend/src/App.jsx', 'utf-8');
const lines = content.split('\n');

const darkRegex = /(#0[0-9a-f]{2,5}|#1[0-9a-f]{2,5}|#202|rgba\([0-2]?[0-9],|rgba\(0,0,0|bg-slate-[789]00|text-slate-[234]00|text-white|bg-black|border-white\/)/i;

lines.forEach((line, i) => {
  if (darkRegex.test(line)) {
    console.log(`${i+1}: ${line.trim()}`);
  }
});
