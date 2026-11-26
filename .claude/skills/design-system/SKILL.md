---
name: design-system
description: How the project's design system is structured and used — required sections of _project/design-system.md, semantic tokens from design to code, components, display and input of domain values, primary device first, screen states, copy, accessibility and the visual review checklist. Preloaded by the designer and the coder. Only for projects with screens.
---

# Cómo se usa el sistema de diseño

> Este skill es el **cómo**. Los **valores** (colores, tipografía, espacios, componentes aprobados) viven **solo** en `_project/design-system.md`, que el designer construye con el usuario en la primera slice con pantallas. Nunca copies valores aquí ni los inventes.
> Si `_project/design-system.md` no existe o no cubre lo que necesitas: el **designer** lo propone al usuario; el **coder** se detiene con `STATUS: BLOCKED`.
> Molde de VEGU 2.0. Lo que depende de la librería de estilos y componentes está marcado `COMPLETAR AL DECIDIR:`.

## 1. Estructura obligatoria de `_project/design-system.md`
1. **Principios** — los del producto (p. ej. tarea frecuente en pocos toques, dispositivo principal primero, dato importante siempre legible, nada ambiguo).
2. **Tokens de color** — tabla `token | uso | claro | oscuro | contraste verificado`.
3. **Tipografía** — familia, escala de tamaños y pesos, con su uso (título, dato destacado, cuerpo, ayuda).
4. **Espacios y formas** — escala de espacios, bordes redondeados, sombras.
5. **Componentes** — tabla `componente | base en la librería | variantes | cuándo se usa`.
6. **Valores del dominio** — cómo se muestran y se ingresan los valores importantes (cantidades, fechas, moneda si aplica), incluidos cero, negativos y estados de alerta.
7. **Navegación** — estructura en el dispositivo principal y en los demás.
8. **Textos** — tono (tú o usted), verbos de los botones y forma de los mensajes de error.
9. **Accesibilidad** — mínimos del proyecto (sección 7 de este skill).
10. **Historial** — fecha y motivo de cada cambio aprobado.

## 2. Tokens: del diseño al código
- Los colores se nombran por su **uso**, no por cómo se ven: `primary`, `destructive`, `muted`, y los de los estados del dominio (p. ej. `status-ok`, `status-warning`, `status-over`).
- **En el código**, cada token se define **una sola vez** (modo claro y oscuro) y los componentes lo usan por su nombre. En este proyecto no hay librería de estilos (D-011): los tokens son variables CSS en `src/styles.css`, en `:root` y en `@media (prefers-color-scheme: dark)`. Ejemplo: `.count dd { color: var(--color-primary); }`.
- **Prohibido en los componentes:** colores escritos a mano (`#e11d48`), tamaños o espacios arbitrarios y colores de la paleta base donde existe un token. Si falta un token, se pide; no se improvisa.
- **En las maquetas** (`_project/design/F-XXX/mockup.html`), el designer usa los **mismos nombres de token** que tendrá el código, para que el paso de la maqueta a la app sea directo.

## 3. Componentes
- **Primero la librería de componentes del stack**, ajustada con tokens y variantes. En este proyecto no hay librería de componentes (D-011): cada componente es HTML con una clase CSS propia en `src/styles.css`, que usa solo tokens. Un componente propio solo si está aprobado en la tabla de componentes de `design-system.md`.
- Un componente = **un solo lugar** en el código; las pantallas lo reutilizan, no lo copian.
- Nombres de componentes en el idioma del código y del glosario de project-context.

## 4. Valores del dominio en pantalla
- **Mostrar:** **una única función de formato** por tipo de valor (cantidad, moneda, fecha), usada en toda la app, basada en el formato estándar del idioma y la región del usuario (`AGENTS.md`).
  - Las funciones estándar de formato pueden poner **espacios que no se parten** (U+00A0 o U+202F) entre el símbolo y el número. En pruebas, compara con el texto que devuelve la función o normaliza los espacios; nunca con un espacio normal escrito a mano.
  - El formato se aplica **solo al mostrar**. Cálculos, base de datos y estado guardan el valor sin formato.
- **Ingresar:** el campo abre el teclado adecuado en el celular (numérico para cantidades) y acepta lo que escribiría el usuario en su región (con o sin separadores, con o sin símbolo), convirtiéndolo al valor sin formato. Los bordes de entrada están en el catálogo de casos de borde del dominio, si existe.

## 5. Dispositivo principal primero
- Se diseña y se construye primero para el **dispositivo principal** de project-context (si es un celular: 390 px de ancho, funcionando desde 320 px); luego se amplía para los demás.
- La acción principal queda a la mano (en el celular, al alcance del pulgar) y **no** la tapa el teclado abierto.
- Sin desplazamiento horizontal. Los valores largos caben sin cortarse.

## 6. Estados de cada pantalla
Toda pantalla define y construye sus estados: **vacío** (primer uso, con una acción para empezar), **cargando**, **error** (qué pasó y qué hacer) y **éxito** (confirmación breve), más los propios de la feature. Un estado sin diseño es una pregunta para el designer, no algo que el coder improvisa.

## 7. Accesibilidad (mínimos)
- Contraste **WCAG AA**: 4,5:1 en texto normal; 3:1 en texto grande y en bordes e iconos de controles.
- Zonas táctiles de al menos **44 × 44 px**.
- Toda entrada con **etiqueta visible**; los botones que son solo un icono llevan una etiqueta accesible.
- **Nunca solo color:** los estados importantes se distinguen también con texto o icono.
- Foco visible al navegar con teclado.

## 8. Textos de pantalla
- En el idioma del usuario (`AGENTS.md`), claros y sin jerga técnica, con el tono fijado en `design-system.md`.
- **Exactos:** el coder copia el texto aprobado en la sección 5 de la feature, letra por letra, incluidas tildes y signos.
- Mismo verbo para la misma acción en toda la app (por ejemplo, siempre "Guardar", nunca a veces "Aceptar").

## 9. Revisión visual (designer, trabajo C) y autorrevisión (coder)
| # | Qué se compara contra el diseño aprobado | Si no coincide |
|---|---|---|
| 1 | Estructura y orden de los elementos | Bloqueante |
| 2 | Textos exactos | Bloqueante |
| 3 | Todos los estados construidos | Bloqueante |
| 4 | Formato de los valores del dominio y sus estados de alerta | Bloqueante |
| 5 | Tokens: ningún color, tamaño o espacio fuera del sistema | Bloqueante |
| 6 | Accesibilidad: contraste, 44 px, etiquetas, nunca solo color | Bloqueante |
| 7 | Todos los anchos del dispositivo principal y los demás, sin desbordes | Bloqueante |
| 8 | Detalles finos que no cambian el uso (un espacio, una sombra) | Mejora futura |
