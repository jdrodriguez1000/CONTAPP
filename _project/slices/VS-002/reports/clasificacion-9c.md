# Clasificación de hallazgos (etapa 9c) — VS-002

## Nivel de riesgo por entrega
| Entrega | Base del diff | Nivel | Archivos que lo deciden | Aprobado por el usuario |
|---|---|---|---|---|
| Revisión inicial (ronda 1) | `main...25ccf38` | **Alto** | `src/main.ts` (comentario dentro de `filterChange`, que llama a `applyInput`: regla 1 de `risk-levels.md`); además `index.html`, `tests/e2e/**` (Normal) y `src/styles.css` (Bajo). Designer C no aplica al cierre: `git diff e5c18bc..25ccf38 -- src index.html` vacío (sin cambio de pantalla desde su revisión del lote 3) | Sí, al aprobar el plan (2026-11-27): no se baja aunque `main.ts` solo cambie un comentario |

## Ronda 1 — hallazgos de los breakers (commit `25ccf38`)
Reproducidos por el Manager el 2026-11-27: BRK-C-1 (2 pruebas) y BRK-C-2 (1 prueba) en rojo con `npx vitest run` en la carpeta del breaker-code; el CSS construido trae `@media (width<=359px)` dos veces y la fuente `(max-width: 359px)` (`src/styles.css:51`, `:186`). breaker-user: 0 hallazgos. **Aprobado por el usuario el 2026-11-27**, con las recomendaciones del Manager.

| # | Hallazgo | IDs | Decisión | Por qué | Capa que debió atraparlo |
|---|---|---|---|---|---|
| 1 | El ajuste de 320 px se publica como `@media (width<=359px)` (Vite 8 / Lightning CSS, objetivo iOS 16.4); un Safari anterior a 16.4 salta el bloque y a 320 px queda 1 px de desplazamiento horizontal | BRK-C-1 | **Descartar**: la app se soporta desde **iOS 16.4** (D-026, se registra en el cierre) | Solo afecta al iPhone SE de 1.ª gen. (iOS 15.8 como máximo); el iPhone del usuario tiene iOS reciente; corregirlo exige configuración de la cadena de entrega (Alto) | architect — ninguna regla decía desde qué iOS funciona la app |
| 2 | El comentario de DT-009 (`src/main.ts:61-62`) no menciona que el NFC también cambia un carácter de una pieza por otro (signo Kelvin U+212A → K) | BRK-C-2 | **Corregir ahora** (ronda 2, solo el comentario) | DT-009 era justamente dejar el comentario exacto | planner — el plan (P-1) dictó el texto exacto |

**Observaciones del breaker-user:**
- iPhone de pantalla más baja (375 × 667 / 812) con el teclado abierto → **borde que espera** (agregado a `VS-002.md` §6, decisión del usuario 2026-11-27).
- Girar y volver deja texto oculto dentro del campo → ya es el borde "celular girado"; sin acción.
- Doble toque deja el número resaltado, sin cambiar conteos → **descartar** (ningún criterio; no es defecto).

## Ronda 2 — corrección de BRK-C-2
- **Nivel:** Alto por archivo (`src/main.ts`, comentario dentro de `filterChange`). Breakers no se repiten (regla 4: la corrección no agrega comportamiento). Reviewer y security corren en la etapa 10 sobre toda la slice, después de la ronda.
- **Respaldo (PI-5, criterio escrito antes):** (a) `git diff 25ccf38..HEAD -- src` muestra solo líneas de comentario de `src/main.ts`; (b) el comentario nombra los tres casos: algo no entró, una letra en dos piezas se une y un signo como Kelvin pasa a su letra; (c) `npm run check` y `npm run test:unit` en verde; (d) CI en verde en el commit.

**Resultado de la ronda 2:** commit `944c1a2` (solo comentario, 3 líneas); el Manager verificó (a) a (c) — `npm run check` ok y 207/207 unitarias —, y (d) CI en verde en `cf8bdcf`.

## Etapa 10 — reviewer ∥ security (HEAD `cf8bdcf`)
Decidido por el usuario el 2026-11-27. **Sin ronda 3.**
- **Security:** 0 Críticas, 0 Altas, 0 Medias, 0 Bajas del cambio. gitleaks limpio (historial y carpeta). `npm audit`: 12 moderadas solo de desarrollo (`--omit=dev` = 0), preexistentes en DT-001 y DT-005. Nota para DT-004: la CSP futura debe permitir `img-src 'self' data:` o las 4 imágenes desaparecen.
- **Reviewer:** 1 Bloqueante del cambio — `export` sin uso en `numberRow` (`tests/e2e/field-helpers.ts:58`) y `Key` (`tests/e2e/group-helpers.ts:8`) → el usuario lo **acepta como deuda** (no abre ronda 3; la regla del límite de rondas pide su decisión). Hallazgo 2 (TC-055 y ayudas duplicadas entre pruebas local y publicada) → DT nueva junto con DT-017. Hallazgo 3 → actualizar DT-017 (su "junto con DT-008" ya pasó). Se registran en `_project/tech-debt.md` en `main` al cerrar la slice.
- **Mutación:** no se corrió (la slice no cambia `src/counting.ts` ni `src/inputFilter.ts`, D-020).
- **Designer C:** no aplica al cierre (sin cambio de pantalla desde el lote 3).
