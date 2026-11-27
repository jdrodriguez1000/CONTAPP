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
