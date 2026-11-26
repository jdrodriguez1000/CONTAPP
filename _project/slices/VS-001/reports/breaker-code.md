# Reporte del breaker-code — VS-001
**Fecha:** 2026-11-26

## Resumen
Encontré **6 hallazgos demostrados**, todos en `src/inputFilter.ts`, y **2 sospechas**. El más grave es **BRK-C-1**. Si se pegan solas las piezas "cedilla + signo de tecla" detrás de una "c" ya escrita, la "c" se vuelve una "ç" dentro de una tecla. Eso rompe dos restricciones duras: una letra de otro idioma entra (C-011) y una letra ya escrita cambia (C-015). La causa común de BRK-C-1, BRK-C-2 y BRK-C-3 es una sola: si un carácter tiene algo de emoji, entra completo sin revisar lo demás que trae (`inputFilter.ts:34`). BRK-C-5 muestra que el tope de 100 no limita el tamaño real del texto. Los cuatro ataques conocidos del coder se verificaron: el 1 queda en BRK-C-6, el 2 en BRK-C-2, y el 3 y el 4 quedan como sospechas.

## Hallazgos
| ID | Qué se rompe | Causa (archivo:línea) | Esperado vs. obtenido | Gravedad propuesta (Alta/Media/Baja) | Restricción o criterio afectado |
|---|---|---|---|---|---|
| BRK-C-1 | Con "c" escrita, pegar solo U+0327 (cedilla combinable) + U+20E3 (signo de tecla) convierte la "c" en "ç" con tecla. Pegar solo U+20E3 detrás de un "1" lo vuelve tecla "1⃣": pasa de Números a Otros | `src/inputFilter.ts:34`: se revisa `EMOJI` antes que la regla del signo suelto (`:29`, `STARTS_WITH_MARK`). `:6`: `\u{20E3}` cuenta como emoji aunque venga solo. Además, el texto final no se vuelve a pasar a NFC (`:77`) | Esperado: `{text:"c",cursor:1}` (el signo suelto no entra y no cambia lo escrito). Obtenido: `{text:"ç⃣",cursor:3}`, que se ve como ç⃣ y cuenta 0/0/0/1 en vez de 0/1/0/0. Con "1": esperado `"1"` (0/0/1/0), obtenido `"1⃣"` (0/0/0/1) | **Media**: rompe dos restricciones duras, pero exige pegar piezas Unicode muy raras | C-011, C-015 ("un signo de tilde pegado solo… nunca cambia una letra ya escrita"), plan §5.1 (texto en NFC) |
| BRK-C-2 | Una letra de otro idioma seguida de U+20E3 entra completa: "ç⃣", "α⃣", "ж⃣" (ataque 2 del coder, confirmado) | `src/inputFilter.ts:34` con `:6`. El carácter que trae U+20E3 sale antes de llegar a `isAllowed` (`:28`) | Esperado: el campo vacío `{text:"",cursor:0}`. Obtenido: `{text:"ç⃣",cursor:2}` (lo mismo con α y ж). Cuenta como 1 otro | **Media**: la letra ajena se ve en el campo | C-011, D-005 |
| BRK-C-3 | Un carácter "que se antepone" (Prepend) pegado delante de un emoji entra con él. U+0D4E es una letra malayalam; U+0600 es un invisible árabe (Cf) que debió quitarse | `src/inputFilter.ts:34`: el carácter entero (con lo que va antes del emoji) entra sin filtrar. El quitar invisibles (`:36`) no se aplica | Esperado: solo `😀` (`cursor:2`). Obtenido: `"ൎ😀"` y `"؀😀"` (`cursor:3`) | **Baja**: exige pegar caracteres muy raros | C-011, C-015 (los invisibles sueltos no entran) |
| BRK-C-4 | La "ſ" (s larga, U+017F, letra del latín antiguo) entra al escribirla o pegarla y cuenta como **otro** | `src/inputFilter.ts:11`: `SPANISH_LETTER` lleva la bandera `i` con `u`, que compara mayúsculas y minúsculas plegándolas: "ſ" se pliega a "s" y pasa. En `counting.ts:15-16` no está en `CONSONANTS`, así que cuenta como otro | Esperado: "casa" + ſ queda `"casa"`; pegar "caſa" queda `"caa"` con 2/1/0/0. Obtenido: `"casaſ"` y `"caſa"` | **Baja** | C-011, C-016 |
| BRK-C-5 | Un signo o un dígito con marcas de tilde encimadas entra como **1** carácter, sin límite de marcas. 100 "?" con 2 000 marcas cada uno dan un texto de **200 100** piezas que `textLength` cuenta como 100. Además, "1" + tilde combinable entra y deja de contar como número (pasa a otro) | `src/inputFilter.ts:29`: solo se rechaza el carácter que **empieza** por marca. `:23-25` y `:58`: el tope cuenta caracteres visibles, no su tamaño. `counting.ts:17`: `DIGIT` exige el dígito solo | Esperado: el tope de 100 acota lo que se ve, y "1́" no entra (es un signo de tilde pegado, C-015) o cuenta 1 número. Obtenido: `result.text.length` = 200100; `"1́"` entra y cuenta 0/0/0/1. Tiempo medido en Node: 210 ms para filtrarlo; en el iPhone, sin medir | **Media**: las marcas encimadas pueden tapar la pantalla, que es lo que A-001 protege. La regla para marcas sobre algo que no es letra **no está definida**: la decide el usuario | A-001, C-015, D-007 |
| BRK-C-6 | Con "casa", seleccionar "as" y pegar "aç" deja "casa" (vuelve la "s" seleccionada y se pierde la "a" válida). Ataque 1 del coder, confirmado | `src/inputFilter.ts:42-52`: `findNewStart` toma la "a" pegada como si fuera la de antes. Luego `:75` devuelve `previousText` porque "lo nuevo" (solo la ç) quedó vacío | Esperado: `{text:"caa",cursor:2}` (C-016: solo la letra ajena no entra). Obtenido: `{text:"casa",cursor:2}` | **Baja**: para el usuario se ve como un rechazo silencioso de todo | C-016 |

