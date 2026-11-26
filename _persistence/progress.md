# Progreso del proyecto
**Última actualización:** 2026-11-26 · **Versión del producto:** 0.003.000

> **Reglas del archivo:** gerencial, no acumulativo: se **reemplaza** en cada cierre (historial en git). Máx. **50 líneas**. Estructura fija: Última actualización · Dónde estamos · Última sesión · En curso · Próximos pasos (desde `tasks.md`) · Bloqueos / pendientes del usuario.

## Dónde estamos
- **Fase actual:** VS-001 — Contar en el celular (walking skeleton). **Lote 1 de 5 terminado** (P-1, P-2). Sigue el lote 2 (P-3, P-4).
- **Rama:** `feature/VS-001-contar-en-el-celular` en `../CONTAPP-VS-001` (worktree), subida a GitHub; último commit `f633d79`.
- **Preview de la rama (estable, D-013):** `https://contapp-git-feature-vs-00-588149-jdrodriguez1000-8207s-projects.vercel.app` · Producción: `https://contapp-tawny.vercel.app` (vacía hasta fusionar).

## Última sesión
- **2026-11-26:** el usuario aprobó las guardas de los agentes y la opción B de las previews (D-013). Tester escribió `skeleton.spec.ts` y `published.spec.ts` (`e83804a`). Coder: P-1 (rojo "título vacío" → verde) y `chore(P-2)`; versiones del plan sin respaldos. Manager verificó (`npm run check` ok, `test:e2e` 1/1), rojo de P-2 contra producción (404) y verde contra la preview tras apagar Vercel Authentication. Captura del iPhone en `evidence/p2-iphone.jpg`.
- DT-001 (avisos moderados de `npm audit` en eslint/typescript-eslint, solo desarrollo) registrada en `main`; se atiende con la revisión de security.
- Lecciones L-006 a L-008.

## En curso
- Nada. Ningún agente abierto.

## Próximos pasos (desde tasks.md)
1. **Lote 2:** lanzar al **tester** (trabajo A) en `../CONTAPP-VS-001`: `screen.spec.ts` y `captures.spec.ts` (estado 1 claro/oscuro, 320 × 568 y crecimiento del campo). Commit en rojo y luego **coder** con P-3 (pantalla) y P-4 (Vitest + vocales/consonantes).
2. Al cerrar el lote 2: capturas a `evidence/capturas/lote-2/` → **designer** (trabajo C). Antes de subir, el Manager corre `npm run check`, `npm run test:unit` y `npm run test:e2e` (no hay CI hasta el lote 5); luego `curl -sI` + `test:published` contra la preview.
3. Llenar los `COMPLETAR AL DECIDIR` del playbook y de `project-context` con el plan §8 (pendiente desde la sesión anterior).

## Bloqueos / pendientes del usuario
- Ninguno. A-001 se revisa "al ver la primera pantalla en el celular" (la pantalla real llega en el lote 2).
