# Plan de trabajo — VS-002 "Imágenes y diseño para niños"
**Aprobación del plan:** Aprobado por el usuario — 2026-11-27 (con la prueba aproximada del teclado, TC-061 ≤ 417 px; la revisión de cierre queda en **Alta**: el usuario no la baja aunque `src/main.ts` solo cambie un comentario)

**Fecha:** 2026-11-27 · **Autor:** planner · **Features:** F-002 y F-003 (aprobadas, alcance + diseño = DoR, 2026-11-27, commit `7804cf2`) · **Esbozo:** `_project/slices/VS-002.md` §8 (aprobado 2026-11-27) · **Diseño:** `_project/design/F-002/mockup-b.html`, `_project/design-system.md` · **Stack:** D-011 (sin cambios)

---

## 1. Resumen
Se le pone a la pantalla de VS-001 lo que la vuelve "para niños": cada ficha con su color y su imagen (boca que canta, rompecabezas, mano que cuenta, carita feliz), la letra igual de grande que antes y menos espacio vacío, para que con el teclado del iPhone abierto se vean completos los 4 grupos.

- **7 pasos** (P-1 a P-7). Son los del esbozo aprobado, en el mismo orden, **sin el paso 5** ("Textos de la pantalla didáctica"), que se quita porque el diseño aprobado no cambia ningún texto (F-003 §5.6), como preveía el esbozo. No se agregó, partió ni juntó ningún paso.

| Paso del plan | Paso del esbozo | Nombre |
|---|---|---|
| P-1 | 1 | Ordenar la deuda de pruebas y comentario (DT-008, DT-009) |
| P-2 | 2 | Un color por grupo |
| P-3 | 3 | Una imagen por grupo |
| P-4 | 4 | Letra grande (y que todo quepa a 390 y 320 px) |
| — | 5 | *Quitado: ningún texto cambia (F-003 §5.6). CA-19 / TC-060 se prueban como control en P-4* |
| P-5 | 6 | Los 4 grupos a la vista con el teclado abierto |
| P-6 | 7 | Prueba de punta a punta en la versión publicada |
| P-7 | 8 | Comprobación en el iPhone del usuario |

- **4 lotes** (cada uno cabe en una sesión y termina en verde):

| Lote | Pasos | Qué ve el usuario al terminar | Líneas de app (estimado) | Nivel de riesgo esperado (archivos que lo deciden) |
|---|---|---|---|---|
| 1 | P-1, P-2 | Las 4 fichas con el color de su grupo (número y borde), en claro y oscuro | ~25 | **Alto por archivo** — `src/main.ts` (DT-009: solo un comentario, dentro de `filterChange`, que llama a `applyInput`). Sin ese archivo sería **Normal** (`index.html`) |
| 2 | P-3, P-4 | Cada ficha con su imagen al lado del número; "100" y "Consonantes" caben a 320 px | ~30 | **Bajo** — solo `src/styles.css` (y sus pruebas, que siguen el nivel del código que prueban) |
| 3 | P-5 | Pantalla más compacta: con el teclado abierto se ven los 4 grupos | ~8 | **Bajo** — solo `src/styles.css` |
| 4 | P-6, P-7 | Prueba en la versión publicada y comprobación en su iPhone, con fotos | 0 | **Bajo** — solo `tests/e2e/published.spec.ts` (sin código de la app) |

"Líneas de app" = `src/` más `index.html`, sin pruebas, configuración ni lockfile. Total de la slice: ~65 líneas.

- **Revisión de cierre (etapas 9b y 10):** se clasifica con el diff de toda la slice (`git diff --name-only main...HEAD`), así que **`src/main.ts` la vuelve Alta** aunque solo cambie un comentario (regla 1 de `risk-levels.md`). Propongo al usuario **bajarla a Normal** si `git diff main...HEAD -- src/main.ts` muestra solo líneas de comentario (pregunta 1 del reporte). Lo que la deja en Normal es `index.html` (P-2).

**Para explicárselo al usuario:** primero se ordenan dos detalles que quedaron de VS-001 y se pintan las fichas de colores (lote 1); después se les pone su dibujo y se comprueba que todo cabe en el celular más angosto (lote 2); luego se "aprieta" la pantalla para que el teclado no tape nada (lote 3); al final se prueba la versión publicada y usted la comprueba en su iPhone con fotos (lote 4).

---

## 2. Preparación

### 2.1 Rama y carpeta
- Rama: `feature/VS-002-imagenes-ninos`, creada desde `main` al aprobarse este plan, en la carpeta `../CONTAPP-VS-002` (playbook §8). Preparar con `npm ci` y `npx playwright install webkit`.

### 2.2 Dependencias nuevas
**Ninguna.** No se agrega ningún paquete ni archivo de letra o imagen: las imágenes son texto SVG dentro de `src/styles.css` y la letra sigue siendo la del iPhone (F-003 §5.10). Por eso ningún lote sube a Alto por dependencias (tipo 6).

