# Plan de trabajo — VS-001 "Contar en el celular" (walking skeleton)
**Aprobación del plan:** Pendiente

**Fecha:** 2026-11-26 · **Autor:** planner · **Feature:** F-001 (aprobada, con diseño) · **Esbozo:** `_project/slices/VS-001.md` §7 (aprobado 2026-11-25) · **Stack:** D-011

---

## 1. Resumen
Se construye la primera versión real de Contapp: una página web con un campo para escribir y 4 fichas que cuentan vocales, consonantes, números y otros, publicada en internet y abierta desde el iPhone.

- **10 pasos** (P-1 a P-10), los mismos 10 del esbozo aprobado, en el mismo orden. No se agregó, partió ni juntó ninguno.
- **5 lotes** (cada uno cabe en una sesión y termina en verde):

| Lote | Pasos | Qué ve el usuario al terminar | Líneas de app (estimado) | Nivel de riesgo esperado |
|---|---|---|---|---|
| 1 | P-1, P-2 | La página "Contapp" abierta en su iPhone desde internet | ~15 | **Alto** — (6) dependencias, (5) despliegue |
| 2 | P-3, P-4 | La pantalla real (campo + 4 fichas en 0) en el iPhone; la regla de vocales y consonantes probada | ~175 | **Alto** — (2) reglas de conteo (`src/counting.ts`), (6) se agrega Vitest |
| 3 | P-5, P-6 | Escribe y **los conteos cambian con cada letra** | ~45 | **Alto** — (2) reglas de conteo |
| 4 | P-7, P-8 | Las letras de otros idiomas y el carácter 101 no entran | ~90 | **Alto** — (2) validación de entradas (`src/inputFilter.ts`) |
| 5 | P-9, P-10 | Las pruebas corren solas en GitHub; prueba de punta a punta sobre la versión publicada, con evidencia | ~0 | **Alto** — (7) cadena de entrega (CI) |

"Líneas de app" = `src/` **más** `index.html` (que tiene el marcado de la pantalla; ver la propuesta del reporte), sin pruebas, configuración, lockfile ni archivos generados.

**Para explicárselo al usuario:** primero se arma la "caja de herramientas" y se publica una página vacía (lote 1); después se dibuja la pantalla y se enseña a contar letras (lote 2); luego números y signos, y se conecta todo para que cuente mientras escribe (lote 3); después se ponen los dos "filtros" (letras de otros idiomas y el tope de 100) (lote 4); por último, las pruebas automáticas en cada cambio y la prueba final en el celular (lote 5).

---

## 2. Preparación

### 2.1 Rama y carpeta
- Rama: `feature/VS-001-contar-en-el-celular`, creada desde `main` al aprobarse este plan, en la carpeta `../CONTAPP-VS-001` (playbook §8).
- **Antes del lote 1, el Manager comprueba** que el computador tiene **Node.js 24** (mínimo 22.12, que exige Vitest 5): `node -v`. Si no, el usuario lo instala desde nodejs.org (versión LTS). Es lo único que hay que tener instalado.

### 2.2 Dependencias nuevas (todas de desarrollo; la app publicada no lleva ninguna)
Versiones verificadas en Context7 el 2026-11-26. Se instalan con versión exacta (`--save-exact`) y quedan fijas en `package-lock.json`.

| Paquete | Versión | Paso | Para qué (en palabras sencillas) | Fuente |
|---|---|---|---|---|
| `vite` | 8.3.5 | P-1 | Sirve la página en el computador y la "empaqueta" para publicarla | `/vitejs/vite/v8.3.5` |
| `typescript` | 6.0.2 | P-1 | JavaScript con tipos: avisa errores antes de correr | `/microsoft/typescript` (v6.0.2) |
| `@playwright/test` | 1.64.1 | P-1 | Abre la página en un "iPhone simulado" (motor WebKit de Safari) y la usa como una persona | `/microsoft/playwright/v1.64.1` |
| `@types/node` | 24.x (la última 24) | P-1 | Tipos de Node que usa la configuración de Playwright | Sigue a Node 24; no tiene página propia en Context7 |
| `eslint` | 10.5.0 | P-1 | Revisa el estilo y la complejidad del código | `/eslint/eslint/v10.5.0` |
| `@eslint/js` | 10.x (la misma mayor que `eslint`) | P-1 | Reglas recomendadas de ESLint | `/eslint/eslint/v10.5.0` |
| `typescript-eslint` | 8.72.1 | P-1 | Enseña a ESLint a leer TypeScript | `/typescript-eslint/typescript-eslint/v8.72.1` |
| `vitest` | 5.0.3 | P-4 | Corre las pruebas unitarias de las reglas de conteo (pide Vite ≥ 6.4 y Node ≥ 22.12) | `/vitest-dev/vitest/v5.0.3` |

**Opciones de respaldo ya aprobadas en este plan** (el coder las usa sin detenerse y lo anota en su reporte):
- Si `npm install` muestra conflicto de versiones entre `typescript-eslint` 8.72.1 y `eslint` 10.5.0, usar `eslint@9.39.3` y `@eslint/js@9.39.3`.
- Si `typescript-eslint` avisa que TypeScript 6.0.2 no está soportado, usar `typescript@5.9.3`.

**Navegador de pruebas:** `npx playwright install webkit` en el computador (P-1); en la CI, `npx playwright install --with-deps webkit` (P-9).

**Servicios (no son paquetes):** Vercel plan **Hobby** (gratis, uso personal no comercial; incluye una preview por cada push a una rama y HTTPS) — P-2. GitHub Actions con `actions/checkout@v6`, `actions/setup-node@v6`, `actions/upload-artifact@v5` y `gitleaks/gitleaks-action@v2` (en una cuenta personal no necesita licencia) — P-9.

### 2.3 Variables de entorno (solo nombres)
| Nombre | ¿Secreto? | Dónde | Para qué | Paso |
|---|---|---|---|---|
| `E2E_BASE_URL` | No | Se pone al correr el comando, no en un archivo | Dirección publicada (preview) contra la que corre el proyecto `published` de Playwright | P-2, P-10 |
| `CI` | No | La pone GitHub Actions sola | Que Playwright no reutilice un servidor ya abierto | P-9 |

No hay archivo `.env` ni ningún secreto en esta slice (si el usuario elige la opción A de la pregunta 1 del reporte, se agrega `VERCEL_AUTOMATION_BYPASS_SECRET` en P-2; ver §7).

