# Plan — VS-001
**Reporte del planner** · **Fecha:** 2026-11-26

## Resumen
El plan (`_project/slices/VS-001/plan.md`) detalla los **10 pasos del esbozo aprobado**, con el mismo número, nombre y naturaleza, sin agregar, partir ni juntar ninguno. Los agrupa en **5 lotes de 2 pasos**: (1) esqueleto y publicación, (2) pantalla y regla de letras, (3) números/otros y conteo mientras se escribe, (4) filtro de otros idiomas y tope de 100, (5) CI y prueba sobre la versión publicada. Ningún lote pasa de ~200 líneas de app (el más grande, el lote 2, ~175). Los 5 lotes son de riesgo **Alto**. Los 42 casos de prueba quedan cubiertos (§6 del plan). El plan trae los comandos y los valores de las guardas para llenar los `COMPLETAR AL DECIDIR` (§8).

## Librerías verificadas
| Librería | Versión | Fuente (ID de Context7) | Para qué |
|---|---|---|---|
| Vite | 8.3.5 (pide Node 20.19+ / 22.12+) | `/vitejs/vite/v8.3.5` | Servidor local y empaquetado de la página |
| TypeScript | 6.0.2 | `/microsoft/typescript` (versión v6.0.2) | Tipos y revisión `tsc --noEmit`. No elegí la 7.0.2: es el compilador nuevo y no encontré confirmación de que `typescript-eslint` ya la soporte |
| Vitest | 5.0.3 (pide Vite ≥ 6.4 y Node ≥ 22.12) | `/vitest-dev/vitest/v5.0.3` | Pruebas unitarias (entorno `node`) |
| Playwright (`@playwright/test`) | 1.64.1 | `/microsoft/playwright/v1.64.1` | E2E en WebKit con `devices["iPhone 13"]` (390 × 844); `webServer`; `keyboard.insertText` para pegar; `pressSequentially` para escribir |
| ESLint + `@eslint/js` | 10.5.0 (respaldo 9.39.3) | `/eslint/eslint/v10.5.0` | Lint y regla `complexity` (máx. 10) |
| typescript-eslint | 8.72.1 | `/typescript-eslint/typescript-eslint/v8.72.1` | ESLint para TypeScript (configuración plana) |
| gitleaks / gitleaks-action | 8.30.1 / `@v2` | `/gitleaks/gitleaks/v8.30.1` | Secretos: en la CI con `fetch-depth: 0` (sin licencia en cuenta personal); en local `gitleaks git` / `gitleaks dir` con `--redact --no-banner` |
| Vercel (plan Hobby) | — (servicio) | `/websites/vercel` | Gratis, uso personal; preview en cada push de rama; `main` = producción. **Las previews nuevas piden iniciar sesión en Vercel** (pregunta 1) |
| GitHub Actions | `checkout@v6`, `setup-node@v6`, `upload-artifact@v5` | `/microsoft/playwright/v1.64.1` (guía de CI) | CI |
| `@types/node` | 24.x | Sin página en Context7; sigue a Node 24 | Tipos de la configuración de Playwright |

Notas: Context7 **no mostró el rango exacto** de ESLint y TypeScript que acepta `typescript-eslint` 8.72.1. Por eso el plan deja aprobados dos respaldos (ESLint 9.39.3 y TypeScript 5.9.3), que el coder usa si `npm install` avisa un conflicto. La versión de Node (24 LTS) la saqué de los requisitos de Vitest/Vite y de un ejemplo de la documentación de Vercel que fija Node 24.

## Piezas del stack por decidir
- **Herramientas de la revisión de calidad** (duplicación, código sin uso y mutación; `review-checklist` §2 y §10): D-011 no las incluye y **no hacen falta para construir**, solo para la etapa 10 (reviewer). Recomiendo `jscpd`, `knip` y **Stryker** con su corredor para Vitest. Alternativa: omitir la mutación en VS-001, porque es solo un informe y no tiene umbral. **No las verifiqué en Context7**: hay que verificarlas cuando se decidan, antes de la etapa 10. Por esto no bloqueo el plan.

