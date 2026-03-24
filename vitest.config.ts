import marko from "@marko/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [marko()],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["tests/fixtures/*/test.ts"],
    testTimeout: 20_000,
  },
});
