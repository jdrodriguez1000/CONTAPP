# Trabajo A — Tres propuestas — VS-001
**Fecha:** 2026-11-25 · **Trabajo:** Sistema de diseño (primera etapa: tres propuestas de estilo)

## Resumen
Tres propuestas de estilo para toda la app, distintas entre sí, cada una con modo claro y modo oscuro y la pantalla de F-001 en tres estados (vacío, escribiendo "pingüino" con el teclado abierto y frase de 100 caracteres). Las tres usan **los mismos nombres de token** (`--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-primary`, `--color-on-primary`, `--color-border`, `--color-input-bg`, `--color-input-border`, `--color-focus`, más los de letra, espacios y formas). Solo cambian los valores. Las tres pasan WCAG AA en ambos modos. Siguiendo lo pedido, todavía no escribí `_project/design-system.md` ni la sección 5 de F-001.

## Archivos creados o modificados
- `_project/design/propuestas/propuesta-a.html` — A "Cuaderno limpio": ficha y 6 pantallas (3 estados × claro/oscuro).
- `_project/design/propuestas/propuesta-b.html` — B "Recreo": ficha y 6 pantallas.
- `_project/design/propuestas/propuesta-c.html` — C "Pizarra": ficha y 6 pantallas.
- `_project/slices/VS-001/reports/designer.md` — este reporte (archivo nuevo).

## Las tres propuestas
| | A — Cuaderno limpio | B — Recreo | C — Pizarra |
|---|---|---|---|
| **Idea** | Hoja limpia: fondo casi blanco, acento azul tinta, una tarjeta con 4 filas (nombre a la izquierda, número a la derecha) | Salón cálido: fondo crema, acento terracota, letra **redondeada**, 4 fichas grandes en cuadrícula 2 × 2 con el número enorme (44 px) arriba | Tablero escolar: verde y blanco (en oscuro, pizarra verde con tiza amarilla), letra gruesa, el número primero dentro de una insignia de color |
| **A favor** | La más sobria y fácil de leer para el adulto; el número siempre en el mismo lugar; es la que menos riesgo tiene de verse recargada | La que más se siente "para niños"; los números más grandes; la que **mejor cabe con el teclado abierto** (≈ 419 de ≈ 457 px); las fichas casi cuadradas son el lugar natural para las imágenes de VS-002 | El contraste más alto de las tres (hasta 16,7:1); el número resalta mucho en su insignia; encaja con el tema escolar |
| **En contra** | Se siente más de adulto que de niño; las filas son estrechas y las imágenes de VS-002 quedarían pequeñas | La letra redondeada **solo se ve en el iPhone** (en el computador cae en Segoe UI); el borde del campo en modo claro pasa AA con poco margen (3,6:1); la cuadrícula debe cuidarse para que las fichas no parezcan botones | Con el teclado abierto queda justa (≈ 430 px); en modo oscuro, el fondo verde limita los colores de grupo de VS-002; si la letra crece, la lista es lo primero que queda tapado |
| **Para quién encaja mejor** | Si la app la mira sobre todo el adulto y quiere algo tranquilo y neutro | Si la pantalla la miran **juntos el adulto y el niño** y se quiere que se sienta como un juego | Si importa ante todo que se lea desde lejos (p. ej. el celular sobre la mesa con varios niños) |

**Mi recomendación: B — Recreo.** Es la única que se siente pensada para un niño menor de 8 años sin perder claridad, y la que mejor aguanta lo que viene: sus fichas 2 × 2 ya tienen forma de tarjeta con imagen (VS-002) y dejan más margen con el teclado abierto (borde que espera, VS-002). **Contra principal:** la letra redondeada es del iPhone y en el computador no se aprecia, así que la propuesta debe juzgarse en el celular o confiando en la descripción. **Suposiciones:** que el celular de uso es un iPhone con Safari (D-009) y que el niño mira la pantalla junto al adulto.

