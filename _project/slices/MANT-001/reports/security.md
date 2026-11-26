# MANT-001 — revisión inicial
**Fecha:** 2026-11-26 · **Rama revisada:** maint/T-005-tester-check vs. main · **Commits:** 7ebfe6d (prueba en rojo), bf9b4b1 (corrección de la prueba), 5bbe6ed (feat)

## Resumen
El cambio es pequeño y hace lo que promete en el caso normal: `npm run check` pasa, y `npm run check -- --fix` y el encadenado se bloquean. **No hay Crítica ni Alta.** Pero la prohibición `!--fix` **no basta** si alguien la quiere esquivar a propósito, y `npm run check` abre un camino nuevo para pasarle a ESLint opciones que escriben archivos o ejecutan código. Hallazgos: **2 del cambio** (1 Media, 1 Baja) y **3 preexistentes** (2 Media, 1 Baja). No hay Crítica ni Alta preexistente.

Para leerlo: las guardas del tester son **barandas contra errores**, no una jaula. Detienen bien al agente que se equivoca. A un agente que intente saltárselas a propósito no lo detienen del todo. El riesgo real hoy es bajo, porque el agente tendría que desobedecer sus propias instrucciones (`tester.md` §5), y un camino igual de fuerte **ya existía** antes de este cambio (hallazgo 3).

## Resultado de las herramientas
| Revisión | Comando | Resultado |
|---|---|---|
| Secretos en los commits de la rama | `gitleaks git --no-banner --redact --log-opts=main..HEAD` | 3 commits revisados, ningún secreto |
| Secretos en la carpeta tocada | `gitleaks dir --no-banner --redact .claude` | Ningún secreto |
| Dependencias | `npm audit` | 12 avisos de severidad moderada (minimatch, qs), los mismos de antes (DT-005). El cambio no agrega ni modifica dependencias |
| Documentación de npm | Context7 `/npm/cli` (npm run) | Confirma que lo que va después de `--` se pega **al final** del script. Con `check` = `npm run typecheck && npm run lint`, las opciones extra llegan a `npm run lint` y, con un segundo `--`, a `eslint .` |

No pude ejecutar `node --test .claude/hooks/guards.test.mjs` porque mi guarda no lo permite. Que esa prueba esté en verde no lo verifiqué yo; lo verifican el Manager o la CI.

## Checklist OWASP
| # | Riesgo | Estado | Nota |
|---|---|---|---|
| 1 | Acceso a datos ajenos | No aplica | Sin servidor ni datos guardados (C-010). Lo análogo aquí es el "acceso" del tester a `src/`: ver hallazgos 1, 3 y 4 |
| 2 | Inyección | Hallazgo | Inyección de **opciones** por `npm run check -- …` (hallazgo 1). El encadenado de comandos sí queda bloqueado (`; & \| < > \` $( ${`) |
| 3 | Secretos | OK | gitleaks limpio, sin claves en la definición ni en la prueba |
| 4 | Dependencias vulnerables | OK (sin cambio) | No hay dependencias nuevas. Los avisos existentes ya están en DT-005 |
| 5 | Autenticación y sesiones | No aplica | — |
| 6 | Entradas del usuario | No aplica | No se toca `src/` |
| 7 | Configuración | Hallazgo | La configuración de la guarda deja pasar opciones peligrosas (hallazgos 1 y 2) |
| 8 | Privacidad en logs | OK | La salida de tsc y eslint no trae datos personales. Sobre ver código, ver hallazgo 4 |
| 9 | Inyección de prompt | Ver nota | La app no usa IA. Si un texto engañoso llegara al tester, los hallazgos 1–3 dicen hasta dónde podría llegar |
| 10 | Datos de prueba | OK | La prueba usa comandos simulados, sin datos reales |

