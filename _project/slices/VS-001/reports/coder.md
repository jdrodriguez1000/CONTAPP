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

# Lote 3 — VS-001
**Fecha:** 2026-11-26 · **Rama:** feature/VS-001-contar-en-el-celular

## Pasos construidos
| Paso | Commits (test → feat → refactor) | Casos de prueba cubiertos | Razón del rojo |
|---|---|---|---|
| P-5 | test: `5662fdb` → feat: `0249f80` → refactor: no hizo falta | TC-010 a TC-015, TC-034, TC-035 (parte unitaria), TC-037 | `npx vitest run src/counting.test.ts`: **15 fallaron y 25 pasaron** de 40. Las 15 fallaron en la aserción porque `digit` y `other` seguían en 0 (la suma de TC-015 dio 4 en vez de 12). Las 25 que pasaron son las 20 del lote 2 y 5 controles: TC-013 (2), TC-014 (2) y TC-037 |
| P-6 | test: `854bb27` (tester) → feat: `a8132ab` → refactor: no hizo falta | TC-002, TC-003, TC-024, TC-025, TC-027 | `typing.spec.ts`: **4 fallaron y 3 pasaron** de 7. Las 4 de TC-002 y TC-003 fallaron porque los conteos se quedaban en `0/0/0/0`. Pasaron los controles TC-024, TC-025 y TC-027 |

- En el plan, TC-037 no figura entre los controles ("espacios y vacío son *control*"), pero es un caso de espacios: con el código de P-4 ya daba 3 y 3. Protege que el espacio que no se parte no termine contado en "otros".
- No toqué nada de `tests/` y no escribí otra E2E.

## Explicación para el usuario
### P-5 — Números, "otros" y espacios
La función que cuenta ahora conoce los 4 grupos. Recorre el texto **carácter por carácter como lo ve una persona**: el emoji de una familia está hecho por dentro de varias piezas, pero cuenta como 1. Si el carácter es solo un espacio, una tabulación o un salto de línea, lo salta. Si no, `classify` hace cuatro preguntas en orden: ¿es vocal?, ¿es consonante?, ¿es un número del 0 al 9? y, si nada de eso, es "otro". Por eso `²`, `½` o `1️⃣` son "otros" y ningún carácter visible queda sin grupo. Archivos: `src/counting.ts`, `src/counting.test.ts`.

### P-6 — Contar mientras se escribe
Conectamos el campo con la función de conteo. El navegador avisa cada vez que el campo cambia (al escribir, pegar o borrar). En ese momento la app hace dos cosas: ajusta el alto del campo y llama a `showCounts`, que cuenta todo el texto y escribe cada número en su ficha. No hay botón, espera ni animación. Tampoco se guarda nada, así que al recargar todo vuelve a 0. Archivo: `src/main.ts`.

**Si prueba la app ahora:** todavía no existen los filtros del lote 4. Una letra de otro idioma como "ç" entra y cuenta en "Otros", y se pueden escribir más de 100 caracteres. Eso lo resuelven P-7 y P-8.

## Estado de las pruebas
Cierre del lote, corrido después de `a8132ab`:
| Suite | Comando | Resultado |
|---|---|---|
| Revisión estática (tipos y lint) | `npm run check` | ok |
| Unitarias | `npm run test:unit` | **65/65** en 2 archivos: 40 en `src/counting.test.ts` y 25 en `tests/unit/counting.test.ts` |
| E2E del lote | `npx playwright test tests/e2e/typing.spec.ts --project=iphone` | **7/7** |
| E2E afectada | `npx playwright test tests/e2e/screen.spec.ts --project=iphone` | **10/10** |
| Capturas | `npx playwright test --project=captures --output=_project/slices/VS-001/evidence/capturas/lote-3` | **10/10** |

No corrí la E2E completa, `skeleton.spec.ts` ni `published.spec.ts`: el paquete no los pidió. No subí la rama.

