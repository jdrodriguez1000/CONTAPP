# Progreso del proyecto
**Última actualización:** 2026-11-26 · **Versión del producto:** 0.003.000

> **Reglas del archivo:** gerencial, no acumulativo: se **reemplaza** en cada cierre (historial en git). Máx. **50 líneas**. Estructura fija: Última actualización · Dónde estamos · Última sesión · En curso · Próximos pasos (desde `tasks.md`) · Bloqueos / pendientes del usuario.

## Dónde estamos
- **Fase actual:** VS-001 — Contar en el celular (walking skeleton). **Los 5 lotes (P-1 a P-10) terminados.** Revisión de cierre, nivel **Alto** (aprobado): breakers hechos y clasificados; sigue la **ronda 1** del coder con 7 hallazgos a corregir.
- **Rama:** `feature/VS-001-contar-en-el-celular` en `../CONTAPP-VS-001` (worktree), subida; último commit `1261549`. Las carpetas de los breakers ya se borraron.
- **CI:** GitHub Actions en verde (corrida 45856376057: 115 unitarias, 70 E2E, gitleaks). El repositorio ahora es **público** (D-016).
- **Preview de la rama:** `https://contapp-git-feature-vs-00-588149-jdrodriguez1000-8207s-projects.vercel.app` · Producción: `https://contapp-tawny.vercel.app` (vacía hasta fusionar).

## Última sesión
- **2026-11-26 (5.ª):** repositorio público (D-016). Tester A: `published.spec.ts` (TC-001, 002, 024). Rojo contra la preview del lote 2 (`bc098a3`): TC-002 falla en el conteo; verde 4/4 (`8816b4d`). Plan §P-10 corregido (lote 2, no lote 1).
- Coder: `ci.yml` (`5674a5a`). Criterios (a), (b) y (c) de P-9 verificados por el Manager.
- Usuario: lista manual del iPhone 5/5 con fotos (`evidence/iphone-manual.md`, `065c0d7`).
- DT-002 (gitleaks-action@v2 usa Node 20) registrada en `main`.
- breaker-user ∥ breaker-code: 14 + 14 reproducciones, todas reproducidas por el Manager. Clasificación 9c aprobada (`reports/clasificacion-9c.md`): 7 hallazgos "corregir ahora", 1 borde que espera. Decisiones D-017 (volver atrás → vacío) y D-018 (tildes combinables; amplía C-015).
- Lecciones L-021 a L-026.

## En curso
- Nada. Ningún agente abierto.

## Próximos pasos (desde tasks.md)
1. **Antes del coder (Manager, en la carpeta de la rama):** actualizar F-001 (CA-7 con "volver atrás", D-017; regla de D-018 en los casos de C-015) y plan §5.2 (sin pase libre por U+20E3/emoji, L-023), con aprobación del usuario si cambia lo aprobado; luego commit.
2. **Ronda 1 como un lote pequeño:** tester A (pruebas de los hallazgos, a partir de las reproducciones copiadas en `reports/breaker-user.md` y `reports/breaker-code.md`) → coder (hallazgos 1 a 7 de la tabla, `test(P-X)` → `feat(P-X)`) → CI. Nivel Alto (toca `src/inputFilter.ts`, `src/main.ts`).
3. Luego: reviewer (con mutación) ∥ security → designer C solo si cambió pantalla → verificación del Manager → aceptación del usuario en la preview → PR y fusión.

## Bloqueos / pendientes del usuario
- Ninguno que bloquee.
- Para decidir cuando convenga: (a) agregar `npm run check` a la guarda del tester (L-012); (b) regla automática contra caracteres invisibles en `src/` y `tests/` (L-018); (c) si el ícono de inicio (VS-006) se adelanta; (d) slice donde se atiende DT-002; (e) dónde se comprueban a mano la composición del teclado y arrastrar y soltar (borde que espera).
