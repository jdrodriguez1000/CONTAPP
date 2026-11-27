# Ronda 1

# Reporte del breaker-code — VS-002
**Fecha:** 2026-11-27 · **Commit revisado:** `25ccf38` (rama `feature/VS-002-imagenes-ninos`, base `main`) · **Nivel:** Alto

## Resumen
2 hallazgos, los dos de gravedad **Baja** propuesta. El más relevante es **BRK-C-1**: al construir la app, el ajuste de pantalla angosta (`@media (max-width: 359px)`, del que dependen CA-21 y TC-059/063/064 a 320 px) se publica como `@media (width<=359px)`. Esa forma solo la lee Safari 16.4 o más nuevo (el objetivo que fija Vite 8). Los iPhone de 320 px de ancho de fábrica (SE de 1.ª generación) no pasan de iOS 15.8, así que en ellos no se aplica nada del ajuste. **BRK-C-2**: el comentario nuevo de DT-009 en `src/main.ts` sigue incompleto, porque hay un tercer caso en que el campo se reescribe. Las imágenes (máscara SVG), los colores, el contraste, las medidas de 320 a 430 px con "100" y la regresión del conteo resistieron.

**Cómo probé:** la guarda solo me deja correr `npx vitest run`. Para medir el CSS real, mis pruebas construyen la app **en memoria** con la API de Vite (`build({ build: { write: false } })`: no escriben `dist/`) y abren el resultado en **WebKit de Playwright como librería** desde Vitest (`page.setContent`, sin servidor ni puerto, así que no choco con el 4173 del breaker-user). Es código propio corriendo dentro de un comando permitido (L-037): lo digo para que el Manager lo sepa.

## Hallazgos
| ID | Qué se rompe | Causa (archivo:línea) | Esperado vs. obtenido | Gravedad propuesta (Alta/Media/Baja) | Restricción o criterio afectado |
|---|---|---|---|---|---|
| BRK-C-1 | El ajuste de 320 px se publica en una forma que Safari anterior a 16.4 no lee. Un navegador que no la entiende salta el bloque entero: la imagen queda de 44 px, el número de 48 px, el nombre de 20 px y la separación de 8 px. A 320 px, la columna de Vocales crece con "100" (ficha de 152,7 px en vez de 138), las dos columnas quedan desiguales y la página se desplaza 1 px a lo ancho | Fuente bien escrita en `src/styles.css:51` y `:186`. La reescritura la hace el minificador por defecto de Vite 8 (Lightning CSS) con `build.target` por defecto `baseline-widely-available` = `safari16.4`/`ios16.4`. No hay `vite.config.*` en el proyecto | Esperado: el CSS publicado contiene `max-width:359px` y a 320 px no hay desplazamiento horizontal. Obtenido: `@media (width<=359px){…}` (2 veces), y sin ese bloque `horizontalScroll: 1`, ficha de Vocales `[16, 168.7]` | Baja: solo afecta a iPhone con iOS ≤ 16.3. El iPhone de referencia (390 px) y los de 320 px con "Zoom de pantalla" (SE 2.ª/3.ª gen., mini) usan iOS moderno y no se ven afectados. Lo que está en juego es una decisión que falta: **desde qué iOS se soporta la app**. Hoy la fija Vite en silencio | CA-21 a 320 px (F-003), `design-system.md` §1.5 ("debe funcionar desde 320 px"), F-002 §2.6. **No** es el borde "letra real a 320 px" ni "menos de 320 px": es otra causa |
| BRK-C-2 | El comentario nuevo de DT-009 dice que el campo se reescribe **solo** cuando algo no entró o cuando se unió una letra en dos piezas (NFC). Pero el NFC también cambia un carácter de una pieza por otro: el signo Kelvin `U+212A` ("K") entra como la letra latina `K` (`U+004B`) y cuenta como consonante. El campo se reescribe sin que aplique ninguna de las dos razones del comentario | `src/main.ts:61-62` (el comentario). El comportamiento sale de `src/inputFilter.ts:93` (`added.normalize("NFC")`) y es de VS-001; no lo reporto como defecto de conteo | Esperado (según el comentario): con todo dentro y sin piezas, `result.text === typed`. Obtenido: `"oK"` (U+004B) en vez de `"oK"` (U+212A) | Baja: es la precisión de un comentario cuyo único propósito era ser preciso (DT-009). No cambia nada en la pantalla | DT-009 (VS-002 §2), plan P-1 (texto exacto del comentario) |

