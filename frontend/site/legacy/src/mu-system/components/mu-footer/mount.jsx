import React from "react";
import { createRoot } from "react-dom/client";
import MUFooter from "./index.jsx";

export function mountMUFooter(targetId = "mu-footer") {
  const el = document.getElementById(targetId);
  if (!el) return;
  const root = createRoot(el);
  root.render(<MUFooter />);
  return root;
}
