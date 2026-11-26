---
name: review-checklist
description: How the reviewer runs each check of its table — read-only commands per function (duplication, complexity, unused code, types, tests, mutation), forbidden flags that modify files, red flags for scope, test quality, visible TDD and project rules, readability for a beginner, a decision tree to classify findings by type and origin, and how to classify surviving mutants. Preloaded by the reviewer.
---

# Checklist de revisión

> Complementa la tabla "Qué revisas" del reviewer: allí está el **qué**; aquí, el **cómo**. Todo es **solo lectura**: tú encuentras, explicas y clasificas; nunca corriges.
> Molde de VEGU 2.0. Las herramientas concretas dependen del stack: `COMPLETAR AL DECIDIR:`.

## 1. Orden de la revisión
1. **Contexto:** `git branch --show-current`, `git log --oneline main..HEAD`, `git diff main...HEAD --stat`. Anota qué archivos cambió la slice: esa lista decide el **origen** de cada hallazgo (sección 8). Desde la ronda 2, revisa solo `git diff <commit>..HEAD` y empieza por el estado de los hallazgos anteriores.
2. **Herramientas** (sección 2): primero los números, después la opinión.
3. **Lectura** (secciones 3 a 7), archivo por archivo del diff.
4. **Clasificación** (sección 8) y reporte.

## 2. Comandos (uno por vez, desde la carpeta del código)
| Revisión | Comando | Notas |
|---|---|---|
| Duplicación | `npx jscpd src tests --min-lines 10` (jscpd 5.4.3, D-020) | Reporte en consola. La duplicación en pruebas pesa menos que en el código. Si **una** de las copias está en el diff, el hallazgo es **del cambio**; si ninguna, **preexistente**. |
| Complejidad | `npx eslint .` (regla `complexity: ["error", { max: 10 }]` en `eslint.config.js`, activa desde P-1) | La regla debe estar activa desde la walking skeleton. Si no está, es un hallazgo: "revisión de complejidad incompleta". |
| Código sin uso | `npx knip` (knip 6.45.1, D-020; sin archivo de configuración: si le falta entender una pieza del proyecto, anótalo como revisión incompleta) | Si la herramienta distingue lo que llega a producción, córrela también así. |
| Tipos | `npx tsc --noEmit` | Si el lenguaje no tiene tipos, la fila no aplica. |
| Pruebas | `npm run test:unit` (no hay pruebas de integración: sin base ni servidor) | Confirma que están en verde antes de opinar sobre ellas. |
| Mutación | `npx stryker run` (Stryker 10.1.1 + vitest-runner, D-020; sección 10) | |

**Prohibido**, porque modifica archivos o escribe reportes: opciones como `--fix`, `--write`, `--output` / `-o`, `--output-file`, `--reporters`, `--config` / `-c`, y cualquier modo que "arregla" o "genera". El hook lo bloquea. Si una herramienta no corre, **no la reemplaces por tu opinión**: anótalo como revisión incompleta.

## 3. Fuera de alcance
- **Mapa de archivos: cada archivo del diff corresponde a un paso `P-X` del plan.** Cruza dos fuentes: la lista **Archivos** de cada paso en `plan.md` (lo aprobado) y `git log --name-only main..HEAD` (qué tocó cada `test(P-X)` / `feat(P-X)` / `refactor(P-X)`). Una fila por archivo en el reporte.
  - **Legítimos sin ser del coder:** las pruebas de aceptación y lo que el plan asigna al tester (Tester); commits `test(acceptance)` y movimientos que el plan asigna al Manager (Manager); lockfile, migraciones generadas y archivos que genera una herramienta (Generado, con el paso que los generó).
  - **Sin paso:** léelo. Si agrega comportamiento que el plan no pide → **Bloqueante**; si es soporte necesario → nota en el mapa.
  - **Al revés:** lista los archivos que el plan pide y que **no** están en el diff; pueden señalar un paso incompleto.
- **Cada dependencia nueva** está en la tabla de librerías del plan, con su versión.
- Pantallas, campos, botones o textos que **no están en el diseño aprobado**, aunque sean "mejoras".
- Parámetros, opciones o ramas que **ninguna prueba ejercita** ("por si acaso").
- Cambios en código de slices anteriores que el plan no pide.
- `TODO`, código comentado o mensajes de depuración olvidados.

