# Reporte del architect — VS-001
**Fecha:** 2026-11-25

## Resumen
Definí la VS-001 (walking skeleton) con una sola feature, **F-001**: abrir la app publicada desde el celular, escribir o pegar una palabra o frase y ver al instante los 4 conteos en texto sencillo. Cubre todas las reglas de conteo (C-001 a C-008, C-012), el filtro silencioso de letras de otros idiomas (C-011, D-005), el tope silencioso de 100 caracteres (A-001, D-007) y el alcance sin IA, sin base de datos y sin cuenta (C-009, C-010). Son 8 criterios de aceptación y 27 casos de prueba (TC-001 a TC-027). No existía código todavía (lo revisé en el repositorio), así que ninguna prueba vieja cambia.

## Archivos creados o modificados
- `_project/slices/VS-001.md` — objetivo, feature, dependencias, fuera de alcance, riesgos, bordes que esperan, esbozo de 10 pasos y nivel de riesgo.
- `_project/features/F-001.md` — feature completa (secciones 1–4 y 6–9); la sección 5 queda `Pendiente — designer`, con las necesidades de pantalla.
- `_project/slices/VS-001/reports/architect.md` — este reporte.

## Esbozo de pasos (resumen)
**10 pasos**, el máximo permitido: 1 esqueleto del proyecto → 2 publicar y abrir desde el celular → 3 pantalla con los 4 grupos en 0 → 4 regla de vocales y consonantes → 5 regla de números, otros y espacios → 6 contar mientras se escribe → 7 letras de otros idiomas no entran → 8 tope de 100 → 9 pruebas automáticas en cada cambio (CI) → 10 prueba de punta a punta en el celular.
- Publicar va de **segundo** a propósito: es lo más incierto para el usuario y así se ve en el celular desde el principio (eso es la "walking skeleton": el camino completo corriendo de verdad, aunque sea con lo mínimo).
- **Primer paso con valor funcional:** el 3 (pantalla real en el celular); el primero que cuenta de verdad es el 6.
- **Recortado:** nada de la fila del roadmap; lo que sobraba (bordes sin regla, presentación) quedó en "Bordes que esperan". *¿Qué de esto puede esperar a la siguiente slice?* Revisé: los pasos 7 y 8 cumplen restricciones duras y decisiones ya tomadas (C-011, D-005, D-007), así que no pueden salir; el paso 9 (CI) lo exige el PR a `main`. No queda nada recortable sin romper una regla.
- **Nivel de riesgo esperado: Alto** — (6) dependencias, (5) despliegue, (7) CI y (2) cálculos y validación de entradas.

## Trazabilidad de restricciones duras
| Restricción | Feature | Casos de prueba |
|---|---|---|
| C-001 Vocales | F-001 | TC-002, TC-004, TC-005, TC-019 |
| C-002 La ñ | F-001 | TC-006, TC-019 |
| C-003 La y | F-001 | TC-007 |
| C-004 Dígrafos | F-001 | TC-008 |
| C-005 Mayúsculas | F-001 | TC-005, TC-009 |
| C-006 Dígitos | F-001 | TC-010, TC-015 |
| C-007 Otros | F-001 | TC-011, TC-012, TC-015, TC-023 |
| C-008 Espacios | F-001 | TC-013, TC-015 |
| C-009 Sin IA | F-001 | TC-027 |
| C-010 Sin base de datos ni login | F-001 | TC-001, TC-024, TC-025 |
| C-011 Letras de otros idiomas | F-001 | TC-016, TC-017, TC-018, TC-019 |
| C-012 Texto vacío | F-001 | TC-001, TC-003, TC-014 |
| C-013 Idioma | F-001 | TC-026 (pantalla); el código en inglés lo verifica el reviewer |
| A-001 / D-007 Tope de 100 (supuesto, no restricción; se prueba por ser borde de la fila) | F-001 | TC-020, TC-021, TC-022, TC-023 |

