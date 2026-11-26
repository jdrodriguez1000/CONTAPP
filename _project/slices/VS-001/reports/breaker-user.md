# Reporte del breaker-user — VS-001
**Fecha:** 2026-11-26 · Commit `0b8c019` · Playwright WebKit con `devices["iPhone 13"]`, en Windows y contra el servidor local. **No probé en un iPhone real.**

## Resumen
Encontré **6 hallazgos** con reproducción automática; las 14 pruebas fallan. El más grave es **BRK-U-1**: al ir a otra página y volver atrás, el texto reaparece y las 4 fichas quedan en 0.
Le siguen **BRK-U-2** (tras un rechazo, "rehacer" mete la letra ajena y repite el texto) y **BRK-U-5** (pegar sobre una selección no reemplaza). Los otros 3 son huecos del filtro con entradas raras.
De las 4 ideas del coder, la 1, la 2 y la 3 quedan confirmadas (U-5, U-3 y U-4). De la 4, la parte de deshacer queda confirmada (U-2); arrastrar y soltar desde fuera quedó sin verificar.

## Hallazgos
| ID | Qué se rompe | Cómo reproducirlo | Esperado vs. obtenido | Gravedad propuesta | Restricción o criterio afectado | Evidencia |
|---|---|---|---|---|---|---|
| BRK-U-1 | Al volver atrás, los conteos no corresponden al texto | Escribir "casa 12" → ir a otra página en la misma pestaña → "atrás" | Esperado: vacío y 0/0/0/0, o el texto con 2/2/2/0. Obtenido: **"casa 12" con 0/0/0/0**. Los conteos se corrigen solo al cambiar el texto. Ocurrió en 6 de 6 variantes (`about:blank`, `data:` y otra ruta del mismo sitio, con `goto` o `location.assign`; las `data:` siempre con `goto`) | **Alta**: la pantalla le muestra al niño un conteo falso | CA-4, CA-7, CA-2 | `evidence/breaker-user/BRK-U-1-volver-atras.png` |
| BRK-U-2 | Después de un rechazo, deshacer y rehacer corrompen el texto | Escribir "casa" → escribir "ç" (se rechaza) → deshacer → rehacer | Esperado: sin "ç" y sin texto que nadie escribió. Obtenido: deshacer **no hace nada** y rehacer deja **"casacasacasaç"**, 6/6/0/1. Pasa igual al pegar "façade" y rehacer, y con `execCommand("redo")`. Con 60 o 90 "a" más una "ç" rechazada, rehacer llena hasta 100 e incluye la "ç" (el tope de 100 sí aguanta) | **Media**: exige deshacer o rehacer (en el iPhone, agitar o gesto de tres dedos; con teclado, ⌘Z) | CA-5, CA-8, C-009, C-011 | `BRK-U-2-rehacer.png` |
| BRK-U-5 | Pegar sobre una selección no reemplaza si lo pegado empieza igual que lo seleccionado y termina en algo rechazado | "casa" → seleccionar "as" → pegar "aç" | Esperado: "caa" (C-016: entra lo permitido). Obtenido: "casa". También: "casa" entera ← "caç" deja "casa" (esperado "ca"); "banana" ← "ban٣" deja "banana" (esperado "ban"); 100 "a" seleccionadas ← 10 "a" + "ç" deja las 100 (esperado 10). Sin rechazo al final, el reemplazo funciona ("casa" ← "ca" deja "ca") | **Media**: lo pegado permitido se comporta como si no hubiera entrado y queda el texto viejo | CA-5, C-016 | Salida de la prueba |
| BRK-U-3 | Una letra ajena o un número de otro alfabeto entra si lleva pegado U+20E3 | Pegar `ç` + U+20E3 (igual con `α`, `à` en dos piezas, `ж` y `٣`) | Esperado: no entra. Obtenido: entra y cuenta como **otro**. "faç⃣ade" se ve con la ç en pantalla. **Ojo:** la regla de §5.2 del plan ("un grafema con U+20E3 entra completo") lo permite al pie de la letra; choca con C-011 y CA-5 | **Baja**: U+20E3 casi no se puede escribir a mano | CA-5, C-011, C-015 | `BRK-U-3-letra-20e3.png` (la captura muestra "faç⃣ade α⃣ж⃣") |
| BRK-U-4 | Un acento combinable suelto entra si llega junto con un espacio | Con "casa", pegar espacio + U+0300 (igual con U+0327 y con U+00A0 + U+0300) | Esperado: el acento no entra. Obtenido: entra y suma 1 en **Otros**; en pantalla se ve un acento solo. Si el espacio se escribe primero y el acento se pega después, **sí** se rechaza | **Baja** | CA-5 ("letra o **acento** de otro idioma"), C-011; R-7 del plan | `BRK-U-4-espacio-tilde.png` |
| BRK-U-6 | La "s larga" `ſ` (U+017F), que no es del español, entra | Pegar U+017F | Esperado: no entra. Obtenido: entra y cuenta como **otro**. En un barrido de letras, marcas y dígitos Unicode (U+0020 a U+3FFFF, sin sustitutos, uso privado ni el plano de etiquetas), pegados uno a uno, las únicas entradas ajenas fueron U+017F, U+2139 (ℹ, que es emoji y está bien) y U+20E3 solo | **Baja**: carácter muy raro | CA-5, C-011 | Salida de la prueba |

