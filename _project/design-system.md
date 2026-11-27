# Sistema de diseño — Contapp
**Estilo:** C2 "Pizarra con fichas" (D-010) · **Última actualización:** 2026-11-27 (ampliación de VS-002 con lo elegido por el usuario; la aprobación del diseño se registra en F-002 y F-003 §5)
**Maqueta de origen:** `_project/design/propuestas/propuesta-c2.html` · **Primera pantalla:** `_project/design/F-001/mockup.html`

> Reglas del archivo: aquí viven los **valores** (colores, letra, espacios, componentes). El **cómo** se usan está en `.claude/skills/design-system/SKILL.md`. Lo escribe el designer y lo aprueba el usuario. Se amplía solo cuando una slice lo necesita, y cada cambio queda en el Historial (sección 10).
> Stack decidido en D-011: sin librería de componentes; cada componente es HTML más una clase CSS en `src/styles.css`, y los tokens se definen una sola vez en `:root` de ese archivo (el modo oscuro, con `@media (prefers-color-scheme: dark)`).

## 1. Principios
1. **Ver el resultado al instante, sin tocar nada más:** se escribe y los 4 conteos cambian solos. No hay botón de "contar".
2. **El número es lo más importante de la pantalla:** grande, grueso, siempre en el mismo lugar de su ficha.
3. **Amable y de salón de clase:** pizarra verde, tiza y fichas redondeadas, para que un niño menor de 8 años la sienta suya. Sin adornos que distraigan.
4. **Poco texto y nada ambiguo:** cada grupo lleva su nombre escrito. Nunca se distingue un grupo solo por el color ni por la posición.
5. **El celular primero:** se diseña para iPhone con Safari (D-009), 390 px de ancho, y debe funcionar desde 320 px.
6. **Lo que se ve es exactamente lo que se escribió:** el teclado no corrige, no sugiere ni cambia letras a mayúscula (D-009, D-010).
7. **Los conteos no son botones:** las fichas no tienen sombra ni relieve, porque no se tocan.

## 2. Tokens de color
La app sigue el modo **claro u oscuro del celular**, sin botón para cambiarlo (D-010). Los valores cambian con el modo, pero los nombres son siempre los mismos.

| Token | Uso | Claro | Oscuro | Contraste verificado (claro / oscuro) |
|---|---|---|---|---|
| `--color-bg` | Fondo de la pantalla | `#FFFFFF` | `#142017` | — (es el fondo de referencia) |
| `--color-surface` | Fondo de las fichas de conteo | `#EEF5EE` | `#1C2E20` | — (fondo; se distingue por su color y por `--color-border`) |
| `--color-text` | Texto principal: nombres de los grupos y texto escrito | `#112211` | `#F5F5EE` | sobre bg 16,7:1 / 15,4:1 · sobre surface 15,0:1 / 13,1:1 · sobre input-bg 16,7:1 / 13,1:1 ✓ |
| `--color-text-muted` | Etiqueta del campo | `#445544` | `#AABBAA` | sobre bg 8,0:1 / 8,3:1 ✓ |
| `--color-primary` | Título de la app (desde VS-002, el número de cada ficha va en el color de su grupo) | `#1F6B33` | `#FFDD55` | sobre bg 6,5:1 / 12,6:1 · sobre surface 5,9:1 / 10,8:1 ✓ |
| `--color-on-primary` | Texto sobre un fondo de acento (reservado; no se usa en VS-001) | `#FFFFFF` | `#142017` | sobre primary 6,5:1 / 12,6:1 ✓ |
| `--color-border` | Reservado: en VS-001 era el borde punteado de las fichas; desde VS-002 ese borde va en el color de su grupo | `#BBCCBB` | `#3B5540` | Decorativo: no es un control y no tiene mínimo |
| `--color-input-bg` | Fondo del campo para escribir | `#FFFFFF` | `#1C2E20` | — |
| `--color-input-border` | Borde del campo en reposo | `#556655` | `#88AA88` | sobre bg 6,1:1 / 6,5:1 · sobre input-bg 6,1:1 / 5,6:1 ✓ (mín. 3:1) |
| `--color-focus` | Borde y anillo del campo activo | `#1F6B33` | `#FFDD55` | sobre bg 6,5:1 / 12,6:1 ✓ (mín. 3:1) |
| `--color-vowel` (VS-002) | Grupo Vocales: imagen, número y borde de su ficha; en VS-003, letra en el campo | `#C62828` | `#FF7B72` | sobre input-bg 5,6:1 / 5,7:1 · sobre surface 5,1:1 / 5,7:1 ✓ |
| `--color-consonant` (VS-002) | Grupo Consonantes (igual) | `#1565C0` | `#82B1FF` | sobre input-bg 5,8:1 / 6,6:1 · sobre surface 5,2:1 / 6,6:1 ✓ |
| `--color-digit` (VS-002) | Grupo Números (igual) | `#A84B00` | `#FFB74D` | sobre input-bg 5,7:1 / 8,3:1 · sobre surface 5,2:1 / 8,3:1 ✓ |
| `--color-other` (VS-002) | Grupo Otros (igual) | `#7B1FA2` | `#CE93D8` | sobre input-bg 8,2:1 / 6,0:1 · sobre surface 7,4:1 / 6,0:1 ✓ |

