# Lecciones aprendidas
**Última actualización:** 2026-11-26
**Último ID usado:** L-008

> **Reglas del archivo:**
> - Dos capas: índice por categoría (una línea `L-XXX — lección` por vigente, máx. ~40 líneas) + registro completo (solo se agrega).
> - Categorías: Enseñanza y conteo · Producto y estructura · Herramienta · Datos y supuestos · Proceso y memoria.
> - Formato: `### L-XXX — fecha — título` + `Categoría` · `Etapa` (Construcción / Operación) · `Qué pasó` · `Lección` · `Por qué importa` · `Cómo aplicarla` · `Estado` · `Relacionada con`.
> - Estados: `Vigente` · `Obsoleta` · `Promovida a <AGENTS.md / C-XXX / D-XXX>`. Obsoletas y promovidas salen del índice. Única edición permitida: `Estado`.
> - Se registran errores **y aciertos**; el agente las propone **en el momento** en que ocurren y las registra en el cierre de sesión sin volver a preguntar.
> - Ante un problema, o antes de construir algo, leer el índice de la categoría que toca.
> - **Una lección escrita no basta contra un error que se repite:** si se repite, se ataja en el origen (una guarda, una prueba o una regla) y la lección pasa a `Promovida`.
> - **Marca `→ VEGU`:** toda lección o decisión **de método** (flujo de agentes, memoria, pruebas, proceso; no del dominio ni del stack) lleva `→ VEGU` al final. Al cerrar cada slice se revisan las marcadas y, si tienen evidencia, se llevan a VEGU.

## Índice por categoría (lecciones vigentes)

### Enseñanza y conteo
- L-001 — Una regla dicha en negativo ("nada de X") se confirma: ¿X no se permite o solo no cuenta en su grupo?

### Producto y estructura

### Herramienta
- L-002 — Ediciones masivas con tildes, emojis y comillas: escribir un script en el scratchpad, no un heredoc en Bash
- L-004 — Las maquetas HTML se verifican con capturas de Edge sin ventana (`msedge --headless --screenshot`), porque el designer no puede abrir un navegador
- L-006 — Si la preview de Vercel "falla", mirar primero `curl -sI`: un 302 a `vercel.com/sso-api` es la protección encendida, no la app
- L-007 — La dirección de la preview de rama no sale por `gh` (apunta al panel privado): pedirla una vez al usuario; es estable para toda la rama

### Datos y supuestos

### Proceso y memoria
- L-003 — Todo mensaje al usuario va en español de Colombia, también los que siguen a un reporte de agente en otro idioma → VEGU
- L-005 — Para elegir el sistema de diseño, pedir varias propuestas (claro y oscuro) y dejar que el usuario combine: salió C2 de C + B → VEGU
- L-008 — La guarda de Bash de los agentes bloquea `<` y `>`: sus commits salen sin `Co-Authored-By` → VEGU

## Registro completo

### L-001 — 2026-11-25 — Confirmar las reglas dichas en negativo
- **Categoría:** Enseñanza y conteo
- **Etapa:** Construcción
- **Qué pasó:** el usuario dijo "nada de letras de otros idiomas". El Manager lo registró como "cuentan como otros", pidió confirmación y el usuario aclaró que **no se permiten** (C-011).
- **Lección:** una regla en negativo admite dos lecturas: no se permite o solo no cuenta en su grupo. Se confirma con un ejemplo concreto ("ça" → ¿1 vocal y 1 otro, o no entra?).
- **Por qué importa:** cada lectura cambia el comportamiento y las pruebas de rechazo.
- **Cómo aplicarla:** ante una regla en negativo, mostrar al usuario el resultado de un ejemplo con cada lectura antes de registrarla.
- **Estado:** Vigente
- **Relacionada con:** C-011

### L-002 — 2026-11-25 — Ediciones masivas con caracteres especiales
- **Categoría:** Herramienta
- **Etapa:** Construcción
- **Qué pasó:** un heredoc de Bash con un script Python que tenía tildes, emojis compuestos y comillas falló con `unexpected EOF while looking for matching '`; no se modificó nada.
- **Lección:** para ediciones de varios archivos con texto en español y símbolos, escribir el script con la herramienta de archivos en el scratchpad y ejecutarlo.
- **Por qué importa:** evita fallos de comillas y ediciones a medias.
- **Cómo aplicarla:** script en el scratchpad con reemplazos que verifican que el texto original exista (`assert`) antes de reemplazar.
- **Estado:** Vigente
- **Relacionada con:** —