Evidencia: las capturas están en `_project/slices/VS-001/evidence/breaker-user/` y las trazas de Playwright en su subcarpeta `run/`. Cada corrida reemplaza `run/`, así que ahí solo quedan las de la última.

**Alcance de BRK-U-1:** en el iPhone real, Safari puede restaurar la página completa (texto **y** conteos) en vez de solo el texto. No lo verifiqué. Conviene probarlo a mano: escribir, abrir un enlace o una dirección en la misma pestaña y tocar "atrás". Aunque los conteos vuelvan bien, habría que decidir si CA-7 ("al volver a abrir, vacío") cubre este caso.

**Alcance de BRK-U-2:** lo comparé con un `textarea` sin la app, en el mismo WebKit. Allí deshacer y rehacer funcionan bien. En la app también funcionan mientras no haya habido un rechazo o un filtrado. No verifiqué los gestos de deshacer del iPhone real.

## Reproducciones
Todas usan los ayudantes del tester (`tests/e2e/field-helpers.ts`). Se corren con `npx playwright test tests/e2e/BRK-U-<n> --project=iphone`.

### BRK-U-1 (`tests/e2e/BRK-U-1-back-navigation.spec.ts`)
```ts
import { expect, test } from "@playwright/test";
import { openApp, readCounts, type } from "./field-helpers";

test("BRK-U-1 — al volver atrás regresa el texto pero los 4 conteos quedan en 0", async ({ page }) => {
  const app = await openApp(page);
  await type(app, "casa 12");

  await page.goto("about:blank");
  await page.goBack();
  await expect(app.field).toBeVisible();
  await page.waitForTimeout(1000);

  await page.screenshot({ path: "_project/slices/VS-001/evidence/breaker-user/BRK-U-1-volver-atras.png" });
  const state = `${await app.field.inputValue()}|${await readCounts(page)}`;
  // Either empty and zeros (CA-7) or the text with its real counts (CA-4).
  expect(["|0/0/0/0", "casa 12|2/2/2/0"]).toContain(state);
});
```
Rojo leído: se recibió `casa 12|0/0/0/0`.

### BRK-U-2 (`tests/e2e/BRK-U-2-redo.spec.ts`)
```ts
import { expect, test } from "@playwright/test";
import { openApp, readCounts, type } from "./field-helpers";

const CEDILLA = "ç";

test("BRK-U-2 — tras un rechazo, deshacer y rehacer meten la letra ajena y repiten el texto", async ({ page }) => {
  const app = await openApp(page);
  await type(app, "casa");
  await type(app, CEDILLA); // rejected, as expected
  await expect(app.field).toHaveValue("casa");

  await page.keyboard.press("ControlOrMeta+z");
  await page.keyboard.press("ControlOrMeta+Shift+z");

  await page.screenshot({ path: "_project/slices/VS-001/evidence/breaker-user/BRK-U-2-rehacer.png" });
  expect.soft(await app.field.inputValue(), "field text").not.toContain(CEDILLA);
  expect.soft(await app.field.inputValue(), "nothing the user never wrote").toMatch(/^(casa|cas|ca|c)?$/);
  expect.soft(await readCounts(page), "others").toMatch(/\/0$/);
});
```
Rojo leído: se recibió `casacasacasaç` y `6/6/0/1`.

