# MU System – Maíz Urbano Design System

Este es el sistema de componentes oficial de Maíz Urbano.
Incluye bloques embebibles, componentes de UI y estructura estandarizada para sitios y apps.

## Estructura
- components/ → Componentes visuales (Hero, Menú, Franquicias, Empleo, etc.)
- shared/ → Tokens, estilos y utilidades comunes
- core/ → Montadores, configuraciones y API base

## Uso Standalone
```html
<div id="mu-hero"></div>
<script type="module" src="mu-hero.js"></script>
<script>
  mountMUHero("mu-hero");
</script>
```

Uso como paquete NPM
npm install @maiz-urbano/mu-hero

import { mountMUHero } from "@maiz-urbano/mu-hero";
mountMUHero("mu-hero");

Convenciones

Nombres: mu-hero, mu-menu, mu-franquicias

API: mountMUHero(), mountMUMenu()

Paquetes: @maiz-urbano/mu-<componente>