**Técnica confirmada (pedido (a) del Manager):** se usa la recomendación del designer (F-002 §5.3, `design-system.md` §5 `GroupImage`): la imagen es un `::before` del `dd` del número, pintado con `background-color: currentColor` y recortado con la imagen SVG como máscara, escrita en el CSS como `url("data:image/svg+xml,…")`, con las dos declaraciones `-webkit-mask` y `mask`.
- **Por qué esta y no el `<svg>` dentro del `dd`:** (1) `src/main.ts` escribe el número con `textContent`, que borraría un `<svg>` hijo; con `::before` no hay que tocar `main.ts`, ni las pruebas que leen `count-<grupo>`; (2) la imagen toma sola el color del grupo en claro y oscuro (`currentColor`); (3) no se pide ningún archivo (CA-15); (4) un `::before` sin texto no agrega nada al lector de pantalla (CA-16) ni al texto visible que comparan `expectNoNotice`, TC-001 y TC-027, así que esas pruebas no cambian; (5) mantiene P-3 en riesgo Bajo (solo estilos).
- **Contra:** la imagen no es un elemento, así que las pruebas la leen por su estilo calculado (`toHaveCSS(..., { pseudo: "before" })`, verificado en Playwright 1.64.1) y no por un selector.
- **Verificado en Context7 (2026-11-27):** sintaxis del atajo `mask` con `url(...) <posición> / <tamaño> <repetición>` (`/mdn/content`); `toHaveCSS` con la opción `pseudo: "before"` y `toMatchAriaSnapshot` (`/microsoft/playwright/v1.64.1`). La versión exacta de Safari que acepta `mask` sin prefijo no salió en la consulta (`/mdn/browser-compat-data`): por eso se escriben **las dos** declaraciones, `-webkit-mask` y `mask` (la de prefijo la entiende Safari desde hace muchos años), y lo confirman la E2E en WebKit y la foto del iPhone (P-7).

### 2.3 Variables de entorno (solo nombres)
| Nombre | ¿Secreto? | Para qué | Paso |
|---|---|---|---|
| `E2E_BASE_URL` | No | Dirección de la preview contra la que corre el proyecto `published` | P-6 |

### 2.4 Lo que debe hacer el usuario a mano
| Cuándo | Qué | Tiempo aprox. |
|---|---|---|
| Antes del lote 1 | Decidir si la revisión de cierre baja de Alta a Normal (pregunta 1 del reporte) | 1 min |
| Lote 4, P-7 | **Lista de comprobación en su iPhone** (§3, P-7): nombres tapados, teclado de letras y "123" en claro y oscuro, la frase de 50, y dos observaciones sin criterio. Mandar las fotos | 15 min |
| Lote 4, P-6 (solo si pasa) | Si la prueba publicada ve peticiones a `vercel.live` (barra de herramientas de Vercel en las previews), apagarla en *Settings* del proyecto en Vercel; el Manager lo guía (riesgo R-4) | 2 min |
| Al final | Aceptar la preview (commit exacto) y el mensaje de fusión (playbook §5) | — |

---

## 3. Pasos

### Convenciones para todos los pasos
- Iguales a las de VS-001 (plan VS-001 §3): pruebas del tester en `tests/e2e/`; "escribir" = `pressSequentially`, "pegar" = `page.keyboard.insertText`; caracteres especiales con su código (L-002, L-009, L-018); pruebas de **control** (pasan en el rojo a propósito) marcadas así en el reporte del tester.
- **Archivos nuevos del tester** en esta slice: `tests/e2e/group-look.spec.ts` (F-002) y `tests/e2e/didactic-screen.spec.ts` (F-003). Los dos corren en el proyecto `iphone` sin cambiar `playwright.config.ts` (no coinciden con `published` ni `captures`).
- **Archivo de capturas por lote:** el tester actualiza `tests/e2e/captures.spec.ts` (el proyecto `captures` solo toma ese nombre) para que tenga **todos los estados del diseño** vigentes en el lote (§4). El coder lo corre en su cierre con `npx playwright test --project=captures --output=_project/slices/VS-002/evidence/capturas/lote-N`. Nunca se escribe en `evidence/` fuera de ese comando y de `published.spec.ts`.
- **Lecciones de pruebas que aplican a todos los pasos de pantalla:** **L-010** (en Windows y en la CI la letra no es SF Pro: lo que cabe a lo ancho se confirma en el iPhone), **L-035** (el rojo se comprueba leyendo la aserción que falla), **L-019** (muchos rojos: correr por grupos con `--grep`).
- **El coder no escribe E2E** que repitan las del tester (los pasos 2 a 5 son de pantalla). No hay pruebas unitarias nuevas: las reglas de conteo y el filtro no cambian.

---

### P-1 — Ordenar la deuda de pruebas y comentario (esbozo 1)
- **Feature:** DT-008, DT-009 · **Casos:** TC-058 (regresión; la suite sigue igual).
- **Capa:** prueba (DT-008) y comentario del código (DT-009). Sin cambio de comportamiento.
- **Qué es, en sencillo:** una revisión que estaba copiada en dos pruebas ("no se guardó nada en el celular") pasa a un solo lugar, y un comentario del código que decía algo incompleto se corrige. La app no cambia.
- **Archivos:**
  - **Tester** (es su zona: `tests/`):
    - `tests/e2e/field-helpers.ts`: agrega `expectNothingStored(page, context)` (§5.3) con lo que hoy está en `typing.spec.ts:136-145` y `published.spec.ts:136-145` (`localStorage`, `sessionStorage`, `document.cookie`, `indexedDB.databases()`, `caches.keys()` y `context.cookies()`).
    - `tests/e2e/typing.spec.ts` (TC-024) y `tests/e2e/published.spec.ts` (TC-024): usan la función en lugar de la copia.
    - `tests/e2e/published.spec.ts:23`: `EVIDENCE` pasa a `_project/slices/VS-002/evidence/published` (pedido (d)). Va en este paso, y no en P-6, porque desde que se toca este archivo cualquier `npm run test:published` sobrescribiría la evidencia de VS-001.
  - **Coder:** `src/main.ts:61`, solo el comentario. Texto exacto:
    `// The field is rewritten only when the accepted text differs from it: something did not get in,`
    `// or a letter that came in two pieces was joined into one (NFC). That is what makes undo stale (DT-003).`