Dato para el coder (eventos `input` observados): deshacer llega como `historyUndo` con el texto igual. Rehacer llega como `historyRedo` con 14 unidades y el cursor en 9. La app lo deja en 13, así que el cambio **no termina en el cursor** y la "ç" queda fuera de lo que se revisa. Esta causa es una inferencia desde afuera; no leí el código.

### BRK-U-3 (`tests/e2e/BRK-U-3-keycap-bypass.spec.ts`)
```ts
import { expect, test } from "@playwright/test";
import { openApp, paste, readCounts } from "./field-helpers";

const KEYCAP = "⃣";

for (const [name, foreign] of [
  ["c con cedilla", "ç"],
  ["alfa griega", "α"],
  ["a grave en dos piezas", "à"],
  ["digito arabigo 3", "٣"],
]) {
  test(`BRK-U-3 — entra ${name} si lleva pegado U+20E3`, async ({ page }) => {
    const app = await openApp(page);
    await paste(app, foreign + KEYCAP);
    expect(await app.field.inputValue(), "field text").toBe("");
    expect(await readCounts(page)).toBe("0/0/0/0");
  });
}
```
Si se corrige, hay que conservar `1️⃣` (CA-10).

### BRK-U-4 (`tests/e2e/BRK-U-4-space-accent.spec.ts`)
```ts
import { expect, test } from "@playwright/test";
import { openApp, paste } from "./field-helpers";

for (const [name, blank, mark] of [
  ["espacio + acento grave", " ", "̀"],
  ["espacio + cedilla", " ", "̧"],
  ["espacio que no se parte + acento grave", " ", "̀"],
]) {
  test(`BRK-U-4 — un acento suelto entra y cuenta como otro: ${name}`, async ({ page }) => {
    const app = await openApp(page);
    await paste(app, "casa");
    await paste(app, blank + mark);
    await page.screenshot({ path: "_project/slices/VS-001/evidence/breaker-user/BRK-U-4-espacio-tilde.png" });
    expect(await app.field.inputValue(), "field text").not.toContain(mark);
    await expect(page.getByTestId("count-other")).toHaveText("0");
  });
}
```
La prueba no fija si el espacio debe entrar; solo exige que el acento no entre.

### BRK-U-5 (`tests/e2e/BRK-U-5-paste-over-selection.spec.ts`)
```ts
import { expect, test } from "@playwright/test";
import { openApp, paste, select } from "./field-helpers";

for (const [base, from, to, clip, expected] of [
  ["casa", 1, 3, "aç", "caa"],
  ["casa", 0, 4, "caç", "ca"],
  ["banana", 0, 6, "ban٣", "ban"],
  ["a".repeat(100), 0, 100, "a".repeat(10) + "ç", "a".repeat(10)],
] as [string, number, number, string, string][]) {
  test(`BRK-U-5 — pegar sobre una selección no reemplaza: ${base.slice(0, 8)} [${from},${to}]`, async ({ page }) => {
    const app = await openApp(page);
    await paste(app, base);
    await select(app, from, to);
    await paste(app, clip);
    expect(await app.field.inputValue(), "field text").toBe(expected);
  });
}
```

### BRK-U-6 (`tests/e2e/BRK-U-6-long-s.spec.ts`)
```ts
import { expect, test } from "@playwright/test";
import { openApp, paste, readCounts } from "./field-helpers";

test("BRK-U-6 — la s larga (U+017F), que no es del español, entra y cuenta como otro", async ({ page }) => {
  const app = await openApp(page);
  await paste(app, "ſ");
  expect(await app.field.inputValue(), "field text").toBe("");
  expect(await readCounts(page)).toBe("0/0/0/0");
});
```

