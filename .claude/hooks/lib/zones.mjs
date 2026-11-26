// zones.mjs — shared helpers for the guard hooks.
// A "zone" is a folder or file path relative to the project root.
// "*" matches exactly one path segment, e.g. "_project/slices/*/reports/coder.md".

import path from "node:path";

/** Prints the message for the agent and blocks the tool call (exit code 2). */
export function block(message) {
  process.stderr.write(message + "\n");
  process.exit(2);
}

/** Reads the tool call JSON from stdin. Fails closed: unreadable input blocks. */
export async function readHookInput(hookName) {
  try {
    const chunks = [];
    for await (const chunk of process.stdin) chunks.push(chunk);
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch (error) {
    block(`${hookName}: no se pudo leer la solicitud (${error.message}); bloqueado por seguridad.`);
  }
}

/** Project root: from Claude Code's environment, the hook input, or the current folder. */
export function projectDirOf(input) {
  return process.env.CLAUDE_PROJECT_DIR ?? input.cwd ?? process.cwd();
}

/** Absolute, forward-slash, lowercase path (Windows paths are case-insensitive). */
export function toAbsolute(projectDir, p) {
  return path.resolve(projectDir, p).replace(/\\/g, "/").toLowerCase();
}

/** Regex for a zone: the zone itself or anything inside it; "*" = one path segment. */
function zoneToRegex(absoluteZone) {
  const pattern = absoluteZone
    .split("*")
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
    .join("[^/]+");
  return new RegExp(`^${pattern}(/.*)?$`);
}

/** True when the target is the zone itself or lies inside it. */
export function isInside(absoluteTarget, absoluteZone) {
  return zoneToRegex(absoluteZone).test(absoluteTarget);
}

/** True when the target is a folder that contains the zone (e.g. searching the whole project). */
export function contains(absoluteTarget, absoluteZone) {
  const zoneFolderPrefix = absoluteZone.split("*")[0];
  return zoneFolderPrefix.startsWith(absoluteTarget.replace(/\/$/, "") + "/");
}
