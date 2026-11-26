# MANT-001 — revisión inicial

# Revisión de calidad — MANT-001 (T-005, promueve L-012) — ronda 1
**Fecha:** 2026-11-26 · **Rama revisada:** `maint/T-005-tester-check` vs. `main`

## Resumen
El cambio es pequeño, quirúrgico y hace lo que pide T-005: la guarda del tester acepta `npm run check` y prohíbe `--fix`. La prueba nueva lee los **argumentos reales** de `tester.md` y los pasa a la guarda real, así que prueba la configuración de verdad y no una copia. El TDD se ve en los commits (rojo → corrección del rojo → verde).
**Hallazgos:** 0 Bloqueantes · 1 Refactor futuro (del cambio) · 2 Deuda técnica (preexistentes). Hay una nota para security. **Revisión incompleta en un punto:** no pude correr `node --test` porque mi guarda no lo permite (ver herramientas).

## Resultado de las herramientas
| Revisión | Comando | Resultado |
|---|---|---|
| Duplicación | `npx jscpd src tests --min-lines 10 .claude/hooks` | 0 clones en `.claude/hooks`. Hay 3 clones preexistentes en `tests/` (uno ya es DT-008, ver hallazgo 3) |
| Complejidad | `npx eslint --no-ignore .claude/hooks/guards.test.mjs` | Sin errores. Nota: `eslint .` ignora `.claude/` por configuración, por eso usé `--no-ignore` (solo lectura) |
| Código sin uso | — | No aplica: no se agregaron exportaciones ni dependencias; la función nueva `agentGuardArgs` se usa en la prueba nueva |
| Tipos | — | No aplica: son archivos `.mjs` y `.md`, sin tipos |
| Pruebas | `node --test .claude/hooks/guards.test.mjs` | **No corrida: revisión incompleta.** Mi guarda no permite `node --test`. Hace falta que el Manager adjunte la salida en verde en la rama y la salida en rojo en `bf9b4b1` (con el `tester.md` viejo) |
| TDD visible | `git log --oneline main..HEAD` + `git show` | `7ebfe6d test` → `bf9b4b1 test` → `5bbe6ed feat`. Correcto (detalle abajo) |
| Mutación | — | No corrida: el cambio no tiene lógica de `src/` (así lo indica el paquete del Manager) |

**TDD, paso por paso:**
- `7ebfe6d test(T-005)` solo toca `guards.test.mjs`. Su rojo fallaba por un error de la propia prueba (los pares de comillas quedaban corridos), no por la guarda: no era un rojo válido.
- `bf9b4b1 test(T-005)` corrige la lectura (+1 para saltar la comilla de cierre de la ruta) y el mensaje dice que se comprobó otra vez el rojo, ahora en la aserción de `npm run check`. Lo revisé leyendo el código: con los argumentos viejos, `npm run check` no está en la lista, la guarda da 2 y la primera aserción falla. **El rojo es válido.** Además, con la lista vieja, `npm run check -- --fix` se habría bloqueado por "comando no permitido" y no por "prohibida", así que la aserción `/prohibida/` prueba de verdad el `!--fix` nuevo.
- `5bbe6ed feat(T-005)` solo toca `tester.md` (una línea). No cambia ninguna aserción.

## Mapa de archivos
| Archivo | Paso(s) según los commits | ¿En el plan? (Sí / No / Tester / Manager / Generado) | Nota |
|---|---|---|---|
| `.claude/hooks/guards.test.mjs` | `test(T-005)` ×2 | Sí (T-005: "comprobar con `guards.test.mjs`") | +21 líneas: un `import`, la función `agentGuardArgs` y una prueba |
| `.claude/agents/tester.md` | `feat(T-005)` | Sí (T-005: agregar `"npm run check"` a la guarda) | También agrega `"!--fix"`, que no estaba en T-005 pero sí en el paquete del Manager aprobado. Es una restricción (quita poder), no comportamiento nuevo |

**Archivos del plan que no aparecen en el diff:** `_persistence/lessons.md` (T-005 pide pasar L-012 a `Promovida`). Es memoria y la escribe el Manager en el cierre, así que no es un hallazgo; lo dejo anotado para que no se olvide.

