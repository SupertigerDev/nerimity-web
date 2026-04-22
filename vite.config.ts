import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  build: {
    sourcemap: true,
  },
  server: {
    host: true,
    port: 3000,
    allowedHosts: ["local.nerimity.com"],
  },
});
