# Progreso del proyecto
**Última actualización:** 2026-11-26 · **Versión del producto:** 0.004.000

> **Reglas del archivo:** gerencial, no acumulativo: se **reemplaza** en cada cierre (historial en git). Máx. **50 líneas**. Estructura fija: Última actualización · Dónde estamos · Última sesión · En curso · Próximos pasos (desde `tasks.md`) · Bloqueos / pendientes del usuario.

## Dónde estamos
- **Fase 0 ✓ · VS-001 ✓ (1 de 6 slices) · MANT-001 ✓.** Contapp en producción: `https://contapp-tawny.vercel.app` (v0.004.000; MANT-001 no cambió el producto).
- **Siguiente:** VS-002 "Imágenes y diseño para niños" (T-003), todavía sin definir.
- **Página de avance:** `_project/status.html`, publicada en `https://claude.ai/artifact/GkYgfLAmdVDan5trEmSDhE` (D-019).

## Última sesión
- **2026-11-26 (7.ª): MANT-001 = T-005.** El tester ya puede correr `npm run check` (promueve L-012). Prohibidos `--fix`, `-o`, `--output-file`, `-c`, `--config`, `--cache`, `--cache-location`, `-f`, `--format`, `--prefix`. Prueba en `.claude/hooks/guards.test.mjs` que lee la guarda real (8/8).
- Nivel Alto (cadena de entrega); breakers omitidos con aprobación del usuario. Security ∥ reviewer en 2 rondas: 0 Críticas/Altas, 0 bloqueantes.
- Security mostró que la lista de prohibidos se puede rodear (abreviaturas de npm, `--script-shell`…). El usuario eligió fusionar y dejarlo como deuda: DT-012 (arreglo de raíz: marca de comando exacto en la guarda). Deuda nueva DT-012 a DT-018.
- Aceptación del usuario del commit `e6b3ef3`; PR #2 fusionado (`ece16ca`); CI verde (corridas 45892281959, 45892311406). Rama y carpeta del lote borradas. Lecciones L-035 a L-039.

## En curso
- Nada. Ningún agente abierto.

## Próximos pasos (desde tasks.md)
1. **T-003 — VS-002:** lanzar al architect con la fila de VS-002 de `roadmap.md` (F-002, F-003), las preguntas abiertas del usuario y la deuda propuesta (DT-004, DT-008, DT-009). En el primer trabajo A del tester, guardar como evidencia que su `npm run check` corre en vivo.
2. **T-004 — VEGU:** en una sesión en la carpeta de VEGU, llevar D-019/L-027 y las lecciones `→ VEGU` (incluye L-035 a L-039 y DT-014).

## Bloqueos / pendientes del usuario
- Ninguno que bloquee.
- Para decidir cuando convenga: (a) regla automática contra caracteres invisibles en `src/` y `tests/` (L-018); (b) si el ícono de inicio (VS-006) se adelanta; (c) slices donde se atienden DT-001 a DT-018; un próximo mantenimiento de guardas y cadena de entrega juntaría DT-002, DT-006, DT-007, DT-012, DT-013, DT-015, DT-016, DT-018; (d) dónde se comprueban a mano la composición del teclado y arrastrar y soltar (bordes que esperan).
- La carpeta vacía `../CONTAPP-VS-001` la borra el usuario más adelante (Windows la tenía en uso).
