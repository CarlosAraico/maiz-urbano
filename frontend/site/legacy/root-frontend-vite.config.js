import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: path.resolve(__dirname),
  plugins: [
    react({
      include: [
        "**/*.jsx",
        "**/*.js",
        "src/mu-system/**/*.jsx",
        "src/mu-system/**/*.js"
      ]
    })
  ],
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      "@mu": path.resolve(__dirname, "src/mu-system"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  }
});
