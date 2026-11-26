# Lecciones aprendidas
**Última actualización:** 2026-11-26
**Último ID usado:** L-017

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
- L-013 — En las maquetas toda medida va con token o con una medida fija aprobada (D-014), nunca un número suelto

### Herramienta
- L-002 — Ediciones masivas con tildes, emojis y comillas: escribir un script en el scratchpad, no un heredoc en Bash
- L-004 — Las maquetas HTML se verifican con capturas de Edge sin ventana (`msedge --headless --screenshot`), porque el designer no puede abrir un navegador
- L-006 — Si la preview de Vercel "falla", mirar primero `curl -sI`: un 302 a `vercel.com/sso-api` es la protección encendida, no la app
- L-007 — La dirección de la preview de rama no sale por `gh` (apunta al panel privado): pedirla una vez al usuario; es estable para toda la rama
- L-009 — Letras en dos piezas en pruebas: armarlas con `String.fromCharCode(0x0301)` y revisar con `\p{Mn}`
- L-010 — Las capturas simuladas (Windows) no usan SF Pro: lo que cabe se confirma en el iPhone real
- L-011 — La guarda de Bash del coder bloquea `;` en los mensajes de commit → VEGU
- L-015 — El espacio con el teclado abierto en el iPhone se mide restando también las barras de Safari (dirección y "⌃ ⌄ Listo"), no solo el teclado

### Datos y supuestos

### Proceso y memoria
- L-003 — Todo mensaje al usuario va en español de Colombia, también los que siguen a un reporte de agente en otro idioma → VEGU
- L-005 — Para elegir el sistema de diseño, pedir varias propuestas (claro y oscuro) y dejar que el usuario combine: salió C2 de C + B → VEGU
- L-008 — La guarda de Bash de los agentes bloquea `<` y `>`: sus commits salen sin `Co-Authored-By` → VEGU
- L-012 — El tester no puede correr `npm run check`: el Manager lo corre antes del commit en rojo → VEGU
- L-014 — Leer la fila de un supuesto en `assumptions.md` antes de citarlo al usuario → VEGU
- L-016 — Durante una slice, los reportes y documentos de la slice se editan solo en su rama: editarlos también en `main` choca al traer `main` → VEGU
- L-017 — Al cerrar cada lote, juntar en una sola lista lo que solo el dispositivo real puede confirmar y pedírselo al usuario en una pasada → VEGU

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

### L-009 — 2026-11-26 — Letras en dos piezas: construirlas con su código
- **Categoría:** Herramienta
- **Etapa:** Construcción
- **Qué pasó:** al escribir `counting.test.ts`, la herramienta de archivos convirtió los escapes de las marcas combinables en el carácter real; el tester lo detectó buscando `\p{Mn}` y lo corrigió.
- **Lección:** en pruebas con letras en dos piezas, armar la marca con `String.fromCharCode(0x0301)` (o similar) y revisar después con una búsqueda de `\p{Mn}`.
- **Por qué importa:** una "á" en dos piezas se ve igual que en una; la prueba dejaría de probar lo que dice.
- **Cómo aplicarla:** complementa L-002; el tester y el coder lo aplican en cada prueba con tildes en dos piezas.
- **Estado:** Vigente
- **Relacionada con:** L-002, C-014, `tests/unit/counting.test.ts`

### L-010 — 2026-11-26 — Las capturas simuladas no usan la letra del iPhone
- **Categoría:** Herramienta
- **Etapa:** Construcción
- **Qué pasó:** las capturas del lote 2 se tomaron con WebKit en Windows, que usa Segoe UI en vez de SF Pro; el designer pidió confirmar en el iPhone real que la frase de 100 caracteres cabe (cupo en 4 líneas).
- **Lección:** los saltos de renglón y lo que cabe a 320 px se confirman en la preview con el iPhone real (D-009); la captura simulada solo prueba colores, orden y medidas.
- **Por qué importa:** un texto que cabe en la captura puede cortarse en el celular.
- **Cómo aplicarla:** cuando un lote cambie textos o tamaños, pedir al usuario una prueba concreta en la preview (frase exacta y qué mirar).
- **Estado:** Vigente
- **Relacionada con:** D-009, A-001

### L-011 — 2026-11-26 — La guarda de Bash del coder bloquea `;` en los mensajes de commit
- **Categoría:** Herramienta
- **Etapa:** Construcción
- **Qué pasó:** un commit del coder se bloqueó por un `;` dentro del mensaje.
- **Lección:** los mensajes de commit de los agentes se escriben sin `; & | < >`.
- **Por qué importa:** ahorra intentos fallidos al coder.
- **Cómo aplicarla:** recordarlo en el paquete del coder; revisar junto con L-008 si conviene `git commit -F <archivo>`. → VEGU
- **Estado:** Vigente
- **Relacionada con:** L-008, `.claude/agents/coder.md`

