# Decisiones del proyecto
**Última actualización:** 2026-11-26
**Último ID usado:** D-020

> **Reglas del archivo:**
> - Dos capas: (1) *Índice de decisiones vigentes*, una línea `D-XXX — decisión`, máx. ~30 líneas, se lee al inicio; (2) *Registro completo*, se consulta por demanda, siempre antes que el resto de la memoria fría.
> - Formato del registro: `### D-XXX — fecha — título` + `Decisión` · `Razón` · `Alternativas descartadas` · `Estado` (`Vigente` / `Reemplazada por D-YYY (fecha)`) · `Relacionada con`.
> - **Solo se agrega.** Única edición permitida: el campo `Estado`. Al reemplazar una decisión, sale del índice y entra la nueva.
> - **El agente propone durante la sesión y registra en el cierre lo no objetado, sin volver a preguntar.** Solo decisiones con impacto (alcance, modelo, metodología, herramientas, reglas de trabajo). Los IDs nunca se reutilizan.
> - Si el índice pasa de ~30 líneas, se resume agrupando decisiones del mismo tema en una línea.

## Índice de decisiones vigentes (memoria caliente — leer al inicio)
- D-001 — Código en inglés; texto de pantalla en español de Colombia (C-013), con glosario en `project-context`
- D-002 — Roadmap: VS-001 a VS-006 con features F-001 a F-009; descartados sonidos, juegos y otros idiomas de pantalla
- D-003 — Se usan todos los agentes de VEGU, lanzados en panes de Herdr
- D-004 — Repositorio en GitHub `jdrodriguez1000/CONTAPP`, rama principal `main`
- D-005 — En VS-001 una letra de otro idioma simplemente no entra al texto, sin aviso; el aviso llega en VS-004 (F-006)
- D-006 — Desde VS-004, una letra de otro idioma muestra un mensaje lindo al niño y borra todo el texto para escribirlo de nuevo
- D-007 — El carácter 101 se ignora en silencio, sin aviso; se retira F-005 del roadmap (ajusta D-002)
- D-008 — La app se publica como dirección web que se abre en el navegador del celular (sin tienda de apps)
- D-009 — Dispositivo de las pruebas de punta a punta: iPhone con Safari; en el campo se apagan corrector y sugerencias del teclado
- D-011 — Stack: TypeScript + Vite (sin framework), Vitest, Playwright (WebKit), GitHub Actions, Vercel (preview por rama), ESLint, gitleaks; código en `src/`; rama por slice y PR con commit de fusión
- D-012 — Plan de VS-001 aprobado (5 lotes); herramientas de calidad (duplicación, sin uso, mutación) se deciden al llegar a la etapa 10
- D-010 — Estilo visual: propuesta C2 "Pizarra con fichas" (claro y oscuro, sigue el modo del celular); nombre "Contapp"; mayúscula automática apagada
- D-013 — Previews de Vercel sin protección (abren sin iniciar sesión); producción en `contapp-tawny.vercel.app`
- D-014 — Medidas fijas aprobadas sin token en `design-system.md` §4; cada una se vuelve token al usarse en un segundo lugar
- D-015 — En VS-001 no se cambia la pantalla porque el teclado tape la 2.ª fila de fichas (medido en el iPhone); se resuelve en VS-002 y F-001 §5.5 lleva la medida real
- D-016 — El repositorio `jdrodriguez1000/CONTAPP` es público (minutos de GitHub Actions gratis; la bolsa privada la usa BankApp)
- D-017 — Al volver atrás a la app (o restaurarse la página), el campo queda vacío y los 4 conteos en 0, como al recargar
- D-018 — Una tilde combinable pegada sola entra solo si forma con la letra anterior una letra del español; si no, no entra y lo demás sí (amplía C-015)
- D-019 — Ubicación siempre visible (piloto → VEGU): mapa de 3 líneas en cada mensaje con avance y página `_project/status.html` (Fase 0 + slices, colores de la app, estados con ✓ ▸ ○)
- D-020 — Herramientas del reviewer: jscpd 5.4.3, knip 6.45.1 y Stryker 10.1.1 (vitest-runner), dependencias de desarrollo exactas; mutación solo de `src/counting.ts` y `src/inputFilter.ts`