- El contraste se calculó con la fórmula de WCAG 2.x. Conviene volver a medirlo con una herramienta al construir.
- **Colores por grupo (VS-002):** juego 1 "Salón clásico", elegido por el usuario el 2026-11-27. Las vocales van en rojo y las consonantes en azul, como en el cuaderno. El juego 2 "Crayolas" quedó descartado. Regla: cada color de grupo debe pasar **4,5:1 como letra sobre `--color-input-bg`** y sobre `--color-surface`, en los dos modos, porque en VS-003 se pinta con él cada letra del texto. En el modo oscuro, el campo y la ficha tienen el mismo fondo (`#1C2E20`).
- **Variable local de la ficha (VS-002):** cada `CountCard` define `--group-color` (que apunta a uno de los 4 tokens) y `--group-image`. No son tokens nuevos: solo eligen cuál de los 4 usa la ficha.
- Prohibido escribir colores a mano en los componentes: si falta un color, se pide un token nuevo.

## 3. Tipografía
**Familia** `--font-family-base`: la letra del sistema del iPhone, SF Pro, en pesos gruesos. Pila de respaldo: `-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, "Segoe UI", Roboto, sans-serif`. No se descargan fuentes. (Letra escolar Andika, con la "a" de un solo trazo: el usuario decidió que no entra en VS-002 [2026-11-27]; se puede volver a proponer en VS-003.)

| Uso | Token de tamaño | Tamaño | Peso (token) | Alto de línea |
|---|---|---|---|---|
| Título de la app | `--font-size-title` | 28 px | 800 (`--font-weight-title`) | 1,2 |
| Etiqueta del campo | `--font-size-label` | 18 px | 600 (`--font-weight-label`) | 1,3 |
| Texto escrito en el campo | `--font-size-input` | 24 px | 600 (`--font-weight-input`) | 1,3 |
| Nombre del grupo | `--font-size-group` | 20 px | 700 (`--font-weight-group`) | 1,3 |
| Número del conteo (dato destacado) | `--font-size-count` | 48 px | 800 (`--font-weight-count`) | 1,1 |

- Los números usan **cifras del mismo ancho** (`font-variant-numeric: tabular-nums`), para que la ficha no "salte" al pasar de 9 a 10.
- El texto del campo nunca baja de 16 px: en el iPhone, un campo con letra menor a 16 px hace que Safari acerque la pantalla al tocarlo.
- **Pantallas angostas (menos de 360 px de ancho):** `--font-size-group` baja a 18 px y `--font-size-count` a 44 px, para que "Consonantes" quepa en su ficha a 320 px.

