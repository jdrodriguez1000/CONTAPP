# Sistema de diseño — Contapp
**Estilo:** C2 "Pizarra con fichas" (D-010) · **Última actualización:** 2026-11-26
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
| `--color-primary` | Título de la app y número de cada ficha | `#1F6B33` | `#FFDD55` | sobre bg 6,5:1 / 12,6:1 · sobre surface 5,9:1 / 10,8:1 ✓ |
| `--color-on-primary` | Texto sobre un fondo de acento (reservado; no se usa en VS-001) | `#FFFFFF` | `#142017` | sobre primary 6,5:1 / 12,6:1 ✓ |
| `--color-border` | Borde punteado "de tiza" de las fichas (decorativo) | `#BBCCBB` | `#3B5540` | Decorativo: no es un control y no tiene mínimo |
| `--color-input-bg` | Fondo del campo para escribir | `#FFFFFF` | `#1C2E20` | — |
| `--color-input-border` | Borde del campo en reposo | `#556655` | `#88AA88` | sobre bg 6,1:1 / 6,5:1 · sobre input-bg 6,1:1 / 5,6:1 ✓ (mín. 3:1) |
| `--color-focus` | Borde y anillo del campo activo | `#1F6B33` | `#FFDD55` | sobre bg 6,5:1 / 12,6:1 ✓ (mín. 3:1) |

- El contraste se calculó con la fórmula de WCAG 2.x. Conviene volver a medirlo con una herramienta al construir.
- Los tokens de color por grupo (`--color-vowel`, `--color-consonant`, `--color-digit`, `--color-other`) **se agregan en VS-002** (F-002). Deberán verse bien sobre `--color-surface` en los dos modos, y el verde pizarra del modo oscuro limita las opciones.
- Prohibido escribir colores a mano en los componentes: si falta un color, se pide un token nuevo.

## 3. Tipografía
**Familia** `--font-family-base`: la letra del sistema del iPhone, SF Pro, en pesos gruesos. Pila de respaldo: `-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, "Segoe UI", Roboto, sans-serif`. No se descargan fuentes. (Propuesta para VS-002: evaluar una letra escolar con la "a" de un solo trazo.)

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
| `--space-1` | 4 px | Mínimo (reservado; la separación número–nombre es una medida fija de 2 px, ver abajo) |
| `--space-2` | 8 px | Etiqueta → campo; relleno lateral de la ficha |
| `--space-3` | 12 px | Margen superior de la pantalla; relleno del campo y de la ficha; espacio entre fichas |
| `--space-4` | 16 px | Márgenes laterales de la pantalla; título → etiqueta |
| `--space-5` | 20 px | Campo → fichas |
| `--space-6` | 24 px | Reservado |
| `--radius-card` | 20 px | Esquinas de las fichas |
| `--radius-input` | 14 px | Esquinas del campo |
| `--radius-badge` | 12 px | Reservado (insignias; no se usan en VS-001) |
| `--border-width-input` | 2 px | Borde del campo y borde punteado de las fichas |

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
| `CountCard` | `<div class="count"><dt>Nombre</dt><dd>número</dd></div>` · clases `.count`, `.count dt`, `.count dd` | — (en VS-002: una por `characterGroup`, con imagen y color) | Una ficha por grupo: número arriba (en `--color-primary`, 48 px) y nombre debajo (en `--color-text`, 20 px), centrados; fondo `--color-surface`, borde punteado de 2 px en `--color-border`, esquinas de 20 px, alto mínimo 104 px. No se toca |

- Un componente vive en un solo lugar del código y las pantallas lo reutilizan.
- Componentes que llegan después, sin diseño todavía: imagen por grupo (VS-002), botón "borrar todo" (VS-005) y aviso para el niño (VS-004).

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
- **Nunca solo color:** cada ficha lleva su nombre escrito.
- **Foco visible:** anillo de 3 px en `--color-focus` cuando el campo está activo.
- **Lectores de pantalla:** cada ficha se lee como el par "Vocales, 4" (nombre y valor). En VS-001 los conteos no se anuncian solos con cada letra, porque leerlos en cada tecla sería ruidoso. Se revisará si alguien lo pide.
- **Acercar la pantalla:** no se bloquea el zoom del navegador.
- **Idioma de la página:** español de Colombia (`es-CO`).

## 10. Historial
| Fecha | Cambio | Motivo |
|---|---|---|
| 2026-11-26 | Creación a partir de la propuesta C2 "Pizarra con fichas": tokens claro/oscuro, letra, espacios, 4 componentes, textos y accesibilidad | Elección del usuario (D-010), entre las propuestas A, B, C y C2 |
| 2026-11-26 | Nota del stack (D-011); columna "Base en el código" de los 4 componentes (§5); lista de medidas fijas aprobadas con su regla (§4); se corrige el "2 px" de la fila de `--space-1`. Maqueta F-001: relleno del campo de `14px` a `var(--space-3)` | D-011 y revisión visual del lote 2 de VS-001 (hallazgos 1 y 2, opción A aprobada por el usuario) |