## Reproducciones
Todas se corrieron con `npx vitest run <archivo>` en esta carpeta (Vitest 5.0.3, entorno `node`). Los caracteres raros se arman con `String.fromCodePoint` (L-009). Resultado: **6 archivos, 13 pruebas, 13 en rojo**, incluidas las 2 de sospechas.

### BRK-C-1
`tests/unit/BRK-C-1-keycap-mark-changes-written-letter.test.ts`
```ts
import { describe, expect, it } from "vitest";
import { applyInput } from "../../src/inputFilter";
import { countCharacters } from "../../src/counting";

const cp = (...points: number[]) => String.fromCodePoint(...points);
const KEYCAP = cp(0x20e3); // combining enclosing keycap
const CEDILLA = cp(0x327); // combining cedilla

describe("BRK-C-1 — a pasted mark that carries the keycap sign changes a letter already written", () => {
  it("BRK-C-1 — pasting cedilla + keycap after 'c' must not turn it into a foreign letter", () => {
    // "c" was accepted; the user pastes the two combining pieces (C-015: a mark pasted alone does not get in).
    const result = applyInput("c", "c" + CEDILLA + KEYCAP, 3);
    expect(result).toEqual({ text: "c", cursor: 1 });
    expect(countCharacters(result.text)).toEqual({ vowel: 0, consonant: 1, digit: 0, other: 0 });
  });

  it("BRK-C-1 — pasting the keycap sign alone after '1' must not change the digit already written", () => {
    const result = applyInput("1", "1" + KEYCAP, 2);
    expect(result).toEqual({ text: "1", cursor: 1 });
    expect(countCharacters(result.text)).toEqual({ vowel: 0, consonant: 0, digit: 1, other: 0 });
  });
});
```
Salida:
```
× BRK-C-1 — pasting cedilla + keycap after 'c' must not turn it into a foreign letter
AssertionError: expected { text: 'ç⃣', cursor: 3 } to deeply equal { text: 'c', cursor: 1 }
× BRK-C-1 — pasting the keycap sign alone after '1' must not change the digit already written
AssertionError: expected { text: '1⃣', cursor: 2 } to deeply equal { text: '1', cursor: 1 }
```

