# Revisión inicial — VS-001
**Revisión de calidad — ronda 1** · **Fecha:** 2026-11-26 · **Rama revisada:** `feature/VS-001-contar-en-el-celular` (HEAD `dc7b495`) vs. `main` (`git diff main...HEAD`) · **Nivel de riesgo:** Alto (aprobado por el usuario)

## Resumen
La slice está en buen estado: tipos, lint (con la regla de complejidad ≤ 10 activa) y las 207 unitarias en verde, sin duplicación en el código de la app, sin código sin uso real, el orden prueba → código visible en todos los pasos y los 49 casos TC-001 a TC-049 con al menos una prueba con su ID.
**0 Bloqueantes.** 2 Refactor futuro y 1 Deuda técnica, todos **del cambio** (ninguno preexistente). La mutación (solo informe) deja 9 sobrevivientes: **2 marcados "Sería bloqueante"** en el filtro (`src/inputFilter.ts`, anclas `^` de dos expresiones), 4 de borde en `countCharacters` que desde la pantalla no se alcanzan y 3 equivalentes.

## Resultado de las herramientas
| Revisión | Comando | Resultado |
|---|---|---|
| Tipos | `npm run check` (incluye `tsc --noEmit`) | Sin errores |
| Complejidad | `npm run check` (incluye `eslint .`, regla `complexity: ["error", { max: 10 }]` en `eslint.config.js` desde P-1) | Sin errores: ninguna función pasa de 10 |
| Pruebas | `npm run test:unit` | 4 archivos, **207 pasan**, 0 fallan, 0 saltadas |
| Duplicación | `npx jscpd src tests --min-lines 10` | 3 clones, **todos en pruebas** (1,41 % de las líneas TS); **0 en `src/`**. (1) `tests/e2e/published.spec.ts:134-148` = `tests/e2e/typing.spec.ts:134-148` (15 líneas: revisión de almacenamiento y red) → hallazgo 1. (2) `published.spec.ts:12-22` ≈ `skeleton.spec.ts:5-10` (11 líneas: la misma comprobación del título contra la app local y contra la publicada; es el diseño del plan P-1/P-2, no es hallazgo). (3) `tests/e2e/round1.spec.ts:13-26` ≈ `tests/unit/round1.test.ts:4-14` (constantes de códigos en dos corredores distintos, Playwright y Vitest; no es hallazgo) |
| Código sin uso | `npx knip` | 5 archivos de `.claude/hooks/` → **falso positivo conocido** (los ejecuta Claude Code). Dependencia `jscpd` "sin uso" → **falso positivo conocido** (se usa con `npx`, D-020). Tipo exportado `CharacterGroup` (`src/counting.ts:1`) "sin uso" → **no es hallazgo**: es interfaz pública del plan §5.2. Nada más sin uso |
| Mutación | `npx stryker run` | 135 mutantes en `src/counting.ts` y `src/inputFilter.ts`: 122 muertos, 9 sobrevivientes, 0 sin cobertura, 4 con error de compilación (no cuentan). Puntaje 93,13 %. Detalle abajo |
| Señales C-010 / innerHTML | Búsqueda de `localStorage`, `sessionStorage`, `indexedDB`, `fetch(`, `XMLHttpRequest`, `sendBeacon`, `innerHTML`, `console.`, `TODO`, `.only(`, `.skip(` | En `src/` e `index.html`: **ninguna**. Solo aparecen `localStorage`/`sessionStorage`/`indexedDB` en las pruebas que comprueban que **no** se guarda nada (TC-024, TC-025) |