## Registro completo (memoria fría — consultar por demanda)

### D-001 — 2026-11-25 — Idioma del código
- **Decisión:** el código (archivos, variables, funciones, pruebas) va en inglés; el texto que se ve en pantalla, en español de Colombia. El glosario de `project-context` relaciona cada término con su nombre en código.
- **Razón:** las herramientas, librerías y ejemplos están en inglés; el glosario evita que el usuario se pierda.
- **Alternativas descartadas:** código en español (mezcla constante con nombres de librerías en inglés).
- **Estado:** Vigente
- **Relacionada con:** C-013

### D-002 — 2026-11-25 — Roadmap de vertical slices
- **Decisión:** VS-001 Contar en el celular (F-001) · VS-002 Imágenes y diseño para niños (F-002, F-003) · VS-003 Ver cada letra en su grupo (F-004) · VS-004 Avisos amables (F-005, F-006) · VS-005 Borrar y empezar de nuevo (F-007) · VS-006 Instalar y usar sin internet (F-008, F-009). Se descartan sonidos, juegos o ejercicios y otros idiomas de pantalla.
- **Razón:** cada slice deja algo usable el mismo día; VS-001 a VS-003 llevan cerca de la versión de uso real con los niños.
- **Alternativas descartadas:** sonidos, juegos y otro idioma de pantalla (el usuario no los quiere).
- **Estado:** Vigente
- **Relacionada con:** `_project/roadmap.md`, C-009

### D-003 — 2026-11-25 — Agentes y Herdr
- **Decisión:** se usan todos los agentes de VEGU; las revisiones de cada entrega las decide su nivel de riesgo. Los agentes se lanzan en panes de Herdr.
- **Razón:** la app no guarda datos ni maneja cuentas, así que casi todo será riesgo bajo o normal y las revisiones pesadas correrán poco; Herdr ya está instalado.
- **Alternativas descartadas:** quitar breaker-code o security (se pierde la red de seguridad cuando una entrega sí sea de riesgo alto).
- **Estado:** Vigente
- **Relacionada con:** `.claude/rules/risk-levels.md`

### D-004 — 2026-11-25 — Repositorio remoto
- **Decisión:** el repositorio vive en GitHub, `https://github.com/jdrodriguez1000/CONTAPP.git`, rama principal `main`. Las ramas de cada slice y la forma de fusionar se deciden con el stack en la VS-001.
- **Razón:** el usuario ya creó el repositorio; `gh` está autenticado.
- **Alternativas descartadas:** ninguna planteada.
- **Estado:** Vigente
- **Relacionada con:** `engineering-proyecto.md` (equivalencia "PR a `main`")

### D-005 — 2026-11-25 — Letras de otros idiomas antes de VS-004
- **Decisión:** desde VS-001 la app cumple C-011: una letra o acento de otro idioma no entra al texto ni cambia el conteo, sin mostrar aviso. El aviso amable se construye en VS-004 (F-006).
- **Razón:** C-011 es dura y debe cumplirse desde la primera slice; el aviso es una mejora que puede esperar.
- **Alternativas descartadas:** construir el aviso ya en VS-001 (agranda la walking skeleton).
- **Estado:** Vigente
- **Relacionada con:** C-011, VS-004

### D-006 — 2026-11-25 — Qué pasa con una letra de otro idioma desde VS-004
- **Decisión:** desde VS-004 (F-006), al escribir o pegar una letra de otro idioma se muestra un mensaje muy lindo para el niño, que le dice que esa letra es de otro idioma y que vuelva a escribir la palabra o frase. Se borra **todo** el texto y los conteos vuelven a 0, también al pegar un texto mezclado ("façade"). Antes de VS-004 sigue D-005 (no entra, sin aviso).
- **Razón:** el usuario quiere que el niño entienda qué pasó y empiece de nuevo; el mensaje necesita el diseño didáctico de VS-002.
- **Alternativas descartadas:** mostrar el mensaje ya en VS-001 (agranda la walking skeleton); conservar lo escrito y quitar solo la letra.
- **Estado:** Vigente
- **Relacionada con:** C-011, D-005, VS-004

