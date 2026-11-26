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