- **Prueba que va primero:** no hay rojo posible (no cambia comportamiento). El respaldo es un **criterio escrito antes** (PI-5): (a) el tester anota en su reporte el número de pruebas de `npm run test:e2e` **antes** del cambio y la lista de `typing.spec.ts`; (b) después del cambio, el mismo número, todas en verde, ninguna saltada; (c) `grep -n "localStorage" tests/e2e/*.spec.ts` ya no encuentra nada (solo queda en `field-helpers.ts`); (d) `git diff -- src/main.ts` muestra **solo** líneas de comentario. Commits: el Manager hace `test(acceptance): VS-002 — DT-008 …` con lo del tester; el coder `refactor(P-1): corrige el comentario de filterChange (DT-009)`.
- **Lecciones:** L-028 (archivos en la zona de cada agente). L-002 (las rutas y textos con tildes se escriben desde el editor).
- **Reglas de carpeta:** `tests/e2e/field-helpers.ts` no es una prueba (no termina en `.spec.ts`): Playwright no lo corre solo. `published.spec.ts` no corre en la CI ni en `npm run test:e2e`; el tester comprueba que **compila** con `npm run check`.
- **Terminado cuando:** (a) a (d) verificados; `npm run check` en verde. Las filas DT-008 y DT-009 de `_project/tech-debt.md` las marca el Manager en `main` (el archivo se edita solo en `main`).

### P-2 — Un color por grupo (esbozo 2)
- **Feature:** F-002 · **Casos:** TC-052, TC-058.
- **Capa:** pantalla (estilos y marcado).
- **Qué es, en sencillo:** cada ficha recibe el color de su grupo (rojo, azul, naranja, morado; más claros en modo oscuro) en el número y en el borde punteado. El nombre y el fondo de la ficha no cambian.
- **Archivos:**
  - `index.html`: a cada ficha se le suma su clase de grupo: `class="count count--vowel"`, `count--consonant`, `count--digit`, `count--other`. Nada más cambia (mismos `data-testid`, mismo orden `dt` → `dd`).
  - `src/styles.css`:
    - En `:root`: `--color-vowel: #c62828; --color-consonant: #1565c0; --color-digit: #a84b00; --color-other: #7b1fa2;` y en `@media (prefers-color-scheme: dark)`: `#ff7b72`, `#82b1ff`, `#ffb74d`, `#ce93d8` (`design-system.md` §2).
    - `.count--vowel { --group-color: var(--color-vowel); }` y así las 4.
    - `.count`: `border-color` pasa de `var(--color-border)` a `var(--group-color)`. `.count dd`: `color` pasa de `var(--color-primary)` a `var(--group-color)`.
    - `--color-primary` y `--color-border` **se quedan** definidos (el título y el foco usan `--color-primary`; `--color-border` queda reservado, `design-system.md` §2).
- **Prueba que va primero:** la de aceptación del tester:
  - `tests/e2e/group-look.spec.ts` → **TC-052**: en claro y en oscuro, para cada grupo: color del número (`count-<grupo>`) y de los 4 bordes de la ficha (`count-card-<grupo>`, `border-*-color`) = el color del grupo (§5.1); borde `dashed` de 2 px; fondo de la ficha = `--color-surface`; nombre (`dt`) = `--color-text`; los 4 colores distintos entre sí; contraste WCAG calculado en la prueba ≥ 4,5:1 del color sobre el fondo de la ficha y sobre `--color-input-bg` (el fondo leído del campo `text-field`), en los dos modos.
  - `tests/e2e/screen.spec.ts:283-299` (**cambia**, F-002 §5.8): el número de Vocales pasa de `rgb(31, 107, 51)` / `rgb(255, 221, 85)` a `rgb(198, 40, 40)` / `rgb(255, 123, 114)`; el fondo de la ficha sigue igual.
  - Rojo: fallan porque el número está en `--color-primary` y el borde en `--color-border`. El fondo de la ficha, el color del nombre y el contraste del campo son *control*.
- **Lecciones:** ninguna de tiempos o posiciones.
- **Terminado cuando:** `group-look.spec.ts` y `screen.spec.ts` en verde; regresión del lote (§4) en verde; capturas del lote 1.

### P-3 — Una imagen por grupo (esbozo 3)
- **Feature:** F-002 · **Casos:** TC-050, TC-051, TC-053, TC-054, TC-055, TC-056, TC-058.
- **Capa:** pantalla (estilos).
- **Qué es, en sencillo:** a la izquierda del número aparece el dibujo de su grupo, del mismo color que el número. El dibujo va escrito dentro del archivo de estilos, así que la app no pide nada a internet y el lector de pantalla sigue diciendo "Vocales, 0".
- **Archivos:** solo `src/styles.css`:
  - En `:root`: `--size-group-image: 44px` (`design-system.md` §4).
  - En cada `.count--<grupo>`: `--group-image: url("data:image/svg+xml,…")` con el SVG **copiado tal cual** de `mockup-b.html` (`--img-vowel`, `--img-consonant`, `--img-digit`, `--img-other`, líneas 69-72). Los 4 SVG no tienen `#` (que habría que escribir `%23`).
  - `.count dd`: `display: flex; align-items: center; justify-content: center; gap: var(--space-2);`.
  - `.count dd::before`: `content: ""; flex: none; width: var(--size-group-image); height: var(--size-group-image); background-color: currentColor; -webkit-mask: var(--group-image) center / contain no-repeat; mask: var(--group-image) center / contain no-repeat;`.
  - `index.html` y `src/main.ts` **no cambian**.