## 4. Espacios y formas
| Token | Valor | Uso |
|---|---|---|
| `--space-1` | 4 px | Con menos de 360 px de ancho: separación imagen–número y relleno lateral de la ficha (VS-002). La separación número–nombre es una medida fija de 2 px, ver abajo |
| `--space-2` | 8 px | Margen superior de la pantalla; título → etiqueta; etiqueta → campo; relleno de arriba y abajo del campo; relleno de la ficha; separación imagen–número (VS-002) |
| `--space-3` | 12 px | Relleno lateral del campo; campo → fichas; espacio entre fichas (VS-002) |
| `--space-4` | 16 px | Márgenes laterales de la pantalla |
| `--space-5` | 20 px | Reservado (en VS-001 era campo → fichas) |
| `--space-6` | 24 px | Reservado |
| `--size-group-image` | 44 px (con menos de 360 px de ancho: 32 px) | Ancho y alto de la imagen de cada grupo (`GroupImage`, VS-002) |
| `--radius-card` | 20 px | Esquinas de las fichas |
| `--radius-input` | 14 px | Esquinas del campo |
| `--radius-badge` | 12 px | Reservado (insignias; no se usan en VS-001) |
| `--border-width-input` | 2 px | Borde del campo y borde punteado de las fichas |

- **Por qué cambiaron los usos en VS-002:** para que los 4 grupos quepan con el teclado abierto en el iPhone (F-003 §5.3). Se ahorran ≈ 38 px sin bajar ninguna letra.
- **Sombras:** ninguna.
- **Anillo de foco:** contorno de 3 px en `--color-focus`, separado 2 px del campo.
- **Ancho máximo del contenido:** 480 px, centrado. En celular ocupa todo el ancho; el diseño para computador y celular girado queda para VS-002.

**Medidas fijas aprobadas** (sin token, porque hoy se usan en un solo lugar; se escriben tal cual en el CSS):

| Medida | Valor | Dónde se usa |
|---|---|---|
| Alto mínimo de la ficha | 104 px | `CountCard` |
| Anillo de foco | 3 px de grueso, separado 2 px del campo | `TextField` activo |
| Separación número–nombre | 2 px | Dentro de `CountCard` |
| Ancho máximo del contenido | 480 px | Columna de la pantalla |
| Altos de línea | 1,1 (número del conteo) · 1,2 (título) · 1,3 (etiqueta, campo y nombre del grupo) | Ver la tabla de la sección 3 |

- **Regla:** solo estas medidas pueden ir sin token. Una medida fija **se vuelve token cuando se usa en un segundo lugar** (p. ej. en VS-002), y entonces se agrega a la tabla de arriba y sale de esta lista. Cualquier otra medida nueva se pide como token.

