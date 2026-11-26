# Tareas del proyecto
**Última actualización:** 2026-11-26
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
| T-003 | Segunda vertical slice: VS-002 "Imágenes y diseño para niños" | Alta | Backlog | — |
| T-004 | Llevar a VEGU el piloto de ubicación (D-019, L-027) y las lecciones de método marcadas `→ VEGU` | Media | Backlog | — |
| T-005 | Promover L-012: agregar `npm run check` a la guarda del tester | Media | Backlog | — |

## Detalle
| ID | Tarea | Prioridad | Estado | Depende de | Nota |
|---|---|---|---|---|---|
| T-003 | Segunda vertical slice: VS-002 "Imágenes y diseño para niños" | Alta | Backlog | — | F-002 (una imagen y un color por grupo) y F-003 (pantalla didáctica), definidas en `_project/roadmap.md`. Empieza por el architect (etapa 1 del playbook). Deuda propuesta para esta slice: DT-004, DT-008, DT-009 (la decide el usuario). T-002 (VS-001) quedó `Completed` el 2026-11-26 |
| T-004 | Llevar a VEGU el piloto de ubicación (D-019, L-027) y las lecciones de método marcadas `→ VEGU` | Media | Backlog | — | Se hace en una sesión abierta en `C:\Users\USUARIO\Documents\PERSONAL\VEGU`, no desde Contapp. Evidencia: el usuario confirmó el 2026-11-26, al cerrar VS-001, que el mapa y `status.html` le sirvieron para ubicarse. Incluir L-028, L-032, L-033, L-034 y las anteriores con `→ VEGU` |
| T-005 | Promover L-012: agregar `npm run check` a la guarda del tester | Media | Backlog | — | L-012 se repitió en VS-001 (el tester no pudo correrlo en la ronda 1, dos veces). Aprobado por el usuario el 2026-11-26 para la próxima sesión: agregar `"npm run check"` a la lista de `guard-bash-allowlist` en `.claude/agents/tester.md` (cadena de entrega, nivel Alto), comprobar con `guards.test.mjs` y pasar L-012 a `Promovida`. Hacerlo antes del primer tester de VS-002 |
