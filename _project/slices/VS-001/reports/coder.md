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

# Lote 2 — VS-001
**Fecha:** 2026-11-26 · **Rama:** feature/VS-001-contar-en-el-celular

## Pasos construidos
| Paso | Commits (test → feat → refactor) | Casos de prueba cubiertos | Razón del rojo |
|---|---|---|---|
| P-3 | test: `23e3567` (tester) → chore: `d0c47d8` → feat: `0dad16c` → refactor: no hizo falta | TC-001, TC-026, TC-031 (atributos y "cas ") | 10 de 10 de `screen.spec.ts` en rojo porque no existían el campo ni las fichas (`element(s) not found`; en TC-026, `Array []` en vez de los 4 nombres) |
| P-4 | chore: `b139b09` → test: `1a931cb` → feat: `981e9a5` → refactor: no hizo falta | TC-004 a TC-009, TC-032 (conteo), TC-039 (conteo) | Con el esqueleto en 0 fallaron en la aserción las 20 mías y las 25 del tester (se recibió 0 vocales y 0 consonantes) |

No escribí otra E2E y no toqué nada de `tests/`. En P-3 no corrí en rojo el archivo de capturas: no es una prueba de comportamiento.

## Explicación para el usuario
### P-3 — La pantalla
Ya está dibujada la pantalla aprobada: el título, la pregunta, el campo para escribir y las 4 fichas en 0. Todavía **no cuenta**: aunque se escriba, las fichas siguen en 0. Los colores, tamaños y espacios se definen una sola vez, con un nombre cada uno (los "tokens"), al comienzo de `src/styles.css`. Si el celular está en modo oscuro, solo cambian los valores de los colores. `src/main.ts` hace una sola cosa: agranda el campo de 2 a 5 líneas según el texto. Después de 5, el texto se desplaza por dentro. Archivos: `index.html`, `src/styles.css`, `src/main.ts`.

### P-4 — Contar vocales y consonantes
`countCharacters` recibe un texto y lo recorre letra por letra. Primero junta las letras que llegan en dos piezas (por ejemplo, la "n" y su virgulilla forman "ñ"). Luego lo pasa todo a minúsculas, así "ANA" y "ana" cuentan igual. Cada letra se busca en la lista de vocales o en la de consonantes. La "y" está en las consonantes. Números y "otros" siguen en 0 hasta P-5. La función todavía **no está conectada a la pantalla** (eso es P-6). Archivos: `src/counting.ts`, `src/counting.test.ts`. Para las pruebas rápidas se agregó la herramienta Vitest.

## Estado de las pruebas
Cierre del lote, corrido después de `981e9a5`:
| Suite | Comando | Resultado |
|---|---|---|
| Revisión estática (tipos y lint) | `npm run check` | ok |
| Unitarias | `npm run test:unit` | **45/45** en 2 archivos: 20 en `src/counting.test.ts` y 25 en `tests/unit/counting.test.ts` |
| E2E | `npm run test:e2e` | **11/11**: 10 de `screen.spec.ts` y 1 de `skeleton.spec.ts` |
| E2E afectadas | — | El paquete no indicó otras |
| Capturas | `npx playwright test --project=captures --output=_project/slices/VS-001/evidence/capturas/lote-2` | **6/6** |

No corrí `published.spec.ts`. No subí la rama.

## Líneas de app agregadas
**180** (`git diff --numstat 23e3567 HEAD -- index.html src`, sin pruebas), contando comentarios y líneas en blanco. Está bajo el límite de ~200 (estimado del plan: ~175).
| Archivo | Líneas agregadas |
|---|---|
| `src/styles.css` | 140 |
| `src/counting.ts` | 16 |
| `index.html` | 12 (y 1 quitada) |
| `src/main.ts` | 12 |

