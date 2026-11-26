# Deuda técnica
**Última actualización:** 2026-11-25
**Último ID usado:** DT-000

> **Reglas del archivo:**
> - Una fila por hallazgo aceptado como deuda (no bloqueante). Columnas: `ID (DT-XXX)` · `Hallazgo` · `Origen (agente, VS-XXX)` · `Severidad` · `Slice donde se atiende` · `Estado` (`Abierta` / `Atendida`). Los IDs no se reutilizan.
> - El Manager lo presenta y, si el usuario no objeta, queda registrado.
> - Se edita **solo en `main`**, para evitar choques entre ramas.
> - **Al atender una `DT`, su estado se cambia en el mismo commit** que la corrige (fecha, commit y quién).

| ID | Hallazgo | Origen | Severidad | Slice donde se atiende | Estado |
|---|---|---|---|---|---|
