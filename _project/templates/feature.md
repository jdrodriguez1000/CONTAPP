# F-XXX — <Nombre de la feature>

> **Plantilla de feature.** Copiar a `_project/features/F-XXX.md` y completar todas las secciones.
> La redacta el `architect`; la sección de diseño, el `designer`. El usuario aprueba antes de construir (DoR).
> Textos de pantalla en el idioma del usuario; nombres técnicos según la regla de idioma del código (`project-context`).
> Si el proyecto no tiene pantallas (sin designer), la sección 5 se borra de esta plantilla en la Fase 0.

**Slice:** VS-XXX · **Estado:** Borrador / Aprobada / En construcción / Terminada · **Última actualización:** AAAA-MM-DD

## 1. Historia
Como **<usuario>**, quiero **<acción>** para **<beneficio>**.

## 2. Alcance
- <Qué incluye esta feature>

## 3. Fuera de alcance
- <Qué NO incluye; a qué slice o feature queda>

## 4. Reglas relacionadas
| ID | Regla | Cómo aplica aquí |
|---|---|---|
| C-XXX / D-XXX / A-XXX | | |

## 5. Diseño de interfaz
- **Pantallas:** <lista>
- **Boceto:** enlace o archivo en `_project/design/VS-XXX/`
- **Estados:** vacío · cargando · error · éxito (describir cada uno)
- **Celular primero:** cómo se ve y se usa en el celular; luego en pantallas grandes
- **Componentes del sistema de diseño usados:** <botón, tarjeta, campo…> (`_project/design-system.md`)
- **Textos de pantalla:** <títulos, botones, mensajes de error>
- **Accesibilidad:** contraste, tamaño táctil mínimo, etiquetas de campos
- **Aprobación del diseño:** Pendiente / Aprobado por el usuario el AAAA-MM-DD

## 6. Criterios de aceptación
- **CA-1** — **Dado** <contexto>, **cuando** <acción>, **entonces** <resultado>.

## 7. Casos de prueba
| ID | Caso | Tipo (Unitaria / Integración / E2E) | Camino (Feliz / Alterno / Borde) | Criterio | Restricción |
|---|---|---|---|---|---|
| TC-XXX | | | | CA-1 | C-XXX |

> Cada restricción dura de la sección 4 tiene al menos un caso de prueba.

## 8. Definición de Listo (DoR)
- [ ] Secciones 1 a 7 completas.
- [ ] Diseño de interfaz aprobado por el usuario (si hay pantallas).
- [ ] Feature aprobada por el usuario.
- [ ] Dependencias terminadas.

## 9. Definición de Terminado (DoD)
- [ ] Pruebas automáticas en verde, incluida la regresión completa.
- [ ] Pantallas construidas coinciden con el diseño aprobado (capturas).
- [ ] Evidencia: reporte + capturas o video en `_project/slices/VS-XXX/evidence/`.
- [ ] Desplegada en un entorno de prueba (preview) y aceptada explícitamente por el usuario.
- [ ] Memoria, `CHANGELOG.md` y versión actualizados.