## Cómo revisar
- Abre cada archivo con doble clic (se abre en el navegador; no necesita internet). Si los dos celulares no caben lado a lado, aleja la vista con **Ctrl y −** (67 % suele bastar).
- En cada archivo, arriba está la **ficha** (idea, paleta, letra, tamaños, contraste); debajo, los **tres estados** con el modo claro a la izquierda y el oscuro a la derecha.
- Mira sobre todo: (1) cuál se siente más amable para el niño; (2) si los números se leen de un vistazo; (3) en el estado "Escribiendo", que los 4 conteos se vean por encima del bloque gris del teclado; (4) cuál de los dos modos te gusta más en cada propuesta.
- **Lo que no verifiqué:** no pude abrir los archivos en un navegador. Que todo cabe (los 4 conteos sobre el teclado y la frase de 100 caracteres en 5 líneas) lo comprobé **sumando las medidas**, no mirando la pantalla. Pido al Manager que abra los tres archivos y confirme que nada se corta, en especial la frase de 100 caracteres dentro del campo. El contraste lo calculé con la fórmula de WCAG; conviene volver a medirlo con una herramienta cuando se construya.
- La frase de 100 caracteres es "El niño Mateo tiene 7 años y lee cuentos largos con su abuela. ¡Hoy contó 25 ovejas antes de dormir!": 100 caracteres con espacios y 81 sin ellos = 35 vocales + 40 consonantes + 3 números + 3 otros.
- El teclado es un bloque gris de ≈ 340 px (teclado más la barra de Safari encima). Es una estimación: se confirma en el iPhone real.

## Preguntas para el usuario
1. **¿Cuál de las tres propuestas eliges, y en qué modo la usarás más (claro u oscuro)?** Recomiendo B. Se puede tomar una y ajustar detalles, como el color de acento o el tamaño de los números.
2. **Nombre en pantalla:** en las maquetas el título dice "Contapp", por el nombre del repositorio. ¿Ese es el nombre que verán los niños, o prefieres otro? (Recomiendo un nombre corto y fácil de leer.)
3. **Modo claro u oscuro:** ¿la app sigue sola el modo del celular? Recomiendo que sí, sin botón para cambiarlo, porque un botón sería pantalla nueva que VS-001 no pide.
4. **Campo de varias líneas:** propongo un campo que empieza con 2 líneas y crece hasta 5, para que la frase de 100 caracteres se vea completa y se acepten los saltos de línea (A-001). La otra opción es un campo de una sola línea, más simple, pero ahí la frase larga se sale por el lado. ¿De acuerdo con varias líneas?
5. **Mayúscula automática:** el iPhone pone en mayúscula la primera letra al empezar a escribir. Esto no cambia los conteos (C-005), pero sí lo que ve el niño ("Casa" en vez de "casa"). ¿La apagamos también, junto con el corrector (D-009)? Recomiendo apagarla, para que en el campo quede exactamente lo que se escribió.
6. **Etiqueta del campo:** propongo "Escribe una palabra o frase", tuteando, que suena cercano en Colombia para un niño. ¿Te sirve, o prefieres otro texto o usted?

## Decisiones o lecciones propuestas
- **Solo fuentes del sistema del iPhone en VS-001**, sin descargar fuentes. Por qué: la página funciona sin internet (pensando en VS-006) y no se agregan dependencias. Para VS-002 (F-003, "letra grande") propongo **evaluar una letra escolar** con la "a" y la "g" de un solo trazo, como las que aprenden los niños (p. ej. Andika, de licencia libre). Las fuentes del iPhone usan la "a" de dos pisos. Es una propuesta de tecnología: la decide el usuario con el planner.
- **Mismos nombres de token en las tres propuestas.** Por qué: cambiar de propuesta solo cambia valores, no código. Los tokens de color por grupo (`--color-vowel`, `--color-consonant`, `--color-digit`, `--color-other`) se agregan en VS-002, no ahora.
- **Los conteos no se ven como botones** (sin sombra ni relieve). Por qué: en VS-001 no se pueden tocar, y un niño intentaría tocarlos.

STATUS: DONE

# Trabajo A — Propuesta C2 — VS-001
**Fecha:** 2026-11-26 · **Trabajo:** Sistema de diseño (primera etapa: ajuste de la propuesta elegida)

