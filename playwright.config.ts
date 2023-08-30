import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "Vite",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://127.0.0.1:3001",
      },
    },
    {
      name: "Webpack",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://127.0.0.1:3002",
      },
    },
  ],
  webServer: [
    {
      port: 3001,
      env: { PORT: "3001" },
      command: `npm run build && npm run -w vite-tests storybook`,
      stdout: "pipe",
      stderr: "pipe",
      reuseExistingServer: !process.env.CI,
    },
    {
      port: 3002,
      env: { PORT: "3002" },
      command: `npm run build && npm run -w webpack-tests storybook`,
      stdout: "pipe",
      stderr: "pipe",
      reuseExistingServer: !process.env.CI,
    },
  ],
});