## Reproducciones
### BRK-C-1
Archivo: `tests/unit/BRK-C-1-narrow-rule-old-safari.test.ts` · Comando: `npx vitest run tests/unit/BRK-C-1-narrow-rule-old-safari.test.ts`

```ts
// BRK-C-1 (breaker-code, VS-002): the 320 px adjustment ships as "@media (width<=359px)".
// Vite 8 builds for Safari/iOS >= 16.4 (build.target "baseline-widely-available") and
// Lightning CSS rewrites "(max-width: 359px)" into the range syntax. A browser that does not
// understand that syntax drops the whole block, so nothing of the narrow-phone adjustment
// applies. The iPhones that are 320 px wide without "Display Zoom" (iPhone SE 1st gen)
// stop at iOS 15.8. Part 2 shows what such a browser gets at 320 px.
import { afterAll, beforeAll, expect, test } from "vitest";
import { build } from "vite";
import { webkit, devices, type Browser } from "@playwright/test";

type Chunk = { fileName: string; source?: unknown; code?: string };

let css = "";
let js = "";
let shellHtml = "";
let browser: Browser;

beforeAll(async () => {
  const out = await build({ logLevel: "silent", build: { write: false } });
  const files = (Array.isArray(out) ? out : [out]).flatMap((o) => (o as { output: Chunk[] }).output);
  const get = (ext: string) => files.find((f) => f.fileName.endsWith(ext))!;
  css = String(get(".css").source);
  js = get(".js").code!;
  shellHtml = String(get(".html").source)
    .replace(/<link rel="stylesheet"[^>]*>/, "")
    .replace(/<script type="module"[^>]*><\/script>/, "");
  browser = await webkit.launch();
}, 120_000);

afterAll(async () => {
  await browser?.close();
});

// What a browser that does not read the range syntax does: it skips the whole @media block.
function withoutRangeMediaBlocks(source: string): string {
  let result = source;
  for (;;) {
    const at = result.indexOf("@media (width<=");
    if (at === -1) return result;
    let depth = 0;
    let end = result.indexOf("{", at);
    for (; end < result.length; end++) {
      if (result[end] === "{") depth++;
      if (result[end] === "}" && --depth === 0) break;
    }
    result = result.slice(0, at) + result.slice(end + 1);
  }
}

function page320(styles: string) {
  return shellHtml
    .replace("</head>", () => `<style>${styles}</style></head>`)
    .replace("</body>", () => `<script type="module">${js}</script></body>`);
}

test("BRK-C-1 — el ajuste de 320 px se publica con una sintaxis que Safari anterior a 16.4 no lee", () => {
  // The source says "(max-width: 359px)" (src/styles.css:51 and :186), readable by any Safari.
  expect(css, "built CSS keeps the narrow-phone media query in the classic syntax").toContain(
    "max-width:359px",
  );
});

test("BRK-C-1 — sin ese bloque, a 320 px \"100\" con su imagen no cabe en la ficha", async () => {
  const context = await browser.newContext({
    ...devices["iPhone 13"],
    viewport: { width: 320, height: 568 },
  });
  const page = await context.newPage();
  await page.setContent(page320(withoutRangeMediaBlocks(css)));
  await page.getByTestId("text-field").focus();
  await page.keyboard.insertText("a".repeat(100));
  await expect.poll(() => page.getByTestId("count-vowel").textContent()).toBe("100");

  const result = await page.evaluate(() => {
    const card = document.querySelector('[data-testid="count-card-vowel"]')!;
    const dd = card.querySelector("dd")!;
    const dt = document.querySelector('[data-testid="count-card-consonant"] dt')!;
    const c = card.getBoundingClientRect();
    const d = dd.getBoundingClientRect();
    return {
      imageWidth: getComputedStyle(dd, "::before").width,
      ddInsideCard: d.left >= c.left && d.right <= c.right,
      ddOverflow: dd.scrollWidth - dd.clientWidth,
      consonantesOverflow: dt.scrollWidth - dt.clientWidth,
      horizontalScroll: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      card: [c.left, c.right],
      dd: [d.left, d.right],
    };
  });
  await context.close();

  console.log(JSON.stringify(result));
  // CA-21: at 320 px the 4 cards fit, with the number complete inside its card.
  expect(result.horizontalScroll, "horizontal scroll at 320 px").toBe(0);
  expect(result.ddInsideCard, `"100" + image inside the card: ${JSON.stringify(result)}`).toBe(true);
}, 120_000);
```