### 2.4 Lo que debe hacer el usuario a mano
| Cuándo | Qué | Tiempo aprox. |
|---|---|---|
| Antes del lote 1 | Si el Manager lo pide, instalar Node.js 24 LTS | 5 min |
| P-2 | **Crear la cuenta en Vercel** (plan Hobby) entrando con su cuenta de GitHub, e **importar el repositorio** `jdrodriguez1000/CONTAPP`. Vercel detecta "Vite" solo; se aceptan los valores que propone (comando `npm run build`, carpeta `dist`). Rama de producción: `main` | 10 min |
| P-2 | Decidir la **protección de las previews** (pregunta 1 del reporte) y, si elige B, apagar "Vercel Authentication" en *Settings → Deployment Protection* (el Manager lo guía) | 2 min |
| P-2 | **Abrir la dirección de la preview en su iPhone** con Safari y confirmar que ve "Contapp"; mandar una captura de pantalla | 2 min |
| P-10 | **Lista de comprobación manual en el iPhone** (§3, P-10): escribir con el teclado real, tildes, ñ y un emoji; mandar capturas | 10 min |
| Al final | Aceptar la preview (commit exacto) y el mensaje de fusión (playbook §5) | — |

> Al importar el repositorio, Vercel intentará publicar `main`, que todavía no tiene la app: ese primer intento **falla o queda vacío, y es normal**. La producción real llega cuando la slice se fusione a `main`.

---

## 3. Pasos

### Convenciones para todos los pasos
- **Carpetas:** código de la app en `src/` (+ `index.html` en la raíz, que Vite exige ahí); pruebas TDD del coder **junto al código** (`src/*.test.ts`); pruebas de aceptación del tester en `tests/` (`tests/e2e/*.spec.ts` con Playwright y, si el tester quiere probar funciones, `tests/unit/*.test.ts` con Vitest).
- **Commits del coder:** `test(P-X)` → `feat(P-X)` → `refactor(P-X)` (tdd-cycle). En los pasos de **infraestructura** (P-1, P-2, P-9), lo que solo instala o configura sin comportamiento va en `chore(P-X)` (o `ci(P-9)`), **antes** de correr el rojo; nunca se mezcla con código de la app.
- **"Escribir" en una E2E** = `locator.pressSequentially(...)` (una tecla a la vez). **"Pegar"** = `page.keyboard.insertText(...)` (el texto entra de una sola vez, como un pegado). La app no distingue cómo llegó el texto: aplica las mismas reglas a cualquier cambio del campo.
- **Caracteres especiales en las pruebas** (letras en dos piezas, invisibles, emojis compuestos): se escriben **con su código** (`'ñ'`, `'​'`, `'\u{1F468}‍\u{1F469}‍\u{1F467}'`), nunca pegados tal cual, porque en el editor se ven iguales y se confunden (en la línea de **L-002**).
- **Pruebas de "control":** algunas pruebas de un lote **ya pasan en el rojo** a propósito, porque comprueban que algo **sigue entrando** o **sigue igual** (p. ej. "ñ sí entra"). El tester las marca como *control* en su reporte; no invalidan el rojo, siempre que las demás pruebas del paso fallen por la razón esperada.

---

### P-1 — Esqueleto del proyecto
- **Feature:** F-001 · **Casos:** ninguno propio (es infraestructura); deja la prueba de ejemplo `P-1`.
- **Capa:** infraestructura local.
- **Qué es, en sencillo:** se crea la "caja de herramientas" del proyecto (el que sirve la página, el que revisa el código y el que prueba en un iPhone simulado) y una página mínima que dice "Contapp".
- **Archivos:**
  - Crear `package.json` con los scripts de §8 (`dev`, `build`, `preview`, `typecheck`, `lint`, `check`, `test:e2e`), `"type": "module"` y `"private": true`.
  - Crear `package-lock.json` (lo genera npm).
  - Crear `tsconfig.json`: `strict`, `noEmit`, `target`/`lib` **ES2022 o mayor + DOM** (hace falta para `Intl.Segmenter` en P-5), `moduleResolution: "bundler"`, `include: ["src", "tests", "*.config.ts"]`. **No** incluye `.claude/` ni `_project/`.
  - Crear `eslint.config.js`: `js.configs.recommended` + `tseslint.configs.recommended` sobre `**/*.{js,ts}`, la regla **`complexity: ["error", { max: 10 }]`** (la pide la revisión de calidad desde la walking skeleton) e `ignores: ["dist", "playwright-report", "test-results", ".claude", "_project"]`.
  - Crear `playwright.config.ts`: `testDir: "tests/e2e"`, proyecto **`iphone`** con `devices["iPhone 13"]` (390 × 844, WebKit, móvil y táctil = el iPhone de referencia del diseño), `webServer` = `npm run build && npm run preview -- --port 4173 --strictPort`, `url`/`baseURL` `http://localhost:4173`, `reuseExistingServer: !process.env.CI`, `retries: 0`, `trace: "retain-on-failure"`, reporte `list` + `html` (sin abrirse solo).
  - Crear `.gitignore`: `node_modules`, `dist`, `test-results`, `playwright-report`, `.vercel`, `.env*`.
  - Crear **`.gitattributes`**: `* text=auto eol=lf` y `*.png binary`, `*.jpg binary`. Va en su **propio commit** `chore(P-1): fijar finales de línea en LF`, con `git add --renormalize .` (puede marcar como cambiados archivos que solo cambian de final de línea; es esperado).
  - Crear `index.html` (raíz): `<html lang="es-CO">`, `<meta charset="utf-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1">` (sin bloquear el zoom), `<title>Contapp</title>` y `<h1 data-testid="app-title">Contapp</h1>`. Nada más todavía.
- **Prueba que va primero:** el tester escribe `tests/e2e/skeleton.spec.ts` → `"P-1: la página abre con el título Contapp"`: el título de la pestaña es `Contapp`, el `app-title` dice `Contapp` y `<html lang>` es `es-CO`. En el lote 1 el tester **no puede correrla** (aún no hay herramientas instaladas): solo la escribe. El coder hace `chore(P-1)` (dependencias y configuración) **con un `index.html` sin título ni `h1`**, corre la prueba y confirma que **falla porque no encuentra el título "Contapp"** (no por configuración rota); luego `feat(P-1)` agrega título y `h1`.
- **Lecciones:** L-002 (escribir archivos con tildes desde el editor, no con heredocs).
- **Reglas de carpeta que puede chocar:** `.claude/hooks/guards.test.mjs` existe: ESLint y TypeScript **no** deben revisar `.claude/` (por eso los `ignores` y el `include`). Vitest todavía no se instala (llega en P-4, justo a tiempo).
- **Terminado cuando:** `npm run check` en verde; `npx playwright test tests/e2e/skeleton.spec.ts --project=iphone` en verde; `npm run dev` abre en el computador una página que dice "Contapp".