## Líneas de app agregadas
**29 agregadas y 4 quitadas** (`git diff --numstat 854bb27 HEAD -- index.html src`, sin contar `counting.test.ts`). El plan estimaba ~45 y el límite es ~200.
| Archivo | Agregadas | Quitadas |
|---|---|---|
| `src/counting.ts` | 16 | 3 |
| `src/main.ts` | 13 | 1 |

## Capturas
Carpeta: `_project/slices/VS-001/evidence/capturas/lote-3/`, con 10 imágenes (cada una en su subcarpeta) y el `.last-run.json` que genera Playwright.
- Estados 1 (390 × 844 y 320 × 568), 2, 3 y crecimiento del campo, todos en claro y oscuro.
- Abrí 3 como autorrevisión: estado 2 claro ("pingüino": 4/4/0/0, con anillo de foco), estado 3 oscuro (2/2/4/4) y crecimiento claro, que ahora muestra 35/40/3/3 con la frase de 100 caracteres en 4 líneas. **Las otras 7 no las abrí.** No reemplaza la revisión del designer.
- Son capturas simuladas en Windows: lo que cabe en cada renglón se confirma en el iPhone real (L-010).

Las capturas y este reporte quedan **sin commit**, para que el Manager decida qué incluir.

## Variables de entorno nuevas
- Ninguna.

## Desviaciones del plan
- Ninguna.
- `src/main.ts` encuentra cada ficha por su `data-testid` (`count-vowel`, `count-consonant`…), que son parte de las interfaces públicas (§5.1). Así no hubo que cambiar `index.html`, que no está entre los archivos de P-6. Consecuencia: esos identificadores ahora también los usa la app, no solo las pruebas.
- Los commits no llevan `Co-Authored-By` (L-008).

## Fallo sin explicar
Ninguno.

## Lecciones propuestas
- Ninguna nueva. L-009 sirvió: los invisibles y los emojis compuestos se armaron con su código, y una búsqueda posterior no encontró ninguno (ni signos combinables) escrito tal cual en `counting.test.ts`.

STATUS: DONE

# Lote 4 — VS-001
**Fecha:** 2026-11-26 · **Rama:** feature/VS-001-contar-en-el-celular

## Pasos construidos
| Paso | Commits (test → feat → refactor) | Casos de prueba cubiertos | Razón del rojo |
|---|---|---|---|
| P-7 | aceptación: `8c63602` (tester) · test: `b897eff` → feat: `0552e17` → refactor: no hizo falta | TC-016 a TC-019, TC-029, TC-033, TC-035 (parte E2E), TC-036, TC-038, TC-040, TC-041 | `foreign-letters.spec.ts`: **26 fallaron y 6 pasaron** de 32. En los fallos que revisé, lo que debía rechazarse o limpiarse había entrado al campo. Las 6 que pasaron son los controles (TC-019 ×2, TC-035 ×2, TC-038 ×2). Unitarias, con `applyInput` como esqueleto que devolvía `nextText`: **23 fallaron y 9 pasaron** de 32, todas en la comparación. Las 9 son controles (lo que debe entrar o quedar igual) |
| P-8 | aceptación: `8c63602` (tester) · test: `4e94643` → feat: `eaa6459` → refactor: no hizo falta | TC-020 a TC-023, TC-028, TC-030, TC-042, TC-032 (largo), TC-039 (largo) | `max-length.spec.ts` (corrido ya con P-7): **17 fallaron y 3 pasaron** de 20. En los fallos que revisé, el texto pasaba de 100. Las 3 que pasaron son los controles (TC-020, reemplazar con 100, pegar 100 exactos). Unitarias, con `textLength` como esqueleto que devolvía `text.length`: **15 fallaron y 35 pasaron** de 50, en la comparación. Las 35 son las 32 de P-7 y 3 controles (texto vacío, largo con espacios, el límite es 100) |

- No toqué nada de `tests/` y no escribí otra E2E.

