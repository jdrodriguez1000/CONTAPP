# Revisión inicial — VS-001
**Fecha:** 2026-11-26 · **Rama revisada:** `feature/VS-001-contar-en-el-celular` (HEAD `dc7b495`) vs. `main` · **Nivel de riesgo:** Alto (aprobado por el usuario) · **Alcance:** los 5 lotes, la ronda 1 de corrección de los breakers y el mini-lote de herramientas (D-020)

## Resumen
La app no tiene servidor, base de datos, inicio de sesión ni llamadas de red (C-010): no hay forma de ver ni cambiar datos de otra persona. El texto escrito se muestra solo con `textContent`/`value` (no hay inyección de HTML) y no se guarda en ningún lado. No hay secretos en el historial ni en los archivos. **0 Críticas, 0 Altas** → nada bloquea el DoD. Hay **4 hallazgos, todos del cambio y ninguno bloqueante**: 1 Media (faltan los encabezados de seguridad en Vercel) y 3 Bajas (avisos nuevos de dependencias que trae Stryker, permisos de la CI sin fijar, acciones de la CI fijadas por etiqueta). **No hay Críticas ni Altas preexistentes.** Las 12 moderadas de `npm audit`: 8 ya estaban en DT-001 y **4 llegan con Stryker** (detalle abajo).

## Resultado de las herramientas
| Revisión | Comando | Resultado |
|---|---|---|
| Secretos en el historial | `gitleaks git --redact --no-banner` | 87 commits revisados, **sin secretos** |
| Secretos en los archivos | `gitleaks dir --redact --no-banner .` | ~1,35 MB revisados, **sin secretos** |
| Dependencias (todas) | `npm audit` | **12 moderadas**, 0 altas, 0 críticas (todas en herramientas de desarrollo) |
| Dependencias (producción) | `npm audit --omit=dev` | **0 vulnerabilidades** (la app publicada no lleva dependencias) |
| Origen de los avisos | `npm ls typed-rest-client qs minimatch --all` | `minimatch@10.2.6` llega por `eslint`, `typescript-eslint` **y `@stryker-mutator/core`**; `qs@6.15.1` llega por `typed-rest-client@2.3.1`, que trae **`@stryker-mutator/core`** |

### Clasificación de las 12 moderadas
| Aviso | Paquetes que cuenta `npm audit` | ¿Llega con este cambio (D-020) o ya estaba? |
|---|---|---|
| `minimatch` — posible bloqueo por patrones (GHSA-g3hv-75wg-m249) | 8: `minimatch`, `eslint`, `typescript-eslint` y 5 paquetes `@typescript-eslint/*` | **Ya estaban** → DT-001 |
| El mismo aviso de `minimatch`, por un camino nuevo | 2: `@stryker-mutator/core`, `@stryker-mutator/vitest-runner` | **Nuevos con Stryker** (hallazgo 2). `npm audit` dice "No fix available" para Stryker (afecta a `@stryker-mutator/core` ≥ 6.4.2) |
| `qs` — 4 avisos de bloqueo del programa (GHSA-q8mj-m7cp-5q26, GHSA-x5fp-wj9c-mxmx, GHSA-4mjr-xmp4-gh2g, GHSA-6pq8-jhm2-2vcw) | 2: `qs`, `typed-rest-client` | **Nuevos con Stryker** (hallazgo 2). `npm audit` dice que hay arreglo sin cambiar versiones mayores |

`jscpd` 5.4.3 y `knip` 6.45.1 no traen avisos.

**Ojo con DT-001:** aunque se suban `eslint` y `typescript-eslint` como dice DT-001, `npm audit` **no llegará a 0**: el camino de `minimatch` que trae Stryker no tiene arreglo hoy. Conviene que DT-001 lo diga, para que nadie espere un 0 que no va a llegar. DT-001 sigue **abierta** (su slice de atención es esta, "con la revisión de security"): la decisión de atenderla ahora o moverla es del usuario.

