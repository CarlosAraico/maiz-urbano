import { mountMUHero } from "/src/mu-system/components/mu-hero/mount.jsx";
import { mountMUMenu } from "/src/mu-system/components/mu-menu/mount.jsx";
import { mountMUFranquicias } from "/src/mu-system/components/mu-franquicias/mount.jsx";
import { mountMUEmpleo } from "/src/mu-system/components/mu-empleo/mount.jsx";
import { mountMUSucursales } from "/src/mu-system/components/mu-sucursales/mount.jsx";
import { mountMUFooter } from "/src/mu-system/components/mu-footer/mount.jsx";

export function mountAll() {
  // MUHero está incluido directamente en el HTML cinematográfico.
  // mountMUHero("mu-hero");

  mountMUMenu("mu-menu");
  mountMUFranquicias("mu-franquicias");
  mountMUEmpleo("mu-empleo");
  mountMUSucursales("mu-sucursales");
  mountMUFooter("mu-footer");
}

window.addEventListener("DOMContentLoaded", mountAll);
