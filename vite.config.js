import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Match CRA's default port
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      external: ['@rollup/rollup-darwin-arm64'],
    },
  },
});