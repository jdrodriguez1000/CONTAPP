# Deuda técnica
**Última actualización:** 2026-11-26
**Último ID usado:** DT-002

> **Reglas del archivo:**
> - Una fila por hallazgo aceptado como deuda (no bloqueante). Columnas: `ID (DT-XXX)` · `Hallazgo` · `Origen (agente, VS-XXX)` · `Severidad` · `Slice donde se atiende` · `Estado` (`Abierta` / `Atendida`). Los IDs no se reutilizan.
> - El Manager lo presenta y, si el usuario no objeta, queda registrado.
> - Se edita **solo en `main`**, para evitar choques entre ramas.
> - **Al atender una `DT`, su estado se cambia en el mismo commit** que la corrige (fecha, commit y quién).

| ID | Hallazgo | Origen | Severidad | Slice donde se atiende | Estado |
|---|---|---|---|---|---|
| DT-001 | `npm audit`: 8 avisos **moderados** por `minimatch` (posible bloqueo por patrones), que llega por `eslint` 10.5.0 y `typescript-eslint` 8.72.1. Solo herramientas de desarrollo; no va en la app publicada. Arreglo: subir `typescript-eslint` (≥ 8.74.0) y `eslint` a versiones sin el aviso | Manager, VS-001 lote 1 | Media | VS-001, con la revisión de security | Abierta |
| DT-002 | La CI avisa que `gitleaks/gitleaks-action@v2` está hecha para Node 20 (en retiro); GitHub la corre igual con Node 24 y funciona (corrida 45856376057, 2026-11-26). Arreglo: revisar si existe una versión nueva de la acción y subirla. No bloquea mientras siga funcionando; cambiarla ahora cambiaría el plan aprobado | Manager, VS-001 lote 5 (P-9) | Baja | La decide el usuario (propuesta: próximo mantenimiento o VS-002) | Abierta |
