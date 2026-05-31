// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
const apiProxyTarget =
  process.env.BLOOD_DONATION_API_BASE_URL ??
  process.env.VITE_BLOOD_DONATION_API_BASE_URL ??
  "https://blooddonationagenticsytembackend-production-280e.up.railway.app";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
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
  },
});
