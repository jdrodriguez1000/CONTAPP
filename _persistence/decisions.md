# Decisiones del proyecto
**Última actualización:** 2026-11-25
**Último ID usado:** D-005

> **Reglas del archivo:**
> - Dos capas: (1) *Índice de decisiones vigentes*, una línea `D-XXX — decisión`, máx. ~30 líneas, se lee al inicio; (2) *Registro completo*, se consulta por demanda, siempre antes que el resto de la memoria fría.
> - Formato del registro: `### D-XXX — fecha — título` + `Decisión` · `Razón` · `Alternativas descartadas` · `Estado` (`Vigente` / `Reemplazada por D-YYY (fecha)`) · `Relacionada con`.
> - **Solo se agrega.** Única edición permitida: el campo `Estado`. Al reemplazar una decisión, sale del índice y entra la nueva.
> - **El agente propone durante la sesión y registra en el cierre lo no objetado, sin volver a preguntar.** Solo decisiones con impacto (alcance, modelo, metodología, herramientas, reglas de trabajo). Los IDs nunca se reutilizan.
> - Si el índice pasa de ~30 líneas, se resume agrupando decisiones del mismo tema en una línea.

## Índice de decisiones vigentes (memoria caliente — leer al inicio)
- D-001 — Código en inglés; texto de pantalla en español de Colombia (C-013), con glosario en `project-context`
- D-002 — Roadmap: VS-001 a VS-006 con features F-001 a F-009; descartados sonidos, juegos y otros idiomas de pantalla
- D-003 — Se usan todos los agentes de VEGU, lanzados en panes de Herdr
- D-004 — Repositorio en GitHub `jdrodriguez1000/CONTAPP`, rama principal `main`
- D-005 — En VS-001 una letra de otro idioma simplemente no entra al texto, sin aviso; el aviso llega en VS-004 (F-006)

## Registro completo (memoria fría — consultar por demanda)

### D-001 — 2026-11-25 — Idioma del código
- **Decisión:** el código (archivos, variables, funciones, pruebas) va en inglés; el texto que se ve en pantalla, en español de Colombia. El glosario de `project-context` relaciona cada término con su nombre en código.
- **Razón:** las herramientas, librerías y ejemplos están en inglés; el glosario evita que el usuario se pierda.
- **Alternativas descartadas:** código en español (mezcla constante con nombres de librerías en inglés).
- **Estado:** Vigente
- **Relacionada con:** C-013

### D-002 — 2026-11-25 — Roadmap de vertical slices
- **Decisión:** VS-001 Contar en el celular (F-001) · VS-002 Imágenes y diseño para niños (F-002, F-003) · VS-003 Ver cada letra en su grupo (F-004) · VS-004 Avisos amables (F-005, F-006) · VS-005 Borrar y empezar de nuevo (F-007) · VS-006 Instalar y usar sin internet (F-008, F-009). Se descartan sonidos, juegos o ejercicios y otros idiomas de pantalla.
- **Razón:** cada slice deja algo usable el mismo día; VS-001 a VS-003 llevan cerca de la versión de uso real con los niños.
- **Alternativas descartadas:** sonidos, juegos y otro idioma de pantalla (el usuario no los quiere).
- **Estado:** Vigente
- **Relacionada con:** `_project/roadmap.md`, C-009

### D-003 — 2026-11-25 — Agentes y Herdr
- **Decisión:** se usan todos los agentes de VEGU; las revisiones de cada entrega las decide su nivel de riesgo. Los agentes se lanzan en panes de Herdr.
- **Razón:** la app no guarda datos ni maneja cuentas, así que casi todo será riesgo bajo o normal y las revisiones pesadas correrán poco; Herdr ya está instalado.
- **Alternativas descartadas:** quitar breaker-code o security (se pierde la red de seguridad cuando una entrega sí sea de riesgo alto).
- **Estado:** Vigente
- **Relacionada con:** `.claude/rules/risk-levels.md`

### D-004 — 2026-11-25 — Repositorio remoto
- **Decisión:** el repositorio vive en GitHub, `https://github.com/jdrodriguez1000/CONTAPP.git`, rama principal `main`. Las ramas de cada slice y la forma de fusionar se deciden con el stack en la VS-001.
- **Razón:** el usuario ya creó el repositorio; `gh` está autenticado.
- **Alternativas descartadas:** ninguna planteada.
- **Estado:** Vigente
- **Relacionada con:** `engineering-proyecto.md` (equivalencia "PR a `main`")

### D-005 — 2026-11-25 — Letras de otros idiomas antes de VS-004
- **Decisión:** desde VS-001 la app cumple C-011: una letra o acento de otro idioma no entra al texto ni cambia el conteo, sin mostrar aviso. El aviso amable se construye en VS-004 (F-006).
- **Razón:** C-011 es dura y debe cumplirse desde la primera slice; el aviso es una mejora que puede esperar.
- **Alternativas descartadas:** construir el aviso ya en VS-001 (agranda la walking skeleton).
- **Estado:** Vigente
- **Relacionada con:** C-011, VS-004
