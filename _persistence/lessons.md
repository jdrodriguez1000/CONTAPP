# Lecciones aprendidas
**Última actualización:** 2026-11-27
**Último ID usado:** L-047

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
- L-030 — Toda expresión regular anclada (`^…$`) que juzga un grafema necesita una prueba con un carácter Prepend delante, y el pase completo define el Prepend para cada forma (emoji y tecla)
- L-023 — Un "pase libre" en un filtro (p. ej. "si trae emoji, entra completo") se define por lo que el carácter es en total, no por una parte
- L-001 — Una regla dicha en negativo ("nada de X") se confirma: ¿X no se permite o solo no cuenta en su grupo?

### Producto y estructura
- L-047 — Un ajuste por ancho se calcula en el ancho más angosto de cada tramo (360, no solo 320 y 390) → VEGU
- L-031 — Si la app reescribe un campo, el plan decide antes qué pasa con deshacer/rehacer y con la selección: una función sin la selección no distingue pegar sobre una selección de escribir
- L-013 — En las maquetas toda medida va con token o con una medida fija aprobada (D-014), nunca un número suelto
- L-040 — El espacio con el teclado se mide en la foto convertida a píxeles de la página y se calibra con lo ya construido (SF Pro suma ≈ 10 px)
- L-020 — Para probar un tope de alto en una captura, medir el alto en el límite y pasado el límite, y comprobar que hay texto escondido → VEGU

### Herramienta
- L-029 — En `.gitignore`, una carpeta de la raíz va con barra inicial (`/reports/`); sin ella se ignoran todas las carpetas con ese nombre
- L-002 — Ediciones masivas con tildes, emojis y comillas: escribir un script en el scratchpad, no un heredoc en Bash
- L-004 — Las maquetas HTML se verifican con capturas de Edge sin ventana (`msedge --headless --screenshot`), porque el designer no puede abrir un navegador
- L-006 — Si la preview de Vercel "falla", mirar primero `curl -sI`: un 302 a `vercel.com/sso-api` es la protección encendida, no la app
- L-007 — La dirección de la preview de rama no sale por `gh` (apunta al panel privado): pedirla una vez al usuario; es estable para toda la rama
- L-009 — Letras en dos piezas en pruebas: armarlas con `String.fromCharCode(0x0301)` y revisar con `\p{Mn}`
- L-010 — Las capturas simuladas (Windows) no usan SF Pro: lo que cabe se confirma en el iPhone real
- L-011 — La guarda de Bash del coder bloquea `;` en los mensajes de commit → VEGU
- L-015 — El espacio con el teclado abierto en el iPhone se mide restando también las barras de Safari (dirección y "⌃ ⌄ Listo"), no solo el teclado
- L-018 — Caracteres especiales en el código de la app (no solo en pruebas): escribirlos como `\u{...}` y buscar `\p{Mn}`, `\p{Me}`, `\p{Cf}` después (repite L-009)
- L-024 — No usar la bandera `i` con `u` en una lista cerrada de letras: acepta letras que se pliegan ("ſ" → "s")
- L-026 — La dirección única de la preview de un commit sale con `vercel ls contapp -m githubCommitSha=<sha completo>`
- L-019 — Una corrida con muchos rojos se corta en la terminal del agente: correr por grupos con `--grep` para leer la razón de cada fallo → VEGU
- L-039 — Desde ESLint 10, una carpeta donde un agente escribe puede traer su propio `eslint.config.*`: la configuración se fija con `-c` en el script (DT-015) → VEGU
- L-041 — En CSS, el ajuste de un componente para pantalla angosta va en un `@media` después del componente: con igual peso gana la regla que va después
- L-043 — Las maquetas que el designer no puede abrir se verifican con `npx playwright screenshot --browser webkit --full-page` (WebKit, como el iPhone) → VEGU
- L-044 — Una prueba de ancho tomada del diseño fija su letra (con guarda y un peso que tengan todas las máquinas); "nada se corta" se prueba aparte con la letra de la máquina, y se corre en la CI antes de dar por bueno el rojo y el verde → VEGU
- L-046 — La guarda de Bash de los agentes no deja escribir la línea `Co-Authored-By` (bloquea `<`, `>` y saltos de línea): sus commits quedan sin atribución → VEGU

### Datos y supuestos

