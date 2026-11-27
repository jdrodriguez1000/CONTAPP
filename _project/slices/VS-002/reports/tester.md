# Lote 1 — trabajo A — VS-002
**Fecha:** 2026-11-27

## Resumen
P-1 (DT-008) está hecho en `tests/`: las E2E siguen en **113/113**, sin ninguna saltada. P-2 queda en rojo: son **127 pruebas, 116 en verde y 11 en rojo**, todas por la razón esperada (colores de VS-001, sin tokens y sin clase de grupo). `npm run check` corre con mi guarda y pasa.
Antes de cambiar nada, la primera corrida con 6 procesos dio 4 fallos por tiempo límite (ver "Fallo sin explicar"). No hice commits.

## Archivos tocados
| Archivo | Cambio | Paso |
|---|---|---|
| `tests/e2e/field-helpers.ts` | Nueva `expectNothingStored(page, context)` (plan §5.3). Comentario de cabecera al día | P-1 |
| `tests/e2e/typing.spec.ts` | TC-024 usa la función en lugar de la copia | P-1 |
| `tests/e2e/published.spec.ts` | TC-024 usa la función. `EVIDENCE` pasa a `_project/slices/VS-002/evidence/published` | P-1 |
| `tests/e2e/group-look.spec.ts` (nuevo) | TC-052 en claro y oscuro: 14 pruebas | P-2 |
| `tests/e2e/screen.spec.ts` (antes líneas 283-299) | Número de Vocales: `rgb(198, 40, 40)` / `rgb(255, 123, 114)`. El fondo no cambia | P-2 |
| `tests/e2e/captures.spec.ts` | Estados nuevos 2b y 5, en claro y oscuro. La cabecera apunta a `mockup-b.html` | lote 1 |

## DT-008: criterio escrito antes (plan P-1)
**(a) Antes del cambio** (árbol limpio, `1ed262a`): `npm run test:e2e` tiene **113 pruebas**. Con 2 procesos: 113 en verde. Con 6 procesos (valor por defecto): 109 en verde y 4 por tiempo límite.

Las 7 pruebas de `typing.spec.ts` antes del cambio:
1. TC-002 — escribir "casa" letra por letra cambia los conteos al instante con cada letra (C-001)
2. TC-002 — pegar una frase, o reemplazarla, también cuenta al instante los 4 grupos (C-006, C-007, C-008)
3. TC-003 — borrar una letra de "casa" baja los conteos y borrar todo deja los 4 en 0 (C-012)
4. TC-003 — al borrar hasta dejar solo espacios y saltos de línea, los 4 quedan en 0 (C-012, C-008)
5. TC-024 — escribir "casa" y recargar deja el campo vacío y los 4 en 0, sin guardar nada (C-010)
6. TC-025 — al escribir "casa" no sale ninguna petición y ninguna lleva el texto (C-010)
7. TC-027 — escribir "cas" y esperar: el texto sigue "cas" y la app no propone nada (C-009)

- **(b) Después de P-1:** 113 pruebas, **113 en verde, 0 saltadas** (2 procesos). No quité ni renombré pruebas.
- **(c)** Busqué `localStorage` en todo `tests/` (herramienta Grep): la única coincidencia es `field-helpers.ts:38`; en `tests/e2e/*.spec.ts` no hay ninguna.
- **(d)** `git diff -- src/main.ts` es del coder (DT-009). Yo no lo puedo ver ni lo toqué.
- `published.spec.ts` **no se ejecutó** (necesita `E2E_BASE_URL`). Pasa `npm run check` y Playwright lo carga: `--list` muestra sus 4 pruebas.

## Cobertura
| Caso | Prueba (`group-look.spec.ts`, ×2: claro y oscuro) | Tipo | Restricción | Resultado y razón del rojo |
|---|---|---|---|---|
| TC-052 | el número de cada ficha lleva el color de su grupo | E2E | — | **Rojo.** `number of vowel`: esperado `rgb(198, 40, 40)`, recibido `rgb(31, 107, 51)`. Oscuro: `rgb(255, 123, 114)` / `rgb(255, 221, 85)` |
| TC-052 | los 4 lados del borde llevan el color del grupo | E2E | — | **Rojo.** `top border of vowel`: recibido `rgb(187, 204, 187)`; en oscuro, `rgb(59, 85, 64)` (el `--color-border` de hoy) |
| TC-052 | los 4 colores de los números son distintos | E2E | — | **Rojo.** `Expected: 4, Received: 1`: los 4 números tienen el mismo color |
| TC-052 | cada ficha toma el color de su token (el token vale lo aprobado; al cambiar un solo token cambian solo el número y el borde de su ficha) | E2E | — | **Rojo.** `value of --color-vowel`: recibido `rgb(0, 0, 1)`, el valor de respaldo de la sonda, o sea que el token no existe |
| TC-052 | cada ficha tiene `count` y solo su `count--<grupo>` | E2E | — | **Rojo.** `group classes of vowel`: esperado `["count--vowel"]`, recibido `[]` |
| TC-052 (**control**) | borde `dashed` de 2 px en los 4 lados, fondo de la ficha, color del nombre y fondo del campo | E2E | — | Verde en el rojo, a propósito |
| TC-052 (**control**) | contraste WCAG ≥ 4,5:1 del color **realmente pintado** sobre la ficha y sobre el campo (la fórmula se comprueba con 21:1 y 1:1) | E2E | — | Verde en el rojo, a propósito: el verde y el amarillo de VS-001 también cumplen. Solo prueba algo junto con la prueba del color del número |
| TC-058 | `screen.spec.ts` "P-3 — los colores siguen el modo claro u oscuro…" | E2E (cambiada) | — | **Rojo.** Línea 292: esperado `rgb(198, 40, 40)`, recibido `rgb(31, 107, 51)`. Su aserción del fondo de la ficha es de control |

