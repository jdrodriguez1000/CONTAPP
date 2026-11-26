# Progreso del proyecto
**Última actualización:** 2026-11-26 · **Versión del producto:** 0.004.000

> **Reglas del archivo:** gerencial, no acumulativo: se **reemplaza** en cada cierre (historial en git). Máx. **50 líneas**. Estructura fija: Última actualización · Dónde estamos · Última sesión · En curso · Próximos pasos (desde `tasks.md`) · Bloqueos / pendientes del usuario.

## Dónde estamos
- **Fase 0 ✓ · VS-001 ✓ (1 de 6 slices).** Contapp está en producción: `https://contapp-tawny.vercel.app` (v0.004.000, etiqueta `v0.004.000`, fusión `2f41fb6` del PR #1).
- **Siguiente:** VS-002 "Imágenes y diseño para niños" (T-003), todavía sin definir.
- **Página de avance:** `_project/status.html`, publicada en `https://claude.ai/artifact/GkYgfLAmdVDan5trEmSDhE` (D-019).

## Última sesión
- **2026-11-26 (6.ª):** ronda 1 de VS-001: F-001 y plan ajustados (CA-7 con volver atrás, CA-11, TC-043 a TC-049; D-017, D-018). Tester en rojo → coder corrigió los 7 hallazgos (82 líneas) → CI verde.
- Bloqueo del coder resuelto por el usuario: opción B (pegar sobre selección), deshacer limitado como DT-003, letras detrás de emoji fuera.
- Mini-lote D-020: jscpd, knip y Stryker instalados; `stryker.config.json` lo creó el Manager.
- Reviewer (0 bloqueantes, mutación 93,13 %) ∥ security (0 Críticas/Altas). Sin ronda 2: los 2 mutantes "sería bloqueante" no eran defecto (DT-011). Deuda DT-004 a DT-011.
- Verificación del Manager completa; usuario probó 4 casos en el iPhone (evidencia `iphone-manual-ronda1.md`) y aceptó el commit `25baa39`. Fusión, producción comprobada (`test:published` 4/4), v0.004.000.
- Piloto de ubicación (D-019): mapa de 3 líneas en cada mensaje y `status.html`. Lecciones L-027 a L-034.

## En curso
- Nada. Ningún agente abierto.

## Próximos pasos (desde tasks.md)
1. **T-003 — VS-002:** lanzar al architect con la fila de VS-002 de `roadmap.md` (F-002, F-003), las preguntas abiertas del usuario y la deuda propuesta para esta slice (DT-004, DT-008, DT-009).
2. **T-005 — guarda del tester:** agregar `npm run check` (promueve L-012), antes del primer tester de VS-002.
3. **T-004 — VEGU:** en una sesión en la carpeta de VEGU, llevar D-019/L-027 y las lecciones `→ VEGU` (el usuario confirmó que el piloto le sirvió).

## Bloqueos / pendientes del usuario
- Ninguno que bloquee.
- Para decidir cuando convenga: (a) regla automática contra caracteres invisibles en `src/` y `tests/` (L-018); (b) si el ícono de inicio (VS-006) se adelanta; (c) slices donde se atienden DT-001 a DT-011; (d) dónde se comprueban a mano la composición del teclado y arrastrar y soltar (bordes que esperan).
- La carpeta vacía `../CONTAPP-VS-001` la borra el usuario más adelante (Windows la tenía en uso).
