import React from "react";
import { createRoot } from "react-dom/client";
import MUFranquicias from "./index.jsx";

export function mountMUFranquicias(targetId = "mu-franquicias") {
  const el = document.getElementById(targetId);
  if (!el) return console.warn(`MU: #${targetId} no encontrado`);
  const root = createRoot(el);
  root.render(<MUFranquicias />);
  return root;
}