- **Controles:** 4 pruebas en `group-look.spec.ts` (2 por modo). **Rojos:** 10 de `group-look.spec.ts` + 1 de `screen.spec.ts` = **11**.
- **Prueba de la prueba:** en rojo, la de tokens se detiene en su primera aserción, así que la parte de "cambiar un token" no se ejecutaba. Inyecté de forma temporal en la página el CSS y las clases del plan P-2, desde la propia prueba y sin leer `src/`: **14/14 en verde**. Después retiré la inyección (Grep de `TEMPORARY|addStyleTag|classList` en `tests/`: sin resultados). Esto muestra que las pruebas pueden pasar con una implementación según el plan; no prueba la del coder.
- TC-052 pide además revisión visual: la hace el designer con las capturas.
- No hay pruebas `*-later`: los casos de P-3 en adelante se escriben en su lote.
- Restricciones duras: TC-052 no cita ninguna. La función de C-010 (TC-024) sigue en verde.

## Capturas (para el cierre del coder)
`captures.spec.ts` tiene los estados de la fila del lote 1 (§4), todos en claro y oscuro: **16 capturas**.

| Estado | Tamaño |
|---|---|
| 1 vacío | 390×844 y 320×568 |
| 2 "pingüino" con foco | 390×844 |
| 2b frase de 50 con foco (nuevo) | 390×844 |
| 3 "¡Hola, 2026! 😀" | 390×844 |
| 4 frase de 100 | 390×844 |
| 4 tope de 5 líneas | 390×844 |
| 5 con 100 "a" (nuevo) | 320×568 |

- Las ensayé con `--output=test-results/captures-check`: **16/16 en verde**. No escribí capturas en `evidence/`.
- Revisé a la vista 2b y 5 en claro, con los colores viejos. En Windows, 2b parte en 2 líneas. Eso no dice nada del iPhone (L-010), y la prueba no afirma cuántas líneas son.

## Resultados de la ejecución
- Pruebas del coder: no corrí las unitarias en este lote (las corre el coder en su cierre).
- E2E del proyecto `iphone`, antes: **113** (113 en verde con 2 procesos). Después: **127** = 113 + 14 nuevas; **116 en verde, 11 en rojo, 0 saltadas**.
- `npm run check`: pasa (pendiente de MANT-001: mi `npm run check` corre).
- Regresión: la CI (la verifica el Manager). Con el commit en rojo, se espera la CI en rojo por esas 11.
- Evidencia: `_project/slices/VS-002/evidence/tester-check-lote-1.txt` y `tester-e2e-lote-1.txt`. La guarda no deja redirigir salidas, así que **las copié a mano** de la terminal.

## E2E que el coder debe correr en su cierre
Además de `npm run check` y `npm run test:unit`:
1. `npm run test:e2e` completo: `group-look`, `screen`, `typing`, `foreign-letters`, `max-length`, `round1` y `skeleton`. Esperado después de P-2: **127/127**. Si hay fallos por tiempo límite: `npm run test:e2e -- --workers=2`.
2. `npx playwright test --project=captures --output=_project/slices/VS-002/evidence/capturas/lote-1`. Esperado: 16/16.

## Fallos
| # | Caso | Clasificación | Cómo reproducirlo | Evidencia |
|---|---|---|---|---|
| — | Ningún defecto en este trabajo: los 11 rojos son el rojo esperado de P-2 | — | — | `tester-e2e-lote-1.txt` |

## Preguntas para el usuario o el Manager
- Ninguna bloquea. Si los tiempos límite se repiten en la máquina local, recomiendo que el Manager decida si se limita el número de procesos en `playwright.config.ts`. No lo cambié: no está en el plan.

## Fallo sin explicar
- **Qué falló:** 4 pruebas con `Test timeout of 30000ms exceeded`: TC-016, TC-017 y TC-017 borde en `foreign-letters.spec.ts` (líneas 35, 50 y 62) y TC-021 borde en `max-length.spec.ts:53`. Pasó **antes de cualquier cambio** (árbol limpio).
- **Comando:** `npm run test:e2e` (6 procesos). Falló en 1 de 1 corrida completa con 6 procesos.
- **Un intento de aclararlo:** con `--workers=2`, esos dos archivos dieron 52/52. La suite completa, en 3 corridas con 2 procesos, no tuvo ningún tiempo límite (113/113, 113/113 y 116 verdes + los 11 rojos esperados).
- **Hipótesis sin comprobar:** la máquina se carga con 6 procesos. No volví a correr con 6 procesos y no sé si pasa en la CI.
- **Evidencia:** resumen copiado en `evidence/tester-e2e-lote-1.txt`, punto 1. Las trazas de `test-results/` se sobrescribieron con las corridas siguientes.

## Lecciones propuestas
- Cuando una prueba en rojo se detiene en su primera aserción, probar el resto inyectando de forma temporal en la página lo que pide el contrato del plan, y retirarlo después — así un error de la propia prueba se ve antes de llegar al coder (complementa L-035). → VEGU

STATUS: DONE

# Lote 2 — trabajo A — VS-002
**Fecha:** 2026-11-27

## Resumen
Quedaron escritas las pruebas de P-3 y P-4: **39 nuevas, 30 en rojo y 9 de control**. La suite pasó de **127/127** a **166 pruebas: 136 en verde y 30 en rojo**, con las 127 de antes en verde.
`npm run check` pasa antes y después, y el ensayo de capturas da 16/16. Leí las 30 razones del rojo y todas son las esperadas. No hice commits.

## Archivos tocados
| Archivo | Cambio |
|---|---|
| `tests/e2e/group-look.spec.ts` | +10 pruebas: TC-050, 051, 053, 054, 055 y 056 |
| `tests/e2e/didactic-screen.spec.ts` (nuevo) | 29 pruebas: TC-059, 060, 063 y 064. **Sin TC-061** (es del lote 3) |
| `tests/e2e/field-helpers.ts` | Nuevas `numberRow` y `expectImageBesideNumber`: miden dónde empieza el número dentro del `dd`, porque la imagen no tiene caja propia |
| `tests/e2e/captures.spec.ts` | Pedido del Manager (observación menor del designer, lote 1): la prueba `P-3 — captura …tope-5-lineas…` ahora se llama **`estado 4b — tope de 5 líneas: captura …`**, porque "P-3" era del plan de VS-001 y en VS-002 es "Una imagen por grupo". No cambia lo que hace ni el nombre del archivo PNG |