## Sospechas sin confirmar
- **Un cambio que no termina en el cursor se salta el filtro y el tope.** Cambié el valor por código, dejé el cursor en 0 y disparé `input`: entraron "casaç" y 150 "a". Es un evento **simulado**. El único camino real que confirmé es rehacer (BRK-U-2). Podrían existir otros en el iPhone (dictado, autorrelleno, reemplazo de texto, "Escanear texto"), pero no los probé.
- **Composición del teclado (R-3):** con un `input` simulado con `isComposing: true` y sin `compositionend`, la "ç" se queda, incluso después de quitar el foco. WebKit de Playwright no permite una composición real. Probar en el iPhone.
- **Arrastrar y soltar desde fuera:** mi simulación no soltó nada, ni en la app ni en el `textarea` sin la app, así que no prueba nada.
- **Arrastrar dentro del campo:** al mover "abc" al final de "abc def" quedó "defabc", sin el espacio. Los conteos cuadraban. No lo comparé con un `textarea` sin la app (puede ser cosa del navegador).
- **`a` + U+200B + U+0300 pegado** deja la "a" sola. CA-9 dice "ni la 'a' sola" para la à en dos piezas, pero ninguna regla dice qué pasa con un invisible en medio. Es un caso muy artificial.
- **Un "carácter" puede ser enorme:** "." con 5.000 acentos, una cadena de 2.000 emojis unidos con U+200D o "x" con 5.000 U+20E3 cuentan 1 y ocupan 1 de los 100. No se colgó (menos de 100 ms en el computador). También "1" + U+0300 cuenta como **otro**, no como número. No hay una regla que defina estos casos.
- **Celular girado o cambio de ancho:** el alto del campo no cambió al pasar de 390 a 844 y a 320 px con texto, sin escribir nada. No confirmé que quedara texto oculto. El celular girado es de VS-002.

## Lo que intenté y resistió
- Pegar 10.000 y 100.000 "a" (entran 100), 100.000 "ç" (no entra nada) y 10.000 marcas sobre una "a": resistió, sin demoras notables.
- `<script>`, `<img onerror>`, comillas y `&amp;` pegados: se ven como texto, no se abre ningún diálogo y se cuentan como texto.
- Barrido de dígitos Unicode, pegados uno a uno: solo entran 0–9. Barrido de caracteres de formato invisibles (con las exclusiones de BRK-U-6): no entró ninguno solo.
- Invisibles y controles sueltos (U+3164, U+115F, U+180E, U+061C, U+180B, U+E0100, U+0000, U+0007, U+000B, U+000C, U+0085): no entran. Los caracteres de ancho completo, `ﬁ`, `𝐀`, `ı` y `Å` tampoco. El signo Kelvin (U+212A) se convierte en una "K" normal.
- Letra ajena + U+200D o U+FE0F, o con tono de piel: no entra. Letra ajena + U+200D + 😀: entra solo el emoji.
- Separadores de línea U+2028 y U+2029 y `\r\n`, solos o mezclados con "ç": la "ç" no entró y no se contaron.
- Un signo suelto pegado después de un espacio ya escrito: se rechaza.
- Pegar 150 "a" sobre 100 seleccionadas, y reemplazar selecciones con texto permitido: correcto.
- Copiar y pegar con el portapapeles del navegador hasta pasar de 100: se queda en 100.
- Deshacer y rehacer sin rechazos previos (escribir, pegar, cortar): los conteos siguen al texto.
- Recargar y abrir de nuevo desde un enlace: campo vacío y en 0.
- 320 × 568 y 390 × 664, en claro y oscuro, con 100 "W", 100 emojis, 100 saltos de línea, 100 símbolos muy anchos (U+FDFD) y 3.000 acentos sobre un punto: sin desplazamiento horizontal, fichas dentro de la pantalla y campo de 5 líneas como máximo. Solo revisé a ojo la captura de U+FDFD (`pantalla-320-simbolos.png`).

## Notas para el Manager
- `tests/e2e/BRK-U-0-probe*.spec.ts` son mis 4 sondas exploratorias. Solo imprimen resultados, **no son reproducciones** y no deben copiarse. No puedo borrarlas. Mientras estén en esta carpeta, `npm run test:e2e` aquí las incluye, junto con las reproducciones en rojo.
- No corrí la suite del tester ni la del coder. No cambié código de la app ni pruebas ajenas.

## Lecciones propuestas
- Cuando la app reescribe el valor de un campo, probar también deshacer y rehacer con el teclado y compararlo con un `textarea` sin la app — las pruebas de escribir y pegar no pasan por el historial del navegador.
- En una pantalla sin guardado, probar "ir a otra página y volver atrás", además de recargar. El navegador puede restaurar el campo sin avisarle a la app. Hacerlo **sin** `page.route`: con las páginas interceptadas, mi sonda no reprodujo la restauración.

STATUS: DONE