## Explicación para el usuario
### P-7 — Letras de otros idiomas no entran
Antes de aceptar un cambio, la app compara el texto de antes con el de ahora para encontrar **solo lo nuevo**, sin partir nunca un emoji por la mitad. Revisa lo nuevo carácter por carácter: un emoji entra completo; a lo demás le quita las piezas invisibles y une las letras que llegan en dos piezas ("n" + "~" → "ñ"). No entran las letras de otros idiomas, los números de otros alfabetos ni las tildes que llegan solas. Si no queda nada, el campo vuelve a como estaba, sin aviso y con el cursor donde empezaba lo nuevo. Mientras el teclado todavía está armando una letra, la app cuenta pero espera a que termine para filtrar. Archivos: `src/inputFilter.ts`, `src/main.ts`, `src/inputFilter.test.ts`.

### P-8 — Largo máximo de 100
La app mide el largo como lo ve una persona: un emoji de familia ocupa 1, y los espacios, tabulaciones y saltos de línea también ocupan lugar. De lo nuevo ya filtrado, agrega un carácter a la vez y para en el primero que haría pasar el texto de 100. Por eso, al pegar de más entra el comienzo, y al pegar en medio no se pierde el final que ya estaba. Lo que el filtro rechazó no ocupa lugar. Archivos: `src/inputFilter.ts`, `src/inputFilter.test.ts`.

**Para probar en la app:** escribir "ç" (no pasa nada), pegar "façade" (queda "faade") y, con la frase de 100 caracteres, intentar escribir una letra más (no entra).

## Estado de las pruebas
Cierre del lote, corrido después de `eaa6459`:
| Suite | Comando | Resultado |
|---|---|---|
| Revisión estática (tipos y lint) | `npm run check` | ok |
| Unitarias | `npm run test:unit` | **115/115** en 3 archivos: 50 en `src/inputFilter.test.ts`, 40 en `src/counting.test.ts` y 25 en `tests/unit/counting.test.ts` |
| E2E del lote | `npx playwright test tests/e2e/foreign-letters.spec.ts tests/e2e/max-length.spec.ts --project=iphone` | **52/52** (32 + 20) |
| E2E afectadas | `npx playwright test tests/e2e/screen.spec.ts tests/e2e/typing.spec.ts --project=iphone` | **17/17** (10 + 7) |
| Capturas | `npx playwright test --project=captures --output=_project/slices/VS-001/evidence/capturas/lote-4` | **12/12** |

A los comandos de Playwright les agregué `--reporter=list`. No corrí la E2E completa, `skeleton.spec.ts` ni `published.spec.ts`: el paquete no los pidió. No subí la rama.

## Líneas de app agregadas
**102 agregadas y 2 quitadas** (`git diff --numstat 3782e9d HEAD`, sin contar las 170 de `inputFilter.test.ts`). El plan estimaba ~90 y el límite es ~200.
| Archivo | Agregadas | Quitadas |
|---|---|---|
| `src/inputFilter.ts` | 78 | 0 |
| `src/main.ts` | 24 | 2 |

## Capturas
Carpeta: `_project/slices/VS-001/evidence/capturas/lote-4/`, con 12 imágenes (cada una en su subcarpeta) y el `.last-run.json` de Playwright.
- Como autorrevisión abrí 2: estado 4 claro (frase de 100 caracteres en 4 líneas, 35/40/3/3, sin aviso) y estado 3 oscuro (2/2/4/4). **Las otras 10 no las abrí.** No reemplaza la revisión del designer.
- Son capturas simuladas en Windows: lo que cabe en cada renglón se confirma en el iPhone real (L-010).

Las capturas y este reporte quedan **sin commit**, para que el Manager decida qué incluir.

## Variables de entorno nuevas
- Ninguna.

## Desviaciones del plan
- Ninguna. Los commits no llevan `Co-Authored-By` (L-008).