### BRK-C-2
`tests/unit/BRK-C-2-foreign-letter-with-keycap-gets-in.test.ts`
```ts
import { describe, expect, it } from "vitest";
import { applyInput } from "../../src/inputFilter";

const cp = (...points: number[]) => String.fromCodePoint(...points);
const KEYCAP = cp(0x20e3);

describe("BRK-C-2 — a foreign letter followed by the keycap sign gets in (C-011)", () => {
  for (const [name, letter] of [
    ["c with cedilla", cp(0xe7)],
    ["greek alpha", cp(0x3b1)],
    ["cyrillic zhe", cp(0x436)],
  ] as const) {
    it(`BRK-C-2 — pasting ${name} + keycap into an empty field leaves it empty`, () => {
      const pasted = letter + KEYCAP;
      expect(applyInput("", pasted, pasted.length)).toEqual({ text: "", cursor: 0 });
    });
  }
});
```
Salida:
```
× pasting c with cedilla + keycap …  expected { text: 'ç⃣', cursor: 2 } to deeply equal { text: '', cursor: +0 }
× pasting greek alpha + keycap …     expected { text: 'α⃣', cursor: 2 } to deeply equal { text: '', cursor: +0 }
× pasting cyrillic zhe + keycap …    expected { text: 'ж⃣', cursor: 2 } to deeply equal { text: '', cursor: +0 }
```

### BRK-C-3
`tests/unit/BRK-C-3-prepend-letter-rides-on-emoji.test.ts`
```ts
import { describe, expect, it } from "vitest";
import { applyInput } from "../../src/inputFilter";

const cp = (...points: number[]) => String.fromCodePoint(...points);
const SMILE = cp(0x1f600);

describe("BRK-C-3 — a 'prepend' character glued before an emoji gets in with it", () => {
  it("BRK-C-3 — Malayalam dot reph (a foreign letter, U+0D4E) before an emoji: only the emoji gets in", () => {
    const pasted = cp(0xd4e) + SMILE;
    expect(applyInput("", pasted, pasted.length)).toEqual({ text: SMILE, cursor: SMILE.length });
  });

  it("BRK-C-3 — Arabic number sign (format character, U+0600) before an emoji: only the emoji gets in", () => {
    const pasted = cp(0x600) + SMILE;
    expect(applyInput("", pasted, pasted.length)).toEqual({ text: SMILE, cursor: SMILE.length });
  });
});
```
Salida:
```
× Malayalam dot reph …     expected { text: 'ൎ😀', cursor: 3 } to deeply equal { text: '😀', cursor: 2 }
× Arabic number sign …     expected { text: '؀😀', cursor: 3 } to deeply equal { text: '😀', cursor: 2 }
```

### BRK-C-4
`tests/unit/BRK-C-4-long-s-passes-case-insensitive-check.test.ts`
```ts
import { describe, expect, it } from "vitest";
import { applyInput } from "../../src/inputFilter";
import { countCharacters } from "../../src/counting";

const LONG_S = String.fromCodePoint(0x17f); // Latin small letter long s, not Spanish

describe("BRK-C-4 — the long s gets in because the Spanish-letter check ignores case", () => {
  it("BRK-C-4 — typing long s into 'casa' is rejected silently", () => {
    expect(applyInput("casa", "casa" + LONG_S, 5)).toEqual({ text: "casa", cursor: 4 });
  });

  it("BRK-C-4 — pasting 'ca' + long s + 'a' keeps 'caa' (C-016)", () => {
    const pasted = "ca" + LONG_S + "a";
    const result = applyInput("", pasted, pasted.length);
    expect(result.text).toBe("caa");
    expect(countCharacters(result.text)).toEqual({ vowel: 2, consonant: 1, digit: 0, other: 0 });
  });
});
```
Salida:
```
× typing long s into 'casa' …   expected { text: 'casaſ', cursor: 5 } to deeply equal { text: 'casa', cursor: 4 }
× pasting 'ca' + long s + 'a' … expected 'caſa' to be 'caa'
```
Nota: el signo Kelvin (U+212A) también pasa la comprobación, pero NFC lo convierte en una "K" normal. Eso está bien.

