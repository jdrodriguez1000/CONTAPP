# Supuestos del proyecto
**Última actualización:** 2026-11-26
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
| A-001 | Largo máximo del texto que se puede escribir, para que el resultado quepa en la pantalla del celular | 100 | caracteres (un emoji cuenta como 1; los espacios **sí** ocupan lugar; al pegar de más entra el comienzo hasta 100, sin aviso — D-007) | Propuesta del Manager, aceptada por el usuario; confirmada en su iPhone el 2026-11-26 (una frase de 100 caracteres ocupa 4 líneas del campo y nada se corta) | 2026-11-26 | Validado | Alta | Al ver las fichas con imagen de VS-002 en el celular | `edge-cases` §3, F-001 |
