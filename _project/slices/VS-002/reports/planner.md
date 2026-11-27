# Plan — VS-002

# Reporte del planner — VS-002
**Fecha:** 2026-11-27

## Resumen
El plan (`_project/slices/VS-002/plan.md`) tiene **7 pasos** en **4 lotes**. Los pasos son los 8 del esbozo aprobado sin el paso 5 (textos), que se quita porque el diseño no cambia ningún texto (F-003 §5.6). La correspondencia está en la tabla de §1 del plan: P-1 a P-4 = pasos 1 a 4 del esbozo; P-5 = paso 6; P-6 = paso 7; P-7 = paso 8.
- **Lote 1:** P-1 (DT-008 y DT-009) y P-2 (colores).
- **Lote 2:** P-3 (imágenes) y P-4 (tamaños y 320 px).
- **Lote 3:** P-5 (espacios para el teclado).
- **Lote 4:** P-6 (prueba en la versión publicada) y P-7 (comprobación en el iPhone).

Son ~65 líneas de app en total; el lote más grande tiene ~30. No hubo que partir ningún paso.

**Confirmo la técnica del designer:** la imagen va en un `::before` con una máscara SVG escrita en el CSS, sin `<svg>` dentro del `dd`. Así no cambian `src/main.ts`, `index.html` (salvo las 4 clases de color de P-2) ni las pruebas que leen el número o el texto visible. La razón completa está en el plan §2.2.

## Librerías verificadas
No se agrega ninguna dependencia. Se verificó lo que se usa del stack actual:

| Librería | Versión | Fuente (ID de Context7) | Para qué |
|---|---|---|---|
| `@playwright/test` (ya instalada) | 1.64.1 | `/microsoft/playwright/v1.64.1` | Comprobar en las pruebas `toHaveCSS(..., { pseudo: "before" })` (estilo de la imagen) y `toMatchAriaSnapshot` (TC-056) |
| CSS `mask` (estándar web, no es paquete) | — | `/mdn/content` | Sintaxis `mask: url(...) center / contain no-repeat` |
| Datos de compatibilidad de MDN | — | `/mdn/browser-compat-data` | La consulta no devolvió la versión exacta de Safari que acepta `mask` sin prefijo. Por eso el plan exige las dos declaraciones (`-webkit-mask` y `mask`) y lo confirman la E2E en WebKit y la foto del iPhone |

## Piezas del stack por decidir
- Ninguna.

## Lo que debe hacer el usuario
- **Antes del lote 1:** responder la pregunta 1 (nivel de la revisión de cierre).
- **Lote 4, P-7:** hacer la lista de comprobación en su iPhone con fotos (unos 15 min). Incluye:
  - nombres tapados (TC-057);
  - teclado de letras en claro (TC-061);
  - teclado "123" en oscuro (TC-062);
  - medir si la frase de 50 cabe en 2 líneas (F-003 §5.5);
  - dos observaciones sin criterio: el teclado de emojis y la frase de 100 con el teclado cerrado, para A-001.
- **Lote 4, P-6 (solo si pasa):** si la prueba publicada ve peticiones a `vercel.live`, apagar la barra de herramientas de Vercel en las previews (riesgo R-4).

## Preguntas para el usuario
1. **Nivel de la revisión de cierre.** Por la regla de archivo, `src/main.ts` vuelve **Alta** la revisión de cierre de toda la slice. Entonces correrían las dos revisiones adversariales, calidad y seguridad. Pero en ese archivo solo cambia un comentario (DT-009).
   - **Recomiendo bajarla a Normal**, con la evidencia de que `git diff main...HEAD -- src/main.ts` muestra solo líneas de comentario.
   - **Contra:** `main.ts` es el archivo que conecta la validación de lo que se escribe, y la regla pide subir ante la duda. Si en una ronda cambia algo más que el comentario, vuelve a Alta.
2. **Prueba automática que se acerca al teclado (complemento de TC-061, F-003 §7).** Propongo una E2E en el iPhone simulado. Comprueba que, con el campo activo, la segunda fila de fichas termina a 417 px o menos del inicio de la página: son los 427 px que medió el designer en la foto, menos 10 px de margen por la letra del iPhone. Se prueba con el campo vacío, en 1 línea y en 2 líneas.
   - **Recomiendo incluirla**, porque hoy falla (≈ 433 px) y protege que nadie vuelva a agrandar los espacios.
   - **Contra:** es una aproximación. El criterio lo sigue dando la foto del iPhone (P-7), no esta prueba.

## Decisiones o lecciones propuestas
- **Decisión propuesta:** la imagen del grupo se pinta con `.count dd::before` y una máscara SVG escrita en `src/styles.css` (`-webkit-mask` y `mask`), no con `<svg>` en el marcado. Por qué:
  - no pide archivos;
  - toma sola el color;
  - no cambia `src/main.ts` ni las pruebas del texto visible;
  - deja P-3 en riesgo Bajo.
- **Decisión propuesta:** desde P-1, `published.spec.ts` guarda su evidencia en `_project/slices/VS-002/evidence/published`. Va en P-1, y no en P-6, porque desde que se toca el archivo cualquier `test:published` sobrescribiría la evidencia de VS-001.
- **Lección propuesta (Herramienta):** en un CSS con un `@media` de pantalla angosta **arriba** del componente, una regla del componente dentro de ese `@media` pierde contra la regla base que va después, porque tienen el mismo peso. Los ajustes de componente para pantallas angostas van en un `@media` **después** del componente. Por qué: salió al planear P-4 y P-5 (plan, P-4 "Orden en el archivo"); sin eso, el relleno de P-5 taparía el de 320 px sin que lo note nadie más que la prueba de "100".
- **Lección propuesta → VEGU:** cuando el contrato de una prueba depende de un pseudo-elemento (`::before`), el plan da sus propiedades calculadas exactas (tamaño, color, máscara). Así el tester la prueba sin leer el código, porque no hay selector para encontrarla.
- **Glosario (propuesta del architect, sigue vigente):** `groupImage` → "Imagen del grupo" y `groupColor` → "Color del grupo". En el CSS se llaman `--group-image` y `--group-color` (`design-system.md` §2).
- **Nota para el Manager:** `_project/slices/VS-002.md` línea 3 todavía dice "Estado: Por definir…", aunque las features ya están aprobadas. No lo toqué (no es mi zona).

STATUS: DONE
