# Restricciones del proyecto
**Última actualización:** 2026-11-26
**Último ID usado:** C-016

> **Reglas del archivo:**
> - Tablas por tema con: `ID` · `Restricción` · `Tipo` (`Dura`: no se rompe · `Blanda`: se flexibiliza con aprobación) · `Origen` · `Cómo se aplica en el modelo` · `Estado` · `Revisar el` · `Relacionada con`.
> - Estados: `Vigente` · `Por validar con experto` · `Retirada` (sale del archivo, queda en git: `git log --grep "C-XXX"`).
> - **La regla aquí, el número en `assumptions.md`**: referenciar el `A-XXX` del valor.
> - **No se lee al inicio de sesión.** Antes de diseñar o proponer algo, leer la(s) tabla(s) del tema que toca.
> - Si una propuesta viola una **dura**, no se propone; si viola una **blanda**, se propone avisando cuál rompe.
> - Flexibilizar o retirar una restricción dura exige una decisión `D-XXX`.

## Conteo de caracteres
| ID | Restricción | Tipo | Origen | Cómo se aplica en el modelo | Estado | Revisar el | Relacionada con |
|---|---|---|---|---|---|---|---|
| C-001 | Vocales: a e i o u, también con tilde (á é í ó ú) y con diéresis (ü) | Dura | Usuario (experto del dominio), 2026-11-25 | "canción" → 3 vocales | Vigente | — | — |
| C-002 | La ñ es consonante | Dura | Usuario, 2026-11-25 | "niño" → 2 consonantes | Vigente | — | C-001 |
| C-003 | La y es **siempre** consonante (criterio RAE), aunque suene como vocal | Dura | Usuario, 2026-11-25 | "rey" → 2 consonantes; "y" → 1 consonante | Vigente | — | — |
| C-004 | Los dígrafos (ch, ll, rr) no son una unidad: cada letra cuenta por separado | Dura | Usuario, 2026-11-25 | "llave" → 3 consonantes | Vigente | — | — |
| C-005 | Mayúsculas y minúsculas cuentan igual | Dura | Usuario, 2026-11-25 | "Ana" → 2 vocales, 1 consonante | Vigente | — | — |
| C-006 | Cada dígito (0–9) cuenta como un número por separado | Dura | Usuario, 2026-11-25 | "2026" → 4 números | Vigente | — | — |
| C-007 | Signos, símbolos y emojis cuentan como **otros** | Dura | Usuario, 2026-11-25 | "¡Hola!" → 2 otros | Vigente | — | — |
| C-008 | Espacios, tabulaciones y saltos de línea **no se cuentan** | Dura | Usuario, 2026-11-25 | "la casa" → 6 caracteres contados | Vigente | — | — |
| C-011 | Solo se permiten las letras del alfabeto español (a–z, ñ, á é í ó ú ü, en mayúscula y minúscula). Las letras o acentos de otros idiomas (à â ö ç ß, otros alfabetos…) **no se permiten**: no entran al texto ni se cuentan | Dura | Usuario, 2026-11-25 | Intentar escribir "ç" no cambia el texto ni el conteo | Vigente | — | C-001, C-007 |
| C-012 | Texto vacío o solo con espacios: los 4 grupos muestran 0 | Dura | Usuario, 2026-11-25 | "" y "   " → 0 en todo | Vigente | — | C-008 |
| C-014 | Una letra del español guardada en dos piezas (letra + signo aparte: á é í ó ú ü ñ) cuenta igual que la normal; una letra de otro idioma en dos piezas ("à") no entra **completa**, igual que la normal | Dura | Usuario, 2026-11-25 | "á" o "ñ" pegadas en dos piezas → 1 vocal / 1 consonante; "à" en dos piezas → no entra nada | Vigente | — | C-001 |
| C-015 | Caracteres raros: emoji con número (1️⃣), superíndices y fracciones (² ½), ordinales (ª º) y tildes sueltas (´ ¨ ` ^) son **otros**; números de otros alfabetos (٣) y caracteres invisibles **no entran**; los espacios especiales pegados no se cuentan, como un espacio; un signo de tilde pegado solo (aunque quede detrás de una letra que ya estaba) no entra y nunca cambia una letra ya escrita | Dura | Usuario, 2026-11-25 | "1º" → 1 número, 1 otro; "٣" no cambia el texto | Vigente | — | C-006, C-007, C-008, C-011 |
| C-016 | Al pegar un texto mezclado, solo las letras de otros idiomas no entran; lo demás sí (hasta VS-004, ver D-006) | Dura | Usuario, 2026-11-25 | Pegar "façade" → queda "faade" | Vigente | Al construir VS-004 | C-011, D-005, D-006 |

## Alcance del producto
| ID | Restricción | Tipo | Origen | Cómo se aplica en el modelo | Estado | Revisar el | Relacionada con |
|---|---|---|---|---|---|---|---|
| C-009 | Sin inteligencia artificial: la palabra o frase siempre la escribe una persona | Dura | Usuario, 2026-11-25 | Ninguna slice genera ni sugiere texto | Vigente | — | — |
| C-010 | Sin base de datos ni inicio de sesión: no se guarda lo escrito y la app se usa sin cuenta | Dura | Usuario, 2026-11-25 | Nada se persiste en servidor; no hay usuarios ni contraseñas | Vigente | — | — |

## Técnicas
| ID | Restricción | Tipo | Origen | Cómo se aplica en el modelo | Estado | Revisar el | Relacionada con |
|---|---|---|---|---|---|---|---|
| C-013 | Código en inglés; texto de pantalla en español de Colombia | Dura | Usuario, 2026-11-25 | Nombres en código según el glosario de `project-context` | Vigente | — | — |
