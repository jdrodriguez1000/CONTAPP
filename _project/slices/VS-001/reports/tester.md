# Lote 1 — trabajo A — VS-001
**Fecha:** 2026-11-26

## Resumen
Escribí las 2 pruebas de aceptación del lote 1 (P-1 y P-2). **No se corrieron**: todavía no existen `package.json`, Playwright, `playwright.config.ts` ni código de la app (lo esperado, plan §3 P-1 y §4). Por eso las razones del rojo de abajo son **esperadas, no verificadas**. No hice commits.

## Cobertura
| Caso | Prueba (archivo) | Tipo | Restricción | Resultado (y razón del rojo en el trabajo A) |
|---|---|---|---|---|
| P-1 (sin TC propio) | `P-1: la página abre con el título Contapp` (`tests/e2e/skeleton.spec.ts`) | E2E, proyecto `iphone` | — | Sin correr. Rojo esperado: con el `index.html` sin título ni `h1` del `chore(P-1)`, falla `toHaveTitle("Contapp")` porque el título recibido está vacío |
| P-2 (sin TC propio) | `P-2: la dirección publicada abre con el título Contapp` (`tests/e2e/published.spec.ts`) | E2E, proyecto `published` | — | Sin correr. Rojo esperado: contra una dirección que aún no publica la app, falla `toHaveTitle("Contapp")` porque la página recibida tiene otro título (p. ej. el de error de Vercel) o ninguno |

**Qué comprueba cada una** (las dos, lo mismo, con coincidencia exacta):
1. El título de la pestaña es `Contapp`.
2. El elemento `data-testid="app-title"` dice `Contapp`.
3. `<html lang>` es `es-CO`.

- `skeleton.spec.ts` usa el servidor local del proyecto `iphone`; `published.spec.ts`, la `baseURL` del proyecto `published` (`E2E_BASE_URL`).
- `published.spec.ts` comprueba primero que `E2E_BASE_URL` exista. Si falta, **falla** con el mensaje `E2E_BASE_URL must hold the published address` (no se salta, para que no parezca que pasó). Ese fallo **no** vale como rojo de P-2.
- Las assertions van en orden y la prueba se detiene en la primera que falla: en el rojo solo se verá la del título.
- Si el rojo muestra otra cosa (error de configuración, de importación, servidor que no arranca o error de navegación por DNS), **no** es el rojo esperado.
- Sin secretos ni cabecera de bypass: las previews quedan sin protección (opción B).
- No hay casos `TC-XXX` ni restricciones duras en este lote. TC-001, TC-002 y TC-024 se agregan a `published.spec.ts` en el lote 5. No hay capturas: la pantalla del diseño empieza en el lote 2. No hay archivo `*-later`.

## Resultados de la ejecución
- Pruebas del coder: no aplica (aún no hay)
- Pruebas del tester: 0 en verde / 0 en rojo (2 escritas, sin correr)
- Por qué no se corrieron: no hay dependencias instaladas ni configuración de Playwright; las crea el coder en `chore(P-1)` y `chore(P-2)`. Tampoco hay dirección publicada.
- Regresión: la CI (llega en el lote 5)
- Evidencia: ninguna en este trabajo

## Fallos
Ninguno (no hubo ejecución).

## Preguntas para el usuario o el Manager
No bloquean el lote.
- **Correr solo el archivo en P-1.** El filtro que hace que `iphone` ignore `published.spec.ts` llega en P-2. Hasta entonces, `npm run test:e2e` también tomaría esa prueba y fallaría sin `E2E_BASE_URL`. Recomendación: en P-1 usar `npx playwright test tests/e2e/skeleton.spec.ts --project=iphone` (ya es el "Terminado cuando" de P-1) y correr `test:e2e` completo solo después de `chore(P-2)`.
- **Qué dirección usar en el rojo de P-2.** El plan pide correrla con la dirección de la preview antes de que Vercel publique la rama, pero esa dirección podría no conocerse todavía en ese momento. Recomendación: usar la dirección del proyecto en Vercel justo después de importar el repositorio, mientras `main` aún no tiene la app (R-9), y anotar en el rojo qué dirección se usó y qué mostró. No verifiqué cómo responde Vercel en ese estado.

## Fallo sin explicar
Ninguno.

## Lecciones propuestas
Ninguna.

STATUS: DONE

# Lote 2 — trabajo A — VS-001
**Fecha:** 2026-11-26

## Resumen
Escribí las pruebas de aceptación de P-3 (10 E2E), el archivo de capturas (6) y 25 unitarias de P-4. `screen.spec.ts` está en rojo: **10 de 10 fallan** porque no existen el campo ni las fichas. **`npm run check` no se corrió** (mi guarda lo bloquea) y las unitarias y las capturas no se han ejecutado. No hice commits.

## Archivos
- Nuevo: `tests/e2e/screen.spec.ts`
- Nuevo: `tests/e2e/captures.spec.ts`
- Nuevo: `tests/unit/counting.test.ts`
- No toqué `playwright.config.ts`. No hay archivo `*-later`.

## Cobertura
| Caso | Prueba (archivo) | Tipo | Restricción | Resultado (y razón del rojo en el trabajo A) |
|---|---|---|---|---|
| TC-001 | `al abrir: campo vacío, los 4 grupos en 0 y sin pantalla de cuenta` (`screen.spec.ts`). También: sin foco, el campo es el único control, texto visible exacto, sin avisos ni diálogos | E2E | C-010, C-012 | Rojo: `text-field` no existe |
| TC-026 | `los grupos se llaman exactamente…` (`screen.spec.ts`). También: orden, `dl`, `dt` antes que `dd`, número arriba, cuadrícula 2 × 2, orden título → etiqueta → campo → fichas | E2E | C-013 | Rojo: hay 0 `dt` en `count-grid` |
| TC-031 | `el campo apaga corrector y sugerencias…`: atributos de §5.1; sin `placeholder`, `maxlength`, `readonly` ni `disabled`; tocar la etiqueta activa el campo | E2E | C-009, D-009 | Rojo: `text-field` no existe |
| TC-031 | `escribir "cas" y un espacio deja el texto igual, "cas "` | E2E | C-009, D-009 | Rojo: `text-field` no existe |
| TC-031 | `el texto del campo es solo lo escrito, con mayúsculas tal cual y salto de línea` | E2E | C-009, A-001 | Rojo: `text-field` no existe |
| P-3 (diseño §5.3) | `el campo empieza en 2 líneas, crece hasta 5, luego se desplaza por dentro y vuelve a encoger` (1 a 6 y 20 líneas) | E2E, borde | — | Rojo: `text-field` no existe |
| P-3 | `el campo también crece letra por letra…, sin desplazamiento horizontal` (una palabra de 60 letras) | E2E, borde | — | Rojo: `text-field` no existe |
| P-3 | `a 390 px las 4 fichas caben…` (tamaños de letra, ficha de al menos 104 px, sin desplazamiento horizontal) | E2E | — | Rojo: `text-field` no existe |
| P-3 | `a 320 px las 4 fichas caben…` | E2E, borde | — | Rojo: `text-field` no existe |
| P-3 | `los colores siguen el modo claro u oscuro del celular` (color del número y fondo de la ficha) | E2E | D-010 | Rojo: `count-vowel` no existe |
| TC-004 a TC-009 | `counting.test.ts`; incluye todas las vocales y todas las consonantes en minúscula y mayúscula | Unitaria | C-001 a C-005 | **Sin correr** (Vitest y `src/counting.ts` llegan en P-4) |
| TC-032, TC-039 (conteo) | `counting.test.ts`, con letras en dos piezas | Unitaria | C-014 | **Sin correr.** El **largo** queda para el lote 4 (`textLength` es de P-8) |
| Capturas | `captures.spec.ts`: estado 1 a 390 × 844 y 320 × 568, y estado 4 (solo crecimiento) a 390 × 844; todo en claro y oscuro | Capturas | — | **Sin ejecutar.** Solo `--list`: carga y lista 6 pruebas |

