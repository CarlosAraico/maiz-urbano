import React from "react";
import { createRoot } from "react-dom/client";
import MUMenu from "./index.jsx";

export function mountMUMenu(targetId = "mu-menu") {
  const el = document.getElementById(targetId);
  if (!el) return console.warn(`MU: #${targetId} no encontrado para MUMenu`);
  const root = createRoot(el);
  root.render(<MUMenu />);
  return root;
}