Salida (recortada; el CSS completo sale en la aserción):
```
 FAIL  BRK-C-1 — el ajuste de 320 px se publica con una sintaxis que Safari anterior a 16.4 no lee
AssertionError: built CSS keeps the narrow-phone media query in the classic syntax:
  expected ':root{--lightningcss-light:initial;--…' to contain 'max-width:359px'
  … @media (width<=359px){:root{--font-size-group:18px;--font-size-count:44px;--size-group-image:32px}} …
  … @media (width<=359px){.count{padding-left:var(--space-1);padding-right:var(--space-1)}.count dd{gap:var(--space-1)}}

stdout: {"imageWidth":"44px","ddInsideCard":true,"ddOverflow":0,"consonantesOverflow":0,"horizontalScroll":1,"card":[16,168.71875],"dd":[26,158.71875]}
 FAIL  BRK-C-1 — sin ese bloque, a 320 px "100" con su imagen no cabe en la ficha
AssertionError: horizontal scroll at 320 px: expected 1 to be +0 // Object.is equality
```

**Lo que demuestra y lo que no:**
- **Demostrado:** el CSS publicado trae la forma de rango (parte 1). Y lo que pasa a 320 px en un navegador que salta ese bloque (parte 2): la imagen queda de 44 px en vez de 32, la columna de Vocales se ensancha hasta 152,7 px para que quepa "100" (el número no se sale de su ficha, porque la cuadrícula `1fr 1fr` cede), las columnas quedan desiguales y aparece 1 px de desplazamiento horizontal.
- **No ejecutado:** no tengo un Safari 15 donde correrlo. Que Safari < 16.4 no lee `width<=` lo infiero de dos cosas: Vite 8 documenta su objetivo `['chrome111', 'edge111', 'firefox114', 'safari16.4', 'ios16.4']` (Context7, `/vitejs/vite/v8.3.5`, `build.target` y la migración "Safari 16.0 → 16.4"), y Lightning CSS solo escribe esa forma si todos los objetivos la entienden. La versión exacta de Safari no salió en la consulta a MDN (`/mdn/content`).
- La parte 2 corre con la letra de Windows, no con SF Pro (L-010): el 1 px puede ser más o menos en un iPhone real.
- **Viene de VS-001:** el primer bloque `@media` ya existía, así que la letra de 20 px en "Consonantes" ya dependía de él. VS-002 suma la imagen y la separación al mismo bloque.
- **Arreglos posibles (los decide el Manager con el usuario; no los aplico):** (a) decidir y escribir la versión mínima de iOS soportada (`D-XXX`). Si es ≥ 16.4, BRK-C-1 se cierra como "fuera de soporte" y basta anotarlo. (b) Si se quiere iOS 15, fijar `build.cssTarget` (p. ej. `safari15`) en un `vite.config.ts`. Eso es configuración de la cadena de entrega (riesgo Alto, tipo 7). Ojo: el JS también se transpila para 16.4.

### BRK-C-2
Archivo: `tests/unit/BRK-C-2-comment-dt009.test.ts` · Comando: `npx vitest run tests/unit/BRK-C-2-comment-dt009.test.ts`