## Resultados de la ejecución
- Pruebas del coder: no aplica
- Pruebas del tester: 0 en verde / 10 en rojo (`screen.spec.ts`); 25 unitarias y 6 capturas escritas, sin ejecutar
- **Controles:** ninguno. No pasó ninguna prueba en el rojo.
- Regresión: la CI (llega en el lote 5)
- Evidencia: ninguna guardada en `evidence/`

**Salida del rojo** (`npx playwright test tests/e2e/screen.spec.ts --project=iphone`): `Running 10 tests using 1 worker` … `10 failed`. La app compiló y el servidor local respondió. Razones:
- TC-001, TC-031 (los 3) y las 4 pruebas P-3 de crecimiento y ancho: `getByTestId('text-field')` → `element(s) not found`.
- TC-026: `getByTestId('count-grid').locator('dt')` → esperaba los 4 nombres y recibió `Array []`.
- P-3 de colores: `getByTestId('count-vowel')` → `element(s) not found`.

En la primera corrida, dos pruebas de TC-031 que escriben en el campo fallaban por tiempo agotado (30 s). Les agregué `toBeVisible()` antes de escribir. Después repetí por separado esas dos y las dos de crecimiento: las 4 fallan con `element(s) not found`. No repetí las 10 juntas después de ese cambio.

**Límite del rojo:** cada prueba se detiene en su primera comprobación. Las siguientes (medidas, colores, orden) no se han probado contra una pantalla real. Si alguna falla con P-3 construido, la clasifico como defecto o como error de mi prueba.

## Fallos
Ningún defecto: los 10 rojos son los esperados.

## Notas para el Manager y el coder
- **Pendiente del Manager: correr `npm run check`.** No está en mi lista de comandos, así que no puedo afirmar que typecheck y lint pasen con los 3 archivos nuevos. Recomendación: correrlo antes de entregar el paquete al coder.
- **`@ts-ignore` en `counting.test.ts`:** `tsconfig.json` incluye `tests/`, y hasta P-4 no existen `vitest` ni `src/counting.ts`. Para que `npm run check` pueda quedar en verde al cerrar P-3, silencié solo esas dos líneas de `import` (con su `eslint-disable`). No está verificado. Puedo quitarlo en una ronda después de P-4. Después de `chore(P-4)`, correr `npm run test:unit`.
- **Rojo de P-4:** con el esqueleto de `countCharacters` que devuelve todo en 0, las 25 unitarias deberían fallar en la aserción. Es lo esperado, no verificado.
- **Hasta que exista el proyecto `captures` (P-3)**, `iphone` también toma `captures.spec.ts`, y `npm run test:e2e` lo correría. El plan ya pide que el coder lo ignore en `iphone`.
- **Tamaño de las capturas:** el archivo fija el tamaño de pantalla (390 × 844 y 320 × 568) en vez de usar el del dispositivo. Entiendo que el área visible de `devices["iPhone 13"]` es más baja que 844 (no lo verifiqué aquí). Las imágenes se guardan con `testInfo.outputPath(...)`.
- **Lotes siguientes:** después de escribir, `screen.spec.ts` no exige conteos, así que sigue sirviendo cuando la app cuente. Las capturas del estado 4 tampoco exigen conteos.
- TC-001 exige que el campo sea el único control. Cuando llegue el botón de VS-005, habrá que actualizarlo.

## Preguntas para el usuario o el Manager
Ninguna que bloquee.

## Fallo sin explicar
Ninguno.

## Lecciones propuestas
- Complemento de L-002 (Herramienta): al escribir un archivo con la herramienta de archivos, los `́` quedaron convertidos en el carácter real. Conviene armar las letras en dos piezas con `String.fromCharCode(0x0301)` y revisar después con una búsqueda de `\p{Mn}` — así lo detecté y lo corregí; la búsqueda final en `tests/` no encontró ninguna.
- Si el tester debe dejar `npm run check` en verde o comprobarlo, hay que agregar ese comando a su guarda; hoy no puede verificar el typecheck ni el lint de sus propias pruebas.

STATUS: DONE

# Lote 3 — trabajo A — VS-001
**Fecha:** 2026-11-26

## Resumen
Escribí `tests/e2e/typing.spec.ts` (7 E2E para P-6), agregué los estados 2 y 3 a las capturas y quité los dos `@ts-ignore`. Rojo esperado: **4 fallan** (TC-002 y TC-003, porque los conteos siguen en 0) y **3 controles pasan** (TC-024, TC-025, TC-027). Unitarias en verde (45 de 45). **`npm run check` no se corrió:** mi guarda lo bloqueó (L-012). No hice commits.

## Archivos
- Nuevo: `tests/e2e/typing.spec.ts`
- Modificado: `tests/e2e/captures.spec.ts` (estados 2 y 3, en claro y oscuro, a 390 × 844; actualicé el comentario del estado 4)
- Modificado: `tests/unit/counting.test.ts` (sin los 2 `@ts-ignore`, sus `eslint-disable` ni el comentario que los explicaba; los casos no cambian)
- No escribí las unitarias de P-5 (son del coder). No hay archivo `*-later`.

