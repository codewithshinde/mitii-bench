import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "next/link": resolve(root, "./test-shims/next-link.jsx"),
      "next/navigation": resolve(root, "./test-shims/next-navigation.js"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.mjs"],
    include: ["__bench__/**/*.{test,spec}.{js,jsx}", "app/**/*.{test,spec}.{js,jsx}"],
    css: false,
  },
});
