import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" makes the production build work from any folder or
// sub-path (e.g., GitHub Pages project sites) without extra config.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
