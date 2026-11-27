# VS-002 — Definición

# Reporte del architect — VS-002
**Fecha:** 2026-11-27

## Resumen
Definí VS-002 "Imágenes y diseño para niños" con sus dos features: **F-002** (una imagen y un color por grupo, con los requisitos que deben cumplir las imágenes y los colores, porque el usuario no los fijó) y **F-003** (letra no menor que la de VS-001, solo los textos aprobados y los 4 grupos completos a la vista con el teclado abierto en el iPhone con Safari, D-015). Entran DT-008 y DT-009; quedan fuera DT-004, el total de caracteres y los otros tamaños de pantalla, como decidió el usuario el 2026-11-27. El esbozo tiene 8 pasos (7 si el diseño no cambia ningún texto).

## Archivos creados o modificados
- `_project/slices/VS-002.md` — objetivo, features, deuda que entra, dependencias, fuera de alcance, riesgos, bordes que esperan, pruebas existentes que pueden cambiar (sacadas con Grep), esbozo de 8 pasos y nivel de riesgo esperado.
- `_project/features/F-002.md` — imagen y color por grupo: 7 requisitos de la imagen, 4 de los colores, CA-12 a CA-17, TC-050 a TC-058. Sección 5 pendiente para el designer.
- `_project/features/F-003.md` — pantalla didáctica: CA-18 a CA-21, TC-059 a TC-064. Sección 5 pendiente para el designer.
- `_project/slices/VS-002/reports/architect.md` — este reporte.

IDs nuevos: CA-12 a CA-21 y TC-050 a TC-064 (los últimos usados eran CA-11 y TC-049, en F-001; verificado con Grep).

## Esbozo de pasos (resumen)
8 pasos: (1) deuda DT-008 y DT-009 · (2) un color por grupo · (3) una imagen por grupo · (4) letra grande · (5) textos de la pantalla (se quita si el diseño no cambia ningún texto) · (6) los 4 grupos a la vista con el teclado abierto · (7) prueba de punta a punta en la versión publicada · (8) comprobación en el iPhone del usuario.
- **Primer paso con valor funcional:** el 2 (los colores ya se ven en el iPhone); el que cumple el objetivo, el 3; el que resuelve D-015, el 6.
- **Recortado para caber en 10:** nada de la fila del roadmap. Respondiendo *"¿qué de esto puede esperar a la siguiente slice?"*: lo que podía esperar ya salió por decisión del usuario (otros tamaños, frase que no cabe a lo ancho, total, DT-004). Lo único que todavía podría esperar es el paso 5 (textos), si el diseño no los cambia; y si la pregunta 1 se responde con el rango corto, el paso 6 se achica.
- **Nivel esperado:** Normal (la disposición con el teclado puede necesitar lógica de pantalla); el lote que lleve DT-009 toca `src/main.ts` y por archivo cuenta como Alto, salvo que el usuario apruebe bajarlo (solo cambia un comentario).

## Trazabilidad de restricciones duras
| Restricción | Feature | Casos de prueba |
|---|---|---|
| C-001 Vocales | F-002 | TC-053, TC-058 (regresión TC-004, TC-005) |
| C-002 La ñ | F-002 | TC-058 (regresión TC-006) |
| C-003 La y | F-002 | TC-058 (regresión TC-007) |
| C-004 Dígrafos | F-002 | TC-058 (regresión TC-008) |
| C-005 Mayúsculas | F-002 | TC-058 (regresión TC-009) |
| C-006 Dígitos | F-002 | TC-053, TC-058 |
| C-007 Otros | F-002 | TC-053, TC-058 |
| C-008 Espacios | F-002 | TC-053, TC-058 |
| C-009 Sin IA | F-002, F-003 | TC-060, TC-058 (regresión TC-027, TC-031) |
| C-010 Sin base de datos ni login | F-002, F-003 | TC-055, TC-058 (regresión TC-001, TC-024, TC-025) |
| C-011 Solo letras del español | F-002 | TC-054, TC-058 |
| C-012 Vacío en 0 | F-002, F-003 | TC-050, TC-053, TC-061 |
| C-013 Código en inglés, pantalla en español | F-002, F-003 | TC-050, TC-056, TC-060 (el código en inglés lo revisa el reviewer) |
| C-014 Letras en dos piezas | F-002 | TC-058 (regresión TC-032, TC-033, TC-039 a TC-042) |
| C-015 Caracteres raros | F-002 | TC-058 (regresión TC-034 a TC-038, TC-045, TC-048, TC-049) |
| C-016 Pegar texto mezclado | F-002 | TC-058 (regresión TC-029, TC-047) |