### P-2 — Publicar y abrir desde el celular
- **Feature:** F-001 · **Casos:** ninguno propio (prepara TC-001 y P-10 sobre la versión publicada).
- **Capa:** despliegue.
- **Qué es, en sencillo:** se conecta el repositorio con Vercel; desde ahí, cada vez que se sube un cambio de la rama, Vercel publica una copia en una dirección de internet que se abre en el iPhone.
- **Archivos:**
  - Modificar `package.json`: `"engines": { "node": "24.x" }` (Vercel usa esa versión) y el script `test:published` (§8).
  - Modificar `playwright.config.ts`: proyecto **`published`** (`devices["iPhone 13"]`, `testMatch: /published\.spec\.ts/`, `baseURL: process.env.E2E_BASE_URL`); el proyecto `iphone` ignora `published.spec.ts`; el `webServer` **no arranca** cuando `E2E_BASE_URL` existe.
  - No se crea `vercel.json`: Vercel reconoce Vite solo (`npm run build` → `dist`).
- **Prueba que va primero:** el tester escribe `tests/e2e/published.spec.ts` → `"P-2: la dirección publicada abre con el título Contapp"` (lo mismo que P-1, contra `E2E_BASE_URL`). Rojo: el Manager la corre con la dirección de la preview **antes** de que Vercel publique la rama (falla: la dirección no existe o no tiene la página).
- **Orden dentro del paso:** coder `chore(P-2)` → **Manager** sube la rama (`git push -u origin feature/VS-001-contar-en-el-celular`) → **usuario** conecta Vercel (§2.4) → Vercel publica la preview → **Manager** corre `npm run test:published` con `E2E_BASE_URL=<dirección de la preview>` → **usuario** la abre en su iPhone.
- **Lecciones:** ninguna registrada aplica.
- **Terminado cuando:** la prueba `P-2` pasa contra la dirección de la preview **y** el usuario confirma (con captura del iPhone en `evidence/p2-iphone.png`) que la ve en Safari.

### P-3 — Pantalla con el campo y los 4 grupos en 0
- **Feature:** F-001 · **Casos:** TC-001, TC-026, TC-031 (atributos del campo y "cas " sin cambios).
- **Capa:** pantalla.
- **Qué es, en sencillo:** se dibuja la pantalla aprobada (título, etiqueta, campo y las 4 fichas en 0) con los colores y tamaños del sistema de diseño, en modo claro y oscuro. Todavía no cuenta.
- **Archivos:**
  - Modificar `index.html`: el marcado completo de §5.1 (título → etiqueta → campo → cuadrícula), exacto como la maqueta `_project/design/F-001/mockup.html` (estado 1), sin las clases de la maqueta que son solo de la hoja (`.phone`, `.status`, `.kb`, `.home`, `readonly`). Carga `src/main.ts`.
  - Crear `src/styles.css`: los tokens de `design-system.md` §2 a §4 definidos **una sola vez** en `:root` y en `@media (prefers-color-scheme: dark)`; `@media (max-width: 359px)` baja `--font-size-group` a 18 px y `--font-size-count` a 44 px; los 4 componentes (`AppTitle`, `TextField`, `CountGrid`, `CountCard`) usando solo tokens; `tabular-nums` en el número; anillo de foco de 3 px separado 2 px; sin desplazamiento horizontal.
  - Crear `src/main.ts`: importa `./styles.css` y hace crecer el campo de 2 a 5 líneas con el texto (a partir de 5, se queda en 5 y se desplaza por dentro).
  - Modificar `playwright.config.ts`: proyecto **`captures`** (`devices["iPhone 13"]`, `testMatch: /captures\.spec\.ts/`); el proyecto `iphone` también ignora `captures.spec.ts`.
- **Prueba que va primero:** es la de aceptación del tester (`tests/e2e/screen.spec.ts`): TC-001 (campo vacío, los 4 en "0", sin pantalla de cuenta), TC-026 (los 4 nombres exactos y en orden), TC-031 (atributos `autocomplete="off"`, `autocorrect="off"`, `autocapitalize="off"`, `spellcheck="false"`; escribir "cas " deja "cas "). Rojo: fallan porque la página de P-1 **no tiene** el campo ni las fichas. El coder **no** escribe otra E2E. Además, el tester entrega `tests/e2e/captures.spec.ts` (estado 1 en claro y oscuro a 390 × 844, y estado 1 a 320 × 568; estado 4 solo para ver el crecimiento del campo a 5 líneas, con conteos todavía en 0).
- **Lecciones:** ninguna registrada aplica (no mide tiempos ni animaciones).
- **Reglas de carpeta:** las capturas se escriben con `testInfo.outputPath(...)`; el coder las corre con `--output=_project/slices/VS-001/evidence/capturas/lote-2` (§8), para que la suite normal nunca escriba en `evidence/`.
- **Terminado cuando:** `screen.spec.ts` en verde, `npm run check` en verde y capturas del lote 2 listas para la revisión visual del designer.

### P-4 — Regla: vocales y consonantes
- **Feature:** F-001 · **Casos:** TC-004, TC-005, TC-006, TC-007, TC-008, TC-009, TC-032 (conteo), TC-039 (conteo).
- **Capa:** lógica del dominio.
- **Qué es, en sencillo:** una función que recibe un texto y dice cuántas vocales y consonantes tiene, según las reglas que validó el usuario (tildes, ü, ñ, la "y" siempre consonante, ch/ll/rr letra por letra, mayúsculas igual que minúsculas). Se prueba con sus palabras: "canción", "pingüino", "niño", "rey", "llave", "ANA".
- **Archivos:**
  - `npm install --save-dev --save-exact vitest@5.0.3` (commit `chore(P-4)`).
  - Crear `vitest.config.ts`: `test.include: ["src/**/*.test.ts", "tests/unit/**/*.test.ts"]`, `environment: "node"`. **El `include` explícito es obligatorio:** sin él, Vitest también tomaría `.claude/hooks/guards.test.mjs` y los archivos de Playwright de `tests/e2e/`.
  - Modificar `package.json`: script `test:unit`.
  - Crear `src/counting.ts` y `src/counting.test.ts`.
