# Diseño de feature — VS-002
**Fecha:** 2026-11-27 · **Trabajo:** Diseño de feature (F-002 y F-003) con la ampliación del sistema de diseño que piden

## Resumen
- **Imágenes:** 3 opciones de 4 imágenes, todas dibujos propios en SVG que viajan dentro del CSS: A "Letras gorditas", B "Lo que hace cada grupo" (recomendada) y C "Juguetes del salón".
- **Colores:** 2 juegos de 4 colores. Recomiendo el juego 1 (vocales rojas, consonantes azules). Todos pasan 4,5:1 en claro y oscuro, también como letra sobre el campo.
- **Teclado:** medí la foto del iPhone. Con el teclado abierto quedan **427 px** visibles para la página. El diseño usa ≈ 395 px (≈ 402 con la letra del iPhone): los 4 grupos completos, con ≈ 25 px de margen.
- **D-010 se respeta:** no bajé ninguna letra ni cambié la cuadrícula 2 × 2 ni el número arriba. La imagen va **al lado** del número y solo se acortaron espacios.
- **Lo que queda abierto:** una frase de 50 caracteres no siempre cabe en 2 líneas. Queda como pregunta.

## Archivos creados o modificados
- `_project/design/F-002/mockup-b.html` — **nuevo**. Es la opción recomendada y la maqueta más completa:
  - tabla de colores con su contraste;
  - galería de imágenes en claro y oscuro, con los 2 juegos de colores, "sin color" y "nombres tapados";
  - estados 1, 2 ("pingüino" con el teclado), 2b (frase de 50 con el teclado), 3, 4 (100 caracteres) y 5 (320 × 568 con "100");
  - barras de Safari y teclado dibujados con la medida real (370 px).
- `_project/design/F-002/mockup-a.html` y `mockup-c.html` — **nuevos**. Tienen la misma pantalla con otras imágenes: galería y estados 1, 2, 3 y 5.
- `_project/features/F-002.md` — **solo la sección 5**: opciones de imagen (5.1), ficha (5.2), cómo se pinta (5.3), colores (5.4), estados (5.5), textos y accesibilidad (5.6), componentes (5.7) y pruebas que cambian (5.8). Dice `Aprobación del diseño: Pendiente`.
- `_project/features/F-003.md` — **solo la sección 5**: boceto con el teclado (5.1), medida desde la foto (5.2), espacios que cambian (5.3), letra (5.4), frase de 50 (5.5), textos (5.6), estados (5.7), anchos (5.8), botones (5.9) y letra escolar (5.10). Dice `Aprobación del diseño: Pendiente`.
- `_project/design-system.md` — todo lo nuevo va marcado **[VS-002, pendiente]**, con su fila en el historial:
  - §2: 4 tokens de color con su contraste;
  - §3: nota de la letra escolar;
  - §4: `--size-group-image` y nuevos usos de los espacios;
  - §5: variante por grupo de `CountCard`, `GroupImage` y la regla de botones para VS-005;
  - §9: accesibilidad de la imagen y de los botones.

## Cómo revisar
Abre con doble clic en el navegador, en este orden:
1. **`_project/design/F-002/mockup-b.html`**: lee el encabezado y la tabla de colores. Luego mira:
   - la sección 0 (imágenes de cerca);
   - el estado 2 y el 2b, que **son la prueba del teclado**: las 4 fichas deben verse completas por encima de la franja blanca de la dirección;
   - el estado 5, con "100" a 320 px.
2. **`mockup-a.html`** y **`mockup-c.html`**: compara solo la sección 0 y el estado 1.

Qué mirar:
- ¿Qué imágenes reconocería un niño sin leer? Usa la fila "nombres tapados". Se puede mezclar por grupo.
- ¿Qué juego de colores te gusta más, en claro y en oscuro?
- ¿Te sirve la imagen **al lado** del número?

Si los celulares no caben lado a lado, aleja la vista con **Ctrl y −**.

**Lo que no verifiqué:**
- No pude abrir las maquetas en un navegador. Pido al Manager que las abra y confirme estas tres cosas:
  1. que las imágenes se ven (usan máscaras CSS con SVG en línea);
  2. que nada se corta en los estados 2 y 2b;
  3. que "100" cabe a 320 px.
- Lo que cabe lo calculé con las medidas de la foto. El contraste, con la fórmula de WCAG.
- En el computador la letra no es SF Pro, así que la frase de 50 puede partirse distinto. Lo definitivo son las fotos de TC-061 y TC-062 en el iPhone.

## Medida del teclado (resumen; detalle en F-003 §5.2)
| Pieza (foto de 591 × 1280 = pantalla de 390 × 844, factor 1,516) | Alto |
|---|---|
| Barra de estado | 47 px |
| **Visible para la página** | **427 px** |
| Barra de la dirección de Safari | 22 px |
| Barra "⌃ ⌄ Listo" | 46 px |
| Teclado de letras | 302 px |

