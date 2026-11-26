import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist", "playwright-report", "test-results", ".claude", "_project"]),
  {
    files: ["**/*.{js,ts}"],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    rules: {
      complexity: ["error", { max: 10 }],
    },
  },
]);
