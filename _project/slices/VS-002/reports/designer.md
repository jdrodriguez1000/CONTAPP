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