## Hallazgos
| # | Tipo | Origen | Archivo:línea | Qué pasa (tipo de fallo) | Por qué importa | Sugerencia |
|---|---|---|---|---|---|---|
| 1 | Refactor futuro | Del cambio | `.claude/hooks/guards.test.mjs:78-80` | **Lectura del texto que depende de una posición exacta:** `indexOf(hook) + hook.length + 1` da por hecho que justo después del nombre del hook viene una comilla. Si alguien cambia el formato de la línea (por ejemplo, quita las comillas de la ruta o agrega un espacio), los pares de comillas se corren, como pasó en `7ebfe6d`. **No da un verde falso:** si los pares se corren, la guarda recibe solo espacios, no queda ningún prefijo permitido y la primera aserción falla. Por eso no es Bloqueante | Una cuenta de "+1" se rompe en silencio con un cambio de formato, y el siguiente que lo vea pierde tiempo como en el primer rojo | Tomar todos los textos entre comillas de la línea y descartar el primero (la ruta del hook): `[...line.matchAll(/"([^"]*)"/g)].map((m) => m[1]).slice(1)`. Sin aritmética, y más fácil de explicar |
| 2 | Deuda técnica | Preexistente | `.claude/hooks/guards.test.mjs` (todo el archivo); `package.json`; `.github/workflows/ci.yml` | **Prueba que nada corre de forma automática:** `guards.test.mjs` no está en ningún script de `package.json` ni en la CI. Solo corre si alguien se acuerda de `node --test` | La prueba nueva protege la guarda del tester solo el día que alguien la corra; un cambio futuro a `tester.md` puede romperla sin que la CI se entere. Además, ni el reviewer ni el tester pueden correrla con sus guardas | Agregar un script (p. ej. `test:guards`) y un paso en la CI; y agregarlo a la guarda del reviewer. Es cadena de entrega: nivel Alto y lo aprueba el usuario |
| 3 | Deuda técnica | Preexistente | `tests/e2e/published.spec.ts:12-22` ≈ `tests/e2e/skeleton.spec.ts:5-10`; `tests/e2e/round1.spec.ts:13-26` ≈ `tests/unit/round1.test.ts:4-14` | **Duplicación en las pruebas** (11 y 14 líneas). El tercer clon (`published` ≈ `typing`, 134-148) ya es **DT-008** | Pesa poco (son pruebas), pero cuando cambie el comportamiento hay que arreglarlo en dos lugares | Revisarlo junto con DT-008, cuando se toquen esas pruebas |

**Nota para security (una línea):** el `!--fix` nuevo no cubre otras opciones que escriben archivos y que se pueden pasar a eslint a través del script, por ejemplo `npm run check -- -- -o informe.txt`, `--output-file` o `--cache`. El tester podría escribir fuera de su zona por Bash. La guarda del reviewer sí prohíbe `-o` y `--output-file`.

## Sugerencias de estilo (máx. 3, solo en la ronda 1)
- `.claude/hooks/guards.test.mjs:90`: agregar un comentario corto a la última aserción (`npm run test:unit` → 0), algo como "lo que ya tenía permitido sigue permitido". Así un principiante entiende que está ahí para que el cambio no dañe la lista vieja, y no la ve como algo suelto.
- `.claude/hooks/guards.test.mjs:73`: el comentario podría decir **por qué** se leen los argumentos reales y no una copia: "si `tester.md` cambia, la prueba se entera". Es la idea clave de L-012 y hoy hay que deducirla.

Se omitieron 0 sugerencias de estilo.

## Pruebas de mutación
No se corrieron: el cambio no tiene lógica en `src/` (`stryker.config.json` solo muta `src/counting.ts` y `src/inputFilter.ts`). Duración: —

## Deuda técnica propuesta
- DT-propuesta: `guards.test.mjs` no corre en la CI ni tiene un script de npm (hallazgo 2). Impacto: las pruebas de las guardas, incluida la de L-012, solo corren a mano. Cuándo pagarla: en el próximo lote de mantenimiento de la cadena de entrega (junto con DT-006/DT-007).
- DT-propuesta: dos clones preexistentes en `tests/` que no están registrados (hallazgo 3). Impacto: bajo. Cuándo pagarla: junto con DT-008.
- DT-propuesta (refactor futuro): simplificar `agentGuardArgs` para no usar "+1" (hallazgo 1). Impacto: bajo. Cuándo pagarla: la próxima vez que se toque `guards.test.mjs` (p. ej. al probar la guarda de otro agente).

