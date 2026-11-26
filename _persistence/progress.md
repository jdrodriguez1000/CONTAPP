# Progreso del proyecto
**Última actualización:** 2026-11-26 · **Versión del producto:** 0.003.000

> **Reglas del archivo:** gerencial, no acumulativo: se **reemplaza** en cada cierre (historial en git). Máx. **50 líneas**. Estructura fija: Última actualización · Dónde estamos · Última sesión · En curso · Próximos pasos (desde `tasks.md`) · Bloqueos / pendientes del usuario.

## Dónde estamos
- **Fase actual:** VS-001 — Contar en el celular (walking skeleton). Definición, diseño y plan **aprobados**. Todavía no hay código ni rama.

## Última sesión
- **2026-11-25/26:** architect definió VS-001 y F-001 (42 TC, esbozo de 10 pasos aprobado). Designer: propuestas A, B, C y C2; el usuario eligió **C2 "Pizarra con fichas"** (D-010) y aprobó el diseño de F-001 y `_project/design-system.md`. Stack D-011 (TypeScript + Vite, Vitest, Playwright WebKit, GitHub Actions, Vercel). Planner: plan en 5 lotes, aprobado (D-012).
- Decisiones D-006 a D-012; reglas C-014 a C-016; A-001 ampliado; F-005 retirada.
- Guardas de los agentes (`.claude/agents/*.md`) llenadas con carpetas y comandos del plan §8.3 (commit propio, entrega de riesgo Alto (7) que el usuario debe aprobar).

## En curso
- Nada. Ningún agente abierto.

## Próximos pasos (desde tasks.md)
1. **Usuario:** aprobar el cambio de las guardas de los agentes (commit "chore: guardas de agentes…").
2. **Usuario:** responder si las previews de Vercel piden iniciar sesión (recomendado: apagar la protección; plan, pregunta 1). Se necesita en el lote 1 (P-2).
3. **Manager (etapa 6):** crear la rama `feature/VS-001-contar-en-el-celular` en `../CONTAPP-VS-001` (worktree) y lanzar al **tester** (trabajo A del lote 1), luego al coder.
4. Llenar los `COMPLETAR AL DECIDIR` restantes del playbook y de project-context con el plan §8 (comandos, rutas por riesgo, preview, PR).

## Bloqueos / pendientes del usuario
- Pregunta 1 del plan: protección de las previews de Vercel.