## Cobertura
| Caso | Prueba (cuántas) | Tipo | Restricción | Resultado y razón del rojo |
|---|---|---|---|---|
| TC-050 | `group-look`: imagen, orden, "0", nombre y 4 distintas (1) | E2E | C-012, C-013 | **Rojo:** `content` = `none` (no hay `::before`) |
| TC-050 | `group-look`: a la izquierda, misma fila, 44 + 8 px (1) | E2E | — | **Rojo:** `column-gap` = `normal` |
| TC-050 | `group-look`: cada ficha pinta **el dibujo aprobado** de su grupo (1) | E2E | — | **Rojo:** máscara `none`. La parte que revisa la maqueta sí pasa |
| TC-051 | `group-look`: las dos primeras de TC-050, en oscuro (2) | E2E | — | **Rojo:** las mismas dos razones |
| TC-053 | `group-look` (1) | E2E | C-001, C-006, C-007, C-008, C-012 | **Rojo:** `content` = `none`. Exige la imagen antes de comparar; sin eso, "igual que vacía" pasaría sin imagen |
| TC-054 | `group-look`: "ç" y carácter 101 (2) | E2E | C-011 | **Rojo:** `content` = `none`. Usa `expectRejected` y compara estilos de ficha e imagen |
| TC-055 | `group-look` (1) | Integración | C-010 | **Control** (verde) |
| TC-056 | `group-look`: árbol accesible exacto (`/children: equal`) y `dt` visibles (1) | E2E | C-013 | **Control** (verde) |
| TC-059 | `didactic`: letra a 390 y 320 (2) | E2E | — | **Control** (verde): la letra no cambia |
| TC-059 | `didactic`: tamaño de la imagen a 390, 320, **359 y 360** (4) | E2E | — | **Rojo:** `content` = `none` |
| TC-060 | `didactic` (1) | E2E | C-009, C-013 | **Control** (verde) |
| TC-063 | `didactic`: 390 y 320, claro y oscuro (4) | E2E | — | **Control** (verde hoy). **Se pone en rojo a 320 si entra P-3 sin P-4** (ver abajo) |
| TC-064 | `didactic`: relleno lateral y separación a 390, 320, 359 y 360 (4) | E2E | — | **Rojo:** a 390 y 360, `column-gap` = `normal`; a 320 y 359, relleno `8px` en vez de `4px` |
| TC-064 | `didactic`: "0", "9", "10" y "100", y además "100" en los otros 3 grupos, a 390 y 320 (14) | E2E | A-001 | **Rojo:** el `dd` está en `block` |

- **Control (9):** TC-055, TC-056, TC-059 de letra (2), TC-060 y TC-063 (4).
- **Rojo (30):** 8 en `group-look` y 22 en `didactic-screen`.
- **Restricciones duras:** C-010 queda cubierta por TC-055; C-011 por TC-054; C-009 y C-013 por TC-056 y TC-060; C-012 por TC-050 y TC-053.
- No hay pruebas `*-later`.

**Diferencias con el texto del plan (las pruebas piden lo mismo o más):**
- El plan marca TC-064 a 390 como control. Eso vale **después de P-3**. En este rojo todavía no hay imagen, y estas pruebas exigen que la imagen y el número quepan, así que salen en rojo también a 390.
- "El dibujo aprobado": lee los 4 `--img-*` de `mockup-b.html`, los pinta a 44 × 44 y compara su silueta con la de la app, con una tolerancia de 19 píxeles (1 %). Detecta dibujos cambiados entre grupos, que "son distintos" no ve. También detecta un SVG que no se pueda dibujar (R-2). No reemplaza TC-057 ni la revisión del designer.
- **"Cabe en la ficha":** además de lo que dice el plan, exige que las dos columnas midan lo del diseño (≈ 173 px a 390 y ≈ 138 px a 320, ±1; F-002 §5.2). También exige que `dt` y `dd` queden dentro del espacio útil de la ficha, sin su relleno. Revisar solo que "el `dd` esté dentro de la ficha" no bastaba: cuando el contenido no cabe, la columna se ensancha y el `dd` sigue "dentro".
- Bordes añadidos: 359 y 360 px (límite del plan §5.1), "100" en los 4 grupos (CA-21 dice "un grupo cualquiera") y peso 600 del campo (F-003 §5.4).

## Prueba de las pruebas
Como en el lote 1, inyecté desde las pruebas el CSS del plan, **sin leer `src/`**, y después lo retiré.

| Etapa | Resultado |
|---|---|
| B (P-3 + P-4) | `group-look` **24/24** y `didactic-screen` **32/32** (29 + 3 mediciones temporales) |
| A (solo P-3) | `didactic-screen`: **13 en rojo, todos a 320 o 359 px**; todo lo de 390 y 360, en verde |
| Daño a propósito | Dibujos cambiados entre grupos, texto "boca" en una imagen y envío de lo escrito a otro sitio: **las 3 se detectan** con el mensaje correcto |

- Los 13 de la etapa A son: TC-059 de imagen (2), TC-064 de relleno (2), TC-063 a 320 (2) y TC-064 con números a 320 (7).
- En TC-063 la falla es la que protege P-4: la ficha de Vocales mide **130 px en vez de 138**, porque la columna de "Consonantes" con "100" se ensancha.
- Grep de las marcas temporales en `tests/`: sin resultados. La corrida final de 166 es posterior a la limpieza.
- Esto prueba que las pruebas **pueden** pasar con el CSS del plan, no que la implementación del coder pase.

## Resultados de la ejecución
| Corrida (`--workers=2`) | Antes | Después |
|---|---|---|
| `npm run check` | pasa | pasa |
| E2E `iphone` | 127: **127 en verde** | 166: **136 en verde, 30 en rojo** |
| Capturas (ensayo en `test-results/`) | — | **16/16** |