- Comprobación: en la foto, VS-001 llega a ≈ 446 px, es decir, ≈ 19 px de más. Coincide con los nombres cortados que se ven, y muestra que SF Pro suma ≈ 10 px a la cuenta.
- VS-002 usa ≈ 395 px (≈ 402 con SF Pro).
- El ahorro de ≈ 38 px sale de 5 espacios: el margen superior, título → etiqueta, el relleno vertical del campo, campo → fichas y el relleno vertical de la ficha. Ninguna letra baja.

## Preguntas para el usuario
1. **¿Qué imágenes eliges?** Recomiendo **B**: boca que canta, rompecabezas, mano que cuenta y carita feliz. Cada imagen dice qué hace su grupo y el adulto lo explica en una frase. **Contra:** el rompecabezas es la menos evidente, y la boca y la mano tienen más detalle, así que hay que confirmar en el iPhone que se reconocen a 44 px (TC-057). Puedes mezclar: por ejemplo, B con el dado de C para los números.
2. **¿Qué juego de colores?** Recomiendo el **juego 1 "Salón clásico"**: vocales rojas y consonantes azules, como en el cuaderno, más números naranjas y otros morados. **Contra:** el rojo y el naranja son los dos más parecidos entre sí. La alternativa es el juego 2 "Crayolas" (F-002 §5.4).
3. **¿Te sirve la imagen al lado del número, en la misma fila?** Así cabe con el teclado abierto sin tocar D-010: el número sigue arriba y el nombre abajo. Ponerla **encima** del número sumaría ≈ 50 px por fila y ya no cabría con el teclado. Recomiendo que sí.
4. **¿Qué manda si una frase de hasta 50 caracteres ocupa 3 líneas en el iPhone?** A 390 px caben ≈ 27 a 31 caracteres por línea con la letra de 24 px: muchas frases de 50 caben en 2 líneas, pero no todas. A 320 px ninguna cabe, aunque eso no lo exige CA-20.
   - **(1) Mandan las 2 líneas.** Lo recomiendo, porque es lo que ya dice CA-20 y no cambia nada más. La frase de prueba sería `el sol sale y la luna se va a dormir en su camita.` (50 caracteres, 17 / 20 / 0 / 1), que calculo en 2 líneas.
   - **(2) Mandan los 50 caracteres.** Habría que ver 3 líneas con el teclado abierto: 31 px más, que no caben (≈ 433 de 427). Solo se logra quitando el título "Contapp" de la pantalla (cambia CA-19) o bajando la letra del campo a 20 px (rompe CA-18).
5. **¿Letra escolar (Andika) o la del iPhone?** Recomiendo **dejar la del iPhone en VS-002** y, si quieres la "a" de un solo trazo, decidirlo para VS-003, cuando se pintan las letras.
   - **A favor de Andika:** está hecha para niños que aprenden a leer, con la "a" y la "g" de un solo trazo, como en el cuaderno. Tiene licencia libre SIL OFL 1.1.
   - **Contra 1, peso:** el archivo de la letra viaja dentro de la app, con unos cientos de KB si va completa y muchos menos si se recorta a las letras del español. Antes de recortarla hay que verificar en su licencia si tiene un "nombre reservado", porque eso obliga a renombrarla.
   - **Contra 2, grosores:** solo tiene normal y negrita, y hoy la app usa 600 y 800.
   - **Contra 3, riesgo y medidas:** agregarla sube el nivel de riesgo del lote (dependencia), y cambia el ancho de las letras, así que hay que volver a medir lo del teclado y la frase de 50.

## Decisiones o lecciones propuestas
- **Decisión propuesta (si el usuario aprueba):** imágenes [opción elegida] y colores [juego elegido] en los tokens `--color-vowel`, `--color-consonant`, `--color-digit` y `--color-other`. El color va en la imagen, el número y el borde de la ficha; la imagen va al lado del número. Con esto se cumple D-015 sin cambiar D-010. Por qué: los 4 grupos caben con el teclado abierto sin bajar ninguna letra.
- **Decisión propuesta:** las imágenes se pintan con `::before` y una máscara SVG escrita en el CSS, no como `<svg>` dentro del `dd`. Por qué: no pide archivos, toma sola el color del grupo y no obliga a cambiar `src/main.ts` ni las pruebas que leen el número. Además, mantiene ese paso en riesgo **bajo**, porque solo toca estilos. La técnica la confirma el planner.
- **Propuesta para el plan:** como ningún texto de pantalla cambia (F-003 §5.6), el **paso 5 del esbozo se quita**, como prevé VS-002 §8.
- **Lección propuesta (diseño para el celular):** para medir el espacio con el teclado abierto, hay que convertir la foto a píxeles de la página (ancho de la foto ÷ 390) y **calibrar con lo que ya está construido**. Comparar dónde termina la segunda fila en la foto con dónde termina según la cuenta mostró que SF Pro suma ≈ 10 px. Por qué: evita repetir el error de F-001 §5.5 y da un margen medido, no estimado (refuerza L-015).