- **Prueba que va primero:** la de aceptación del tester, en `tests/e2e/group-look.spec.ts`:
  - **TC-050** (claro): en orden, cada `count-card-<grupo>` visible con su `dt`, `count-<grupo>` = `0` y su imagen: `::before` de `count-<grupo>` con `width` y `height` `44px`, `background-color` = color del grupo, y `mask-image` (o `-webkit-mask-image`, el que no sea `none`) que contiene `data:image/svg+xml`; las 4 imágenes distintas entre sí; la imagen queda a la izquierda del número y en su misma fila (caja del `dd` y texto: la imagen ocupa los primeros 44 px del contenido del `dd`).
  - **TC-051** (oscuro): lo mismo con los colores oscuros (la captura es de `captures.spec.ts`).
  - **TC-053**: pegar `"¡Hola, 2026! \u{1F600}"` → `2/2/4/4`, y los estilos de la imagen y del color de las 4 fichas (lista de §5.1) son idénticos a los del campo vacío; borrar todo → `0/0/0/0` con los mismos estilos.
  - **TC-054**: con "casa", escribir `"ç"` → no entra; con 100 "a", escribir "b" → no entra; en los dos casos se usa `expectRejected` de `field-helpers.ts` **más** la comparación de los estilos de la imagen (`::before`) antes y después.
  - **TC-055**: al abrir y escribir "casa": toda petición va al mismo origen de la app (una dirección `data:`, si Playwright la reporta, cuenta como de la app), ninguna lleva "casa" (cuerpo, dirección, cabeceras) y `expectNothingStored` pasa.
  - **TC-056**: `expect(page.getByTestId("count-grid")).toMatchAriaSnapshot(...)` con exactamente 4 pares `term` / `definition`: "Vocales" / "0", "Consonantes" / "0", "Números" / "0", "Otros" / "0", sin otro nodo; y cada `dt` visible.
  - Rojo: TC-050, TC-051, TC-053 y TC-054 fallan porque el `::before` no existe (`content: none`, sin máscara). TC-055 y TC-056 son *control* (ya pasan y protegen que la imagen no agregue peticiones ni texto).
- **Lecciones:** L-009 / L-018 (la "ç" se escribe `ç`).
- **Terminado cuando:** `group-look.spec.ts` completo en verde; regresión del lote en verde.

### P-4 — Letra grande (esbozo 4)
- **Feature:** F-003 · **Casos:** TC-059, TC-060 (control, era del paso 5 quitado), TC-063, TC-064, TC-058.
- **Capa:** pantalla (estilos).
- **Qué es, en sencillo:** la letra queda igual de grande que en VS-001 (no se achica nada). Lo nuevo es que, en el celular angosto, el dibujo se achica a 32 px y la ficha ajusta sus bordes, para que "100" y "Consonantes" quepan completos junto al dibujo.
- **Archivos:** solo `src/styles.css`, dentro de `@media (max-width: 359px)`:
  - `:root { --size-group-image: 32px; }` (junto a los tamaños de letra que ya bajan ahí).
  - `.count { padding-left: var(--space-1); padding-right: var(--space-1); }` y `.count dd { gap: var(--space-1); }`.
  - **Orden en el archivo:** el bloque `@media (max-width: 359px)` que hoy existe (línea 42) está **antes** de `.count`; como las reglas tienen el mismo peso, gana la que va después. Por eso el token `--size-group-image: 32px` puede ir en ese bloque, pero las dos reglas de `.count` y `.count dd` van en un segundo bloque `@media (max-width: 359px)` **al final del archivo**, después de `.count dd::before`. Si no, el relleno de P-5 las taparía.
- **Prueba que va primero:** la de aceptación del tester, en `tests/e2e/didactic-screen.spec.ts`:
  - **TC-059**: a 390 × 844 y a 320 × 568: número `48px` / `44px`, peso 800; nombre `20px` / `18px`, peso 700; campo `24px` en los dos (≥ 16 px). Con la imagen: `44px` / `32px`.
  - **TC-060**: al abrir y con "casa" escrito, el texto visible es exactamente `Contapp Escribe una palabra o frase Vocales # Consonantes # Números # Otros #` (con `expectNoNotice`) y el campo es el único control.
  - **TC-063**: a 390 × 844 y 320 × 568, en claro y oscuro: las 4 fichas dentro del ancho, sin desplazamiento horizontal, `dt` sin desborde (`scrollWidth ≤ clientWidth`, también "Consonantes"); con 100 "m" pegadas tampoco hay desplazamiento horizontal.
  - **TC-064**: a 390 y a 320 px, pegar 100 "a" → `count-vowel` = `100`, y la caja de la imagen y la del número caben dentro de la ficha (`dd` sin desborde: `scrollWidth ≤ clientWidth`, y la caja del `dd` dentro de la de `count-card-vowel`); lo mismo con "0", 9 "a" y 10 "a".
  - `screen.spec.ts:246-281` **no cambia** (sigue como regresión).
  - Rojo: a 320 px, la imagen mide 44 px (TC-059 de la imagen falla) y "100" con la imagen de 44 desborda la ficha (TC-064 a 320 falla: ≈ 44 + 8 + 82 = 134 px en ≈ 118 útiles). A 390 px, TC-059, TC-060, TC-063 y TC-064 son *control*.
- **Lecciones:** L-010 (el ancho de "100" y "Consonantes" depende de la letra; en el iPhone lo confirma la foto de P-7).
- **Terminado cuando:** `didactic-screen.spec.ts`, `group-look.spec.ts` y `screen.spec.ts` en verde; capturas del lote 2.