## 5. Componentes
| Componente (código) | Base en el código (D-011: HTML + clase en `src/styles.css`) | Variantes | Cuándo se usa |
|---|---|---|---|
| `AppTitle` | `<h1 class="app-title">` en `index.html` · clase `.app-title` | — | Título "Contapp" arriba de la pantalla; es el encabezado principal (h1) |
| `TextField` | `<label class="field-label" for="text-field">` + `<textarea class="field" rows="2">` con `autocomplete`, `autocorrect`, `autocapitalize` en `off` y `spellcheck="false"` · clases `.field-label`, `.field`, `.field:focus-visible` · el crecimiento de 2 a 5 líneas está en `src/main.ts` (`fitHeightToText`) | reposo · activo (`:focus-visible`) | Escribir o pegar el `text`. Etiqueta visible arriba. Empieza en **2 líneas** y crece con el texto **hasta 5**; si hay más líneas (saltos de línea), se desplaza por dentro. Corrector, sugerencias, autocompletar y mayúscula automática **apagados** |
| `CountGrid` | `<dl class="counts">` · clase `.counts` | — | Agrupa las 4 fichas en **2 columnas × 2 filas**, en el orden fijo Vocales, Consonantes / Números, Otros. Es una lista de pares nombre–valor |
| `CountCard` | `<div class="count"><dt>Nombre</dt><dd>número</dd></div>` · clases `.count`, `.count dt`, `.count dd` | una por `characterGroup` (fila siguiente) | Una ficha por grupo: número arriba (48 px) y nombre debajo (en `--color-text`, 20 px), centrados; fondo `--color-surface`, borde punteado de 2 px, esquinas de 20 px, alto mínimo 104 px. No se toca. Desde VS-002, el número y el borde van en el color de su grupo (antes `--color-primary` y `--color-border`) |
| `CountCard` — variante por grupo (VS-002) | Clase extra en cada ficha: `count--vowel`, `count--consonant`, `count--digit`, `count--other`. Cada una define `--group-color` y `--group-image` | vowel · consonant · digit · other | Imagen, número y borde punteado en `--group-color`; nombre en `--color-text`; relleno `--space-2` (con menos de 360 px: `--space-2 --space-1`); el número sigue arriba y el nombre abajo (D-010) |
| `GroupImage` (VS-002) | `.count dd::before`: cuadro de `--size-group-image` con `background-color: currentColor` y la imagen SVG del grupo como máscara (`mask` y `-webkit-mask`, `center / contain no-repeat`), escrita en `src/styles.css` como `url("data:image/svg+xml,…")`. El `dd` pasa a `display: flex`, centrado, con separación `--space-2` (con menos de 360 px, `--space-1`) | una por grupo: boca que canta (`vowel`), ficha de rompecabezas (`consonant`), mano que cuenta (`digit`), carita feliz (`other`). Dibujo exacto en `_project/design/F-002/mockup-b.html` (`--img-*`); ver F-002 §5.1 | Imagen del grupo a la izquierda del número, en su misma fila. No agrega texto, no se toca y no pide nada a internet |

- Un componente vive en un solo lugar del código y las pantallas lo reutilizan.
- Componentes que llegan después, sin diseño todavía: botón "borrar todo" (VS-005) y aviso para el niño (VS-004).
- **Regla para botones (VS-002; el primero llega en VS-005):**
  - Zona táctil de **al menos 56 × 56 px**, más que el mínimo de 44 px, porque lo usan dedos de niño y un adulto apurado.
  - Texto de 20 px y peso 700 (`--font-size-group`, `--font-weight-group`).
  - Ícono más texto, nunca solo ícono.
  - Fondo `--color-primary` y letra `--color-on-primary` (6,5:1 / 12,6:1).
  - Esquinas `--radius-input`.
  - Al menos `--space-3` (12 px) de separación de cualquier otro control.
  - Que el teclado abierto no lo tape.
  - Con su fondo de color se distingue de las fichas, que no se tocan y no tienen fondo de acento.
  - El tamaño se vuelve token (`--size-touch-button`) cuando se construya el botón. El verbo se fija en §8.

## 6. Valores del dominio
- **Conteo (`count`):** entero de 0 a 100. Se muestra con cifras simples, sin separadores, sin ceros a la izquierda ni unidad ("0", "4", "35", "100"). El **0 se muestra siempre como "0"**, nunca como un espacio vacío ni un guion.
- **Sin estados de alerta:** no hay colores ni avisos por llegar a 100 (D-007) ni por una letra de otro idioma (D-005, hasta VS-004). Un rechazo no se ve: el texto y los conteos quedan igual.
- **Texto (`text`):** se escribe o pega en `TextField`, hasta 100 caracteres (A-001). El teclado es el de texto normal. La tecla de salto de línea agrega un salto de línea, que ocupa lugar y no se cuenta.
- La app no muestra dinero, fechas ni horas.

## 7. Navegación
- **Una sola pantalla**, sin menús, pestañas ni barra de navegación. Al abrir la dirección, se ve directo la pantalla de conteo, sin cuenta ni contraseña (C-010).
- Orden de arriba abajo: título → etiqueta → campo → cuadrícula de fichas.
- Otros dispositivos (computador, celular girado): misma columna centrada de hasta 480 px. El ajuste fino es de VS-002.

