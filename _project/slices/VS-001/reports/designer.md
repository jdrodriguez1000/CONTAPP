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