## Mapa de archivos
| Archivo | Paso(s) según los commits | ¿En el plan? | Nota |
|---|---|---|---|
| `index.html` | `chore(P-1)` 97778c8, `feat(P-1)` 7d1b072, `feat(P-3)` 0dad16c | Sí (P-1, P-3) | Marcado igual a §5.1 (testids, atributos, sin `maxlength`/`placeholder`) |
| `src/styles.css` | `feat(P-3)` 0dad16c | Sí (P-3) | Solo tokens; designer ya lo revisó |
| `src/main.ts` | `feat(P-3)`, `feat(P-6)` a8132ab y 812bfc8, `feat(P-7)` 0552e17, fda4d0f, a6f81c6 | Sí (P-3, P-6, P-7) | Ver hallazgo 2 (comentario) |
| `src/counting.ts` | `test(P-4)` 1a931cb (esqueleto), `feat(P-4)` 981e9a5, `feat(P-5)` 0249f80 | Sí (P-4, P-5) | Interfaz idéntica a §5.2 |
| `src/counting.test.ts` | `test(P-4)`, `test(P-5)` 5662fdb | Sí (P-4, P-5) | |
| `src/inputFilter.ts` | `test(P-7)` b897eff y `test(P-8)` 4e94643 (esqueletos), `feat(P-7)` 0552e17, 11dd3ce, dfb5ba4, e550a05, 0c0dbe7, `feat(P-8)` eaa6459 | Sí (P-7, P-8) | Interfaz idéntica a §5.2 (`MAX_TEXT_LENGTH`, `textLength`, `InputResult`, `applyInput`) |
| `src/inputFilter.test.ts` | `test(P-7)` b897eff, ab2285d, 70d83c6, ef6d423, 6491280; `test(P-8)` 4e94643 | Sí (P-7, P-8) | |
| `tests/e2e/skeleton.spec.ts`, `published.spec.ts` | `test(acceptance)` e83804a, 8816b4d | Tester (P-1, P-2, P-10) | |
| `tests/e2e/screen.spec.ts`, `captures.spec.ts` | `test(acceptance)` 23e3567, 854bb27, 8c63602 | Tester (P-3, P-6, P-8) | |
| `tests/e2e/typing.spec.ts` | `test(acceptance)` 854bb27 | Tester (P-6) | |
| `tests/e2e/foreign-letters.spec.ts`, `max-length.spec.ts`, `field-helpers.ts` | `test(acceptance)` 8c63602 | Tester (P-7, P-8) | `field-helpers.ts` es ayuda de prueba compartida: soporte |
| `tests/e2e/round1.spec.ts` | `test(acceptance)` c9f7515 | Tester (ronda 1) | Ver hallazgo 3 |
| `tests/unit/counting.test.ts` | `test(acceptance)` 23e3567, 854bb27 | Tester (P-4, plan §6) | |
| `tests/unit/round1.test.ts` | `test(acceptance)` c9f7515, fbf354e | Tester (ronda 1) | fbf354e ajusta TC-047 unitaria a la opción B del plan (8c81659); el feat a6f81c6 no tocó pruebas |
| `package.json` | `chore(P-1)`, `chore(P-2)` 3305f8b, `chore(P-4)` b139b09, `chore(VS-001)` 350ae4e | Sí (P-1, P-2, P-4) + Manager (D-020) | Versiones exactas = tabla §2.2 (`@eslint/js` 10.0.1 cumple "10.x"). jscpd 5.4.3, knip 6.45.1 y Stryker 10.1.1 vienen de D-020, fuera de la tabla del plan; aprobados por el Manager |
| `package-lock.json` | Los mismos `chore` | Generado | |
| `tsconfig.json` | `chore(P-1)`, `feat(P-3)` 0dad16c | Sí (P-1); P-3 no lo lista | En P-3 solo agrega `"vite/client"` a `types` para poder importar `./styles.css`: soporte necesario, sin comportamiento |
| `eslint.config.js`, `.gitattributes` | `chore(P-1)`, 9c45840 | Sí (P-1) | |
| `.gitignore` | `chore(P-1)`, `chore(VS-001)` 9ae54c1 | Sí (P-1) + Manager (D-020) | Agrega `.stryker-tmp` y `/reports/` |
| `playwright.config.ts` | `chore(P-1)`, `chore(P-2)`, `chore(P-3)` d0c47d8 | Sí (P-1, P-2, P-3) | |
| `vitest.config.ts` | `chore(P-4)` | Sí (P-4) | `include` explícito, como pide el plan |
| `.github/workflows/ci.yml` | `ci(P-9)` 5674a5a | Sí (P-9) | Igual a §P-9 |
| `stryker.config.json`, `.claude/agents/reviewer.md`, `.claude/skills/review-checklist/SKILL.md` | `chore(VS-001)` 1b042df | Manager (D-020) | Herramientas del reviewer; no son de la app |
| `_project/**` (plan, F-001, VS-001, reportes, evidencia) | commits `docs(...)` | Manager / agentes | Documentos y evidencia |

**Archivos del plan que no aparecen en el diff:** ninguno. (Nota menor: P-2 pedía `evidence/p2-iphone.png`; está como `p2-iphone.jpg`. Es una foto del iPhone, no afecta.)
**No verificado por mí:** el texto de D-020 no está en el `_persistence/decisions.md` de esta rama (lo citan `coder.md` y `clasificacion-9c.md`); el Manager confirma que está registrado en `main`.

## TDD visible
Cumple en todos los pasos. P-1: `test(acceptance)` e83804a → `chore` → `feat` 7d1b072. P-3 y P-6: `test(acceptance)` antes de cada `feat`. P-4, P-5, P-7 y P-8: cada `test(P-X)` va antes de su `feat(P-X)`, y los `test` solo tocan pruebas y el esqueleto de la función. Ronda 1: c9f7515 (TC-043 a TC-049 en rojo) antes de 812bfc8, fda4d0f y a6f81c6; ab2285d → 11dd3ce, 70d83c6 → dfb5ba4, ef6d423 → e550a05, 6491280 → 0c0dbe7. Ningún `feat` cambia las aserciones de su prueba. No hay commits `refactor`. P-2 y P-9 son solo `chore`/`ci`, como dice el plan.

