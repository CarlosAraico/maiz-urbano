# Maíz Urbano Design Tokens (MU-v4)

Ubicación: `design-tokens/mu-v4.json` (formato W3C con `$value` y `$type`).

## Uso con Tokens Studio (Figma)
- En el plugin: Token Storage → GitHub → repo `maiz-urbano`, rama que uses (ej. `main` o `tokens`), ruta `design-tokens/`.
- Pull from GitHub para traer `mu-v4.json`.
- Export to Figma para generar Variables. Colección sugerida: “Maíz Urbano”; define modos si tienes light/dark.
- Asigna Code Snippets alineados al front (ej. `--mu-color-amarillo`, `--mu-space-m`, `--mu-radius-md`).

## Uso en el front
- Genera CSS Custom Properties con Style Dictionary (o similar) a partir de `mu-v4.json`, por ejemplo en `frontend/public/variables.css`:
  ```css
  :root {
    --mu-color-amarillo: #FACC15;
    --mu-color-dorado: #FBBF24;
    --mu-color-hoja: #14532D;
    --mu-color-crema: #FDF7E3;
    --mu-color-negro: #0F0F0F;
    --mu-space-m: 16px;
  }
  ```
- Importa ese CSS en tu build (Vite) para que Dev Mode muestre nombres de token que existen en el código.

## Nomenclatura recomendada
- Tokens base: `color.maiz.amarillo`, `spacing.m`, `radius.md`, `shadow.glow`.
- Tokens semánticos: `semantic.color.background.default`, `semantic.color.text.accent`, etc. Mantén alias `{color.maiz.amarillo}` para claridad.
