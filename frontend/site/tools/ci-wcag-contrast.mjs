// tools/ci-wcag-contrast.mjs
// CI WCAG: valida contraste AA normal (≥4.5:1) en pares clave Light/Dark a partir de css/variables.css
import fs from "node:fs";
import path from "node:path";

const VARS_FILE = path.resolve("css/variables.css");

function readFile(p) {
  return fs.readFileSync(p, "utf8");
}

function extractBlock(css, selector) {
  const re = new RegExp(`${selector}\\s*\\{([\\s\\S]*?)\\}`, "m");
  const m = css.match(re);
  return m ? m[1] : "";
}

function parseVars(block) {
  const out = {};
  const declRe = /(--[a-zA-Z0-9-_]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = declRe.exec(block))) {
    out[m[1]] = m[2].trim();
  }
  return out;
}

function resolveVar(map, name, seen = new Set()) {
  const key = name.startsWith("--") ? name : `--${name}`;
  const v = map[key];
  if (!v) return null;
  if (/^var\(/i.test(v)) {
    const inner = v.match(/var\(\s*(--[^)]+)\s*\)/i);
    if (!inner) return null;
    const next = inner[1];
    if (seen.has(next)) return null;
    seen.add(next);
    return resolveVar(map, next, seen);
  }
  return v;
}

function toRgb(hex) {
  if (typeof hex !== "string") return null;
  const h = hex.trim().toLowerCase();
  const m3 = h.match(/^#([0-9a-f]{3})$/i);
  const m6 = h.match(/^#([0-9a-f]{6})$/i);
  if (m3) {
    const d = m3[1];
    return [
      parseInt(d[0] + d[0], 16),
      parseInt(d[1] + d[1], 16),
      parseInt(d[2] + d[2], 16),
    ];
  }
  if (m6) {
    const d = m6[1];
    return [
      parseInt(d.slice(0, 2), 16),
      parseInt(d.slice(2, 4), 16),
      parseInt(d.slice(4, 6), 16),
    ];
  }
  return null;
}

function relLuminance([r, g, b]) {
  const srgb = [r, g, b]
    .map((v) => v / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function contrastRatio(fgRGB, bgRGB) {
  const L1 = relLuminance(fgRGB);
  const L2 = relLuminance(bgRGB);
  const [Lmax, Lmin] = L1 >= L2 ? [L1, L2] : [L2, L1];
  return (Lmax + 0.05) / (Lmin + 0.05);
}

function resolveHex(map, tokenOrHex) {
  if (tokenOrHex.startsWith("#")) return tokenOrHex;
  const raw = resolveVar(map, tokenOrHex.startsWith("--") ? tokenOrHex : `--${tokenOrHex}`);
  if (!raw) return null;
  if (/^var\(/i.test(raw)) return resolveHex(map, raw);
  return raw;
}

function pairsFor(mode) {
  return [
    { name: "Body", fg: "--color-text", bg: "--color-bg" },
    { name: "Primary Action", fg: "#111111", bg: "--color-primary" },
    { name: "Inverse", fg: "--neutral-0", bg: "--neutral-900" },
    { name: "Inverse (rev)", fg: "--neutral-900", bg: "--neutral-0" },
    ...(mode === "dark"
      ? [{ name: "Muted", fg: "--neutral-300", bg: "--neutral-900" }]
      : [{ name: "Muted", fg: "--neutral-700", bg: "--neutral-50" }]),
  ];
}

function pad(s, len) {
  s = String(s);
  return s.length >= len ? s : s + " ".repeat(len - s.length);
}

function main() {
  if (!fs.existsSync(VARS_FILE)) {
    console.error(`✖ No existe ${VARS_FILE}`);
    process.exit(1);
  }
  const css = readFile(VARS_FILE);
  const blockLight = extractBlock(css, ":root");
  const blockDark = extractBlock(css, ":root.dark");
  const mapLight = parseVars(blockLight);
  const mapDark = { ...mapLight, ...parseVars(blockDark) };

  const results = [];
  let hasFail = false;

  for (const mode of ["light", "dark"]) {
    const map = mode === "light" ? mapLight : mapDark;
    for (const p of pairsFor(mode)) {
      const fgHex = resolveHex(map, p.fg);
      const bgHex = resolveHex(map, p.bg);
      const fgRGB = fgHex ? toRgb(fgHex) : null;
      const bgRGB = bgHex ? toRgb(bgHex) : null;

      if (!fgRGB || !bgRGB) {
        results.push({
          mode,
          pair: p.name,
          ratio: null,
          status: "SKIP",
          reason: `No resolvió: fg=${p.fg}(${fgHex}), bg=${p.bg}(${bgHex})`,
        });
        continue;
      }
      const ratio = contrastRatio(fgRGB, bgRGB);
      const passAA = ratio >= 4.5;
      const passAALarge = ratio >= 3;
      const passAAA = ratio >= 7;
      if (!passAA) hasFail = true;
      results.push({ mode, pair: p.name, ratio, passAA, passAALarge, passAAA });
    }
  }

  console.log("\nWCAG Contrast Report (AA normal ≥ 4.5:1) — css/variables.css\n");
  console.log(pad("Mode", 6), pad("Pair", 18), pad("Ratio", 7), "AA", "AA-lg", "AAA", "Notes");
  for (const r of results) {
    if (r.status === "SKIP") {
      console.log(pad(r.mode, 6), pad(r.pair, 18), pad("-", 7), "SKIP", "SKIP", "SKIP", r.reason);
      continue;
    }
    const ratioTxt = r.ratio.toFixed(1) + ":1";
    const note = r.passAA ? "" : "FAIL AA";
    console.log(
      pad(r.mode, 6),
      pad(r.pair, 18),
      pad(ratioTxt, 7),
      r.passAA ? "OK " : "FAIL",
      r.passAALarge ? "OK " : "FAIL",
      r.passAAA ? "OK " : "FAIL",
      note
    );
  }

  if (hasFail) {
    console.error("\n✖ WCAG AA normal falló en al menos un par. Ajusta tokens (p. ej. --color-text o --color-bg).");
    process.exit(1);
  }
  console.log("\n✔ WCAG AA normal OK en todos los pares");
}

main();
