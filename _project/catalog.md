# Catálogo del proyecto
**Última actualización:** 2026-11-25
**Últimos IDs:** `GRP-004`

> **Reglas del archivo:**
> - Datos maestros del producto: las listas que el sistema usa y que no son datos del día a día (p. ej. tipos, categorías, cuentas).
> - Cada registro lleva un **ID estable y neutro** (no depende del nombre ni de su clasificación) que nunca se reutiliza.
> - Un registro en uso se **inactiva**, no se borra; uno nunca usado puede eliminarse.
> - Crear, modificar, inactivar o eliminar un registro lo aprueba el usuario.
> - Si el producto no tiene datos maestros, este archivo se borra en la Fase 0 y se quita de `project-context`.

## Grupos de caracteres
| ID | Nombre | En código | Qué incluye | Imagen | Estado |
|---|---|---|---|---|---|
| GRP-001 | Vocales | `vowel` | C-001 | Por definir en el diseño | Activo |
| GRP-002 | Consonantes | `consonant` | C-002 a C-004 | Por definir en el diseño | Activo |
| GRP-003 | Números | `digit` | C-006 | Por definir en el diseño | Activo |
| GRP-004 | Otros | `other` | C-007 | Por definir en el diseño | Activo |
