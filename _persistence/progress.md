# Progreso del proyecto
**Última actualización:** 2026-11-27 · **Versión del producto:** 0.004.000

> **Reglas del archivo:** gerencial, no acumulativo: se **reemplaza** en cada cierre (historial en git). Máx. **50 líneas**. Estructura fija: Última actualización · Dónde estamos · Última sesión · En curso · Próximos pasos (desde `tasks.md`) · Bloqueos / pendientes del usuario.

## Dónde estamos
- **Fase 0 ✓ · VS-001 ✓ · MANT-001 ✓ · VS-002 ▸ (slice 2 de 6): definida, diseñada y planeada.** Producción sin cambios: `https://contapp-tawny.vercel.app` (v0.004.000).
- **Siguiente:** etapa 6 del playbook (rama y carpeta de VS-002) y lote 1.
- **Página de avance:** `_project/status.html`, publicada en `https://claude.ai/artifact/GkYgfLAmdVDan5trEmSDhE` (D-019).

## Última sesión
- **2026-11-27 (8.ª): VS-002 etapas 1 a 5, todas aprobadas por el usuario.**
- **Alcance (D-021):** F-002 + F-003; entra el teclado: 4 grupos a la vista con hasta 2 líneas y 50 caracteres (mandan las 2 líneas); entran DT-008 y DT-009; fuera DT-004, DT-017, el total y otros tamaños (bordes que esperan); sin botones. Esbozo de 8 pasos → 7 (se quitó "textos").
- **Diseño (D-022):** imágenes opción B (boca que canta, rompecabezas, mano que cuenta, carita feliz) al lado del número; colores juego 1 (sirven también como letra, 4,5:1); letra del iPhone. Catálogo GRP-001 a GRP-004 con su imagen. Maquetas verificadas por el Manager en WebKit.
- **Plan (D-023):** 7 pasos en 4 lotes (~65 líneas de app, sin dependencias); imagen con `::before` + máscara SVG en el CSS; E2E aproximada del teclado (≤ 417 px). **Revisión de cierre en Alta** (el usuario no la baja).
- Commits `d5c3043` (definición) y `7804cf2` (DoR) en `main`; el plan va en el commit de cierre. Lecciones L-040 a L-043. Roadmap: VS-001 Terminada, VS-002 Definida.

## En curso
- T-003 (VS-002), sin agentes abiertos. El pane del planner se cierra en este cierre.

## Próximos pasos (desde tasks.md)
1. **T-003 — VS-002, etapa 6:** `git worktree add ../CONTAPP-VS-002 -b feature/VS-002-imagenes-ninos main`, `npm ci`, `npx playwright install webkit`.
2. **Lote 1 (P-1 deuda DT-008/DT-009, P-2 colores):** tester trabajo A (con capturas del lote) → commit en rojo → coder. En ese trabajo A, guardar como evidencia que el `npm run check` del tester corre en vivo.
3. **T-004 — VEGU:** en una sesión en la carpeta de VEGU (incluye L-040 a L-043 marcadas `→ VEGU` según corresponda).

## Bloqueos / pendientes del usuario
- Ninguno que bloquee.
- En el lote 4 (P-7): lista de comprobación en su iPhone con fotos (~15 min); si la prueba publicada ve `vercel.live`, apagar la barra de Vercel en las previews (2 min).
- Para decidir cuando convenga: (a) regla automática contra caracteres invisibles (L-018); (b) si el ícono de inicio (VS-006) se adelanta; (c) slices para DT-001 a DT-018 (un mantenimiento de guardas juntaría DT-002, DT-006, DT-007, DT-012, DT-013, DT-015, DT-016, DT-018; DT-004 también va a mantenimiento); (d) si se crea la slice "Ver bien en otros tamaños" (bordes de VS-002); (e) dónde se comprueban a mano la composición del teclado y arrastrar y soltar.
- Glosario `groupImage`/`groupColor` en `project-context`: lo agrega el Manager al cerrar VS-002.