- **Prueba que va primero:** `src/counting.test.ts`, tabla de casos con su ID en el nombre (`"TC-004: canción has 3 vowels and 4 consonants"`…), incluidas las letras en dos piezas de TC-032 y TC-039 (`'á'` → 1 vocal; `'ñ'` → 1 consonante). Rojo: `countCharacters` existe como esqueleto que devuelve los 4 en 0, y las aserciones fallan.
- **Lecciones:** L-002 (los casos en dos piezas se escriben con `\u`).
- **Terminado cuando:** `npm run test:unit` en verde con todos los casos de arriba; `npm run check` en verde.

### P-5 — Regla: números, otros y espacios
- **Feature:** F-001 · **Casos:** TC-010, TC-011, TC-012, TC-013, TC-014, TC-015, TC-034, TC-035 (parte unitaria), TC-037.
- **Capa:** lógica del dominio.
- **Qué es, en sencillo:** la misma función aprende a contar los números (cada dígito por separado), los "otros" (signos, símbolos y emojis, cada emoji como 1 aunque por dentro tenga varias piezas) y a no contar los espacios. Se comprueba que la suma de los 4 grupos es igual a los caracteres sin espacios.
- **Archivos:** modificar `src/counting.ts` y `src/counting.test.ts`.
- **Prueba que va primero:** nuevos casos en `src/counting.test.ts`: "2026", "a1b2", "¡Hola!", "¿?,.@#", 😀, la familia y la bandera, espacios/tabulación/salto de línea, "" y "   ", "¡Hola, 2026! 😀" con su suma (12), 1️⃣, ² ½ ª º, "1º", ´ ¨ \` ^, y el espacio que no se parte (`'la casa'`). Rojo: los de números y otros fallan (P-4 solo cuenta letras). Los de espacios y vacío son *control* (ya dan 0) y protegen que los espacios no terminen contados como "otros".
- **Lecciones:** L-002.
- **Terminado cuando:** `npm run test:unit` en verde; ningún carácter queda sin grupo (prueba de la suma en TC-015 y TC-012).

### P-6 — Contar mientras se escribe
- **Feature:** F-001 · **Casos:** TC-002, TC-003, TC-024, TC-025, TC-027.
- **Capa:** pantalla conectada a la lógica.
- **Qué es, en sencillo:** se conecta el campo con la función de conteo: con cada letra que entra o se borra, las 4 fichas se actualizan en el mismo instante. Al recargar, todo vuelve a 0 porque nada se guarda.
- **Archivos:** modificar `src/main.ts` (escucha cada cambio del campo y escribe los 4 números en sus fichas, sin demora ni animación).
- **Prueba que va primero:** la de aceptación del tester, `tests/e2e/typing.spec.ts`: TC-002 ("casa" letra por letra: tras "c" → 0/1/0/0; tras "casa" → 2/2/0/0), TC-003 (borrar → 1/2; borrar todo → 0), TC-024 (recargar → vacío y 0), TC-025 (ninguna petición que sale de la página lleva "casa"), TC-027 (escribir "cas", esperar 2 s y el texto sigue "cas"). Rojo: TC-002 y TC-003 fallan porque los conteos se quedan en 0. TC-024, TC-025 y TC-027 son *control*. El tester amplía `captures.spec.ts` con los estados 2 ("pingüino", con foco) y 3 ("¡Hola, 2026! 😀").
- **Lecciones:** ninguna registrada aplica. TC-027 usa una espera fija de 2 s: es la única espera fija permitida en la slice.
- **Terminado cuando:** `typing.spec.ts` y `screen.spec.ts` en verde; capturas del lote 3.

### P-7 — Letras de otros idiomas no entran
- **Feature:** F-001 · **Casos:** TC-016, TC-017, TC-018, TC-019, TC-029, TC-033, TC-035 (parte E2E), TC-036, TC-038, TC-040, TC-041.
- **Capa:** validación de la entrada.
- **Qué es, en sencillo:** antes de aceptar lo que se escribió o pegó, la app revisa **solo lo nuevo**: quita las letras de otros idiomas, los números de otros alfabetos y los caracteres invisibles sueltos, y junta en una sola pieza las letras del español que llegan en dos ("n" + "~" → "ñ"). Si no queda nada, el campo se queda exactamente como estaba, con el cursor en su sitio, y sin ningún aviso.
- **Archivos:**
  - Crear `src/inputFilter.ts` con `applyInput` (§5.2) y `src/inputFilter.test.ts`.
  - Modificar `src/main.ts`: en cada cambio del campo, pasa el texto anterior, el nuevo y la posición del cursor por `applyInput`, pone en el campo el resultado y el cursor que devuelve, y después cuenta. **Mientras el teclado está "componiendo"** una letra (evento `input` con `isComposing`), no filtra; filtra al terminar (`compositionend`).
- **Prueba que va primero:**
  - Coder: `src/inputFilter.test.ts` (`"TC-029: pasting façade keeps faade"`, `"TC-041: a + combining grave is rejected entirely"`, `"P-7: rejected input keeps the cursor where it was"`…). Rojo: `applyInput` como esqueleto que devuelve `nextText` sin cambios.
  - Tester: `tests/e2e/foreign-letters.spec.ts` con todos los casos del paso. Rojo: TC-016, 017, 018, 029, 033, 036, 038, 040 y 041 fallan porque hoy todo entra. TC-019 (ñ á É… sí entran) y TC-035 ("^" entra, Otros 1) son *control*. En TC-033 y TC-040 el texto del campo debe quedar **en una sola pieza** (forma NFC, §5.1): por eso fallan en el rojo aunque el conteo ya cuadre.
- **Lecciones:** L-002 (todos los casos con `\u`).
- **Terminado cuando:** `inputFilter.test.ts`, `foreign-letters.spec.ts`, `typing.spec.ts` y `screen.spec.ts` en verde.

### P-8 — Largo máximo de 100
- **Feature:** F-001 · **Casos:** TC-020, TC-021, TC-022, TC-023, TC-028, TC-030, TC-042, TC-032 (largo), TC-039 (largo).
- **Capa:** validación de la entrada.
- **Qué es, en sencillo:** el campo acepta como máximo 100 caracteres (los espacios cuentan, un emoji cuenta 1). Lo que sobra no entra, ni escrito ni pegado, y no sale ningún aviso. Si se pega en medio de un texto, entra el comienzo de lo pegado hasta completar 100.
- **Archivos:** modificar `src/inputFilter.ts` (agrega `MAX_TEXT_LENGTH` y `textLength`, y el tope dentro de `applyInput`) y `src/inputFilter.test.ts`. **No** se usa el atributo `maxlength` del campo: el navegador cuenta un emoji de familia como 8 y lo cortaría mal.
- **Prueba que va primero:**
  - Coder: `src/inputFilter.test.ts` (`"TC-032: a + combining acute has length 1"`, `"TC-039: pingüino in two pieces has length 8"`, `"TC-030: pasting xyz in the middle of 98 a keeps xy"`…). Rojo: `textLength` esqueleto que devuelve `text.length`; `applyInput` aún no corta.
  - Tester: `tests/e2e/max-length.spec.ts`. Rojo: TC-021, 022, 023 (la "b" final), 028 (la "b" final), 030 y 042 (la "b" final) fallan porque hoy todo entra. TC-020 es *control*. El tester amplía `captures.spec.ts` con el estado 4 completo (la frase de 100 caracteres, 35/40/3/3).
- **Lecciones:** L-002.
- **Terminado cuando:** las 4 E2E (`screen`, `typing`, `foreign-letters`, `max-length`) y todas las unitarias en verde; capturas del lote 4.

### P-9 — Pruebas automáticas en cada cambio (CI)
- **Feature:** F-001 · **Casos:** ninguno propio (corre todos).
- **Capa:** infraestructura de entrega.
- **Qué es, en sencillo:** GitHub corre solo, en cada cambio que se sube, la revisión del código, las pruebas unitarias, las de punta a punta en el iPhone simulado y la búsqueda de contraseñas olvidadas. Si todo pasa, la marca queda en verde; es lo que se exige antes de fusionar a `main`.
- **Archivos:** crear `.github/workflows/ci.yml` (commit `ci(P-9)`), que se dispara en `push` (todas las ramas) y en `pull_request` hacia `main`, con dos trabajos:
  1. **`checks`** (ubuntu-latest): `actions/checkout@v6` → `actions/setup-node@v6` (Node 24, caché de npm) → `npm ci` → `npm run check` → `npm run test:unit` → `npx playwright install --with-deps webkit` → `npm run test:e2e` → si falla, sube `playwright-report/` con `actions/upload-artifact@v5`.
  2. **`secrets`**: `actions/checkout@v6` con `fetch-depth: 0` (todo el historial) → `gitleaks/gitleaks-action@v2` con `GITHUB_TOKEN`.
- **Prueba que va primero:** no admite prueba automática; el respaldo es este **criterio escrito antes** (PI-5): (a) antes del paso, `gh run list --branch feature/VS-001-contar-en-el-celular` no muestra corridas; (b) tras subir `ci(P-9)`, aparece una corrida con los dos trabajos y **todos sus pasos** en verde (`gh run view <id>`); (c) las cifras cuadran con las del cierre del lote 4 (mismo número de pruebas, ninguna saltada).
- **Reglas de carpeta:** la CI corre `npm run test:e2e` (solo el proyecto `iphone`): `published.spec.ts` y `captures.spec.ts` nunca corren en la CI.
- **Terminado cuando:** (a), (b) y (c) verificados por el Manager.

### P-10 — Prueba de punta a punta en el celular
- **Feature:** F-001 · **Casos:** TC-001, TC-002, TC-024 sobre la versión publicada; TC-031 en el iPhone real (manual).
- **Capa:** prueba de punta a punta.
- **Qué es, en sencillo:** se repite el recorrido completo, pero sobre la dirección publicada de verdad: abrir, escribir "casa", ver los conteos, recargar y volver a 0. Se guardan capturas como evidencia, y el usuario hace una comprobación corta con su propio iPhone y su teclado real.
- **Archivos:** el tester amplía `tests/e2e/published.spec.ts` con TC-001, TC-002 y TC-024, y guarda capturas en `_project/slices/VS-001/evidence/published/`. **No hay código de la app** en este paso (el coder no participa).
- **Prueba que va primero:** el Manager corre `published.spec.ts` contra la dirección **única de la preview del lote 1** (que no cuenta): TC-002 debe **fallar**. Así se demuestra que la prueba detecta una app que no cuenta. Después la corre contra la preview del **commit que se va a aceptar**: verde.
- **Comprobación manual en el iPhone** (el usuario; el Manager la anota en `evidence/iphone-manual.md` con sus capturas): (1) escribir "cas" + espacio con el teclado real: el texto sigue "cas " y el teclado no propone ni cambia palabras (TC-031); (2) escribir "canción" y "niño" con el teclado real (manteniendo presionada la letra para la tilde): 3/4/0/0 y 2/2/0/0; (3) escribir un emoji desde el teclado: Otros 1; (4) la primera letra no se pone sola en mayúscula; (5) modo oscuro del iPhone: la app cambia sola.
- **Lecciones:** ninguna registrada aplica.
- **Terminado cuando:** `published.spec.ts` en verde sobre la preview del commit a aceptar, capturas en `evidence/published/` y la lista manual completa.

---

## 4. Lotes

| Lote | Pasos | Tester (trabajo A, antes del coder) | Coder | Al cerrar (además del cierre normal del coder) | Riesgo |
|---|---|---|---|---|---|
| **1** | P-1, P-2 | `skeleton.spec.ts`, `published.spec.ts` (solo escribe: no hay herramientas para correrlas) | `chore` + `feat(P-1)`, `chore(P-2)` | El Manager sube la rama; el usuario conecta Vercel y abre la preview en el iPhone; el Manager corre `test:published` | Alto |
| **2** | P-3, P-4 | `screen.spec.ts`, `captures.spec.ts` (estado 1 y crecimiento del campo) | P-3 (pantalla), P-4 (Vitest + conteo de letras) | Capturas a `evidence/capturas/lote-2/` → designer (trabajo C) | Alto |
| **3** | P-5, P-6 | `typing.spec.ts`, `captures.spec.ts` (+ estados 2 y 3) | P-5 (números, otros, espacios), P-6 (conexión) | Capturas a `lote-3/` → designer | Alto |
| **4** | P-7, P-8 | `foreign-letters.spec.ts`, `max-length.spec.ts`, `captures.spec.ts` (+ estado 4) | P-7 (filtro), P-8 (tope de 100) | Capturas a `lote-4/` → designer | Alto |
| **5** | P-9, P-10 | `published.spec.ts` (+ TC-001, 002, 024) | `ci(P-9)` | El Manager comprueba la CI (criterio de P-9), corre P-10 contra la preview y recoge la lista manual del iPhone | Alto |

- **Tamaño:** ningún lote pasa de ~200 líneas de app (el más grande, el 2, ~175: ~25 de `index.html`, ~100 de `styles.css` porque los tokens se escriben en claro y oscuro, ~15 de `main.ts` y ~35 de `counting.ts`). No hay piezas parecidas anteriores para comparar (es la primera slice): es una estimación desde la maqueta, que ya tiene el CSS casi completo (~45 líneas compactas).
- **Sin CI hasta el lote 5:** el orden aprobado pone la CI en el paso 9. En los lotes 1 a 4 el Manager **no** tiene la CI como respaldo: antes de subir cada lote corre él mismo `npm run check`, `npm run test:unit` y `npm run test:e2e` en la carpeta de la slice.
- **E2E que el Manager indica en el paquete del coder** (por tocar piezas compartidas): lote 3 → `screen.spec.ts`; lote 4 → `screen.spec.ts` y `typing.spec.ts`.

---

## 5. Interfaces públicas (contrato del coder y del tester)

### 5.1 Pantalla — ruta `/` (única)
| Elemento | Identificador de prueba / selector | Contenido exacto |
|---|---|---|
| Página | `<html lang="es-CO">` | Título de la pestaña: `Contapp` |
| Título (h1) | `data-testid="app-title"` | `Contapp` |
| Etiqueta del campo | `<label for="text-field">` (también `getByLabel("Escribe una palabra o frase")`) | `Escribe una palabra o frase` |
| Campo | `<textarea id="text-field" data-testid="text-field">` | Vacío al abrir. Atributos: `rows="2"`, `autocomplete="off"`, `autocorrect="off"`, `autocapitalize="off"`, `spellcheck="false"`. **Sin** `placeholder`, `maxlength` ni `readonly` |
| Cuadrícula | `<dl data-testid="count-grid">` | 4 fichas, siempre en este orden |
| Ficha 1 | `data-testid="count-card-vowel"`: `<dt>` nombre + `<dd data-testid="count-vowel">` valor | `Vocales` |
| Ficha 2 | `count-card-consonant` / `count-consonant` | `Consonantes` |
| Ficha 3 | `count-card-digit` / `count-digit` | `Números` (con tilde en la "u") |
| Ficha 4 | `count-card-other` / `count-other` | `Otros` |

En cada ficha el `<dt>` va **antes** que el `<dd>` en el HTML (se lee "Vocales, 4"), aunque el número se vea arriba.

**Comportamiento que el tester puede comprobar:**
- **Valor de un conteo:** solo cifras, de `0` a `100`, sin espacios, separadores ni ceros a la izquierda. El 0 se ve `0`.
- **Al instante:** los conteos ya están actualizados cuando termina el evento del cambio; no hay demora, botón ni animación.
- **Texto del campo:** después de cualquier cambio, el valor queda en **forma NFC** (una letra con su tilde es una sola pieza: `"ñ"` pegada queda `"ñ"`).
- **Rechazo silencioso** (letra de otro idioma, número de otro alfabeto, invisible suelto, carácter 101): el valor del campo **no cambia**, el cursor (`selectionStart` y `selectionEnd`) queda **donde estaba antes del intento**, y los 4 conteos no cambian.
- **Pegar en medio:** lo aceptado entra en la posición del cursor; el cursor queda justo después de lo que entró.
- **Ningún aviso, nunca:** no hay elementos con `role="alert"`, `role="status"`, `role="dialog"` ni `aria-live`; no se abre `alert`, `confirm` ni `prompt`; el texto visible de la página es solo el título, la etiqueta, los 4 nombres, los 4 números y lo escrito.
- **Nada sale de la página:** después de cargar, escribir no genera ninguna petición de red.
- **Al recargar:** campo vacío y los 4 en `0`.
- **Campo:** empieza en 2 líneas, crece de a una hasta 5 y luego se desplaza por dentro. Nunca hay desplazamiento horizontal (tampoco a 320 px).
- **Modo oscuro:** sigue la preferencia del sistema (`page.emulateMedia({ colorScheme: "dark" })`).

### 5.2 Funciones (para las pruebas unitarias)

**`src/counting.ts`** (P-4, P-5)
```ts
export type CharacterGroup = "vowel" | "consonant" | "digit" | "other";
export type CharacterCounts = Record<CharacterGroup, number>;
export function countCharacters(text: string): CharacterCounts;
```
- Nunca lanza error. Primero normaliza a NFC y luego recorre el texto **por caracteres visibles** (grafemas, `Intl.Segmenter` con `granularity: "grapheme"`).
- Cómo se clasifica cada carácter (en minúscula):

| Carácter | Grupo |
|---|---|
| `a e i o u á é í ó ú ü` | `vowel` |
| `b c d f g h j k l m n ñ p q r s t v w x y z` | `consonant` |
| Un solo dígito `0`–`9` | `digit` |
| Solo espacio en blanco (propiedad Unicode `White_Space`: espacio, tabulación, saltos de línea, espacio que no se parte U+00A0, etc.) | **no se cuenta** |
| Cualquier otro: signos, símbolos, un emoji completo (aunque tenga varias piezas), `1️⃣`, `²`, `½`, `ª`, `º`, `´`, `¨`, `` ` ``, `^` | `other` |

