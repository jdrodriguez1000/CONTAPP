# Tareas del proyecto
**Última actualización:** 2026-11-27
**Último ID usado:** T-005

> **Reglas del archivo:**
> - Cada tarea: `ID (T-XXX)` · `Tarea` · `Prioridad` (Alta / Media / Baja) · `Estado` · `Depende de` · `Nota`. Estados: `Backlog`, `In Progress`, `Completed`, `Suspended`, `Cancelled`.
> - **Solo tareas abiertas** (`Backlog`, `In Progress`). Las `Completed` / `Suspended` / `Cancelled` se retiran y quedan en git (`git log --grep "T-XXX"`).
> - Suspender o cancelar exige motivo y una `D-XXX`. Una suspendida se retoma con **el mismo ID**. Los IDs nunca se reutilizan.
> - Índice ordenado por prioridad (Alta → Media → Baja), `In Progress` primero; se reescribe desde el detalle en cada cierre.
> - Una tarea no pasa a `In Progress` con dependencias sin `Completed`; si una dependencia se suspende o cancela, revisar las que dependen de ella.
> - Máximo **2 tareas `In Progress`**. Límite del archivo: **150 líneas**.

## Índice (tareas abiertas, por prioridad)
| ID | Tarea | Prioridad | Estado | Depende de |
|---|---|---|---|---|
| T-003 | Segunda vertical slice: VS-002 "Imágenes y diseño para niños" | Alta | In Progress | — |
| T-004 | Llevar a VEGU el piloto de ubicación (D-019, L-027) y las lecciones de método marcadas `→ VEGU` | Media | Backlog | — |

## Detalle
| ID | Tarea | Prioridad | Estado | Depende de | Nota |
|---|---|---|---|---|---|
| T-003 | Segunda vertical slice: VS-002 "Imágenes y diseño para niños" | Alta | In Progress | — | Rama `feature/VS-002-imagenes-ninos` en `../CONTAPP-VS-002`. Lotes 1 a 3 cerrados el 2026-11-27 (lote 3: CI verde en `e5c18bc`, 207 unitarias y 180 E2E; designer sin bloqueantes). Lote 4: pruebas de P-6 en `f1ef9be` (CI verde) y rojo verificado contra la preview del lote 1 (TC-055 falla también por la barra de Vercel, R-4). Siguiente: el usuario apaga la barra de Vercel en las previews, el Manager corre el verde (8/8), P-7 en el iPhone y revisión de cierre en Alta. Pruebas de ancho según D-024. Al terminar, el Manager agrega `groupImage`/`groupColor` al glosario de `project-context` y revisa A-001 con la observación de P-7 |
| T-004 | Llevar a VEGU el piloto de ubicación (D-019, L-027) y las lecciones de método marcadas `→ VEGU` | Media | Backlog | — | Se hace en una sesión abierta en `C:\Users\USUARIO\Documents\PERSONAL\VEGU`, no desde Contapp. Evidencia: el usuario confirmó el 2026-11-26, al cerrar VS-001, que el mapa y `status.html` le sirvieron para ubicarse. Incluir L-028, L-032, L-033, L-034, L-042 a L-053 y las anteriores con `→ VEGU`; L-046 pide decidir cómo compatibilizar la línea de atribución de commits con la guarda de los agentes |
