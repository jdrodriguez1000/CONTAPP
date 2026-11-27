# Etapa 10

# Revisión de calidad — VS-002 — ronda 1
**Fecha:** 2026-11-27 · **Rama revisada:** `feature/VS-002-imagenes-ninos` (HEAD `cf8bdcf`) vs. `main` · **Nivel:** Alto (por `src/main.ts`, aprobado al aprobar el plan)

## Resumen
La slice está limpia en lo que importa: el código de la app es casi todo CSS (`src/styles.css`), `index.html` solo suma las clases de grupo y `src/main.ts` solo cambia un comentario, que ahora sí dice lo que hace el código. Tipos, lint (con complejidad ≤ 10) y las 207 unitarias en verde. El TDD se ve en cada paso y cada `TC-050` a `TC-064` automático tiene su prueba.
**3 hallazgos del cambio:** 1 Bloqueante (2 exportaciones sin uso en las ayudas de prueba; se arregla borrando dos palabras), 1 Refactor futuro (duplicación entre las pruebas local y publicada) y 1 Deuda técnica (DT-017 quedó sin atender aunque se planeó con DT-008). **Preexistente:** solo DT-017, ya registrada. Mutación: no aplica (la slice no toca la lógica).

## Resultado de las herramientas
| Revisión | Comando | Resultado |
|---|---|---|
| Duplicación | `npx jscpd src tests --min-lines 10` | 3 clones (36 líneas, 0,87 %). **1 del cambio:** `tests/e2e/group-look.spec.ts:394-404` ≈ `tests/e2e/published.spec.ts:321-330` (11 líneas, TC-055 local y publicada) → hallazgo 2. **2 preexistentes:** `published.spec.ts:31-41` ≈ `skeleton.spec.ts:5-10` y `round1.spec.ts:13-26` ≈ `unit/round1.test.ts:4-14` → ya son **DT-017** (las líneas de `published.spec.ts` se corrieron por los imports nuevos). CSS: 0 clones |
| Complejidad | `npm run check` (incluye `eslint .`, regla `complexity: ["error", { max: 10 }]` en `eslint.config.js:11`, para `**/*.{js,ts}`) | ok, sin errores. El CSS no lo mide eslint (no tiene funciones) |
| Código sin uso | `npx knip` | 5 archivos de `.claude/hooks/` y la dependencia `jscpd`: **falsos positivos conocidos** (VS-001, D-020). Tipo `CharacterGroup` (`src/counting.ts:1`): interfaz pública del plan VS-001 §5.2, no es hallazgo. **Del cambio:** `numberRow` (`tests/e2e/field-helpers.ts:58`) y el tipo `Key` (`tests/e2e/group-helpers.ts:8`) exportados sin que otro archivo los use → hallazgo 1 |
| Tipos | `npm run check` (`tsc --noEmit`) | ok, sin errores |
| Pruebas | `npm run test:unit` | 207/207 en verde (4 archivos). Las E2E no las corrí (la guarda no lo permite); me apoyo en la evidencia del tester y del coder: 180/180 local (lote 3) y 8/8 publicada (lote 4) |
| Mutación | `npx stryker run` | **No se corrió:** el diff no toca `src/counting.ts` ni `src/inputFilter.ts` (únicos archivos que muta Stryker, D-020). `src/main.ts` cambió solo comentarios. Ver sección de mutación |

