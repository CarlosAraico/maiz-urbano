// tools/ci-verify-relative-paths.mjs
// Por qué: evita rutas absolutas y asegura enlaces requeridos antes del deploy.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const exts = new Set([".html", ".htm", ".jsx", ".tsx"]);
const skipDirs = new Set([".git", "node_modules", "dist", "frontend", "backend"]);
const filesChecked = [];
const violations = [];

function walk(dir) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(name.name)) continue;
    const p = path.join(dir, name.name);
    if (name.isDirectory()) walk(p);
    else if (exts.has(path.extname(p))) filesChecked.push(p);
  }
}

function checkAbsolutePaths(file, content) {
  const re = /(src|href)\s*=\s*["']\/(?!\/)/gi; // empieza con una sola barra
  let m;
  while ((m = re.exec(content))) {
    const before = content.slice(0, m.index);
    const line = before.split("\n").length;
    violations.push({
      type: "ABSOLUTE_PATH",
      file,
      line,
      snippet: content.slice(m.index, m.index + 120).replace(/\n/g, " "),
    });
  }
}

const required = {
  "index.html": [
    `<link rel="stylesheet" href="./css/variables.css" />`,
    `<link rel="stylesheet" href="./css/utilities.css" />`,
    `<script type="module" src="./frontend/mu-mount/dist/mu-mount.js"></script>`,
  ],
  "landing-v3_5.html": [
    `<link rel="stylesheet" href="./css/variables.css" />`,
    `<link rel="stylesheet" href="./css/utilities.css" />`,
  ],
  "mu-mount-preview.html": [
    `<link rel="stylesheet" href="./css/variables.css" />`,
    `<link rel="stylesheet" href="./css/utilities.css" />`,
  ],
};

function normalizeHtml(html) {
  return html.replace(/\s+/g, " ").trim();
}

function checkRequired(file, content) {
  const base = path.basename(file);
  if (!(base in required)) return;
  const c = normalizeHtml(content);
  for (const needle of required[base]) {
    const n = needle.replace(/\s+/g, " ").trim();
    if (!c.includes(n)) {
      violations.push({
        type: "MISSING_REQUIRED",
        file,
        line: 0,
        snippet: `Falta: ${needle}`,
      });
    }
  }
}

function printReport() {
  if (!violations.length) {
    console.log(`✔ Verificación OK. Archivos escaneados: ${filesChecked.length}`);
    return true;
  }
  console.error("✖ Verificación FALLÓ:");
  for (const v of violations) {
    console.error(
      `  [${v.type}] ${path.relative(ROOT, v.file)}${v.line ? ":" + v.line : ""}  →  ${v.snippet}`
    );
  }
  console.error(`\nSugerencias:`);
  console.error(`  • Cambia rutas absolutas '/algo.js' por relativas './algo.js'.`);
  console.error(`  • Asegura los enlaces requeridos por archivo (variables.css, utilities.css y scripts indicados).`);
  return false;
}

walk(ROOT);
for (const f of filesChecked) {
  const html = fs.readFileSync(f, "utf8");
  checkAbsolutePaths(f, html);
  checkRequired(f, html);
}
const ok = printReport();
process.exit(ok ? 0 : 1);