## Capturas
Carpeta base: `_project/slices/VS-001/evidence/capturas/lote-2/`
| Captura | Ruta dentro de la carpeta base |
|---|---|
| Estado 1, 390 × 844, claro | `captures-TC-001-—-captura-estado-1-vacio-390x844-claro-png-captures/estado-1-vacio-390x844-claro.png` |
| Estado 1, 390 × 844, oscuro | `captures-TC-001-—-captura-estado-1-vacio-390x844-oscuro-png-captures/estado-1-vacio-390x844-oscuro.png` |
| Estado 1, 320 × 568, claro | `captures-TC-001-—-captura-estado-1-vacio-320x568-claro-png-captures/estado-1-vacio-320x568-claro.png` |
| Estado 1, 320 × 568, oscuro | `captures-TC-001-—-captura-estado-1-vacio-320x568-oscuro-png-captures/estado-1-vacio-320x568-oscuro.png` |
| Crecimiento del campo, 390 × 844, claro | `captures-P-3-—-captura-est-9ce57-ecimiento-390x844-claro-png-captures/estado-4-crecimiento-390x844-claro.png` |
| Crecimiento del campo, 390 × 844, oscuro | `captures-P-3-—-captura-est-2456f-cimiento-390x844-oscuro-png-captures/estado-4-crecimiento-390x844-oscuro.png` |

Abrí las 6: se ven los textos exactos, el orden 2 × 2 y los dos modos, y a 320 px no se corta nada. Es mi autorrevisión, no reemplaza la del designer.
- En las capturas de crecimiento, la frase de 100 caracteres ocupa **4 líneas**; la maqueta reserva 5 (`rows="5"`). El campo se ajusta al texto. El tope de 5 líneas lo comprueba `screen.spec.ts`.
- La letra de las capturas no parece ser SF Pro (el navegador simulado corre en Windows), así que los renglones pueden partirse distinto en el iPhone real.

La carpeta también tiene `.last-run.json`, que genera Playwright. Las capturas y este reporte quedan **sin commit**, para que el Manager decida qué incluir.

## Variables de entorno nuevas
- Ninguna.

## Desviaciones del plan
Ningún cambio de comportamiento ni de interfaces. Para que el Manager y el designer lo revisen:
- **Relleno lateral del campo:** la maqueta usa `14px` escrito a mano; `design-system.md` §4 dice que el relleno del campo es `--space-3` (12 px). Usé el token, así que hay 2 px de diferencia con la maqueta. Falta que el designer lo confirme o corrija uno de los dos documentos.
- **Medidas sin token:** 104 px (alto mínimo de la ficha), 3 px y 2 px (anillo de foco), 2 px (número–nombre), 480 px (ancho máximo) y los altos de línea quedaron escritos en el CSS. `design-system.md` da esos valores sin nombre de token (los altos de línea y las medidas coinciden con la maqueta).
- **`tsconfig.json`:** agregué `vite/client` a `types`. Sin eso, `npm run check` fallaba con `TS2882` en el `import "./styles.css"`.
- **Foco:** usé `.field:focus-visible`; la clase `.is-focus` es solo de la maqueta. No hay captura ni prueba que compruebe el anillo de foco en este lote (el estado 2 llega en el lote 3).

## Notas
- **Límite conocido:** el alto del campo se recalcula al cambiar el texto, no al girar el celular ni al cambiar el ancho. El plan no lo pide.
- `tests/unit/counting.test.ts` conserva los dos `@ts-ignore` que el tester puso mientras no existían Vitest ni `src/counting.ts`. Ya no deberían hacer falta; quitarlos le corresponde al tester (no lo probé).
- `npm install` sigue reportando **8 vulnerabilidades moderadas**, el mismo número del lote 1. No puedo correr `npm audit`; queda para el Manager o `security`.
- Los commits no llevan `Co-Authored-By`, como en el lote 1: la guarda prohíbe `<` y `>`.

## Fallo sin explicar
Ninguno.

## Lecciones propuestas
- Herramienta: la guarda de Bash también bloquea un `;` dentro del mensaje de un commit. Los mensajes se escriben sin `; & | < >`.

STATUS: DONE