## Preguntas para el usuario
Las preguntas 1 y 2 son del **stack** y hay que responderlas antes del plan. Las demás son bordes sin regla: si no se responden, el borde no se prueba en VS-001 y queda en "Bordes que esperan".
1. **¿Cómo se publica la app?** (decisión técnica, la toman el usuario y el Manager). Recomiendo que se abra como **una dirección de internet en el navegador del celular** (como abrir una página): no hace falta tienda de apps, suele tener planes gratis y encaja con VS-006 (ícono y uso sin internet). Contra: no aparece en la tienda de apps.
2. **¿En qué celular y navegador se hacen las pruebas de punta a punta?** (regla 6 del roadmap: un solo dispositivo). Recomiendo **el que usa el usuario con los niños** (Android o iPhone, y su navegador).
3. **¿Los espacios ocupan lugar dentro de los 100 caracteres?** A-001 no lo dice. Recomiendo **sí**: el tope existe para que el texto quepa en pantalla, y los espacios ocupan pantalla. Los casos del tope (TC-020 a TC-023) usan solo letras para no depender de esta respuesta.
4. **Al pegar un texto mezclado como "façade", ¿qué pasa en VS-001?** Opción A: entra todo menos la letra de otro idioma ("faade"). Opción B: no entra nada. Recomiendo **A**, que es la lectura literal de D-005 ("esa letra no entra"); desde VS-004 se borrará todo (D-006) de todos modos.
5. **Al pegar más de lo que cabe en medio de un texto ya escrito**, entiendo por D-007 que entra el comienzo de lo pegado hasta completar 100 y el resto no. ¿Lo confirmas?
6. **(Para el designer) ¿Se apagan el corrector y las sugerencias del teclado del celular en el campo?** El teclado puede "corregir" lo que escribe el niño y cambiar los conteos. Recomiendo **apagarlos**, para que el texto sea exactamente lo que se escribió (relacionado con C-009).
7. **Letras con tilde "en dos piezas":** algunos computadores guardan la "á" como una "a" más una tilde aparte; al pegarla, ¿debe contar como 1 vocal, igual que la "á" normal? Recomiendo **sí**.
8. **Caracteres raros sin regla:** recomiendo esto, para que lo valides como experto: emoji con número (1️⃣) → **1 otro** (es un emoji); superíndices y fracciones (² ½) → **otros**; ordinales (ª º, como en "1º") → **otros**; números de otros alfabetos (٣) → **no entran** (como las letras de otros idiomas); tildes sueltas (´ ¨ ` ^) → **otros**; espacios especiales pegados → **no se cuentan**, como un espacio; caracteres invisibles pegados → **no entran**.

## Supuestos, decisiones o lecciones propuestas
- **Propuesta de glosario:** "Letra de otro idioma" → `foreignLetter`, y "Largo máximo del texto" → `maxTextLength` (valor en A-001). Aparecen en las reglas y en las pruebas y aún no están en `project-context`.
- **Propuesta para `assumptions.md` (A-001):** agregar en "Dónde se usa" `F-001` y TC-020 a TC-023, y, según la pregunta 3, si los espacios ocupan lugar en los 100.
- **Propuesta para `edge-cases` §2:** pasar a "Bordes con regla aún sin definir" los de las preguntas 3, 4, 7 y 8 mientras el usuario no responda, porque hoy la tabla dice "Ninguno por ahora".
- **Interpretación de "conteo al instante":** los conteos cambian con cada carácter, sin botón de "contar". Sale de `project-context` ("muestre esa clasificación al instante"); la anoto por si el usuario la ve distinto.

## Sugerencias fuera de alcance
- Mostrar el **total de caracteres** junto a los 4 conteos (ayudaría a ver que la suma cuadra) — VS-002 o VS-003, si el usuario lo quiere.
- Mostrar cuántos caracteres faltan para llegar a 100 — descartado en la práctica por D-007 (sin avisos); solo si el usuario cambia esa decisión.

STATUS: DONE

# Ajustes del architect — VS-001 (respuestas del usuario)
**Fecha:** 2026-11-25

## Resumen
Incorporé las 8 respuestas del usuario en F-001 y VS-001. Hay **2 criterios nuevos** (CA-9 y CA-10), **4 criterios ajustados** (CA-2, CA-5, CA-6 y CA-8) y **11 casos de prueba nuevos** (TC-028 a TC-038). Los TC-001 a TC-027 siguen igual y ninguno contradice las respuestas. El **esbozo de 10 pasos no cambió**, y no escribí la línea de aprobación.

## Qué cambié
- **`_project/features/F-001.md`**
  - §2 Alcance: espacios especiales, caracteres especiales, números de otros alfabetos, invisibles, texto mezclado, espacios dentro de los 100, pegar en medio, teclado sin corrector, publicación web y E2E en iPhone + Safari.
  - §4 Reglas: filas nuevas **R3 a R8** (nombres de trabajo que corresponden a las preguntas 3 a 8, no son IDs del proyecto) y la del stack. Quedan marcadas "por registrar" hasta que el Manager les dé su `C-XXX`, `A-XXX` o `D-XXX`.
  - §5 Diseño: el corrector y las sugerencias del teclado van apagados (decidido); entorno de referencia, iPhone + Safari.
  - §6 Criterios: se ajustaron CA-2 (los espacios especiales no se cuentan), CA-4 (la letra en dos piezas cuenta como 1), CA-5 (números de otros alfabetos e invisibles no entran; un texto mezclado entra sin esa letra), CA-6 (los espacios ocupan lugar; al pegar entra el comienzo) y CA-8 (teclado sin corrector). Son nuevos **CA-9** (letra con tilde en dos piezas) y **CA-10** (1️⃣, ² ½ ª º y las tildes sueltas son otros).
  - §7 Casos de prueba: TC-028 a TC-038, con una nota de que todos los E2E se corren en iPhone con Safari.
- **`_project/slices/VS-001.md`**
  - Dependencias: el stack quedó respondido (dirección web; iPhone + Safari), pendiente de registro.
  - Riesgos: se actualizó el del teclado y se agregó uno de invisibles dentro de los emojis.
  - Bordes que esperan: salieron los bordes que ya tienen regla (espacios dentro de los 100, texto mezclado, pegar en medio, "á" en dos piezas, caracteres raros) y entraron 2 restos sin regla (preguntas 9 y 10).

## Casos de prueba nuevos
| ID | Caso (resumen) | Criterio | Regla |
|---|---|---|---|
| TC-028 | 99 caracteres con espacios + un espacio → entra (100); "b" → no entra | CA-6 | A-001, R3, D-007 |
| TC-029 | Pegar "façade" → queda "faade", 3 vocales y 2 consonantes | CA-5 | C-011, R4 |
| TC-030 | 98 "a" + pegar "xyz" en medio → entra "xy", la "z" no | CA-6 | R5, D-007 |
| TC-031 | El campo no corrige ni sugiere en iPhone + Safari | CA-8 | C-009, R6 |
| TC-032 | "á" y "canción" en dos piezas → se cuentan igual que las normales (unitaria) | CA-9 | C-001, R7 |
| TC-033 | Pegar "canción" en dos piezas → entra completa (E2E) | CA-9 | C-011, R7 |
| TC-034 | 1️⃣ → 1 otro; ² ½ ª º → otros; "1º" → 1 número y 1 otro | CA-10 | C-006, C-007, R8 |
| TC-035 | ´ ¨ ` ^ → otros; "^" entra en el campo | CA-10 | C-007, R8 |
| TC-036 | "٣" no entra; pegar "a٣b" → queda "ab" | CA-5 | C-006, C-011, R8 |
| TC-037 | Un espacio especial no se cuenta | CA-2 | C-008, R8 |
| TC-038 | Un invisible suelto no entra; la familia 👨‍👩‍👧 sigue contando como 1 otro | CA-5 | C-007, R8 |

## Interpretaciones que apliqué (salen de reglas ya vigentes)
- **"Invisible suelto"** quiere decir uno que no forma parte de un emoji. Algunos emojis, como la familia y el 1️⃣, se arman con piezas invisibles. Si esas piezas se quitaran, el emoji se partiría y dejaría de contar como 1, lo que choca con C-007 y A-001. Por eso esas piezas se conservan (TC-038).
- **Números de otros alfabetos en un texto pegado mezclado:** se aplica la misma regla que a las letras (R4): entra todo lo demás ("a٣b" → "ab", TC-036).
- **Un espacio especial ocupa lugar dentro de los 100**, como un espacio normal (R3 + R8: "como un espacio").

## Preguntas para el usuario (quedan 2, no bloquean el plan)
9. **¿La "ü" y la "ñ" guardadas en dos piezas cuentan igual que las normales?** La respuesta 7 habló de la "á". Recomiendo **sí**, por la misma razón: se ven iguales y son letras del español.
10. **Una letra de otro idioma guardada en dos piezas** ("a" más un acento grave aparte, que se ve como "à"): ¿no entra nada o entra la "a" sola? Recomiendo **que no entre nada**, porque el niño ve una sola letra "à" y así se comporta igual que la "à" normal (TC-017).

## Supuestos, decisiones o lecciones propuestas
- **Decisión de stack (para registrar):** publicar como dirección web en el navegador del celular; las E2E de la regla 6 del roadmap en **iPhone + Safari**. Con esto se llena el `COMPLETAR AL DECIDIR` de la regla 6 del roadmap y de "Pruebas" en `project-context`.
- **Restricciones o supuestos (para registrar):**
  - R3 va en A-001: los espacios ocupan lugar dentro de los 100.
  - R4, R5, R7 y R8 son reglas de conteo y de entrada, en el tema "Conteo de caracteres" de `constraints.md` (sugiero que sean duras, porque las validó el experto del dominio).
  - R6 (teclado sin corrector) es una decisión de diseño.
  - Cuando tengan sus IDs, cambio la columna ID de la §4 de F-001.
- **`edge-cases`:** se pueden pasar las reglas R3 a R8 a la sección 5 (reglas del dominio), y las preguntas 9 y 10 a la sección 2 mientras no se respondan.

STATUS: DONE

# Ajustes 2 del architect — VS-001
**Fecha:** 2026-11-25

## Resumen
Cambié los nombres de trabajo por los IDs que registró el Manager, incorporé las respuestas 9 y 10 (ahora parte de C-014) y agregué **4 casos de prueba** (TC-039 a TC-042). Ya no queda ninguna pregunta abierta. El esbozo de 10 pasos no cambió y no escribí la línea de aprobación. Antes de editar verifiqué que C-014, C-015, C-016, D-008, D-009 y la ampliación de A-001 existen en `_persistence/`.

## Qué cambié
- **`_project/features/F-001.md`**
  - §2 Alcance: cada regla nueva lleva su ID; se agregó la viñeta de letras en dos piezas (C-014).
  - §4 Reglas: salieron las filas R3 a R8 y la del stack, junto con su nota. Entraron C-014, C-015, C-016, D-008 y D-009, y la fila de A-001 se amplió (los espacios ocupan lugar; al pegar de más entra el comienzo).
  - §5 Diseño: el teclado sin corrector ahora cita D-009.
  - §6 Criterios: en CA-2, CA-4, CA-5, CA-6, CA-8 y CA-10 se reemplazó R3 → A-001, R4 → C-016, R5 → A-001 y D-007, R6 → D-009 y R8 → C-015. **CA-9** cubre ahora á é í ó ú ü ñ en dos piezas (cada una cuenta 1 en su grupo) y la "à" en dos piezas, que no entra nada.
  - §7 Casos de prueba: se reemplazaron los IDs en TC-028 a TC-038, entraron TC-039 a TC-042 y salió la nota de casos pendientes.
  - §8 DoR: quedó marcada la casilla de preguntas respondidas.
- **`_project/slices/VS-001.md`**
  - Encabezado: reglas C-001 a C-016, A-001, D-005, D-007, D-008, D-009.
  - Dependencias: citan D-008 y D-009.
  - Riesgos: el de preguntas pendientes se cambió por uno de letras en dos piezas.
  - Bordes que esperan: salieron las dos filas de las preguntas 9 y 10, y la nota lista lo que salió con sus IDs. Quedan 4 bordes de presentación o sin conexión (VS-002 y VS-006).

| Nombre de trabajo | ID registrado |
|---|---|
| R3 | A-001 |
| R4 | C-016 |
| R5 | A-001, D-007 |
| R6 | D-009 |
| R7 (+ preguntas 9 y 10) | C-014 |
| R8 | C-015 |
| Stack | D-008, D-009 |

## Casos de prueba nuevos
| ID | Caso (resumen) | Criterio | Regla |
|---|---|---|---|
| TC-039 | ü y ñ en dos piezas (también "pingüino" y "Ñandú") cuentan igual que las normales; cada una ocupa 1 (unitaria) | CA-9, CA-4 | C-001, C-002, C-014 |
| TC-040 | Pegar "niño" con la "ñ" en dos piezas → entra completa, 2/2 (E2E) | CA-9 | C-002, C-011, C-014 |
| TC-041 | "à" en dos piezas no entra nada; pegar "càsa" con la "à" en dos piezas → queda "csa" (sin la "a" de la "à") | CA-9, CA-5 | C-011, C-014, C-016 |
| TC-042 | Con 99 "a", una "ñ" en dos piezas entra completa (ocupa 1), y la "b" siguiente ya no entra | CA-9, CA-6 | A-001, C-014, D-007 |

## Trazabilidad de las restricciones duras nuevas
| Restricción | Feature | Casos de prueba |
|---|---|---|
| C-014 Letras en dos piezas | F-001 | TC-032, TC-033, TC-039, TC-040, TC-041, TC-042 |
| C-015 Caracteres raros | F-001 | TC-034, TC-035, TC-036, TC-037, TC-038 |
| C-016 Pegar texto mezclado | F-001 | TC-029, TC-041 |

## Interpretaciones que apliqué
- **"càsa" con la "à" en dos piezas → "csa":** combina C-014 (la "à" en dos piezas no entra completa, ni la "a") con C-016 (de un texto mezclado entra lo demás).
- **TC-042 (la ñ en dos piezas en el lugar 100):** sale de C-014 ("ocupa 1, igual que la normal") y de A-001. Lo agregué porque es donde más fácil se partiría la letra.

## Preguntas para el usuario
- Ninguna.

## Supuestos, decisiones o lecciones propuestas
- **`edge-cases`:** queda pendiente la propuesta del primer ajuste, ahora con IDs: llevar C-014, C-015 y C-016 a la sección 5 (reglas del dominio). La sección 2 sigue en "Ninguno por ahora".
- **`project-context`:** ya se pueden llenar con D-008 y D-009 el `COMPLETAR AL DECIDIR` de la regla 6 del roadmap (dispositivo de las E2E) y la línea de reglas de conteo (agregar C-014 a C-016).

STATUS: DONE