## Lo que no queda verificado y bordes para el Manager
Los puntos 2 a 4 los deduzco de leer el código; no tienen prueba.
1. **Teclado "componiendo" (R-3):** ninguna prueba automática pasa por `isComposing` ni por `compositionend`. Falta comprobarlo en el iPhone real (lista manual de P-10, punto 2); conviene escribir tildes también en esta preview.
2. **Reemplazar una selección por algo que empieza igual:** con "casa", seleccionar "as" y pegar "aç" dejaría "casa" (cursor después de "ca") y no "caa". `applyInput` recibe solo el texto de antes, el de ahora y el cursor (§5.2): no sabe qué estaba seleccionado, toma esa "a" como si no hubiera cambiado y, como lo demás se rechaza, devuelve el texto anterior (regla 5).
3. **Regla 3 aplicada al pie de la letra, dos huecos posibles:** (a) cualquier carácter que contenga `U+20E3` entra completo, así que una "ç" con ese signo pegado entraría; (b) un espacio y una tilde combinable pegados **juntos** forman un solo carácter que no *empieza* por el signo, así que entraría, aunque C-015 dice que un signo de tilde suelto no entra. No los cambié: si deben rechazarse, hace falta ajustar el plan.
4. **Supuesto del plan (§5.2, paso 1):** lo nuevo termina en el cursor. No probé cambios que podrían no cumplirlo (deshacer, arrastrar texto, un corrector que cambie texto después del cursor). Sirve como idea de ataque para los breakers.

## Fallo sin explicar
Ninguno.

## Lecciones propuestas
- Ampliar L-009 al código de la app: la herramienta de escritura convirtió `⃣` en el carácter invisible dentro de `src/inputFilter.ts`. Usar la forma `\u{20E3}` (quedó escrita como código) y buscar `\p{Mn}`, `\p{Me}` y `\p{Cf}` después de escribir — un invisible en una expresión regular no se puede revisar a simple vista.

STATUS: DONE

# Lote 5 — VS-001
**Fecha:** 2026-11-26 · **Rama:** feature/VS-001-contar-en-el-celular

## Pasos construidos
Solo P-9. P-10 no es del coder.

| Paso | Commits (test → feat → refactor) | Casos de prueba cubiertos | Razón del rojo |
|---|---|---|---|
| P-9 | `5674a5a` (`ci(P-9)`), un solo commit | Ninguno propio | No hay rojo: no admite prueba automática previa. El respaldo es el criterio (a), (b) y (c) del plan, **que todavía no está verificado**: lo comprueba el Manager |

## Explicación para el usuario
### P-9 — Pruebas automáticas en cada cambio (CI)
La CI es un computador prestado por GitHub que repite las revisiones cuando se sube un cambio, sin que nadie tenga que acordarse. Las instrucciones están en un solo archivo, `.github/workflows/ci.yml`. Tiene dos trabajos separados: `checks` (¿la app está bien?) y `secrets` (¿se coló alguna contraseña o clave?). Cada trabajo arranca en un computador Linux limpio.

**Cuándo corre (`on`):** al subir cambios a cualquier rama (`push`) y en un pull request (la solicitud de fusión) hacia `main`. Con un pull request abierto, un mismo cambio puede mostrar dos corridas, una por cada motivo.

**Trabajo `checks`**, en orden. Si un paso falla, los siguientes de la lista normal no corren:
1. `actions/checkout@v6`: descarga el código del proyecto.
2. `actions/setup-node@v6`: instala Node 24. `cache: npm` guarda los paquetes descargados para tardar menos la próxima vez.
3. `npm ci`: instala exactamente las versiones anotadas en `package-lock.json`.
4. `npm run check`: revisa los tipos y el estilo del código.
5. `npm run test:unit`: corre las pruebas de las reglas, sin navegador.
6. `npx playwright install --with-deps webkit`: instala el motor de Safari y lo que Linux necesita para usarlo.
7. `npm run test:e2e`: usa la app en el iPhone simulado. Corre solo el proyecto `iphone`, así que `captures.spec.ts` y `published.spec.ts` no corren aquí.
8. `actions/upload-artifact@v5`: solo si algo falló (`if: failure()`), guarda la carpeta `playwright-report/` para descargarla y ver qué pasó. Si el fallo ocurre antes de las E2E, no habrá reporte que guardar.