- Cómo conté: la salida de las 166 se corta en la terminal. Corrí aparte los 6 archivos sin cambios (113/113) y TC-052 (14/14). Leí los rojos por grupos.
- Pruebas del coder: no corrí las unitarias.
- Regresión: la CI (la verifica el Manager). Con este commit en rojo, se espera la CI en rojo por esas 30.
- No hubo fallos por tiempo límite con 2 procesos.
- Evidencia: `_project/slices/VS-002/evidence/tester-e2e-lote-2.txt` (copiada a mano; incluye `check`).

## Capturas
`captures.spec.ts` ya tiene **todos los estados del lote 2** (§4); no agregué ninguno. En claro y oscuro, 16 en total: 1 (390 y 320), 2, 2b, 3, 4, 4b (tope de 5 líneas) y 5 (320). El estado "rechazo" no tiene dibujo propio, y la galería de la sección 0 de la maqueta no es una pantalla de la app. No escribí nada en `evidence/capturas/`.

## E2E que el coder debe correr en su cierre
Además de `npm run check` y `npm run test:unit`:
1. Las del plan §4: `npx playwright test tests/e2e/group-look.spec.ts tests/e2e/didactic-screen.spec.ts tests/e2e/screen.spec.ts tests/e2e/foreign-letters.spec.ts tests/e2e/max-length.spec.ts --project=iphone --workers=2`.
   - Recomiendo además la suite completa, `npm run test:e2e -- --workers=2`: **166/166** al terminar P-4.
   - **Solo con `feat(P-3)`** se espera que `group-look` quede entero en verde y que en `didactic-screen` sigan en rojo los 13 de menos de 360 px. En la etapa A no corrí los otros archivos.
2. `npx playwright test --project=captures --output=_project/slices/VS-002/evidence/capturas/lote-2` → 16/16.

## Fallos
| # | Caso | Clasificación | Cómo reproducirlo | Evidencia |
|---|---|---|---|---|
| — | Ningún defecto en este trabajo: los 30 rojos son el rojo esperado de P-3 y P-4 | — | — | `tester-e2e-lote-2.txt` |

## Preguntas para el usuario o el Manager
Ninguna bloquea.
- **Entre 360 y ≈ 369 px (criterio no verificable, sin prueba de "cabe").** Con las medidas del diseño para SF Pro ("100" ≈ 91 px), 44 + 8 + 91 = 143 px. A 360 px la ficha tiene 138 px útiles. En Windows sí cabe ("100" mide 80,7 px). CA-21 solo pide 390 y 320, y a 359 y 360 solo probé los tamaños que fija el plan. A 375 px quedan ≈ 2,5 px de margen según esas cuentas. **Recomiendo** anotarlo en los "Bordes que esperan" de VS-002, sin cambiar el plan.
- **Riesgo en la CI (L-010):** las pruebas de ancho dependen de la letra y solo las medí en Windows. Con el CSS del plan, a 320 px "100" ocupa ≈ 110 de 126 px útiles (estimado desde la medida a 48 px). Si TC-063 o TC-064 fallan solo en la CI, **recomiendo** que me lleguen para clasificarlos antes de tocar el CSS.

## Fallo sin explicar
Ninguno nuevo. El de los tiempos límite con 6 procesos (lote 1) no lo volví a probar: todas las corridas de este lote fueron con 2 procesos o menos.

## Lecciones propuestas
- Para probar que algo "cabe" en una columna `1fr`, no basta con ver que está dentro de su caja: hay que exigir también que la columna conserve su ancho, porque se ensancha con el contenido y la prueba pasa con el diseño roto.
- Cuando el contrato es "la imagen aprobada", comparar lo pintado contra el dibujo de la maqueta: "las 4 son distintas" no detecta dos dibujos cambiados entre sí. → VEGU

STATUS: DONE

# Lote 2 — fallo de la CI
**Fecha:** 2026-11-27 · **Trabajo B (c)** · commit `fcddffa` · CI run 46009483415

## Resumen
**Es un error de mi prueba: depende de la letra de la máquina.** No es intermitente y, con lo que hay, no lo clasifico como defecto de la app.
La comprobación "columna de 138 ±1 px" la agregué yo, más allá del plan, con medidas de diseño pensadas para SF Pro, y la corrí con la letra que tuviera cada máquina.
**No cambié ninguna prueba** ni hice commits.

## Evidencia de la clasificación
- **No es intermitente:** en la CI fallan las 9 con solo dos valores. 133,22 px sale 7 veces. 139,86 px sale 2 veces, justo cuando "100" está en la columna izquierda (Vocales o Números). No hay reintentos (`retries: 0`). En local, el mismo archivo repetido 3 veces dio **87/87**. Hay una sola corrida de la CI: lo que muestra que es determinista es que las cifras se repiten entre pruebas.
- **Por qué falla:** la cuadrícula tiene dos columnas flexibles. Si el contenido de una no cabe en 138 px, esa columna crece y la otra se encoge. Con "0", Vocales mide 133,22, así que Consonantes mide ≈ 142,78. Su número es "0", de modo que lo ancho es el **nombre**.
- **Quién pasa y quién falla:** las pruebas de imagen, relleno y letra (TC-059 y TC-064) pasan en la CI, y a 390 px pasa todo. En TC-064 la fila "imagen + número" también pasa a 320: esa comprobación va antes de la que falla.

## Qué letra usa WebKit en la CI
**Casi con seguridad, DejaVu Sans Bold** (u otra con las mismas medidas). Es una **deducción por medidas**: el registro no nombra la letra y no la vi en la máquina de la CI.

| Texto | DejaVu Sans Bold (calculado) | Ancho de columna que predice | CI |
|---|---|---|---|
| "Consonantes", 18 px | 130,77 px | 276 − (130,77 + 12) = **133,23** | **133,22** |
| "100", 44 px | 91,85 px | 32 + 4 + 91,85 + 12 = **139,85** | **139,86** |