STATUS: DONE

# Diseño de feature — VS-002 — elección del usuario
**Fecha:** 2026-11-27 · **Trabajo:** Diseño de feature (ajuste con la elección del usuario)

## Resumen
F-002 §5, F-003 §5 y `design-system.md` ahora tienen solo lo que eligió el usuario:
- imágenes de la opción B;
- colores del juego 1;
- imagen al lado del número;
- cuando una frase de hasta 50 caracteres ocupa 3 líneas, mandan las 2 líneas;
- letra del iPhone.

Las opciones A y C y el juego 2 quedan como **descartados**. Sus maquetas no se borraron y quedan como registro. Las dos features siguen con `Aprobación del diseño: Pendiente`. No toqué ninguna otra sección ni las maquetas.

## Archivos creados o modificados
- `_project/features/F-002.md`, **solo §5**:
  - la introducción apunta a `mockup-b.html` como maqueta del diseño;
  - §5.1 pasa a ser la tabla de las 4 imágenes elegidas (boca que canta, rompecabezas, mano que cuenta, carita feliz), con lo que le dice cada una al niño, y una línea que marca A y C como descartadas;
  - el catálogo queda con los 4 nombres de imagen que debe anotar el Manager;
  - §5.3 copia los dibujos de `mockup-b.html`;
  - §5.4 deja solo el juego 1 con su contraste y marca el juego 2 como descartado.
- `_project/features/F-003.md`, **solo §5**:
  - las maquetas A y C quedan como registro;
  - el boceto nombra las imágenes elegidas;
  - §5.3 registra que el usuario eligió la imagen al lado del número;
  - §5.5 dice que mandan las 2 líneas, con la frase de prueba de 50 caracteres. Si en la foto del iPhone esa frase ocupara 3 líneas, se cambia por otra de 50 que ocupe 2 y se deja escrita. La opción de que manden los 50 caracteres queda descartada;
  - §5.10 dice que se usa la letra del iPhone y que Andika no entra en VS-002 (puede volver en VS-003).
- `_project/design-system.md`:
  - se quitaron todas las marcas **[VS-002, pendiente]**; ahora cada pieza dice "(VS-002)";
  - encabezado actualizado;
  - §2: los 4 colores del juego 1 como elegidos y el juego 2 como descartado;
  - §3: Andika no entra en VS-002;
  - §4: los usos nuevos de los espacios pasan a la tabla y se quita la lista provisional;
  - §5: `GroupImage` nombra las 4 imágenes de la opción B;
  - §9 y la regla de botones, sin la marca;
  - historial: una fila nueva.
- Este reporte: esta sección, agregada al final.

## Dos cambios de coherencia que conviene revisar (no venían en la instrucción)
1. **`--color-primary` y `--color-border` (§2):** decían "número de cada ficha" y "borde punteado de las fichas". Con lo elegido, el número y el borde van en el color de su grupo. Ahora `--color-primary` queda solo para el título (y el foco) y `--color-border` queda reservado. La fila base de `CountCard` (§5) dice lo mismo. Sin este ajuste, el documento se contradecía consigo mismo.
2. **La tabla de componentes de §5 estaba partida:** una línea en blanco que dejé en mi entrega anterior separaba las filas `CountCard` (variante) y `GroupImage` del resto de la tabla. La uní.

## Cómo revisar
- `_project/design-system.md` §2, §4, §5 y §10: no debe quedar ningún "[VS-002, pendiente]". Lo comprobé buscando el texto en los tres archivos.
- F-002 §5.1 y §5.4, y F-003 §5.3, §5.5 y §5.10: deben nombrar solo lo elegido.
- La maqueta del diseño es `_project/design/F-002/mockup-b.html`. Las filas del juego 2 en su galería y las maquetas `mockup-a.html` y `mockup-c.html` son solo registro.

## Preguntas para el usuario
- Ninguna. Solo falta su aprobación del diseño, que registra el Manager.