## Cobertura
| Caso | Prueba (archivo) | Tipo | Restricción | Resultado (y razón del rojo en el trabajo A) |
|---|---|---|---|---|
| TC-002 | `escribir "casa" letra por letra…` (`typing.spec.ts`) | E2E | C-001 | **Rojo:** tras "c" esperaba `0/1/0/0` y recibió `0/0/0/0` |
| TC-002 (CA-2, pegar) | `pegar una frase, o reemplazarla…` (`typing.spec.ts`) | E2E, borde | C-006, C-007, C-008 | **Rojo:** esperaba `2/2/4/4` y recibió `0/0/0/0` |
| TC-003 | `borrar una letra de "casa"…` (`typing.spec.ts`) | E2E | C-012 | **Rojo:** con "casa" esperaba `2/2/0/0` y recibió `0/0/0/0` |
| TC-003 (borde) | `al borrar hasta dejar solo espacios y saltos de línea…` (`typing.spec.ts`) | E2E, borde | C-012, C-008 | **Rojo:** con `"  \na"` esperaba `1/0/0/0` y recibió `0/0/0/0` |
| TC-024 | `escribir "casa" y recargar…` (`typing.spec.ts`) | E2E | C-010 | **Control, pasa** |
| TC-025 | `no sale ninguna petición…` (`typing.spec.ts`) | Integración | C-010 | **Control, pasa** |
| TC-027 | `escribir "cas" y esperar…` (`typing.spec.ts`) | E2E | C-009 | **Control, pasa** (única espera fija: 2 s) |
| Capturas, estado 2 | `estado-2-escribiendo-390x844-{claro,oscuro}.png`: "pingüino" con foco, exige 4/4/0/0 | Capturas | — | **Rojo (2):** Vocales esperaba "4" y recibió "0" |
| Capturas, estado 3 | `estado-3-con-texto-390x844-{claro,oscuro}.png`: "¡Hola, 2026! 😀" sin foco, exige 2/2/4/4 | Capturas | — | **Rojo (2):** Vocales esperaba "2" y recibió "0" |

**Cómo se comprueba "al instante" (§5.1).** Los conteos se leen una sola vez, sin reintentos. Además, la primera prueba de TC-002 guarda los 4 números al terminar cada evento de cambio y exige `0/1/0/0 → 1/1/0/0 → 1/2/0/0 → 2/2/0/0`. Una actualización con demora fallaría. La prueba usa el evento `input` del campo, que se propaga hasta la ventana.

**Controles: por qué pasan y qué no prueban.**
- **TC-024:** hoy no hay nada que guardar y los conteos nunca salen de 0. Comprueba que tras recargar, y en otra pestaña, el campo queda vacío y en 0. También que, con "casa" escrita, `localStorage`, `sessionStorage`, las cookies, IndexedDB y las cachés están vacíos. **No prueba** que los conteos *vuelvan* a 0: como pide el plan, no exige conteos antes de recargar (que suben lo prueba TC-002). Tampoco prueba cerrar y reabrir Safari en el iPhone.
- **TC-025:** la app aún no envía nada. El espía no está sordo: la prueba exige que haya visto las peticiones de la carga. Exige **cero peticiones** al escribir y quitar el foco (§5.1), la misma dirección de página, ningún WebSocket y que ninguna petición, incluida la recarga, lleve "casa" en la URL, el cuerpo o las cabeceras. **No prueba** un envío codificado, uno parcial ("cas") durante la recarga, ni uno programado para mucho después.
- **TC-027:** la app aún no toca el texto. Comprueba que tras 2 s sigue "cas", sin palabra propuesta, aviso ni lista de sugerencias en la página. **No prueba** el corrector real del teclado del iPhone: eso es la lista manual de P-10.

Los tres deben seguir en verde después de P-6.

## Resultados de la ejecución
- Pruebas del coder: 20 en verde / 0 en rojo (por diferencia: 45 unitarias menos mis 25)
- Pruebas del tester:
  - `npx playwright test tests/e2e/typing.spec.ts --project=iphone`: **3 en verde / 4 en rojo**
  - `npm run test:unit`: **45 de 45 en verde** (2 archivos), ya sin los `@ts-ignore`
  - `npx playwright test --project=captures --reporter=line`: **6 en verde / 4 en rojo**. Pasan los estados 1 y el crecimiento del campo. Fallan solo los estados 2 y 3, por los conteos en 0. La corrí sin `--output`, así que no creé nada en `evidence/`
- **`npm run check`: sin verificar.** Se intentó una vez y la guarda respondió `comando no permitido para este agente`. Una búsqueda en `tests/` de `ts-ignore`, `eslint-disable` y marcas sueltas (`\p{Mn}`) no encontró nada; eso no reemplaza la revisión de tipos y lint.
- No corrí `screen.spec.ts` (no lo cambié).
- Regresión: la CI (llega en el lote 5)
- Evidencia: ninguna en este trabajo. Las imágenes de `evidence/capturas/lote-3/` se generan después del coder con `npx playwright test --project=captures --output=_project/slices/VS-001/evidence/capturas/lote-3`

## Fallos
Ningún defecto. Hubo un **error de mi prueba**, ya corregido. En la primera corrida TC-027 falló (5 rojas y 2 verdes) porque su texto esperado ponía el número antes del nombre. La página entrega primero el nombre, como pide §5.1 (`dt` antes de `dd`). Corregí el texto esperado y repetí el archivo completo: 4 rojas y 3 verdes.

## Notas para el Manager y el coder
- **Pendiente del Manager (L-012):** correr `npm run check` antes del commit en rojo.
- Agregué una prueba de pegar bajo TC-002 y otra de "solo espacios" bajo TC-003, por CA-2 ("escribe o pega") y CA-3. Las dos quedan en verde solo con P-5 y P-6 completos.
- Las capturas del estado 4 siguen mostrando solo el crecimiento y no exigen conteos. El estado 4 completo es del lote 4.
- El estado 2 de la maqueta dibuja el teclado abierto. La captura simulada solo muestra el foco, sin teclado.

## Preguntas para el usuario o el Manager
Ninguna.

## Fallo sin explicar
Ninguno.

## Lecciones propuestas
Ninguna nueva.

STATUS: DONE

# Lote 4 — trabajo A — VS-001
**Fecha:** 2026-11-26

## Resumen
Escribí `foreign-letters.spec.ts` (32 E2E, P-7) y `max-length.spec.ts` (20 E2E, P-8), y puse en las capturas el estado 4 completo y el tope de 5 líneas. Rojo: **26 de 32** y **17 de 20** fallan porque hoy todo entra, o porque la letra en dos piezas queda en dos piezas. Los **9 controles** pasan, y las **12 capturas** también. **`npm run check` no se corrió** (L-012). No hice commits.