- Dos medidas independientes coinciden con ≈ 0,01 px, y el modelo explica las 9 fallas.
- **Límite:** los anchos de cada carácter de DejaVu salen de mi memoria, no de un archivo. En este equipo no encontré DejaVu en `C:\Windows\Fonts`. La cuenta está en `evidence/tester-ci-lote-2.txt`.
- **Por qué llegaría a esa letra (inferencia):** la pila del diseño es `-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, "Segoe UI", Roboto, sans-serif`. En Linux las tres primeras no existirían, y `system-ui` daría la letra por defecto del sistema. Supongo que la CI usa esa pila: no leí `src/`.

| Ancho (útil en la ficha a 320: 126 px) | SF Pro (estimado de F-002 §5.2) | Windows | CI |
|---|---|---|---|
| "Consonantes" | ≈ 107 | cabe | 130,8 (**no cabe**, +4,8) |
| imagen + 4 + "100" | ≈ 118 | ≈ 110 (estimado del lote 2) | 127,9 (**no cabe**, +1,9) |

## ¿La app incumple CA-21 en Linux?
CA-21 pide: sin desplazamiento horizontal, y nombre y número completos dentro de su ficha. No pide columnas iguales. F-002 §5.2 y F-003 §5.8 sí dicen ≈ 138 px, calculados para SF Pro. La referencia es el iPhone (D-009).

| Con la letra de la CI, a 320 px | Estado |
|---|---|
| Campo vacío y 100 "m": fichas dentro de la pantalla, nombre dentro de su ficha y sin cortar, sin desplazamiento horizontal | **Comprobado:** `screen.spec.ts` "P-3 — a 320 px…" pasa en la CI |
| "Consonantes" cabe porque su columna crece (142,8 frente a ≈ 133,2) | **Deducido:** fichas desiguales por ≈ 10 px |
| "100" en Vocales o Números: las columnas suman 139,86 + 142,78 = 282,64 en un espacio de 276 | **Deducido:** la cuadrícula se pasa ≈ 6,6 px y el margen derecho baja de 16 a ≈ 9,4. No habría desplazamiento |
| Con "100" a la izquierda: desplazamiento horizontal y `dt`/`dd` dentro de la ficha | **Sin comprobar:** mi prueba se detiene en la primera falla |

Ojo: en esos dos casos, quitar solo la comprobación de 138 px **no basta**. La del margen derecho (≤ 304,5) también fallaría en Consonantes (≈ 310,6, deducido).

## Corrección propuesta (sin aplicar): separar en dos comprobaciones, en `didactic-screen.spec.ts`
Solo cambia `expectCardsFit`, que usan TC-063 y TC-064.

1. **Con la letra de la máquina: lo que CA-21 exige.** Las fichas quedan dentro de la pantalla (de 0 al ancho, como en `screen.spec.ts`). `dt` y `dd` quedan dentro del espacio útil de su ficha y sin cortes. Los nombres se ven completos y no hay desplazamiento horizontal. Con esto, la CI comprueba además que nada se corta con una letra ancha.
2. **Con una letra fijada por la prueba: las medidas del diseño.** La prueba inyecta `font-family: Arial, "Liberation Sans" !important` en `body` y en todo lo que contiene. Después exige el margen de 16 px y la columna de 138 ±1 (173 a 390). Arial y Liberation Sans están hechas para medir igual, y `fonts-liberation` está en la lista de paquetes de Linux de la Playwright instalada (`install --with-deps`).
3. **Guarda de la letra:** antes del punto 2, la prueba mide "Consonantes" a 18 px y 700 y exige ≈ 114 ±1 px. Si la letra no se aplicó, falla diciendo eso y no un falso problema de diseño.

**Cuentas esperadas (de memoria, sin medir todavía):** "Consonantes" ≈ 114 px y "100" ≈ 73,4 px, así que ambos caben en 126. Si entra P-3 sin P-4: 44 + 8 + 73,4 ≈ 125 frente a 118 útiles, y la columna sube a ≈ 145. **La protección de P-4 se conserva** en los casos con "100".

**Al aplicarla** comprobaría: (a) en local, en verde; (b) que la guarda mida lo esperado; (c) con el CSS de "solo P-3" inyectado desde la prueba, como en el lote 2, que vuelva a salir en rojo a 320; (d) el Manager confirma la CI en verde. Que Linux mida igual que Windows solo se sabe con esa corrida.

**Contras:**
- Las medidas del diseño se prueban con una letra que no es la de la app. Arial **no es SF Pro**: su "100" (≈ 73) es más angosto que el estimado de SF Pro (≈ 82), y su "Consonantes" (≈ 114) más ancho (≈ 107). Es menos exigente con los números.
- Depende de que la CI siga instalando Liberation. La guarda lo avisaría.
- La prueba queda más larga.
- Con la letra de la máquina, el margen de 16 px y las columnas iguales dejan de exigirse.

**Alternativas que no recomiendo:**
| Opción | Contra |
|---|---|
| Solo el punto 1, quitando las 138 px | Es la más simple, pero deja de probar que la columna no se ensancha. Los TC-059 y TC-064 de medidas seguirían exigiendo el CSS de P-4, no el resultado "cabe" |
| Aplicar las 138 px solo si el texto es angosto | En la CI se saltaría sin que se note |
| Subir el margen de ±1 a ±7 | Relaja la prueba hasta que pase y depende de esta letra |
| Instalar una letra en la CI o cambiar la configuración | Está fuera de este encargo, y ninguna libre es SF Pro |
| Ajustar la app para que quepa con DejaVu | "Consonantes" pediría bajar el nombre a ≈ 17 px (17 px → 123,5), y CA-18 y F-003 §5.4 fijan 18. La otra vía es quitar relleno que el diseño fija. Sería diseñar para una letra que el usuario no usa |

