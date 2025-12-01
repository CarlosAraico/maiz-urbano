// tools/tokens-to-css.js
// Genera variables y utilidades desde design-tokens/mu-v4.json (Tokens Studio).
// Uso: node tools/tokens-to-css.js <input.json> <variables.css> <utilities.css?>

import fs from "node:fs";
import path from "node:path";

const toVarName = (name) =>
  `--${name.replace(/[\s]/g, "").replace(/[^\w-/.]/g, "").replace(/[./]/g, "-").toLowerCase()}`;
const toClassName = (name) => name.replace(/[^\w-]/g, "-").toLowerCase();
const isToken = (obj) => obj && typeof obj === "object" && "$value" in obj;

function flattenTokens(obj, prefix = "") {
  const out = {};
  for (const [key, val] of Object.entries(obj || {})) {
    if (key.startsWith("$")) continue; // metadata
    const p = prefix ? `${prefix}.${key}` : key;
    if (isToken(val)) out[p] = val.$value;
    else if (val && typeof val === "object") Object.assign(out, flattenTokens(val, p));
  }
  return out;
}

function pickSetsForTheme(json, themeName) {
  const themes = json.$themes || json.themes || [];
  const theme = themes.find((t) => t.name?.toLowerCase() === themeName.toLowerCase());
  if (!theme) return { sets: [], overrides: {} };
  const selected = theme.selectedTokenSets || theme.$metadata?.selectedTokenSets || {};
  const sets = Object.entries(selected)
    .filter(([, state]) => ["source", "enabled"].includes(state))
    .sort((a, b) => (a[1] === "source" ? -1 : 1))
    .map(([name]) => name);
  return { sets, overrides: theme.$overrides || {} };
}

function mergeSets(json, setNames, overrides = {}) {
  const merged = {};
  for (const name of setNames) {
    const set = json[name];
    if (set && typeof set === "object") Object.assign(merged, flattenTokens(set));
  }
  for (const [, overrideSet] of Object.entries(overrides)) {
    if (overrideSet && typeof overrideSet === "object") {
      Object.assign(merged, flattenTokens(overrideSet));
    }
  }
  return merged;
}

function ensureThemeFallback(lightMap, darkMap) {
  if (!Object.keys(lightMap).length && Object.keys(darkMap).length) return { lightMap: darkMap, darkMap };
  if (!Object.keys(darkMap).length && Object.keys(lightMap).length) return { lightMap, darkMap: lightMap };
  return { lightMap, darkMap };
}

function resolveReferences(map) {
  const out = {};
  for (const [key, value] of Object.entries(map)) {
    if (typeof value === "string" && value.includes("{")) {
      out[key] = value.replace(/\{([^}]+)\}/g, (_, ref) => {
        const parts = ref.split(".");
        const refPath = parts.length > 1 ? parts.slice(1).join(".") : ref;
        return `var(${toVarName(refPath)})`;
      });
    } else {
      out[key] = value;
    }
  }
  return out;
}

function formatVars(lightMap, darkMap) {
  const decls = (map) => Object.entries(map).map(([n, v]) => `  ${toVarName(n)}: ${v};`).join("\n");
  const hdr = "/* Generado: edita design-tokens/mu-v4.json; no edites este archivo. */\n";
  return hdr + `:root{\n${decls(lightMap)}\n}\n:root.dark{\n${decls(darkMap)}\n}\n`;
}

function formatUtilities(lightMap) {
  const hdr = "/* Generado: utilidades desde tokens (bg/text/border/spacing/typography/aliases) */\n";
  const lines = [];

  // Colors → bg/text/border
  for (const [name] of Object.entries(lightMap)) {
    if (!/color|neutral|bg|text|border/i.test(name)) continue;
    const v = `var(${toVarName(name)})`;
    const n = toClassName(name);
    lines.push(`.bg-${n}{background:${v};}`);
    lines.push(`.text-${n}{color:${v};}`);
    lines.push(`.border-${n}{border-color:${v};}`);
  }

  // Spacing → padding/margin/gap
  for (const [name] of Object.entries(lightMap)) {
    if (!/^spacing-\d+$/i.test(name)) continue;
    const v = `var(${toVarName(name)})`;
    const n = toClassName(name);
    lines.push(`.p-${n}{padding:${v};}`);
    lines.push(`.px-${n}{padding-left:${v};padding-right:${v};}`);
    lines.push(`.py-${n}{padding-top:${v};padding-bottom:${v};}`);
    lines.push(`.m-${n}{margin:${v};}`);
    lines.push(`.mx-${n}{margin-left:${v};margin-right:${v};}`);
    lines.push(`.my-${n}{margin-top:${v};margin-bottom:${v};}`);
    lines.push(`.gap-${n}{gap:${v};}`);
  }

  // Font families → heading/body/mono
  for (const fam of ["font-heading", "font-body", "font-mono"]) {
    if (fam in lightMap) {
      lines.push(`.font-${toClassName(fam.replace("font-", ""))}{font-family:var(${toVarName(fam)});}`);
    }
  }

  // Font sizes → text-xs/sm/md/lg/xl
  const sizeMap = { "font-xs": "xs", "font-sm": "sm", "font-md": "md", "font-lg": "lg", "font-xl": "xl" };
  for (const [token, short] of Object.entries(sizeMap)) {
    if (token in lightMap) {
      lines.push(`.text-${short}{font-size:var(${toVarName(token)});}`);
    }
  }

  // Aliases útiles
  for (const alias of ["color-primary", "color-bg", "color-text", "border"]) {
    if (!(alias in lightMap)) continue;
    const n = toClassName(alias.replace("color-", ""));
    const v = `var(${toVarName(alias)})`;
    lines.push(`.bg-${n}{background:${v};}`);
    lines.push(`.text-${n}{color:${v};}`);
    if (alias === "border") lines.push(`.border{border-color:${v};}`);
  }

  return hdr + lines.join("\n") + "\n";
}