### Proceso y memoria
- L-045 — El tester prueba sus pruebas antes del coder: inyecta y retira el CSS del plan (deben pasar) y lo daña a propósito (deben fallar por su razón) → VEGU
- L-042 — Un texto esperado de toda la pantalla vive en una sola función compartida; un pseudo-elemento que es contrato de prueba lleva sus propiedades exactas en el plan → VEGU
- L-035 — El rojo se comprueba leyendo la aserción exacta que falla, no el "fail 1": una prueba propia puede fallar por su propio error → VEGU
- L-036 — Al permitirle un comando a un agente, se permite el texto exacto: una lista de opciones prohibidas no cierra un comando que pasa opciones a dos programas (npm acepta abreviaturas) → VEGU
- L-037 — Las guardas de Bash son barandas contra errores, no una jaula: un agente que ejecuta código propio las rodea; se dice como riesgo aceptado → VEGU
- L-038 — Una prueba de guarda lee los argumentos reales de la definición del agente y comprueba también que sus comandos de trabajo siguen pasando → VEGU
- L-028 — Antes de encargar un archivo nuevo a un agente, comprobar que está en su zona de escritura → VEGU
- L-032 — Una dependencia nueva se registra como decisión antes de instalarla, y se corre `npm audit` antes y después → VEGU
- L-033 — Ante un mutante "sería bloqueante", reproducir el comportamiento actual antes de abrir ronda: puede faltar una prueba sin que haya defecto → VEGU
- L-034 — Al pasar la reproducción de un breaker a prueba de aceptación, correr cada variante que el reporte describe solo en prosa → VEGU
- L-021 — El rojo de una prueba sobre la versión publicada se corre contra la versión que muestra la pantalla sin el comportamiento, no por número de lote → VEGU
- L-022 — Antes de planear la CI, revisar los minutos de GitHub Actions de la cuenta (son compartidos entre repositorios privados) → VEGU
- L-025 — En una pantalla que reescribe un campo, atacar también "volver atrás" y deshacer/rehacer: escribir y pegar no pasan por el historial del navegador → VEGU
- L-003 — Todo mensaje al usuario va en español de Colombia, también los que siguen a un reporte de agente en otro idioma → VEGU
- L-005 — Para elegir el sistema de diseño, pedir varias propuestas (claro y oscuro) y dejar que el usuario combine: salió C2 de C + B → VEGU
- L-008 — La guarda de Bash de los agentes bloquea `<` y `>`: sus commits salen sin `Co-Authored-By` → VEGU
- L-014 — Leer la fila de un supuesto en `assumptions.md` antes de citarlo al usuario → VEGU
- L-016 — Durante una slice, los reportes y documentos de la slice se editan solo en su rama: editarlos también en `main` choca al traer `main` → VEGU
- L-017 — Al cerrar cada lote, juntar en una sola lista lo que solo el dispositivo real puede confirmar y pedírselo al usuario en una pasada → VEGU
- L-027 — Un usuario con poca experiencia se pierde entre slices, lotes, pasos y rondas: mapa de ubicación en cada mensaje y página `status.html` con los colores de la app → VEGU

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
- **Estado:** Promovida a la guarda del tester (`.claude/agents/tester.md`, T-005 / MANT-001, PR #2, 2026-11-26)
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

### L-018 — 2026-11-26 — Caracteres especiales también en el código de la app
- **Categoría:** Herramienta
- **Etapa:** Construcción
- **Qué pasó:** en el lote 4 la herramienta de escritura del coder convirtió el signo de tecla (`U+20E3`) en el carácter real dentro de una expresión regular de `src/inputFilter.ts`. El coder lo vio y lo dejó como `\u{20E3}`. Es el mismo fallo de L-009, ahora en código de la app.
- **Lección:** todo carácter invisible o combinable en el código (app o pruebas) se escribe con su código (`\u{...}`), y después de escribir se busca `\p{Mn}`, `\p{Me}` y `\p{Cf}` en los archivos tocados.
- **Por qué importa:** un invisible dentro de una regla de filtro no se ve al revisar; la regla haría otra cosa sin que nadie lo note.
- **Cómo aplicarla:** como el fallo se repitió, se propone atajarlo en el origen con una regla automática (lint o una prueba que busque esos caracteres en `src/` y `tests/`); queda como decisión pendiente del usuario.
- **Estado:** Vigente
- **Relacionada con:** L-009, L-002, `src/inputFilter.ts`

### L-019 — 2026-11-26 — Leer la razón de cada rojo cuando la salida se corta
- **Categoría:** Herramienta
- **Etapa:** Construcción
- **Qué pasó:** en el trabajo A del lote 4 el tester tenía 43 rojos y la salida completa de Playwright se cortaba en su terminal.
- **Lección:** repetir la corrida por grupos con `--grep` (sin `|`, que la guarda bloquea) para leer la razón de cada fallo.
- **Por qué importa:** un rojo solo vale si falla por la razón esperada; una razón que no se vio no se da por buena.
- **Cómo aplicarla:** el tester lo hace cuando la salida se corta; el Manager confirma el total con `--reporter=dot`. → VEGU
- **Estado:** Vigente
- **Relacionada con:** PI-5, propuesta del tester (lote 4)

### L-020 — 2026-11-26 — Cómo probar un tope de alto en una captura
- **Categoría:** Producto y estructura
- **Etapa:** Construcción
- **Qué pasó:** en el lote 2 el designer no podía distinguir, con una sola captura, si el campo se había detenido en 5 líneas o todavía no llegaba a su tope. En el lote 4 la prueba midió el alto con 5 y con 8 líneas y comprobó que había texto escondido, y el hallazgo se cerró.
- **Lección:** una captura de un tope mide el alto en el límite, lo vuelve a medir pasado el límite y comprueba que hay contenido escondido.
- **Por qué importa:** una captura de un campo alto sola no prueba que se detuvo.
- **Cómo aplicarla:** el tester lo aplica en toda captura de un límite de tamaño. → VEGU
- **Estado:** Vigente
- **Relacionada con:** `tests/e2e/captures.spec.ts`, propuesta del designer (lote 4)

### L-021 — 2026-11-26 — Contra qué versión se corre el rojo de una prueba publicada
- **Categoría:** Proceso y memoria
- **Etapa:** Construcción
- **Qué pasó:** el plan pedía el rojo de P-10 contra la preview del lote 1, que no tiene campo. El tester avisó que la prueba fallaría por la pantalla y no por el conteo; se usó la del lote 2 (`bc098a3`) y TC-002 falló justo en `counts after "c"`.
- **Lección:** se elige la versión por lo que muestra (la pantalla completa sin el comportamiento), no por el número de lote.
- **Por qué importa:** un rojo que falla antes de llegar a lo que se quiere demostrar no prueba nada (PI-5).
- **Cómo aplicarla:** el planner lo escribe así en el plan; el Manager revisa la razón del rojo antes de aceptarlo. → VEGU
- **Estado:** Vigente
- **Relacionada con:** plan VS-001 §P-10, propuesta del tester (lote 5)

### L-022 — 2026-11-26 — Los minutos de GitHub Actions son de la cuenta
- **Categoría:** Proceso y memoria
- **Etapa:** Construcción
- **Qué pasó:** al empezar P-9 el usuario recordó que otro proyecto (BankApp) ya había usado 1.986 de los 2.000 minutos gratis de noviembre; la CI de CONTAPP no habría alcanzado. Se resolvió volviendo público el repositorio (D-016).
- **Lección:** antes de planear la CI se revisa el consumo de la cuenta (`gh api users/<usuario>/settings/billing/usage`) y la visibilidad del repositorio.
- **Por qué importa:** la CI es la red de seguridad de la fusión; si se queda sin minutos, bloquea la entrega.
- **Cómo aplicarla:** el planner lo incluye en el paso de CI de la walking skeleton. → VEGU
- **Estado:** Vigente
- **Relacionada con:** D-016, plan VS-001 §P-9

### L-023 — 2026-11-26 — Un pase libre en un filtro debe ser exacto
- **Categoría:** Enseñanza y conteo
- **Etapa:** Construcción
- **Qué pasó:** el filtro dejaba entrar completo todo carácter que tuviera algo de emoji (U+20E3); por ahí entraron "ç⃣" y "α⃣", y una "c" escrita se volvió "ç⃣" (BRK-C-1 a C-3, BRK-U-3).
- **Lección:** un pase libre se define por lo que el carácter es en total, no porque contenga una parte permitida.
- **Por qué importa:** lo que va pegado a la parte permitida (letras, marcas, invisibles) entra sin revisar y rompe C-011 y C-015.
- **Cómo aplicarla:** el planner escribe las reglas de pase completo con ejemplos de lo que NO debe pasar; el tester los prueba.
- **Estado:** Vigente
- **Relacionada con:** `src/inputFilter.ts`, plan §5.2, propuesta del breaker-code

### L-024 — 2026-11-26 — Bandera `i` en listas cerradas de letras
- **Categoría:** Herramienta
- **Etapa:** Construcción
- **Qué pasó:** `SPANISH_LETTER` usaba las banderas `iu`; la "ſ" (U+017F) se pliega a "s" y entró (BRK-C-4, BRK-U-6).
- **Lección:** en una lista cerrada de letras se escriben mayúsculas y minúsculas una por una, sin `i`.
- **Por qué importa:** con `u`, `i` acepta letras de otros alfabetos que se pliegan a las de la lista.
- **Cómo aplicarla:** el coder no usa `i` en expresiones de letras permitidas; el reviewer lo revisa.
- **Estado:** Vigente
- **Relacionada con:** C-011, propuesta del breaker-code

### L-025 — 2026-11-26 — Atacar "volver atrás" y deshacer/rehacer
- **Categoría:** Proceso y memoria
- **Etapa:** Construcción
- **Qué pasó:** las pruebas de escribir, pegar y recargar pasaban, pero volver atrás restauraba el texto con conteos en 0 (BRK-U-1) y rehacer tras un rechazo metía la "ç" y repetía el texto (BRK-U-2).
- **Lección:** en una pantalla que reescribe un campo, el architect incluye "volver atrás" y deshacer/rehacer en las reglas y el tester los prueba, comparando con un campo sin la app.
- **Por qué importa:** el navegador puede cambiar el campo sin pasar por el camino que se probó.
- **Cómo aplicarla:** agregarlo al catálogo `edge-cases` (uso de la app). → VEGU
- **Estado:** Vigente
- **Relacionada con:** D-017, CA-7, propuestas del breaker-user

### L-026 — 2026-11-26 — Dirección única de la preview de un commit
- **Categoría:** Herramienta
- **Etapa:** Construcción
- **Qué pasó:** para el rojo de P-10 hacía falta la preview de un commit viejo; la API de despliegues de GitHub no la tiene (L-007).
- **Lección:** `vercel ls contapp -m githubCommitSha=<sha completo>` devuelve la dirección única de ese commit (abre sin iniciar sesión, D-013).
- **Por qué importa:** la dirección de la rama cambia con cada push; para comparar versiones se usa la única.
- **Cómo aplicarla:** el Manager la usa para rojos sobre versiones publicadas.
- **Estado:** Vigente
- **Relacionada con:** L-007, D-013, `evidence/published/p10-publicada.md`

### L-027 — 2026-11-26 — Ubicación siempre visible para el usuario
- **Categoría:** Proceso y memoria
- **Etapa:** Construcción
- **Qué pasó:** el usuario dijo que se pierde: muchas veces no sabe en qué vertical slice, lote o paso está, ni cuánto lleva y cuánto falta del proyecto.
- **Lección:** la ubicación no puede vivir solo en `progress.md` ni en la cabeza del Manager; hay que mostrarla siempre, en dos niveles: un mapa de 3 líneas al comienzo de cada mensaje con avance (proyecto · construcción/revisión · ahora → sigue) y una página de avance (`_project/status.html`, publicada como artifact) con el camino completo del proyecto: primero la **Fase 0 (entendimiento)**, que es donde arranca todo proyecto, y luego todas las slices, la slice en curso paso a paso y un glosario corto.
- **Por qué importa:** sin saber dónde está, el usuario no puede revisar ni decidir con criterio (rol de tutor de `AGENTS.md`).
- **Cómo aplicarla:** el Manager pone el mapa en cada mensaje con avance y actualiza y republica `status.html` en cada cierre de sesión. La página usa **solo los colores definidos para la app** en su sistema de diseño (claro y oscuro) y marca los estados con símbolos (✓ terminado · ▸ en curso · ○ pendiente), sin colores propios (decisión del usuario, 2026-11-26). Piloto en Contapp; se lleva a VEGU al cerrar VS-001 con la opinión del usuario como evidencia.
- **Estado:** Vigente
- **Relacionada con:** D-019, `AGENTS.md` §1 (perfil del usuario), `_project/status.html` → VEGU

### L-028 — 2026-11-26 — Zona de escritura antes del encargo
- **Categoría:** Proceso y memoria
- **Etapa:** Construcción
- **Qué pasó:** el mini-lote de herramientas quedó bloqueado porque `stryker.config.json` no estaba en la zona de escritura del coder; lo creó el Manager.
- **Lección:** antes de encargar un archivo nuevo, comprobar en la guarda del agente que puede escribirlo.
- **Por qué importa:** un encargo imposible gasta una vuelta completa del agente.
- **Cómo aplicarla:** el Manager revisa `guard-write-zone` al armar el paquete; si el archivo no entra, lo crea él o lo dice en el paquete.
- **Estado:** Vigente
- **Relacionada con:** D-020, playbook §1 → VEGU

### L-029 — 2026-11-26 — Carpeta de la raíz en .gitignore
- **Categoría:** Herramienta
- **Etapa:** Construcción
- **Qué pasó:** el Manager pidió ignorar `reports/`; eso habría sacado de git todos los reportes de los agentes (`_project/slices/*/reports/`). El coder lo cambió a `/reports/`.
- **Lección:** una carpeta de la raíz se escribe con barra inicial.
- **Por qué importa:** sin ella, git ignora sin aviso cualquier carpeta con ese nombre.
- **Cómo aplicarla:** revisar cada línea nueva de `.gitignore` contra las carpetas del proyecto.
- **Estado:** Vigente
- **Relacionada con:** D-020

### L-030 — 2026-11-26 — Expresiones ancladas y caracteres Prepend
- **Categoría:** Enseñanza y conteo
- **Etapa:** Construcción
- **Qué pasó:** la mutación dejó vivos 6 mutantes que quitan el `^` de expresiones que juzgan un grafema; un grafema puede llevar piezas antes de la base (Prepend: `U+0600`, `U+0D4E`). El plan definía el Prepend delante de un emoji, pero no delante de una tecla de número.
- **Lección:** toda expresión anclada que juzga un grafema lleva una prueba con un Prepend delante, y toda forma de pase completo define qué pasa con un Prepend.
- **Por qué importa:** sin esa prueba, quitar el ancla pasa en verde y una letra ajena podría entrar (C-011).
- **Cómo aplicarla:** el planner incluye el Prepend en los ejemplos negativos (complemento de L-023); el tester lo prueba. Pendiente en DT-010 y DT-011.
- **Estado:** Vigente
- **Relacionada con:** L-023, DT-010, DT-011

### L-031 — 2026-11-26 — Reescribir un campo: deshacer y selección
- **Categoría:** Producto y estructura
- **Etapa:** Construcción
- **Qué pasó:** tras un rechazo, deshacer y rehacer metían la letra ajena y repetían texto (BRK-U-2); y `applyInput` no podía distinguir pegar "aç" sobre "as" de escribir "ç" sobre "s" porque no recibe la selección.
- **Lección:** si la app reescribe un campo, el plan decide qué pasa con deshacer/rehacer y con la selección antes de construir.
- **Por qué importa:** son comportamientos del navegador que la app rompe sin darse cuenta.
- **Cómo aplicarla:** el planner los pone en §5 de la interfaz; el tester comprueba que la firma de la función distingue los casos antes de fijar pruebas unitarias.
- **Estado:** Vigente
- **Relacionada con:** L-025, DT-003, plan VS-001 §5.1–§5.2

### L-032 — 2026-11-26 — Dependencias: decisión y npm audit
- **Categoría:** Proceso y memoria
- **Etapa:** Construcción
- **Qué pasó:** las 4 herramientas de D-020 se instalaron antes de que D-020 estuviera en `decisions.md`, y los avisos de `npm audit` pasaron de 8 a 12 sin que nadie lo anotara en el lote.
- **Lección:** toda dependencia nueva se registra como decisión antes de instalarse, y se corre `npm audit` antes y después.
- **Por qué importa:** así se sabe qué avisos trae cada dependencia (DT-005).
- **Cómo aplicarla:** el Manager registra la decisión al aprobarla (no solo en el cierre) y corre `npm audit` en el lote; el coder no puede correrlo.
- **Estado:** Vigente
- **Relacionada con:** D-020, DT-005 → VEGU

### L-033 — 2026-11-26 — Mutante bloqueante: reproducir antes de abrir ronda
- **Categoría:** Proceso y memoria
- **Etapa:** Construcción
- **Qué pasó:** el reviewer marcó 2 mutantes "sería bloqueante"; el Manager recomendó una ronda 2 y luego, al ejecutar el filtro con esos casos, comprobó que la app ya se portaba bien: faltaba la prueba, no había defecto. Se registró DT-011 y no se abrió ronda.
- **Lección:** antes de recomendar una ronda por un mutante, ejecutar el comportamiento actual con el caso exacto.
- **Por qué importa:** una ronda en nivel Alto relanza reviewer y security; no se gasta sin defecto real.
- **Cómo aplicarla:** el Manager reproduce cada "sería bloqueante" y le dice al usuario si es defecto o prueba faltante, con su riesgo práctico.
- **Estado:** Vigente
- **Relacionada con:** DT-011 → VEGU

### L-034 — 2026-11-26 — Reproducciones en prosa
- **Categoría:** Proceso y memoria
- **Etapa:** Construcción
- **Qué pasó:** el reporte de BRK-U-2 decía que pasaba "al pegar façade y rehacer"; el tester lo corrió y sin deshacer antes no falla.
- **Lección:** toda variante que un breaker describe solo en prosa se corre antes de fijarla como prueba.
- **Por qué importa:** si no, queda un rojo supuesto.
- **Cómo aplicarla:** el tester corre cada variante y anota cuáles no reproducen.
- **Estado:** Vigente
- **Relacionada con:** BRK-U-2, TC-044 → VEGU

### L-035 — 2026-11-26 — El rojo se comprueba en la aserción exacta
- **Categoría:** Proceso y memoria
- **Etapa:** Construcción
- **Qué pasó:** en MANT-001 el primer rojo de `guards.test.mjs` fallaba porque la función de la prueba leía las comillas corridas un lugar, no porque la guarda bloqueara `npm run check`. Con la guarda nueva siguió fallando y así se descubrió.
- **Lección:** el rojo se comprueba leyendo la aserción y el valor exactos que fallan; además, el rojo se vuelve a correr contra la versión vieja después de corregir la prueba, y se prueba quitar la pieza nueva para ver que la prueba lo nota.
- **Por qué importa:** un rojo por la razón equivocada hace pasar por buena una prueba que no prueba nada (PI-5).
- **Cómo aplicarla:** el Manager y el tester citan en el reporte la línea y el mensaje del rojo (p. ej. `npm run check -- -- -o … (0 !== 2)`).
- **Estado:** Vigente
- **Relacionada con:** MANT-001, commits 7ebfe6d y bf9b4b1 → VEGU

### L-036 — 2026-11-26 — Un comando permitido se permite exacto
- **Categoría:** Proceso y memoria
- **Etapa:** Construcción
- **Qué pasó:** al dar `npm run check` al tester se prohibió `--fix`; security encontró en dos rondas más opciones que escriben archivos o ejecutan código (`-o`, `-c`, `--prefix`, `--script-shell`, `--node-options`…) y que npm acepta abreviaturas (`--prefi`).
- **Lección:** al permitirle un comando nuevo a un agente se pregunta si alguna opción (de npm y de lo que npm llama, después de `--`) escribe, carga configuración o ejecuta código; si el agente no necesita variantes, se permite el texto exacto.
- **Por qué importa:** una lista de prohibidos siempre deja otra salida.
- **Cómo aplicarla:** marca de comando exacto en la guarda (DT-012) y revisar las opciones antes de proponer el cambio.
- **Estado:** Vigente
- **Relacionada con:** DT-012, MANT-001 → VEGU

### L-037 — 2026-11-26 — Las guardas son barandas, no una jaula
- **Categoría:** Proceso y memoria
- **Etapa:** Construcción
- **Qué pasó:** security mostró que el tester ya ejecuta código propio con vitest y playwright, así que puede rodear sus tres guardas si lo intenta a propósito.
- **Lección:** las guardas de Bash detienen errores, no a un agente que desobedece; donde un agente ejecuta código que escribe, se dice como riesgo aceptado en lugar de suponer que la guarda lo cubre.
- **Por qué importa:** evita confiar en una protección que no existe.
- **Cómo aplicarla:** registrar el riesgo (DT-014) y revisar en cada diff de `tests/` los imports de `node:fs` y `node:child_process`.
- **Estado:** Vigente
- **Relacionada con:** DT-014 → VEGU

### L-038 — 2026-11-26 — Probar la guarda real y lo que debe seguir pasando (acierto)
- **Categoría:** Proceso y memoria
- **Etapa:** Construcción
- **Qué pasó:** `guards.test.mjs` lee los argumentos reales de `tester.md` (`agentGuardArgs`) en vez de una copia, y comprueba que `npm run test:unit` y `npx playwright test … --project=iphone` siguen permitidos.
- **Lección:** la prueba de una guarda usa la definición real del agente y prueba tanto lo bloqueado como los comandos de trabajo del agente, sobre todo los que se parecen a lo prohibido (`--output=` frente a `-o`).
- **Por qué importa:** un cambio en el `.md` rompe la prueba; una guarda demasiado estricta no falla en la revisión sino a mitad de una slice.
- **Cómo aplicarla:** reusar `agentGuardArgs` para coder, reviewer y security; DT-018 agrega el comando de capturas.
- **Estado:** Vigente
- **Relacionada con:** MANT-001, DT-018 → VEGU

### L-039 — 2026-11-26 — ESLint 10 carga configuración por carpeta
- **Categoría:** Herramienta
- **Etapa:** Construcción
- **Qué pasó:** security verificó en la documentación de ESLint 10 que la configuración se busca desde la carpeta de cada archivo: un `tests/eslint.config.js` se cargaría y ejecutaría con `eslint .`, también en la CI.
- **Lección:** la configuración de ESLint se fija con `-c eslint.config.js` en el script y se comprueba que no haya otra fuera de la raíz.
- **Por qué importa:** un agente con zona de escritura podría apagar el lint de esa zona sin que nadie lo note.
- **Cómo aplicarla:** DT-015.
- **Estado:** Vigente
- **Relacionada con:** DT-015 → VEGU

### L-040 — 2026-11-27 — Medir el teclado en la foto y calibrar con lo construido (acierto)
- **Categoría:** Producto y estructura
- **Etapa:** Construcción
- **Qué pasó:** el designer convirtió la foto del iPhone del lote 3 de VS-001 a píxeles de la página (591 px de foto ÷ 390 = 1,516) y comparó dónde termina hoy la 2.ª fila en la foto con su cuenta: así midió 427 px visibles y que SF Pro suma ≈ 10 px.
- **Lección:** el espacio con el teclado abierto se mide en una foto real convertida a píxeles de la página y se calibra contra algo ya construido, no solo se calcula.
- **Por qué importa:** en F-001 §5.5 el cálculo prometió que cabían las 4 fichas y en el iPhone no cabían (D-015).
- **Cómo aplicarla:** toda promesa de "cabe con el teclado" trae su medida desde una foto y su margen de calibración; refuerza L-015.
- **Estado:** Vigente
- **Relacionada con:** L-010, L-015, D-015, F-003 §5.2

### L-041 — 2026-11-27 — Orden de los `@media` en el CSS
- **Categoría:** Herramienta
- **Etapa:** Construcción
- **Qué pasó:** al planear P-4 y P-5 de VS-002, el planner vio que `src/styles.css` tiene un `@media` de pantalla angosta antes del componente; una regla del componente dentro de ese `@media` pierde contra la regla base que va después, porque pesan igual.
- **Lección:** los ajustes de un componente para pantallas angostas van en un `@media` después del componente.
- **Por qué importa:** sin eso, un cambio de espacios taparía el ajuste de 320 px sin que nadie lo note salvo una prueba.
- **Cómo aplicarla:** el plan de VS-002 lo fija en P-4 ("Orden en el archivo"); el reviewer lo mira en cada diff de `styles.css`.
- **Estado:** Vigente
- **Relacionada con:** `_project/slices/VS-002/plan.md` P-4

### L-042 — 2026-11-27 — Contratos de prueba que no se rompen con cada cambio de pantalla
- **Categoría:** Proceso y memoria
- **Etapa:** Construcción
- **Qué pasó:** el architect encontró el mismo texto visible exacto de toda la pantalla copiado en 4 archivos de prueba; el planner tuvo que dar las propiedades calculadas del `::before` de la imagen porque el tester no tiene selector para encontrarlo.
- **Lección:** el texto esperado de toda la pantalla vive en una sola función compartida, y un pseudo-elemento que es contrato de prueba lleva en el plan sus propiedades exactas (tamaño, color, máscara).
- **Por qué importa:** cada cambio de texto obligaba a tocar muchos archivos; sin contrato, el tester tendría que leer el código.
- **Cómo aplicarla:** el planner lo pone en "Interfaces públicas"; el reviewer marca como duplicación un texto esperado copiado.
- **Estado:** Vigente
- **Relacionada con:** DT-008, DT-017 → VEGU

### L-043 — 2026-11-27 — Verificar maquetas con WebKit (acierto)
- **Categoría:** Herramienta
- **Etapa:** Construcción
- **Qué pasó:** el designer no pudo abrir sus maquetas y pidió confirmar que las imágenes (máscaras CSS con SVG) se veían y que nada se cortaba; el Manager las capturó con `npx playwright screenshot --browser webkit --full-page --viewport-size "1400,900" file:///…` y las revisó.
- **Lección:** las maquetas se verifican en WebKit, el motor de Safari, con la Playwright ya instalada; complementa L-004 (Edge) cuando la técnica depende del navegador.
- **Por qué importa:** una máscara CSS puede dibujarse distinto en Safari que en Edge.
- **Cómo aplicarla:** el Manager captura en WebKit toda maqueta con técnica dependiente del navegador antes de mostrarla al usuario.
- **Estado:** Vigente
- **Relacionada con:** L-004 → VEGU

### L-044 — 2026-11-27 — Pruebas de ancho que dependen de la letra
- **Categoría:** Herramienta
- **Etapa:** Construcción
- **Qué pasó:** en el lote 2 de VS-002 las pruebas de "cabe a 320 px" exigían columnas de 138 ±1 px, medidas del diseño pensadas para SF Pro. En Windows pasaron (166/166) y en la CI (Linux, letra tipo DejaVu, más ancha) fallaron 9: "Consonantes" ensanchó su columna 4,8 px. El tester ya había anotado el riesgo, pero no se corrió en la CI antes de dar el rojo por bueno. Al corregir, fijar Arial con peso 800 hizo que Windows usara Arial Black: hubo que medir los números en 700 y que la guarda mida también un número.
- **Lección:** lo que exige el criterio ("nada se corta ni se sale") se prueba con la letra de la máquina; las medidas exactas del diseño, con una letra fijada por la prueba, en un peso que tengan todas las máquinas, y con una guarda que compruebe que esa letra se aplicó. Las pruebas de ancho se corren en la CI antes de aceptar su rojo o su verde.
- **Por qué importa:** la letra cambia de máquina en máquina (L-010); sin esto, la CI se pone en rojo por una letra que el usuario nunca verá, o una prueba relajada deja pasar un diseño roto.
- **Cómo aplicarla:** el tester lo aplica a toda medida que dependa del ancho del texto; el planner lo pide en "Interfaces públicas" cuando fija anchos del diseño.
- **Estado:** Vigente
- **Relacionada con:** L-010, `_project/slices/VS-002/reports/tester.md` (Lote 2 — fallo de la CI y corrección), CI 46009483415 → VEGU

### L-045 — 2026-11-27 — El tester prueba sus pruebas (acierto)
- **Categoría:** Proceso y memoria
- **Etapa:** Construcción
- **Qué pasó:** en los lotes 1 a 3 de VS-002 el tester, sin leer `src/`, inyectó desde la prueba el CSS del plan (las pruebas pasaron) y luego lo dañó a propósito (dibujos cambiados entre grupos, texto en la imagen, sin el ajuste de 320 px, sin el tope nuevo): cada daño falló con su razón. Así encontró y corrigió errores propios antes del coder.
- **Lección:** una prueba en rojo se valida dos veces: con lo que pide el contrato inyectado y retirado (debe pasar) y con un daño a propósito (debe fallar por la razón correcta).
- **Por qué importa:** una prueba que se detiene en su primera aserción esconde errores en las siguientes; complementa L-035.
- **Cómo aplicarla:** el tester lo hace en todo trabajo A de pantalla y lo reporta en "Prueba de las pruebas"; retira todo lo temporal y lo comprueba con Grep.
- **Estado:** Vigente
- **Relacionada con:** L-035 → VEGU

### L-046 — 2026-11-27 — La guarda de los agentes y la línea de atribución
- **Categoría:** Herramienta
- **Etapa:** Construcción
- **Qué pasó:** el coder no pudo terminar sus commits con `Co-Authored-By: … <noreply@anthropic.com>`: la guarda de Bash bloquea `<`, `>` y saltos de línea. Sus commits de VS-002 (`d0de68b`, `58e824e`, `b2fd3e5`, `4de9b70`) quedaron sin esa línea.
- **Lección:** la atribución de commits y la guarda de los agentes chocan; hoy un agente no puede cumplir las dos.
- **Por qué importa:** es una regla de trabajo que el agente no puede cumplir sin rodear la guarda (L-037).
- **Cómo aplicarla:** mientras se resuelve en VEGU, los commits del coder van sin la línea y el Manager lo acepta; la solución (permitir `git commit -F <archivo>` o que el Manager haga esos commits) se decide en VEGU.
- **Estado:** Vigente
- **Relacionada con:** L-011, L-037 → VEGU

### L-047 — 2026-11-27 — Calcular "cabe" en el ancho más angosto de cada tramo
- **Categoría:** Producto y estructura
- **Etapa:** Construcción
- **Qué pasó:** el diseño de VS-002 calculó que todo cabe a 320 y a 390 px, pero el ajuste angosto aplica "menos de 360 px": a 360 px (imagen de 44 px) "100" con su imagen pide ≈ 143 px y la ficha deja ≈ 138. Lo vieron el tester y el designer en el lote 2; el usuario decidió anotarlo como borde que espera.
- **Lección:** al diseñar un ajuste por ancho, la cuenta de "cabe" se hace en el ancho más angosto de cada tramo (aquí 320 y 360), no solo en los anchos de referencia.
- **Por qué importa:** el borde de una regla de ancho es justo donde el diseño queda más apretado.
- **Cómo aplicarla:** el designer lo incluye en la sección de diseño de cada feature con ajustes por ancho; el tester prueba ese borde.
- **Estado:** Vigente
- **Relacionada con:** L-041, `_project/slices/VS-002.md` §6 → VEGU
