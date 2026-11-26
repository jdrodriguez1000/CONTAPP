---
name: edge-cases
description: Shared catalog of the project's edge cases — boundary-value and equivalence-class technique, edges whose expected result is still undefined, values and quantities, dates and time zone, domain rules by hard constraint (C-XXX), catalog data and app usage. Read by the architect (to design TC-XXX), the tester (to write them) and both breakers (as attack ideas).
---

# Catálogo de casos de borde

> Lo usan el **architect** (al diseñar los `TC-XXX`), el **tester** (al escribirlos) y los **breakers** (como ideas de ataque), para que todos piensen en los mismos bordes.
> Los valores (topes, porcentajes, metas) **no se copian aquí**: se leen en `_persistence/assumptions.md` (`A-XXX`) en el momento de usarlos.
> Molde de VEGU 2.0. Las secciones 1 y 7 sirven tal cual; las demás traen bordes generales y espacios `COMPLETAR:` que se llenan cuando aparecen las reglas del dominio (Fase 0 y cada slice). Se borra si el proyecto no lo necesita, y se quita de los agentes que lo citan.

## 1. Cómo usar este catálogo
1. Para cada feature, recorre las secciones 3 a 7 y elige **los bordes que le aplican**. No todos aplican siempre.
2. **Valores límite:** para cada tope o límite, prueba **justo debajo, exactamente en el límite y justo encima** (tope − 1, tope y tope + 1).
3. **Clases de equivalencia:** agrupa entradas que se comportan igual (válidos, cero, negativos, texto) y prueba **un representante por grupo**, más sus límites.
4. **Si el resultado esperado de un borde no está definido** en la feature, una restricción o una decisión, **no lo inventes**. El architect lo anota como pregunta; el tester lo reporta como "criterio no verificable"; el breaker lo anota como sospecha.

## 2. Bordes con regla aún sin definir (preguntar antes de probar)
| Borde | Por qué es un problema |
|---|---|
| Intentar escribir el carácter 101 (A-001): ¿se bloquea la escritura o se muestra un aviso, y con qué texto? | Cada agente lo resolvería distinto; se decide en el diseño de la slice que lo construya |
| Intentar escribir o pegar una letra de otro idioma (C-011): ¿se ignora en silencio o se muestra un aviso, y con qué texto? Si se pega un texto mezclado ("façade"), ¿se rechaza todo o solo la letra no permitida? | Igual que el anterior: se decide en el diseño |

> Cuando el usuario define una regla, se registra en la memoria y la fila sale de esta tabla hacia la sección que corresponda.

## 3. Valores y cantidades
- **Cero**, **uno** (el mínimo positivo) y **negativos**: ¿se aceptan, se rechazan o tienen significado propio?
- **Valores muy grandes:** totales y acumulados por encima del máximo del tipo de dato que se use (p. ej. un entero de 32 bits llega a 2.147.483.647): deben guardarse y sumarse sin desbordarse.
- **Exactitud:** si una regla pide valores exactos, ninguna operación produce decimales sueltos y **la suma de las partes es igual al total**. Un reparto con residuo necesita una regla de redondeo decidida.
- **Entrada del usuario:** con y sin separadores de miles, con símbolo, con espacios, con el separador decimal de su región y el de otra, letras, vacío y solo espacios.
- **Salida:** el formato de la región del usuario, incluidos cero y negativos; ojo con los espacios que no se parten que ponen las funciones estándar de formato.
- **Largo del texto** (A-001): 99, 100 y 101 caracteres; vacío y solo espacios (C-008, C-012).
- **Emojis y caracteres compuestos:** un emoji (incluso los de varias partes, como una familia o una bandera) cuenta como **1** otro, no como varias posiciones.
- **La suma cuadra:** vocales + consonantes + números + otros = total de caracteres sin espacios.

## 4. Fechas y tiempo (zona horaria del usuario, en `AGENTS.md`)
- **Cambio de día y de mes:** un evento a las 11:30 p. m. del último día del mes en la zona del usuario puede ser ya el día siguiente en UTC. Debe quedar en el **día y el mes del usuario**.
- **Largo del mes:** meses de 30 y 31 días, **febrero de 28 y de 29** (años bisiestos).
- **Cambio de año** (diciembre → enero) y lo que cruza el año.
- **Horario de verano**, si la zona del usuario lo tiene.
- **Festivos y días hábiles**, si una regla depende de ellos.
- Primer y último día del periodo, y el **periodo en curso frente a uno cerrado** (¿se puede editar uno cerrado?).
- No aplica: la app no usa fechas ni horas.

## 5. Reglas del dominio (una prueba por restricción dura)
| Restricción | Bordes a probar |
|---|---|
| C-001 Vocales | a e i o u, con tilde y ü, en mayúscula y minúscula ("ÁRBOL", "pingüino") |
| C-002 La ñ | "Ñandú", "niño" |
| C-003 La y | "y" sola, "rey", "Yo": siempre consonante |
| C-004 Dígrafos | "chorro", "llave": cada letra por separado |
| C-005 Mayúsculas | la misma palabra en mayúsculas y en minúsculas da el mismo conteo |
| C-006 Dígitos | "0", "2026", números pegados a letras ("a1b2") |
| C-007 Otros | ¿ ? ¡ ! , . @ # y emojis |
| C-008 Espacios | espacios al inicio, al final y dobles; tabulación; salto de línea |
| C-011 Letras de otros idiomas | à â ö ç ß y letras de otros alfabetos (α, ж): no entran al texto ni cambian el conteo; también al pegarlas |
| C-012 Texto vacío | vacío y solo espacios: los 4 grupos en 0 |

## 6. Catálogo y datos
- **Nombres repetidos en grupos distintos:** la app debe distinguirlos siempre, también al buscar y al mostrar.
- **Registro inactivo:** no recibe datos nuevos, pero su historial se conserva y se sigue viendo.
- **Textos:** tildes, ñ, mayúsculas y minúsculas, espacios al inicio o al final, nombres muy largos, emojis.
- **IDs estables:** renombrar no cambia el ID ni rompe el historial.
- **Cada carácter cae en exactamente un grupo** (GRP-001 a GRP-004 de `catalog.md`): ninguno queda sin grupo ni cuenta dos veces.

## 7. Uso de la app
- **Doble clic o doble envío:** se registra **una sola** vez.
- **Sesión vencida** a mitad de una tarea: no se pierde el dato en silencio.
- **Otro usuario o sin sesión:** no ve ni crea datos que no le corresponden.
- **Dos dispositivos a la vez:** dos cambios casi simultáneos sobre el mismo registro.
- **Sin conexión:** qué pasa al guardar sin internet, según lo que defina la feature.
- **Pantallas:** el dispositivo más pequeño que se soporta, teclado abierto tapando el botón, escritorio.
- **Estados:** vacío (primer uso), cargando, error y éxito.
