# Supuestos del proyecto
**Última actualización:** 2026-11-25
**Último ID usado:** A-001

> **Reglas del archivo:**
> - Un supuesto es un **valor del dominio** que se usa sin estar confirmado (una tasa, un límite, un plazo). Las decisiones de diseño o técnicas van en `decisions.md`.
> - Tablas por categoría con: `ID` · `Supuesto` · `Valor` · `Unidad` · `Fuente` · `Fecha` · `Estado` · `Confianza` · `Revisar el` · `Dónde se usa` (regla o ID donde se aplica: `C-XXX`, `F-XXX`…).
> - Estados: `Propuesto` (referencia del agente) · `Validado` · `Por validar con experto` · `Obsoleto` (sale del archivo). Confianza: Alta / Media / Baja.
> - **Solo supuestos activos.** Si un valor cambia, se actualiza la fila; el anterior queda en git y el commit de cierre lista `A-XXX: anterior → nuevo — motivo` (`git log --grep "A-XXX"`).
> - Un cambio que altere conclusiones del modelo genera además una decisión `D-XXX`.
> - Antes de usar o proponer un valor, revisar si ya existe; nunca inventar uno distinto al vigente.
> - Supuestos con `Revisar el` vencido se reportan en `progress.md` como pendientes.

## Presentación en pantalla
| ID | Supuesto | Valor | Unidad | Fuente | Fecha | Estado | Confianza | Revisar el | Dónde se usa |
|---|---|---|---|---|---|---|---|---|---|
| A-001 | Largo máximo del texto que se puede escribir, para que el resultado quepa en la pantalla del celular | 100 | caracteres (un emoji cuenta como 1) | Propuesta del Manager, aceptada por el usuario | 2026-11-25 | Validado | Media | Al ver la primera pantalla en el celular | `edge-cases` §2–3 |