## Decisiones o lecciones propuestas
- **Decisión para registrar (Manager):**
  - imágenes de la opción B: boca que canta, rompecabezas, mano que cuenta y carita feliz;
  - colores del juego 1: `#C62828`/`#FF7B72`, `#1565C0`/`#82B1FF`, `#A84B00`/`#FFB74D`, `#7B1FA2`/`#CE93D8`;
  - la imagen va al lado del número, y el color en la imagen, el número y el borde;
  - si una frase de hasta 50 caracteres ocupa 3 líneas, mandan las 2 líneas;
  - letra del iPhone; Andika podrá proponerse de nuevo en VS-003.

  Por qué: es la elección del usuario del 2026-11-27, y cumple D-015 sin cambiar D-010.
- **Catálogo (Manager):** columna "Imagen" de GRP-001 a GRP-004, con los nombres de F-002 §5.1.

STATUS: DONE

# Lote 1 — revisión visual
**Fecha:** 2026-11-27 · **Trabajo:** Revisión visual · **Commit revisado:** `4e74b73` (rama `feature/VS-002-imagenes-ninos`) · **Alcance:** solo P-2 (un color por grupo en el número y el borde punteado; nombre y fondo de la ficha sin cambio)

## Resumen
Las 16 capturas muestran lo aprobado para P-2: cada ficha lleva el color de su grupo en el número y en el borde punteado (rojo, azul, naranja, morado; los tonos más claros en modo oscuro), y el nombre y el fondo de la ficha siguen como en VS-001. Se ve igual en los 8 estados y en los dos modos, a 390 y a 320 px, sin desbordes. **No hay bloqueantes.** Lo que todavía no se parece a `mockup-b.html` (la imagen, los espacios más compactos y el ajuste para 320 px) es de los lotes 2 y 3, como dice el plan.

## Archivos creados o modificados
- `_project/slices/VS-002/reports/designer.md` — esta sección (agregada al final).

## Qué revisé
- **Capturas** (`_project/slices/VS-002/evidence/capturas/lote-1/`, 16): estado 1 vacío a 390 × 844 y 320 × 568, 2 "pingüino" con foco, 2b frase de 50 con foco, 3 "¡Hola, 2026! 😀", 4 límite de 100, 4 tope de 5 líneas y 5 con 100 "a" a 320 × 568; cada una en claro y oscuro. **Están todos los estados del plan §4 para el lote 1.** Son de Windows (L-010): la letra no es SF Pro, así que no juzgo anchos de texto finos.
- **Contra:** `mockup-b.html` (líneas 82, 89, 106-114), `design-system.md` §2, F-002/F-003 §5 y el plan (P-2, §4, §5.1).
- **Código, solo para la fila 5 (tokens):** `src/styles.css` define los 8 valores en `:root` y en `@media (prefers-color-scheme: dark)` (líneas 14-17 y 42-45), iguales a `design-system.md` §2; las 4 clases `.count--<grupo>` solo asignan `--group-color`; el borde (línea 130) y el número (línea 152) usan `var(--group-color)`; ningún color escrito a mano fuera de los tokens. `index.html` agrega solo `count--<grupo>` a cada ficha (mismos `data-testid`, mismo orden `dt` → `dd`). `--color-primary` sigue en el título (línea 75) y `--color-border` queda definido como reservado (§2).

## Revisión fila por fila (skill design-system §9)
| # | Qué se compara | Resultado |
|---|---|---|
| 1 | Estructura y orden | ✓ Título, etiqueta, campo y cuadrícula 2 × 2 en el orden de VS-001: Vocales, Consonantes / Números, Otros. Número arriba, nombre abajo. |
| 2 | Textos exactos | ✓ `Contapp`, `Escribe una palabra o frase`, `Vocales`, `Consonantes`, `Números` (con tilde), `Otros`. Ningún texto nuevo (F-003 §5.6). |
| 3 | Estados | ✓ Los 8 estados vigentes del lote 1, en claro y oscuro. En todos, color y borde iguales: no cambian con el conteo (CA-14). |
| 4 | Valores del dominio | ✓ Conteos correctos en pantalla: 4/4/0/0, 17/20/0/1, 2/2/4/4, 35/40/3/3, 16/18/0/0, 100/0/0/0. |
| 5 | Tokens | ✓ Colores de las capturas = juego 1 "Salón clásico": claro `#C62828` / `#1565C0` / `#A84B00` / `#7B1FA2`; oscuro `#FF7B72` / `#82B1FF` / `#FFB74D` / `#CE93D8`. Borde punteado de 2 px, el mismo radio de VS-001. Fondo de la ficha `--color-surface` y nombre `--color-text` sin cambio. |
| 6 | Accesibilidad | ✓ Los 8 colores pasan 4,5:1 sobre la ficha y sobre el campo (`design-system.md` §2; TC-052 lo recalcula). **Nunca solo color:** cada ficha sigue con su nombre escrito; el color ayuda, no reemplaza. El foco del campo (anillo doble en `--color-focus`) se sigue viendo en 2 y 2b. |
| 7 | Anchos sin desbordes | ✓ A 390 y a 320 px las 4 fichas caben, sin desplazamiento horizontal. A 320 px "Consonantes" y "100" caben completos (todavía sin imagen). |
| 8 | Detalles finos | Ver hallazgo 1. |