VS-002 no cambia ninguna regla de conteo ni el filtro: las restricciones de conteo se cubren con un caso nuevo que mira el conteo en la pantalla nueva (TC-053, TC-054) y con la regresión completa de VS-001 (TC-058).

## Preguntas para el usuario
1. **Teclado abierto: ¿con qué textos se exige ver los 4 grupos completos?** Tal como lo pidió el usuario, lo escribí sin límite: desde el campo vacío hasta 100 caracteres, también con el campo en su tope de 5 líneas (CA-20). **Recomendación:** dejarlo así; es lo que hace útil la app mientras se escribe. **Contra:** en la foto de VS-001 quedan cerca de 470 px visibles y hoy no caben ni las fichas sin imagen; con el campo en 4 o 5 líneas puede obligar a fichas más bajas con el teclado abierto, a esconder el título o a cambiar la cuadrícula 2 × 2 con el número arriba, que es una decisión vigente (D-010) y necesitaría una decisión nueva. Alternativa: exigirlo solo con el campo en 1 o 2 líneas (palabras y frases cortas, lo más común con los niños) y dejar el resto en "Bordes que esperan".
2. **¿Los nombres escritos ("Vocales", "Consonantes"…) se quedan en las fichas junto a la imagen?** Lo escribí así (CA-16), porque el sistema de diseño dice que el color nunca es la única pista (§1, principio 4) y el adulto o un lector de pantalla los necesitan. **Recomendación:** sí, se quedan. **Contra:** es más texto en pantalla y ocupa espacio con el teclado abierto.
3. **"Botones grandes" sin botones:** en VS-002 la pantalla no tiene botones (el primero, "borrar todo", llega en VS-005). **Recomendación:** no crear ningún botón en VS-002; que el designer deje en `design-system.md` la regla de tamaño de los botones para que VS-005 la use. **Contra:** esa parte de F-003 no se puede comprobar hasta VS-005.
4. **¿Los 4 colores se eligen ya pensando en VS-003?** En VS-003 cada letra del texto se pinta del color de su grupo, sobre el fondo del campo. **Recomendación:** exigir desde ahora que los 4 colores también sirvan como color de letra sobre `--color-input-bg` (contraste 4,5:1 en claro y oscuro), para no tener que cambiarlos después. **Contra:** limita más las opciones, sobre todo en el modo oscuro.
5. **¿La imagen de un grupo puede ser la figura de una letra o de un número** (p. ej. una "a" dibujada como juguete para las vocales)? Los requisitos dicen "sin palabras escritas". **Recomendación:** permitir figuras de un solo carácter y que el usuario decida al ver las opciones del designer. **Contra:** una sola letra no le dice al niño cuál es el grupo (una "b" no enseña "consonante"); un dibujo concreto puede ser más claro.
6. **DT-017** (dos clones en las pruebas) dice en `tech-debt.md` "Junto con DT-008". El usuario autorizó solo DT-008 y DT-009. **Recomendación:** no incluirla (alcance mínimo). **Contra:** se vuelve a tocar `published.spec.ts` en otra ocasión.

## Supuestos, decisiones o lecciones propuestas
- **Supuesto o regla propuesta:** "letra grande" significa que ningún tamaño de letra baja de los de VS-001 (número 48 px, nombre 20 px, campo 24 px; 44/18 px con menos de 360 px). Lo puse en F-003 (CA-18) como mi lectura de la feature; si el usuario acepta que se achique la letra con el teclado abierto (pregunta 1), hay que ajustarlo. — Evita que la solución del teclado lleve a una letra más pequeña que hoy sin que nadie lo decida.
- **Configuración de referencia del teclado:** Safari con la barra de la dirección abajo y teclado de letras en español, como en la foto del lote 3 (F-003 §2). — Sin ella, CA-20 no es verificable.
- **Glosario:** proponer `groupImage` para "Imagen del grupo" (la imagen de cada `characterGroup`) y `groupColor` para "Color del grupo" (los tokens `--color-<grupo>`). — Son términos nuevos que no están en `project-context` §2; no los usé en código.
- **Catálogo:** al elegir las imágenes, el Manager llena la columna "Imagen" de GRP-001 a GRP-004 en `_project/catalog.md` (lo aprueba el usuario y sube la versión). — Hoy dice "Por definir en el diseño".
- **A-001:** su fecha "Revisar el" es justamente "al ver las fichas con imagen de VS-002 en el celular". La comprobación del paso 8 con la frase de 100 (TC-061) da la evidencia para revisarlo. — Lo cierra el Manager en la memoria.
- **Pedido al planner:** `tests/e2e/published.spec.ts:23` guarda la evidencia en la carpeta de VS-001; en VS-002 debe ir a `_project/slices/VS-002/evidence/` sin sobrescribir la de VS-001. — Riesgo de perder evidencia de una slice cerrada.
- **Lección propuesta → VEGU:** las pruebas que comparan el texto visible exacto de toda la pantalla (`expectNoNotice`, TC-001, TC-027) son muy buenas para atrapar avisos, pero obligan a cambiar muchos archivos con cualquier cambio de texto; conviene que vivan en una sola función compartida. — Salió al buscar las pruebas que cambian con esta slice (hoy el mismo texto está en 4 archivos).

