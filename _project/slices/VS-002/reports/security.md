# Etapa 10

# Revisión de seguridad — VS-002 — ronda 1
**Fecha:** 2026-11-27 · **Rama revisada:** `feature/VS-002-imagenes-ninos` (HEAD `cf8bdcf`) vs. `main` · **Nivel:** Alto (aprobado por el usuario, `clasificacion-9c.md`)

## Resumen
Sin hallazgos **del cambio**: 0 Crítica, 0 Alta, 0 Media, 0 Baja. La slice solo cambia estilos (`src/styles.css`), cuatro clases en `index.html` y un comentario en `src/main.ts`; no agrega dependencias, configuración, peticiones ni almacenamiento. Las 4 imágenes son dibujos SVG fijos dentro del CSS: no llevan nada de lo que se escribe y no piden nada a internet (C-010 se mantiene). **Preexistente**: 12 avisos **moderados** de `npm audit`, todos en herramientas de desarrollo (`npm audit --omit=dev` = 0), ya registrados como DT-001 y DT-005; y la falta de encabezados de seguridad, ya registrada como DT-004 (Media). **No hay Crítica/Alta preexistente.**

## Resultado de las herramientas
| Revisión | Comando | Resultado |
|---|---|---|
| Secretos en el historial | `gitleaks git --redact --no-banner` | 129 commits revisados, ~1,73 MB: **no leaks found** |
| Secretos en los archivos | `gitleaks dir --redact --no-banner .` | ~1,95 MB revisados (incluye evidencia, el log de la CI y los reportes): **no leaks found** |
| Dependencias (todas) | `npm audit` | **12 moderadas**, 0 altas, 0 críticas. Dos cadenas: (1) `minimatch` 10.2.6 / 11.0.9 (GHSA-g3hv-75wg-m249, posible bloqueo por patrones; sin arreglo) que llega por `eslint` 10.5.0, `typescript-eslint` 8.72.1 (y sus 5 paquetes `@typescript-eslint/*`) y `@stryker-mutator/core` 10.1.1 (+ `vitest-runner`); (2) `qs` 6.15.1 (4 avisos de bloqueo, con arreglo transitivo) por `typed-rest-client` 2.3.1 ← Stryker |
| Dependencias (producción) | `npm audit --omit=dev` | **found 0 vulnerabilities** |
| Origen de los paquetes con aviso | `npm ls typed-rest-client qs minimatch` | Todos cuelgan de `@stryker-mutator/core`, `eslint` y `typescript-eslint` (desarrollo). `npm explain` no está en mi lista permitida; `npm ls` da la misma cadena |
| ¿La slice cambió dependencias o configuración? | `git diff main...HEAD --name-only -- package.json package-lock.json vercel.json vite.config.ts playwright.config.ts .github` | **Vacío**: ningún cambio. Los avisos son preexistentes |
| Documentación (CSP de imágenes) | `npx ctx7@latest docs /mdn/content "…img-src…"` | `img-src` fija los orígenes permitidos de las imágenes y, si falta, se usa `default-src` (ver nota para DT-004) |

