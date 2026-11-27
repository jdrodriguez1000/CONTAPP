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