## Hallazgos
| # | Pantalla / captura | Hallazgo | Severidad |
|---|---|---|---|
| 1 | Carpetas `captures-P-3-—-captura-est-…-5-lineas-…` (claro y oscuro) | El nombre de la prueba del tope de 5 líneas empieza por **"P-3"**, que viene del plan de VS-001. En VS-002, P-3 es "Una imagen por grupo", y alguien que lea la carpeta de evidencia puede confundirse. La captura en sí está bien. Propuesta: el tester le cambia el nombre (p. ej. "estado 4b — tope de 5 líneas") cuando toque `captures.spec.ts` en el lote 2. | Pega menor |
| 2 | Todas | Falta la imagen de cada grupo a la izquierda del número (`GroupImage`, 44 px; 32 px a menos de 360 px). | Para lotes siguientes (lote 2, P-3 y P-4) — no es hallazgo de este lote |
| 3 | Todas (390 × 844) | Los espacios siguen como en VS-001: título → etiqueta 16 px (maqueta: 8), relleno del campo 12 px (maqueta: 8), campo → fichas 20 px (maqueta: 12), relleno de la ficha 12 px arriba y abajo (maqueta: 8). La 2.ª fila de fichas termina en ≈ 433 px, por encima de los 417 px que pide la aproximación de TC-061. | Para lotes siguientes (lote 3, P-5) — no es hallazgo de este lote |
| 4 | `estado-5-100-a-320x568-*`, `estado-1-vacio-320x568-*` | A 320 px el relleno de los lados de la ficha sigue en 8 px y "Consonantes" queda a pocos píxeles del borde. Hoy cabe, pero en el lote 2, con la imagen de 32 px al lado de "100", el espacio se aprieta. Por eso P-4 baja el relleno a 4 px. **Para mirar en las capturas del lote 2:** "100" + imagen dentro de la ficha de Vocales, y "Consonantes" sin tocar el borde. Con la letra del iPhone, la última palabra la tiene la foto de P-7 (L-010). | Para lotes siguientes (lote 2, P-4) |

**Observación sin severidad:** en el estado 3, el emoji 😀 sale con el dibujo de Windows (Segoe UI Emoji), que se ve distinto al del iPhone. No es de P-2 ni de la app.

## Cómo revisar
- Abrir `estado-3-con-texto-390x844-claro.png` y `…-oscuro.png`: es el único estado con los 4 conteos distintos de 0 y se ven los 4 colores a la vez. Compararlo con el estado 3 de `_project/design/F-002/mockup-b.html` sin mirar las imágenes, que llegan en el lote 2: los colores del número y del borde deben ser los mismos.
- Abrir `estado-5-100-a-320x568-claro.png`: confirma que a 320 px todo cabe antes de que llegue la imagen.

## Preguntas para el usuario
- Ninguna.

## Decisiones o lecciones propuestas
- Ninguna nueva. (El hallazgo 1 es un ajuste de nombre para el tester, no una regla.)

STATUS: DONE

# Lote 2 — revisión visual
**Fecha:** 2026-11-27 · **Trabajo:** Revisión visual · **Commit revisado:** `c96b277` (rama `feature/VS-002-imagenes-ninos`) · **Alcance:** solo lo cambiado desde el lote 1: P-3 (imagen de cada grupo a la izquierda del número) y P-4 (ajuste a menos de 360 px)

## Resumen
Las 16 capturas muestran lo aprobado:
- **P-3:** cada ficha tiene su imagen a la izquierda del número, en la misma fila, del color del grupo: boca que canta, rompecabezas, mano que cuenta y carita feliz. Se ve en claro y en oscuro.
- **P-4:** a 320 px la imagen es más pequeña, y "100" y "Consonantes" caben dentro de su ficha.

El número sigue arriba y el nombre abajo (D-010). **No hay bloqueantes.** Dejo una pregunta de diseño para lotes siguientes: el rango de 360 a 369 px, que mi diseño no calculó (hallazgo 1).

## Archivos creados o modificados
- `_project/slices/VS-002/reports/designer.md` — esta sección (agregada al final).

## Qué revisé
- **Capturas** (`_project/slices/VS-002/evidence/capturas/lote-2/`, 16): los mismos 8 estados del lote 1, en claro y oscuro:
  - 1 vacío, a 390 × 844 y a 320 × 568;
  - 2 "pingüino" con foco;
  - 2b frase de 50 con foco;
  - 3 "¡Hola, 2026! 😀";
  - 4 límite de 100;
  - 4b tope de 5 líneas;
  - 5 con 100 "a" a 320 × 568.

  **Están todos los estados que pide el lote 2.** Las capturas son de Windows, no del iPhone (L-010). Por eso no juzgo anchos finos de letra ni si las imágenes se reconocen a 44 px (eso lo dice la foto del iPhone, TC-057).