## Checklist OWASP
| # | Riesgo | Estado | Nota |
|---|---|---|---|
| 1 | Acceso a datos ajenos | No aplica | No hay servidor, API, sesión ni datos guardados (C-010, D-011). No apareció ningún archivo `api/` ni `vercel.json`, y en `src/` no hay `fetch`, `XMLHttpRequest`, `WebSocket` ni `sendBeacon` (búsqueda en `src/`: sin resultados) |
| 2 | Inyección | OK | En `src/` no hay `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `eval` ni `new Function`. El número se escribe con `textContent` (`src/main.ts:17`) y el campo con `value` (`:65`, `:75`, `:91`). El único estilo que `main.ts` escribe es la altura del campo, un número (`:9-11`). **SVG en el CSS** (`src/styles.css:137-152`): los 4 dibujos son texto fijo escrito en el archivo, sin ninguna parte que venga de lo que se escribe ni de la dirección; se usan como **máscara** (`::before`, `:175-183`), y una imagen SVG usada como imagen no ejecuta código. Revisé los 4: solo `path`, `ellipse`, `rect` y atributos de dibujo; sin `<script>`, sin `on…=`, sin `href` ni enlaces externos |
| 3 | Secretos | OK | gitleaks limpio en historial y archivos. La única variable nueva o usada es `E2E_BASE_URL` (no secreta, plan §2.3). La evidencia publicada y el log de la CI no traen tokens ni cabeceras de acceso a la preview (búsqueda de `token`, `bypass`, `authorization`, `_vercel_share`, `VERCEL_` en `_project/slices/VS-002/`: solo coincidencias de la palabra "token" de diseño) |
| 4 | Dependencias vulnerables | OK (del cambio) · Preexistente registrado | La slice no agrega ni cambia paquetes (plan §2.2: "Ninguna"; diff de `package*.json` vacío). Los 12 moderados son de desarrollo y ya están en **DT-001** (`minimatch` por `eslint` / `typescript-eslint`) y **DT-005** (`qs` y `minimatch` por Stryker). Nada llega a la app publicada (`--omit=dev` = 0) |
| 5 | Autenticación y sesiones | No aplica | No hay inicio de sesión (C-010) |
| 6 | Entradas del usuario | OK | El filtro (`src/inputFilter.ts`) y el conteo (`src/counting.ts`) no cambiaron; el diff de `src/main.ts` es solo comentario (3 líneas). Lo escrito no llega a ningún HTML, CSS ni dirección. No hay redirecciones |
| 7 | Configuración | Preexistente registrado | Sigue sin `vercel.json` ni encabezados de seguridad: **DT-004** (Media), sin cambio por esta slice. Sin `vite.config.*`: Vite no publica mapas de código. La barra de herramientas de Vercel se apagó en las previews (lote 4, commit `5078227`) y TC-055 publicada lo vigila: no queda ningún script de otro sitio en la preview. Previews sin protección por D-013 (no hay datos): no es hallazgo. Ver la nota para DT-004 en "Deuda técnica propuesta" |
| 8 | Privacidad en logs | OK | En `src/` no hay `console.*`. El único `console.log` de la slice está en una prueba del breaker-code que **no** está en la rama (vive en su carpeta, `breaker-code.md` nota final; `git diff --stat` no muestra `tests/unit/`) |
| 9 | Inyección de prompt | No aplica | Sin IA (C-009) |
| 10 | Datos de prueba | OK | Las pruebas usan palabras de ejemplo ("casa", "pingüino", "¡Hola, 2026! 😀", frases inventadas); no hay base de datos. Las fotos del iPhone (P-7) muestran solo la app, la hora, la batería y la dirección de la preview, que incluye el nombre de la cuenta de Vercel (`jdrodriguez1000-…-projects`), el mismo nombre público del repositorio en GitHub (D-004). Sin notificaciones ni datos personales a la vista en las fotos revisadas (`p7-2a-claro.jpg`, `p7-5-frase-larga-produccion-oscuro.jpg`). **No verificado:** los metadatos internos de los JPG (ubicación): no tengo herramienta permitida para leerlos; el tamaño (591 px de ancho) sugiere que pasaron por una app de mensajería, que suele quitarlos |

**C-010 (nada se envía ni se guarda), revisado aparte:** el cambio no agrega ninguna petición: las imágenes son direcciones `data:` dentro del CSS, que el navegador lee del propio archivo. Lo respaldan pruebas en verde: TC-055 local (control, P-3) y **publicada** (P-6, `tests/e2e/published.spec.ts`: toda petición va al origen de la preview o es `data:`, ninguna lleva "casa" en dirección, cuerpo, cabeceras ni mensajes de socket, y `expectNothingStored` comprueba `localStorage`, `sessionStorage`, cookies, `indexedDB` y cachés antes y después de recargar). `expectNothingStored` es copia fiel de las dos revisiones que reemplaza (DT-008), así que la protección no se debilitó.

## Hallazgos
| # | Severidad | Origen | Archivo:línea | Qué pasa (tipo de fallo) | Cómo podría aprovecharse | Cómo se corrige |
|---|---|---|---|---|---|---|
| — | — | — | — | Sin hallazgos nuevos | — | — |

Lo preexistente se cita, no se repite: **DT-001** (Media), **DT-004** (Media), **DT-005** (Baja), siguen abiertas y esta slice no las empeora.

## Deuda técnica propuesta (Media / Baja)
- **Nota para DT-004 (no es DT nueva; agregarla a su texto):** cuando se cree `vercel.json` con `Content-Security-Policy`, las 4 imágenes de VS-002 son direcciones `data:` usadas como imagen (máscara CSS), y una política con solo `default-src 'self'` o `img-src 'self'` no las permite: **las imágenes desaparecerían**. La política debe incluir `img-src 'self' data:` (y `style-src 'self'` alcanza, porque el CSS sale en archivo propio). Verificar en ese momento, en la documentación vigente, que las máscaras CSS se rigen por `img-src` (Context7 confirmó que `img-src` rige las imágenes y cae en `default-src` si falta; no mostró el caso exacto de `mask`). Lo detectaría la prueba publicada: `expectImagesPainted` de TC-050/TC-053 cuenta los píxeles pintados — Media (igual que DT-004) — al atender DT-004.
- **Nota para DT-001 / DT-005 (sin cambio de severidad):** el conteo actual es 12 moderados (10 por la cadena de `minimatch`, 2 por la de `qs`); siguen solo en desarrollo. Ninguna acción nueva por esta slice.

## Lecciones propuestas
- **Al poner una política de seguridad de contenido, inventariar antes las fuentes de imagen, incluidas las `data:` dentro del CSS** — Por qué: VS-002 metió sus dibujos como `data:` en máscaras; una CSP estricta los borraría sin error visible. La prueba que cuenta píxeles pintados en la versión publicada es la que lo atraparía.
- **El breaker-code construyó la app y abrió WebKit dentro de `npx vitest run`** (rodeo consciente de la guarda, L-037). Es el mismo riesgo aceptado que DT-014 describe para el tester: un agente que ejecuta su propio código puede hacer más de lo que su lista de comandos sugiere. Propuesta: que DT-014 nombre también a los breakers cuando se lleve a VEGU (T-004) — Por qué: hoy DT-014 solo menciona al tester.

STATUS: DONE
