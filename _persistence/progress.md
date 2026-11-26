# Progreso del proyecto
**Última actualización:** 2026-11-25 · **Versión del producto:** 0.002.000

> **Reglas del archivo:** gerencial, no acumulativo: se **reemplaza** en cada cierre (historial en git). Máx. **50 líneas**. Estructura fija: Última actualización · Dónde estamos · Última sesión · En curso · Próximos pasos (desde `tasks.md`) · Bloqueos / pendientes del usuario.

## Dónde estamos
- **Fase actual:** Fase 0 terminada. Sigue la **VS-001 — Contar en el celular** (walking skeleton). Todavía no hay código.

## Última sesión
- **2026-11-25:** T-001 completada con el usuario: producto, perfil del usuario, reglas de conteo C-001 a C-013, supuesto A-001 (100 caracteres), catálogo GRP-001 a GRP-004 y roadmap VS-001 a VS-006 (features F-001 a F-009).
- Repositorio git creado y conectado a GitHub (`jdrodriguez1000/CONTAPP`, rama `main`).

## En curso
- Nada.

## Próximos pasos (desde tasks.md)
1. **Antes de la próxima sesión (usuario):** renombrar la carpeta `PRUEBAPP` → `CONTAPP` con Claude Code y Herdr cerrados, y abrir la sesión en la carpeta nueva. Conviene hacerlo antes de crear ramas en otras carpetas (worktrees).
2. **T-002 — VS-001:** el Manager lee `orchestrator-playbook` y lanza al **architect** para definir la VS-001 (F-001). El usuario pidió explícitamente no lanzarlo sin su visto bueno.
3. Al decidir el stack en la VS-001: agregar `.gitattributes` para fijar los finales de línea (git avisa LF → CRLF en Windows).

## Bloqueos / pendientes del usuario
- Preguntas abiertas para el diseño (en `edge-cases` §2): qué pasa al intentar el carácter 101, y si al pegar un texto con letras de otro idioma se rechaza todo o solo esa letra.