### D-007 — 2026-11-25 — El carácter 101 se ignora en silencio
- **Decisión:** al intentar escribir o pegar más de 100 caracteres (A-001), lo que sobra no entra, el conteo no cambia y no se muestra ningún aviso, ni ahora ni después. Se retira **F-005** (aviso al llegar al largo máximo) de VS-004; su ID no se reutiliza. Ajusta D-002 solo en ese punto.
- **Razón:** decisión del usuario, experto del dominio.
- **Alternativas descartadas:** un aviso amable en VS-004.
- **Estado:** Vigente
- **Relacionada con:** A-001, D-002, VS-004

### D-008 — 2026-11-25 — Cómo se publica la app
- **Decisión:** la app es una página web que se abre con una dirección en el navegador del celular. La plataforma concreta y las tecnologías las propone el planner con documentación vigente y las aprueba el usuario.
- **Razón:** sin tienda de apps ni cuentas de desarrollador; hay planes gratis; encaja con VS-006 (ícono y uso sin internet).
- **Alternativas descartadas:** app de tienda (Google Play / App Store): más lenta y costosa.
- **Estado:** Vigente
- **Relacionada con:** VS-001, VS-006, C-010

### D-009 — 2026-11-25 — Dispositivo de prueba y teclado
- **Decisión:** las pruebas de punta a punta se hacen en iPhone con Safari, el celular que el usuario usa con los niños. El campo de texto apaga el corrector y las sugerencias del teclado.
- **Razón:** regla 6 del roadmap (un solo dispositivo); el corrector podría cambiar lo que escribe el niño y los conteos.
- **Alternativas descartadas:** Android con Chrome.
- **Estado:** Vigente
- **Relacionada con:** VS-001, C-009

### D-010 — 2026-11-26 — Estilo visual de la app
- **Decisión:** la base del sistema de diseño es la propuesta C2 "Pizarra con fichas" (`_project/design/propuestas/propuesta-c2.html`): colores y letra de C, 4 grupos en fichas 2 × 2 con el número grande arriba, borde punteado. Modo claro y oscuro, siguiendo el modo del celular sin botón. Nombre en pantalla "Contapp"; etiqueta "Escribe una palabra o frase"; campo de 2 a 5 líneas; mayúscula automática apagada (además del corrector, D-009).
- **Razón:** elección del usuario tras comparar las propuestas A, B, C y C2.
- **Alternativas descartadas:** A "Cuaderno limpio", B "Recreo", C "Pizarra" (lista con insignias).
- **Estado:** Vigente
- **Relacionada con:** D-009, VS-001, VS-002

### D-011 — 2026-11-26 — Stack de la app
- **Decisión:** página web estática, sin servidor ni base de datos (C-010): **TypeScript** + **Vite** sin framework; pruebas unitarias con **Vitest**; punta a punta con **Playwright** en **WebKit** (motor de Safari, D-009); CI con **GitHub Actions**; publicación en **Vercel** (plan gratis, uso no comercial) con preview por rama; **ESLint** y revisión de tipos; **gitleaks** para secretos. Código en `src/`. Ramas `feature/VS-XXX-<slug>`, un PR por slice en GitHub, fusión con commit de fusión (nunca squash ni rebase). Las versiones exactas las verifica el planner con documentación vigente y quedan en el plan.
- **Razón:** lo mínimo para una sola pantalla sin datos (PI-2); todo gratis y bien documentado; la preview por rama permite la aceptación del usuario en el iPhone antes de fusionar.
- **Alternativas descartadas:** React u otro framework (complejidad innecesaria); GitHub Pages (sin preview por rama).
- **Estado:** Vigente
- **Relacionada con:** D-004, D-008, D-009, C-010

