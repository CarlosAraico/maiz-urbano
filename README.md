<!-- /README.md -->
# Maíz Urbano – GitHub Pages

## Ejecutar
Archivos estáticos (no requiere build). Abre `index.html` con Live Server o visita la URL de Pages.

## Deploy
- Settings → Pages → Source = **GitHub Actions**.
- `git add . && git commit -m "deploy" && git push`.

## Figma Dev Mode
- Connect repository: `CarlosAraico/maiz-urbano` (branch `main`, Base path vacío).
- Link file: elige `index.html` o `landing-v3_5.html`.
- Tokens Studio: Token Storage → GitHub → `design-tokens/mu-v4.json` → Pull → Export to Figma.

## Notas
- Mantén **rutas relativas**: `./frontend/...` y `./src/...`.
- `css/variables.css` contiene tokens MU-v4 simplificados; puedes reemplazar por tokens sincronizados.