## Archivos (los 4 van en el commit en rojo)
- Nuevo: `tests/e2e/foreign-letters.spec.ts`
- Nuevo: `tests/e2e/max-length.spec.ts`
- Nuevo: `tests/e2e/field-helpers.ts`: ayudantes que comparten los dos archivos anteriores; no tiene pruebas propias
- Modificado: `tests/e2e/captures.spec.ts`
- No toqué la configuración ni las unitarias. No hay archivo `*-later`.

## Qué comprueba un rechazo (D-005, D-007)
`expectRejected` exige, leyendo una sola vez y sin reintentos:
- El mismo texto, el mismo cursor y los mismos 4 conteos.
- Los mismos colores, bordes, contorno, sombra, opacidad, animación y transformación del campo y de las fichas (sin marca de límite).
- Ningún aviso: el texto visible es solo título, etiqueta, nombres y números; no hay roles de aviso ni `aria-live`; el campo es el único control; no se abre ningún diálogo.

Las pruebas en las que algo entra, entero o en parte, exigen el texto exacto, los conteos, la ausencia de aviso y, casi todas, la posición del cursor.

## Cobertura
"Rojo n/n" = fallan n de las n pruebas del caso. Los conteos van como vocal/consonante/número/otro.

| Caso | Prueba (archivo) | Tipo | Restricción | Resultado (y razón del rojo en el trabajo A) |
|---|---|---|---|---|
| TC-016 | `foreign-letters`: "ç" y "Ç" en campo vacío; después "a" sí entra | E2E | C-011, D-005 | **Rojo 1/1:** el campo recibió "ç" |
| TC-017 | `foreign-letters`: à â ö ß α ж; bordes: mayúsculas, Ω, Ж, 中, A de ancho completo; cursor al inicio y en medio | E2E, borde | C-011, D-005 | **Rojo 3/3:** "casaà", "casaÀ", "çcasa" |
| TC-018 | `foreign-letters`: pegar "ç" y varias letras ajenas; borde: pegar sobre una selección | E2E, borde | C-011, D-005 | **Rojo 2/2:** "casaç"; sobre la selección quedó "cça" |
| TC-019 | `foreign-letters`: "ñÑáÉíÓúüÜ" (7/2/0/0); alfabeto completo en minúscula y mayúscula | E2E | C-001, C-002, C-011 | **Control, pasan 2/2** |
| TC-029 | `foreign-letters`: "façade" en vacío y en medio de "casa" (cursor 7); texto mezclado con signos, dígitos, emoji, tabulación y salto | E2E, borde | C-011, C-016 | **Rojo 3/3:** la "ç" y las demás letras ajenas entraron |
| TC-033 | `foreign-letters`: "canción" en dos piezas; á é í ó ú ü ñ en dos piezas, en minúscula y mayúscula | E2E, borde | C-014 | **Rojo 2/2:** el texto quedó en dos piezas (no NFC) |
| TC-035 | `foreign-letters`: escribir "^"; pegar ´ ¨ \` ^ ² ½ ª º 1️⃣ (9 otros) | E2E, borde | C-007, C-011, C-015 | **Control, pasan 2/2** |
| TC-036 | `foreign-letters`: "٣"; "a٣b" → "ab"; borde: dígito devanagari y de ancho completo | E2E, borde | C-006, C-011, C-015 | **Rojo 3/3:** los dígitos entraron |
| TC-038 | `foreign-letters`: "ca" + U+200B + "sa"; U+200B, U+200D, U+2060, U+FEFF, U+00AD y U+FE0F solos y en medio | E2E, borde | C-015 | **Rojo 7/7:** el invisible entró |
| TC-038 | `foreign-letters`: familia, bandera, tono de piel y corazón completos; tabulación, salto y espacio que no se parte | E2E, borde | C-007, C-008, C-015 | **Control, pasan 2/2** |
| TC-040 | `foreign-letters`: "niño" en dos piezas | E2E | C-002, C-014 | **Rojo 1/1:** quedó en dos piezas |
| TC-041 | `foreign-letters`: "à" en dos piezas; "càsa" → "csa"; "ç", "ê" y "á" + grave; signo suelto (R-7) | E2E, borde | C-011, C-014, C-016 | **Rojo 4/4:** entraron enteros |
| TC-020 | `max-length`: 99 "a" + escribir "b" | E2E | A-001 | **Control, pasa** |
| TC-021 | `max-length`: el 101 escrito; espacio, Enter, dígito, emoji, tabulación y palabra; en las posiciones 0, 50 y 99; borrar uno y volver a llenar | E2E, borde | A-001, D-007 | **Rojo 4/4:** el carácter de más entró |
| TC-021 | `max-length`: con 100, reemplazar un carácter seleccionado | E2E, borde | A-001 | **Control, pasa** |
| TC-022 | `max-length`: pegar 150; pegar 101 distinguibles (entra el comienzo); lo rechazado no ocupa lugar | E2E, borde | A-001, D-007, C-016 | **Rojo 3/3:** entró todo |
| TC-022 | `max-length`: pegar exactamente 100 | E2E, borde | A-001 | **Control, pasa** |
| TC-023 | `max-length`: 99 + familia, y "b" no entra; 100 familias y no la 101; 99 + dos banderas | E2E, borde | A-001, C-007, D-007 | **Rojo 3/3:** entraron la "b", la familia 101 y la 2.ª bandera |
| TC-028 | `max-length`: "a " hasta 99 + espacio, y "b" no entra; lo mismo con salto de línea y tabulación | E2E, borde | A-001, D-007 | **Rojo 3/3:** la "b" entró |
| TC-030 | `max-length`: 98 + "xyz" en medio (cursor 51); 100 + "xyz" sobre 2 seleccionados | E2E, borde | A-001, D-007 | **Rojo 2/2:** entró también la "z" |
| TC-042 | `max-length`: 99 + "ñ" en dos piezas, y "b" no entra; 101 "á" en dos piezas → 100 | E2E, borde | A-001, C-014, D-007 | **Rojo 2/2:** el texto quedó en dos piezas (ver nota) |
| Capturas, estado 4 | `estado-4-limite-100-390x844-{claro,oscuro}.png`: frase de 100, sin foco, 35/40/3/3, nada oculto en el campo | Capturas | A-001, D-007 | **Control, pasan 2/2** |
| Capturas, tope (hallazgo 3 del designer, lote 2) | `estado-4-tope-5-lineas-390x844-{claro,oscuro}.png`: 8 líneas (7 saltos), 16/18/0/0, mismo alto que con 5 líneas y desplazamiento por dentro | Capturas | — | **Control, pasan 2/2** |

**Nota sobre TC-042.** El plan espera el rojo en la "b" final. Hoy falla antes, en la forma NFC, porque tampoco existe P-7. Con P-7 hecho y sin P-8, la prueba principal debe fallar en la "b" (esperado, no verificado).

**Límite del rojo.** Cada prueba se detiene en su primer fallo. Lo que viene después no se ha ejercitado contra el filtro. La lectura del aspecto antes del intento sí corre, y la comprobación de "ningún aviso" corre en los controles.

**Cambio en las capturas.** La captura `estado-4-crecimiento` pasó a ser `estado-4-limite-100`: la misma frase, ahora con conteos, foco y "nada oculto" exigidos. En la captura del tope en claro, que revisé, se ven 5 líneas desde la primera y el borde de la sexta. No abrí las otras.

## Resultados de la ejecución
- Pruebas del coder: no corrí las unitarias (no las cambié)
- Pruebas del tester:
  - `npx playwright test tests/e2e/foreign-letters.spec.ts --project=iphone`: **6 en verde / 26 en rojo**
  - `npx playwright test tests/e2e/max-length.spec.ts --project=iphone`: **3 en verde / 17 en rojo**
  - `npx playwright test --project=captures` (sin `--output`): **12 en verde / 0 en rojo**
- La salida de las corridas completas se cortaba, así que repetí por grupos con `--grep` para leer las razones. Todas son aserciones sobre el texto del campo; en lo que leí no hubo errores de configuración, de selectores ni tiempos agotados. No repetí `max-length` en los grupos TC-020 y TC-028, ni en las primeras pruebas de TC-021: esas razones salen de la corrida completa.
- `npm run check`: **sin verificar** (mi guarda no lo permite)
- No corrí `screen.spec.ts` ni `typing.spec.ts` (no los cambié)
- Búsqueda de marcas e invisibles reales en `tests/e2e/` (`\p{Mn}`, `\p{Cf}`, `\p{Me}`): una sola coincidencia, el 1️⃣ del nombre de una prueba de TC-035
- Regresión: la CI (llega en el lote 5)
- Evidencia: ninguna en `evidence/`. Para el designer, después del coder: `npx playwright test --project=captures --output=_project/slices/VS-001/evidence/capturas/lote-4`

## Fallos
Ningún defecto: los 43 rojos son los esperados antes de P-7 y P-8.

## Notas para el Manager y el coder
- **Pendiente del Manager (L-012):** correr `npm run check` antes del commit en rojo.
- **No cubierto por E2E:**
  - La composición del teclado (`isComposing` / `compositionend`, R-3): `insertText` y `pressSequentially` no la reproducen. Queda para la lista manual de P-10 y como idea de ataque para los breakers.
  - La vibración, y un aviso que apareciera con demora.
  - Un destello que durara menos que la comprobación.
- **TC-032 y TC-039 (largo):** el plan §6 los asigna al coder como unitarias, y el paquete no me los pidió. En el lote 2 anoté que el largo quedaba para el lote 4: no agregué unitarias mías. Las E2E de TC-042 cubren el largo de letras en dos piezas, pero solo con "ñ" y "á".

## Preguntas para el usuario o el Manager
No bloquean el lote.
- **Pegar algo rechazado sobre una parte seleccionada.** El plan §5.1 dice que `selectionStart` y `selectionEnd` quedan como antes del intento. En §5.2, `applyInput` devuelve un solo `cursor` ("donde empezaba lo nuevo"), así que la selección no se podría conservar. En el texto y los conteos coinciden: nada cambia. La prueba de TC-018 con selección comprueba solo texto, conteos y que no haya aviso, **no la selección**. Recomendación: aceptar el cursor sin selección donde empezaba lo nuevo (§5.2) y precisar §5.1. Si el usuario prefiere conservar la selección, hay que cambiar la interfaz y agregar esa comprobación.

## Fallo sin explicar
Ninguno.

## Lecciones propuestas
- La salida de una corrida con muchos rojos se corta en la terminal del agente. Correr por grupos con `--grep` (sin `|`, que la guarda bloquea) permite leer la razón de cada fallo — así no se da por buena una razón que no se vio.

STATUS: DONE

# Lote 5 — trabajo A — VS-001
**Fecha:** 2026-11-26

## Resumen
Agregué TC-001, TC-002 y TC-024 a `tests/e2e/published.spec.ts`. La prueba P-2 no cambió; solo se agregaron las importaciones. **No corrí ninguna prueba contra ninguna dirección**, así que el rojo y el verde están sin verificar. **`npm run check` no se corrió** (mi guarda no lo permite, L-012): los tipos y el lint siguen sin verificar. **Ojo:** contra la preview del lote 1 no pasa lo que supone el paquete (ver "Rojo esperado"). No hice commits.

## Archivos
- Modificado: `tests/e2e/published.spec.ts` (usa `readCounts` y `expectNoNotice` de `field-helpers.ts`, que no cambió)

## Cobertura
Todas son E2E del proyecto `published` (iPhone 13, WebKit). Las tres exigen primero `E2E_BASE_URL`, respuesta **200**, que no haya redirección a otro sitio (p. ej. el inicio de sesión de Vercel, L-006) y el título `Contapp`. Los conteos van como vocal/consonante/número/otro.

| Caso | Qué prueba | Restricción | Resultado |
|---|---|---|---|
| TC-001 | Campo vacío y sin foco; `Vocales`, `Consonantes`, `Números` y `Otros` en ese orden, cada uno en `0`; h1 `Contapp`; etiqueta `Escribe una palabra o frase`; `es-CO`. Sin pantalla de cuenta: ruta `/`, sin contraseña, el campo es el único control y el texto visible es exactamente `Contapp Escribe una palabra o frase Vocales 0 Consonantes 0 Números 0 Otros 0`; sin avisos ni diálogos | C-010, C-012 | Sin correr |
| TC-002 | "casa" letra por letra, con una sola lectura y sin reintentos tras cada letra: `c` 0/1/0/0 → `ca` 1/1/0/0 → `cas` 1/2/0/0 → `casa` 2/2/0/0; sin avisos | C-001 | Sin correr |
| TC-024 | Escribe "casa"; comprueba que no quede nada en `localStorage`, `sessionStorage`, cookies, IndexedDB ni caché; recarga: campo vacío, los 4 en `0`, sin avisos. Abre otra pestaña: también vacía y en 0 | C-010 | Sin correr |

## Rojo esperado contra una app que no cuenta
Depende de **qué versión** se use. Esto es lo esperado según el plan y los títulos de los commits; **no está verificado**.

| Versión | P-2 | TC-001 | TC-002 | TC-024 |
|---|---|---|---|---|
| **Lote 1** (solo el título; plan P-1) | pasa | **falla**: no existe el campo | **falla**: no existe el campo | **falla**: no existe el campo |
| **Lote 2** (campo y 4 fichas en 0, sin conectar) | pasa | **puede pasar** | **falla** en `counts after "c"`: espera `0/1/0/0` y recibe `0/0/0/0` | **puede pasar** |

- **La preview del lote 1 no sirve como la demostración que pide P-10.** Ahí TC-002 falla porque no hay campo, no porque la app no cuente. La pantalla llegó en el lote 2 (`feat(P-3)`) y la conexión del conteo en el lote 3 (`feat(P-6)`).
- **Recomendación:** usar la dirección única de una publicación **del lote 2**: un commit desde `0dad16c` y anterior a `a8132ab`. No sé cuáles de esos commits tienen publicación en Vercel. No sirve la dirección de la rama, porque cambia con cada push.
- **El rojo que vale:** TC-002 pasa las comprobaciones de la pantalla inicial, escribe la "c", el campo la recibe y **falla en el conteo** (`counts after "c"`). Un fallo por estado HTTP, redirección, título, campo inexistente o `E2E_BASE_URL` ausente **no vale** como rojo.
- **Por qué TC-001 podría pasar ahí:** solo mira el estado inicial. Una app que no cuenta también muestra el campo vacío y los 4 en 0. Es un **control**.
- **Por qué TC-024 podría pasar ahí:** exige volver a vacío y a 0, y que no se guarde nada. En una app que no cuenta, los conteos nunca salen de 0 y al recargar el campo queda vacío. A propósito no exige conteos antes de recargar: eso lo prueba TC-002. Es un **control**. Por sí solo no demuestra que la app "volvió" a 0; esa demostración es TC-002 y TC-024 juntos en verde sobre el mismo commit.

## Capturas
En `_project/slices/VS-001/evidence/published/` (390 px de ancho, modo claro, solo la parte visible). También quedan adjuntas al reporte de Playwright.

| Archivo | Prueba | Qué debe verse |
|---|---|---|
| `tc-001-al-abrir.png` | TC-001 | Campo vacío y los 4 en 0 |
| `tc-002-casa.png` | TC-002 | "casa" y 2 / 2 / 0 / 0 |
| `tc-024-despues-de-recargar.png` | TC-024 | Campo vacío y los 4 en 0, ya recargada |

- P-2 no genera captura.
- Una captura solo se guarda si la prueba llega hasta ese punto.
- **El rojo también escribe en esa carpeta:** contra el lote 2, TC-001 y TC-024 podrían guardar sus capturas de la versión vieja. La ruta es fija y la corrida verde las sobrescribe. Corre el verde **de último**, y toma las capturas como evidencia solo si **las 4 pruebas pasan** en esa corrida. Si alguna falla, en la carpeta puede quedar una imagen de la corrida anterior.
- La carpeta es la misma con cualquier dirección. Las rutas son relativas a la raíz: corre el comando desde la carpeta de la slice.

## Resultados de la ejecución
- Pruebas del coder: no aplica (P-10 no tiene código de la app)
- Pruebas del tester: **0 corridas**
- `npx playwright test --list --project=published`: el archivo carga y lista **4 pruebas** (P-2, TC-001, TC-002, TC-024). No abre ninguna dirección ni revisa tipos
- `npm run check`: **sin verificar**
- Regresión: la CI (la verifica el Manager); este archivo solo corre con `npm run test:published`
- Evidencia: todavía ninguna; la genera la corrida del Manager

## Fallos
Ninguno: no hubo corridas.

## Notas para el Manager
- **Antes del commit:** correr `npm run check` (L-012).
- **Comandos:** `E2E_BASE_URL=<dirección> npm run test:published`. Antes, `curl -sI <dirección>` (L-006).
- **Riesgo de entorno, sin verificar:** si la preview de Vercel inyectara su barra de herramientas o guardara cookies o datos propios, TC-001 (un solo control) o TC-024 (nada guardado) fallarían por la plataforma. P-2 no comprobaba ninguna de las dos cosas. Si pasa, hay que ver qué se encontró antes de clasificarlo como defecto.
- TC-031 en el iPhone real no está en este archivo: sigue en la lista manual de P-10.

## Preguntas para el usuario o el Manager
No bloquean la escritura.
- **¿Contra qué versión se corre el rojo?** El plan (§3, P-10) dice "preview del lote 1 (que no cuenta)", pero esa versión no tiene pantalla. Recomendación: usar una publicación del lote 2 y precisarlo en el plan o en la evidencia. Si no hay ninguna disponible, correr contra el lote 1 y anotar que ese rojo solo demuestra que la prueba detecta una app sin pantalla de conteo, **no** una pantalla que no cuenta.

## Fallo sin explicar
Ninguno.

## Lecciones propuestas
- Para el rojo de una prueba publicada, elegir la versión por **lo que muestra** (la pantalla completa sin el comportamiento) y no por el número de lote — si la pantalla no existe, la prueba falla antes de llegar a lo que quiere demostrar. → VEGU

STATUS: DONE

# Ronda 1 — trabajo A — VS-001
**Fecha:** 2026-11-26

## Resumen
Escribí las pruebas de TC-043 a TC-049 contra el commit `01cdb43`. Rojo: **33 de 40 E2E** y **32 de 50 unitarias** fallan porque la app todavía no cumple la regla. Las otras 7 E2E y 18 unitarias son **controles** que ya pasan, y lo dicen en su nombre. **`npm run check` no se corrió** (mi guarda lo bloqueó, L-012). No hice commits.

## Archivos (van en el commit en rojo)
- Nuevo: `tests/e2e/round1.spec.ts` (40 pruebas; usa `field-helpers.ts`, que no cambió)
- Nuevo: `tests/unit/round1.test.ts` (50 pruebas; usa `applyInput`, `textLength` y `countCharacters`, plan §5.2)
- No cambié pruebas anteriores, ayudantes ni configuración. No hay archivo `*-later`.
- No hay capturas: la ronda no cambia el diseño de la pantalla.

## Cobertura
Los conteos van como vocal/consonante/número/otro. "Rojo n/m" = fallan n de las m pruebas.

| Caso | Prueba (archivo) | Tipo | Restricción | Resultado (y razón del rojo en el trabajo A) |
|---|---|---|---|---|
| TC-043 | `e2e/round1`: "casa 12", salir en la misma pestaña (abriendo otra dirección o desde la propia página) y "atrás": vacío, 0/0/0/0, sin aviso; después "sol" cuenta 1/2/0/0 | E2E | C-010, D-017 | **Rojo 2/2:** vuelve el texto "casa 12" |
| TC-044 | `e2e/round1`: "casa" + "ç" rechazada, deshacer y rehacer (con teclado y con la orden de edición). Después de cada acción solo se admiten comienzos de "casa" con sus conteos; al final "casa" 2/2/0/0 | E2E | C-009, C-011 | **Rojo 2/2:** al rehacer queda `casacasacasaç`, 6/6/0/1 |
| TC-044, borde | 3 veces deshacer y 5 rehacer: nunca "ç" ni texto repetido (no fija el texto final) | E2E | C-009, C-011 | **Rojo 2/2:** mismo estado |
| TC-044, "façade" | Pegar "façade", deshacer y rehacer: solo vacío o "faade"; al final "faade" 3/2/0/0 | E2E | C-009, C-016 | **Rojo 2/2:** `faadefaadefaçade`, 9/6/0/1 |
| TC-044, controles | Pegar "façade" y rehacer **sin deshacer** (2). Deshacer y rehacer funcionan en un campo sin la app, con las dos formas (1) | E2E | — | **Control, pasan 3/3** |
| TC-045 | ç, α, ж, ٣ y "à" en dos piezas, con U+20E3 y con U+FE0F + U+20E3, en campo vacío y tras "casa" | E2E | C-011, C-015 | **Rojo 10/10:** entran enteros |
| TC-045 | "c" + pegar U+0327 U+20E3; "1" + pegar U+20E3; "a" + ç⃣ + "b" → "ab" | E2E | C-011, C-015, C-016 | **Rojo 3/3:** `ç⃣`, `1⃣`, `aç⃣b` |
| TC-045 | U+0D4E o U+0600 delante de 😀: entra solo el emoji | E2E | C-011, C-015 | **Rojo 2/2:** el carácter de adelante entra |
| TC-045, control | 1️⃣ entra como 1 otro | E2E | CA-10 | **Control, pasa 1/1** |
| TC-045 | `unit/round1`: los casos de arriba, también en "a" + U+20E3. U+20E3 sobre "?", un espacio, "1" con el signo dos veces y 1️⃣ + tilde: queda solo la base. U+0D4E y U+0600 delante de cara, familia y bandera | Unitaria | C-011, C-015, C-016 | **Rojo 19/19:** el texto aceptado trae lo que no debe |
| TC-045, controles | Tecla con 0, 1 (con y sin U+FE0F), 9, # y *; cara, familia y bandera solas | Unitaria | CA-10 | **Control, pasan 7/7** |
| TC-046 | Escribir "ſ" tras "casa"; pegar "caſa" → "caa" | E2E + unitaria | C-011, C-016 | **Rojo 2/2 E2E y 2/2 unitarias:** la "ſ" entra |
| TC-046, controles | "ſ" con punto arriba, "İ" e "ı" no entran | Unitaria | C-011 | **Control, pasan 3/3** |
| TC-047 | "as" ← "aç" → "caa"; "casa" ← "caç" → "ca"; "banana" ← "ban٣" → "ban"; 100 ← 10 "a" + "ç". La E2E exige también el cursor y que no haya aviso | E2E + unitaria | C-016 | **Rojo 4/4 E2E y 4/4 unitarias:** queda el texto viejo |
| TC-047, control | "casa" entera ← "casaç": queda "casa", cursor en 4 y sin selección | E2E | C-016 | **Control, pasa 1/1** |
| TC-048 | "casa" + (espacio + U+0300, espacio + U+0327, U+00A0 + U+0300, espacio + 3 tildes): entra solo el blanco, 2/2/0/0 | E2E + unitaria | C-015, D-018 | **Rojo 4/4 E2E y 4/4 unitarias:** la tilde entra |
| TC-048, controles | Tabulación o salto de línea + U+0300 | E2E + unitaria | C-015 | **Control, pasan 2/2 E2E y 2/2 unitarias** |
| TC-049 | "1" + U+0301 → "1"; "?" + 2.000 → "?" (largo 1); 100 × ("?" + 2.000) → 100 "?" | Unitaria | A-001, C-015, D-018 | **Rojo 3/3:** las tildes entran (con 100 signos, 200.100 unidades) |
| TC-049, controles | "a" + U+0301 → "á" (el que pide F-001). Tildes pegadas después de un "1", "?" o espacio ya escritos (3). Letra con dos tildes: no entra nada (2) | Unitaria | C-014, D-018 | **Control, pasan 6/6** |

## Resultados de la ejecución
- Pruebas del coder: no las corrí (no las cambié)
- Pruebas del tester:
  - `npx playwright test tests/e2e/round1.spec.ts --project=iphone`: **7 en verde / 33 en rojo**
  - `npx vitest run tests/unit/round1.test.ts`: **18 en verde / 32 en rojo**
- **`npm run check`: sin verificar.** Lo intenté una vez y la guarda respondió `comando no permitido para este agente`. Los tipos y el lint de los dos archivos nuevos los tiene que revisar el Manager.
- **Razones del rojo:** la salida completa se corta, así que repetí por grupos. En lo leído, los rojos son comparaciones de texto o de estados que la app produce; no vi errores de importación, de selectores ni tiempos agotados. No leí una por una las unitarias de TC-045 sobre letra + U+20E3 (leí las primeras), TC-048 ni TC-049: de esas vi parte de las diferencias en las corridas completas y la lista de pruebas en rojo.
- Después de las corridas por grupos agregué "control" a algunos nombres. Las dos corridas completas finales: la E2E ya tiene los nombres nuevos, y la unitaria también.
- Búsqueda de marcas, invisibles, U+00A0 y "ſ" reales en los archivos nuevos: una sola coincidencia, el 1️⃣ del nombre de una prueba (L-009).
- Regresión: la CI (la verifica el Manager)
- Evidencia: no guardé archivos en `evidence/`

## Fallos
Ningún defecto nuevo: los 65 rojos corresponden a los hallazgos ya clasificados en `clasificacion-9c.md`.

## Notas para el Manager y el coder
- **Pendiente del Manager (L-012):** correr `npm run check` antes del commit en rojo.
- **Diferencia con BRK-U-2:** el reporte dice que pasa "al pegar façade y rehacer". Pegar y rehacer **sin deshacer** no falla en mis pruebas. Con deshacer y rehacer sí falla. Dejé las dos variantes.
- **Interpretación en TC-044 con "façade":** F-001 describe el resultado final solo con "casa". Por analogía, exijo "faade" después de deshacer y rehacer. En el paso intermedio admito vacío (deshacer el pegado) o "faade".
- **TC-044 no exige que deshacer haga algo.** Exige que nunca aparezca texto que nadie escribió. El control sin la app comprueba que el teclado y la orden sí deshacen en este navegador. Corrió solo en Windows; si falla en la CI (Linux), hay que clasificarlo como un asunto del entorno de mi prueba, no de la app.
- **TC-043 usa una espera fija de 1 s** después de "atrás", porque el navegador repone el texto un momento después y sin ella la prueba podría pasar por error. El plan (P-6) decía que la de TC-027 era la única de la slice: ahora hay dos.
- **Sin verificar:** "el navegador la restaura por otra vía" (CA-7), como el Safari real al devolver la página completa con texto **y** conteos, o al reabrir la pestaña. No sé si este navegador de pruebas llega a restaurar la página completa. Recomendación: agregar a la lista manual del iPhone "escribir, abrir otra dirección en la misma pestaña, tocar atrás: vacío y en 0".
- Tampoco quedan cubiertos el gesto de deshacer del iPhone (agitar o tres dedos) ni arrastrar y soltar.

## Preguntas para el usuario o el Manager
No bloquean la ronda: no escribí pruebas para estos bordes.
1. **Tildes pegadas sobre un emoji o un signo que cuenta como emoji.** §5.2 del plan dice que un grafema que empieza por emoji entra completo, así que "😀" + 2.000 U+0301 entraría con todas las tildes. CA-11 y D-018 dicen que sobre algo que no es letra las tildes no entran. Además, signos como "©" o "®" tienen la propiedad de emoji (`Extended_Pictographic`). **Criterio no verificable.** Recomendación: quitar las tildes combinables y U+20E3 también después de un emoji, conservando sus piezas propias (U+200D, U+FE0F, tono de piel), y precisarlo en §5.2 antes del coder.
2. **Con "1" escrito, pegar U+FE0F + U+20E3** formaría la tecla 1️⃣ sobre un número ya escrito. TC-045 solo define U+20E3 solo. Recomendación: que siga "1", igual que con U+20E3 solo.

## Fallo sin explicar
Ninguno.

## Lecciones propuestas
- Al pasar la reproducción de un breaker a prueba de aceptación, hay que correr cada variante que el reporte describe solo en prosa — "pegar façade y rehacer" no falla sin deshacer antes, y sin correrla habría quedado como un rojo supuesto.
- Un pase libre como "el emoji entra completo" necesita su ejemplo negativo con signos combinables (emoji + tilde) — la regla de D-018 y el pase completo se cruzan ahí (complemento de L-023).

STATUS: DONE

## Ronda 1 — ajuste (preguntas 1 y 2)
**Fecha:** 2026-11-26 · Plan §5.2 del commit `040ac53`

Las dos preguntas quedaron decididas: (1) las tildes o el U+20E3 de más pegados detrás de una tecla o un emoji se quitan, y la tecla o el emoji entran intactos; (2) lo pegado nunca convierte en tecla lo ya escrito. Estas cifras reemplazan las de la sección anterior.

### Casos corregidos (2, en `tests/unit/round1.test.ts`)
| Caso | Antes esperaba | Ahora espera |
|---|---|---|
| 1️⃣ + U+0301 | "1" (1 número) | 1️⃣ (1 otro) |
| "1" + U+20E3 + U+20E3 | "1" (1 número) | "1" + U+20E3, la tecla sin U+FE0F (1 otro) |

El paquete solo nombraba el primero. El segundo también quedó contrario a la decisión 1 ("U+20E3 de más se quitan y la tecla entra intacta"), así que lo corregí. Los dos salieron de "queda solo la base" y ahora están en la prueba de tecla seguida de signos. No cambié las demás pruebas anteriores.

### Cobertura nueva o corregida
| Caso | Prueba (archivo) | Tipo | Restricción | Resultado (y razón del rojo) |
|---|---|---|---|---|
| TC-045 | Tecla seguida de 1 tilde, 2.000 tildes, U+20E3 de más (con y sin U+FE0F) o cedilla + grave: entra intacta, largo 1, también tras "casa" (incluye los 2 corregidos) | Unitaria | C-015, D-018 | **Rojo 5/5:** entran los signos de más |
| TC-045 | Con "1", "#" o "*" escrito, pegar U+FE0F + U+20E3: no cambia | Unitaria | C-015 | **Rojo 3/3:** lo escrito se vuelve tecla |
| TC-045 | Con 1️⃣ ya escrito, pegar una tilde: no cambia | Unitaria | D-018 | **Control, pasa 1/1** |
| TC-049 | 😀 + 1 tilde, + 2.000 tildes y + U+20E3; familia, bandera, pulgar con tono de piel y corazón con U+FE0F + 1 tilde: intactos, largo 1, también tras "casa" | Unitaria | A-001, D-018 | **Rojo 7/7:** entra la marca |
| TC-049 | "a" + 😀 + tilde + "b" → "a😀b" | Unitaria | C-016, D-018 | **Rojo 1/1** |
| TC-049 | Con 😀 ya escrito, pegar 1 o 2.000 tildes: no cambia | Unitaria | A-001, D-018 | **Control, pasa 1/1** |
| TC-045 | Con "1" escrito, pegar U+FE0F + U+20E3: rechazo silencioso, sigue "1" | E2E | C-015, D-005 | **Rojo 1/1:** queda 1️⃣ |
| TC-045 | Pegar 1️⃣ + tilde: queda 1️⃣ | E2E | D-018 | **Rojo 1/1:** queda con la tilde |
| TC-049 | Tras "casa", pegar 😀 + 2.000 tildes: queda "casa😀", 2/2/0/1 | E2E | A-001, D-018 | **Rojo 1/1:** entran las tildes. El plan §6 pone TC-049 como unitaria; esta E2E es un refuerzo |

### Cifras nuevas (corridas completas de mis dos archivos)
| Comando | Total | En rojo | En verde (todos son control) |
|---|---|---|---|
| `npx vitest run tests/unit/round1.test.ts` | 66 | 46 | 20 |
| `npx playwright test tests/e2e/round1.spec.ts --project=iphone` | 43 | 36 | 7 |

- En las unitarias, `-t "control"` corre 20 pruebas y las 20 pasan. Coinciden con las 20 en verde de la corrida completa, así que ningún caso sin la marca "control" pasa.
- Leí por separado la razón de las 3 E2E nuevas: son diferencias en el texto del campo. De las unitarias nuevas leí las diferencias de teclas y emojis; la salida se corta y no las vi todas completas.
- Los dos casos nuevos que ya pasan (pegar tildes sobre una tecla o un emoji ya escritos) deben seguir en verde después del coder.
- **`npm run check`: sin verificar** (L-012). El Manager lo corre antes del commit en rojo.
- Búsqueda de marcas e invisibles reales en los dos archivos: solo el 1️⃣ en el nombre de dos pruebas E2E.
- No hice commits ni guardé archivos en `evidence/`.

### Preguntas y fallo sin explicar
Ninguna pregunta pendiente. Fallo sin explicar: ninguno.

STATUS: DONE