### D-012 — 2026-11-26 — Plan de VS-001 y herramientas de calidad
- **Decisión:** se aprueba `_project/slices/VS-001/plan.md` (10 pasos en 5 lotes, versiones verificadas por el planner). Las herramientas de duplicación, código sin uso y mutación del reviewer se deciden al llegar a la etapa 10. El usuario ya tiene cuenta en Vercel.
- **Razón:** aprobación del usuario; las herramientas de calidad no hacen falta para construir.
- **Alternativas descartadas:** decidir ahora jscpd, knip y Stryker.
- **Estado:** Vigente
- **Relacionada con:** D-011, VS-001

### D-013 — 2026-11-26 — Previews de Vercel sin protección
- **Decisión:** se apaga "Vercel Authentication" (*Settings → Deployment Protection*) en el proyecto `contapp`: las previews por rama abren sin iniciar sesión (opción B de la pregunta 1 del plan). Producción: `https://contapp-tawny.vercel.app`. Preview de VS-001 (estable para toda la rama): `https://contapp-git-feature-vs-00-588149-jdrodriguez1000-8207s-projects.vercel.app`.
- **Razón:** el usuario abre la preview en su iPhone sin cuenta y `test:published` corre sin secretos; la app no guarda datos (C-010), así que un enlace abierto no expone nada.
- **Alternativas descartadas:** opción A (dejar la protección y usar `VERCEL_AUTOMATION_BYPASS_SECRET`): agrega un secreto y obliga a iniciar sesión en el iPhone.
- **Estado:** Vigente
- **Relacionada con:** D-008, D-011, C-010, plan VS-001 R-1

### D-014 — 2026-11-26 — Medidas fijas del sistema de diseño
- **Decisión:** opción A del hallazgo 2 de la revisión visual del lote 2: `design-system.md` §4 lleva una lista de "medidas fijas aprobadas" (104 px alto mínimo de la ficha, anillo de foco 3 px separado 2 px, 2 px entre número y nombre, 480 px de ancho máximo, altos de línea 1,1 / 1,2 / 1,3) que pueden ir sin token; cada una se vuelve token cuando se use en un segundo lugar; toda otra medida nueva se pide como token. También se corrige la maqueta de F-001 (`14px` → `var(--space-3)`).
- **Razón:** el código ya usa esos valores aprobados; crear tokens para medidas de un solo uso agrega nombres y obliga a tocar un CSS en verde.
- **Alternativas descartadas:** opción B (8 tokens nuevos ya).
- **Estado:** Vigente
- **Relacionada con:** D-010, D-011, `_project/design-system.md`, reporte del designer (trabajo C, lote 2)

### D-015 — 2026-11-26 — El teclado tapa la segunda fila de fichas: se resuelve en VS-002
- **Decisión:** en VS-001 no se cambia la pantalla. Con el teclado abierto en el iPhone con Safari, aun con el campo en 2 líneas, la segunda fila de fichas queda cortada (se ven los números, no los nombres "Números" y "Otros"); "Listo" cierra el teclado y muestra las 4. Se resuelve en VS-002, en el borde que espera "Teclado abierto tapando los conteos". F-001 §5.5 se corrigió con la medida real y la foto `_project/slices/VS-001/evidence/lote3-iphone-estado2-teclado.jpg`.
- **Razón:** el borde ya estaba asignado a VS-002, donde se rediseña la pantalla para niños; arreglarlo ahora agranda la walking skeleton.
- **Alternativas descartadas:** un paso pequeño de diseño y CSS dentro de VS-001.
- **Estado:** Vigente
- **Relacionada con:** F-001 §5.5, VS-002, L-010, L-015, hallazgo 1 del designer (trabajo C, lote 3)

### D-016 — 2026-11-26 — Repositorio público
- **Decisión:** `jdrodriguez1000/CONTAPP` pasa de privado a público (hecho por el Manager con `gh repo edit` a pedido del usuario). La CI corre en cada push, como dice el plan §P-9.
- **Razón:** los 2.000 minutos gratis de GitHub Actions son por cuenta y BankApp ya había usado 1.986 en noviembre de 2026; en repositorios públicos los minutos son gratis. Se revisó antes: el correo del usuario no aparece en el historial (los commits usan `@users.noreply.github.com`) y gitleaks salió limpio.
- **Alternativas descartadas:** esperar al 1 de diciembre para P-9; pagar por uso con tope (~US$ 1 al mes); GitHub Pro (US$ 4 al mes).
- **Estado:** Vigente
- **Relacionada con:** D-004, D-011, plan VS-001 §P-9

