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

# Trabajo C — Lote 2 — VS-001
**Fecha:** 2026-11-26 · **Trabajo:** Revisión visual (lote 2, P-3: estado 1 y crecimiento del campo) · **Commit revisado:** `4ad30e5`

## Resumen
Revisé las 6 capturas del lote 2 contra `design-system.md`, la sección 5 de F-001 y la maqueta. También leí `index.html`, `src/styles.css` y `src/main.ts` para confirmar los tokens. **No hay hallazgos bloqueantes.** La estructura, el orden, los textos exactos, los colores en los dos modos, los espacios y el ancho de 320 px coinciden con lo aprobado. Las 4 desviaciones que anotó el coder no son defectos del código. Dejan 4 hallazgos menores: 2 de documentación, 1 de evidencia pendiente y 1 de verificación en el iPhone real.

## Archivos creados o modificados
- `_project/slices/VS-001/reports/designer.md` — esta sección, agregada al final. No edité nada más; `design-system.md` se corrige en `main` (ver propuestas).

## Cómo revisar
- Abre las 6 capturas en `_project/slices/VS-001/evidence/capturas/lote-2/` y, al lado, `_project/design/F-001/mockup.html` (estados 1 y 5).
- **Ojo con las capturas de crecimiento:** tienen texto, pero las fichas siguen en 0. Es lo esperado: en este lote la pantalla todavía no está conectada a la función que cuenta (eso es P-6, lote 3). En esas capturas solo se revisa el campo.

## Revisión fila por fila (skill design-system, sección 9)
| # | Qué se compara | Resultado |
|---|---|---|
| 1 | Estructura y orden | ✓ Título → etiqueta → campo → fichas. Fichas 2 × 2 en el orden Vocales, Consonantes / Números, Otros. En el HTML cada ficha va primero con el nombre (`dt`) y después con el número (`dd`), y se ve con el número arriba, como pide 5.6 |
| 2 | Textos exactos | ✓ "Contapp", "Escribe una palabra o frase", "Vocales", "Consonantes", "Números" (con tilde), "Otros". El campo no tiene texto de ejemplo. Pestaña "Contapp", `lang="es-CO"` |
| 3 | Estados de este lote | ✓ Estado 1 (vacío) en claro y oscuro, a 390 y a 320 px. Crecimiento del campo, de 2 líneas (≈ 90 px) a 4 con la frase de 100 caracteres. Los estados 2 y 3 son del lote 3 y el 4 completo del lote 4 |
| 4 | Valores del dominio | ✓ El 0 se muestra como "0", con cifras simples |
| 5 | Tokens | ✓ Los 10 colores coinciden con `design-system.md` §2 en los dos modos, y los tamaños y pesos de letra con §3. La regla de menos de 360 px (18 y 44 px) se aplica en las capturas de 320. Espacios medidos en la captura de 390: 16 px a los lados, 8 px de la etiqueta al campo, ≈ 20 px del campo a las fichas y 12 px entre fichas. Ver hallazgos 1 y 2 |
| 6 | Accesibilidad | ✓ Los contrastes son los de la tabla aprobada. La etiqueta está unida al campo (`for`). El campo mide más de 44 px de alto. Cada ficha lleva su nombre escrito. No se bloquea el zoom. El foco no se puede revisar todavía: no hay captura del campo activo hasta el lote 3 |
| 7 | Anchos | ✓ A 320 px no se corta nada: "Consonantes" cabe con margen en su ficha (≈ 107 de ≈ 118 px útiles, con la letra de la captura). No hay desplazamiento horizontal en ningún ancho |
| 8 | Detalles finos | Ver hallazgos 1 a 4 |