### P-5 — Los 4 grupos a la vista con el teclado abierto (esbozo 6)
- **Feature:** F-003 · **Casos:** TC-061 (complemento automático; el criterio lo da la foto de P-7), TC-058.
- **Capa:** pantalla (disposición, solo espacios).
- **Qué es, en sencillo:** se acortan 5 espacios de la pantalla (arriba, entre título y etiqueta, dentro del campo, entre campo y fichas, y dentro de las fichas), ninguna letra baja. Así la pantalla mide ≈ 395 px y cabe en los ≈ 427 px que deja libres el teclado del iPhone.
- **Archivos:** solo `src/styles.css` (F-003 §5.3):
  - `.app`: `padding-top` de `--space-3` a `--space-2`.
  - `.app-title`: `margin-bottom` de `--space-4` a `--space-2`.
  - `.field`: `padding: var(--space-2) var(--space-3)`; `max-height: calc(5 * 1.3em + 2 * var(--space-2) + 2 * var(--border-width-input))`.
  - `.counts`: `margin-top` de `--space-5` a `--space-3`.
  - `.count`: `padding` de `var(--space-3) var(--space-2)` a `var(--space-2)` (el ajuste de menos de 360 px de P-4 se mantiene).
  - `src/main.ts` **no cambia** (la solución es solo de espacios; no hay lógica de pantalla nueva).
- **Prueba que va primero:** la de aceptación del tester:
  - `tests/e2e/didactic-screen.spec.ts` → **"TC-061 (aproximación): con el campo activo, las 4 fichas terminan dentro de lo que deja el teclado"**: proyecto `iphone` (390 de ancho), campo con foco y `scrollY` = 0, en cuatro casos: vacío, "pingüino", `"la casa\nel sol"` (2 líneas) y el campo en 2 líneas; el borde de abajo de `count-card-other` y de `count-card-digit` queda a **≤ 417 px** del inicio de la página (427 px visibles medidos en la foto, F-003 §5.2, menos 10 px de margen por la letra SF Pro), y el campo completo también. La frase de 50 **no** se usa aquí: en qué renglón se parte depende de la letra (L-010); va en P-7.
  - `tests/e2e/screen.spec.ts:180-228` (**cambia**): el campo vacío pasa de ≈ 90 px a ≈ 82 px (2 × 31,2 + 2 × 8 + 2 × 2 = 82,4): rango 80 a 85 px; el resto de la prueba (crecer hasta 5 líneas, desplazarse por dentro, volver a encoger) sigue igual con el nuevo alto.
  - Rojo: hoy el final de la segunda fila queda en ≈ 433 px (> 417) y el campo mide ≈ 90 px.
- **Lecciones:** **L-015** (contar también las barras de Safari: los 427 px ya las restan), **L-010** (es una aproximación: el criterio CA-20 lo cumple solo la foto del iPhone), **L-020** (el tope de 5 líneas se mide en el límite y pasado el límite: la prueba de `screen.spec.ts` ya lo hace).
- **Terminado cuando:** `didactic-screen.spec.ts` y `screen.spec.ts` en verde; regresión del lote en verde; capturas del lote 3 (con las de la vista del teclado, §4).

### P-6 — Prueba de punta a punta en la versión publicada (esbozo 7)
- **Feature:** F-002, F-003 · **Casos:** TC-050, TC-053, TC-055 y TC-024 sobre la versión publicada; regresión de TC-001 y TC-002 publicadas.
- **Capa:** prueba de punta a punta. **No hay código de la app** (el coder no participa).
- **Qué es, en sencillo:** se repite el recorrido completo en la dirección publicada de verdad: abrir, ver dibujos y colores, escribir, ver los conteos, recargar y volver a 0, y comprobar que nada se pide a otro sitio. Las capturas quedan en la carpeta de VS-002, sin tocar las de VS-001.
- **Archivos:** el tester amplía `tests/e2e/published.spec.ts` (con la carpeta de evidencia ya cambiada en P-1):
  - **TC-050 publicada:** las 4 fichas con su imagen (`::before` con máscara `data:image/svg+xml`, 44 px) y su color en claro; captura `tc-050-imagenes-claro.png`; lo mismo en oscuro, captura `tc-051-imagenes-oscuro.png`.
  - **TC-053 publicada:** pegar `"¡Hola, 2026! \u{1F600}"` → `2/2/4/4`, imagen y color iguales que vacía; captura `tc-053-con-texto.png`.
  - **TC-055 publicada:** toda petición al origen de `E2E_BASE_URL`; ninguna lleva "casa"; `expectNothingStored`.
  - TC-001, TC-002 y TC-024 publicadas siguen (sus capturas ahora caen en la carpeta de VS-002).
- **Prueba que va primero:** el Manager corre `published.spec.ts` contra la preview **del último commit del lote 1** (colores, sin imágenes): TC-050 y TC-053 deben **fallar en la imagen** (`::before` sin máscara). Así se demuestra que la prueba detecta una app sin imágenes (L-021). Después la corre contra la preview del **commit que se va a aceptar**: verde. Dirección de cada preview: `vercel ls contapp -m githubCommitSha=<sha completo>` (L-026).
- **Lecciones:** L-021, L-026, L-006 (si la preview "falla", mirar primero `curl -sI`).
- **Terminado cuando:** `published.spec.ts` en verde sobre la preview del commit a aceptar y las capturas en `_project/slices/VS-002/evidence/published/`; `_project/slices/VS-001/evidence/published/` sin cambios (`git status` lo muestra).

