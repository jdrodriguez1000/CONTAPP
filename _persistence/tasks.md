# Tareas del proyecto
**Última actualización:** 2026-11-26
**Último ID usado:** T-002

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
| T-002 | Primera vertical slice: la walking skeleton | Alta | In Progress | T-001 |

## Detalle
| ID | Tarea | Prioridad | Estado | Depende de | Nota |
|---|---|---|---|---|---|
| T-002 | Primera vertical slice: la walking skeleton | Alta | In Progress | T-001 | Lotes 1, 2 y 3 de 5 terminados (2026-11-26); sigue el lote 4 (P-7, P-8). VS-001 — Contar en el celular (F-001), definida en `_project/roadmap.md`. Lo mínimo corriendo de punta a punta, de verdad (PI-4), siguiendo el flujo de `orchestrator-playbook`. T-001 ya está completada (2026-11-25) |
