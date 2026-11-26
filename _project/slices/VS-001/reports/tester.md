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