### P-7 — Comprobación en el iPhone del usuario (esbozo 8)
- **Feature:** F-002, F-003 · **Casos:** TC-057, TC-061, TC-062 (manuales) y la medida de la frase de 50 de F-003 §5.5.
- **Capa:** prueba manual en el dispositivo.
- **Qué es, en sencillo:** usted abre la preview en su iPhone y hace una sola lista de comprobaciones (L-017), con foto de cada una. Es lo único que dice de verdad si los dibujos se reconocen y si el teclado deja ver los 4 grupos.
- **Archivos:** el Manager anota el resultado en `_project/slices/VS-002/evidence/iphone-manual.md` y guarda las fotos en `_project/slices/VS-002/evidence/` (nombres `p7-<punto>-<modo>.jpg`).
- **Configuración de referencia** (D-009, F-003 §2): Safari con la barra de dirección abajo, teclado de letras en español, corrector y sugerencias apagados; preview del commit a aceptar.
- **Lista (criterio escrito antes, PI-5):**
  1. **TC-057 — nombres tapados** (modo claro): tapar con los dedos o un papel los 4 nombres; ¿reconoce cada grupo solo por su dibujo y cree que un niño menor de 8 años lo reconocería? Sí / no por grupo; si alguno es no, se anota cuál y por qué (va al Manager como hallazgo). Foto.
  2. **TC-061 — teclado de letras, modo claro**, con el campo tocado: (a) vacío, (b) "pingüino", (c) "la casa" + salto de línea + "el sol", (d) la frase `el sol sale y la luna se va a dormir en su camita.` Por cada uno: ¿se ven completos los 4 grupos (dibujo, número y nombre) y la línea donde escribe, sin cerrar el teclado ni mover la pantalla? Foto de cada uno.
  3. **Medida de la frase de 50 (F-003 §5.5):** en la foto de (d), ¿la frase ocupa 2 líneas? Debe dar 17 / 20 / 0 / 1. Si ocupa 3, **no** se exige CA-20 con ella: el usuario escribe otra frase de 50 caracteres que ocupe 2 líneas, el Manager la cuenta (50 con los espacios) y repite (d) y el punto 4 con ella; la frase nueva se deja escrita en F-003 §5.5 (cambio de documento que registra el Manager con el designer).
  4. **TC-062 — teclado "123" y modo oscuro:** "pingüino" y la frase de 50 (la del punto 3): ¿se ven completos los 4 grupos y la línea donde escribe? Foto de cada uno.
  5. **Solo para saber, sin criterio:** (a) teclado de emojis abierto con "pingüino": ¿se ven los 4 grupos? (borde que espera); (b) con el teclado cerrado, la frase de 100 de `captures.spec.ts` (estado 4): foto, que es la evidencia para revisar A-001.
- **Terminado cuando:** puntos 1 a 4 con resultado y foto; punto 5 con foto. Si 2 o 4 falla (algún grupo tapado con hasta 2 líneas y 50 caracteres), es un bloqueante: vuelve como mini-lote (playbook: "en el último lote, un mini-lote"), con la foto como evidencia del rojo.

---

## 4. Lotes

| Lote | Pasos | Tester (trabajo A, antes del coder) | Coder | Capturas que escribe el tester (todos los estados vigentes) → coder las corre a `evidence/capturas/lote-N/` | E2E que el coder corre en su cierre (además de `npm run check` y `npm run test:unit`) | Riesgo |
|---|---|---|---|---|---|---|
| **1** | P-1, P-2 | DT-008 en `field-helpers.ts`, `typing.spec.ts`, `published.spec.ts` (+ carpeta de evidencia); `group-look.spec.ts` (TC-052); cambio de `screen.spec.ts:283-299` | `refactor(P-1)` (comentario), `feat(P-2)` (colores) | `captures.spec.ts` con los estados de `mockup-b.html`: 1 (vacío) a 390 × 844 y 320 × 568, 2 ("pingüino" con foco), **2b (frase de 50 con foco, nuevo)**, 3 ("¡Hola, 2026! 😀"), 4 (100 caracteres), tope de 5 líneas y **5 (320 × 568 con 100 "a", nuevo)**; todos en claro y oscuro | `group-look`, `screen`, `typing` (DT-008) y, por usar `field-helpers.ts`, `foreign-letters`, `max-length`, `round1` (= `npm run test:e2e` completo) | Alto por `src/main.ts` (comentario); si no, Normal |
| **2** | P-3, P-4 | `group-look.spec.ts` (+ TC-050, 051, 053 a 056); `didactic-screen.spec.ts` (TC-059, 060, 063, 064) | `feat(P-3)` (imágenes), `feat(P-4)` (320 px) | El mismo `captures.spec.ts` (ya tiene todos los estados; ahora salen con imagen). El tester comprueba que no falta ninguno | `group-look`, `didactic-screen`, `screen`, `foreign-letters`, `max-length` (rechazos con la imagen) | Bajo |
| **3** | P-5 | `didactic-screen.spec.ts` (+ TC-061 aproximación); cambio de `screen.spec.ts:180-228` | `feat(P-5)` (espacios) | `captures.spec.ts` + **estados 2 y 2b a 390 × 427** (lo que deja ver el teclado, aproximado) en claro y oscuro | `didactic-screen`, `screen`, `group-look`, `captures` (el tope de 5 líneas cambia de alto) | Bajo |
| **4** | P-6, P-7 | `published.spec.ts` (+ TC-050, 053, 055 publicadas) | — | — (las capturas de este lote las guarda `published.spec.ts` en `evidence/published/`) | — (el Manager corre `test:published`: rojo contra la preview del lote 1, verde contra la del commit a aceptar) | Bajo |

- **Tamaño:** ningún lote pasa de ~200 líneas de app. El más grande, el 2 (~30): 4 líneas largas de SVG, ~10 del `::before` y del `dd`, ~5 del ajuste de 320 px. La maqueta `mockup-b.html` (líneas 104-117) ya tiene ese CSS casi completo, compacto. **No hubo que partir ningún paso.**
- **Revisión visual del designer (trabajo C)** después de los lotes 1, 2 y 3, con su carpeta de capturas; en paralelo con el tester A del lote siguiente.
- **CI:** existe desde VS-001; el Manager sube la rama al cerrar cada lote y el siguiente no arranca con la CI en rojo.

---

## 5. Interfaces públicas (contrato del coder y del tester)