## Sugerencias fuera de alcance
- Nueva slice "Ver bien en otros tamaños" (celular más pequeño, girado, computador, frase que no cabe a lo ancho, teclado de emojis, barra de Safari arriba) — después de VS-003; el usuario decide si la crea.
- Mostrar el total de caracteres — cuando el usuario lo pida (ya lo dejó esperar).
- DT-004 (encabezados de seguridad) — próximo mantenimiento, como decidió el usuario.

STATUS: DONE

# VS-002 — Ajustes tras las respuestas del usuario
**Fecha:** 2026-11-27

## Resumen
Apliqué las 6 respuestas del usuario a `VS-002.md`, `F-002.md` y `F-003.md`. El cambio grande es el teclado: CA-20 se exige solo con el campo en hasta 2 líneas y hasta 50 caracteres, y lo demás pasa a "Bordes que esperan". No se crearon ni se reutilizaron IDs: siguen CA-12 a CA-21 y TC-050 a TC-064.

## Qué cambié, por respuesta
1. **Teclado (2 líneas y 50 caracteres):**
   - `F-003` §2: la exigencia queda limitada a 2 líneas y 50 caracteres (contados como en A-001, con los espacios). Además, el punto que resuelve el designer: con la letra del campo de VS-001 (24 px) caben, a ojo, unos 25 caracteres por línea a 390 px y menos a 320 px, así que una frase de 50 puede ocupar 3 líneas. El designer avisa y **el usuario decide** qué manda. No lo decidí yo.
   - `F-003` §3 y `VS-002` §4: el teclado abierto con 3 a 5 líneas o con 51 a 100 caracteres queda fuera de alcance.
   - `F-003` §4 (fila A-001) y §5: el designer diseña los casos vacío, 1 línea y 2 líneas con 50 caracteres, y avisa si no caben.
   - **CA-20** reescrito: campo vacío o texto de hasta 50 caracteres que ocupa hasta 2 líneas, también si la segunda línea viene de un salto de línea.
   - **TC-061:** campo vacío, "pingüino" (1 línea), "la casa" + salto de línea + "el sol" (2 líneas) y una frase de exactamente 50 caracteres en 2 líneas, que la fija el diseño. **TC-062:** teclado "123" y modo oscuro con "pingüino" y la frase de 50. Salió C-012 de TC-062; TC-061 la sigue cubriendo.
   - **La frase de 100 en TC-061 y en el paso 8 ya no tiene sentido como criterio** con el teclado abierto, así que salió de TC-061. En el paso 8 queda **solo como observación** con el teclado cerrado, sin criterio que cumplir, porque da la evidencia para revisar A-001 ("Revisar el: al ver las fichas con imagen de VS-002"). El conteo "100" dentro de su ficha sigue probado en TC-064 (CA-21).
   - `VS-002` §6: borde nuevo "Teclado abierto con el campo en 3 a 5 líneas o con 51 a 100 caracteres" → slice propuesta: la nueva "Ver bien en otros tamaños", después de VS-003, que crea el Manager si el usuario la aprueba.
   - `VS-002` §1 (objetivo y valor) y §2: dicen "palabra o frase corta (hasta 2 líneas y 50 caracteres)".
   - `VS-002` §5: riesgo del teclado actualizado y riesgo nuevo "50 caracteres en 2 líneas".
2. **Nombres junto a la imagen:** CA-16 queda tal cual; no hubo que cambiar nada.
3. **Botones:**
   - `F-003` §2: no se crea ningún botón y el campo sigue siendo el único control.
   - `F-003` §5: el designer deja en `design-system.md` la regla de tamaño de los botones para VS-005.
   - `VS-002` §2 y §4 lo dicen igual.