**Trabajo `secrets`:**
1. `actions/checkout@v6` con `fetch-depth: 0`: descarga **todo el historial**, porque una clave borrada hoy sigue visible en un commit viejo. Esto importa más ahora que el repositorio es público.
2. `gitleaks/gitleaks-action@v2`: busca claves y contraseñas. `GITHUB_TOKEN` es un permiso temporal que GitHub crea solo para cada corrida; no hay que crearlo ni guardarlo. Según el plan y la decisión del usuario (repositorio público, 2026-11-26), no necesita licencia.

## Verificación de versiones y entradas (Context7, 2026-11-26)
| Qué | Resultado |
|---|---|
| `actions/checkout@v6` y `fetch-depth: 0` (todo el historial) | Confirmado en el README de la v6 |
| `actions/setup-node@v6`, `node-version: 24`, `cache: npm` | Confirmado en el README de v6.5.0 |
| `actions/upload-artifact@v5` | La v5 existe: el README de la v6 la menciona. No leí el README propio de la v5; las entradas `name` y `path` las vi en la documentación actual (v7) |
| `GITHUB_TOKEN` como `${{ secrets.GITHUB_TOKEN }}` | Confirmado en la documentación de GitHub Actions |
| `gitleaks/gitleaks-action@v2` | **No verificado.** Context7 no tiene ese repositorio y la búsqueda en código fuente está apagada. La documentación de Gitleaks solo muestra un ejemplo con la acción en **v3**, con `fetch-depth: 0` y `GITHUB_TOKEN` (y `GITLEAKS_LICENSE` para su caso con licencia). Tampoco pude confirmar en la documentación que una cuenta personal no necesite licencia |

Usé las versiones del plan. La primera corrida dirá si `gitleaks-action@v2` funciona.

## Estado de las pruebas
Corrido en local antes del commit, con `ci.yml` ya escrito:
| Suite | Comando | Resultado |
|---|---|---|
| Revisión estática (tipos y lint) | `npm run check` | ok |
| Unitarias | `npm run test:unit` | **115/115** en 3 archivos |
| E2E completa (proyecto `iphone`) | `npm run test:e2e` | **70/70**, el resumen no muestra saltadas |

Las cifras coinciden con las del cierre del lote 4 (115 unitarias; 52 + 17 = 69 E2E de los cuatro archivos, más 1 de `skeleton.spec.ts` = 70).

- Estas pruebas no ejecutan `ci.yml`: **no demuestran que la CI funcione**. No validé el archivo con ninguna herramienta de GitHub Actions.
- No comprobé antes si el puerto 4173 estaba libre; en local, Playwright reutiliza un servidor ya abierto (R-6).

## Lo que falta (Manager)
- No subí la rama.
- Criterio de P-9: (a) sin corridas antes de subir; (b) tras subir, los dos trabajos y todos sus pasos en verde (el paso de subir el reporte debe aparecer omitido, porque solo corre si hay fallo); (c) 115 unitarias y 70 E2E, ninguna saltada.
- En (b), mirar también las advertencias de la corrida (ver los dos puntos siguientes).
- **Posible advertencia por Node 20:** la documentación dice que `upload-artifact@v5` corre por defecto sobre Node 20 (la v6 pasa a Node 24). Es la versión de la propia acción, no la de la app. Por lo que sé de GitHub, sin haberlo verificado hoy, Node 20 está en retiro; `gitleaks-action@v2` podría estar en el mismo caso. No cambié versiones: si la corrida avisa o falla, subirlas requiere ajustar el plan.
- **Permisos del token:** el plan no pide un bloque `permissions` y no lo agregué, así que rigen los permisos por defecto del repositorio. Conviene que la revisión de seguridad lo mire. No probé cómo se comporta Gitleaks con esos permisos en un pull request.

