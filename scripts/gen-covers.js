const sharp = require("sharp");
const path = require("path");

const OUT = "F:/qa-portfolio/public/projects";
const bg = "#101216";
const line = "#242933";
const faint = "#697180";
const muted = "#9aa1ad";
const fg = "#eceef2";
const mono = "Consolas, 'Courier New', monospace";
const sans = "Arial, sans-serif";

// --- Match-3 QA Framework ---
let tiles = "";
const kinds = [
  ["", "sq", "ci"],
  ["tr", "sq", ""],
  ["ci", "", "tr"],
  ["", "tr", "sq"],
];
const ts = 92, gap = 14, ox = 760, oy = 130;
for (let r = 0; r < 4; r++) {
  for (let c = 0; c < 3; c++) {
    const x = ox + c * (ts + gap), y = oy + r * (ts + gap);
    tiles += `<rect x="${x}" y="${y}" width="${ts}" height="${ts}" rx="14" fill="#15181d" stroke="${line}" stroke-width="1.5"/>`;
    const k = kinds[r][c], cx = x + ts / 2, cy = y + ts / 2;
    if (k === "sq") tiles += `<rect x="${cx - 16}" y="${cy - 16}" width="32" height="32" fill="none" stroke="${faint}" stroke-width="2"/>`;
    if (k === "ci") tiles += `<circle cx="${cx}" cy="${cy}" r="18" fill="none" stroke="${faint}" stroke-width="2"/>`;
    if (k === "tr") tiles += `<path d="M${cx} ${cy - 18} L${cx + 18} ${cy + 14} L${cx - 18} ${cy + 14} Z" fill="none" stroke="${faint}" stroke-width="2"/>`;
  }
}
const hx = ox + 1 * (ts + gap), hy = oy + 2 * (ts + gap);
tiles += `<rect x="${hx}" y="${hy}" width="${ts}" height="${ts}" rx="14" fill="none" stroke="${fg}" stroke-width="2"/>`;
tiles += `<path d="M${hx + 28} ${hy + 48} L${hx + 42} ${hy + 62} L${hx + 66} ${hy + 32}" fill="none" stroke="${fg}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;

const svg1 = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720">
<rect width="1280" height="720" fill="${bg}"/>
${tiles}
<text x="90" y="220" font-family="${mono}" font-size="22" fill="${faint}">$ run suite --all-levels</text>
<text x="90" y="270" font-family="${mono}" font-size="22" fill="${muted}">validating level 247 ........ ok</text>
<text x="90" y="312" font-family="${mono}" font-size="22" fill="${muted}">event system ................ ok</text>
<text x="90" y="354" font-family="${mono}" font-size="22" fill="${muted}">monetization flows .......... ok</text>
<text x="90" y="420" font-family="${mono}" font-size="22" fill="${fg}">128 passed &#183; 0 failed &#183; 3m12s</text>
<text x="90" y="480" font-family="${mono}" font-size="22" fill="${faint}">$ _</text>
<text x="90" y="600" font-family="${sans}" font-size="44" font-weight="600" fill="${fg}">Match-3 QA Framework</text>
<text x="92" y="640" font-family="${mono}" font-size="20" fill="${faint}" letter-spacing="2">AUTOMATED TESTING &#183; MOBILE GAMES</text>
</svg>`;

// --- Fitness AI ---
let grid = "";
for (let y = 160; y <= 560; y += 80) grid += `<line x1="90" y1="${y}" x2="1190" y2="${y}" stroke="${line}" stroke-width="1" opacity="0.6"/>`;
let hist = "";
const pts = [];
for (let i = 0; i <= 14; i++) { const x = 90 + i * 55, y = 520 - i * 22 - Math.sin(i * 1.7) * 18; pts.push([x, y]); }
hist = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
const fpts = [];
for (let i = 0; i <= 6; i++) { const x = 860 + i * 55, y = 232 - i * 20; fpts.push([x, y]); }
const fpath = fpts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
let band = `M860 232 ` + fpts.map(([x, y]) => `L${x} ${y - 14 - ((x - 860) / 330) * 30}`).join(" ");
for (let i = fpts.length - 1; i >= 0; i--) { const [x, y] = fpts[i]; band += ` L${x} ${y + 14 + ((x - 860) / 330) * 30}`; }
band += " Z";

const svg2 = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720">
<rect width="1280" height="720" fill="${bg}"/>
${grid}
<path d="${band}" fill="${faint}" opacity="0.12"/>
<path d="${hist}" fill="none" stroke="${muted}" stroke-width="2.5"/>
<path d="${fpath}" fill="none" stroke="${fg}" stroke-width="2" stroke-dasharray="8 7"/>
<circle cx="860" cy="232" r="5" fill="${fg}"/>
<text x="880" y="180" font-family="${mono}" font-size="20" fill="${faint}">forecast &#183; confidence 87%</text>
<text x="90" y="600" font-family="${sans}" font-size="44" font-weight="600" fill="${fg}">Fitness AI</text>
<text x="92" y="640" font-family="${mono}" font-size="20" fill="${faint}" letter-spacing="2">PREDICTIVE TRAINING &#183; AI COACH &#183; PWA</text>
</svg>`;

Promise.all([
  sharp(Buffer.from(svg1)).jpeg({ quality: 92 }).toFile(path.join(OUT, "match3-framework.jpg")),
  sharp(Buffer.from(svg2)).jpeg({ quality: 92 }).toFile(path.join(OUT, "fitness-ai.jpg")),
]).then(() => console.log("covers written")).catch((e) => { console.error(e.message); process.exit(1); });