## Las 4 desviaciones del coder: qué documento manda
1. **Relleno lateral del campo: 12 px (`--space-3`) contra 14 px en la maqueta.** **Manda `design-system.md`.** Su §4 dice que `--space-3` es el relleno del campo, y el skill prohíbe medidas escritas a mano. El error está en la maqueta: escribí `14px` en vez del token. El coder hizo bien. La diferencia de 2 px no cambia el uso. → Hallazgo 1 (documentación, no código).
2. **Medidas sin token (104 px, anillo de 3 y 2 px, 2 px entre número y nombre, 480 px, altos de línea).** **No es un hallazgo del código.** Todas esas medidas están escritas en `design-system.md` (§3 altos de línea, §4 anillo y ancho máximo, §5 alto mínimo de la ficha) o en F-001 §5.1, y el CSS usa exactamente esos valores. La fila 5 prohíbe medidas **fuera del sistema**, y estas están dentro, aunque sin nombre. Lo que falta es en el documento: decir cómo se escriben. Además, §4 tiene una inconsistencia: pone "separación número–nombre (2 px dentro de la ficha)" en la fila de `--space-1`, que vale 4 px. → Hallazgo 2 (documentación).
3. **La frase de 100 caracteres ocupa 4 líneas, no 5.** **Mandan F-001 §5.3 y `design-system.md` §5** ("crece con el texto hasta 5"). Con 4 líneas es el comportamiento correcto: el campo mide lo que el texto necesita (≈ 152 px = 4 líneas + relleno + borde). El `rows="5"` de la maqueta fija una caja para mostrar el estado. No dice que esa frase deba ocupar 5 líneas. No es un hallazgo. Lo que todavía **no se ve** en una captura es el tope: que el campo se quede en 5 líneas y se desplace por dentro. → Hallazgo 3 (evidencia pendiente).
4. **La letra no es SF Pro.** **Manda `design-system.md` §3, y el CSS la cumple.** La lista de letras (`--font-family-base`) es exactamente la aprobada. El navegador simulado corre en Windows y no tiene SF Pro, así que usa Segoe UI, que está en la misma lista. Esto es un límite de la evidencia, no un defecto. Consecuencia: en el iPhone los renglones pueden partirse distinto, y la palabra "Consonantes" a 320 px podría quedar más justa. → Hallazgo 4 (verificar en el iPhone real).

## Hallazgos
| # | Pantalla | Hallazgo | Severidad |
|---|---|---|---|
| 1 | Maqueta F-001, campo | `mockup.html` usa `padding: var(--space-3) 14px`: los 14 px están escritos a mano y contradicen `design-system.md` §4. Hay que cambiarlo por `padding: var(--space-3)` en la maqueta. El código no se toca | **Menor** — es un error de la maqueta, no de la app. Son 2 px y no cambian el uso |
| 2 | `design-system.md` §3–§4 | Algunas medidas aprobadas no tienen nombre de token ni una regla que diga cómo escribirlas. Además, el "2 px" de la separación número–nombre aparece en la fila de `--space-1` (4 px). Propuesta abajo | **Menor** — el código usa los valores aprobados. Solo falta que el documento sea explícito |
| 3 | Campo, más de 5 líneas | No hay captura del tope de 5 líneas con desplazamiento por dentro, por ejemplo con 7 saltos de línea. Hoy lo comprueba solo `screen.spec.ts`. Pido esa captura (claro y oscuro, 390 × 844) en el lote 4, junto al estado 4 | **Menor** — no bloquea este lote: el estado 4 completo es del lote 4. Si en el lote 4 sigue faltando, termino BLOCKED |
| 4 | Toda la pantalla, en el iPhone | Las capturas usan Segoe UI y no SF Pro. Recomiendo que la verificación del Manager en la preview (iPhone real con Safari, D-009) incluya una foto del estado 4 con la frase de 100 caracteres, para confirmar que cabe en 5 líneas o menos y que nada se corta | **Menor** — el CSS es correcto. Es un riesgo de evidencia, no un defecto |

**Bloqueantes: ninguno.** El lote 2 puede seguir.

## Propuesta: columnas `COMPLETAR AL DECIDIR` de `design-system.md` §5 (D-011, sin librería)
Esto es solo una propuesta; no edité `design-system.md`. Recomiendo cambiar el nombre de la columna "Base en la librería" a **"Base en el código (D-011: HTML + clase en `src/styles.css`)"** y llenarla así:

| Componente (código) | Base en el código | Variantes | Cuándo se usa |
|---|---|---|---|
| `AppTitle` | `<h1 class="app-title">` en `index.html` · clase `.app-title` | — | (sin cambio) |
| `TextField` | `<label class="field-label" for="text-field">` + `<textarea class="field" rows="2">` con `autocomplete`, `autocorrect`, `autocapitalize` en `off` y `spellcheck="false"` · clases `.field-label`, `.field`, `.field:focus-visible` · el crecimiento de 2 a 5 líneas está en `src/main.ts` (`fitHeightToText`) | reposo · activo (`:focus-visible`) | (sin cambio) |
| `CountGrid` | `<dl class="counts">` · clase `.counts` | — | (sin cambio) |
| `CountCard` | `<div class="count"><dt>Nombre</dt><dd>número</dd></div>` · clases `.count`, `.count dt`, `.count dd` | — (en VS-002: una por `characterGroup`) | (sin cambio) |