## Cobertura
| Caso | Prueba (archivo) | Tipo | Restricción | Resultado |
|---|---|---|---|---|
| TC-063 a 320 (claro y oscuro) | `didactic-screen.spec.ts` | E2E | — | CI en rojo (2) · local en verde |
| TC-064 a 320 (7 contenidos) | `didactic-screen.spec.ts` | E2E | A-001 | CI en rojo (7) · local en verde |

## Resultados de la ejecución
- Local: `npx playwright test tests/e2e/didactic-screen.spec.ts --project=iphone --workers=2 --repeat-each=3`: **87/87**. No corrí la suite completa ni las pruebas del coder.
- CI (registro entregado): 157 en verde y 9 en rojo.
- Evidencia: `_project/slices/VS-002/evidence/tester-ci-lote-2.txt` y `ci-46009483415-lote-2.log` (sigue sin commit).

## Fallos
| # | Caso | Clasificación | Cómo reproducirlo | Evidencia |
|---|---|---|---|---|
| 1 | TC-063 y TC-064 a 320 px (9 pruebas) | **Error de mi prueba** (depende de la letra de la máquina) | Subir `fcddffa` y dejar correr la CI en `ubuntu-latest`. En Windows no se reproduce | `ci-46009483415-lote-2.log`, `tester-ci-lote-2.txt` |

## Preguntas para el usuario o el Manager
- **¿Aplico la corrección de dos comprobaciones?** La recomiendo.
- **A 320 px nadie comprueba la letra real.** La lista de P-7 usa el iPhone del usuario (390 px). Con el estimado de SF Pro sobran ≈ 19 px para "Consonantes" y ≈ 8 para "100", pero ni la CI ni Windows lo confirman. Recomiendo anotarlo como riesgo conocido, sin cambiar el plan.
- Si en el futuro la app debe verse con otras letras (por ejemplo, en Android o Linux), las columnas desiguales a 320 px serían un tema de alcance y diseño. Hoy D-009 fija el iPhone.

## Fallo sin explicar
Ninguno.

## Lecciones propuestas
- Una prueba que exige un ancho exacto, tomado de un diseño, debe fijar la letra con la que mide y comprobar que se aplicó. Lo que exige el criterio ("nada se corta, no hay desplazamiento") se prueba aparte, con la letra de la máquina. Complementa L-010. → VEGU
- Anotar un riesgo de letra no basta: si la CI usa otro sistema que la máquina local, las pruebas de ancho se corren en la CI antes de dar por bueno el rojo y el verde. → VEGU

STATUS: DONE

# Lote 2 — corrección de la prueba
**Fecha:** 2026-11-27 · **Trabajo B** · aprobada por el usuario el 2026-11-27 · base `fcddffa`

## Resumen
Apliqué las dos comprobaciones y la guarda en `tests/e2e/didactic-screen.spec.ts`. En local: **166/166** y `npm run check` en verde.
Hice un **ajuste a mi propuesta**: la letra fijada mide los números en peso 700. No toqué `src/` ni la configuración, y no hice commits. **Falta confirmar la CI.**

## Qué cambió (un solo archivo de pruebas)
| Comprobación | Qué exige |
|---|---|
| 1. `expectCardsFit`, con la letra de la máquina (CA-21) | Fichas dentro de la pantalla (de 0 al ancho). Nombres completos. `dt` y `dd` dentro del espacio útil de su ficha y sin cortes. Sin desplazamiento horizontal (comprobación aparte, sin cambios) |
| 2. `expectDesignWidths`, con Arial o Liberation Sans | Columna de 138 ±1 (173 a 390) y margen de 16 px a los lados. Al terminar retira la letra fijada |
| 3. `expectDesignFont`, la guarda (corre dentro de la 2) | "Consonantes" ≈ 114 px a 18 px (126,7 a 20 px) **y** el número de Vocales ≈ 0,556 × tamaño por cifra, ±1 |

TC-063 (vacío y con 100 "m") y TC-064 corren la 1 y la 2. No cambian las medidas de imagen, relleno, separación y letra, ni los nombres o la cantidad de pruebas (29 en el archivo).

## Ajuste a lo propuesto: mi cálculo estaba mal para los números
- Con solo cambiar la familia, "100" midió **88,04 px** a 44 px, no ≈ 73,4. Cada cifra ocupaba 0,667 del tamaño.
- **Inferencia:** con el peso 800 de la app, Windows toma **Arial Black** (0,667 es su medida, según mi memoria). Liberation Sans no tiene esa cara, así que Windows y Linux habrían medido distinto.
- **Arreglo:** la letra fijada pone `dd` en **700**. "100" mide 73,41 px (80,09 a 48 px), como en la propuesta.
- La guarda ahora mide también un número: con solo "Consonantes" (700) no habría visto este error.
- **Contra:** los anchos del diseño se miden con números en 700, no en 800. El 800 se sigue exigiendo en TC-059.

## Comprobaciones
| | Qué | Resultado |
|---|---|---|
| (a) | `npm run test:e2e -- --workers=2` (con `--reporter=dot`) sobre el archivo final | **166/166** |
| (a) | `npm run check` | pasa |
| (a) | El archivo corregido, repetido 3 veces | 87/87 |
| (b) | La guarda mide lo esperado | 114,01 px a 18 y 126,68 a 20; "100": 73,41 a 44 y 80,09 a 48 |
| (b) | Guarda con una letra que no existe | **Rojo** con su mensaje: 98,02 px frente a 114 |
| (b) | Guarda sin el peso 700 | **Rojo** en el número: cifra de 29,35 px frente a 24,46 |
| (c) | CSS de "solo P-3" inyectado: TC-063 a 320, claro y oscuro | **Rojo** en los anchos del diseño: Vocales 130,58 px frente a 138 |
| (c) | Igual, TC-064 a 320 | Con números falla primero la medida de la imagen (52 px frente a 36). **Desactivándola de forma temporal**, para aislar los anchos: los 4 casos con "100" en **rojo** (145,42 o 130,58 px); "0", "9" y "10" en verde, porque nada se sale |
| (c) | Igual, TC-059 de imagen y TC-064 de relleno a menos de 360 px | En rojo (la salida del archivo completo se cortó; no hago un total) |

