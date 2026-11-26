// guards.test.mjs — proves that each guard hook blocks what it must and lets through the rest.
// Run from the project root:  node --test .claude/hooks/guards.test.mjs
// Each case FORCES the attempt (feeds the hook a real tool call), because an agent that refuses
// by instruction never exercises the hook. Exit code 2 = blocked, 0 = no objection.

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HOOKS = path.dirname(fileURLToPath(import.meta.url));
const PROJECT = path.resolve(HOOKS, "..", "..");

function run(hook, args, input) {
  const result = spawnSync("node", [path.join(HOOKS, hook), ...args], {
    input: typeof input === "string" ? input : JSON.stringify(input),
    env: { ...process.env, CLAUDE_PROJECT_DIR: PROJECT },
    encoding: "utf8",
  });
  return { code: result.status, stderr: result.stderr };
}

const write = (file) => ({ tool_input: { file_path: file } });
const read = (file) => ({ tool_input: { file_path: file } });
const search = (folder) => ({ tool_input: { path: folder } });
const bash = (command) => ({ tool_input: { command } });

test("write zone: allows inside the zone, blocks outside and in a forbidden zone", () => {
  const zones = ["src", "_project/slices/*/reports/coder.md", "!src/secret"];
  assert.equal(run("guard-write-zone.mjs", zones, write("src/a.ts")).code, 0);
  assert.equal(run("guard-write-zone.mjs", zones, write("_project/slices/VS-001/reports/coder.md")).code, 0);
  const outside = run("guard-write-zone.mjs", zones, write("AGENTS.md"));
  assert.equal(outside.code, 2);
  assert.match(outside.stderr, /solo puede escribir en/);
  const forbidden = run("guard-write-zone.mjs", zones, write("src/secret/key.ts"));
  assert.equal(forbidden.code, 2);
  assert.match(forbidden.stderr, /zona prohibida/);
});

test("write zone: an agent without zones cannot write", () => {
  assert.equal(run("guard-write-zone.mjs", [], write("src/a.ts")).code, 2);
});

test("read zone: hides a folder, allows its exceptions, blocks searches that contain it", () => {
  const zones = ["src", "+src/tests/acceptance"];
  assert.equal(run("guard-read-zone.mjs", zones, read("src/a.ts")).code, 2);
  assert.equal(run("guard-read-zone.mjs", zones, read("src/tests/acceptance/x.test.ts")).code, 0);
  assert.equal(run("guard-read-zone.mjs", zones, search(".")).code, 2);
  assert.equal(run("guard-read-zone.mjs", zones, read("README.md")).code, 0);
});

test("read zone --direct-only: blocks reading a secrets file but not searching the project", () => {
  const zones = ["--direct-only", ".env", "*/.env"];
  const direct = run("guard-read-zone.mjs", zones, read(".env"));
  assert.equal(direct.code, 2);
  assert.match(direct.stderr, /archivo de secretos/);
  assert.equal(run("guard-read-zone.mjs", zones, search(".")).code, 0);
});

test("bash allowlist: allows a listed prefix, blocks others, chaining and forbidden options", () => {
  const rules = ["git status", "npx eslint", "!--fix"];
  assert.equal(run("guard-bash-allowlist.mjs", rules, bash("git status")).code, 0);
  assert.equal(run("guard-bash-allowlist.mjs", rules, bash("npx eslint src")).code, 0);
  assert.equal(run("guard-bash-allowlist.mjs", rules, bash("rm -rf src")).code, 2);
  assert.equal(run("guard-bash-allowlist.mjs", rules, bash("git status && rm -rf src")).code, 2);
  const option = run("guard-bash-allowlist.mjs", rules, bash("npx eslint --fix src"));
  assert.equal(option.code, 2);
  assert.match(option.stderr, /prohibida/);
});

// Reads the real arguments that an agent's definition passes to a guard hook (T-005, L-012).
function agentGuardArgs(agent, hook) {
  const definition = readFileSync(path.join(PROJECT, ".claude", "agents", `${agent}.md`), "utf8");
  const line = definition.split(/\r?\n/).find((l) => l.includes(hook));
  assert.ok(line, `${agent}.md no usa ${hook}`);
  const afterHook = line.slice(line.indexOf(hook) + hook.length);
  return [...afterHook.matchAll(/"([^"]*)"/g)].map((m) => m[1]);
}

test("tester bash guard: may run npm run check, but not with --fix nor chained", () => {
  const rules = agentGuardArgs("tester", "guard-bash-allowlist.mjs");
  assert.equal(run("guard-bash-allowlist.mjs", rules, bash("npm run check")).code, 0);
  const fix = run("guard-bash-allowlist.mjs", rules, bash("npm run check -- --fix"));
  assert.equal(fix.code, 2);
  assert.match(fix.stderr, /prohibida/);
  assert.equal(run("guard-bash-allowlist.mjs", rules, bash("npm run check && rm -rf src")).code, 2);
  assert.equal(run("guard-bash-allowlist.mjs", rules, bash("npm run test:unit")).code, 0);
});

test("every guard fails closed on unreadable input", () => {
  for (const hook of ["guard-write-zone.mjs", "guard-read-zone.mjs", "guard-bash-allowlist.mjs"]) {
    assert.equal(run(hook, ["src"], "esto no es JSON").code, 2, hook);
  }
});