- **Contra:** `mockup-b.html` (líneas 67-75, 106-117), `design-system.md` §4 y §5 (`GroupImage`, `CountCard` por grupo) y F-002 §5.2-5.3.
- **Código, solo para la fila 5 (tokens):** `src/styles.css`.
  - Los 4 SVG (líneas 139, 143, 147 y 151) son **idénticos letra por letra** a `--img-vowel` … `--img-other` de la maqueta.
  - `--size-group-image` vale 44 px en `:root` (línea 28) y 32 px en `@media (max-width: 359px)` (línea 52).
  - `.count dd::before` usa `currentColor` y `mask` / `-webkit-mask` (líneas 175-182).
  - El bloque final de menos de 360 px (líneas 186-188) pone el relleno lateral y la separación en `--space-1`.
  - No hay ningún color escrito a mano fuera de la definición de los tokens.

## Revisión fila por fila (skill design-system §9)
| # | Qué se compara | Resultado |
|---|---|---|
| 1 | Estructura y orden | ✓ En cada ficha, imagen → número en la misma fila y nombre debajo. La cuadrícula 2 × 2 queda en el orden de VS-001. La imagen va centrada en alto con el número, como en la maqueta. |
| 2 | Textos exactos | ✓ Sin cambios: `Contapp`, `Escribe una palabra o frase`, `Vocales`, `Consonantes`, `Números`, `Otros`. La imagen no agrega texto. |
| 3 | Estados | ✓ Los 8 estados, en los dos modos. La imagen y el color son los mismos con 0, con 4 y con 100: no cambian con el conteo (F-002 §5.5). |
| 4 | Valores del dominio | ✓ Los conteos son correctos: 0/0/0/0, 4/4/0/0, 17/20/0/1, 2/2/4/4, 35/40/3/3, 16/18/0/0 y 100/0/0/0. Ningún número se corta, ni con 2 cifras (35, 40) ni con 3 (100). |
| 5 | Tokens | ✓ La imagen tiene el mismo color que el número y el borde de su ficha (rojo, azul, naranja y morado; tonos claros en modo oscuro). A 390 px la imagen mide lo mismo que la maqueta (≈ 44 px, casi tan alta como el número). A 320 px se ve más pequeña (≈ 32 px), con menos separación y menos relleno lateral. Las medidas exactas las comprueban TC-059 y TC-064. |
| 6 | Accesibilidad | ✓ Las 4 imágenes se distinguen por la forma, no solo por el color: boca con nota, pieza con dos salientes, mano con dedos y círculo con cara. Cada ficha conserva su nombre escrito. La imagen es decorativa: el lector de pantalla no la lee (TC-056). El foco del campo se sigue viendo en 2 y 2b. |
| 7 | Anchos sin desbordes | ✓ A 390 px, "40" y "35" con su imagen caben con holgura. A 320 px, la imagen + "100" quedan dentro de la ficha de Vocales con unos pocos px a cada lado, y "Consonantes" no toca el borde punteado (`estado-5-100-a-320x568-*`). No hay desplazamiento horizontal. **Mi hallazgo 4 del lote 1 queda resuelto** en Windows; la última palabra la tiene la foto del iPhone (P-7). |
| 8 | Detalles finos | Sin hallazgos nuevos. Mi hallazgo 1 del lote 1 (carpeta con el nombre "P-3") **quedó resuelto**: ahora se llama "estado-4b — tope de 5 líneas". |

## Hallazgos
| # | Pantalla / captura | Hallazgo | Severidad |
|---|---|---|---|
| 1 | Ninguna captura (ancho sin probar) | **De 360 a ≈ 369 px de ancho**, mi diseño no tiene una cuenta. Ahí la imagen ya mide 44 px con 8 px de separación, pero la ficha es más angosta que a 390 px. Con la letra del iPhone (SF Pro), "100" mide ≈ 91 px: 44 + 8 + 91 = **143 px**, y a 360 px la ficha deja ≈ **138 px** útiles. Es decir, "100" con su imagen podría salirse de la ficha. A 375 px (iPhone SE y mini) quedan ≈ 2,5 px de margen, así que el iPhone de referencia no se ve afectado; sí se verían afectados celulares Android de 360 px. Lo señaló primero el tester ("Lote 2", sección "Entre 360 y ≈ 369 px"); aquí lo confirmo como **hueco de mi diseño**, no del código. Ver la pregunta 1. | Para lotes siguientes |
| 2 | Todas, a 320 px y 390 px | Con 32 px, la nota musical de la boca y el saliente del rompecabezas se ven pequeños en la captura. En la pantalla de Windows siguen siendo reconocibles, pero falta confirmar en el iPhone que el niño los distingue (TC-057, foto de P-7). | Para lotes siguientes (P-7) |