## Mapa de archivos
| Archivo | Paso(s) según los commits | ¿En el plan? | Nota |
|---|---|---|---|
| `index.html` | `feat(P-2)` `58e824e` | Sí (P-2) | Solo las 4 clases `count--<grupo>`; `data-testid`, orden `dt` → `dd` y textos iguales |
| `src/main.ts` | `refactor(P-1)` `d0de68b`, `944c1a2` (ronda 2) | Sí (P-1) | Solo comentario (1 línea quitada, 3 agregadas). El texto ya no es el exacto del plan P-1 sino el aprobado en la ronda 2 (BRK-C-2), como dice el coder |
| `src/styles.css` | `feat(P-2)` `58e824e`, `feat(P-3)` `b2fd3e5`, `feat(P-4)` `4de9b70`, `feat(P-5)` `9c45554` | Sí (P-2 a P-5) | Valores idénticos a las tablas del plan §3 y §5.1. El segundo `@media (max-width: 359px)` va al final, como pide P-4 (L-041) |
| `tests/e2e/field-helpers.ts` | `test(acceptance)` `3ea4d1f` (P-1), `a71d0c1` (P-3/P-4) | Tester (P-1) | `expectNothingStored` = §5.3 (copia fiel de las dos que reemplaza). En `a71d0c1` se suman `numberRow` y `expectImageBesideNumber`: soporte de pruebas, no comportamiento (ver hallazgo 1) |
| `tests/e2e/group-helpers.ts` | `test(acceptance)` `f1ef9be` (P-6) | **No** (archivo nuevo sin paso) → Tester, soporte | Saca de `group-look.spec.ts` lo que también usa `published.spec.ts` (colores, imagen, `cardLooks`). Es soporte necesario para no copiar: nota, no hallazgo |
| `tests/e2e/group-look.spec.ts` | `3ea4d1f` (P-2), `a71d0c1` (P-3), `f1ef9be` (P-6, −97/+16: pasa sus ayudas a `group-helpers.ts`) | Tester (P-2, P-3) | El cambio de P-6 no está en la lista de archivos de P-6, pero es solo mudanza de funciones (no cambia aserciones) |
| `tests/e2e/didactic-screen.spec.ts` | `a71d0c1` (P-4), `c96b277` (P-4, corrección de la CI), `9ec5015` (P-5) | Tester (P-4, P-5) | `c96b277` va **después** de `feat(P-4)`: separa "cabe" (letra de la máquina) de "medidas del diseño" (letra fijada) por decisión del usuario del 2026-11-27. No debilita: las medidas exactas siguen, ahora con letra fija y una guarda que falla si la letra no se aplicó |
| `tests/e2e/captures.spec.ts` | `3ea4d1f`, `a71d0c1`, `9ec5015` | Tester (lotes 1 a 3) | Estados de §4 |
| `tests/e2e/published.spec.ts` | `3ea4d1f` (P-1: `EVIDENCE` y DT-008), `f1ef9be` (P-6) | Tester (P-1, P-6) | |
| `tests/e2e/screen.spec.ts` | `3ea4d1f` (P-2), `9ec5015` (P-5) | Tester (P-2, P-5) | Solo los dos cambios de R-1 (colores 283-299 y alto del campo 180-228) |
| `tests/e2e/typing.spec.ts` | `3ea4d1f` (P-1) | Tester (P-1) | Usa `expectNothingStored` en lugar de la copia |
| `_project/slices/VS-002.md` | `8788a7c` y la clasificación 9c | Manager | Bordes que esperan, por decisión del usuario |
| `_project/slices/VS-002/evidence/**` (capturas, fotos P-7, logs, salidas) | commits `docs(VS-002)` de cada lote | Generado / Manager | Capturas del proyecto `captures`, de `published.spec.ts` y fotos del iPhone |
| `_project/slices/VS-002/reports/*.md` | commits `docs(VS-002)` | Manager (reportes de agentes) | |

**Archivos del plan que no aparecen en el diff:** ninguno de código ni de pruebas. `_project/tech-debt.md` (marcar DT-008 y DT-009) tampoco aparece, y es lo esperado: el plan P-1 dice que lo marca el Manager en `main`.

**Dependencias nuevas:** ninguna (`package.json` y el lockfile no cambian), igual que el plan §2.2.

