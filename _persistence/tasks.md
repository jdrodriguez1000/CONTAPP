# Tareas del proyecto
**Última actualización:** 2026-11-27
**Último ID usado:** T-006

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
| T-006 | Tercera vertical slice: VS-003 "Ver cada letra en su grupo" | Alta | Backlog | — |
| T-004 | Llevar a VEGU el piloto de ubicación (D-019, L-027) y las lecciones de método marcadas `→ VEGU` | Media | Backlog | — |

## Detalle
| ID | Tarea | Prioridad | Estado | Depende de | Nota |
|---|---|---|---|---|---|
| T-006 | Tercera vertical slice: VS-003 "Ver cada letra en su grupo" | Alta | Backlog | — | F-004: el texto escrito se muestra con cada carácter del color de su grupo (colores ya elegidos en VS-002 para servir como letra, 4,5:1). Empieza con el architect (etapa 1) en `main`, con la fila de `roadmap.md`. Arrastra el borde "cambio de modo claro u oscuro con la app abierta" (VS-002 §6). Antes, el usuario puede decidir si se crea la slice "Ver bien en otros tamaños" |
| T-004 | Llevar a VEGU el piloto de ubicación (D-019, L-027) y las lecciones de método marcadas `→ VEGU` | Media | Backlog | — | Se hace en una sesión abierta en `C:\Users\USUARIO\Documents\PERSONAL\VEGU`, no desde Contapp. Evidencia: el usuario confirmó el 2026-11-26, al cerrar VS-001, que el mapa y `status.html` le sirvieron para ubicarse. Incluir L-028, L-032, L-033, L-034, L-042 a L-053 y las anteriores con `→ VEGU`; L-046 pide decidir cómo compatibilizar la línea de atribución de commits con la guarda de los agentes. Suma de VS-002 (2026-11-27): L-055 a L-058 y L-060, y que DT-014 nombre también a los breakers (el breaker-code construyó la app y abrió WebKit dentro de `npx vitest run`) |
