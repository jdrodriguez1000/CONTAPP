# MANT-001 — nivel de riesgo por entrega

| Entrega | Archivos que lo deciden | Nivel | Revisiones (aprobado por el usuario 2026-11-26) |
|---|---|---|---|
| Ronda 1 (`main...5bbe6ed`) | `.claude/agents/tester.md`, `.claude/hooks/guards.test.mjs` | Alto (cadena de entrega) | security ∥ reviewer; breakers omitidos (sin app que usar; la prueba de la guarda cubre los intentos) |
| Ronda 2 (`5bbe6ed...fcae149`) | los mismos | Alto | security ∥ reviewer |

**Decisión del usuario tras la ronda 2:** fusionar; S1/R2-1 (lista de prohibiciones rodeable, Media, del cambio), R2-3 (ESLint carga configuración en `tests/`, Media, preexistente), los hallazgos 2 y 3 de security y 2, 3 y 4 del reviewer quedan como deuda técnica.

## Métricas
Rondas: 2 · Nivel por entrega: Alto · Alto · Breakers: omitidos · Reviewer bloqueantes: 0 · Security Crítica/Alta: 0 · Mutación: no aplica (sin `src/`) · Debugger: no