## Lecciones propuestas
- **Una prueba de guarda lee los argumentos reales de la definición del agente, no una copia escrita a mano.** Porque así un cambio en `tester.md` rompe la prueba, y se puede repetir para coder, reviewer y security.
- **Esta prueba no pasa por la capa de la shell** (la expansión de `"$CLAUDE_PROJECT_DIR"` y las comillas con que Claude Code ejecuta el hook). Propuesta: después de fusionar, el primer tester de VS-002 corre `npm run check` de verdad, y el Manager guarda esa salida como evidencia de que la guarda en vivo lo deja pasar.

STATUS: DONE

# MANT-001 — ronda 2

# Revisión de calidad — MANT-001 — ronda 2
**Fecha:** 2026-11-26 · **Rama revisada:** `maint/T-005-tester-check` vs. `main` · **Desde:** `5bbe6ed`

## Resumen
Los 3 commits nuevos están limpios. `485edc3` es un refactor puro que corrige el hallazgo 1. `74dc5cb` (test) y `fcae149` (feat) cierran la nota de security con 9 prohibiciones nuevas, en el orden correcto de TDD. Revisé los comandos que el tester usó en VS-001 y que nombran los skills, y **ninguno queda bloqueado**.
**Hallazgos nuevos:** 0 Bloqueantes · 1 Refactor futuro (del cambio). Queda una nota de una línea para security.

## Hallazgos de rondas anteriores
| # anterior | Estado | Nota |
|---|---|---|
| 1 (lectura con "+1") | Corregido | `485edc3`: ahora toma todos los textos entre comillas y descarta el primero (`.slice(1)`), como se sugirió. El commit solo cambia la función y su comentario; no agrega pruebas ni cambia aserciones, así que es un refactor de verdad |
| 2 (`guards.test.mjs` fuera de la CI) | Sigue abierto | Queda como deuda técnica, por decisión del usuario |
| 3 (clones preexistentes en `tests/`) | Sigue abierto | Queda como deuda técnica, por decisión del usuario |
| Nota para security (`-o`, `--output-file`, `--cache`) | Corregido | `fcae149` los prohíbe, junto con `-c`, `--config`, `--cache-location`, `-f`, `--format` y `--prefix` |
| Sugerencias de estilo 1 y 2 | Atendidas | Línea 90 ("What it could already run must still be allowed") y comentario de las líneas 73-74 (el porqué de leer los argumentos reales) |

## Resultado de las herramientas
| Revisión | Comando | Resultado |
|---|---|---|
| Duplicación | — | No corrida otra vez: son +27 líneas, la mayoría una lista de textos. No hay bloques repetidos de más de 10 líneas |
| Complejidad | `npx eslint --no-ignore .claude/hooks/guards.test.mjs` | Sin errores |
| Código sin uso | — | No aplica: no hay exportaciones ni dependencias nuevas |
| Tipos | — | No aplica (`.mjs` y `.md`) |
| Pruebas | `node --test .claude/hooks/guards.test.mjs` (salida del Manager) | pass 8, fail 0. **No la verifiqué yo:** mi guarda no permite `node --test`, así que me apoyo en la salida que dio el Manager |
| TDD visible | `git log --oneline --name-only 5bbe6ed..HEAD` + `git show --stat` | `485edc3 refactor` → `74dc5cb test` (solo `guards.test.mjs`, +27) → `fcae149 feat` (solo `tester.md`, una línea). Correcto |
| Mutación | — | No corrida: el cambio no toca `src/` |

**El rojo, revisado leyendo el código:** el Manager dice que el rojo falló en `npm run check -- -- -o tests/report.txt` (0 !== 2). Eso cuadra:
- Las dos primeras entradas (`--fix` y `--fix=true`) ya se bloqueaban con el `!--fix` de la ronda 1, así que pasan también en el rojo.
- La tercera (`-o`) es la primera que la lista vieja dejaba pasar.
- Las 8 entradas siguientes también se habrían dejado pasar con la lista vieja (todas empiezan por `npm run check` y ninguna estaba prohibida). Cada una tiene su propia aserción con el comando como mensaje, así que si una falla, se sabe cuál.
- La aserción `/prohibida/` asegura que se bloquean por la opción prohibida y no por otra razón.