## Hallazgos
| # | Tipo | Origen | Archivo:línea | Qué pasa (tipo de fallo) | Por qué importa | Sugerencia |
|---|---|---|---|---|---|---|
| 1 | Refactor futuro | Del cambio | `tests/e2e/typing.spec.ts:134-148` y `tests/e2e/published.spec.ts:134-148` | **Bloque de prueba copiado (15 líneas):** la revisión "no se guardó nada" (`localStorage`, `sessionStorage`, `indexedDB`) está escrita dos veces | Si mañana se agrega otra forma de guardar (p. ej. cookies), hay que acordarse de cambiar las dos copias; si se cambia solo una, una de las pruebas de C-010 queda más débil sin que nadie lo note | Moverlo a una función de `tests/e2e/field-helpers.ts` (p. ej. `readStoredData(page)`) y usarla en ambas |
| 2 | Refactor futuro | Del cambio | `src/main.ts:61` | **Comentario impreciso:** dice que el campo "solo se reescribe cuando algo no entró", pero también se reescribe cuando la app **une una letra en dos piezas** (`n` + `~` → `ñ`), porque el texto pasa a NFC y deja de ser igual al del campo | Quien lea el código (o el usuario aprendiendo) puede creer que unir la ñ no toca el campo ni el historial de deshacer; justo de eso depende `isHistoryStale` (D-003 / TC-044) | Reescribirlo, p. ej.: "El campo solo se reescribe si el filtro cambió algo (quitó caracteres o unió una letra en dos piezas); si no, el cursor queda donde lo dejó el navegador" |
| 3 | Deuda técnica | Del cambio | `tests/e2e/round1.spec.ts:47` | **Espera fija en una prueba:** `waitForTimeout(1000)` en TC-043. El plan (P-6, "Lecciones") dice que la espera de 2 s de TC-027 "es la única espera fija permitida en la slice" | Una espera fija hace la prueba más lenta y puede fallar o pasar por azar en una máquina más lenta. Aquí está justificada (comprobar que el navegador **no** repone el texto exige esperar un tiempo), pero contradice una regla escrita del plan sin que conste la excepción | No es regla dura ni de project-context, por eso no bloquea. Que el Manager registre la excepción en el plan (o en una lección), o que el tester la cambie por una espera a un evento (`pageshow`) más una ventana corta documentada |

## Sugerencias de estilo (máx. 3, solo en la ronda 1)
- `src/counting.ts:12` y `src/inputFilter.ts:22` — el mismo `Intl.Segmenter` se crea dos veces con nombres distintos (`graphemes` y `segmenter`) y el mismo comentario — usar el mismo nombre en los dos archivos ayuda a ver que es la misma pieza (o exportarlo desde un solo lugar).
- `src/counting.ts:15-16` — `VOWELS.includes(character)` busca un **trozo** dentro de un texto; funciona porque cada grafema es una sola letra, pero un principiante puede no ver por qué — una lista (`new Set([...])`) o un comentario dice explícitamente "¿es una de estas letras?".
- `src/main.ts:34` — `selected` guarda dónde empieza y termina la selección; `selection` o `selectionBeforeChange` dice mejor qué es.

Se omitieron 2 sugerencias de estilo.

## Pruebas de mutación
`src/counting.ts` y `src/inputFilter.ts` (únicos archivos de lógica de reglas; `src/main.ts` se prueba por E2E, que Stryker no corre) · 1 min 53 s · prueba inicial en verde (207 pruebas).

| Archivo | Puntaje | Muertos | Sobrevivientes | Sin cobertura |
|---|---|---|---|---|
| `src/counting.ts` | 82,76 % | 24 | 5 | 0 |
| `src/inputFilter.ts` | 96,08 % | 98 | 4 | 0 |

