# Progreso del proyecto
**Última actualización:** 2026-11-27 · **Versión del producto:** 0.004.000

> **Reglas del archivo:** gerencial, no acumulativo: se **reemplaza** en cada cierre (historial en git). Máx. **50 líneas**. Estructura fija: Última actualización · Dónde estamos · Última sesión · En curso · Próximos pasos (desde `tasks.md`) · Bloqueos / pendientes del usuario.

## Dónde estamos
- **Fase 0 ✓ · VS-001 ✓ · MANT-001 ✓ · VS-002 ▸ (slice 2 de 6): construcción, lotes 1 y 2 de 4 cerrados; lote 3 con pruebas en rojo.** Producción sin cambios: `https://contapp-tawny.vercel.app` (v0.004.000).
- **Rama:** `feature/VS-002-imagenes-ninos` en `../CONTAPP-VS-002` (subida a GitHub; último commit `8788a7c`).
- **Página de avance:** `_project/status.html`, publicada en `https://claude.ai/artifact/GkYgfLAmdVDan5trEmSDhE` (D-019).

## Última sesión
- **2026-11-27 (9.ª): VS-002 etapa 6 y lotes 1 a 3.**
- **Lote 1 (P-1, P-2):** DT-008 (`expectNothingStored`) y DT-009 (comentario) atendidas; color por grupo en número y borde. CI verde en `4e74b73` (127 E2E). Designer: sin bloqueantes.
- **Lote 2 (P-3, P-4):** imagen de cada grupo (máscara SVG en `::before`) y ajuste a menos de 360 px. La CI falló en 9 pruebas de ancho por la letra de Linux; el usuario eligió dos comprobaciones (D-024) y la CI quedó en verde en `c96b277` (207 unitarias, 166 E2E). Designer: sin bloqueantes.
- **Lote 3 (P-5):** el tester escribió 14 pruebas + 1 cambiada (TC-061, pantalla compacta), en rojo en `9ec5015` (15 de 180, verificadas por el Manager).
- Bordes que esperan nuevos (D-025): pantallas de 360 a 369 px y letra real a 320 px. Lecciones L-044 a L-047.

## En curso
- T-003 (VS-002): sin agentes abiertos. La CI de la rama está en **rojo esperado** (commit de pruebas del lote 3).

## Próximos pasos (desde tasks.md)
1. **Coder del lote 3 (P-5)** en `../CONTAPP-VS-002`: pruebas en rojo en `9ec5015`; cierre con `npm run check`, `npm run test:unit`, `npm run test:e2e -- --workers=2` (180/180) y capturas a `evidence/capturas/lote-3` (20/20). Usar `--workers=2` en esta máquina (con 6 procesos hubo tiempos límite una vez).
2. Subir la rama y esperar la CI en verde; luego designer C del lote 3 ∥ tester A del lote 4 (P-6 `published.spec.ts`).
3. Lote 4: P-6 y P-7 (fotos del usuario en su iPhone); después revisión de cierre en **Alta**.
4. **T-004 — VEGU:** en una sesión en la carpeta de VEGU (incluye L-042 a L-047 y L-046 sobre la línea de atribución).

## Bloqueos / pendientes del usuario
- Ninguno que bloquee.
- En el lote 4 (P-7): lista de comprobación en su iPhone con fotos (~15 min); si la prueba publicada ve `vercel.live`, apagar la barra de Vercel en las previews (2 min).
- Para decidir cuando convenga: (a) regla automática contra caracteres invisibles (L-018); (b) si el ícono de inicio (VS-006) se adelanta; (c) slices para DT-001 a DT-018 (un mantenimiento de guardas juntaría DT-002, DT-006, DT-007, DT-012, DT-013, DT-015, DT-016, DT-018; DT-004 también va a mantenimiento); (d) si se crea la slice "Ver bien en otros tamaños" (bordes de VS-002, ahora también 360 a 369 px); (e) dónde se comprueban a mano la composición del teclado y arrastrar y soltar.
- `npm ci` avisó dependencias con avisos de `npm audit`: lo mira el security en la revisión de cierre.
- Glosario `groupImage`/`groupColor` en `project-context`: lo agrega el Manager al cerrar VS-002.