function writeFile(outPath, data) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, data, "utf8");
}

const [, , inFile, outVars, outUtils] = process.argv;
if (!inFile || !outVars) {
  console.error("Uso: node tools/tokens-to-css.js <input.json> <variables.css> [utilities.css]");
  process.exit(1);
}

try {
  const json = JSON.parse(fs.readFileSync(path.resolve(inFile), "utf8"));
  let lightMap = {};
  let darkMap = {};

  if (Array.isArray(json.$themes) || Array.isArray(json.themes)) {
    const light = pickSetsForTheme(json, "Light");
    const dark = pickSetsForTheme(json, "Dark");
    lightMap = mergeSets(json, light.sets, light.overrides);
    darkMap = mergeSets(json, dark.sets, dark.overrides);
  } else {
    if (json.light) lightMap = flattenTokens(json.light);
    if (json.dark) darkMap = flattenTokens(json.dark);
  }

  if (!Object.keys(lightMap).length && !Object.keys(darkMap).length) {
    console.warn("No se detectaron tokens; usando MU-v4 base (fallback).");
    const base = {
      "neutral-0": "#FFFFFF",
      "neutral-50": "#F7F7F7",
      "neutral-100": "#EDEDED",
      "neutral-200": "#D9D9D9",
      "neutral-300": "#C3C3C3",
      "neutral-700": "#333333",
      "neutral-900": "#111111",
      "color-maiz-amarillo": "#FACC15",
      "color-maiz-dorado": "#FBBF24",
      "color-maiz-hoja": "#14532D",
      "color-maiz-crema": "#FDF7E3",
      "color-maiz-negro": "#0F0F0F",
      "font-heading": "\"Archivo Black\", sans-serif",
      "font-mono": "\"JetBrains Mono\", monospace",
      "font-body": "Inter, sans-serif",
      "font-xs": "12px",
      "font-sm": "14px",
      "font-md": "16px",
      "font-lg": "20px",
      "font-xl": "24px",
      "spacing-0": "0px",
      "spacing-1": "4px",
      "spacing-2": "8px",
      "spacing-3": "12px",
      "spacing-4": "16px",
      "spacing-5": "20px",
      "spacing-6": "24px",
      "spacing-8": "32px",
      "spacing-10": "40px",
      "color-primary": "var(--color-maiz-amarillo)",
      "color-bg": "var(--neutral-0)",
      "color-text": "var(--neutral-900)",
      "border": "var(--neutral-200)"
    };
    const baseDark = {
      ...base,
      "color-primary": "var(--color-maiz-dorado)",
      "color-bg": "var(--color-maiz-negro)",
      "color-text": "var(--color-maiz-crema)",
      "border": "var(--neutral-700)"
    };
    lightMap = base;
    darkMap = baseDark;
  }

  const ensured = ensureThemeFallback(lightMap, darkMap);
  const resolvedLight = resolveReferences(ensured.lightMap);
  const resolvedDark = resolveReferences(ensured.darkMap);

  const cssVars = formatVars(resolvedLight, resolvedDark);
  writeFile(outVars, cssVars);
  console.log(`✔ ${outVars}`);

  if (outUtils) {
    const cssUtils = formatUtilities(resolvedLight);
    writeFile(outUtils, cssUtils);
    console.log(`✔ ${outUtils}`);
  }
} catch (e) {
  console.error("Error generando CSS desde tokens:", e);
  process.exit(1);
}