```ts
// BRK-C-2 (breaker-code, VS-002): the new comment of src/main.ts:61-62 (DT-009) says the field
// is rewritten only when something did not get in or a two-piece letter was joined (NFC).
// The NFC of applyInput also swaps a one-piece character for another one: the Kelvin sign
// U+212A becomes the Latin "K" (U+004B), which gets in and is counted. The field is rewritten,
// nothing was left out and there were no two pieces.
import { expect, test } from "vitest";
import { applyInput } from "../../src/inputFilter";
import { countCharacters } from "../../src/counting";

const KELVIN = String.fromCodePoint(0x212a);

test("BRK-C-2 — el signo Kelvin entra como otra letra y el campo se reescribe sin que aplique ninguna de las dos razones del comentario", () => {
  const typed = "o" + KELVIN; // "oK" with the Kelvin sign, typed after "o"
  const result = applyInput("o", typed, typed.length);

  // Nothing was left out: the same number of characters got in...
  expect([...result.text].length).toBe([...typed].length);
  // ...and it is one single piece (no combining mark to join).
  expect(/\p{M}/u.test(typed)).toBe(false);
  // It is counted as a consonant.
  expect(countCharacters(result.text)).toEqual({ vowel: 1, consonant: 1, digit: 0, other: 0 });

  // What the comment promises in that case: the field is not rewritten.
  expect(result.text, "field rewritten (Kelvin sign -> K) for a reason the comment does not list").toBe(typed);
});
```

Salida:
```
 FAIL  tests/unit/BRK-C-2-comment-dt009.test.ts > BRK-C-2 — el signo Kelvin entra como otra letra y el campo se reescribe sin que aplique ninguna de las dos razones del comentario
AssertionError: field rewritten (Kelvin sign -> K) for a reason the comment does not list: expected 'oK' to be 'oK' // Object.is equality
Expected: "oK"
Received: "oK"
```
(Se ven iguales a propósito: la "K" que llega es U+004B y la que se escribió es U+212A.) Las tres primeras aserciones pasan, así que el rojo es exactamente el de la última, no un error de la prueba (L-035). Arreglo posible: que el comentario diga "…or NFC turned what came in into its standard form (a letter in two pieces joined into one, a sign like Kelvin into its letter)". Lo decide el Manager.

## Sospechas sin confirmar
- **Safari viejo y el atajo `-webkit-mask` con `center / contain`:** en un iOS muy anterior a 16.4 no sé si el atajo con prefijo acepta posición y tamaño. Si no los acepta, el dibujo saldría repetido o recortado. No pude ejecutarlo, y depende de la misma decisión de versión mínima de BRK-C-1.
- **El minificador repite `-webkit-mask`:** el CSS publicado trae `-webkit-mask:…;-webkit-mask:…;mask:…`. Es inofensivo en WebKit (mis medidas y la foto del iPhone lo muestran). Lo anoto solo porque el CSS publicado no es el que se revisa en `src/styles.css`.
- **Signo Kelvin como consonante (comportamiento de VS-001, fuera de esta slice):** "K" (U+212A) cuenta como consonante porque el NFC lo vuelve "K". Me parece razonable (para un niño es la misma letra), pero ninguna regla C-XXX lo dice. Lo dejo para que el usuario lo confirme si le importa. No es un hallazgo.

