# Lote 1 — VS-002
**Fecha:** 2026-11-27 · **Rama:** feature/VS-002-imagenes-ninos

## Pasos construidos
| Paso | Commits (test → feat → refactor) | Casos de prueba cubiertos | Razón del rojo |
|---|---|---|---|
| P-1 (parte del coder, DT-009) | `refactor(P-1)` `d0de68b`. La parte de pruebas (DT-008) va en `3ea4d1f`, del tester | TC-058 (regresión) | No tiene rojo: no cambia el comportamiento (plan P-1). Criterio (d): `git diff -- src/main.ts`, antes del commit, mostró solo líneas de comentario (1 quitada, 2 agregadas, con el texto exacto del plan) |
| P-2 | `test(acceptance)` `3ea4d1f` → `feat(P-2)` `58e824e` · sin refactor (no había nada que limpiar) | TC-052, TC-058 | 11 fallos y 13 en verde en `group-look` + `screen`. Vi en la salida: número de Vocales esperado `rgb(198, 40, 40)`, recibido `rgb(31, 107, 51)` (también en `screen.spec.ts:292`); `--color-vowel` en oscuro recibido `rgb(0, 0, 1)` (el token no existe); clases de grupo recibidas `[]` (en oscuro). La salida se cortó en la mitad: de los demás fallos vi la lista de nombres (los mismos 10 de `group-look` + 1 de `screen` del tester), no el detalle de cada uno |

## Explicación para el usuario
### P-1 — Corregir un comentario
Un comentario es una nota para quien lee el código; la app no lo ejecuta. La nota anterior decía que la app solo reescribe el campo cuando algo no entra. También lo reescribe cuando una letra llega en dos piezas (por ejemplo, la "a" y la tilde por separado) y las junta en una sola. La nota ya dice las dos cosas. Archivo: `src/main.ts`.

### P-2 — Un color por grupo
Cada ficha recibió una "etiqueta" (una clase) que dice de qué grupo es, por ejemplo `count--vowel`. En el archivo de estilos, cada color tiene un nombre (un *token*, como `--color-vowel`) con un valor para el modo claro y otro para el oscuro. La etiqueta de la ficha escoge cuál de esos colores usa, y el número y el borde punteado toman "el color de mi grupo" (`--group-color`). Así, la regla del número y la del borde se escriben una sola vez para las 4 fichas. Para cambiar un color basta con cambiar su token. El nombre y el fondo de la ficha no cambian. Archivos: `index.html` y `src/styles.css`.

## Estado de las pruebas
| Corrida | Comando | Resultado |
|---|---|---|
| Después de P-1 | `npm run check` · `npm run test:unit` | ok · 207/207 |
| Rojo de P-2 | `npx playwright test tests/e2e/group-look.spec.ts tests/e2e/screen.spec.ts --project=iphone --workers=2 --reporter=line` | 11 fallan, 13 pasan (24) |
| Verde de P-2 | el mismo comando | 24/24 |
| Verde de P-2 | `npm run test:unit` · `npm run check` | 207/207 · ok |

- **Cierre del lote** (sobre `58e824e`):
  - Revisión estática, `npm run check` (tipos y lint): **ok**.
  - Unitarias, `npm run test:unit`: **207/207** (4 archivos).
  - E2E completa, `npm run test:e2e -- --workers=2 --reporter=dot`: **127/127**. Es la E2E del lote y las afectadas; no hubo tiempos límite.
  - Capturas, `npx playwright test --project=captures --workers=2 --output=_project/slices/VS-002/evidence/capturas/lote-1`: **16/16** (Playwright usó 1 proceso).
- **Capturas:** quedan en `_project/slices/VS-002/evidence/capturas/lote-1/`, **sin commit** (`git status` las muestra como nuevas).
- **Autorrevisión visual:** miré solo 2 de las 16, el estado 3 en claro y en oscuro. Muestran número y borde con el color de su grupo, y el nombre sin cambio. Las demás no las revisé a la vista; la revisión visual es del designer. Son capturas en Windows, no del iPhone (L-010).

