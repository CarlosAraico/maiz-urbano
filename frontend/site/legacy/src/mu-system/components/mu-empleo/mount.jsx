import React from "react";
import { createRoot } from "react-dom/client";
import MUEmpleo from "./index.jsx";

export function mountMUEmpleo(targetId = "mu-empleo") {
  const el = document.getElementById(targetId);
  if (!el) return;
  const root = createRoot(el);
  root.render(<MUEmpleo />);
  return root;
}
