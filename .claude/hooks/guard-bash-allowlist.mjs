#!/usr/bin/env node
// guard-bash-allowlist.mjs — PreToolUse hook shared by subagents.
//
// Lets a subagent run only shell commands that start with an allowed prefix.
// Usage in an agent's frontmatter (matcher "Bash|PowerShell"):
//   command: node "$CLAUDE_PROJECT_DIR/.claude/hooks/guard-bash-allowlist.mjs" "npx ctx7@latest" "npx -y ctx7@latest"
//
// To stop an allowed command from smuggling another one, any chaining,
// piping, redirection or substitution character is rejected.
//
// Arguments starting with "!" are FORBIDDEN tokens (options or subcommands that
// modify files), e.g. "!--fix" "!-o" "!fix". A command is blocked if any of its
// words (a quoted text is one word; quotes removed) matches one:
//   - "--long"  → the word is "--long" or starts with "--long="
//   - "-x"      → the word starts with "-x" (covers "-x", "-xvalue", "-x=value")
//   - "word"    → the word is exactly "word" (subcommands such as "npm audit fix")
// Exit codes: 0 = no objection · 2 = block (stderr is shown to the agent).

const args = process.argv.slice(2).map((p) => p.trim()).filter(Boolean);
const allowedPrefixes = args.filter((a) => !a.startsWith("!"));
const forbiddenTokens = args.filter((a) => a.startsWith("!")).map((a) => a.slice(1)).filter(Boolean);

function matchesForbidden(word, token) {
  if (token.startsWith("--")) return word === token || word.startsWith(token + "=");
  if (/^-[^-]$/.test(token)) return word.startsWith(token);
  return word === token;
}

// ; & | < > ` and $( or ${ and line breaks can chain, redirect or substitute commands.
const FORBIDDEN = /[;&|<>`\r\n]|\$\(|\$\{/;

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

function block(message) {
  process.stderr.write(message + "\n");
  process.exit(2);
}

// Fail closed: if the input can't be read, block.
let input;
try {
  input = JSON.parse(await readStdin());
} catch (error) {
  block(`guard-bash-allowlist: no se pudo leer la solicitud (${error.message}); comando bloqueado por seguridad.`);
}

const command = String(input.tool_input?.command ?? "").trim();
const allowedText = allowedPrefixes.length ? allowedPrefixes.join(" | ") : "(ninguno)";

if (!command) block("guard-bash-allowlist: comando vacío; bloqueado.");

if (FORBIDDEN.test(command)) {
  block(
    "guard-bash-allowlist: comando bloqueado; no se permiten ; & | < > ` $( ${ ni saltos de línea. " +
      "Ejecuta un solo comando simple."
  );
}

const isAllowed = allowedPrefixes.some((prefix) => command === prefix || command.startsWith(prefix + " "));

if (!isAllowed) {
  block(
    `guard-bash-allowlist: comando no permitido para este agente: "${command}". ` +
      `Solo puede ejecutar comandos que empiecen por: ${allowedText}. ` +
      "Si necesitas otro comando, repórtalo al orquestador con STATUS: BLOCKED."
  );
}

// A quoted text counts as ONE word, so a query like "how to fix X" is not read as the option "fix".
const words = (command.match(/"[^"]*"|'[^']*'|\S+/g) ?? []).map((w) => w.replace(/^["']+|["']+$/g, ""));
for (const word of words) {
  const token = forbiddenTokens.find((t) => matchesForbidden(word, t));
  if (token) {
    block(
      `guard-bash-allowlist: comando bloqueado: la opción "${word}" está prohibida para este agente ` +
        `(coincide con "${token}"; modifica archivos o escribe reportes). ` +
        "Ejecuta el comando sin ella; si la necesitas, repórtalo al orquestador con STATUS: BLOCKED."
    );
  }
}

process.exit(0);
