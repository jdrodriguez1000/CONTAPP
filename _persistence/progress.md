# Progreso del proyecto
**Última actualización:** 2026-11-27 · **Versión del producto:** 0.005.000

> **Reglas del archivo:** gerencial, no acumulativo: se **reemplaza** en cada cierre (historial en git). Máx. **50 líneas**. Estructura fija: Última actualización · Dónde estamos · Última sesión · En curso · Próximos pasos (desde `tasks.md`) · Bloqueos / pendientes del usuario.

## Dónde estamos
- **Fase 0 ✓ · VS-001 ✓ · MANT-001 ✓ · VS-002 ✓ · VS-003 ○ por empezar (slice 3 de 6).** Producción: `https://contapp-tawny.vercel.app` (v0.005.000, con dibujos y colores por grupo).
- **Rama:** solo `main`; la rama y la carpeta de VS-002 se borran al cerrar esta sesión. Página de avance: `_project/status.html`, publicada en `https://claude.ai/artifact/GkYgfLAmdVDan5trEmSDhE` (D-019).

## Última sesión
- **2026-11-27 (11.ª): VS-002 terminada y en producción.**
- **Lote 4:** el usuario apagó la barra de Vercel en las previews; hizo falta volver a publicar la preview (L-054). `test:published` 8/8. P-7 en el iPhone pasa: teclado de letras y "123", claro y oscuro, dibujos reconocibles sin nombres (`evidence/iphone-manual.md`, 9 fotos).
- **Revisión de cierre (Alta):** breaker-user 0 hallazgos; breaker-code 2: BRK-C-1 descartado (**D-026: soporte desde iOS 16.4**), BRK-C-2 corregido en la ronda 2 (comentario, `944c1a2`). Security limpio. Reviewer: 1 bloqueante (`export` sin uso en pruebas) que el usuario aceptó como deuda (DT-019), más DT-020 y DT-017 actualizada. Borde nuevo: iPhone de pantalla más baja.
- **Aceptación** del commit `ed9c5e9`; PR #3 fusionado (`297560c`); producción 8/8. Métricas en `VS-002/reports/clasificacion-9c.md` (2 rondas, ≈ 4 h, E2E 180 en ≈ 1,1 min).
- Lecciones L-054 a L-060. Glosario: imagen y color del grupo en `project-context`.

## En curso
- Nada abierto: sin agentes ni paneles.

## Próximos pasos (desde tasks.md)
1. **T-006 — VS-003 "Ver cada letra en su grupo"** (F-004): el Manager lee el playbook y lanza al architect (etapa 1) en `main` con la fila del roadmap y el borde "cambio de modo con la app abierta".
2. Antes o durante: el usuario decide si se crea la slice "Ver bien en otros tamaños" con los bordes de VS-002 §6.
3. **T-004 — VEGU:** en una sesión en la carpeta de VEGU (suma L-055 a L-058 y L-060).
4. Resumir el índice de `lessons.md` (59 líneas, máx. ~40) agrupando por tema.

## Bloqueos / pendientes del usuario
- **A-001 por revisar** (venció: "al ver las fichas con imagen de VS-002"): una foto en **producción** con el teclado cerrado y la frase de 100 `El niño Mateo tiene 7 años y lee cuentos largos con su abuela. ¡Hoy contó 25 ovejas antes de dormir!` (la foto de P-7 se tomó antes, sin imágenes).
- Para decidir cuando convenga: (a) regla automática contra caracteres invisibles (L-018); (b) si el ícono de inicio (VS-006) se adelanta; (c) slices para DT-001 a DT-020 (un mantenimiento de guardas juntaría DT-002, DT-006, DT-007, DT-012, DT-013, DT-015, DT-016, DT-018; DT-004 con la nota de `img-src data:`; DT-017, DT-019 y DT-020 al tocar las pruebas); (d) slice "Ver bien en otros tamaños"; (e) dónde se comprueban a mano la composición del teclado y arrastrar y soltar.