## Hallazgos
| # | Tipo | Origen | Archivo:línea | Qué pasa (tipo de fallo) | Por qué importa | Sugerencia |
|---|---|---|---|---|---|---|
| 1 | Bloqueante | Del cambio | `tests/e2e/field-helpers.ts:58` y `tests/e2e/group-helpers.ts:8` | **Exportación que ningún otro archivo usa** (umbral de la fila 3, knip): `numberRow` solo la llama `expectImageBesideNumber` del mismo archivo, y el tipo `Key` solo lo usa `Colors`, en el mismo archivo | "Exportar" es decir "esto lo usan otros archivos". Si nadie lo usa, quien lea el código busca a quién le sirve y no lo encuentra. Además, knip deja de servir como alarma si se acostumbra uno a verlo en rojo | Quitar la palabra `export` de las dos (zona del tester). Para `Key`, otra opción es usar el tipo del glosario que ya existe, `CharacterGroup` de `src/counting.ts`, en lugar de inventar otro nombre. Revisar que no quede ninguna otra exportación nueva sin uso (`npx knip`) |
| 2 | Refactor futuro | Del cambio | `tests/e2e/group-look.spec.ts:374-419` y `tests/e2e/published.spec.ts:298-347` | **Prueba copiada en dos archivos:** TC-055 local y TC-055 publicada repiten el registro de peticiones y la comprobación de "otro sitio" y "lleva el texto" (11 líneas iguales según jscpd). Lo mismo, en menor escala, con `MIXED_PHRASE` (`group-look.spec.ts:257` y `published.spec.ts:173`), con la decodificación de una imagen a píxeles (`shapeOf`, `group-look.spec.ts:236`, y `paintedImage`, `published.spec.ts:192`) y con `KEYS` / `NAMES` vueltos a escribir en `didactic-screen.spec.ts:21-22` aunque `group-helpers.ts` ya exporta `KEYS` | Es justo el tipo de copia que generó DT-008: si mañana cambia la regla de "no sale nada del celular" (C-010), hay que acordarse de cambiarla en dos sitios. En pruebas pesa menos que en la app, y está en el borde del umbral (~10 líneas) | Pasar a `group-helpers.ts` una función que registre las peticiones y otra que compruebe "ninguna a otro sitio, ninguna con el texto", y la constante de la frase mixta; que `didactic-screen.spec.ts` importe `KEYS` |
| 3 | Deuda técnica | Preexistente | `tests/e2e/published.spec.ts:31-41` ≈ `skeleton.spec.ts:5-10`; `round1.spec.ts:13-26` ≈ `unit/round1.test.ts:4-14` | **Duplicación ya registrada:** es **DT-017**, que decía "se atiende junto con DT-008". DT-008 se atendió en esta slice y DT-017 no | No bloquea (no es del cambio). Lo anoto para que el Manager actualice la fila: su "cuándo" ya pasó | Mover DT-017 a la próxima vez que se toquen esas pruebas, junto con el hallazgo 2 |

**Nota de seguridad (una línea, para el agente security):** `tests/e2e/group-look.spec.ts:1` importa `node:fs` (DT-014 pide mirarlo): solo lee `_project/design/F-002/mockup-b.html` con `readFileSync` para comparar los dibujos aprobados. Uso legítimo, sin escritura.

## Lo que revisé y está bien
- **TDD visible:** P-2 `3ea4d1f` → `58e824e`; P-3 y P-4 `a71d0c1` → `b2fd3e5`, `4de9b70`; P-5 `9ec5015` → `9c45554`. Los `test(acceptance)` solo tocan `tests/` (y documentos); ningún `feat` toca pruebas. P-1 es `refactor` sin rojo posible, con criterio escrito antes (plan P-1 y clasificación 9c, ronda 2), y no agrega comportamiento. P-6 es solo de pruebas (rojo contra la preview del lote 1 en `evidence/manager-published-rojo-lote-4.txt`, verde en `…-verde-lote-4.txt`). P-7 es manual (`evidence/iphone-manual.md`, con fotos).
- **Trazabilidad:** TC-050 a TC-056 y TC-059 a TC-064 tienen pruebas con su ID en el nombre (`group-look`, `didactic-screen`, `published`, `captures`). TC-057 y TC-062 son manuales (P-7). TC-058 es la regresión. Las restricciones duras de la trazabilidad del plan (C-010 por TC-055, C-011 por TC-054, C-012, C-013) tienen su prueba.
- **Calidad de las pruebas:** prueban lo visible (colores calculados, píxeles pintados, posición del número, árbol accesible), no detalles internos. Varias se protegen de pasar en falso: TC-053 y TC-054 exigen primero que la imagen exista ("igual que antes" no prueba nada sin ella); TC-050 compara los píxeles con los dibujos de la maqueta; TC-055 comprueba que el registro de peticiones vio la carga de la página; la fórmula de contraste se prueba con sus dos límites (21:1 y 1:1); `expectDesignFont` falla si la letra fijada no se aplicó. Sin `skip` ni `only`, sin `TODO` ni `console.log` en `src/` o `tests/e2e/`. Las comparaciones aproximadas (≤ 1 px, ≤ 19 píxeles) son de medidas de pantalla, no de conteos, y cada una dice por qué.
- **Reglas del proyecto:** nada nuevo se guarda ni sale del celular (las imágenes son `data:` dentro del CSS); sin `innerHTML`; ningún texto nuevo en pantalla (TC-060 y TC-056); el `::before` no agrega texto. Nombres en inglés; las clases y tokens son los del plan §5.1 y `design-system.md` §2. `--color-border` queda definido sin uso, como acepta el plan (R-7).
- **Comentarios:** el de `filterChange` (`src/main.ts:61-63`) ahora coincide con el código (`if (text !== textField.value)`) y nombra los tres casos. Los del CSS explican el porqué (orden de las reglas, origen de los dibujos).