### 5.1 Pantalla — ruta `/` (única)
Lo de VS-001 (plan VS-001 §5.1) **sigue igual**: `app-title`, `text-field` y sus atributos, `count-grid` (`<dl>`), `count-card-<grupo>` con `<dt>` antes de `<dd data-testid="count-<grupo>">`, textos exactos, sin avisos, sin peticiones al escribir. Textos de pantalla **sin cambios** (F-003 §5.6): `Contapp` · `Escribe una palabra o frase` · `Vocales` · `Consonantes` · `Números` (con tilde) · `Otros`. Texto visible que comparan `expectNoNotice`, TC-001, TC-027 y TC-060: `Contapp Escribe una palabra o frase Vocales # Consonantes # Números # Otros #` (la imagen no agrega texto).

**Nuevo en VS-002:**

| Elemento | Cómo se lee en una prueba | Valor exacto |
|---|---|---|
| Clase de grupo de la ficha | `count-card-<grupo>` tiene las clases `count` y `count--<grupo>` | `count--vowel`, `count--consonant`, `count--digit`, `count--other` |
| Color del número | `toHaveCSS("color", …)` en `count-<grupo>` | ver tabla de colores |
| Borde de la ficha | `border-top-color` (y los otros 3 lados), `border-top-style`, `border-top-width` de `count-card-<grupo>` | color del grupo · `dashed` · `2px` |
| Fondo de la ficha | `background-color` de `count-card-<grupo>` | claro `rgb(238, 245, 238)` · oscuro `rgb(28, 46, 32)` (sin cambio) |
| Nombre | `color` del `dt` | claro `rgb(17, 34, 17)` · oscuro `rgb(245, 245, 238)` (sin cambio) |
| Fondo del campo (para el contraste) | `background-color` de `text-field` | claro `rgb(255, 255, 255)` · oscuro `rgb(28, 46, 32)` |
| Imagen del grupo (`GroupImage`) | `toHaveCSS(prop, valor, { pseudo: "before" })` sobre `count-<grupo>` | `width` y `height`: `44px` (con 360 px o más) · `32px` (menos de 360 px). `background-color`: el color del grupo. `mask-image` o `-webkit-mask-image` (el que WebKit reporte distinto de `none`): contiene `data:image/svg+xml`; distinto en cada grupo |
| Lugar de la imagen | caja de `count-<grupo>` | la imagen va a la izquierda del número, en la misma fila; el `dd` es `display: flex` y su separación (`column-gap`) es `8px` (menos de 360 px: `4px`) |
| Relleno de la ficha | `padding-*` de `count-card-<grupo>` | P-2 a P-4: arriba y abajo `12px`; desde P-5: `8px`. Lados: `8px` (menos de 360 px, desde P-4: `4px`) |
| Alto mínimo de la ficha | caja de `count-card-<grupo>` | ≥ `104px` |
| Texto del `dd` | `textContent` de `count-<grupo>` | solo cifras, `0` a `100` (la imagen no está en el texto) |
| Árbol accesible | `toMatchAriaSnapshot` de `count-grid` | 4 pares `term` / `definition`: `Vocales`/`0`, `Consonantes`/`0`, `Números`/`0`, `Otros`/`0`, nada más |

**Colores de los grupos** (`design-system.md` §2), tal como los devuelve el navegador:

| Grupo | Token | Claro | Oscuro |
|---|---|---|---|
| `vowel` | `--color-vowel` | `rgb(198, 40, 40)` (`#C62828`) | `rgb(255, 123, 114)` (`#FF7B72`) |
| `consonant` | `--color-consonant` | `rgb(21, 101, 192)` (`#1565C0`) | `rgb(130, 177, 255)` (`#82B1FF`) |
| `digit` | `--color-digit` | `rgb(168, 75, 0)` (`#A84B00`) | `rgb(255, 183, 77)` (`#FFB74D`) |
| `other` | `--color-other` | `rgb(123, 31, 162)` (`#7B1FA2`) | `rgb(206, 147, 216)` (`#CE93D8`) |

**Medidas de la pantalla desde P-5** (F-003 §5.3), con letra y alto de línea fijos (no dependen de la familia de la letra):

| Medida | Valor |
|---|---|
| Relleno de arriba de la pantalla (`.app`) | `8px` (antes 12) |
| Título → etiqueta (margen de abajo del h1) | `8px` (antes 16) |
| Etiqueta → campo | `8px` (sin cambio) |
| Relleno del campo | arriba y abajo `8px` (antes 12); lados `12px` |
| Alto del campo vacío (2 líneas) | ≈ `82,4px` (rango de prueba 80 a 85) |
| Tope del campo | 5 líneas: ≈ `82,4 + 3 × 31,2` ≈ `176px` |
| Campo → fichas (margen de arriba de `count-grid`) | `12px` (antes 20) |
| Separación entre fichas | `12px` (sin cambio) |
| Fin de la 2.ª fila de fichas, campo vacío o en 2 líneas | ≈ `395px` desde el inicio de la página; **la prueba exige ≤ 417px** |

**Comportamientos con tiempo:** ninguno nuevo. La imagen y el color no cambian con el conteo, con lo que se escribe ni con un rechazo (CA-14); no hay animaciones ni transiciones.

### 5.2 Funciones
Ninguna nueva ni cambiada. `countCharacters` (`src/counting.ts`) y `applyInput`, `textLength`, `MAX_TEXT_LENGTH` (`src/inputFilter.ts`) siguen como en el plan VS-001 §5.2.

