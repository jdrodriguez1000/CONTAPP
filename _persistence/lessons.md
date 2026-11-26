# Lecciones aprendidas
**Última actualización:** 2026-11-25
**Último ID usado:** L-002

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
- L-001 — Una regla dicha en negativo ("nada de X") se confirma: ¿X no se permite o solo no cuenta en su grupo?

### Producto y estructura

### Herramienta
- L-002 — Ediciones masivas con tildes, emojis y comillas: escribir un script en el scratchpad, no un heredoc en Bash

### Datos y supuestos

### Proceso y memoria

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
