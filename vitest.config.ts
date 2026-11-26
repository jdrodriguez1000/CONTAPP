import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Explicit on purpose: without it Vitest would also pick up the Playwright
    // files in tests/e2e and the hook tests in .claude.
    include: ["src/**/*.test.ts", "tests/unit/**/*.test.ts"],
    environment: "node",
  },
});