## Checklist OWASP
| # | Riesgo | Estado | Nota |
|---|---|---|---|
| 1 | Acceso a datos ajenos | No aplica | No hay servidor, API, función de Vercel ni `fetch`/`XMLHttpRequest` en `src/` (C-010). No existe carpeta `api/`. |
| 2 | Inyección | OK | Sin base de datos. En `src/` no hay `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `eval` ni `new Function`. Los conteos se muestran con `textContent` (`src/main.ts:17`) y el texto con `value` (`src/main.ts:63`, `:73`, `:89`). El selector de `src/main.ts:17` se arma con los nombres fijos de los grupos, no con lo escrito. |
| 3 | Secretos | OK | gitleaks sin hallazgos en historial y archivos. No hay `.env*` (y `.env*` está en `.gitignore`). La CI usa solo `secrets.GITHUB_TOKEN`. `playwright.config.ts` lee `E2E_BASE_URL`, que es una dirección pública, no un secreto. |
| 4 | Dependencias vulnerables | Hallazgo | 12 moderadas, solo de desarrollo; 0 en producción. 4 nuevas con Stryker (hallazgo 2). Las 4 dependencias nuevas son paquetes conocidos y mantenidos, con versión exacta. **Observación:** no están en `plan.md` y D-020 todavía no aparece en `_persistence/decisions.md` (ni en la rama ni en `main`); su respaldo hoy es solo el paquete del Manager y los commits. Que el Manager registre D-020 al cerrar. |
| 5 | Autenticación y sesiones | No aplica | Sin inicio de sesión (C-010). La E2E comprueba que no se crean cookies, `localStorage`, `sessionStorage`, bases ni cachés (`tests/e2e/typing.spec.ts:138-145`, `tests/e2e/published.spec.ts:138-145`). |
| 6 | Entradas del usuario | OK | No hay servidor que valide; el filtro corre en el navegador y es la única barrera, lo que basta porque lo escrito no sale del celular ni se guarda. `src/inputFilter.ts`: tope de 100 grafemas (A-001), letras solo del español, quita invisibles y marcas sueltas. Las expresiones regulares no tienen cuantificadores anidados (sin riesgo de bloqueo por expresión regular). Un pegado muy grande se recorre una vez completo antes de recortar; en el peor caso solo haría lenta la propia pestaña de quien pega, no es un riesgo de seguridad. Sin redirecciones. |
| 7 | Configuración | Hallazgo | No existe `vercel.json`: la app sale sin encabezados de seguridad (hallazgo 1). Sin `vite.config.*`: Vite no publica mapas de código fuente por defecto. Previews sin protección por decisión (D-013), no es hallazgo mientras no haya datos. CI: hallazgos 3 y 4. |
| 8 | Privacidad en logs | OK | No hay `console.*` en `src/` ni en las pruebas. |
| 9 | Inyección de prompt | No aplica | La app no usa IA (C-009). |
| 10 | Datos de prueba | OK | Las pruebas y la evidencia usan palabras de ejemplo ("casa", "niño", "canción", emojis); no hay base de datos. Revisé muestras de las fotos del iPhone: solo la app y la barra de Safari con la dirección pública de la preview. |

**Cadena de entrega** (nivel Alto, fila 7): el cambio en `.claude/agents/reviewer.md` solo agrega a la lista del reviewer `npx jscpd src tests --min-lines 10`, `npx knip` y `npx stryker run`, y mantiene prohibidas `--reporters`, `--config`, `--output` y `--fix`. No abre escritura ni comandos peligrosos. `.gitignore` excluye `.stryker-tmp` y `/reports/`.

## Hallazgos
| # | Severidad | Origen | Archivo:línea | Qué pasa (tipo de fallo) | Cómo podría aprovecharse | Cómo se corrige |
|---|---|---|---|---|---|---|
| 1 | Media | Del cambio | (falta `vercel.json` en la raíz) | **Encabezados de seguridad ausentes:** la app publicada no envía `Content-Security-Policy` (con `frame-ancestors`), `X-Content-Type-Options: nosniff` ni `Referrer-Policy`. Hoy el riesgo real es bajo (no hay datos, sesión ni botones con consecuencias), pero la checklist lo clasifica como Media y, ante la duda, elijo el nivel más alto | Otra página podría mostrar Contapp dentro de un marco con su propio contenido encima, y si algún día entra contenido externo a la página no habría una regla del navegador que lo frene | Agregar `vercel.json` con `headers` para todas las rutas: `Content-Security-Policy: default-src 'self'; frame-ancestors 'none'` (comprobar antes con la E2E publicada que Vite no necesite algo más), `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`. Verificar la sintaxis vigente de Vercel en Context7 antes de escribirlo |
| 2 | Baja | Del cambio | `package.json:22-23` (`@stryker-mutator/core`, `@stryker-mutator/vitest-runner` 10.1.1) | **Dependencias de desarrollo con avisos moderados:** Stryker trae `minimatch@10.2.6` (aviso de DT-001, sin arreglo para Stryker) y `typed-rest-client@2.3.1` → `qs@6.15.1` (4 avisos de bloqueo del programa). Solo se usan en la máquina de quien revisa; no llegan a la app publicada (`--omit=dev` = 0) | Solo con un patrón o datos preparados a propósito, dados a la herramienta en la máquina de desarrollo, podría colgarse la herramienta; nada de esto toca a quien usa la app | Para `qs`: subir solo la versión transitiva en el lockfile (el aviso dice que hay arreglo sin cambio mayor), en un lote de mantenimiento con aprobación del usuario, y confirmar con `npm audit`. Para `minimatch` por Stryker: esperar una versión de Stryker que lo resuelva y aceptar el aviso mientras tanto |
| 3 | Baja | Del cambio | `.github/workflows/ci.yml:1-12` | **Permisos de la CI sin fijar:** el flujo no declara `permissions:`, así que su llave de GitHub (`GITHUB_TOKEN`) recibe los permisos por defecto del repositorio, que pueden incluir escritura | Si una herramienta del flujo quedara comprometida, podría usar esa llave para escribir en el repositorio | Agregar al inicio del flujo `permissions: contents: read` (y lo mínimo que pida `gitleaks-action`, p. ej. leer pull requests); verificar en Context7 qué pide la acción |
| 4 | Baja | Del cambio | `.github/workflows/ci.yml:15,17,32,46` | **Acciones fijadas por etiqueta, no por commit:** `actions/checkout@v6`, `actions/setup-node@v6`, `actions/upload-artifact@v5`, `gitleaks/gitleaks-action@v2`. Una etiqueta se puede mover a otro código | Si alguien tomara el control de una de esas acciones, la CI correría su código nuevo sin que nadie lo note | Fijar cada acción por su identificador de commit completo (con la versión como comentario). Puede hacerse junto con DT-002, que ya toca `gitleaks-action` |

## Deuda técnica propuesta (Media / Baja)
- DT-propuesta — Agregar `vercel.json` con los encabezados de seguridad (CSP con `frame-ancestors 'none'`, `nosniff`, `Referrer-Policy`) — Media — en VS-002 o en el primer lote de mantenimiento; obligatorio antes de que la app guarde o muestre datos de terceros.
- DT-propuesta — Avisos moderados que trae Stryker: `qs` vía `typed-rest-client` (con arreglo transitivo) y `minimatch` (sin arreglo) — Baja — `qs` en el próximo mantenimiento; `minimatch` cuando Stryker publique versión sin el aviso. Propongo además **ampliar el texto de DT-001**: resolverla no deja `npm audit` en 0 por el camino de Stryker.
- DT-propuesta — Declarar `permissions: contents: read` en `.github/workflows/ci.yml` — Baja — próximo mantenimiento (cambio de una línea).
- DT-propuesta — Fijar las acciones de la CI por commit en vez de etiqueta — Baja — junto con DT-002.

## Lecciones propuestas
- Al agregar una herramienta de desarrollo, correr `npm audit` antes y después y anotar en el reporte qué avisos llegan con ella — así el aumento de 8 a 12 no queda sin explicar (el coder no podía correr `npm audit`; conviene darle `npm audit` sin `fix` en su lista o pedirlo al security en el mismo lote).
- Toda dependencia nueva debe quedar escrita en el plan o en una decisión registrada antes de instalarse — D-020 se citó en commits sin estar todavía en `decisions.md`.

STATUS: DONE
