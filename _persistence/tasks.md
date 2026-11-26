# Tareas del proyecto
**Última actualización:** 2026-11-25
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
| T-001 | Entendimiento del proyecto (Fase 0) | Alta | Backlog | — |
| T-002 | Primera vertical slice: la walking skeleton | Alta | Backlog | T-001 |

## Detalle
| ID | Tarea | Prioridad | Estado | Depende de | Nota |
|---|---|---|---|---|---|
| T-001 | Entendimiento del proyecto (Fase 0) | Alta | Backlog | — | El Manager, en este orden: (1) explica al usuario cómo funciona la memoria y los protocolos de inicio y cierre; (2) le pregunta qué es el proyecto, para quién es, qué problema resuelve y qué no hará o no está incluido; (3) completa con el usuario los `COMPLETAR:` (`AGENTS.md`, memoria, reglas, skills); los `COMPLETAR AL DECIDIR:` del stack se quedan: se llenan cuando el Manager decide cada pieza; (4) ajusta `AGENTS.md` y lo demás que haga falta. Termina cuando el usuario confirma que el Manager entiende lo que se va a construir y no queda ninguna marca `COMPLETAR:` por llenar: ``grep -rnE '(^|[^`])COMPLETAR[:]' . --exclude-dir=.git`` no devuelve nada. Las menciones entre comillas invertidas y las marcas `COMPLETAR AL DECIDIR:` no cuentan |
| T-002 | Primera vertical slice: la walking skeleton | Alta | Backlog | T-001 | Lo mínimo corriendo de punta a punta, de verdad (PI-4), siguiendo el flujo de `orchestrator-playbook` |