## Resumen
Nueva maqueta **C2 — Pizarra con fichas**. Tiene la paleta, la letra y el estilo de C, en claro y oscuro, con los 4 grupos dispuestos como en B: fichas en cuadrícula 2 × 2, el número grande arriba y el nombre debajo. Los colores no cambian; solo se ajustaron el tamaño del número y la forma de las fichas. Pasa WCAG AA en ambos modos, y con el teclado abierto los 4 conteos se ven completos. No toqué las propuestas A, B ni C, ni escribí `design-system.md` ni la sección 5 de F-001.

## Archivos creados o modificados
- `_project/design/propuestas/propuesta-c2.html` — ficha (qué cambió frente a C, paleta, letra, tamaños, contraste, teclado) y los 3 estados en claro y oscuro, en marcos de 390 × 844.
- `_project/slices/VS-001/reports/designer.md` — esta sección, agregada al final.

## Qué decidí en las fichas, y por qué
| Cambio frente a C | Decisión | Por qué |
|---|---|---|
| Insignia detrás del número | **Se quita** | Dentro de una ficha sería una caja dentro de otra caja. Obligaría a achicar el número y recargaría la ficha. Sin ella, el número sube de 26 a **48 px** y se lee mejor desde lejos. |
| Color del número | **Acento** (`--color-primary`): verde escolar en claro, amarillo tiza en oscuro | Conserva el resalte que daba la insignia. El nombre va en el color de texto normal, así número y nombre no compiten. |
| Separadores punteados de C | Pasan a ser el **borde de cada ficha** (2 px, punteado, decorativo) | Mantienen la idea de "tiza" de C. Sin sombra, para que las fichas no parezcan botones. |
| Esquinas | Fichas de 20 px (el tablero de C tenía 16) | A ese tamaño se ven más amables. |
| Tokens | Mismos nombres y valores de color que C; cambian solo `--font-size-count` (48 px) y `--radius-card` (20 px) | Al construir, pasar de C a C2 solo cambia dos valores y la disposición. |

**Contraste del par nuevo** (número en acento sobre la ficha): 5,9:1 en claro y 10,8:1 en oscuro. Pasa incluso el 4,5:1 del texto normal, aunque al ser texto grande bastaría con 3:1. Los demás pares son los de C, todos ✓.

**Con el teclado abierto:** quedan ≈ 457 px visibles y C2 usa ≈ 433 px. Los 4 conteos se ven completos, con ≈ 24 px de margen. "Consonantes" en 20 px negrita (≈ 127 px) cabe en una ficha de ≈ 173 px de ancho.

## Cómo revisar
- Abre `propuesta-c2.html` con doble clic. Puedes compararla con `propuesta-c.html` y `propuesta-b.html`: C2 debe sentirse como C, pero ordenada como B.
- Mira sobre todo: (1) que el número de 48 px se lea de un vistazo en los dos modos; (2) en "Escribiendo", que las 4 fichas queden completas por encima del bloque gris del teclado; (3) si el borde punteado te gusta o prefieres un borde liso.
- **Lo que no verifiqué:** igual que antes, no pude abrir el archivo en un navegador. Que cabe lo comprobé sumando medidas, y el contraste, con la fórmula de WCAG. Pido al Manager que lo abra y confirme que nada se corta, en especial la frase de 100 caracteres dentro del campo de 5 líneas.

## Preguntas para el usuario
- ¿C2 queda como la propuesta elegida para convertirla en el sistema de diseño (segunda etapa)?
- ¿Borde punteado de tiza, o liso? Recomiendo punteado: es lo que distingue el estilo Pizarra.
- Siguen pendientes las preguntas 2 a 6 de la sección anterior. "Contapp" y "Escribe una palabra o frase" quedan como provisionales.

## Decisiones o lecciones propuestas
- **En una ficha, el número va sin insignia y en el color de acento.** Por qué: a igual alto, el número casi se duplica (26 → 48 px), y en VS-002 ese mismo número puede tomar el color de su grupo sin agregar otra caja.

STATUS: DONE

