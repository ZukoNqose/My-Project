import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../wwwroot",      // <-- send Vite build output to ASP.NET
    emptyOutDir: true
  }
});
