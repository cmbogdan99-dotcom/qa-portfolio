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

// --- Finance AR/MR Application (internal, unreleased — abstract cover) ---
// Floating mixed-reality panels in light perspective, one with a chart.
const panel = (x, y, w, h, skew, content = "") => `
<g transform="translate(${x},${y}) skewY(${skew})">
  <rect width="${w}" height="${h}" rx="12" fill="#15181d" stroke="${line}" stroke-width="1.5" opacity="0.95"/>
  ${content}
</g>`;

const chartInPanel = `
<polyline points="30,120 80,95 130,105 180,70 230,78 280,45" fill="none" stroke="${muted}" stroke-width="2.5"/>
<line x1="30" y1="150" x2="290" y2="150" stroke="${line}" stroke-width="1"/>
<rect x="30" y="30" width="90" height="10" rx="5" fill="${line}"/>
`;

const rows = `
<rect x="25" y="30" width="130" height="9" rx="4.5" fill="${line}"/>
<rect x="25" y="55" width="90" height="9" rx="4.5" fill="${line}"/>
<rect x="25" y="80" width="110" height="9" rx="4.5" fill="${line}"/>
<circle cx="185" cy="35" r="7" fill="none" stroke="${faint}" stroke-width="1.5"/>
<path d="M181 35l3 3 5 -6" fill="none" stroke="${faint}" stroke-width="1.5"/>
`;

const svg3 = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720">
<rect width="1280" height="720" fill="${bg}"/>
<ellipse cx="880" cy="640" rx="360" ry="26" fill="#15181d" opacity="0.6"/>
${panel(560, 150, 320, 190, -3, chartInPanel)}
${panel(930, 210, 220, 130, 4, rows)}
${panel(700, 380, 250, 120, 2, `<rect x="25" y="28" width="120" height="9" rx="4.5" fill="${line}"/><rect x="25" y="52" width="160" height="9" rx="4.5" fill="${line}"/><rect x="25" y="76" width="80" height="9" rx="4.5" fill="${line}"/>`)}
<circle cx="545" cy="145" r="3" fill="${faint}"/>
<circle cx="1165" cy="205" r="3" fill="${faint}"/>
<circle cx="960" cy="515" r="3" fill="${faint}"/>
<text x="90" y="600" font-family="${sans}" font-size="44" font-weight="600" fill="${fg}">Finance AR/MR Application</text>
<text x="92" y="640" font-family="${mono}" font-size="20" fill="${faint}" letter-spacing="2">INTERNAL PRODUCT &#183; MIXED REALITY</text>
</svg>`;

Promise.all([
  sharp(Buffer.from(svg1)).jpeg({ quality: 92 }).toFile(path.join(OUT, "match3-framework.jpg")),
  sharp(Buffer.from(svg2)).jpeg({ quality: 92 }).toFile(path.join(OUT, "fitness-ai.jpg")),
  sharp(Buffer.from(svg3)).jpeg({ quality: 92 }).toFile(path.join(OUT, "finance-ar.jpg")),
]).then(() => console.log("covers written")).catch((e) => { console.error(e.message); process.exit(1); });
