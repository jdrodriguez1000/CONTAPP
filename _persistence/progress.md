# Progreso del proyecto
**Última actualización:** 2026-11-26 · **Versión del producto:** 0.003.000

> **Reglas del archivo:** gerencial, no acumulativo: se **reemplaza** en cada cierre (historial en git). Máx. **50 líneas**. Estructura fija: Última actualización · Dónde estamos · Última sesión · En curso · Próximos pasos (desde `tasks.md`) · Bloqueos / pendientes del usuario.

## Dónde estamos
- **Fase actual:** VS-001 — Contar en el celular (walking skeleton). **Lotes 1 y 2 de 5 terminados** (P-1 a P-4). Sigue el lote 3 (P-5 números, otros y espacios · P-6 contar mientras se escribe).
- **Rama:** `feature/VS-001-contar-en-el-celular` en `../CONTAPP-VS-001` (worktree), subida a GitHub; último commit `bc098a3`. `main` tiene commits que la rama no tiene (`b5857d6`, `e682bce` y este cierre).
- **Preview de la rama (estable, D-013):** `https://contapp-git-feature-vs-00-588149-jdrodriguez1000-8207s-projects.vercel.app` (ya muestra la pantalla con las 4 fichas en 0) · Producción: `https://contapp-tawny.vercel.app` (vacía hasta fusionar).

## Última sesión
- **2026-11-26 (2.ª):** lote 2 completo. Tester A: `screen.spec.ts` (10, rojo verificado), `captures.spec.ts` (6), `tests/unit/counting.test.ts` (25) → commit en rojo `23e3567`. Coder: P-3 (pantalla, tokens claro/oscuro, campo de 2 a 5 líneas) y P-4 (Vitest 5.0.3 + `countCharacters` de vocales y consonantes), 180 líneas de app. Manager verificó: `check` ok, unitarias 45/45, E2E 11/11, `test:published` 1/1 contra la preview.
- Designer C (lote 2): sin bloqueantes, 4 menores. El usuario aprobó la opción A (D-014) y la corrección de la maqueta; el designer ajustó `design-system.md` y `mockup.html` en `main` (`e682bce`).
- El usuario probó la preview en su iPhone: todo como esperaba; la frase de 100 caracteres ocupa 4 líneas y no se corta → **A-001 confirmado**.
- `COMPLETAR AL DECIDIR` del stack llenados en playbook, project-context, roadmap y skills (`b5857d6`); quedan solo duplicación, código sin uso y mutación del reviewer (D-012) y las señales por regla del dominio.
- Lecciones L-009 a L-014.

## En curso
- Nada. Ningún agente abierto.

## Próximos pasos (desde tasks.md)
1. **Traer `main` a la rama** antes del lote 3 (`git merge main` en `../CONTAPP-VS-001`; el `designer.md` de main y de la rama tienen secciones nuevas al final: conservar las dos). Así los agentes leen las skills y el sistema de diseño al día.
2. **Lote 3:** tester A con `typing.spec.ts` y `captures.spec.ts` (+ estados 2 y 3); pedirle también quitar los dos `@ts-ignore` de `tests/unit/counting.test.ts` (ya sobran). El Manager corre `npm run check` antes del commit en rojo (L-012). Luego coder con P-5 y P-6; E2E afectada: `screen.spec.ts`.
3. Al cerrar el lote 3: Manager corre `check`, `test:unit`, `test:e2e`, sube y prueba la preview; capturas `lote-3/` → designer C. En el lote 4, el designer pide la captura del tope de 5 líneas (hallazgo 3).

## Bloqueos / pendientes del usuario
- Ninguno. Para decidir cuando convenga: agregar `npm run check` a la guarda del tester (L-012, riesgo alto) y si el ícono de inicio (VS-006) se adelanta en el roadmap (el usuario preguntó; se ve al cerrar VS-001).
