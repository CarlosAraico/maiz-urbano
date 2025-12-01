import React from "react";
import { createRoot } from "react-dom/client";
import MUHero from "./index.jsx";

export function mountMUHero(targetId = "mu-hero") {
  const container = document.getElementById(targetId);

  if (!container) {
    console.warn(`MU: target #${targetId} no encontrado para MUHero.`);
    return null;
  }

  const root = createRoot(container);
  root.render(<MUHero />);
  return root;
}