**`src/inputFilter.ts`** (P-7, P-8)
```ts
export const MAX_TEXT_LENGTH = 100;                       // P-8 (A-001)
export function textLength(text: string): number;          // P-8
export type InputResult = { text: string; cursor: number };
export function applyInput(previousText: string, nextText: string, cursor: number): InputResult; // P-7, P-8
```
- `textLength`: número de grafemas del texto en NFC; **los espacios, tabulaciones y saltos de línea sí cuentan**; un emoji cuenta 1; `"á"` cuenta 1.
- `applyInput`: `previousText` es el texto que ya estaba aceptado; `nextText` es lo que quedó en el campo después del cambio; `cursor` es la posición del cursor después del cambio (`selectionEnd`, en unidades de JavaScript). Devuelve el texto aceptado y dónde dejar el cursor. Nunca lanza error.
  1. Separa `nextText` en: lo que estaba antes del cambio, **lo nuevo** (lo que se escribió o pegó, que termina en `cursor`) y lo que estaba después. El corte siempre cae en el borde de un grafema completo, nunca en medio de un emoji o de una letra con tilde.
  2. Si no hay nada nuevo (se borró), acepta `nextText` tal cual.
  3. Filtra **solo lo nuevo** (P-7), grafema por grafema, después de pasarlo a NFC:
     - Un grafema que contiene un **emoji** (propiedad `Extended_Pictographic`, indicador regional de bandera o el signo de tecla `U+20E3` de `1️⃣`) **entra completo**, con sus piezas invisibles.
     - En los demás, se quitan los **invisibles** (categoría `Cf`, p. ej. `U+200B`, `U+200D`, `U+2060`, `U+FEFF`, `U+00AD`; caracteres de control salvo tabulación `U+0009`, salto de línea `U+000A` y retorno `U+000D`; selectores de variante `U+FE00`–`U+FE0F`). Si no queda nada, no entra.
     - **No entra** el grafema que: tiene una letra que no es del alfabeto español (C-011; se permiten `a–z`, `ñ`, `á é í ó ú ü` en mayúscula y minúscula, y `ª º`); empieza por un signo combinable suelto (p. ej. `U+0301` solo); o tiene un dígito que no es `0`–`9` (`٣`, C-015).
     - Todo lo demás entra en el mismo orden (C-016).
  4. Tope (P-8): de lo nuevo ya filtrado entra solo el comienzo, hasta que el texto completo llegue a `MAX_TEXT_LENGTH` grafemas.
  5. `text` = antes + lo nuevo aceptado + después; `cursor` = largo de (antes + lo nuevo aceptado). Si no entró nada, `text` es igual a `previousText` y el cursor queda donde empezaba lo nuevo.