**¿Se rompen los comandos que el tester ya usaba?** Revisé contra la guarda real (`matchesForbidden`): un token `--largo` solo coincide con la palabra exacta o con `--largo=…`; un token `-x` solo coincide con las palabras que empiezan por `-x`.
- `npx playwright test --project=captures --output=_project/slices/.../capturas/lote-N`: es el comando de las capturas (en `project-context` y en `tester.md` de VS-001, líneas 160 y 249). `--output=` no es `--output-file` y no empieza por `-o` (empieza por `--`), así que **sigue permitido**.
- `--project=iphone`, `--reporter=line`, `--list` y `npx vitest run tests/unit/<archivo>`: ninguno coincide. Siguen permitidos.
- `npm run test:unit`, `npm run test:e2e` y `npm run check`: no llevan opciones. Siguen permitidos; los dos primeros y `playwright ... --project=iphone` ya tienen aserción.

## Mapa de archivos (solo lo nuevo)
| Archivo | Paso(s) según los commits | ¿En el plan? | Nota |
|---|---|---|---|
| `.claude/hooks/guards.test.mjs` | `refactor(T-005)`, `test(T-005)` | Sí (hallazgo 1 del reviewer; hallazgo 1 de security) | |
| `.claude/agents/tester.md` | `feat(T-005)` | Sí (hallazgo 1 de security) | Solo la línea de la guarda de Bash |

**Archivos del plan que no aparecen en el diff:** sigue faltando `_persistence/lessons.md` (L-012 → `Promovida`). Le toca al Manager en el cierre.

## Hallazgos
| # | Tipo | Origen | Archivo:línea | Qué pasa (tipo de fallo) | Por qué importa | Sugerencia |
|---|---|---|---|---|---|---|
| 4 | Refactor futuro | Del cambio | `.claude/hooks/guards.test.mjs:91-94` | **Falta una prueba de que un comando muy usado sigue permitido:** las aserciones de "lo que ya podía correr" no incluyen el comando de capturas `npx playwright test --project=captures --output=<carpeta>`. Es el comando del tester que más se parece a una opción prohibida (`-o`, `--output-file`). Hoy pasa, pero si alguien agrega `!--output` (como en la guarda del reviewer), el tester dejaría de poder guardar capturas y ninguna prueba lo avisaría | Las capturas son evidencia obligatoria de cada lote. Si la guarda las bloquea, el problema aparece a mitad de una slice y no en esta prueba | Agregar `assert.equal(run(..., bash("npx playwright test --project=captures --output=_project/slices/VS-002/evidence/capturas/lote-1")).code, 0)` junto a las aserciones de "What it could already run" |

**Nota para security (una línea):** siguen abiertas opciones de npm que hacen correr código, como `npm run check --script-shell <archivo>`, `--node-options=--require <archivo>` o `--userconfig <archivo>`. Pero el tester ya puede correr cualquier código con sus propias pruebas (`npx vitest run tests/...`), así que estas prohibiciones son una defensa extra, no una barrera completa. Que security decida si vale la pena seguir sumando opciones.

## Pruebas de mutación
No se corrieron: sin lógica de `src/` en el cambio.

## Deuda técnica propuesta
- DT-propuesta (refactor futuro): agregar a `guards.test.mjs` la aserción de que el comando de capturas con `--output=` sigue permitido (hallazgo 4). Impacto: bajo hoy, alto si se endurece la guarda sin darse cuenta. Cuándo pagarla: la próxima vez que se toque la guarda del tester, o junto con el hallazgo 2 (llevar `guards.test.mjs` a la CI).

## Lecciones propuestas
- **Al prohibir opciones en una guarda, probar también que los comandos de trabajo del agente siguen pasando, sobre todo los que se parecen a lo prohibido** (p. ej. `--output=` frente a `-o` y `--output-file`). Porque una guarda demasiado estricta no falla en la revisión: falla después, cuando el agente la necesita.

STATUS: DONE
