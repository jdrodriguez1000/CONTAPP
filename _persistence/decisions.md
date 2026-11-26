# Decisiones del proyecto
**Última actualización:** 2026-11-25
**Último ID usado:** D-012

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