## Sugerencias de estilo (máx. 3, solo en la ronda 1)
- `tests/e2e/published.spec.ts:218` — dentro de `paintedImage`, la variable `card` (los números del color de fondo) tiene el mismo nombre que la función `card()` importada de `group-helpers.ts`. Llamarla `cardChannels` — al leerla no se confunde con la ficha.
- `src/styles.css:135-136` — dos comentarios seguidos sobre el mismo bloque; uno solo ("One variant per group: its color token and its drawing, copied as they are from …mockup-b.html") — se lee como una sola idea.
- `tests/e2e/didactic-screen.spec.ts:124` — `const number = …` guarda medidas del texto, no un número; `vowelNumberMetrics` — el nombre dice qué contiene.

Se omitieron 1 sugerencia de estilo.

## Pruebas de mutación
**Sin lógica en el cambio.** `git diff main...HEAD -- src/counting.ts src/inputFilter.ts` está vacío y `src/main.ts` solo cambió comentarios; los demás archivos de la app son CSS y HTML, que Stryker no muta. Por review-checklist §10, no se corrió `npx stryker run`. Los sobrevivientes conocidos de esos archivos siguen en DT-010 y DT-011 (VS-001). Duración: —.

| Archivo | Puntaje | Muertos | Sobrevivientes | Sin cobertura |
|---|---|---|---|---|
| — | — | — | — | — |

| Mutante (archivo:línea) | Cambio | Clasificación | Por qué |
|---|---|---|---|
| — | — | — | Sin lógica en el cambio |

## Deuda técnica propuesta
- DT-propuesta — Duplicación entre las pruebas locales y publicadas de VS-002: TC-055 (`group-look.spec.ts:374-419` ≈ `published.spec.ts:298-347`), la frase mixta, la decodificación de imágenes a píxeles (`shapeOf` / `paintedImage`) y `KEYS` / `NAMES` de `didactic-screen.spec.ts:21-22` (hallazgo 2) — una regla de C-010 que cambie hay que cambiarla en dos sitios — al tocar esas pruebas otra vez, junto con DT-017.
- DT-017 (ya registrada) — actualizar su "Slice donde se atiende": decía "junto con DT-008", que ya se atendió en VS-002 (hallazgo 3).

## Lecciones propuestas
- Cuando una tarea de deuda dice "se atiende junto con otra" (DT-017 con DT-008), el plan que atiende la primera debe listar también la segunda o decir por qué la deja. — Por qué: DT-008 se atendió en P-1 y DT-017 quedó sin dueño ni fecha.
- Al sacar funciones a un archivo de ayudas compartido (como `group-helpers.ts`), exportar solo lo que otro archivo importa y correr `npx knip` antes del commit. — Por qué: hallazgo 1; es la herramienta que lo detecta en segundos y el tester no la tiene en su cierre.

STATUS: DONE
