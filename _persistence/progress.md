# Progreso del proyecto
**Última actualización:** 2026-11-26 · **Versión del producto:** 0.003.000

> **Reglas del archivo:** gerencial, no acumulativo: se **reemplaza** en cada cierre (historial en git). Máx. **50 líneas**. Estructura fija: Última actualización · Dónde estamos · Última sesión · En curso · Próximos pasos (desde `tasks.md`) · Bloqueos / pendientes del usuario.

## Dónde estamos
- **Fase actual:** VS-001 — Contar en el celular (walking skeleton). **Lotes 1, 2 y 3 de 5 terminados** (P-1 a P-6): al escribir, las 4 fichas cambian con cada letra. Sigue el lote 4 (P-7 letras de otros idiomas no entran · P-8 tope de 100).
- **Rama:** `feature/VS-001-contar-en-el-celular` en `../CONTAPP-VS-001` (worktree), subida a GitHub; último commit `47cbf06`. `main` solo tiene de más este cierre de sesión.
- **Preview de la rama (estable, D-013):** `https://contapp-git-feature-vs-00-588149-jdrodriguez1000-8207s-projects.vercel.app` (ya cuenta los 4 grupos) · Producción: `https://contapp-tawny.vercel.app` (vacía hasta fusionar).

## Última sesión
- **2026-11-26 (3.ª):** `main` traído a la rama (`e763f80`; conflicto en `designer.md` resuelto conservando las dos secciones).
- Tester A: `typing.spec.ts` (7: 4 rojas, 3 de control) + estados 2 y 3 en `captures.spec.ts`; quitó los `@ts-ignore`. Manager corrió `check` (L-012) → commit en rojo `854bb27`.
- Coder: P-5 (`test` `5662fdb` → `feat` `0249f80`, conteo por grafema de números, otros y sin espacios) y P-6 (`feat` `a8132ab`, el campo llama a `showCounts`). 29 líneas de app.
- Manager verificó: `check` ok, unitarias 65/65, E2E 18/18, gitleaks limpio, preview publicada y `test:published` 1/1.
- Designer C (lote 3): sin bloqueantes, 2 menores que solo el iPhone confirma. El usuario probó: conteo bien; **con el teclado abierto la 2.ª fila de fichas queda cortada** (foto en `evidence/lote3-iphone-estado2-teclado.jpg`); foco visible en modo claro.
- Usuario decidió dejar el teclado para VS-002 (D-015); designer corrigió F-001 §5.5 en la rama.
- Lecciones L-015 a L-017.

## En curso
- Nada. Ningún agente abierto.

## Próximos pasos (desde tasks.md)
1. **Lote 4:** tester A con `foreign-letters.spec.ts`, `max-length.spec.ts` y `captures.spec.ts` (+ estado 4, con la captura del tope de 5 líneas que pidió el designer en el lote 2). El Manager corre `npm run check` antes del commit en rojo (L-012). Luego coder con P-7 (filtro) y P-8 (tope de 100); E2E afectadas: `screen.spec.ts` y `typing.spec.ts`.
2. Al cerrar el lote 4: Manager corre `check`, `test:unit`, `test:e2e`, sube y prueba la preview; capturas `lote-4/` → designer C. Pedir al usuario en una sola lista (L-017) lo que solo el iPhone confirma.
3. Lote 5 (P-9 CI, P-10 punta a punta) y luego revisiones de cierre de la slice (riesgo alto).
- Agentes sobre documentos de la slice: lanzarlos en la carpeta de la rama (L-016).

## Bloqueos / pendientes del usuario
- Ninguno que bloquee. Pendiente menor: ver en el iPhone el anillo de foco en **modo oscuro** (debe ser amarillo).
- Para decidir cuando convenga: agregar `npm run check` a la guarda del tester (L-012, riesgo alto) y si el ícono de inicio (VS-006) se adelanta en el roadmap (se ve al cerrar VS-001).
