import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" makes the built site work from any folder or sub-path on a static host.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
