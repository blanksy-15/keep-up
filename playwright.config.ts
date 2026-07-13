import { loadEnvConfig } from "@next/env";
import { defineConfig, devices } from "@playwright/test";
import { requireSafeTestDatabaseUrl } from "./tests/support/postgres-test-database";

loadEnvConfig(process.cwd());

const baseURL = process.env.PLAYWRIGHT_BASE_URL?.trim() || "http://127.0.0.1:3101";
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const databaseUrl = requireSafeTestDatabaseUrl(process.env);
const authSecret = process.env.BETTER_AUTH_SECRET?.trim();

if (process.env.E2E_TEST_MODE !== "true") {
  throw new Error("E2E_TEST_MODE=true is required to run browser tests.");
}
if (!authSecret || authSecret.length < 32) {
  throw new Error("BETTER_AUTH_SECRET must be at least 32 characters for browser tests.");
}
if (process.env.ALLOW_PUBLIC_SIGN_UP !== "true") {
  throw new Error("ALLOW_PUBLIC_SIGN_UP=true is required to exercise synthetic account registration.");
}
if (process.env.BETTER_AUTH_URL?.trim() !== baseURL) {
  throw new Error("BETTER_AUTH_URL must match PLAYWRIGHT_BASE_URL (or the default test URL).");
}

export default defineConfig({
  testDir: "./tests/e2e",
  globalSetup: "./tests/e2e/support/global-setup.ts",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
    navigationTimeout: 30_000,
    actionTimeout: 15_000,
    extraHTTPHeaders: { "x-keep-up-e2e": "true" },
  },
  webServer: {
    command: `${npmCommand} run dev -- --hostname 127.0.0.1 --port 3101`,
    url: baseURL,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl,
      BETTER_AUTH_SECRET: authSecret,
      BETTER_AUTH_URL: baseURL,
      ALLOW_PUBLIC_SIGN_UP: "true",
      E2E_TEST_MODE: "true",
    },
  },
  projects: [
    { name: "mobile-chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    { name: "desktop-chromium", testMatch: /responsive\.spec\.ts/, use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
  ],
});