## Variables de entorno nuevas
- Ninguna. `CI` la define GitHub Actions y `GITHUB_TOKEN` lo crea GitHub en cada corrida.

## Desviaciones del plan
- Ninguna en `ci.yml`.
- Commit: usé un segundo `-m` para una línea `Co-Authored-By: Claude Sonnet 5.5` **sin correo** (la guarda no admite `<` ni `>`). No sigue del todo la regla de mensaje de una línea, y difiere de los lotes anteriores, que no la llevan (L-008). No reescribí el commit.
- Este reporte queda **sin commit** (el encargo pedía un solo commit).

## Fallo sin explicar
Ninguno.

## Lecciones propuestas
- Para verificar versiones de GitHub Actions, Context7 no basta con todas: `gitleaks-action` no está indexado. Conviene decidir en el plan con qué otra fuente se confirma — evita dejar una versión sin verificar.

STATUS: DONE

# Ronda 1 — VS-001
**Fecha:** 2026-11-26 · **Rama:** feature/VS-001-contar-en-el-celular (sin subir)

## Resumen
En pantalla, los 7 hallazgos quedan corregidos según las 43 E2E de la ronda (WebKit simulado, no el iPhone real). **La ronda no está terminada:** quedan **4 unitarias de TC-047 en rojo**. Necesitan una decisión (ver "Bloqueo").

## Hallazgo → pasos y commits
| Hallazgo | Casos | Commits (test → feat) | Razón del rojo que vi | Estado |
|---|---|---|---|---|
| 1. Volver atrás | TC-043 | P-6: rojo `c9f7515` (tester) → `812bfc8` | Volvía "casa 12" | Verde |
| 4. "ſ" | TC-046 | `ab2285d` → `11dd3ce` | Entraba "caſa" | Verde |
| 6 y 7. Tildes sobre algo que no es letra | TC-048, TC-049 | `70d83c6` → `dfb5ba4` | La tilde entraba con la base (4 rojos; el dígito ajeno + tilde era control) | Verde |
| 3. Pase libre por U+20E3 o emoji | TC-045, TC-049 | `ef6d423` → `e550a05` | Entraban `ç⃣`, `1⃣` y lo pegado delante o detrás del emoji (16 rojos) | Verde |
| 2a. Cambio que no termina en el cursor | TC-044 | `6491280` → `0c0dbe7` | Entraban la "ç" y el carácter 101 (3 rojos; borrar lejos del cursor era control) | Verde |
| 2b. Deshacer y rehacer | TC-044 | rojo `c9f7515` (tester) → `fda4d0f` | "casacasacasaç" y, tras 2a, "casacasacasa" | Verde |
| 5. Pegar sobre una selección | TC-047 | rojo `c9f7515` (tester) → `a6f81c6` | Quedaba el texto viejo (4 E2E) | **E2E en verde; 4 unitarias en rojo** |

- Los hallazgos 6 y 7 son una sola regla (D-018): tienen un commit de prueba y uno de código.
- En 1, 2b y 5 el cambio está en `src/main.ts`, que usa la pantalla (Vitest corre en `node`). Su rojo es el commit del tester; no escribí pruebas que lo repitan.
- No hubo refactor.

## Bloqueo: las 4 unitarias de TC-047
`applyInput(anterior, nuevo, cursor)` no recibe qué estaba seleccionado. Con `("casa", "caça", 3)` hay dos acciones posibles:
- **Pegar "aç" sobre "as":** TC-047 pide "caa".
- **Escribir "ç" sobre la "s":** el plan §5.1 pide que quede "casa".

