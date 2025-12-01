# MU Setup v2 (Frontend aditivo, sin tocar backend)

## 1) Instalar y construir
```bash
npm ci
npm run bootstrap
npm run build
```

## 2) Servir SPA /facturacion en Express (opcional, no destructivo)
En tu server Express:

```js
// const express = require('express'); const path = require('path'); const app = express();
app.use('/facturacion', require('express').static(require('path').join(__dirname, 'frontend/facturacion/build')));
app.get('/facturacion/*', (_, res) =>
  res.sendFile(require('path').join(__dirname, 'frontend/facturacion/build/index.html'))
);
```

## 3) Montar MU Landing Pack en la landing actual (opcional)
Añade en tu HTML SIN reemplazar nada:

```html
<div id="mu-root"></div>
<script>/* override opcional */ window.MU_MOUNT_AUTORUN = true;</script>
<script type="module" src="/frontend/mu-mount/dist/mu-mount.js"></script>
```

Si ya usas Tailwind y no quieres el CSS fallback:

```html
<script type="module">
  import { mountMU } from '/frontend/mu-mount/dist/mu-mount.js';
  mountMU('#mu-root', { injectCSS:false });
</script>
```

## 4) Flags de auto-montaje
- Build: `frontend/mu-mount/.env` ? `VITE_MU_MOUNT_AUTORUN=true|false`
- Runtime: `window.MU_MOUNT_AUTORUN = false` antes del `<script>`.

## 5) Probar local
```bash
npm run preview:facturacion   # http://localhost:5173/facturacion/login
npm run test:e2e              # smoke + OCR + KPIs
```

## 6) Assets
Coloca:
- `/public/logo-mu.png`
- `/public/mu-mascot.png`
