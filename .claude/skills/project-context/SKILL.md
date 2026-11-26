---
name: project-context
description: Shared context of this project — product summary, domain glossary with its code names, technical rules, agent flow and where each piece of information lives. Preloaded by every agent of the project.
---

# Contexto del proyecto

> Este skill es un **mapa, no una copia**: dice qué es cada cosa y **dónde** está. Los valores que cambian (supuestos, catálogo, restricciones) se leen siempre en su archivo, nunca de aquí.
> Molde de VEGU 2.0: se llena en la Fase 0 (T-001) y se amplía con cada slice (el glosario crece cuando aparece un término nuevo). Lo marcado `COMPLETAR AL DECIDIR:` es del stack: se llena cuando el Manager decide esa pieza (D-XXX), no antes.

## 1. El producto
- **Qué es:** app que se usa en el **celular**: se escribe una palabra o frase y muestra cuántas **vocales, consonantes, números y otros** caracteres tiene, sin contar los espacios, con una **imagen por grupo**.
- **Para quién:** un solo adulto (el usuario, quien enseña) que la usa desde su celular con **niños menores de 8 años que aprenden a leer**. Colombia, español de Colombia; sin moneda ni fechas.
- **Problema que resuelve:** los niños que aprenden a leer confunden vocales, consonantes y números; quien les enseña no tiene una herramienta sencilla en el celular que muestre esa clasificación al instante y de forma visual. Por eso la app debe ser muy didáctica: botones grandes, imágenes claras y poco texto.
- **Qué no hará:** no usa inteligencia artificial (la palabra o frase siempre la escribe una persona); no tiene base de datos ni guarda lo escrito; no tiene inicio de sesión ni contraseñas.
- Se construye por **vertical slices**, en el orden de `_project/roadmap.md` y con sus **reglas de tamaño y valor**.
- Si el usuario **aprende mientras se construye** (perfil en `AGENTS.md`), todo lo que entregues debe poder explicarse en lenguaje sencillo.

## 2. Glosario del dominio (término → nombre en código)
Usa **siempre** estos nombres en código, tablas, rutas y pruebas. Si necesitas un término que no está aquí, **no lo inventes**: proponlo en tu reporte.

| Término (pantalla) | En código | Significado |
|---|---|---|
| Vocal / Vocales | `vowel` | Grupo GRP-001; regla C-001 |
| Consonante / Consonantes | `consonant` | Grupo GRP-002; reglas C-002 a C-004 |
| Número / Números | `digit` | Grupo GRP-003: cada dígito 0–9 (C-006) |
| Otro / Otros | `other` | Grupo GRP-004: signos, símbolos y emojis (C-007). Las letras de otros idiomas no se permiten (C-011) |
| Grupo | `characterGroup` | Cada uno de los 4 grupos del catálogo, con su imagen |
| Conteo | `count` | Cuántos caracteres de un grupo tiene el texto escrito |
| Texto (palabra o frase) | `text` | Lo que se escribe; no se guarda (C-010) |

**IDs del catálogo:** si el producto tiene catálogo (`_project/catalog.md`), sus IDs son estables y neutros; un registro se **inactiva**, no se borra.

## 3. Reglas técnicas (duras, en `_persistence/constraints.md` → Técnicas)
- **Idioma del código:** inglés en el código (archivos, variables, funciones, pruebas); español de Colombia solo en el texto que se ve en pantalla (C-013).
- **Stack:** COMPLETAR AL DECIDIR: lenguaje, framework, base de datos, autenticación, estilos, alojamiento y repositorio. Carpeta del código: COMPLETAR AL DECIDIR.
- **Pruebas:** COMPLETAR AL DECIDIR: herramienta de unitarias e integración, de punta a punta (E2E) y de CI, y los comandos para correrlas (revisión estática, unitarias, E2E de un archivo). Al decidirlos, se copian también a las guardas del coder y del tester (`.claude/agents/`).
- **Reglas de conteo** C-001 a C-008, C-011 y C-012, y de **alcance** C-009 (sin IA) y C-010 (sin base de datos ni login), en `constraints.md`.
- Antes de usar una librería, verifica su **documentación vigente**, sin datos sensibles en la consulta.

## 4. Flujo de agentes
architect → designer → **aprobación del usuario** → planner → **aprobación** → coder (TDD) → tester → breaker-user ∥ breaker-code (el Manager clasifica sus hallazgos) → reviewer ∥ security (+ revisión visual del designer) → verificación del Manager → aceptación del usuario → producción. A pedido, con aprobación del usuario: **debugger** para un fallo sin causa clara.
- Qué revisiones corren en cada entrega lo decide su **nivel de riesgo** (`.claude/rules/risk-levels.md`). Los agentes que este proyecto no usa se quitan de este flujo en la Fase 0: todos se usan.
- El **Manager** (sesión principal) es el único que escribe en `_persistence/` y registra decisiones, lecciones y deuda técnica.
- Cada agente escribe **solo en su zona**; los hooks de `.claude/hooks/` lo hacen cumplir.
- Cada entrega termina en `_project/slices/VS-XXX/reports/<agent>.md` con `STATUS: DONE` o `STATUS: BLOCKED — <qué necesita>`.
- **El agente propone, el usuario confirma.** Si falta algo, te detienes y lo informas; no inventas.

## 5. Dónde está cada cosa
| Necesito… | Archivo |
|---|---|
| Reglas generales del proyecto | `AGENTS.md` |
| Principios de ingeniería y nivel de riesgo | `.claude/rules/` |
| Qué se decidió y por qué | `_persistence/decisions.md` (índice primero) |
| Valores del dominio | `_persistence/assumptions.md` |
| Reglas que no se pueden violar | `_persistence/constraints.md` (por tema) |
| Errores y aciertos previos | `_persistence/lessons.md` (por categoría) |
| Catálogo de datos maestros | `_project/catalog.md` |
| Orden de las slices | `_project/roadmap.md` |
| Plantilla de feature, DoR y DoD | `_project/templates/feature.md` |
| Definición de una slice y sus features | `_project/slices/VS-XXX.md`, `_project/features/F-XXX.md` |
| Plan de una slice | `_project/slices/VS-XXX/plan.md` |
| Sistema de diseño y bocetos | `_project/design-system.md`, `_project/design/` |
| Deuda técnica | `_project/tech-debt.md` |

> Algunos archivos aún no existen (se crean con su slice). Si falta uno que necesitas, informa y continúa; no lo inventes.