**Observación sin severidad:** los espacios todavía son los de VS-001 (título → etiqueta, relleno del campo y de la ficha, campo → fichas). Eso es P-5 del lote 3, como se acordó, y no cuenta como hallazgo.

## Cómo revisar
- Abrir `estado-3-con-texto-390x844-claro.png` y `…-oscuro.png`, y compararlas con el estado 3 de `_project/design/F-002/mockup-b.html`. Deben verse las 4 imágenes, cada una del color de su número y su borde.
- Abrir `estado-5-100-a-320x568-claro.png`: "100" con su imagen pequeña debe estar dentro de la ficha roja, y "Consonantes" completo dentro de la azul.

## Preguntas para el usuario
1. **¿Qué hacemos con las pantallas de 360 a 369 px (hallazgo 1)?**
   - **(a) Recomiendo** anotarlo en los "Bordes que esperan" de VS-002 y no cambiar nada ahora. El dispositivo de referencia es el iPhone (390 px, y 375 en los modelos pequeños), y a esos anchos sí cabe. **Contra:** un celular Android de 360 px podría ver "100" pegado o saliéndose del borde de la ficha.
   - **(b)** Subir el límite del ajuste de "menos de 360 px" a "menos de 375 px" (`max-width: 374px`). Con eso, de 360 a 374 px también se usarían la imagen de 32 px y el relleno de 4 px. **Contra:** cambia una regla aprobada (`design-system.md` §3 y §4, F-002 §5.2), mueve las pruebas que hoy miran 359 y 360 px, y además baja la letra de 48 a 44 px y de 20 a 18 px en esos anchos. Pide ronda con el planner y el tester.

## Decisiones o lecciones propuestas
- **Lección propuesta (diseño para el celular):** al diseñar un ajuste por ancho, la cuenta de "cabe" se hace en el ancho **más angosto de cada tramo**: 320 y **360**, no solo 320 y 390. Por qué: el borde de una regla de "menos de 360 px" es justo 360, y ese fue el ancho que quedó sin calcular.

STATUS: DONE

# Lote 3 — revisión visual
**Fecha:** 2026-11-27 · **Trabajo:** Revisión visual · **Commit revisado:** `e5c18bc` (código de `9c45554`, rama `feature/VS-002-imagenes-ninos`) · **Alcance:** solo lo cambiado desde el lote 2: P-5, la pantalla más compacta para ver los 4 grupos con el teclado abierto

## Resumen
Las 20 capturas muestran lo aprobado en F-003 §5.3. Se acortaron los 5 espacios y ninguna letra ni imagen cambió de tamaño. A 390 × 427, que es lo que deja ver el teclado (aproximado), se ven completos el título, la etiqueta, el campo y las 4 fichas, con imagen, número y nombre. Pasa en claro y en oscuro, con "pingüino" y con la frase de 50 en 2 líneas. Debajo de la segunda fila quedan ≈ 30 px libres, lo que coincide con mi cuenta de F-003 §5.2 (≈ 395 de 427). **No hay bloqueantes.**

## Archivos creados o modificados
- `_project/slices/VS-002/reports/designer.md` — esta sección (agregada al final).

## Qué revisé
- **Capturas** (`_project/slices/VS-002/evidence/capturas/lote-3/`, 20), en claro y en oscuro:
  - los 8 estados de los lotes anteriores: 1 vacío a 390 × 844 y a 320 × 568, 2, 2b, 3, 4, 4b tope de 5 líneas y 5 con 100 "a" a 320 × 568;
  - **nuevos:** estados 2 ("pingüino") y 2b (frase de 50) a **390 × 427**.

  **Están todos los estados que pide el plan §4 para el lote 3.** Son capturas de Windows, sin teclado ni barras de Safari, y la letra no es SF Pro (L-010, L-015). Por eso los 427 px son una aproximación: lo definitivo es la foto del iPhone (P-7).
- **Contra:** F-003 §5.1 a §5.3 y §5.7, la tabla "Medidas de la pantalla desde P-5" del plan §5.1, `mockup-b.html` (estados 2 y 2b) y `design-system.md` §4.
- **Código, solo para la fila 5 (tokens):** en `src/styles.css`, los 5 espacios nuevos usan tokens. Son estos:
  - `.app` con `padding: var(--space-2) …` (línea 67);
  - el título con `margin: 0 0 var(--space-2)` (línea 72);
  - el campo con `padding: var(--space-2) var(--space-3)` y su tope `calc(5 * 1.3em + 2 * var(--space-2) + 2 * var(--border-width-input))` (líneas 93 y 95);
  - las fichas con `margin: var(--space-3) 0 0` (línea 119);
  - cada ficha con `padding: var(--space-2)` (línea 129).

  El ajuste de menos de 360 px (líneas 187-188) sigue al final del archivo, como se definió en P-4.

