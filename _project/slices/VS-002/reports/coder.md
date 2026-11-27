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
