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
