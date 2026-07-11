// Generates the favicon (src/app/icon.png) and the Open Graph image
// (public/og.png). Rerun with: node scripts/gen-brand.js
const sharp = require("sharp");

const bug = (size, color) => `
<g transform="scale(${size / 20})" stroke="${color}" fill="${color}">
  <path d="M7 3.5L5.5 1.5M13 3.5l1.5-2" fill="none" stroke-width="1" stroke-linecap="round"/>
  <path d="M4.5 8L2 6.5M4.5 11H1.5M4.5 14L2 15.5M15.5 8L18 6.5M15.5 11h3M15.5 14l2.5 1.5" fill="none" stroke-width="1" stroke-linecap="round"/>
  <ellipse cx="10" cy="11" rx="5.5" ry="7" stroke="none" opacity="0.9"/>
  <circle cx="10" cy="4.5" r="2.2" stroke="none"/>
  <path d="M10 5.5v12" fill="none" stroke="#101216" stroke-width="0.8"/>
</g>`;

const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
<rect width="64" height="64" rx="14" fill="#101216"/>
<g transform="translate(9,9)">${bug(46, "#eceef2")}</g>
</svg>`;

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
<rect width="1200" height="630" fill="#0a0b0d"/>
<rect x="0.5" y="0.5" width="1199" height="629" fill="none" stroke="#242933"/>
<text x="90" y="150" font-family="Consolas, monospace" font-size="24" letter-spacing="4" fill="#697180">SENIOR QA ENGINEER &#183; BUCHAREST, ROMANIA</text>
<text x="86" y="260" font-family="Arial, sans-serif" font-size="88" font-weight="700" fill="#eceef2">Bogdan Carcadea</text>
<text x="90" y="340" font-family="Arial, sans-serif" font-size="32" fill="#9aa1ad">Quality strategy, release ownership and test automation</text>
<text x="90" y="390" font-family="Arial, sans-serif" font-size="32" fill="#9aa1ad">across PC, console, mobile, browser and VR.</text>
<line x1="90" y1="470" x2="1110" y2="470" stroke="#242933"/>
<text x="90" y="530" font-family="Consolas, monospace" font-size="26" fill="#697180">5+ years &#183; 10,000+ defects &#183; 15+ projects</text>
<g transform="translate(1020,500)">${bug(64, "#697180")}</g>
</svg>`;

Promise.all([
  sharp(Buffer.from(icon)).png().toFile("F:/qa-portfolio/src/app/icon.png"),
  sharp(Buffer.from(og)).png().toFile("F:/qa-portfolio/public/og.png"),
]).then(() => console.log("brand assets written")).catch((e) => { console.error(e.message); process.exit(1); });