## Líneas de app
`git diff --numstat 3ea4d1f HEAD`: **22 líneas agregadas y 7 quitadas** (estimado del plan: ~25).

| Archivo | Agregadas | Quitadas |
|---|---|---|
| `index.html` | 4 | 4 |
| `src/main.ts` (solo comentario) | 2 | 1 |
| `src/styles.css` | 16 | 2 |

## Variables de entorno nuevas
- Ninguna.

## Desviaciones del plan
- Ninguna en el código.
- **Commits sin la línea `Co-Authored-By`:** la sesión pedía terminar cada mensaje con `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. La guarda de Bash bloqueó ese commit, porque no permite `<`, `>` ni saltos de línea. No busqué cómo esquivarla: `d0de68b` y `58e824e` quedaron con el mensaje de una sola línea.
- La guarda también bloqueó el primer `cd` a la carpeta de trabajo. No hizo falta, porque la terminal ya estaba en ella.

## Fallo sin explicar
Ninguno. En mis corridas con 2 procesos no se repitieron los tiempos límite que reportó el tester. No corrí con 6 procesos.

## Lecciones propuestas
- El Manager decide cómo hacer compatibles la línea de atribución de los commits y la guarda de los agentes (relacionada con L-008 y L-011) — hoy un agente no puede cumplir las dos cosas. → VEGU

STATUS: DONE

# Lote 2 — VS-002
**Fecha:** 2026-11-27 · **Rama:** feature/VS-002-imagenes-ninos

## Pasos construidos
| Paso | Commits (test → feat → refactor) | Casos de prueba cubiertos | Razón del rojo |
|---|---|---|---|
| P-3 | `test(acceptance)` `a71d0c1` → `feat(P-3)` `b2fd3e5` · sin refactor | TC-050, 051, 053, 054; control TC-055 y 056 | `group-look`: 8 fallan y 16 pasan. En los fallos que se ven en la salida: no hay `::before` (`content` = `none`) y `column-gap` = `normal`. La salida se cortó en la mitad: de los demás vi el nombre y, en el último, la misma razón |
| P-4 | `test(acceptance)` `a71d0c1` → `feat(P-4)` `4de9b70` · sin refactor | TC-059, 064, 063; control TC-060 | Antes de P-3, `didactic-screen`: 22 fallan y 7 pasan (`content` = `none`, `gap` = `normal`, `dd` en `block`). Después de P-3: **13 fallan y 16 pasan**, todos a 320 o 359 px, como dijo el tester. Razones vistas: imagen de 44 px en vez de 32, relleno de 8 px en vez de 4, y 52 px antes del número en vez de 36. La salida también se cortó: no leí el detalle de cada uno de los 13 (los de TC-063 incluidos) |

## Explicación para el usuario
### P-3 — Una imagen por grupo
Cada ficha ahora muestra su dibujo a la izquierda del número. El dibujo es un texto (formato SVG, que describe figuras) escrito dentro del archivo de estilos, así que la app no pide ninguna imagen a internet. El navegador dibuja un cuadrito antes del número, lo pinta del color del número y lo "recorta" con la forma del dibujo, como con un molde. Por eso el mismo dibujo sale del color correcto en claro y en oscuro. El cuadrito no tiene texto, así que el lector de pantalla sigue leyendo solo el nombre y el número. Los 4 dibujos se copiaron de la maqueta aprobada. Archivo: `src/styles.css`.

### P-4 — Que todo quepa en el celular angosto
La letra no se achica respecto de lo que ya había. Cuando la pantalla mide menos de 360 px, el dibujo baja de 44 a 32 px, la ficha deja menos espacio a los lados y se acerca el dibujo al número. Así caben "100" y "Consonantes" completos. Esas reglas van al final del archivo porque, cuando dos reglas pesan lo mismo, gana la que está después. Archivo: `src/styles.css`.

## Estado de las pruebas
| Corrida | Comando | Resultado |
|---|---|---|
| Rojo de P-3 | `npx playwright test tests/e2e/group-look.spec.ts --project=iphone --workers=2 --reporter=line` | 8 fallan, 16 pasan (24) |
| Rojo previo de `didactic-screen` | `npx playwright test tests/e2e/didactic-screen.spec.ts --project=iphone --workers=2 --reporter=dot` | 22 fallan, 7 pasan (29) |
| Verde de P-3 | `group-look` (mismo archivo, `--reporter=dot`) | 24/24 |
| Después de P-3 | `didactic-screen` · `npm run test:unit` | 13 fallan (previstos), 16 pasan · 207/207 |
| Verde de P-4 | `didactic-screen` · `npm run test:unit` | 29/29 · 207/207 |

- **Cierre del lote** (sobre `4de9b70`):
  - Revisión estática, `npm run check` (tipos y lint): **ok**.
  - Unitarias, `npm run test:unit`: **207/207** (4 archivos).
  - E2E completa, `npm run test:e2e -- --workers=2 --reporter=dot`: **166/166** (incluye las del lote y las afectadas); no hubo tiempos límite.
  - Capturas, `npx playwright test --project=captures --workers=2 --output=_project/slices/VS-002/evidence/capturas/lote-2 --reporter=line`: **16/16** (Playwright usó 1 proceso).
- **Capturas:** quedan en `_project/slices/VS-002/evidence/capturas/lote-2/`, **sin commit**.
- **Autorrevisión visual:** miré 4 de las 16: estado 3 (390 px) y estado 5 (320 px, 100 "a"), en claro y en oscuro.
  - Cada ficha muestra su dibujo a la izquierda del número, en la misma fila y del color del grupo.
  - A 320 px, "100" y "Consonantes" se ven completos dentro de su ficha. "Consonantes" queda con poco margen a los lados.
  - No miré las otras 12; la revisión visual es del designer. Son capturas en Windows, no del iPhone: lo que cabe a lo ancho y si los dibujos se reconocen se confirma en P-7 (L-010).

## Líneas de app
`git diff --numstat a71d0c1 HEAD`: **42 líneas agregadas y 7 quitadas**, todas en `src/styles.css` (estimado del plan: ~30). La diferencia viene de escribir las 4 variantes y el `::before` en varias líneas, como el resto del archivo. Está muy por debajo del tope de ~200. `index.html` y `src/main.ts` no cambiaron.

## Variables de entorno nuevas
- Ninguna.

## Desviaciones del plan
- Ninguna en el código.
- Commits `b2fd3e5` y `4de9b70` con mensaje de una línea, sin `Co-Authored-By` (no la intenté: la guarda la bloquea, como quedó en el lote 1; el Manager lo autorizó en el paquete).

## Fallo sin explicar
Ninguno.

## Lecciones propuestas
- Ninguna nueva. L-041 (el ajuste de pantalla angosta va después del componente) se aplicó en P-4.

STATUS: DONE

# Lote 3 — VS-002
**Fecha:** 2026-11-27 · **Rama:** feature/VS-002-imagenes-ninos

## Pasos construidos
| Paso | Commits (test → feat → refactor) | Casos de prueba cubiertos | Razón del rojo |
|---|---|---|---|
| P-5 | `test(acceptance)` `9ec5015` → `feat(P-5)` `9c45554` · sin refactor (solo cambiaron valores, no había nada que limpiar) | TC-061 (aproximación automática), TC-058 | Antes del cambio corrí las 77 de los 3 archivos y falló el comando (la salida se cortó antes del total, así que los 15 de 180 son la cifra del tester). Releí por grupos: las 4 de aproximación (Números y Otros terminan en 432,58 px, el límite es 417), las 2 de espacios (arriba 12 en vez de 8, título a etiqueta 16 en vez de 8, campo a fichas 20 en vez de 12), las 4 de la ficha (relleno de 12 px en vez de 8 arriba y abajo; a 390 y 360, alto 109 en vez de 104) y la de `screen.spec.ts` (campo vacío 90, máximo 85). En la corrida de 77 alcancé a ver además el relleno de 12 px del campo y el tope a 320 px, con 8 px de más. De las otras pruebas del campo y del tope no leí el detalle |

## Explicación para el usuario
### P-5 — Los 4 grupos a la vista con el teclado abierto
Cuando el teclado del iPhone está abierto queda poco espacio, y la segunda fila de fichas salía cortada. Para que quepa se recortaron 5 "aires": arriba de la pantalla, entre el título y la etiqueta, dentro del campo (arriba y abajo), entre el campo y las fichas, y dentro de cada ficha (arriba y abajo). Ninguna letra ni dibujo cambió de tamaño. Como el campo tiene menos relleno, también se ajustó la cuenta de su alto máximo, para que siga mostrando 5 líneas y después se desplace por dentro. Los espacios se escogen de la lista de medidas ya definidas (los *tokens*, como `--space-2`, que vale 8 px). El ajuste del celular angosto (4 px a los lados de la ficha) se conserva. Archivo: `src/styles.css`.

La prueba automática solo **se aproxima** al teclado: revisa que las fichas terminen antes de 417 px en un navegador simulado. Lo que dice si de verdad se ven los 4 grupos son las fotos de su iPhone (P-7, lote 4).

## Estado de las pruebas
| Corrida | Comando | Resultado |
|---|---|---|
| Rojo | `npx playwright test tests/e2e/didactic-screen.spec.ts tests/e2e/screen.spec.ts tests/e2e/group-look.spec.ts --project=iphone --workers=2 --reporter=line`, y luego por archivo o con `--grep` | Falla, con las razones de la tabla de arriba |

- **Cierre del lote** (el código es el de `9c45554`; la revisión estática, las unitarias y la corrida de 77 se hicieron justo antes de ese commit, sin cambios después):
  - Revisión estática, `npm run check` (tipos y lint): **ok**.
  - Unitarias, `npm run test:unit`: **207/207** (4 archivos).
  - E2E del lote, `npx playwright test tests/e2e/didactic-screen.spec.ts tests/e2e/screen.spec.ts tests/e2e/group-look.spec.ts --project=iphone --workers=2 --reporter=dot`: **77/77**.
  - Capturas, `npx playwright test --project=captures --output=_project/slices/VS-002/evidence/capturas/lote-3 --reporter=line`: **20/20** (Playwright usó 1 proceso).
  - E2E completa, `npm run test:e2e -- --workers=2 --reporter=dot`: **180/180**. No falló ninguna prueba de VS-001 (riesgo R-1).
- **Capturas:** quedan en `_project/slices/VS-002/evidence/capturas/lote-3/`, **sin commit**.
- **Autorrevisión visual:** miré 4 de las 20: 2b a 390 × 427 en claro, 2 a 390 × 427 en oscuro, estado 5 a 320 px en claro y tope de 5 líneas en claro.
  - En las dos de 390 × 427 se ven completos el título, la etiqueta, el campo y las 4 fichas. La frase de 50 ocupa 2 líneas y muestra 17 / 20 / 0 / 1.
  - A 320 px, "100" y "Consonantes" se ven completos. Con 5 líneas, el campo muestra las 5.
  - No miré las otras 16; la revisión visual es del designer. Son capturas en Windows, sin teclado ni barras de Safari: la letra y el espacio real se confirman en P-7 (L-010, L-015).

## Líneas de app
`git diff --numstat 9ec5015 HEAD -- src`: **6 líneas agregadas y 6 quitadas** en `src/styles.css` (estimado del plan: ~8). `index.html` y `src/main.ts` no cambiaron.

## Variables de entorno nuevas
- Ninguna.

## Desviaciones del plan
- Ninguna en el código.
- Commit `9c45554` con mensaje de una línea, sin `Co-Authored-By` (la guarda bloquea `<` y `>`, como quedó en el lote 1). No subí la rama.

## Fallo sin explicar
Ninguno.

## Lecciones propuestas
- Ninguna nueva.

STATUS: DONE