4. **Colores también como letra:**
   - `F-002` §2: requisito 5 de los colores, 4,5:1 como color de letra sobre `--color-input-bg` en claro y oscuro. En VS-002 no se colorea ninguna letra; los colores solo se eligen de modo que ya cumplan.
   - **CA-13** y **TC-052** ampliados con esa medida.
   - `F-002` §5: el designer mide el contraste sobre la ficha y sobre `--color-input-bg`.
   - `VS-002` §4 y §5: fuera de alcance "colorear letras" (VS-003) y riesgo de colores en modo oscuro reforzado.
5. **Figuras de un solo carácter:**
   - `F-002` §2, requisito 1 de la imagen: se permite una letra o un número dibujado como juguete, y el usuario decide al ver las opciones.
   - `VS-002` §5: riesgo de que la figura no le diga al niño a qué grupo pertenece.
6. **DT-017:** no entra (`VS-002` §2 y §4).

## Esbozo final (sigue en 8 pasos)
| Paso | Nombre | Naturaleza | Qué deja verificable (valor) | Feature |
|---|---|---|---|---|
| 1 | Ordenar la deuda de pruebas y comentario | Mantenimiento sin cambio de comportamiento | Suite en verde con el mismo número de pruebas; la revisión "no se guardó nada" en un solo lugar; comentario de `src/main.ts` corregido | DT-008, DT-009 |
| 2 | Un color por grupo | Pantalla: estilos | Cada ficha con el color elegido de su grupo, en claro y oscuro, que también sirve como letra sobre el fondo del campo (CA-13) | F-002 |
| 3 | Una imagen por grupo | Pantalla: contenido gráfico | Cada ficha con la imagen elegida, en claro y oscuro, sin pedir nada a otro sitio; el lector de pantalla sigue leyendo "Vocales, 0" (CA-12, CA-15, CA-16) | F-002 |
| 4 | Letra grande | Pantalla: tamaños | Tamaños aprobados, ninguno menor que en VS-001; "100" y "Consonantes" caben a 390 y 320 px (CA-18, CA-21) | F-003 |
| 5 | Textos de la pantalla didáctica | Pantalla: textos | Solo los textos aprobados, sin ayuda ni avisos ni botones (CA-19). Se quita si el diseño no cambia ningún texto | F-003 |
| 6 | Los 4 grupos a la vista con el teclado abierto | Pantalla: disposición | En el iPhone, con el teclado abierto, los 4 grupos completos y la línea donde se escribe, del campo vacío a una frase de 50 caracteres en 2 líneas (CA-20; foto) | F-003 |
| 7 | Prueba de punta a punta en la versión publicada | Prueba de punta a punta | Abrir, ver imágenes y colores, escribir, recargar y quedar en 0; evidencia en la carpeta de VS-002 sin tocar la de VS-001 | F-002, F-003 |
| 8 | Comprobación en el iPhone del usuario | Prueba manual en el dispositivo | Una sola lista: nombres tapados (TC-057), teclado de letras y "123" en claro y oscuro con hasta 2 líneas y 50 caracteres (TC-061, TC-062) y, solo para saber, el teclado de emojis y la frase de 100 con el teclado cerrado (evidencia para A-001) | F-002, F-003 |

**¿Qué puede esperar a la siguiente slice?** Ya salió todo lo que el usuario dejó esperar. Lo único condicional sigue siendo el paso 5 (textos).
**Nivel de riesgo esperado:** no cambia. Es **Normal**, con la misma salvedad: el lote con DT-009 toca `src/main.ts` y por archivo cuenta como Alto, salvo que el usuario apruebe bajarlo. Limitar el teclado a 2 líneas hace menos probable que el paso 6 necesite lógica en `src/main.ts`.

## Trazabilidad de restricciones duras
Sin cambios respecto de la primera sección, salvo que C-012 ya no se cita en TC-062 (TC-061, TC-050 y TC-053 la siguen cubriendo).

## Preguntas para el usuario
- Ninguna nueva. Queda abierta una **para el momento del diseño, no ahora:** si el designer avisa que una frase de 50 caracteres no cabe en 2 líneas con la letra aprobada, el usuario decide qué manda (las 2 líneas o los 50 caracteres).

## Supuestos, decisiones o lecciones propuestas
- **Decisiones para que registre el Manager:** las 6 respuestas del usuario del 2026-11-27. En especial: el teclado abierto se exige solo con hasta 2 líneas y 50 caracteres (amplía D-015); los colores de los grupos deben servir como letra sobre `--color-input-bg` con 4,5:1; se permiten figuras de un solo carácter como imagen; no se crea ningún botón en VS-002.
- Siguen vigentes las propuestas de la primera sección: glosario `groupImage` y `groupColor`, columna "Imagen" del catálogo, revisión de A-001 y carpeta de evidencia de `published.spec.ts`.

STATUS: DONE
