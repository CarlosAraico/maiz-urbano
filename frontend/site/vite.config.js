import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Repo name:
const repoName = "maiz-urbano";

export default defineConfig({
  plugins: [react()],
  base: `/${repoName}/`,
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true, // útil para Figma Dev Mode
  },
});
