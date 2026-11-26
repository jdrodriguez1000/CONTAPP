# Lote 1 — VS-001
**Fecha:** 2026-11-26 · **Rama:** feature/VS-001-contar-en-el-celular

## Pasos construidos
| Paso | Commits (test → feat → refactor) | Casos de prueba cubiertos | Razón del rojo |
|---|---|---|---|
| P-1 | test: `e83804a` (tester) → chore: `97778c8`, `9c45840` → feat: `7d1b072` → refactor: no hizo falta | Prueba de ejemplo `P-1` (sin TC propio) | El título esperado era "Contapp" y se recibió "" |
| P-2 (solo mi parte) | test: `e83804a` (tester) → chore: `3305f8b` | Ninguno propio | No me corresponde: lo corre el Manager contra la preview |

| Hash | Mensaje |
|---|---|
| `97778c8` | chore(P-1): herramientas del proyecto (Vite, TypeScript, ESLint, Playwright) con index.html sin título |
| `9c45840` | chore(P-1): fijar finales de línea en LF |
| `7d1b072` | feat(P-1): la página muestra el título Contapp en la pestaña y en el h1 |
| `3305f8b` | chore(P-2): Node 24 para publicar, script test:published y proyecto published de Playwright |

`git add --renormalize .` no marcó ningún archivo existente: el commit `9c45840` solo trae `.gitattributes`. No toqué nada de `tests/`.

## Salida del rojo (P-1)
`npx playwright test tests/e2e/skeleton.spec.ts --project=iphone`, con `index.html` sin título ni `h1`:
```text
x  1 [iphone] › tests\e2e\skeleton.spec.ts:4:1 › P-1: la página abre con el título Contapp (5.7s)
Error: expect(page).toHaveTitle(expected) failed
Expected: "Contapp"
Received: ""
Timeout:  5000ms
  13 × locator resolved to <html lang="es-CO">…</html>
> 7 |   await expect(page).toHaveTitle("Contapp");
1 failed
```
Es un rojo válido: el proyecto compiló, el servidor arrancó y WebKit abrió la página. Falló solo porque faltaba el título.

## Salida del verde (P-1)
Mismo comando, después de agregar el título y el `h1`:
```text
ok 1 [iphone] › tests\e2e\skeleton.spec.ts:4:1 › P-1: la página abre con el título Contapp (412ms)
1 passed (3.6s)
```

## Explicación para el usuario
### P-1 — Esqueleto del proyecto
Armamos la "caja de herramientas". **Vite** muestra la página en el computador y la empaqueta para publicarla. **TypeScript** y **ESLint** revisan el código en busca de errores. **Playwright** abre la página en un iPhone simulado y la revisa como lo haría una persona. Primero corrimos la prueba con una página sin nombre y vimos que fallaba; después pusimos "Contapp" y pasó, así sabemos que la prueba sí vigila algo. `.gitattributes` hace que los archivos usen siempre el mismo tipo de salto de línea. Archivos principales: `index.html`, `package.json`, `playwright.config.ts`.

### P-2 — Publicar (mi parte: la configuración)
Le dijimos a la plataforma de publicación que use Node 24. También creamos el comando `test:published`, que prueba la dirección de internet en vez de la página del computador. Esa dirección se entrega en `E2E_BASE_URL`; cuando existe, Playwright no arranca un servidor local. La prueba normal ignora la prueba de la versión publicada. Todavía no se ha publicado nada: falta que el Manager suba la rama y que usted conecte Vercel. Archivos principales: `package.json`, `playwright.config.ts`.

## Estado de las pruebas
- Cierre del lote (después de `3305f8b`):
  - `npm run check`: ok.
  - Unitarias e integración: no aplica todavía (Vitest llega en P-4).
  - `npm run test:e2e`: **1/1** (solo `skeleton.spec.ts`; ya no toma `published.spec.ts`).
  - E2E afectadas: el paquete no indicó ninguna. El lote no tiene capturas.
- `npx playwright test --list` (solo lista, no ejecuta): `iphone` → `skeleton.spec.ts`; `published` → `published.spec.ts`.
- **No corrí** `published.spec.ts`.
- **Sin verificar:**
  - `npm run dev` ("abre en el computador una página que dice Contapp"): deja un servidor abierto y no puedo detener procesos. La E2E comprobó la página compilada (`build` + `preview`), no el modo `dev`.
  - Que no arranque el servidor local cuando existe `E2E_BASE_URL`: está en la configuración, pero no lo ejecuté. Se verá cuando el Manager corra `test:published`.

## Versiones instaladas de verdad (`package.json`, todas exactas)
| Paquete | Versión |
|---|---|
| `vite` | 8.3.5 |
| `typescript` | 6.0.2 |
| `@playwright/test` | 1.64.1 |
| `@types/node` | 24.19.4 |
| `eslint` | 10.5.0 |
| `@eslint/js` | 10.0.1 |
| `typescript-eslint` | 8.72.1 |

- **Respaldos de §2.2: ninguno usado.** `npm install` no mostró conflictos y `npm run check` no mostró avisos de TypeScript no soportado.
- WebKit: `npx playwright install webkit` terminó sin errores y las pruebas corrieron en el proyecto `iphone`.
- Node: no puedo ejecutar `node -v`. `npm install` no avisó incompatibilidad después de agregar `engines`, lo que sugiere Node 24, pero no está comprobado.
- `npm install` reporta **8 vulnerabilidades moderadas**. `npm audit` no está en mi lista de comandos, así que no sé en qué paquetes están. No corrí `npm audit fix`. Queda para el Manager o el agente `security`.

## Líneas de app agregadas
`index.html`: **11 líneas**. `src/`: 0 (todavía no existe).

## Variables de entorno nuevas
- `E2E_BASE_URL`: dirección publicada contra la que corre `test:published`. No es secreta y se pone al correr el comando. No creé archivo de ejemplo porque el plan (§2.3) dice que no va en ningún archivo.
- No hay secreto ni cabecera de bypass (opción B), y no creé `vercel.json`. No subí la rama ni toqué Vercel.

## Desviaciones del plan
- Ninguna.
- Nota sobre los commits: no llevan la línea `Co-Authored-By`. La guarda de Bash bloqueó el comando que la incluía porque prohíbe `<` y `>`, y mis reglas piden mensajes de una línea. No intenté esquivarla.
- Este reporte queda **sin commit**, para que el Manager lo incluya.

## Fallo sin explicar
Ninguno.

## Lecciones propuestas
- Definir si los commits de los agentes llevan `Co-Authored-By`. Hoy la guarda de Bash impide escribir la línea con su formato normal. → VEGU

STATUS: DONE
