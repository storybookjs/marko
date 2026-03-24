import marko from "@marko/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [marko()],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["tests/fixtures/*/test.ts"],
    globalSetup: ["./tests/test-setup.ts"],
    testTimeout: 60_000,
    hookTimeout: 120_000,
    retry: 2,
  },
});
