# Clasificación de hallazgos (etapa 9c) — VS-001

## Nivel de riesgo por entrega
| Entrega | Base del diff | Nivel | Archivos que lo deciden | Aprobado por el usuario |
|---|---|---|---|---|
| Revisión inicial (ronda 1) | `main...065c0d7` | **Alto** | `src/counting.ts`, `src/inputFilter.ts` (reglas críticas: conteo y validación de entrada); `.github/workflows/ci.yml`, `package.json`, `package-lock.json` y configuraciones (cadena de entrega, dependencias) | Sí, 2026-11-26 |
| Revisión de calidad y seguridad (etapa 10), tras la ronda 1 y el mini-lote de herramientas (D-020) | `main...1b042df` (cambios desde la revisión anterior: `1261549...1b042df`) | **Alto** | `src/inputFilter.ts`, `src/main.ts` (validación de entrada); `package.json`, `package-lock.json`, `stryker.config.json`, `.gitignore`, `.claude/agents/reviewer.md` (dependencias y cadena de entrega). Breakers no se relanzan (82 líneas de corrección); designer C no aplica (sin cambio de pantalla) | Sí, 2026-11-26 |

## Ronda 1 — hallazgos de los breakers (commit `0b8c019`)
Reproducidos por el Manager el 2026-11-26: 14/14 de breaker-code (Vitest) y 14/14 de breaker-user (Playwright WebKit). **Aprobado por el usuario el 2026-11-26**, con las recomendaciones del Manager.

| # | Hallazgo | IDs | Decisión | Por qué | Capa que debió atraparlo |
|---|---|---|---|---|---|
| 1 | Al ir a otra página y volver atrás, el texto reaparece con los 4 conteos en 0 | BRK-U-1 | **Corregir ahora**: al volver, campo vacío y los 4 en 0, como al recargar (D-017) | Conteo falso en pantalla (CA-4); C-010 | architect — "volver atrás" no estaba en las reglas, solo recargar |
| 2 | Tras un rechazo, deshacer/rehacer mete la letra ajena y repite el texto ("casacasacasaç"); un cambio que no termina en el cursor se salta filtro y tope | BRK-U-2, sospecha A de BRK-C | **Corregir ahora** | C-011 dura | ninguna — solo aparece usando la app |
| 3 | Una letra ajena (o una marca sobre una letra escrita) entra si va pegada a U+20E3 o delante de un emoji (Prepend) | BRK-C-1, C-2, C-3, BRK-U-3 | **Corregir ahora** (conservar `1️⃣`, CA-10) | C-011 y C-015 duras; causa única `inputFilter.ts:34` | planner — la regla de §5.2 del plan dejaba entrar completo todo grafema con U+20E3/emoji |
| 4 | La "ſ" (U+017F) entra y cuenta como otro | BRK-C-4, BRK-U-6 | **Corregir ahora** | C-011; bandera `i` en `inputFilter.ts:11` | coder — la regla existía y el TDD no cubrió letras que se pliegan |
| 5 | Pegar sobre una selección algo que empieza igual y trae una letra ajena no reemplaza ("casa", "as" ← "aç" deja "casa") | BRK-C-6, BRK-U-5 | **Corregir ahora** | C-016 dura | coder — ya era idea de ataque conocida (lote 4) |
| 6 | Espacio + tilde combinable pegados juntos entran y cuentan como otro | BRK-U-4, sospecha B de BRK-C | **Corregir ahora** con la regla nueva de D-018: la tilde no entra, el espacio sí | Regla no definida; el usuario la fijó | architect |
| 7 | Dígito o signo con tildes encima entra ("1́" cuenta como otro; "?" con 2 000 tildes tapa la pantalla) | BRK-C-5 | **Corregir ahora** con D-018: "1́" → "1" (número), "?"+tildes → "?" | Regla no definida; protege A-001 | architect |

**Bordes que esperan** (a `VS-001.md` §6): composición del teclado del iPhone a medio escribir (R-3) y arrastrar y soltar desde otra app — no se pueden probar en el simulador; se comprueban a mano en una slice futura.

**Antes del coder (próxima sesión):** actualizar F-001 (CA-7 incluye "volver atrás"; regla de D-018 en C-015) y el plan §5.2 (sin pase libre por U+20E3/emoji), y pasar las reproducciones de los reportes `breaker-user.md` y `breaker-code.md` como pruebas en rojo.