## 4. Calidad de las pruebas (del coder y del tester)
- **Trazabilidad:** cada `TC-XXX` de las features tiene al menos una prueba con ese ID en el nombre, y cada restricción dura citada tiene la suya. Haz la lista y marca las que faltan.
- **¿Prueba algo?** Pregúntate: *"si cambio un `-` por un `+` en el código, ¿falla alguna prueba?"*. Si nada fallaría, la prueba es débil.
- Señales de alerta:
  - Pruebas sin aserción, o con una aserción que siempre se cumple.
  - Solo *snapshots* (fotos del resultado) sin aserciones concretas.
  - Se simula (*mock*) justo la función que se está probando.
  - Pruebas marcadas como "saltar" o "solo esta".
  - Comparaciones aproximadas o decimales donde la regla pide valores exactos.
  - Dependencia de la fecha real, de la zona horaria de la máquina o del orden de las pruebas.
  - Pruebas de detalles internos en vez del resultado visible.
- **Bordes:** contrasta con los `TC-XXX` de borde de la feature. Un borde especificado sin prueba es un hallazgo.

## 5. TDD visible
Para cada paso `P-X` del plan, en `git log --oneline`:
- Existe `test(P-X)` **antes** de `feat(P-X)` (en pantalla, el `test(acceptance)` del tester). Si falta o el orden está invertido, es **Bloqueante**.
- `git show --stat <commit de test>`: el commit de prueba **solo** toca archivos de prueba (y, si acaso, el esqueleto de la función).
- `git show <commit de feat>`: el `feat` **no** cambia las aserciones de su propia prueba para "hacerla pasar".
- Un `refactor(P-X)` no agrega comportamiento ni pruebas nuevas.

## 6. Reglas del proyecto (project-context)
- **Reglas técnicas y restricciones duras:** recórrelas una por una contra el diff. Señales en este proyecto: el texto se recorre por grafemas (`Intl.Segmenter`) y en NFC, nunca por `.length` ni por índices sueltos (C-014, A-001); expresiones regulares de letras sin la bandera `i` (plegar mayúsculas deja pasar letras ajenas, BRK-C-4); todo "pase completo" del filtro definido de forma exacta, con su ejemplo negativo (L-023); nada se guarda ni sale del celular: buscar `localStorage`, `sessionStorage`, `indexedDB`, `fetch`, `XMLHttpRequest`, `sendBeacon` (C-010); nada de `innerHTML` con lo escrito; ningún texto que la app agregue por su cuenta (C-009).
- **Nombres:** identificadores en el idioma del código y **con los nombres del glosario**. Un sinónimo del glosario es un hallazgo. Textos de pantalla iguales al diseño.
- **Quién ve qué:** si el proyecto separa datos por usuario, toda consulta y acción de servidor filtra por el usuario de la sesión. Si falta el filtro, menciónalo y avisa al security.
- **Valores del dominio:** un número fijo en el código que corresponde a un `A-XXX` es un hallazgo: los supuestos cambian y no deben quedar enterrados en el código.
- **Interfaces públicas:** nombres, parámetros, rutas e identificadores de prueba **idénticos** a los del plan.

## 7. Legibilidad para un principiante
- Nombres que dicen qué es o qué hace (`availableAmount`, no `a2` ni `tmp`).
- Funciones que hacen **una** cosa; si cuesta resumir una función en una frase, es candidata a dividirse.
- Sin condicionales ternarios anidados, sin "trucos" de una línea, sin abreviaturas.
- Los comentarios explican el **porqué**, no repiten el qué; ninguno contradice el código.
- Prueba final: ¿el Manager podría explicarle este archivo al usuario en pocos minutos?
- **Pegas menores:** lo de esta sección que no cambia el comportamiento ni rompe una regla o un umbral. Elige las **3** que más ayuden al usuario a entender el código y anota cuántas omitiste. Solo en la ronda 1. Un comentario que **contradice** el código no es pega menor: es hallazgo.