### L-012 — 2026-11-26 — El tester no puede correr `npm run check`
- **Categoría:** Proceso y memoria
- **Etapa:** Construcción
- **Qué pasó:** la guarda del tester no incluye `npm run check`, así que no pudo verificar tipos y lint de sus pruebas; el Manager lo corrió antes del commit en rojo (verde).
- **Lección:** antes del commit en rojo del tester, el Manager corre `npm run check` en la carpeta de la slice.
- **Por qué importa:** un rojo con tipos o lint rotos dejaría al coder con una revisión estática fallando que no puede arreglar (no toca `tests/`).
- **Cómo aplicarla:** hasta decidir si se agrega `npm run check` a la guarda del tester (cambio de riesgo alto, lo aprueba el usuario), es paso fijo del Manager. → VEGU
- **Estado:** Vigente
- **Relacionada con:** `.claude/agents/tester.md`, reporte del tester lote 2

### L-013 — 2026-11-26 — En las maquetas no van números sueltos
- **Categoría:** Producto y estructura
- **Etapa:** Construcción
- **Qué pasó:** la maqueta de F-001 tenía `14px` escrito a mano en el campo, contra `--space-3` (12 px) de `design-system.md`; el coder tuvo que elegir entre los dos documentos.
- **Lección:** en las maquetas, toda medida va con su token o con un valor de la lista de medidas fijas aprobadas (D-014).
- **Por qué importa:** la maqueta y el sistema de diseño deben decir lo mismo; si no, el coder adivina.
- **Cómo aplicarla:** el designer lo revisa antes de entregar una maqueta.
- **Estado:** Vigente
- **Relacionada con:** D-014, `_project/design/F-001/mockup.html`

### L-014 — 2026-11-26 — Leer la fila de un supuesto antes de citarlo
- **Categoría:** Proceso y memoria
- **Etapa:** Construcción
- **Qué pasó:** el Manager le dijo al usuario que A-001 era el tamaño de la letra; al leer `assumptions.md` vio que es el largo máximo (100 caracteres) y lo corrigió con el usuario.
- **Lección:** antes de pedir al usuario que valide un supuesto, leer su fila en `assumptions.md`.
- **Por qué importa:** pedir validar lo que no es hace perder la prueba y confunde al usuario.
- **Cómo aplicarla:** cada vez que un `A-XXX` aparezca en un mensaje al usuario. → VEGU
- **Estado:** Vigente
- **Relacionada con:** A-001

### L-015 — 2026-11-26 — El teclado del iPhone no es lo único que tapa la pantalla
- **Categoría:** Herramienta
- **Etapa:** Construcción
- **Qué pasó:** F-001 §5.5 calculó que con el teclado abierto (≈ 340 px) y el campo en 2 líneas se veían las 4 fichas. En el iPhone real con Safari, la barra de la dirección y la barra "⌃ ⌄ Listo" se comieron el margen y la segunda fila quedó cortada.
- **Lección:** el espacio visible con el teclado abierto se calcula restando el teclado **y** las barras de Safari; el número final se confirma con una foto del iPhone real.
- **Por qué importa:** un cálculo optimista promete en el diseño algo que el niño no ve.
- **Cómo aplicarla:** el designer de VS-002 parte de la foto de evidencia del lote 3 y deja margen para las barras de Safari.
- **Estado:** Vigente
- **Relacionada con:** L-010, D-015, F-001 §5.5

### L-016 — 2026-11-26 — Reportes de la slice solo en su rama
- **Categoría:** Proceso y memoria
- **Etapa:** Construcción
- **Qué pasó:** el designer agregó una sección al reporte `designer.md` en `main` y otra en la rama; al traer `main` a la rama, git marcó un conflicto. Se resolvió a mano conservando las dos en orden. En el ajuste del teclado se lanzó al designer en la carpeta de la rama y no hubo conflicto.
- **Lección:** mientras la slice está abierta, sus reportes y documentos (`_project/slices/VS-XXX/**`, sus features) se editan solo en la carpeta de la rama; llegan a `main` con la fusión. Excepción: `tech-debt.md`, que solo se edita en `main`.
- **Por qué importa:** evita conflictos en archivos de solo agregar y que una sección quede en una sola rama.
- **Cómo aplicarla:** al lanzar al designer (u otro agente) sobre documentos de la slice en curso, usar `--cwd` en la carpeta de la slice. → VEGU
- **Estado:** Vigente
- **Relacionada con:** orchestrator-playbook §8

### L-017 — 2026-11-26 — Una sola lista para lo que solo el iPhone confirma
- **Categoría:** Proceso y memoria
- **Etapa:** Construcción
- **Qué pasó:** el designer dejó en lotes distintos cosas que solo el iPhone real puede mostrar (letra, foco, teclado). En el lote 3 el usuario respondió dos de ellas con una sola foto.
- **Lección:** al cerrar cada lote, el Manager junta en una lista corta lo que solo el dispositivo real confirma y se lo pide al usuario en una pasada, con qué escribir y qué mirar.
- **Por qué importa:** ningún pendiente de L-010 se pierde entre lotes y el usuario prueba una sola vez.
- **Cómo aplicarla:** en el mensaje de "ya puede probar la preview", incluir la lista y pedir una foto. → VEGU
- **Estado:** Vigente
- **Relacionada con:** L-010, propuesta del designer (trabajo C, lote 3)