Otros ajustes de `design-system.md` que conviene hacer en el mismo cambio, en `main`:
- **Línea 6:** la nota "El stack todavía no está decidido…" ya no es cierta. Propongo: "Stack decidido en D-011: sin librería de componentes; cada componente es HTML más una clase CSS en `src/styles.css`, y los tokens se definen una sola vez en `:root` de ese archivo (el modo oscuro, con `@media (prefers-color-scheme: dark)`)."
- **Historial (§10):** una fila nueva con la fecha, "Base en el código de los 4 componentes y medidas fijas", motivo D-011 y la revisión del lote 2.
- **Para el Manager:** con D-011 también se puede llenar el `COMPLETAR AL DECIDIR` de la sección 2 del skill design-system (`.claude/skills/design-system/SKILL.md`). Ejemplo de una línea: `:root { --color-primary: #1f6b33; }` en `src/styles.css`, que se usa como `color: var(--color-primary);`. En la sección 3 del skill: "sin librería (D-011)". Ese archivo no es de mi zona.

## Preguntas para el usuario
- **¿Cómo dejamos las medidas fijas (hallazgo 2)?** Recomiendo **(A)**: agregar a `design-system.md` §4 una lista corta de "medidas fijas aprobadas" (104 px de alto mínimo de la ficha, anillo de 3 px separado 2 px, 2 px entre número y nombre, 480 px de ancho máximo, altos de línea 1,1 / 1,2 / 1,3). El código no cambia. Cada medida se vuelve token cuando se use en un segundo lugar (VS-002). Contra: la regla "todo con token" deja de ser absoluta. **(B)**: crear ya 8 tokens nuevos (`--size-card-min`, `--focus-ring-width`, `--focus-ring-offset`, `--content-max-width`, `--line-height-*`…). Contra: más nombres para medidas que hoy se usan una sola vez, y cambiar el CSS en un lote que ya está en verde.
- **¿Corrijo la maqueta (hallazgo 1)?** Recomiendo que sí: es un cambio de una línea en `_project/design/F-001/mockup.html` (de `14px` a `var(--space-3)`), con una nota en el Historial. Lo hago cuando el Manager lo indique.

## Decisiones o lecciones propuestas
- **Lección (diseño):** en las maquetas, toda medida va con su token o como un valor que ya está en `design-system.md`. Nunca con un número suelto. Por qué: el `14px` de la maqueta obligó al coder a elegir entre dos documentos.
- **Lección (evidencia):** las capturas de un navegador simulado en Windows no usan la letra del iPhone. Los saltos de renglón y lo que cabe a 320 px se confirman en la preview con el iPhone real (D-009). Por qué: SF Pro y Segoe UI no tienen el mismo ancho.
- **Decisión propuesta:** en `design-system.md` §5, la columna "Base en la librería" pasa a ser "Base en el código", como en la tabla de arriba. Por qué: D-011 no usa librería de componentes.
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

# Trabajo C — Lote 3 — VS-001
**Fecha:** 2026-11-26 · **Trabajo:** Revisión visual (lote 3, P-5 y P-6: estados 2 y 3) · **Commit revisado:** `a2de990`

## Resumen
Revisé las 4 capturas nuevas del lote 3 (estado 2 "pingüino" con foco y estado 3 "¡Hola, 2026! 😀", en claro y oscuro, a 390 × 844). Las comparé con F-001 §5.3, `design-system.md` y la maqueta. Para confirmar el foco y los colores leí también `src/styles.css`, `src/main.ts` y `tests/e2e/captures.spec.ts`. **No hay hallazgos bloqueantes.** Los conteos, el foco, los colores y los espacios coinciden con lo aprobado. Quedan 2 hallazgos menores, y los dos se confirman en el iPhone real. El estado 1 no cambió. Las capturas de crecimiento ahora muestran los conteos de verdad (35 / 40 / 3 / 3), lo que se esperaba al conectar el conteo (P-6).

## Archivos creados o modificados
- `_project/slices/VS-001/reports/designer.md` — esta sección, agregada al final. No edité nada más.

