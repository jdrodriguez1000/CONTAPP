# Progreso del proyecto
**Última actualización:** 2026-11-27 · **Versión del producto:** 0.004.000

> **Reglas del archivo:** gerencial, no acumulativo: se **reemplaza** en cada cierre (historial en git). Máx. **50 líneas**. Estructura fija: Última actualización · Dónde estamos · Última sesión · En curso · Próximos pasos (desde `tasks.md`) · Bloqueos / pendientes del usuario.

## Dónde estamos
- **Fase 0 ✓ · VS-001 ✓ · MANT-001 ✓ · VS-002 ▸ (slice 2 de 6): lotes 1 a 3 cerrados; lote 4 (P-6, P-7) con las pruebas escritas y su rojo verificado.** Producción sin cambios: `https://contapp-tawny.vercel.app` (v0.004.000).
- **Rama:** `feature/VS-002-imagenes-ninos` en `../CONTAPP-VS-002` (subida a GitHub; último commit `fd57232`, solo documentos; último con pruebas `f1ef9be`, CI en verde).
- **Página de avance:** `_project/status.html`, publicada en `https://claude.ai/artifact/GkYgfLAmdVDan5trEmSDhE` (D-019).

## Última sesión
- **2026-11-27 (10.ª): lote 3 y trabajo A del lote 4.**
- **Lote 3 (P-5):** el coder recortó 5 espacios en `src/styles.css` (6 líneas, `feat(P-5)` `9c45554`). CI verde en `e5c18bc` (207 unitarias, 180 E2E, sin secretos). Designer C: sin bloqueantes; a 390 × 427 quedan ≈ 30 px libres bajo las fichas.
- **Lote 4, trabajo A (P-6):** el tester amplió `published.spec.ts` de 4 a 8 pruebas (TC-050, 051, 053, 055) y movió ayudas a `tests/e2e/group-helpers.ts`; commit en rojo `f1ef9be`, CI verde (la CI no corre `published`).
- **Rojo verificado por el Manager** contra la preview de `4e74b73` (lote 1; `b63efbc` no tiene preview): TC-050, 051 y 053 fallan en `image of vowel: exists` (`none`), lo esperado. **TC-055 también falla**: la barra de Vercel de las previews guarda 3 claves en `sessionStorage` (`vc-dt-src`, `vc-mfe-session-cleared`, `__vtkb-hide-key`). Es R-4 del plan: no es la app. Salida en `evidence/manager-published-rojo-lote-4.txt`.
- Lecciones L-048 a L-053. El índice de `lessons.md` pasa de ~40 líneas (52): resumirlo agrupando por tema en una próxima sesión.

## En curso
- T-003 (VS-002): sin agentes abiertos (paneles cerrados).

## Próximos pasos (desde tasks.md)
1. **El usuario apaga la barra de Vercel en las previews** (vercel.com → proyecto `contapp` → *Settings* → *Vercel Toolbar* → *Preview: Off*; el Manager guía, 2 min).
2. El Manager corre el verde: `E2E_BASE_URL=<preview de fd57232 o posterior> npm run test:published` → **8/8** y 6 capturas en `evidence/published/` (dirección con `vercel ls contapp -m githubCommitSha=<sha completo>`). Si TC-055 sigue fallando con la barra apagada, volver al tester. `_project/slices/VS-001/evidence/` sin cambios.
3. **P-7:** el usuario hace la lista del iPhone con fotos (la dejó el tester en `reports/tester.md`, "# Lote 4"; TC-062 en oscuro y "123" juntos). El Manager anota en `evidence/iphone-manual.md`.
4. Revisión de cierre de VS-002 en **Alta** (breakers, reviewer, security, designer).
5. **T-004 — VEGU:** en una sesión en la carpeta de VEGU.

## Bloqueos / pendientes del usuario
- **Apagar la barra de Vercel en las previews** (paso 1): bloquea el verde de P-6.
- Lista del iPhone con fotos (~15 min).
- Para decidir cuando convenga: (a) regla automática contra caracteres invisibles (L-018); (b) si el ícono de inicio (VS-006) se adelanta; (c) slices para DT-001 a DT-018 (un mantenimiento de guardas juntaría DT-002, DT-006, DT-007, DT-012, DT-013, DT-015, DT-016, DT-018; DT-004 también va a mantenimiento); (d) si se crea la slice "Ver bien en otros tamaños" (bordes de VS-002: 360 a 369 px y letra real a 320 px); (e) dónde se comprueban a mano la composición del teclado y arrastrar y soltar.
- `npm ci` avisó dependencias con avisos de `npm audit`: lo mira el security en la revisión de cierre.
- Glosario `groupImage`/`groupColor` en `project-context`: lo agrega el Manager al cerrar VS-002.