### BRK-C-5
`tests/unit/BRK-C-5-stacked-marks-escape-the-limit.test.ts`
```ts
import { describe, expect, it } from "vitest";
import { applyInput, MAX_TEXT_LENGTH, textLength } from "../../src/inputFilter";
import { countCharacters } from "../../src/counting";

const cp = (...points: number[]) => String.fromCodePoint(...points);
const ACUTE = cp(0x301);

describe("BRK-C-5 — a sign or digit carrying stacked accent marks gets in as 1 character", () => {
  it("BRK-C-5 — 100 question marks with 2000 marks each: the field is not limited to 100 characters", () => {
    const pasted = ("?" + ACUTE.repeat(2_000)).repeat(MAX_TEXT_LENGTH);
    const result = applyInput("", pasted, pasted.length);
    expect(textLength(result.text)).toBeLessThanOrEqual(MAX_TEXT_LENGTH); // passes: 100 "characters"
    // ...but it holds 200 100 pieces: the marks stack up and the 100 limit (A-001) no longer bounds the text.
    expect(result.text.length).toBeLessThanOrEqual(MAX_TEXT_LENGTH * 2);
  });

  it("BRK-C-5 — a digit with an accent mark glued on gets in and stops counting as a number", () => {
    const pasted = "1" + ACUTE;
    const result = applyInput("", pasted, pasted.length);
    expect(result).toEqual({ text: "", cursor: 0 }); // C-015: an accent mark pasted on its own does not get in
    expect(countCharacters(pasted)).toEqual({ vowel: 0, consonant: 0, digit: 1, other: 0 });
  });
});
```
Salida:
```
× 100 question marks with 2000 marks each …  AssertionError: expected 200100 to be less than or equal to 200
× a digit with an accent mark glued on …     expected { text: '1́', cursor: 2 } to deeply equal { text: '', cursor: +0 }
```
Nota: lo esperado en la segunda prueba es **una de las dos** opciones: que no entre, o que entre y cuente 1 número. La prueba exige la primera. Cuál vale lo decide el usuario. Lo que **sí** sale de una regla es que hoy un dígito cuenta como otro.

### BRK-C-6
`tests/unit/BRK-C-6-paste-over-selection-that-starts-the-same.test.ts`
```ts
import { describe, expect, it } from "vitest";
import { applyInput } from "../../src/inputFilter";

const C_CEDILLA = String.fromCodePoint(0xe7);

describe("BRK-C-6 — pasting over a selection something that starts like it", () => {
  it("BRK-C-6 — 'casa', select 'as', paste 'a' + c-cedilla: only the foreign letter is dropped (C-016)", () => {
    // The field after the paste: "c" + "a" + c-cedilla + "a", cursor after the cedilla (3).
    const result = applyInput("casa", "ca" + C_CEDILLA + "a", 3);
    expect(result).toEqual({ text: "caa", cursor: 2 });
  });
});
```
Salida:
```
× BRK-C-6 — 'casa', select 'as', paste 'a' + c-cedilla …
- "text": "caa",
+ "text": "casa",
```

## Sospechas sin confirmar
Las dos están en `tests/unit/BRK-C-probe.test.ts`. Ese nombre no sigue el patrón `BRK-C-X` porque mi guarda no me deja borrar ni renombrar archivos: era una sonda y la reutilicé.
```ts
import { describe, expect, it } from "vitest";
import { applyInput } from "../../src/inputFilter";
import { countCharacters } from "../../src/counting";

const cp = (...points: number[]) => String.fromCodePoint(...points);

// Suspicions, not findings: the expected result or the path in Safari is not proven.
describe("BRK-C suspicions", () => {
  it("suspicion A — a change that does not end at the cursor skips the filter", () => {
    // Field shows c-cedilla + "casa" with the cursor at 0 (e.g. after undo or a drop, unproven in Safari).
    expect(applyInput("casa", cp(0xe7) + "casa", 0)).toEqual({ text: "casa", cursor: 0 });
  });

  it("suspicion B — space + combining acute pasted together gets in and counts as other", () => {
    const result = applyInput("a", "a " + cp(0x301), 3);
    expect(result).toEqual({ text: "a ", cursor: 2 });
    expect(countCharacters("a " + cp(0x301))).toEqual({ vowel: 1, consonant: 0, digit: 0, other: 0 });
  });
});
```
Salida: A → `expected { text: 'çcasa', cursor: +0 } to deeply equal { text: 'casa', cursor: +0 }`. B → `expected { text: 'a ́', cursor: 3 } …`.