## Revisión fila por fila (skill design-system §9)
| # | Qué se compara | Resultado |
|---|---|---|
| 1 | Estructura y orden | ✓ Igual que en el lote 2: título, etiqueta, campo y cuadrícula 2 × 2 (Vocales, Consonantes / Números, Otros). En cada ficha van la imagen y el número en la misma fila y el nombre debajo (D-010). Solo cambiaron los espacios. |
| 2 | Textos exactos | ✓ Sin cambios (F-003 §5.6). |
| 3 | Estados | ✓ Están los 10 estados en los dos modos. El 2 y el 2b a 390 × 427 corresponden al estado 2 de F-003 §5.7 ("escribiendo, teclado abierto"). |
| 4 | Valores del dominio | ✓ Los conteos son correctos: 0/0/0/0, 4/4/0/0, 17/20/0/1, 2/2/4/4, 35/40/3/3, 16/18/0/0 y 100/0/0/0. |
| 5 | Tokens | ✓ Las medidas que se ven en las capturas coinciden con la tabla del plan: arriba ≈ 8 px; título → etiqueta ≈ 8; campo vacío de ≈ 82 px de alto (antes 90); campo → fichas ≈ 12; fichas de ≈ 104 px de alto, con 12 px entre ellas. El tope de 5 líneas mide ≈ 176 px y deja ver las 5 líneas completas (`estado-4-tope-5-lineas-*`). Colores e imágenes, sin cambio. |
| 6 | Accesibilidad | ✓ El anillo de foco del campo (2 y 2b) se ve completo y no toca las fichas: cabe en los 12 px de separación, como prevé F-003 §5.3. Las letras no bajaron (CA-18) y el texto del campo sigue en 24 px. Nada depende solo del color. |
| 7 | Anchos sin desbordes | ✓ A 390 px y a 320 px no hay desplazamiento horizontal. A 320 px, "100" con su imagen y "Consonantes" siguen dentro de su ficha, igual que en el lote 2 (P-5 no tocó los lados). **A 390 × 427**, el borde de abajo de "Números" y "Otros" queda en ≈ 395 px, con ≈ 30 px de margen. Si se suman los ≈ 10 px que agrega SF Pro, quedan ≈ 20 px de margen en el iPhone. |
| 8 | Detalles finos | Sin hallazgos. Con menos relleno, la ficha se ve más llena, pero el número, la imagen y el nombre no se tocan entre sí ni tocan el borde punteado. |

## Hallazgos
| # | Pantalla / captura | Hallazgo | Severidad |
|---|---|---|---|
| 1 | `estado-2-teclado-390x427-*`, `estado-2b-teclado-390x427-*` | Las capturas cortan la página a 427 px, pero no tienen el teclado ni las barras de Safari. En Windows, la frase de 50 se parte como calculé en F-003 §5.5 ("…se va a" / "dormir en su camita."). Falta confirmar en el iPhone, con SF Pro y las barras reales, que los 4 grupos y la línea donde se escribe siguen a la vista. Eso lo dicen TC-061 y TC-062 con foto, en P-7. | No bloqueante — se confirma en P-7 (lote 4) |
| 2 | Bordes que esperan (D-024 y D-025) | Este lote no cambia nada de lo que dicen D-024 (pantallas de 360 a 369 px) y D-025 (la letra real a 320 px). P-5 solo cambió el alto, no el ancho, así que esos bordes no empeoran ni mejoran. No hay capturas a esos anchos, y no las pido. | Sin acción (registrado en D-024 y D-025) |

**Observación sin severidad:** sigue abierto mi hallazgo 2 del lote 2. A 32 px, la nota de la boca y el saliente del rompecabezas se ven pequeños. Si un niño los reconoce se confirma con TC-057 en P-7.

## Cómo revisar
- Abrir `estado-2b-teclado-390x427-claro.png` y `…-oscuro.png`. Es lo que se vería con el teclado abierto: las 4 fichas deben estar completas, con nombre, y debajo debe quedar una franja vacía.
- Comparar `estado-2-escribiendo-390x844-claro.png` del lote 2 con el del lote 3. Se nota la pantalla más apretada arriba y entre el campo y las fichas, pero con la letra del mismo tamaño.

## Preguntas para el usuario
- Ninguna.

## Decisiones o lecciones propuestas
- Ninguna nueva.

STATUS: DONE