## Cómo revisar
- Abre las 4 capturas `estado-2-escribiendo-…` y `estado-3-con-texto-…` de `_project/slices/VS-001/evidence/capturas/lote-3/`. Al lado, abre `_project/design/F-001/mockup.html` en los estados 2 y 3.
- En el estado 2, mira el **doble borde** del campo: el borde del campo y, separado por una franja fina del color del fondo, el anillo de foco. Es verde en claro y amarillo en oscuro. Es la señal de "aquí estás escribiendo".
- En el estado 3, el campo vuelve a su borde normal, gris verdoso y más delgado, porque ya no tiene el foco.

## Revisión fila por fila (skill design-system, sección 9)
| # | Qué se compara | Resultado |
|---|---|---|
| 1 | Estructura y orden | ✓ Igual que en el lote 2: título → etiqueta → campo → fichas 2 × 2, en el orden Vocales, Consonantes / Números, Otros. Las fichas en 0 siguen en su lugar (estado 2: Números 0, Otros 0) |
| 2 | Textos exactos | ✓ Los 6 textos de §5.4 sin cambios. No apareció ningún texto nuevo: ni aviso ni sugerencia (lo comprueba también TC-027) |
| 3 | Estados de este lote | ✓ **Estado 2:** "pingüino" en el campo, con foco, y conteos **4 / 4 / 0 / 0**, como en la maqueta. ✓ **Estado 3:** "¡Hola, 2026! 😀" sin foco, y conteos **2 / 2 / 4 / 4**, como en la maqueta. Los dos están en claro y oscuro. Lo de "al instante, sin animación" no se ve en una captura, pero lo prueba `typing.spec.ts` (TC-002 registra el conteo al terminar cada evento) y el CSS no tiene transiciones |
| 4 | Valores del dominio | ✓ Cifras simples: "0", "2", "4". Las cifras son del mismo ancho (`tabular-nums`), así que las fichas no se mueven |
| 5 | Tokens | ✓ El foco usa `--color-focus` (`#1F6B33` / `#FFDD55`) en el borde y en el anillo. En reposo, el borde usa `--color-input-border`. Los números van en `--color-primary`, los nombres en `--color-text` y el texto escrito en `--color-text` sobre `--color-input-bg`, en los dos modos. Los espacios no cambiaron respecto al lote 2 |
| 6 | Accesibilidad | ✓ **Foco visible**, que el lote 2 no podía revisar: anillo de 3 px separado 2 px (`outline: 3px` + `outline-offset: 2px`), con contraste 6,5:1 / 12,6:1. Se distingue bien del borde en reposo por color y por grosor, no solo por color. Cada ficha conserva su nombre escrito |
| 7 | Anchos | ✓ Los estados 2 y 3 se piden a 390 px (§5.7). En el estado 1 a 320 px no cambió nada respecto al lote 2 |
| 8 | Detalles finos | El emoji sale en color, con la letra de emojis de Windows. En el iPhone se verá el de Apple. Es lo esperado: un emoji no toma el color del texto. Ver hallazgos 1 y 2 |

## Lo que ya se revisó en el lote 2
- **Estado 1** (390 y 320, claro y oscuro): sin cambios.
- **Crecimiento** (frase de 100 caracteres): el campo sigue en 4 líneas, igual que en el lote 2. Lo único que cambió son las fichas, que ahora muestran **35 / 40 / 3 / 3**, los mismos valores del estado 4 de la maqueta. Es lo esperado al conectar el conteo. Siguen abiertos el hallazgo 3 del lote 2 (captura del tope de 5 líneas, que es del lote 4) y el hallazgo 4 (letra en el iPhone).

## Hallazgos
| # | Pantalla | Hallazgo | Severidad |
|---|---|---|---|
| 1 | Estado 2, con el teclado abierto | La captura simulada no dibuja el teclado del celular (`captures.spec.ts` lo dice). Por eso no se puede comprobar con ella lo que promete §5.5: que con el campo en 2 líneas las 4 fichas quedan completas por encima del teclado (≈ 433 de ≈ 457 px). Pido que la verificación del Manager en la preview (iPhone con Safari, D-009) incluya **una foto del estado 2 con el teclado abierto**, escribiendo "pingüino", donde se vea si la fila Números / Otros queda completa | **Menor** — el diseño y el CSS dejan las medidas previstas. Es evidencia que solo puede dar el iPhone real |
| 2 | Estado 2, foco en el iPhone | El anillo de foco usa `:focus-visible`. Los navegadores lo muestran siempre en un campo de texto, también al tocarlo con el dedo, pero las capturas lo activaron con el teclado del computador. En la misma foto del hallazgo 1, conviene confirmar que el anillo aparece al tocar el campo en Safari | **Menor** — es el comportamiento estándar, pero falta verlo en el iPhone (L-010) |

