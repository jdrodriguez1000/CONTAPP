# Progreso del proyecto
**Última actualización:** 2026-11-26 · **Versión del producto:** 0.003.000

> **Reglas del archivo:** gerencial, no acumulativo: se **reemplaza** en cada cierre (historial en git). Máx. **50 líneas**. Estructura fija: Última actualización · Dónde estamos · Última sesión · En curso · Próximos pasos (desde `tasks.md`) · Bloqueos / pendientes del usuario.

## Dónde estamos
- **Fase actual:** VS-001 — Contar en el celular (walking skeleton). **Lotes 1 a 4 de 5 terminados** (P-1 a P-8): cuenta mientras se escribe, las letras de otros idiomas no entran y el carácter 101 se ignora, sin avisos. Sigue el lote 5 (P-9 CI · P-10 punta a punta).
- **Rama:** `feature/VS-001-contar-en-el-celular` en `../CONTAPP-VS-001` (worktree), subida a GitHub; último commit `6f14c54`. `main` solo tiene de más este cierre de sesión.
- **Preview de la rama (estable, D-013):** `https://contapp-git-feature-vs-00-588149-jdrodriguez1000-8207s-projects.vercel.app` (código del commit `975b26d`; lo posterior es solo documentos) · Producción: `https://contapp-tawny.vercel.app` (vacía hasta fusionar).

## Última sesión
- **2026-11-26 (4.ª):** usuario confirmó el foco amarillo en modo oscuro (pendiente cerrado).
- Tester A: `foreign-letters.spec.ts` (32), `max-length.spec.ts` (20), `field-helpers.ts`, `captures.spec.ts` (+ estado 4 y tope de 5 líneas). Manager: `check` ok, 43 rojas / 9 control → commit en rojo `8c63602`.
- Usuario decidió: un rechazo sobre una selección deja el cursor donde empezaba lo nuevo, sin selección (plan §5.1, `3782e9d`).
- Coder: P-7 (`b897eff` → `0552e17`) y P-8 (`4e94643` → `eaa6459`); 102 líneas de app (`src/inputFilter.ts`, `src/main.ts`).
- Manager verificó: `check` ok, unitarias 115/115, E2E 70/70, gitleaks limpio, preview publicada con el código nuevo y `test:published` 1/1.
- Designer C (lote 4): sin bloqueantes; cerró el hallazgo 3 del lote 2 (tope de 5 líneas). Usuario probó en el iPhone toda la lista: funciona (sin fotos, `evidence/lote4-iphone.md`).
- Lecciones L-018 a L-020.

## En curso
- Nada. Ningún agente abierto.

## Próximos pasos (desde tasks.md)
1. **Lote 5:** P-9 (CI en GitHub Actions, criterio escrito antes en plan §P-9: hoy `gh run list` no muestra corridas) y P-10 (`published.spec.ts` contra la preview del lote 1 debe fallar y contra la del commit a aceptar, pasar). Riesgo alto (cadena de entrega).
2. Revisiones de cierre de la slice según el nivel (alto): breaker-user ∥ breaker-code → clasificación 9c → reviewer (con mutación) ∥ security → designer C solo lo cambiado → verificación del Manager → aceptación del usuario en la preview → PR y fusión.
3. **Ideas de ataque ya conocidas para los breakers** (del coder, lote 4): pegar sobre una selección algo que empieza igual ("casa", seleccionar "as", pegar "aç" deja "casa"); una letra ajena con `U+20E3` pegado entra; espacio + tilde combinable juntos entran; cambios que no terminan en el cursor (deshacer, arrastrar).
- Agentes sobre documentos de la slice: lanzarlos en la carpeta de la rama (L-016).

## Bloqueos / pendientes del usuario
- Ninguno que bloquee.
- Para decidir cuando convenga: (a) agregar `npm run check` a la guarda del tester (L-012, riesgo alto); (b) regla automática contra caracteres invisibles en `src/` y `tests/`, porque L-009 se repitió (L-018); (c) si el ícono de inicio (VS-006) se adelanta en el roadmap (se ve al cerrar VS-001).
