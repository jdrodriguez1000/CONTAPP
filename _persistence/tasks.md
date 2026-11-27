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
| T-003 | Segunda vertical slice: VS-002 "Imágenes y diseño para niños" | Alta | In Progress | — | Definida, diseñada y planeada el 2026-11-27 (D-021, D-022, D-023): F-002 y F-003 aprobadas (DoR), plan de 7 pasos en 4 lotes aprobado (`_project/slices/VS-002/plan.md`). Siguiente: etapa 6 (rama `feature/VS-002-imagenes-ninos` en `../CONTAPP-VS-002`, `npm ci`, `npx playwright install webkit`) y lote 1 (P-1 DT-008 y DT-009, P-2 colores): primero el tester trabajo A. En ese primer trabajo A, guardar como evidencia que su `npm run check` corre en vivo (pendiente de MANT-001). Revisión de cierre en Alta (decisión del usuario). Al terminar, el Manager agrega `groupImage`/`groupColor` al glosario de `project-context` (propuesta del architect) y revisa A-001 con la observación de P-7 |
| T-004 | Llevar a VEGU el piloto de ubicación (D-019, L-027) y las lecciones de método marcadas `→ VEGU` | Media | Backlog | — | Se hace en una sesión abierta en `C:\Users\USUARIO\Documents\PERSONAL\VEGU`, no desde Contapp. Evidencia: el usuario confirmó el 2026-11-26, al cerrar VS-001, que el mapa y `status.html` le sirvieron para ubicarse. Incluir L-028, L-032, L-033, L-034 y las anteriores con `→ VEGU` |
