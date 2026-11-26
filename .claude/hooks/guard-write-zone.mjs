#!/usr/bin/env node
// guard-write-zone.mjs — PreToolUse hook shared by all subagents.
//
// Blocks any file write outside the agent's allowed zones.
// Usage in an agent's frontmatter (matcher "Write|Edit|NotebookEdit"):
//   command: node "$CLAUDE_PROJECT_DIR/.claude/hooks/guard-write-zone.mjs" <zone1> <zone2> ...
// A zone is a folder or file path relative to the project root, e.g. "_project/features".
// "*" matches exactly one path segment, e.g. "_project/slices/*/reports/designer.md".
// A zone starting with "!" is forbidden and wins over any allowed zone, e.g. "!tests/acceptance".
//
// Exit codes: 0 = no objection (normal permission flow continues) · 2 = block (stderr is shown to the agent).

import { block, readHookInput, projectDirOf, toAbsolute, isInside } from "./lib/zones.mjs";

const HOOK = "guard-write-zone";
const args = process.argv.slice(2);
const allowedRaw = args.filter((zone) => !zone.startsWith("!"));
const deniedRaw = args.filter((zone) => zone.startsWith("!")).map((zone) => zone.slice(1));

const input = await readHookInput(HOOK);
const toolInput = input.tool_input ?? {};
const filePath = toolInput.file_path ?? toolInput.notebook_path;

// Tools without a target file are not this hook's business.
if (!filePath) process.exit(0);

const projectDir = projectDirOf(input);
const target = toAbsolute(projectDir, filePath);

if (allowedRaw.length === 0) {
  block(`${HOOK}: este agente no tiene zonas de escritura configuradas; no puede escribir archivos.`);
}

const deniedHit = deniedRaw.find((zone) => isInside(target, toAbsolute(projectDir, zone)));
if (deniedHit) {
  block(
    `${HOOK}: escritura bloqueada en "${filePath}": "${deniedHit}" es una zona prohibida para este agente. ` +
      "Si necesitas cambiar algo ahí, repórtalo al orquestador con STATUS: BLOCKED."
  );
}

if (!allowedRaw.some((zone) => isInside(target, toAbsolute(projectDir, zone)))) {
  block(
    `${HOOK}: escritura bloqueada en "${filePath}". ` +
      `Este agente solo puede escribir en: ${allowedRaw.join(", ")}. ` +
      "Si necesitas cambiar algo fuera de tu zona, repórtalo al orquestador con STATUS: BLOCKED."
  );
}

process.exit(0);