## Hallazgos
| # | Severidad | Origen | Archivo:línea | Qué pasa (tipo de fallo) | Cómo podría aprovecharse | Cómo se corrige |
|---|---|---|---|---|---|---|
| 1 | **Media** | Del cambio | `.claude/agents/tester.md:22` | **Lista de prohibiciones incompleta.** `npm run check` acepta opciones extra que llegan a ESLint (`npm run check -- -- <opción>`), y solo `--fix` está prohibida. Siguen libres `-o` / `--output-file` (escribe un archivo en cualquier ruta), `-c` / `--config` (carga y **ejecuta** un archivo JS) y `--cache-location` (escribe un archivo). También queda libre la opción de npm `--prefix <carpeta>`, que corre el script `check` de **otro** `package.json` | El tester podría escribir en `tests/` un archivo de configuración o un `package.json` con un script `check` propio, y hacer que `npm run check` lo ejecute. O podría usar `-o` para sobrescribir un archivo fuera de su zona (`src/`, `.claude/hooks/`), sin pasar por la guarda de escritura | Lo mejor es permitir **solo** `npm run check` exacto, sin argumentos. Hoy la guarda solo compara prefijos, así que haría falta una pequeña mejora en `guard-bash-allowlist.mjs`, por ejemplo una marca de "comando exacto". Si no, como mínimo agregar `"!-o" "!--output-file" "!-c" "!--config" "!--cache" "!--cache-location" "!--prefix" "!-f" "!--format"`, como ya hace la guarda de security |
| 2 | **Media** | Preexistente (la prohibición nueva depende de esto) | `.claude/hooks/guard-bash-allowlist.mjs:74` | **La prohibición se esquiva con comillas a medias o con barra invertida.** La guarda solo quita las comillas del **inicio y el final** de cada palabra. Escrituras como `--f"ix"`, `--'fix'` o `--f\ix` no coinciden con `--fix` y pasan, pero la terminal las convierte en `--fix` | Con `npm run check -- -- --f"ix"`, ESLint arreglaría y **modificaría** archivos de `src/`, que el tester tiene prohibido tocar. Afecta a toda guarda que use `!` (también la de security y la del coder) | En la guarda, antes de comparar, quitar **todas** las comillas y barras invertidas de cada palabra, o bloquear cualquier palabra que tenga comillas o `\` en medio. Agregar una prueba con esas tres variantes |
| 3 | **Media** | Preexistente | `.claude/agents/tester.md:22` (`npx vitest run`, `npx playwright test`, `npm run test:*`) | **El tester ya ejecuta código que él mismo escribe.** Sus pruebas en `tests/` son programas que vitest y playwright corren con permisos completos. Además, `--config` y `--prefix` están libres en esos comandos | Una prueba podría leer `src/` con `fs`, escribir fuera de la zona o lanzar otros comandos, y así saltarse las tres guardas. Por eso el hallazgo 1 no le da al tester un poder **nuevo**, solo otro camino | Es un límite propio del rol: el tester tiene que poder correr sus pruebas. Propuesta: (a) dejarlo registrado como riesgo aceptado en una decisión; (b) una regla de lint en `tests/` que prohíba importar `node:fs`, `node:child_process` y similares (`no-restricted-imports`), salvo excepciones aprobadas; (c) que el reviewer revise esos imports en cada diff de `tests/` |
| 4 | **Baja** | Del cambio | `.claude/agents/tester.md:22`, `package.json:14` | **El tester puede ver código de `src/` por la salida.** `tsc --noEmit` y `eslint .` revisan también `src/`, así que sus mensajes muestran rutas, líneas y nombres de `src/`. Con `npm run check -- -- -f json`, ESLint imprime **el texto completo** (campo `source`) de cada archivo que tenga avisos | Rompería la **independencia** del tester (diseñar pruebas sin ver el código), no un secreto. Vitest ya muestra fragmentos de código en sus errores (preexistente) | Queda cubierto si se corrige el hallazgo 1 (comando exacto, o `!-f` y `!--format`). La instrucción de `tester.md` §5 ("si un resultado te muestra código, no lo uses") sigue aplicando |
| 5 | **Baja** | Del cambio | `.claude/hooks/guards.test.mjs:83-91` | **La prueba no cubre las variantes reales.** Prueba `npm run check -- --fix`. Con un solo `--`, npm probablemente toma `--fix` como opción propia y no se la pasa a ESLint (no lo verifiqué ejecutándolo). La variante que sí llega a ESLint, `npm run check -- -- --fix`, no está probada, ni tampoco `--fix=true`, las comillas a medias, `-o` o `--prefix` | Una regresión en la guarda podría pasar en verde | Al corregir los hallazgos 1 y 2, agregar esas variantes a la prueba. Es buena práctica, no bloquea |

**¿Basta la prohibición `--fix`?** Contra un **error** del tester, sí: el uso normal (`--fix`, `"--fix"`, `--fix=…`) queda bloqueado. Contra un intento **a propósito**, no: se esquiva con comillas a medias (hallazgo 2) y no cubre otras opciones de ESLint ni de npm que escriben o ejecutan (hallazgo 1).

**¿Puede ejecutar otros comandos con `npm run check`?** No con encadenado: `; & | && $(` siguen bloqueados y la prueba lo comprueba. Sí de forma indirecta: con `-c` (configuración JS) o `--prefix` (otro `package.json`), hallazgo 1. Ese poder ya lo tenía con vitest (hallazgo 3).

## Deuda técnica propuesta (Media / Baja)
- DT-propuesta: dejar `npm run check` del tester como comando **exacto**, sin argumentos, o completar sus prohibiciones (`-o`, `--output-file`, `-c`, `--config`, `--cache`, `--cache-location`, `--prefix`, `-f`, `--format`) — **Media** — antes de lanzar al tester en el siguiente lote, o en este mismo MANT si el usuario quiere cerrarlo ya.
- DT-propuesta: `guard-bash-allowlist.mjs` debe quitar comillas y barras invertidas de **toda** la palabra antes de compararla con las prohibiciones, con prueba de `--f"ix"`, `--'fix'` y `--f\ix` — **Media** — en el próximo lote de mantenimiento de guardas. Afecta a todos los agentes.
- DT-propuesta: registrar como riesgo aceptado que el tester ejecuta su propio código (vitest/playwright), y considerar `no-restricted-imports` de `node:fs` y `node:child_process` en `tests/` — **Media** — al revisar VEGU.
- DT-propuesta: ampliar `guards.test.mjs` con `npm run check -- -- --fix`, `--fix=true`, comillas a medias, `-o` y `--prefix` — **Baja** — junto con las dos primeras.

## Lecciones propuestas
- Al permitirle un comando nuevo a un agente, revisar **todas** las opciones que ese comando acepta (también las de `npm` y las que pasan después de `--`), no solo la que preocupa. La pregunta es: ¿alguna opción escribe archivos, carga configuración o ejecuta código? — Aquí `--fix` se cubrió, pero `-o`, `-c` y `--prefix` quedaron libres. → VEGU
- Las guardas de Bash son barandas contra errores, no una jaula. Si un agente puede ejecutar código que él mismo escribe (pruebas), las guardas no lo detienen si lo intenta a propósito. Esto se dice en la decisión, en lugar de suponer que la guarda lo cubre. → VEGU

STATUS: DONE

# MANT-001 — ronda 2
**Fecha:** 2026-11-26 · **Rama revisada:** maint/T-005-tester-check vs. main · **Desde:** `5bbe6ed` (commits 485edc3 refactor, 74dc5cb prueba en rojo, fcae149 feat)

## Resumen
Las 9 prohibiciones nuevas bloquean bien todas las variantes que reporté en la ronda 1, y la prueba nueva las cubre una por una. Pero **el hallazgo 1 sigue abierto en parte**: todavía hay opciones de npm y de ESLint que llegan por `npm run check` y escriben archivos o ejecutan código. Además, ESLint 10 carga por sí solo un `eslint.config.js` que el tester deje en `tests/`, sin pasarle ninguna opción. **No hay Crítica ni Alta.** Hallazgos: 1 sigue abierto (Media, del cambio), 1 nuevo del cambio (Baja) y 1 nuevo preexistente (Media). Los hallazgos 2 y 3 quedan como deuda técnica, según lo que decidió el usuario.

Conclusión: una **lista de prohibiciones no alcanza** para cerrar este camino; siempre aparece otra opción. Lo que sí lo cierra es permitir **solo el comando exacto** `npm run check`, sin argumentos (lo propuse en la ronda 1). Hoy la guarda no lo permite sin un ajuste.

## Hallazgos de rondas anteriores
| # anterior | Estado | Nota |
|---|---|---|
| 1 | **Sigue abierto (en parte)** | Quedan bloqueadas `-o`, `--output-file`, `-c`, `--config`, `--cache`, `--cache-location`, `-f`, `--format` y `--prefix`, también con `=`, como en `-fjson`. Revisé la lógica de la guarda contra cada una de las 11 variantes de la prueba y todas dan "bloqueado". Siguen alcanzables las opciones del hallazgo R2-1 |
| 2 | Sigue abierto, ahora deuda técnica (decisión del usuario) | Las comillas a medias también esquivan las prohibiciones nuevas (`-"o"`, `--for"mat"`) |
| 3 | Sigue abierto, ahora deuda técnica (decisión del usuario) | Sin cambios |
| 4 | **Corregido** | `-f` y `--format` bloqueados: ya no se puede imprimir `src/` con `-f json` |
| 5 | **Corregido** | La prueba cubre ahora `-- -- --fix`, `--fix=true`, `-o`, `-c`, `--config`, `--cache`, `--cache-location`, `-f`, `--format` y `--prefix`. Las comillas a medias quedan dentro de la deuda del hallazgo 2 |

## Resultado de las herramientas
| Revisión | Comando | Resultado |
|---|---|---|
| Cambios nuevos | `git diff 5bbe6ed...HEAD`, `git log --oneline 5bbe6ed..HEAD` | 3 commits. Solo cambian `.claude/agents/tester.md` (línea de la guarda) y `.claude/hooks/guards.test.mjs` |
| Pruebas de las guardas | (lo corrió el Manager) `node --test .claude/hooks/guards.test.mjs` | pass 8, fail 0. El rojo falló en `npm run check -- -- -o tests/report.txt` (0 !== 2). La razón es correcta: la opción todavía no estaba prohibida. No lo ejecuté yo, porque mi guarda no lo permite |
| Secretos | `gitleaks git` de la ronda 1 | El diff nuevo solo trae nombres de opciones y rutas de ejemplo, sin claves. No volví a correr el detector completo, porque el paquete pidió revisar solo lo nuevo |
| Dependencias | — | Sin cambios de dependencias. Siguen los 12 avisos moderados de DT-005 |
| Documentación | Context7 `/eslint/eslint` (lista de opciones de la CLI, migración a v10) y `/npm/cli` (configuración) | Confirma las opciones de R2-1, la búsqueda de configuración por archivo de ESLint 10 (R2-3) y que npm acepta nombres de opción abreviados (R2-1) |

## Checklist OWASP (solo lo que cambia frente a la ronda 1)
| # | Riesgo | Estado | Nota |
|---|---|---|---|
| 2 | Inyección (de opciones) | Hallazgo | R2-1 |
| 7 | Configuración | Hallazgo | R2-1, R2-3 |
| Resto | — | Igual que en la ronda 1 | — |

## ¿Queda alguna opción alcanzable que escriba, cargue código o muestre `src/`?
Lo que va después de `npm run check --` se pega **solo al final** del script (`npm run typecheck && npm run lint …`). Por eso **tsc no recibe opciones extra**: el `typecheck` no se puede cambiar desde aquí. Hay dos puntos de entrada:
- **Con un solo `--`**, las opciones llegan a la **segunda llamada de npm** (`npm run lint <opciones>`), que las toma como opciones propias.
- **Con `-- --`**, llegan a **ESLint**.

Antes del primer `--`, las recibe la primera llamada de npm.

## Hallazgos
| # | Severidad | Origen | Archivo:línea | Qué pasa (tipo de fallo) | Cómo podría aprovecharse | Cómo se corrige |
|---|---|---|---|---|---|---|
| R2-1 (sigue el 1) | **Media** | Del cambio | `.claude/agents/tester.md:22` | **La lista de prohibiciones se puede rodear.** (a) **npm acepta nombres abreviados**: `--prefi tests` equivale a `--prefix tests` y no coincide con `!--prefix`. Pasa lo mismo con cualquier opción prohibida de npm. (b) **Abreviatura `-C`**: npm la usa como `--prefix` (tabla de abreviaturas de npm; no lo ejecuté). La guarda distingue mayúsculas: `!-c` no bloquea `-C`. (c) **Opciones de npm sin prohibir que ejecutan código o leen configuración**: `--script-shell <programa>` (corre el script con otro programa), `--node-options=--require=<archivo>` (inyecta un archivo JS en tsc y ESLint), `--userconfig <archivo>` / `--globalconfig <archivo>` (carga un `.npmrc` que puede fijar las dos anteriores). (d) **Opciones que escriben archivos**: `--logs-dir <carpeta>` de npm; `--suppress-all`, `--suppress-rule`, `--suppressions-location <ruta>` y `--prune-suppressions` de ESLint (escriben un archivo de supresiones en la ruta indicada). (e) **Opciones que descargan o arrancan programas**: `--init` (asistente que descarga paquetes y puede escribir configuración y `package.json`), `--inspect-config` (descarga y abre un servidor), `--mcp` (arranca un servidor), `--plugin` y `--flag` | Con un archivo propio en `tests/` y una de estas opciones, `npm run check` correría código del tester o escribiría fuera de su zona: `src/`, `.claude/hooks/` o el `package.json` | **Recomendado:** comando exacto. Agregar a `guard-bash-allowlist.mjs` una marca como `"=npm run check"`, que solo acepte el texto idéntico, con su prueba. Cierra R2-1 por completo y cuesta pocas líneas. **Alternativa** (más frágil): prohibir además `"!-C" "!--script-shell" "!--node-options" "!--userconfig" "!--globalconfig" "!--logs-dir" "!--suppress-all" "!--suppress-rule" "!--suppressions-location" "!--prune-suppressions" "!--init" "!--inspect-config" "!--mcp" "!--plugin" "!--flag"`. Aun así, las **abreviaturas** de npm (a) quedarían abiertas, porque la guarda no puede adivinarlas todas |
| R2-2 | **Baja** | Del cambio | `.claude/agents/tester.md:22` | **Las prohibiciones nuevas aplican a todos los comandos del tester**, no solo a `npm run check`. Hoy no le quitan nada que necesite: `--grep`, `--project`, `--reporter`, `-g` y `-t` siguen libres, y la prueba confirma `npx playwright test … --project=iphone`. Pero una opción corta futura que empiece por `-c`, `-f` u `-o` quedaría bloqueada sin aviso en vitest o playwright; las largas (`--…`) solo se bloquean si coinciden exactamente | El tester podría quedar bloqueado y terminar en `BLOCKED` (no es un riesgo de seguridad) | Con el comando exacto (R2-1) estas prohibiciones sobran y se pueden quitar. Si se mantienen, anotarlo en la definición del tester |
| R2-3 | **Media** | Preexistente (el cambio le suma un camino más) | `package.json:13` (`"lint": "eslint ."`) y la zona de escritura del tester (`tests`) | **ESLint 10 busca su configuración desde la carpeta de cada archivo** (documentación de migración a v10). Si el tester escribe `tests/eslint.config.js` (o `.mjs`, `.ts`), ESLint lo **carga y lo ejecuta** al revisar `tests/`, sin ninguna opción. Pasa con `npm run check`, que es lo nuevo, y también en la **CI**, que es preexistente | Ese archivo podría apagar el lint para las pruebas del tester, en su máquina y en la CI, y nadie lo notaría. También podría correr cualquier código al ejecutar `npm run check` | Fijar la configuración en el script: `"lint": "eslint -c eslint.config.js ."`. Con `-c`, ESLint no busca otras configuraciones. Además, una prueba o un paso de la CI que falle si aparece un `eslint.config.*` fuera de la raíz. Es un cambio de cadena de entrega (nivel Alto), así que lo aprueba el usuario. Si no se hace ahora, va como deuda técnica junto al hallazgo 3 |

**Sobre ver código de `src/`:** con `-f`/`--format` bloqueados, la salida normal (`stylish`) solo muestra ruta, línea, columna y mensaje; no imprime el código. `--debug` y `--print-config` muestran rutas y configuración, no código. Solo queda abierto por la vía de R2-1 (código propio) y del hallazgo 3 (vitest), que ya es deuda técnica.

## Deuda técnica propuesta (Media / Baja)
- DT-propuesta: si el usuario no quiere el comando exacto en este MANT, R2-1 queda como deuda: marca de "comando exacto" en `guard-bash-allowlist.mjs` para `npm run check` — **Media** — antes del próximo trabajo A del tester, o junto con la DT de las comillas (hallazgo 2), porque las dos tocan la guarda.
- DT-propuesta: fijar la configuración de ESLint en el script (`eslint -c eslint.config.js .`) y comprobar que no haya `eslint.config.*` fuera de la raíz (R2-3) — **Media** — en el próximo lote de mantenimiento de la cadena de entrega.
- DT-propuesta: si se adopta el comando exacto, retirar de la guarda del tester las prohibiciones de esta ronda (R2-2) — **Baja** — junto con la primera.

## Lecciones propuestas
- Una lista de opciones prohibidas no cierra un comando que acepta opciones de dos programas (npm y la herramienta que npm llama). npm además acepta abreviaturas, así que siempre aparece otra salida. Cuando un agente necesita un comando sin variantes, se permite el **texto exacto**. → VEGU
- Desde ESLint 10, cualquier carpeta donde un agente pueda escribir puede traer su propio `eslint.config.*` y cambiar el lint de esa carpeta, también en la CI. La configuración se fija con `-c` en el script. → VEGU

STATUS: DONE