### 5.3 Herramientas de prueba (lo que el tester puede leer)
- Proyectos de Playwright: `iphone` (todas las E2E menos `published` y `captures`), `captures` (solo `captures.spec.ts`), `published` (solo `published.spec.ts`, contra `E2E_BASE_URL`). Todos con `devices["iPhone 13"]` (WebKit, 390 × 844). Servidor local: `http://localhost:4173` (lo arranca Playwright solo).
- Vitest toma `src/**/*.test.ts` y `tests/unit/**/*.test.ts`, en entorno `node` (sin navegador simulado).
- Base de pruebas: **no hay** (la app no guarda datos, C-010).

---

## 6. Trazabilidad

| Caso | Paso(s) | Tipo | Quién lo escribe |
|---|---|---|---|
| TC-001 | P-3, P-10 | E2E | tester |
| TC-002 | P-6, P-10 | E2E | tester |
| TC-003 | P-6 | E2E | tester |
| TC-004 | P-4 | Unitaria | coder (TDD); el tester puede agregarla en `tests/unit/` |
| TC-005 | P-4 | Unitaria | coder |
| TC-006 | P-4 | Unitaria | coder |
| TC-007 | P-4 | Unitaria | coder |
| TC-008 | P-4 | Unitaria | coder |
| TC-009 | P-4 | Unitaria | coder |
| TC-010 | P-5 | Unitaria | coder |
| TC-011 | P-5 | Unitaria | coder |
| TC-012 | P-5 | Unitaria | coder |
| TC-013 | P-5 | Unitaria | coder |
| TC-014 | P-5 | Unitaria | coder |
| TC-015 | P-5 | Unitaria | coder |
| TC-016 | P-7 | E2E | tester |
| TC-017 | P-7 | E2E | tester |
| TC-018 | P-7 | E2E | tester |
| TC-019 | P-7 | E2E (control) | tester |
| TC-020 | P-8 | E2E (control) | tester |
| TC-021 | P-8 | E2E | tester |
| TC-022 | P-8 | E2E | tester |
| TC-023 | P-8 | E2E | tester |
| TC-024 | P-6, P-10 | E2E | tester |
| TC-025 | P-6 | Integración (con Playwright, mirando las peticiones) | tester |
| TC-026 | P-3 | E2E | tester |
| TC-027 | P-6 | E2E | tester |
| TC-028 | P-8 | E2E | tester |
| TC-029 | P-7 | E2E + unitaria | tester + coder |
| TC-030 | P-8 | E2E + unitaria | tester + coder |
| TC-031 | P-3, P-10 | E2E (atributos) + manual en iPhone | tester + usuario |
| TC-032 | P-4 (conteo), P-8 (largo) | Unitaria | coder |
| TC-033 | P-7 | E2E | tester |
| TC-034 | P-5 | Unitaria | coder |
| TC-035 | P-5 (unitaria), P-7 (E2E, control) | Unitaria + E2E | coder + tester |
| TC-036 | P-7 | E2E | tester |
| TC-037 | P-5 | Unitaria | coder |
| TC-038 | P-7 | E2E | tester |
| TC-039 | P-4 (conteo), P-8 (largo) | Unitaria | coder |
| TC-040 | P-7 | E2E | tester |
| TC-041 | P-7 | E2E + unitaria | tester + coder |
| TC-042 | P-8 | E2E | tester |