Con las pruebas pasa lo mismo:
- Mi prueba anterior `P-7: rejected input over a selection keeps the text` pide que `("casa", "cça", 2)` deje "casa".
- TC-047 pide que `("casa", "caç", 3)` deje "ca".

Las dos entradas tienen la misma forma: se reemplazan dos letras por una "ç". No encontré una regla que cumpla ambas sin ser un truco hecho a la medida de las pruebas. Es una deducción leyendo el código y las pruebas.

**Cómo quedó la pantalla:** `main.ts` anota la selección en `beforeinput`. Si el cambio la reemplazó, llama a `applyInput` con el texto aceptado **sin la parte seleccionada**. Si no entra nada, deja el texto como estaba. Con eso pasan las E2E de TC-047 y la de TC-018 ("ç" sobre una selección no borra nada). La interfaz no cambió.

**Opciones (decide el Manager o el usuario):**
- **B (recomendada):** el tester ajusta las 4 unitarias para llamar como llama la pantalla, p. ej. `applyInput("ca", "caça", 3)` → "caa". Se precisa en §5.2 que, si hubo selección, `previousText` va sin esa parte. No debería requerir más código. No lo corrí como unitaria, pero las E2E pasan por ese camino. **Contra:** cambian pruebas de aceptación y el significado de un parámetro.
- **A:** `applyInput`, ante un reemplazo del que no entra nada, quita solo lo rechazado. Cambio mi prueba anterior y el paso 5 de §5.2. Las pruebas de TC-047 quedan intactas. **Contra:** si algún camino del iPhone no dispara `beforeinput`, escribir "ç" sobre una selección podría borrar texto.

Un cuarto parámetro con la selección no resuelve el choque: las unitarias llaman con tres.

## Explicación para el usuario
### P-6 — Volver atrás (`src/main.ts`)
Al tocar "atrás", el navegador puede volver a poner el texto viejo sin avisarle a la app. Por eso, cada vez que la página se muestra (`pageshow`), la app vacía el campo y pone las 4 fichas en 0.

### P-7 — El filtro (`src/inputFilter.ts`)
Solo dos cosas entran completas: la tecla de número exacta (como 1️⃣) y el emoji. Lo que venga pegado delante se revisa aparte. Las tildes y letras pegadas detrás se quitan. Sobre un espacio, un número o un signo, las tildes se quitan y queda la base. Las letras del español se comparan una por una, así que la "ſ" ya no pasa por "s". Si el cambio no termina donde está el cursor, también se revisa.

### P-7 — Deshacer y selección (`src/main.ts`)
El navegador guarda un historial para deshacer. Cuando la app corrige el campo, ese historial queda desfasado y repetía texto. Desde ese momento, deshacer y rehacer ya no cambian nada. La app también recuerda qué estaba seleccionado, para saber qué se pegó de verdad.

## Líneas de app (`src/`, sin pruebas; `git diff --numstat c9f7515`)
| Archivo | Agregadas | Quitadas |
|---|---|---|
| `src/inputFilter.ts` | 33 | 13 |
| `src/main.ts` | 49 | 3 |
| **Total** | **82** | 16 |

Además, `src/inputFilter.test.ts` suma 82 líneas de pruebas. `index.html` no cambió.

## Estado de las pruebas
- Revisión estática (`npm run check`): ok.
- Unitarias completas (`npm run test:unit`): **203/207. Fallan 4**, las de TC-047 en `tests/unit/round1.test.ts`. Los controles pasan.
- E2E (`npx playwright test` con `round1`, `typing`, `foreign-letters`, `max-length`, `screen` y `skeleton`, `--project=iphone`): **113/113**, incluidas las 43 de `round1`.
- No modifiqué las pruebas del tester ni mis pruebas anteriores. No corrí capturas.

## Variables de entorno nuevas
- Ninguna.