### L-003 — 2026-11-26 — Hablar siempre en español
- **Categoría:** Proceso y memoria
- **Etapa:** Construcción
- **Qué pasó:** el Manager presentó el resultado del architect y sus preguntas en inglés; el usuario tuvo que pedir "dime lo que debo confirmar en español".
- **Lección:** el idioma del usuario (AGENTS.md: español de Colombia) aplica a todo mensaje, aunque el contexto técnico venga en otro idioma.
- **Por qué importa:** el usuario tiene poca experiencia técnica; un mensaje en otro idioma frena sus aprobaciones.
- **Cómo aplicarla:** antes de enviar un resumen o una pregunta, comprobar que está en español y sin jerga sin explicar.
- **Estado:** Vigente
- **Relacionada con:** AGENTS.md §1

### L-004 — 2026-11-26 — Verificar maquetas con capturas sin ventana
- **Categoría:** Herramienta
- **Etapa:** Construcción
- **Qué pasó:** el designer no puede abrir navegadores y pidió al Manager confirmar que nada se cortaba. Con `msedge --headless=new --screenshot` y un recorte con PIL, el Manager revisó los estados en claro y oscuro.
- **Lección:** Edge sin ventana da capturas fiables de un HTML local en Windows, sin instalar nada.
- **Por qué importa:** la verificación independiente del Manager no depende de que el usuario abra cada archivo.
- **Cómo aplicarla:** `msedge --headless=new --disable-gpu --hide-scrollbars --window-size=1000,<alto> --screenshot=<png> file:///<ruta>`; recortar por partes si la página es larga.
- **Estado:** Vigente
- **Relacionada con:** VS-001 (diseño)

### L-005 — 2026-11-26 — Varias propuestas para el primer diseño
- **Categoría:** Proceso y memoria
- **Etapa:** Construcción
- **Qué pasó:** el usuario pidió tres propuestas con modo claro y oscuro; eligió la C y pidió combinarla con la disposición de la B (C2), que aprobó.
- **Lección:** para el sistema de diseño inicial, comparar propuestas concretas lado a lado lleva a una decisión rápida y propia del usuario.
- **Por qué importa:** el sistema de diseño marca todas las slices siguientes.
- **Cómo aplicarla:** en la primera slice con pantallas, pedir al designer 2–3 propuestas con los mismos tokens y ambos modos antes de escribir `design-system.md`.
- **Estado:** Vigente
- **Relacionada con:** D-010

### L-006 — 2026-11-26 — Distinguir la protección de Vercel de un fallo de la app
- **Categoría:** Herramienta
- **Etapa:** Construcción
- **Qué pasó:** `test:published` contra la preview falló; `curl -sI` mostró `302` a `vercel.com/sso-api`: "Vercel Authentication" seguía encendida (viene encendida por defecto). Al apagarla, la prueba pasó.
- **Lección:** antes de clasificar un fallo de la prueba publicada, mirar la respuesta cruda de la dirección.
- **Por qué importa:** evita mandar al coder un "defecto" que es configuración de la plataforma.
- **Cómo aplicarla:** `curl -sI <dirección> | head -3` antes de `test:published`; `200` = sirve la app, `302` a `sso-api` = protección, `404` = no hay publicación.
- **Estado:** Vigente
- **Relacionada con:** D-013

### L-007 — 2026-11-26 — Cómo obtener la dirección de la preview y su rojo
- **Categoría:** Herramienta
- **Etapa:** Construcción
- **Qué pasó:** el estado "Vercel" del commit en GitHub solo trae el enlace al panel privado; la dirección pública de la rama se trunca con un código (`contapp-git-feature-vs-00-588149-…`) y no se puede adivinar. Acierto: el rojo de P-2 se corrió contra producción recién importada (404), y el último commit se guardó sin subir para disparar la preview después.
- **Lección:** la dirección de la preview de rama se pide al usuario (panel → *Domains*) una vez; es la misma para todos los push de esa rama.
- **Por qué importa:** ahorra intentos y permite correr `test:published` en cada lote sin volver a preguntar.
- **Cómo aplicarla:** anotarla en la decisión o en `progress.md` al obtenerla; para un rojo "publicado" usar una dirección que aún no tenga la app.
- **Estado:** Vigente
- **Relacionada con:** D-013, plan VS-001 P-2

### L-008 — 2026-11-26 — Commits de los agentes sin `Co-Authored-By`
- **Categoría:** Proceso y memoria
- **Etapa:** Construcción
- **Qué pasó:** el coder no pudo poner la línea `Co-Authored-By: … <correo>` porque la guarda de Bash prohíbe `<` y `>`; lo reportó y no intentó esquivarla.
- **Lección:** la guarda y la regla de atribución chocan; hoy los commits de agentes salen sin la línea (los del Manager sí la llevan).
- **Por qué importa:** la atribución queda dispareja; no afecta a la app.
- **Cómo aplicarla:** al revisar VEGU, decidir si los agentes llevan la línea (y permitirla en la guarda, p. ej. con `git commit -F <archivo>`) o si basta con la del Manager. → VEGU
- **Estado:** Vigente
- **Relacionada con:** `.claude/agents/coder.md`, reporte del coder lote 1