**Comprobación adicional, simulando la CI:** puse de forma temporal Verdana como letra de la máquina. A 320 px "Consonantes" midió 129,74 px y la columna de Vocales 134,25, así que la prueba anterior habría fallado. Con la corregida, los **10** casos filtrados (TC-063 ×2, TC-064 ×7 y el de relleno) quedaron **en verde**, también con "100" en Vocales: sin desplazamiento ni cortes. Verdana **no es** DejaVu: es una simulación, no la CI.

Todo lo temporal quedó retirado (Grep de las marcas en `tests/`: sin resultados). La corrida final es posterior a la limpieza.

## Lo que falta y los límites
- **La CI sobre el commit nuevo.** Ahí se sabe si Liberation Sans se aplica y mide igual. Si no, la guarda falla con el mensaje "the font of the test … is not applied". Mándemelo para clasificarlo.
- La comprobación 2 mira anchos y márgenes, no si el contenido se sale. Hoy basta, porque una columna crece cuando su contenido no cabe. Si el CSS fijara las columnas para que no crezcan, solo la comprobación 1 vería el desborde, y según lo ancha que sea la letra de la máquina. No lo agregué: no estaba en lo aprobado.
- Siguen en pie los contras aprobados: Arial no es SF Pro y a 320 px nadie comprueba la letra real.

## Resultados de la ejecución
- Pruebas del coder: no corrí las unitarias.
- E2E `iphone` en local: 166 en verde y 0 en rojo.
- Regresión: la CI (la verifica el Manager).
- Evidencia: `_project/slices/VS-002/evidence/tester-ci-lote-2-correccion.txt`.

## Fallos
| # | Caso | Clasificación | Cómo reproducirlo | Evidencia |
|---|---|---|---|---|
| — | Ninguno abierto en local; los rojos de (b) y (c) fueron provocados | — | — | `tester-ci-lote-2-correccion.txt` |

## Preguntas para el usuario o el Manager
- Ninguna bloquea. Para el commit: `tests/e2e/didactic-screen.spec.ts`, este reporte y las evidencias `tester-ci-lote-2*.txt`. El registro `ci-46009483415-lote-2.log` sigue sin commit.

## Fallo sin explicar
Ninguno.

## Lecciones propuestas
- Al fijar una letra en una prueba, fijar también un peso que tengan todas las máquinas y medir en la guarda cada tipo de texto: con peso 800, "Arial" midió los números con otra cara. → VEGU

STATUS: DONE

# Lote 3 — trabajo A — VS-002
**Fecha:** 2026-11-27 · P-5 · base `c96b277`

## Resumen
Quedaron escritas las pruebas de P-5: **14 nuevas, las 14 en rojo**, y **1 cambiada** en `screen.spec.ts`, también en rojo. Agregué 4 capturas.
La E2E pasó de **166/166** a **180: 165 en verde y 15 en rojo**. `npm run check` pasa antes y después. Las razones de los 15 rojos son las esperadas.
**El plan se confirma:** las medidas verticales no dependen de la familia de letra en lo que prueban estas pruebas, así que no hizo falta fijar la letra. No leí `src/` ni hice commits.

## Archivos tocados
| Archivo | Cambio |
|---|---|
| `tests/e2e/didactic-screen.spec.ts` | +14 pruebas de TC-061 (29 → 43). Comentario inicial al día |
| `tests/e2e/screen.spec.ts` | Prueba "campo de 2 a 5 líneas": campo vacío de 86–95 a **80–85 px**, y su comentario. El resto no cambia |
| `tests/e2e/captures.spec.ts` | +4 capturas: estados 2 y 2b a 390 × 427, en claro y oscuro |
| `evidence/tester-e2e-lote-3.txt` (nuevo) | Notas de las corridas |

## Cobertura
| Caso | Prueba (cuántas) en `didactic-screen.spec.ts` | Tipo | Restricción | Resultado y razón del rojo |
|---|---|---|---|---|
| TC-061 | Aproximación: campo vacío, "pingüino", "la casa⏎el sol" y 2 líneas porque el texto pasa de renglón (4) | E2E | C-012 (vacío) | **Rojo:** Números y Otros terminan en **432,58 px** (≤ 417) |
| TC-061 | Espacios a 390 y 320: 8 · 8 · 8 · 12 · 12 entre filas y columnas (2) | E2E | — | **Rojo:** arriba 12 (8), título → etiqueta 16 (8), campo → fichas 20 (12) |
| TC-061 | Campo a 390 y 320: relleno 8 y 12, alto 80–85 (2) | E2E | — | **Rojo:** relleno `12px` arriba y abajo; alto 90 |
| TC-061 | Tope a 390 y 320: 176 ±1 con 5, 6 y 8 líneas (2) | E2E | A-001 | **Rojo:** con 5 líneas mide 8 px más |
| TC-061 | Ficha a 390, 320, **359 y 360**: relleno de los 4 lados y alto 104 (4) | E2E | — | **Rojo:** relleno `12px` arriba y abajo; a 390 y 360, además, alto 109 |
| TC-058 | `screen.spec.ts`, campo de 2 a 5 líneas (1, cambiada) | E2E | — | **Rojo:** el campo vacío mide 90 (≤ 85) |
| TC-061, TC-062 (criterio) | Fotos del iPhone | Manual | C-012 | Lote 4, P-7. **La aproximación no cumple CA-20** |

### Controles
- **Ninguna de las 14 nuevas es de control.** Dentro de ellas ya pasan: etiqueta → campo (8), separación entre fichas (12), relleno lateral del campo (12) y de la ficha, alto 104 a 320 y 359, y las posiciones del campo y de la 1.ª fila.
- **Deben seguir en verde con P-5:** TC-059 (ninguna letra baja), TC-060, TC-063, TC-064, `group-look.spec.ts` y las otras 9 de `screen.spec.ts` (incluye ficha ≥ 104 px).
- **Las 4 capturas nuevas son de control:** pasan hoy. No exigen que las fichas quepan, para que el designer reciba la captura aunque no quepan.
- No hay pruebas `*-later`.