## Lo que revisé y resistió
Todo con la app **construida** (la misma que publica Vercel) y abierta en WebKit (`iPhone 13`), desde mi archivo de exploración `tests/unit/BRK-explore.test.ts` (pasa; mide y muestra).
- **Imágenes con `::before` y máscara SVG** (`src/styles.css:137-152`, `:175-183`). Las 4 máscaras **pintan un dibujo recortado**, no un cuadro lleno ni nada. Capturé el recuadro de 44 × 44 px de cada imagen y conté los píxeles. En claro: vowel 3.483 píxeles de su color frente a 13.317 de fondo de ficha, consonant 7.285/9.818, digit 6.058/10.826, other 6.032/10.812. En oscuro, los mismos conteos con los colores oscuros. Revisé los 4 SVG a mano: no tienen `#` ni `%`, todo queda dentro del `viewBox` de 48 (el trazo redondo de 5,5 de la mano llega a x = 4,25, la bandera de la boca a x = 47,6) y el minificador los copia sin cambios.
- **Colores y contraste:** el número y la imagen salen con el color exacto del token en claro y oscuro, en las 8 combinaciones de ancho y modo que medí. Recalculé a mano un valor de la tabla (`#C62828` sobre `#EEF5EE` = 5,07:1, la tabla dice 5,1:1). El resto lo calcula TC-052 con el color realmente pintado (verde, 14/14 según el tester).
- **Números de 3 cifras en las 4 fichas a la vez** (forcé "100" en las 4, más de lo que el tope permite), a 320, 340, 359, 360, 375, 390, 414 y 430 px, en claro y oscuro: `scroll` horizontal 0, cada `dd` dentro de su ficha, `dd` y "Consonantes" sin desborde. La regla de corte `max-width: 359px` cambia a 32 px justo en 359 y vuelve a 44 en 360 (el borde de 360 a 369 ya espera). En WebKit, a 360 px aún cabe: `dd` [29, 161] en una ficha [16, 174].
- **Orden de las reglas a 320 px** (L-041): el segundo `@media` va al final también en el CSS publicado (Lightning CSS no lo junta con el primero), así que el relleno de 4 px gana sobre el `padding: var(--space-2)` de `.count`.
- **Alto de la ficha:** con relleno de 8 px, el contenido mide ≈ 101 px a 390 y ≈ 94 a 320: manda `min-height: 104px`, sin saltos al pasar de 0 a 100 (`tabular-nums`).
- **Campo:** `max-height` = 5 × 31,2 + 16 + 4 = 176 px, igual a lo que pone `fitHeightToText` con 5 líneas (172 + 4). No hay salto de un píxel en el tope.
- **`src/main.ts`:** el diff es solo el comentario (2 líneas). Ninguna lógica cambió. `src/counting.ts` e `src/inputFilter.ts` no cambiaron (`git diff main...HEAD --stat`).
- **Regresión de VS-001:** con el JS construido, 100 "a" pegadas → `count-vowel` = 100 en todas las corridas. `expectNothingStored` es copia fiel de las dos que reemplaza (mismos 6 chequeos). Los rangos cambiados de `screen.spec.ts` (80-85 px y los colores nuevos) siguen las medidas del plan §5.1.
- **`index.html`:** solo se agregaron las clases `count--<grupo>`. Los `data-testid`, el orden `dt` → `dd` y los textos no cambiaron.

## Lecciones propuestas
- **El CSS que se revisa no es el que se publica:** el minificador de Vite 8 (Lightning CSS) reescribe `@media (max-width: …)` como `(width<=…)` y repite prefijos según `build.target`. Una regla que deba funcionar en un dispositivo concreto se comprueba en el CSS construido, y la versión mínima del navegador se decide y se escribe (`D-XXX`), no la fija Vite en silencio. — Por qué: BRK-C-1. La exigencia de 320 px apunta a iPhone que la configuración por defecto ya no soporta. → VEGU
- **Un breaker con solo Vitest puede medir la pantalla real:** `build({ build: { write: false } })` más `webkit.launch()` y `page.setContent` dentro de Vitest mide el CSS publicado sin servidor ni puerto, y sin escribir `dist/`. — Por qué: así trabajé en paralelo con el breaker-user sin tocar el 4173. Es un rodeo de la guarda (L-037) que conviene aprobar o cerrar a propósito. → VEGU

**Nota para el Manager:** dejé 3 archivos en mi carpeta de reproducciones: `tests/unit/BRK-C-1-narrow-rule-old-safari.test.ts` y `tests/unit/BRK-C-2-comment-dt009.test.ts` (rojos a propósito) y `tests/unit/BRK-explore.test.ts` (exploración, verde). Los tres entran en el `include` de `vitest.config.ts`: si esta carpeta corriera `npm run test:unit`, la suite saldría en rojo. No van a la rama; se borran con el worktree.

STATUS: DONE
