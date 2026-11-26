import { defineConfig, devices } from "@playwright/test";

const localUrl = "http://localhost:4173";
const publishedUrl = process.env.E2E_BASE_URL;
const publishedSpec = /published\.spec\.ts/;
const capturesSpec = /captures\.spec\.ts/;

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
      testIgnore: [publishedSpec, capturesSpec],
      use: { ...devices["iPhone 13"], baseURL: localUrl },
    },
    {
      name: "captures",
      testMatch: capturesSpec,
      use: { ...devices["iPhone 13"], baseURL: localUrl },
    },
    {
      name: "published",
      testMatch: publishedSpec,
      use: { ...devices["iPhone 13"], baseURL: publishedUrl },
    },
  ],
  // With a published address there is nothing to serve locally.
  webServer: publishedUrl
    ? undefined
    : {
        command: "npm run build && npm run preview -- --port 4173 --strictPort",
        url: localUrl,
        reuseExistingServer: !process.env.CI,
      },
});