# Trabajo A y B — Sistema de diseño y F-001 — VS-001
**Fecha:** 2026-11-26 · **Trabajo:** Sistema de diseño (segunda etapa) y Diseño de feature

## Resumen
Escribí el sistema de diseño a partir de C2 "Pizarra con fichas" (D-010), con las 10 secciones obligatorias del skill y sin nombrar librerías. También completé la sección 5 de F-001 (boceto, estados, textos exactos, teclado, accesibilidad y anchos) y la maqueta definitiva con 5 estados en claro y oscuro. Apliqué las respuestas del usuario: "Contapp", "Escribe una palabra o frase", mayúscula automática apagada, el modo lo decide el celular y el campo va de 2 a 5 líneas. No toqué las propuestas ni las demás secciones de F-001.

## Archivos creados o modificados
- `_project/design-system.md` — **nuevo**: principios, 10 tokens de color con su contraste en claro y oscuro, letra, espacios y formas, 4 componentes (`AppTitle`, `TextField`, `CountGrid`, `CountCard`), valores del dominio, navegación, textos, accesibilidad e historial.
- `_project/features/F-001.md` — **solo la sección 5**: quité la línea "Pendiente — designer.", agregué `Aprobación del diseño: Pendiente` y las subsecciones 5.1 a 5.7. La lista de necesidades del architect se conserva tal cual.
- `_project/design/F-001/mockup.html` — **nuevo**: maqueta autocontenida con los tokens copiados de `design-system.md`. Estados: 1 Vacío · 2 Escribiendo "pingüino" con teclado · 3 "¡Hola, 2026! 😀" (2/2/4/4) · 4 Límite de 100 (35/40/3/3) · 5 Comprobación a 320 × 568.
- Este reporte (sección agregada al final).

## Cómo revisar
- Abre `_project/design/F-001/mockup.html` con doble clic. Arriba hay un resumen y debajo los 5 estados, con claro a la izquierda y oscuro a la derecha.
- Compara los textos de la maqueta con la tabla 5.4 de F-001: deben ser idénticos, letra por letra.
- Revisa en la tabla 5.3 de F-001 que los estados cubren todo lo que esperas, en especial el 5 (rechazo silencioso: no cambia nada en pantalla).
- **Lo que no verifiqué:** no pude abrir los archivos en un navegador. Que todo cabe (fichas sobre el teclado, frase de 100 en 5 líneas, "Consonantes" a 320 px) lo comprobé sumando medidas. Pido al Manager que abra la maqueta y confirme que nada se corta.

## Qué agregué al diseño (más allá de C2), para que el usuario lo vea
- **Estado 3, frase con números, signos y emoji:** muestra las 4 fichas con valores distintos de 0 (TC-015).
- **Ancho mínimo de 320 px:** con menos de 360 px, el nombre baja a 18 px y el número a 44 px. Si no, "Consonantes" no cabe en su ficha. Es una regla del skill (funcionar desde 320 px), no una pantalla nueva.
- **Ancho máximo de 480 px**, centrado, para computador y celular girado. El ajuste fino queda para VS-002.
- **Accesibilidad:** cada ficha se lee "Vocales, 4", y los conteos **no** se anuncian solos con cada tecla (sería ruidoso para un lector de pantalla).
- **Letra del campo nunca menor a 16 px**, para que Safari no acerque la pantalla al tocar el campo.

## Límite conocido (para el usuario y el architect)
- Con el teclado abierto, las 4 fichas se ven completas mientras el campo tiene 2 líneas. Si crece a 3 o más, la segunda fila (Números, Otros) empieza a quedar detrás del teclado. Es el borde que ya espera en VS-002 ("Teclado abierto tapando los conteos"); no lo resolví aquí para no agrandar VS-001.

## Preguntas para el usuario
- Ninguna nueva. Solo falta su aprobación del diseño: la línea `Aprobación del diseño: Pendiente` de F-001 la cambia él (el Manager la registra).

