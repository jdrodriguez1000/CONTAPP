#!/usr/bin/env node
// guard-read-zone.mjs — PreToolUse hook that hides folders from an agent.
//
// Used by the tester, who must design tests from the specification without reading the code.
// Usage in an agent's frontmatter (matcher "Read|Grep"):
//   command: node "$CLAUDE_PROJECT_DIR/.claude/hooks/guard-read-zone.mjs" src "+tests/acceptance" "+package.json"
// Plain zones are hidden; zones starting with "+" are exceptions the agent may read.
// A search (Grep) over a folder that contains a hidden zone (e.g. the whole project) is blocked too,
// unless it targets an exception directly.
// With "--direct-only", only direct reads of the hidden zones are blocked, not searches over the folders
// that contain them. Used to hide secret files (.env*), which searches already skip (.gitignore):
//   command: node ".../guard-read-zone.mjs" --direct-only .env "*/.env" ".env.local" "*/.env.local"
//
// Exit codes: 0 = no objection · 2 = block (stderr is shown to the agent).

import { block, readHookInput, projectDirOf, toAbsolute, isInside, contains } from "./lib/zones.mjs";

const HOOK = "guard-read-zone";
const DIRECT_ONLY = "--direct-only";
const directOnly = process.argv.includes(DIRECT_ONLY);
const args = process.argv.slice(2).filter((arg) => arg !== DIRECT_ONLY);
const hiddenRaw = args.filter((zone) => !zone.startsWith("+"));
const exceptionRaw = args.filter((zone) => zone.startsWith("+")).map((zone) => zone.slice(1));

const input = await readHookInput(HOOK);
const toolInput = input.tool_input ?? {};
const projectDir = projectDirOf(input);

// Read uses file_path; Grep uses path (empty = the whole project).
const requested = toolInput.file_path ?? toolInput.path ?? ".";
const target = toAbsolute(projectDir, requested);

const isException = exceptionRaw.some((zone) => isInside(target, toAbsolute(projectDir, zone)));
if (isException) process.exit(0);

const hiddenHit = hiddenRaw.find((zone) => {
  const absoluteZone = toAbsolute(projectDir, zone);
  return isInside(target, absoluteZone) || (!directOnly && contains(target, absoluteZone));
});

if (hiddenHit && directOnly) {
  block(
    `${HOOK}: lectura bloqueada en "${requested}": es un archivo de secretos ("${hiddenHit}"). ` +
      "Ningún agente lee valores secretos; si necesitas saber qué variables existen, lee el archivo .env.example."
  );
}

if (hiddenHit) {
  block(
    `${HOOK}: lectura bloqueada en "${requested}": "${hiddenHit}" está oculto para este agente ` +
      "(diseña tus pruebas desde la especificación, sin leer el código). " +
      `Puedes leer: ${exceptionRaw.join(", ") || "(ninguna excepción)"} y todo lo que esté fuera de "${hiddenRaw.join(", ")}". ` +
      "Para buscar, indica una carpeta concreta (p. ej. _project o la carpeta de tus pruebas)."
  );
}

process.exit(0);