| Mutante (archivo:línea) | Cambio | Clasificación | Por qué |
|---|---|---|---|
| `src/inputFilter.ts:16` | `SPANISH_LETTER` sin `^` (`/[a-zA-Z…ªº]$/u`) | **Sería bloqueante** | Con el cambio, un grafema que **termina** en letra española pero lleva delante una letra de otro alfabeto que se antepone (Prepend, p. ej. `U+0D4E` + `a`, un solo grafema) **entra completo**, con la letra ajena (C-011). Hoy no entra nada, y ninguna prueba lo fija. Prueba que falta: `applyInput("casa", "casa" + "ൎa", 6)` → `{ text: "casa", cursor: 4 }` (y su E2E pegando lo mismo) |
| `src/inputFilter.ts:6` | `NUMBER_KEY` sin `^` (`/[0-9#*]\u{FE0F}?\u{20E3}/u`) | **Sería bloqueante** (y pide una decisión) | Con el cambio, `U+0600` + `1` + `U+FE0F` + `U+20E3` (o `U+0D4E` delante) deja entrar la **tecla** `1️⃣` en vez de lo que entra hoy (`1` con `U+0600`; nada con `U+0D4E`). Toca el "pase completo exacto" (L-023, D-018). **Ojo:** el plan §5.2 dice qué hacer con un Prepend delante de un **emoji** (se separa y el emoji entra), pero no dice nada para una **tecla de número**; hoy la tecla con Prepend delante no pasa como tecla. Antes de escribir la prueba, el Manager debe confirmar con el usuario cuál es el resultado correcto |
| `src/counting.ts:8` | `DIGIT` sin `^` (`/[0-9]$/`) | Refactor futuro (borde de C-006 sin prueba unitaria) | `countCharacters("؀" + "1")` (un solo grafema) daría Números 1 en vez de Otros 1. **Desde la pantalla no se alcanza:** el filtro quita `U+0600` antes de contar. Prueba que falta en `countCharacters` |
| `src/counting.ts:9` | `ONLY_WHITE_SPACE` sin `^` | Refactor futuro (borde de C-008) | `"؀ "` (un grafema) dejaría de contarse como Otros. No se alcanza desde la pantalla (el filtro quita `U+0600`) |
| `src/counting.ts:9` | `ONLY_WHITE_SPACE` sin `$` | Refactor futuro (borde de C-008) | `" " + U+0301` dejaría de contarse como Otros. No se alcanza desde la pantalla (TC-048: el filtro quita la tilde y deja el espacio) |
| `src/counting.ts:9` | `ONLY_WHITE_SPACE` sin `+` | Refactor futuro (borde de C-008) | `"\r\n"` es **un solo grafema**: con el cambio contaría 1 Otros. El `<textarea>` convierte los saltos `\r\n` en `\n`, así que desde la pantalla no se alcanza; pero el contrato de `countCharacters` dice que los saltos no se cuentan. Prueba que falta: `countCharacters("la\r\ncasa")` → 3/3/0/0 |
| `src/counting.ts:12` | `Intl.Segmenter("es-CO", {})` | Equivalente | `granularity` vale `"grapheme"` por defecto: mismo resultado para toda entrada |
| `src/inputFilter.ts:22` | `Intl.Segmenter("es-CO", {})` | Equivalente | Igual que el anterior |
| `src/inputFilter.ts:93` | Quitar `.filter(Boolean)` | Equivalente | Los `""` que quedarían en la lista no ocupan lugar ni cambian el texto en `takeWhileItFits` |

## Deuda técnica propuesta
- DT-propuesta — Copia de 15 líneas de la revisión de almacenamiento en `typing.spec.ts` y `published.spec.ts` (hallazgo 1) — una de las dos pruebas de C-010 puede quedarse atrás si se cambia solo una — al tocar esas pruebas en VS-002 o en el próximo lote de mantenimiento.
- DT-propuesta — Comentario impreciso en `src/main.ts:61` (hallazgo 2) — confunde al leer cuándo se reescribe el campo — barato: puede ir en la misma corrección si se abre otra ronda; si no, en VS-002.
- DT-propuesta — Espera fija de 1 s en TC-043 (`round1.spec.ts:47`), contraria a la nota del plan (hallazgo 3) — prueba más lenta y sensible a máquinas lentas — registrar la excepción ahora; cambiarla por una espera a evento cuando se toque TC-043.
- DT-propuesta — 4 bordes de `countCharacters` sin prueba unitaria (mutantes de `counting.ts:8` y `:9`: Prepend + dígito, Prepend + espacio, espacio + tilde, `\r\n`) — hoy el filtro los protege desde la pantalla, pero si `countCharacters` se usa en otra parte (p. ej. colorear letras en VS-003) quedarían sin respaldo — en VS-003, que vuelve a recorrer el texto letra por letra.

## Lecciones propuestas
- Toda expresión regular **anclada** (`^…$`) que juzga un grafema necesita una prueba con un carácter **Prepend** delante (`U+0600` invisible, `U+0D4E` letra) — porque un grafema puede llevar piezas **antes** de la base, y sin esa prueba quitar el `^` pasa en verde (los 6 sobrevivientes de regex de esta slice son de este tipo). Categoría: Enseñanza y conteo / Herramienta.
- Cuando el plan define el "pase completo" de una forma (emoji) ante un Prepend, debe decir lo mismo para **cada** forma del pase completo (tecla de número) — si no, el comportamiento queda decidido por accidente del código (L-023).

STATUS: DONE
