import React from "react";
import { createRoot } from "react-dom/client";
import MUSucursales from "./index.jsx";

export function mountMUSucursales(targetId = "mu-sucursales") {
  const el = document.getElementById(targetId);
  if (!el) return;
  const root = createRoot(el);
  root.render(<MUSucursales />);
  return root;
}