## Letra y medidas verticales (lección del lote 2)
Con el CSS del plan inyectado, medí 7 familias muy distintas (la de la app, Verdana, Georgia, Courier New, Times New Roman, Impact y Segoe Script). "Consonantes" varió de 98 a 144 px de ancho.

| Ancho | Resultado |
|---|---|
| 390 px | En las 7: mismas posiciones y altos; la 2.ª fila termina en **394,98 px**. Campo 82 px, fichas 104 |
| 320 px | Igual en 6. Con Courier New la etiqueta ocupa 2 líneas y el final baja a 418,38. Ninguna prueba exige la posición final a 320: miden separaciones entre elementos |

- **Por eso no usé la letra fijada.** Ninguna medida nueva depende de un ancho de texto, salvo que la etiqueta quepa en 1 línea a 390 (hay 358 px; con Courier New cupo).
- **El caso "pasa de renglón"** no usa una frase fija. La prueba agrega "sol" hasta que aparece la 3.ª línea y quita el último: la 2.ª queda llena con cualquier letra. Según la letra, el texto puede pasar de 50 caracteres; aquí se prueba el alto del campo, no CA-20. No usa la frase de 50, como pide el plan.
- **Límite:** en Windows no probé DejaVu, la letra que deduje para la CI. Se confirma con la CI.

## Prueba de las pruebas
El CSS del plan se agregó desde las pruebas al final del HTML servido, antes de que arrancara la app, y después se retiró.

| Etapa | Resultado |
|---|---|
| CSS completo de P-5 | `didactic-screen` + `screen` + `group-look`: **77/77**. Capturas: **20/20** |
| Daño: sin el `max-height` nuevo | En rojo las 2 del tope y la de `screen.spec.ts`: con 6 líneas crece 8 px de más |
| Daño: sin el ajuste angosto después de `.count` (L-041) | En rojo la ficha a 320 y 359 (TC-061) y el relleno de TC-064 a 320 y 359 |

- Los dos daños se corrieron juntos: 7 en rojo y 46 en verde; cada falla corresponde a su daño.
- **Corregí una prueba mía durante el rojo:** la del relleno de la ficha esperaba cada valor por separado y terminaba por tiempo límite (30 s), con la razón mezclada. Ahora lee todo de una vez.
- **Margen de la aproximación:** entre 395 y 417 hay ≈ 22 px. Un P-5 a medias podría pasarla; para eso están las pruebas de cada medida.
- Grep de `TEMP` en `tests/`: sin resultados. Las corridas finales son posteriores a la limpieza.
- Esto prueba que las pruebas **pueden** pasar con el CSS del plan, no que la implementación del coder pase.

## Resultados de la ejecución
| Corrida (`--workers=2`) | Antes | Después |
|---|---|---|
| `npm run check` | pasa | pasa |
| E2E `iphone` | 166: **166 en verde** | 180: **165 en verde, 15 en rojo** |
| Capturas (ensayo en `test-results/`) | 16 (lote 2; no las corrí antes del cambio) | **20/20** |

- Cómo conté: la salida de las 180 se corta. `test-results/.last-run.json` lista 15 fallas, los 6 archivos sin rojos dan 127/127 y las razones las leí por grupos.
- Pruebas del coder: no corrí las unitarias.
- Regresión: la CI (la verifica el Manager). Con este commit en rojo, se espera la CI en rojo por esas 15.
- Evidencia: `_project/slices/VS-002/evidence/tester-e2e-lote-3.txt`.

## Capturas
Están todos los estados del lote 3 (§4), en claro y oscuro, 20 en total. Las nuevas son `estado-2-teclado-390x427-<modo>.png` y `estado-2b-teclado-390x427-<modo>.png`. Muestran solo los 427 px que deja libres el teclado, sin mover la pantalla; no dibujan el teclado ni las barras de Safari. En el ensayo revisé a ojo una (2b, claro, con el CSS del plan): se ven las 4 fichas completas y la frase en 2 líneas con la letra de Windows. No escribí en `evidence/capturas/`.

## E2E que el coder debe correr en su cierre
Además de `npm run check` y `npm run test:unit`:
1. Las del plan §4: `npx playwright test tests/e2e/didactic-screen.spec.ts tests/e2e/screen.spec.ts tests/e2e/group-look.spec.ts --project=iphone --workers=2` → **77/77**.
2. `npx playwright test --project=captures --output=_project/slices/VS-002/evidence/capturas/lote-3` → **20/20**.
3. Recomiendo además la suite completa, `npm run test:e2e -- --workers=2` → **180/180**.

## Fallos
| # | Caso | Clasificación | Cómo reproducirlo | Evidencia |
|---|---|---|---|---|
| — | Ningún defecto en este trabajo: los 15 rojos son el rojo esperado de P-5 | — | — | `tester-e2e-lote-3.txt` |

## Preguntas para el usuario o el Manager
Ninguna bloquea.
- Para el commit: los 3 archivos de `tests/e2e/`, este reporte y `evidence/tester-e2e-lote-3.txt`.
- El plan (P-5) nombra "cuatro casos" y el cuarto, "el campo en 2 líneas", no dice con qué texto. Lo leí como 2.ª línea por paso de renglón (el salto de línea ya es el tercero). **Recomiendo** dejarlo así.

## Fallo sin explicar
Ninguno.

## Lecciones propuestas
- Para llenar "2 líneas" sin depender de la letra, agregar palabras hasta que aparezca la 3.ª línea y quitar la última, en vez de fijar una frase. → VEGU
- Varias comprobaciones suaves que esperan (`expect.soft` con `toHaveCSS`) suman sus tiempos y pueden agotar el de la prueba: para valores fijos de estilo, leerlos juntos y compararlos una sola vez. → VEGU

STATUS: DONE
