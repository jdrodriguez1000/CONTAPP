import { defineConfig, devices } from "@playwright/test";

const localUrl = "http://localhost:4173";

export default defineConfig({
  testDir: "tests/e2e",
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "iphone",
      use: { ...devices["iPhone 13"], baseURL: localUrl },
    },
  ],
  webServer: {
    command: "npm run build && npm run preview -- --port 4173 --strictPort",
    url: localUrl,
    reuseExistingServer: !process.env.CI,
  },
});
