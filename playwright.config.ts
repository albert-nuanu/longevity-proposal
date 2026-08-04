import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  use: {
    browserName: "chromium",
    headless: true,
  },
  retries: 0,
  workers: 1,
});