- **A. Ataque 4 del coder (un cambio que no termina en el cursor).** Si lo nuevo queda **antes** del cursor, `findNewStart` deja vacío "lo nuevo" (`inputFilter.ts:44-45`, `limit` negativo). Entonces `:68` lo toma como "se borró algo" y acepta `nextText` **sin filtro y sin tope**. La reproducción demuestra que la función deja entrar la "ç". **No demostré** que Safari llegue a ese estado con deshacer, rehacer, arrastrar y soltar o el corrector. Eso es del breaker-user. Si se puede llegar, este hallazgo sería el más grave: cualquier letra y cualquier largo entrarían.
- **B. Ataque 3 del coder (espacio + tilde combinable pegados juntos).** Entran y cuentan como 1 otro (el espacio deja de ser espacio para el conteo). Se ve como una tilde suelta "´", y C-015 dice que las tildes sueltas son "otros". Puede ser aceptable, pero C-015 también dice que "un signo de tilde pegado solo no entra". **La regla no define el caso**: lo decide el usuario.
- **Composición del teclado (R-3), `main.ts:41-46`.** Mientras `isComposing`, la pantalla cuenta el texto **sin filtrar** (`:43`). Si el teclado cancelara la composición sin disparar `compositionend`, o si un `input` final con `isComposing=false` llegara en otro orden en Safari, por un momento podrían contarse letras ajenas o más de 100. No se puede probar en Node.
- **Tiempo con pegados enormes.** Pegar 200 000 "a" tarda 67 ms en Node. Un texto de 200 100 piezas con marcas tarda 210 ms y queda dentro del campo: cada cambio posterior vuelve a recorrerlo entero. No medí el iPhone.

## Lo que revisé y resistió
> Con prueba ejecutada: "ç" + tono de piel (rechazada), el signo Kelvin (se vuelve "K"), el pegado de 200 000 caracteres (67 ms, queda en 100) y "casa" → seleccionar "sa" y pegar "s". Lo demás de esta lista lo **deduje leyendo el código** y las expresiones regulares, sin una prueba mía. Las pruebas del coder y del tester cubren buena parte (TC-038, TC-041, TC-021 a TC-030).

- `counting.ts` — vocales, consonantes, ñ, y y dígitos por grafema en NFC. `includes` sobre `VOWELS` y `CONSONANTS` no da falsos positivos: ningún grafema que pueda entrar es una pareja de letras. La "İ" turca no entra (no se pliega con `/iu`). Saltos `\r\n`, U+2028 y espacios especiales no se cuentan. U+0085, U+000B y U+000C se quitan como controles.
- `inputFilter.ts` — invisibles sueltos y en medio de letras (U+200B, U+2060, U+FEFF, U+00AD, etiquetas U+E00xx, U+0600 delante de una letra) se quitan. "ç" + tono de piel no entra. "à" en dos piezas no entra. El signo suelto detrás de una "a" ya escrita no entra (R-7). El signo Kelvin se vuelve "K".
- Tope de 100 con selecciones normales, pegado en medio, pegar sobre todo el texto cuando ya hay 100, y reemplazar una selección por su propio comienzo ("casa" → seleccionar "sa" y pegar "s" deja "cas").
- `findNewStart` nunca deja en "antes" algo que no esté ya aceptado: cada pieza se compara con el texto anterior.
- Rendimiento con pegado normal: 200 000 caracteres en 67 ms. `takeWhileItFits` corta en cuanto se llena.
- `main.ts` — el campo solo se reescribe si algo no entró, el cursor se pone con `setSelectionRange` y `acceptedText` se actualiza siempre.
- `index.html` — sin `maxlength`, con el corrector apagado y `autocomplete="off"`, así que el navegador no restaura el texto al volver.

## Lecciones propuestas
- **Un "pase libre" debe ser exacto.** Si una regla deja entrar algo completo cuando contiene X (aquí, un emoji), ese "contiene" se lleva consigo todo lo demás que venga pegado (letras, signos, invisibles). Conviene definir el pase libre por **lo que el carácter es en total**, no por una parte. Por qué: de ahí salen BRK-C-1, BRK-C-2 y BRK-C-3.
- **No usar la bandera `i` en una lista cerrada de letras.** Con `u`, la bandera `i` acepta letras que se pliegan a las de la lista ("ſ" → "s"). Es más seguro escribir las mayúsculas y las minúsculas una por una. Por qué: BRK-C-4.
- **Mi guarda no deja borrar ni renombrar** una sonda de exploración dentro de mi carpeta. Proponer un nombre fijo para las sondas (p. ej. `BRK-C-0-probe`) o pedir que el Manager las borre. → Herramienta

STATUS: DONE