## Decisiones o lecciones propuestas
- **Regla de pantallas angostas:** con menos de 360 px de ancho, `--font-size-group` = 18 px y `--font-size-count` = 44 px. Por qué: garantiza que "Consonantes" quepa a 320 px sin cortarse.
- **Los conteos no se anuncian solos en VS-001.** Por qué: evita ruido para lectores de pantalla; se revisa si alguien lo pide.
- **Para el coder, cuando se decida el stack:** los tokens se definen una sola vez y el modo se elige con la preferencia del sistema (en CSS, `prefers-color-scheme`). La maqueta los fuerza con clases solo para mostrarlos lado a lado.

STATUS: DONE

# Trabajo A — Ajustes del lote 2 — VS-001
**Fecha:** 2026-11-26 · **Trabajo:** Sistema de diseño (ajuste) · **Origen:** revisión visual del lote 2 (hallazgos 1 y 2), aprobada por el usuario el 2026-11-26

## Resumen
Hice los tres cambios que aprobó el usuario. Son solo de documentación; el código de la app no se tocó. `design-system.md` ya no tiene ningún `COMPLETAR AL DECIDIR`, y la maqueta de F-001 ya no tiene medidas escritas a mano en el campo.

## Archivos creados o modificados
- `_project/design-system.md`:
  - **Línea 6:** la nota "El stack todavía no está decidido…" se cambió por: "Stack decidido en D-011: sin librería de componentes; cada componente es HTML más una clase CSS en `src/styles.css`, y los tokens se definen una sola vez en `:root` de ese archivo (el modo oscuro, con `@media (prefers-color-scheme: dark)`)."
  - **§4, fila `--space-1`:** el uso pasó de "Mínimo; separación número–nombre (2 px dentro de la ficha)" a "Mínimo (reservado; la separación número–nombre es una medida fija de 2 px, ver abajo)". Así se corrige la contradicción, porque el token vale 4 px.
  - **§4, nueva lista "Medidas fijas aprobadas"** (opción A): 104 px de alto mínimo de la ficha; anillo de foco de 3 px separado 2 px; 2 px entre el número y el nombre; 480 px de ancho máximo; altos de línea 1,1 / 1,2 / 1,3. Va con la regla: solo estas medidas pueden ir sin token, cada una **se vuelve token cuando se usa en un segundo lugar**, y cualquier otra medida nueva se pide como token.
  - **§5:** la columna "Base en la librería" pasa a llamarse "Base en el código (D-011: HTML + clase en `src/styles.css`)". Llené las 4 filas con lo que propuse en la revisión del lote 2 (`.app-title`; `.field-label` + `.field` con `fitHeightToText`; `<dl class="counts">`; `.count` con `dt`/`dd`). Antes de escribirlas, confirmé los nombres de las clases en el `index.html` de la rama de VS-001. Las columnas "Variantes" y "Cuándo se usa" no cambian, salvo que la variante activa del campo ahora dice `:focus-visible`.
  - **§10 Historial:** agregué una fila con fecha 2026-11-26 que lista estos cambios. El motivo que anoté es D-011 más los hallazgos 1 y 2 del lote 2 (opción A).
- `_project/design/F-001/mockup.html` — **hallazgo 1:** en `.field`, `padding:var(--space-3) 14px` pasó a `padding:var(--space-3)`. Ya no queda ningún `14px` como relleno. El único `14px` que queda es el valor del token `--radius-input`, y ese es correcto.
- `_project/slices/VS-001/reports/designer.md` — esta sección, agregada al final.

## Cómo revisar
- `design-system.md` §4: la tabla nueva "Medidas fijas aprobadas" y su regla, debajo de "Ancho máximo del contenido".
- `design-system.md` §5: la columna "Base en el código".
- `mockup.html`: el campo debe verse con 12 px de relleno en los cuatro lados, igual que en la app construida. A simple vista no cambia casi nada (son 2 px por lado).
- No toqué `.claude/skills/design-system/SKILL.md` ni ningún archivo de `src/`.

## Preguntas para el usuario
- Ninguna.

## Decisiones o lecciones propuestas
- Siguen vigentes las dos lecciones que propuse en la revisión del lote 2: en las maquetas no van números sueltos, y la letra se verifica en el iPhone real. Las registra el Manager.

STATUS: DONE