## Desviaciones del plan (necesitan aprobación)
- **`previousText` con selección:** la pantalla lo pasa sin la parte seleccionada. §5.2 lo define como el texto aceptado.
- **Deshacer y rehacer:** quedan sin efecto después de la primera vez que la app reescribe el campo (un rechazo, un filtrado o unir una letra en dos piezas). Duran así hasta recargar. TC-044 no exige que deshacer funcione, pero el usuario debe saberlo.
- **Detrás de un emoji:** además de las marcas, quito las letras que se pegan a él (probé U+FF9E y U+0E33). §5.2 solo habla de signos combinables; me basé en C-011 y L-023.
- **Commits:** de una línea y sin `Co-Authored-By`, porque la guarda no admite `<`, `>` ni saltos de línea.

## Notas sin verificar
- No probé en un iPhone real: "atrás", deshacer con gestos, composición del teclado, ni si `beforeinput` informa bien la selección. Conviene la comprobación manual de TC-043, TC-044 y TC-047.
- Si Safari devuelve la página completa desde memoria, `pageshow` la vacía, pero ese vaciado **no** marca el historial como desfasado. Deshacer ahí no está probado.
- Tras anular un deshacer, el cursor queda donde lo deje el navegador al reponer el texto; ninguna regla lo define.
- Un carácter "que se antepone" delante de una tecla de número no tiene regla propia: pasa por las reglas normales.
- Un emoji seguido de muchas piezas U+FE0F o U+200D las conserva y cuenta como 1. Es un borde que ya existía.

## Fallo sin explicar
Ninguno.

## Lecciones propuestas
- Antes de fijar en una prueba unitaria un caso que depende de la selección, comprobar que la firma de la función la distingue — con solo texto anterior, texto nuevo y cursor, dos acciones distintas dan la misma entrada.
- Si la app reescribe un campo, hay que decidir en el plan qué pasa con deshacer y rehacer — el historial del navegador queda desfasado.

STATUS: BLOCKED — decidir (Manager o usuario) entre la opción B (el tester ajusta las 4 unitarias de TC-047 y se precisa §5.2; recomendada) y la opción A (autorizar el cambio en `applyInput`, en mi prueba anterior y en §5.2), y aprobar las desviaciones.

## Ronda 1 — cierre
**Fecha:** 2026-11-26 · **Rama:** feature/VS-001-contar-en-el-celular (sin subir) · Cierre corrido sobre `fbf354e`.

### Bloqueo resuelto (aprobado por el usuario el 2026-11-26, según el encargo del Manager)
- **Opción B para TC-047:** el tester reescribió las 4 unitarias (`fbf354e`) para llamar `applyInput` como la pantalla. El plan §5.2 ya dice que, si hubo selección, `previousText` va sin esa parte (`8c81659`).
- **Deshacer y rehacer** sin efecto tras la primera reescritura: aceptado como deuda técnica DT-003. La limitación está en el plan §5.1. No encontré el texto "DT-003" en esta carpeta; su registro le corresponde al Manager.
- **Letras pegadas detrás de un emoji o una tecla:** se quitan; ya está en el plan §5.2.
- **Commits sin `Co-Authored-By`:** limitación conocida de la guarda (L-008).

Con esto, las desviaciones de la sección anterior quedan aprobadas.

### Cambios
- Ninguno en el código de la app ni en mis pruebas. Solo agrego esta sección.

### Cifras finales
| Comando | Resultado |
|---|---|
| `npm run check` | ok (tipos y lint) |
| `npm run test:unit` | **207/207** (4 archivos) |
| `npx playwright test` con `round1`, `typing`, `foreign-letters`, `max-length`, `screen` y `skeleton`, `--project=iphone` | **113/113**, incluidas las 43 de `round1` |

- La corrida E2E tardó 3,4 min; la anterior, con los mismos archivos, 44 s. No hubo fallos y no investigué la diferencia.
- No corrí la suite E2E completa ni las capturas.
- Las "Notas sin verificar" de arriba siguen igual: falta la prueba en un iPhone real.

### Fallo sin explicar
Ninguno.

STATUS: DONE