**Bloqueantes: ninguno.** El lote 3 puede seguir.

## Preguntas para el usuario
- Ninguna.

## Decisiones o lecciones propuestas
- **Propuesta para la verificación en la preview (VS-001):** juntar en una sola lista las fotos que solo el iPhone puede dar: estado 2 con el teclado abierto y el anillo de foco (hallazgos 1 y 2 de este lote), y estado 4 con la frase de 100 caracteres (hallazgo 4 del lote 2). Por qué: así el Manager las toma en una sola pasada y ningún pendiente de L-010 se pierde entre lotes.

STATUS: DONE

# Trabajo B — Ajuste teclado — VS-001
**Fecha:** 2026-11-26 · **Trabajo:** Diseño de feature (ajuste del documento) · **Commit base:** `907ee77`

## Resumen
Miré la foto del iPhone real (`_project/slices/VS-001/evidence/lote3-iphone-estado2-teclado.jpg`). Confirma lo que me pasaron: con "pingüino" y el teclado abierto en Safari, la fila Vocales / Consonantes se ve completa. De la fila Números / Otros se ven los "0", pero los nombres quedan cortados por la barra de la dirección de Safari, que va encima de la barra "⌃ ⌄ Listo" y del teclado. Mi cálculo de §5.5 (≈ 433 de ≈ 457 px) no contó esas dos barras de Safari. Como decidió el usuario, **solo corregí el documento**: la pantalla no cambia en VS-001 y el problema queda en el borde de VS-002. Esto cierra el hallazgo 1 del lote 3. El hallazgo 2 queda confirmado en modo claro: el anillo de foco se ve al tocar el campo con el dedo (en la foto se ve el doble borde verde). Falta probarlo en modo oscuro.

## Archivos creados o modificados
- `_project/features/F-001.md` — solo la viñeta de §5.5 sobre el teclado abierto (línea 128).
- `_project/slices/VS-001/reports/designer.md` — esta sección, agregada al final.

## Líneas cambiadas
**F-001 §5.5, línea 128 — antes:**
> - **Con el teclado abierto** (≈ 340 px) y el campo en 2 líneas, las 4 fichas se ven completas (≈ 433 de ≈ 457 px visibles). **Límite conocido:** si el campo crece a 3 o más líneas con el teclado abierto, la segunda fila de fichas queda detrás del teclado. Es el borde "Teclado abierto tapando los conteos", que espera en VS-002.

**Después:**
> - **Con el teclado abierto**, medido en el iPhone real con Safari (2026-11-26, foto `_project/slices/VS-001/evidence/lote3-iphone-estado2-teclado.jpg`): aun con el campo en 2 líneas, la primera fila (Vocales, Consonantes) se ve completa, pero de la segunda fila solo se ven los números; los nombres "Números" y "Otros" quedan cortados. Causa: además del teclado, Safari pone encima la barra de la dirección y la barra "⌃ ⌄ Listo". Al tocar "Listo" se cierra el teclado y se ven las 4 fichas. **Límite conocido** (decisión del usuario, 2026-11-26: no se cambia en VS-001): es el borde "Teclado abierto tapando los conteos", que se resuelve en VS-002.

**Otras frases revisadas, sin cambios:**
- §5 (línea 66, "Los 4 conteos deben verse… borde que espera, VS-002"): ya remite a VS-002 y no promete nada sobre lo que se ve. La dejé igual. Además, esa parte es del architect.
- §5.3, fila del estado 2: describe el foco y que los conteos cambian al instante. No dice nada sobre las fichas por encima del teclado, así que la dejé igual.
- F-001 no tiene sección de historial, así que no agregué nota. El cambio queda en este reporte y en git.

## Cómo revisar
- Abre `_project/features/F-001.md` §5.5 y compara la viñeta del teclado con la foto.

## Preguntas para el usuario
- Ninguna.

## Decisiones o lecciones propuestas
- **Lección propuesta (diseño para el celular):** cuando se calcula el espacio libre con el teclado abierto en Safari del iPhone, hay que restar también la barra de la dirección y la barra "⌃ ⌄ Listo", no solo el teclado. Mejor aún: medirlo en el iPhone real antes de prometerlo en la feature (refuerza L-010). Por qué: mi cálculo de §5.5 no las contó y prometió algo que el iPhone no cumple. Sirve como dato de partida para VS-002.

STATUS: DONE