## 8. Textos
- **Tono:** tú, cercano y corto (español de Colombia, C-013). Ejemplo: "Escribe una palabra o frase".
- **Nombres fijos:** "Vocales", "Consonantes", "Números", "Otros". Van siempre en plural, con mayúscula inicial y la tilde de "Números", aunque el conteo sea 1.
- **Botones:** todavía no hay ninguno. Cuando llegue el de VS-005, su verbo se fija aquí y se usa igual en toda la app.
- **Mensajes de error:** no hay en VS-001. Los mensajes para el niño (VS-004) serán cortos, amables y en positivo, diciendo qué hacer ("vuelve a escribir…"), nunca culpando.
- Nombre de la app en pantalla y en la pestaña del navegador: **"Contapp"** (D-010).

## 9. Accesibilidad
- **Contraste AA** en los dos modos (tabla de la sección 2): 4,5:1 para el texto normal; 3:1 para el texto grande y para el borde y el foco del campo.
- **Zonas táctiles:** el campo mide al menos 44 px de alto (con 2 líneas, ≈ 90 px). No hay más controles.
- **Etiqueta visible** del campo, unida a él (al tocar la etiqueta se activa el campo).
- **Nunca solo color:** cada ficha lleva su nombre escrito. Desde VS-002 lleva además su imagen, que se distingue por la forma y no solo por el color.
- **Imagen del grupo (VS-002):** es decorativa y no tiene texto alternativo, porque el nombre ya está escrito. La ficha se sigue leyendo "Vocales, 4".
- **Botones (VS-002):** zona táctil de al menos 56 × 56 px (regla de §5).
- **Foco visible:** anillo de 3 px en `--color-focus` cuando el campo está activo.
- **Lectores de pantalla:** cada ficha se lee como el par "Vocales, 4" (nombre y valor). En VS-001 los conteos no se anuncian solos con cada letra, porque leerlos en cada tecla sería ruidoso. Se revisará si alguien lo pide.
- **Acercar la pantalla:** no se bloquea el zoom del navegador.
- **Idioma de la página:** español de Colombia (`es-CO`).

## 10. Historial
| Fecha | Cambio | Motivo |
|---|---|---|
| 2026-11-26 | Creación a partir de la propuesta C2 "Pizarra con fichas": tokens claro/oscuro, letra, espacios, 4 componentes, textos y accesibilidad | Elección del usuario (D-010), entre las propuestas A, B, C y C2 |
| 2026-11-26 | Nota del stack (D-011); columna "Base en el código" de los 4 componentes (§5); lista de medidas fijas aprobadas con su regla (§4); se corrige el "2 px" de la fila de `--space-1`. Maqueta F-001: relleno del campo de `14px` a `var(--space-3)` | D-011 y revisión visual del lote 2 de VS-001 (hallazgos 1 y 2, opción A aprobada por el usuario) |
| 2026-11-27 | **[VS-002, pendiente de aprobación]** 4 tokens de color por grupo (juego 1) con su contraste (§2); token `--size-group-image` y nuevos usos de los espacios para que los 4 grupos quepan con el teclado abierto (§4); variante por grupo de `CountCard`, componente `GroupImage` y regla de botones para VS-005 (§5); accesibilidad de la imagen y de los botones (§9). Letra escolar como opción, no fijada (§3) | Diseño de F-002 y F-003 (VS-002). Lo aprueba el usuario junto con la imagen y el juego de colores que elija |
| 2026-11-27 | Se deja solo lo elegido y se quitan las marcas "[VS-002, pendiente]": imágenes de la opción B (§5 `GroupImage`), colores del juego 1 (§2; el juego 2 queda descartado), imagen al lado del número, letra del iPhone (§3; Andika no entra en VS-002). Usos de los espacios pasan a la tabla de §4. `--color-primary` queda solo para el título y `--color-border` queda reservado, porque el número y el borde de la ficha van en el color de su grupo. Se une la tabla de §5, que estaba partida por una línea en blanco | Elección del usuario (2026-11-27). Falta la aprobación final del diseño en F-002 y F-003 §5 |