Los 42 casos quedan cubiertos. Cada restricción dura citada por F-001 tiene al menos un caso (trazabilidad del architect). C-013 en el código la revisa el reviewer.

---

## 7. Riesgos y supuestos técnicos

| # | Riesgo o supuesto | Cómo se detecta / qué se hace |
|---|---|---|
| R-1 | **Las previews de Vercel piden iniciar sesión por defecto** ("Vercel Authentication"): el iPhone del usuario y la prueba `published` no las abrirían sin más | Pregunta 1 del reporte. Opción B (recomendada): apagarla para las previews. Opción A: dejarla, y que el usuario inicie sesión en Vercel en su iPhone y la prueba use `VERCEL_AUTOMATION_BYPASS_SECRET` (cabecera `x-vercel-protection-bypass`) |
| R-2 | WebKit de Playwright **no es** el Safari real de iOS: el teclado, el corrector y la forma de poner tildes no se simulan | Lista manual de P-10 en el iPhone real (TC-031 y tildes con el teclado) |
| R-3 | El teclado "componiendo" una letra (tildes con tecla muerta en computador, algunos teclados del iPhone) podría verse cortado si se filtra a mitad | P-7 no filtra mientras `isComposing`; se filtra al `compositionend`. Lo comprueba la lista manual (punto 2) y es idea de ataque para los breakers |
| R-4 | Las versiones de `eslint` 10 / TypeScript 6 podrían no estar aún en el rango que acepta `typescript-eslint` 8.72.1 (Context7 no mostró el rango exacto) | `npm install` lo avisa en P-1; respaldo aprobado en §2.2 |
| R-5 | Sin CI hasta el lote 5 | El Manager corre la suite completa en local antes de subir cada lote (§4) |
| R-6 | Dos carpetas (slice y breaker) corriendo Playwright a la vez usarían el mismo puerto 4173 y una podría probar la app de la otra | Un solo Playwright a la vez; el Manager comprueba que el puerto está libre (playbook §8.4) |
| R-7 | Un signo combinable pegado **solo** (p. ej. `U+0301`) detrás de una "a" que ya estaba: este plan lo trata como "signo suelto" y **no entra** (no forma "á") | Supuesto técnico derivado de C-014 y C-015 (pregunta 2 del reporte). Si el usuario decide otra cosa, cambia solo la regla 3 de `applyInput` |
| R-8 | `Intl.Segmenter` y las propiedades Unicode dependen de la versión del navegador; un emoji muy nuevo podría partirse en un iPhone viejo | Safari moderno lo soporta; la lista manual de P-10 incluye un emoji. Borde para los breakers |
| R-9 | El primer despliegue de `main` en Vercel falla (aún no hay app en `main`) | Esperado; se avisa al usuario (§2.4) |
| R-10 | La revisión de seguridad podría pedir cabeceras de seguridad (p. ej. CSP) que este plan no incluye | Fuera del esbozo; si aparece, el Manager lo trata como `DT-propuesta` o borde |