### D-017 — 2026-11-26 — Volver atrás deja la app vacía
- **Decisión:** si el navegador restaura la página al volver atrás (o por cualquier otra vía) con texto en el campo, la app arranca con el campo vacío y los 4 conteos en 0, igual que al recargar. Amplía CA-7 de F-001.
- **Razón:** hallazgo BRK-U-1: el texto reaparecía con los conteos en 0 (conteo falso). Vaciar encaja con C-010 (la app no guarda nada) y es lo más simple de explicar.
- **Alternativas descartadas:** mostrar el texto restaurado con su conteo correcto (contradice CA-7).
- **Estado:** Vigente
- **Relacionada con:** CA-7, C-010, `reports/clasificacion-9c.md` (ronda 1)

### D-018 — 2026-11-26 — Tildes combinables sobre algo que no es letra
- **Decisión:** una tilde combinable que llega pegada solo entra si forma con la letra anterior una letra del español (á é í ó ú ü ñ, en mayúscula o minúscula). Si no, la tilde no entra y lo demás sí: espacio + tilde → queda el espacio; "1" + tilde → "1" (cuenta como número); "?" + 2.000 tildes → "?". Amplía C-015.
- **Razón:** hallazgos BRK-U-4 y BRK-C-5: la regla no definía el caso, y las tildes amontonadas pueden tapar la pantalla (A-001).
- **Alternativas descartadas:** dejarlas entrar como "otro" (riesgo de tildes amontonadas).
- **Estado:** Vigente
- **Relacionada con:** C-011, C-015, A-001, `reports/clasificacion-9c.md` (ronda 1)

### D-019 — 2026-11-26 — Ubicación siempre visible para el usuario
- **Decisión:** cada mensaje del Manager con avance empieza con un mapa de 3 líneas (proyecto: Fase 0 o slice N de M · construcción y revisión · ahora → sigue). La página `_project/status.html`, publicada como artifact (`https://claude.ai/artifact/GkYgfLAmdVDan5trEmSDhE`), muestra el camino completo (Fase 0 de entendimiento y las slices), la slice en curso paso a paso y un glosario; usa solo los colores del sistema de diseño de la app y marca los estados con símbolos (✓ terminado · ▸ en curso · ○ pendiente). Se actualiza en cada cierre de sesión. Piloto en Contapp que se lleva a VEGU.
- **Razón:** el usuario se perdía entre slices, lotes, pasos y rondas, y no sabía cuánto llevaba ni cuánto faltaba.
- **Alternativas descartadas:** solo `progress.md` (no lo lee el usuario); colores propios para los estados (el usuario pidió los de la app).
- **Estado:** Vigente
- **Relacionada con:** L-027, `AGENTS.md` §1 → VEGU

### D-020 — 2026-11-26 — Herramientas de calidad del reviewer
- **Decisión:** duplicación con `npx jscpd src tests --min-lines 10` (jscpd 5.4.3), código sin uso con `npx knip` (knip 6.45.1, sin configuración; los archivos de `.claude/hooks/` y `jscpd` son falsos positivos conocidos) y mutación con `npx stryker run` (Stryker 10.1.1 + `@stryker-mutator/vitest-runner` 10.1.1, `stryker.config.json` limitado a `src/counting.ts` y `src/inputFilter.ts`, solo unitarias, sin umbral). Las cuatro como dependencias de desarrollo con versión exacta. Cumple lo que D-012 dejó para la etapa 10.
- **Razón:** el reviewer no podía correr esas revisiones; versiones con más de 2 semanas publicadas, verificadas en npm y Context7.
- **Alternativas descartadas:** correr jscpd y knip con `npx` sin instalar (descarga en cada revisión y no queda en el archivo de versiones).
- **Estado:** Vigente
- **Relacionada con:** D-012, DT-005, `.claude/skills/review-checklist/SKILL.md`
