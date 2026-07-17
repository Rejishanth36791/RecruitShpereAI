import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    // Proxies /api calls to the ASP.NET Core backend during local development
    // so the browser never has to deal with cross-origin/HTTPS cert issues.
    proxy: {
      "/api": {
        target: "http://localhost:5150",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