---

## 8. Comandos y valores para llenar los `COMPLETAR AL DECIDIR`

### 8.1 Scripts de `package.json`
| Script | Comando | Paso |
|---|---|---|
| `dev` | `vite` | P-1 |
| `build` | `vite build` | P-1 |
| `preview` | `vite preview` | P-1 |
| `typecheck` | `tsc --noEmit` | P-1 |
| `lint` | `eslint .` | P-1 |
| `check` | `npm run typecheck && npm run lint` | P-1 |
| `test:e2e` | `playwright test --project=iphone` | P-1 |
| `test:published` | `playwright test --project=published` | P-2 |
| `test:unit` | `vitest run` | P-4 |

### 8.2 Comandos (para `project-context` §3 "Pruebas" y las guardas)
| Para qué | Comando |
|---|---|
| Revisión estática (tipos + lint) | `npm run check` |
| Unitarias completas | `npm run test:unit` |
| Unitarias de un archivo | `npx vitest run <archivo>` |
| E2E de un archivo | `npx playwright test tests/e2e/<archivo>.spec.ts --project=iphone` |
| E2E completa | `npm run test:e2e` |
| Capturas de un lote | `npx playwright test --project=captures --output=_project/slices/VS-001/evidence/capturas/lote-N` |
| E2E contra la versión publicada (Manager, en Git Bash) | `E2E_BASE_URL=<dirección> npm run test:published` |
| Suite completa (la corre la CI) | `npm run check` + `npm run test:unit` + `npm run test:e2e` + gitleaks |
| Secretos en el historial | `gitleaks git --redact --no-banner` |
| Secretos en los archivos | `gitleaks dir --redact --no-banner .` |
| Preparar una carpeta nueva (worktree) | `npm ci` y `npx playwright install webkit` (no hay archivo de variables que copiar) |

### 8.3 Valores propuestos para las guardas de `.claude/agents/`
- **`<codigo>`** (código de la app): `src` e `index.html`.
- **Zona de escritura del coder:** `src`, `index.html`, `package.json`, `package-lock.json`, `tsconfig.json`, `vitest.config.ts`, `playwright.config.ts`, `eslint.config.js`, `.gitignore`, `.gitattributes`, `.github/workflows`.
- **`<pruebas-aceptacion>`:** `tests`.
- **`<config-pruebas>`** (lo que el tester sí puede leer): `+package.json`, `+playwright.config.ts`, `+vitest.config.ts`, `+test-results`, `+playwright-report`.
- **`<comandos-del-stack>`** (coder): `npm install`, `npm ci`, `npm run`, `npx vitest`, `npx playwright`, `npx tsc`, `npx eslint`.
- **`<comandos-de-pruebas>`** (tester): `npm run test:unit`, `npm run test:e2e`, `npx vitest run`, `npx playwright test`.
- **`<pruebas-breakers>`:** `tests/unit/BRK-*` (breaker-code) y `tests/e2e/BRK-*` (breaker-user): así la configuración ya los encuentra sin cambios, y como viven solo en su carpeta aparte, nunca llegan a la CI. `<comandos-unitarias>`: `npx vitest run`; `<comandos-e2e>`: `npx playwright test`.
- **`<comandos-de-seguridad>`:** `gitleaks git`, `gitleaks dir`, `npm audit`.
- **`<comandos-de-revision>`:** `npm run check`, `npm run test:unit`, `npx eslint`, `npx tsc --noEmit` (+ las herramientas de duplicación, código sin uso y mutación cuando se decidan; ver reporte).

### 8.4 Playbook
- **Rutas por nivel de riesgo:**
  - Alto (1) datos: no aplica (no hay datos guardados, C-010).
  - Alto (2) reglas críticas: `src/counting.ts`, `src/inputFilter.ts` y las líneas de `src/main.ts` que llaman a `applyInput`.
  - Alto (3) acceso · (4) límite de confianza: no hay servidor ni cuentas; la entrada externa (lo que se escribe o pega) está en (2).
  - Alto (5) despliegue · (6) dependencias · (7) cadena: `package.json`, `package-lock.json`, `vite`/`vitest`/`playwright`/`eslint`/`tsconfig` (configuraciones), `.github/workflows/**`, `.gitattributes`, `.gitignore`, `vercel.json` (si algún día existe), `.claude/hooks/**`, `.claude/agents/**`.
  - Normal: `index.html`, `src/main.ts` (lo que no es validación), `tests/e2e/**`.
  - Bajo: `src/styles.css`, imágenes, `*.md` fuera de `.claude/agents/`.
- **Preview:** automática; Vercel publica cada push de la rama `feature/...` en su propia dirección. No hay base de datos.
- **PR:** `gh pr create --base main --head feature/VS-001-contar-en-el-celular --title "VS-001 \"Contar en el celular\" (vX.YYY.ZZZ)" --body-file <archivo>`.
- **Producción:** `gh pr merge <n> --merge --match-head-commit <hash>`; al fusionar, Vercel publica `main` en producción solo.
- **Limpieza:** las previews no necesitan limpieza (Vercel las conserva; se pueden borrar desde el panel si el usuario quiere). No hay base de datos.
- **Breakers:** no necesitan base de pruebas propia (no hay datos); solo su carpeta, `npm ci`, `npx playwright install webkit` y el puerto 4173 libre.
- **`design-system` skill:** los tokens se definen una sola vez en `src/styles.css` (`:root` y `@media (prefers-color-scheme: dark)`); no hay librería de componentes: cada componente es HTML + una clase CSS. Ejemplo: `.count dd { color: var(--color-primary); }`.
- **`tdd-cycle` skill:** herramienta de unitarias = Vitest; fijar la hora no aplica (la app no usa fechas).