### 5.3 Herramientas de prueba (lo que el tester puede leer)
- Proyectos de Playwright sin cambios: `iphone` (todo menos `published` y `captures`), `captures` (solo `captures.spec.ts`), `published` (solo `published.spec.ts`, contra `E2E_BASE_URL`). Todos con `devices["iPhone 13"]` (WebKit, 390 de ancho).
- **Nueva función compartida (P-1, la escribe el tester):** `export async function expectNothingStored(page: Page, context: BrowserContext): Promise<void>` en `tests/e2e/field-helpers.ts`: comprueba `localStorage` y `sessionStorage` vacíos (`"{}"`), `document.cookie` = `""`, `indexedDB.databases()` sin bases, `caches.keys()` sin cachés y `context.cookies()` = `[]`. La usan TC-024 (local y publicada) y TC-055.
- Evidencia de la prueba publicada: `_project/slices/VS-002/evidence/published/` (constante `EVIDENCE` de `published.spec.ts`).
- Capturas por lote: `npx playwright test --project=captures --output=_project/slices/VS-002/evidence/capturas/lote-N`.

---

## 6. Trazabilidad

| Caso | Paso(s) | Tipo | Quién lo escribe |
|---|---|---|---|
| TC-050 | P-3, P-6 | E2E | tester |
| TC-051 | P-3 (+ captura de `captures.spec.ts` y de P-6) | E2E + captura | tester |
| TC-052 | P-2 | E2E (+ revisión visual del designer) | tester |
| TC-053 | P-3, P-6 | E2E | tester |
| TC-054 | P-3 | E2E | tester |
| TC-055 | P-3 (control), P-6 | Integración (E2E, peticiones) | tester |
| TC-056 | P-3 (control) | E2E (árbol accesible) | tester |
| TC-057 | P-7 | Manual en el iPhone | usuario (anota el Manager) |
| TC-058 | P-1 a P-5 (regresión de cada lote), P-6 (TC-001, 002, 024 publicadas) | Unitaria + E2E | ya existen; el tester solo ajusta las que cambia el diseño (§7, R-1) |
| TC-059 | P-4 | E2E | tester |
| TC-060 | P-4 (control; era del paso 5 quitado) | E2E | tester |
| TC-061 | P-5 (aproximación automática, complemento), P-7 (criterio) | E2E + manual en el iPhone | tester + usuario |
| TC-062 | P-7 | Manual en el iPhone | usuario |
| TC-063 | P-4 | E2E | tester |
| TC-064 | P-4 | E2E | tester |
| DT-008 | P-1 | Refactor de pruebas (criterio escrito) | tester |
| DT-009 | P-1 | Comentario (criterio escrito) | coder |

Los 15 casos (TC-050 a TC-064) quedan cubiertos. Las restricciones duras que citan F-002 y F-003 quedan cubiertas como dice su trazabilidad (C-010 por TC-055; C-011 por TC-054; C-012 por TC-050, TC-053 y TC-061; C-013 por TC-050, TC-056 y TC-060; el resto por la regresión TC-058).

---

## 7. Riesgos y supuestos técnicos

| # | Riesgo o supuesto | Cómo se detecta / qué se hace |
|---|---|---|
| R-1 | **Pruebas de VS-001 que cambian** (lista final, sale del diseño aprobado): `screen.spec.ts:283-299` (color del número, P-2) y `screen.spec.ts:180-228` (alto del campo, P-5). Cambian por DT-008: `typing.spec.ts:136-145` y `published.spec.ts:136-145` (P-1). Cambia por la evidencia: `published.spec.ts:23` (P-1). Se reescribe por lote: `captures.spec.ts`. **No cambian** (comprobado leyendo el código): `field-helpers.ts:59-68` (`expectNoNotice`), `screen.spec.ts:39-80` (TC-001), `:82-127` (TC-026: el `::before` no es un elemento, la ficha sigue con `dt` y `dd` y el número arriba), `:129-152` (TC-031), `:246-281` (tamaños iguales), `typing.spec.ts:205-209` (TC-027), `published.spec.ts:53-65` y `:91-93`, `skeleton.spec.ts`, `round1.spec.ts` y las unitarias | Si otra prueba de VS-001 falla en un lote, el coder se detiene (no la toca) y el Manager decide con el tester |
| R-2 | El SVG escrito en el CSS con `<`, `>` y comillas simples sin codificar podría no dibujarse en algún Safari | Es la forma de la maqueta; TC-050 lo comprueba en WebKit y la foto de P-7 en el iPhone. Si falla, el coder codifica `<` `>` como `%3C` `%3E` sin cambiar el dibujo |
| R-3 | WebKit puede reportar la máscara solo en `-webkit-mask-image` (o solo en `mask-image`) | El contrato §5.1 acepta cualquiera de las dos que no sea `none`; el tester lo confirma en el rojo |
| R-4 | **La barra de herramientas de Vercel en las previews** podría cargar un script de `vercel.live` y romper TC-055 publicada (no lo pide la app sino la plataforma; en producción no aparece) | Se ve en el rojo de P-6. Si aparece, no se debilita la prueba: el usuario apaga la barra en las previews (§2.4) y se repite |
| R-5 | La aproximación de TC-061 (≤ 417 px) puede pasar en WebKit y fallar en el iPhone (otra letra, otra barra de Safari) | Es complemento, no reemplazo: el criterio es la foto de P-7 (L-010, L-015). Si la foto falla, mini-lote en el lote 4 |
| R-6 | La frase de 50 puede ocupar 3 líneas en el iPhone | Punto 3 de P-7: se cambia por otra de 50 que ocupe 2 (mandan las 2 líneas, F-003 §5.5) |
| R-7 | `--color-border` queda definido pero sin uso | Es lo que dice `design-system.md` §2 ("reservado"); no es código muerto de TypeScript (knip no lo mira) |
| R-8 | La revisión de cierre queda Alta solo por un comentario en `src/main.ts` | Pregunta 1 del reporte: bajarla a Normal con `git diff main...HEAD -- src/main.ts` como evidencia |