## Lo que debe hacer el usuario
- **Antes del lote 1:** si el Manager lo pide, instalar Node.js 24 LTS.
- **P-2:** crear la cuenta de Vercel (plan Hobby) entrando con GitHub, importar `jdrodriguez1000/CONTAPP` aceptando los valores que detecta (Vite, `npm run build`, `dist`), elegir la protección de las previews (pregunta 1) y abrir la dirección de la preview en su iPhone con una captura.
- **P-10:** hacer la lista corta de comprobación en su iPhone con el teclado real (corrector apagado, tildes, ñ, emoji, modo oscuro) y mandar capturas.
- **Al final:** aceptar la preview del commit exacto y el mensaje de fusión.

## Preguntas para el usuario
1. **¿Las previews de Vercel deben pedir iniciar sesión?** Vercel las protege por defecto: solo las ve quien inicia sesión en Vercel. La producción siempre es pública.
   - **B (recomendada): apagar esa protección en las previews.** Así el usuario las abre en su iPhone sin iniciar sesión, y la prueba automática no necesita ningún secreto. La app no tiene datos ni cuentas, así que una preview pública no expone nada que la producción no muestre ya. Contra: quien tenga el enlace de una preview ve una versión sin terminar.
   - **A: dejarla.** El usuario inicia sesión en Vercel en su iPhone una vez, y la prueba `published` usa un secreto (`VERCEL_AUTOMATION_BYPASS_SECRET`) guardado fuera del repositorio. Es más seguro por defecto, pero agrega un secreto y un archivo de variables a la slice.
2. **Signo de tilde pegado solo** (p. ej. pegar solo el acento U+0301 justo detrás de una "a" que ya estaba): ¿debe formar "á" o no entrar? Recomiendo **que no entre**, como un "signo suelto" (en la línea de C-015, los invisibles sueltos no entran). Así el filtro solo mira lo que se escribió o pegó y nunca cambia una letra que ya estaba. Es un borde muy raro con el teclado del iPhone. El plan lo trata así (riesgo R-7) y no bloquea.

## Decisiones o lecciones propuestas
- **Decisión (complementa D-011): forma de construir y probar.** Proyectos de Playwright `iphone` / `captures` / `published`; Vitest con `include` explícito; `index.html` en la raíz; las pruebas del tester en `tests/`; el filtro de entrada como función pura `applyInput(previousText, nextText, cursor)` aplicada a cualquier cambio del campo, sin `maxlength`. Razón: lo mismo se prueba igual si se escribe o se pega, y no depende del tipo de evento de cada navegador.
- **Equivalencia para `engineering-proyecto.md`:** "código de la app" = `src/` **más `index.html`**, porque Vite exige el `index.html` en la raíz y ahí vive el marcado de la pantalla, que cuenta en el límite de ~200 líneas y debe ocultarse al tester.
- **Glosario de `project-context`** (términos nuevos en código): Largo del texto → `textLength`; Largo máximo → `MAX_TEXT_LENGTH` (A-001); Conteos de los 4 grupos → `CharacterCounts` / `countCharacters`. El architect había propuesto `maxTextLength` y `foreignLetter`: `foreignLetter` no hace falta en la interfaz pública.
- **Lección (Herramienta), cuando se confirme en la construcción:** *"Una regla de carpeta por defecto de Vitest toma cualquier `*.test.*` del repositorio, incluidas las pruebas de `.claude/hooks/` y los archivos de Playwright: el `include` va explícito desde el primer día."* → VEGU (aplica a cualquier proyecto con hooks de VEGU).
- **`COMPLETAR AL DECIDIR` de la regla 6 del roadmap:** E2E en un solo entorno = Playwright WebKit con `devices["iPhone 13"]`, más la lista manual en el iPhone real.

STATUS: DONE
