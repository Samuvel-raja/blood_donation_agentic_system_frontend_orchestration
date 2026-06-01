import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

const apiProxyTarget =
  process.env.BLOOD_DONATION_API_BASE_URL ??
  process.env.VITE_BLOOD_DONATION_API_BASE_URL ??
  "https://blooddonationagenticsytembackend-production-280e.up.railway.app";

export default defineConfig({
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  server: {
    proxy: {
      "/auth": {
        target: apiProxyTarget,
        changeOrigin: true,
      },
      "/users": {
        target: apiProxyTarget,
        changeOrigin: true,
      },
      "/blood-request": {
        target: apiProxyTarget,
        changeOrigin: true,
      },
      "/webhooks": {
        target: apiProxyTarget,
        changeOrigin: true,
      },
    },
  },
});