## 8. Cómo clasificar un hallazgo
0. **Origen:** ¿la slice agregó o modificó esa línea (está en `git diff main...HEAD`) o el código nuevo provoca el problema (lo llama o lo copia)? → **Del cambio**: sigue con el paso 1. Si no → **Preexistente**: nunca es Bloqueante; si ya está en `tech-debt.md`, cita su `DT-XXX`; si no, clasifícalo con los pasos 2 y 3 como `DT-propuesta`.
1. ¿Rompe una regla del proyecto, está fuera del alcance, supera un umbral, falta el TDD o deja una prueba que no prueba nada? → **Bloqueante**.
2. Si no: ¿es un atajo consciente que costará más arreglar después? → **Deuda técnica**.
3. Si no: ¿es una mejora real de claridad o estructura que no cambia el comportamiento? → **Refactor futuro**.
4. Si no: ¿es una pega menor de estilo (sección 7)? → va en "Sugerencias de estilo" (máx. 3), **no** en la tabla de hallazgos.
5. Si no es ninguna: es una preferencia personal → **no lo reportes**.

## 9. Cómo se escribe un hallazgo
Una fila por hallazgo, concreta y verificable. **"Qué pasa" empieza por el tipo de fallo** (la clase de error, no solo la línea), para que el coder lo busque y lo corrija en todos los lugares:

| # | Tipo | Origen | Archivo:línea | Qué pasa (tipo de fallo) | Por qué importa | Sugerencia |
|---|---|---|---|---|---|---|
| 1 | Bloqueante | Del cambio | `src/orders/total.ts:14` | **Valor exacto calculado con decimales:** suma los totales con números de punto flotante | Un error de centésimas se acumula en cada suma | Trabajar con enteros de principio a fin, aquí y en cualquier otro cálculo de la slice |

Sin hallazgos vagos ("mejorar el código") ni de gusto personal. **Desde la ronda 2:** un hallazgo que ya reportaste va en "Hallazgos de rondas anteriores", nunca como fila nueva.

## 10. Pruebas de mutación (solo informe)
**Cómo se corren** (uno por vez):
1. `git diff --name-only main...HEAD` filtrado a los archivos de **lógica** del cambio (sin pruebas). Si no hay, no corras la herramienta: anota "sin lógica en el cambio".
2. `npx stryker run`: su configuración propia (`stryker.config.json`) ya limita la mutación a `src/counting.ts` y `src/inputFilter.ts` y usa **solo pruebas unitarias** (`vitest.config.ts`); no hay base de datos. Si el diff no toca esos archivos, no lo corras. La carpeta temporal `.stryker-tmp` no se versiona. Lee el resultado de la salida en texto; sus reportes y copias temporales no se versionan.
3. Si la herramienta aborta porque una prueba ya falla antes de mutar, no es un sobreviviente: anótalo como hallazgo (revisión incompleta) con el nombre de la prueba.

**Qué no haces:** no cambias la configuración de la herramienta ni pasas opciones que la reemplacen; no agregas pruebas para matar sobrevivientes (eso es del coder).

### Clasificar un mutante sobreviviente
Un sobreviviente es un cambio al código que ninguna prueba **unitaria** detectó. Clasifica cada uno en este orden:
0. **¿Lo cubre una prueba de integración?** Busca una prueba de integración (del coder o del tester) que ejercite ese caso exacto; la herramienta no las corre. Si la hay → **Cubierto por integración**: cita la prueba y no es hallazgo.
1. **¿Es equivalente?** El cambio no altera nada observable (mismo resultado para toda entrada posible) → **Equivalente**: se descarta, con una frase de por qué.
2. **¿Está en código preexistente?** La línea no está en el diff → `DT-propuesta`, salvo que ya exista su `DT-XXX`.
3. **¿Toca un borde de una regla crítica, de fecha o de una restricción dura?** (p. ej. `<` cambiado por `<=` en el rango de un valor o en el primer o último día del mes) → **Sería bloqueante**: solo informa; el Manager se lo lleva al usuario y él decide si va al coder. La sugerencia es la prueba que falta, con su valor exacto.
4. **¿Es un texto de pantalla o un literal sin lógica?** → **Pega menor** (cuenta en el máximo de 3) o se agrupa en una línea: "N literales de texto sin prueba propia".
5. Lo que quede → **Refactor futuro** (`DT-propuesta`): una prueba que conviene agregar, pero no urgente.

**No reportes el puntaje como hallazgo:** importa cada sobreviviente, no el porcentaje.
