# Roadmap de vertical slices
**Última actualización:** 2026-11-25

> **Reglas del archivo:**
> - Lista ordenada de vertical slices (`VS-XXX`) por valor para el usuario; la define el usuario con el Manager.
> - Cada slice atraviesa las capas que necesita (pantalla → lógica → datos) y cumple las **reglas de tamaño y valor** de abajo; si no las cumple, se parte.
> - Una slice solo entra aquí si su tema ya está definido; lo que falta por definir va en "Fuera del roadmap".
> - El detalle de cada slice vive en `_project/slices/VS-XXX.md` y sus features en `_project/features/F-XXX.md` (plantilla en `_project/templates/feature.md`).
> - Cambiar el orden o agregar/quitar slices requiere aprobación del usuario; los IDs `VS-XXX` nunca se reutilizan.
> - Estados: `Por definir` · `Definida` · `En construcción` · `Terminada` · `Cancelada`. El seguimiento diario va en `_persistence/tasks.md`.
> - Los lotes de mantenimiento (`MANT-XXX`) agrupan deuda técnica o ajustes pequeños; siguen las mismas reglas de lotes y de riesgo.

## Reglas de tamaño y valor — se aplican a toda slice
1. **Pequeña:** **8 a 10 pasos como máximo** y **1 o 2 features**. Si el architect o el planner pasan de ahí, **se recorta el alcance** (lo que sobra va a una slice posterior) antes de aprobarla; **nunca** se juntan varios pasos en uno más grande para cumplir el número.
2. **Genera valor:** al terminarla, el usuario puede **usar algo nuevo ese mismo día**. Una slice que solo deja infraestructura no se acepta (salvo la walking skeleton, que ya deja algo usable).
3. **Primero el camino feliz:** cada slice construye el caso normal. Validaciones extremas, casos de borde poco probables, seguridad avanzada y estados especiales van en **slices propias**, cuando aporten valor. **Bordes:** el architect los identifica y los anota en "Bordes que esperan" de `VS-XXX.md` con una slice propuesta; el **usuario** elige la slice y el Manager la lleva a su fila del roadmap. Los bordes de las restricciones duras (regla 7) se prueban siempre en la slice en curso. El tester no agrega bordes por su cuenta.
4. **Pregunta obligatoria al aprobar** (alcance, diseño y plan): *"¿qué de esto puede esperar a la siguiente slice?"*. Lo que pueda esperar, sale.
5. **Pruebas solo de la slice en curso:** el tester escribe las pruebas de aceptación de esa slice, no de las siguientes; la **CI queda en verde al cerrar cada slice**.
6. **E2E mínimas:** un solo dispositivo o entorno (Playwright WebKit con `devices["iPhone 13"]`, más la lista manual en el iPhone real con Safari; D-009) salvo que la slice trate de compatibilidad.
7. **Restricciones duras siempre:** las de `_persistence/constraints.md` (tema Técnicas y las del dominio) se cumplen aun en la versión más pequeña.
8. **Pasos pequeños y de una sola naturaleza:** cada paso es lo más pequeño posible para poder hacerle seguimiento, trata de **una sola cosa** (p. ej. solo datos, solo pantalla, solo despliegue) y deja **algo verificable** que el usuario puede ver o comprobar.
9. **Infraestructura justo a tiempo:** la slice es funcional; la infraestructura es solo la necesaria y suficiente para el trabajo funcional y se construye **cuando la necesita el siguiente paso**, no toda de una vez ni "por si acaso".
10. **Esbozo de pasos antes del plan:** el architect entrega las features y un esbozo de los pasos (nombre, naturaleza y valor de cada uno), que el usuario aprueba; el planner detalla esos mismos pasos y no agrega otros sin justificarlo y pedir aprobación.

## Diseño
- Si el proyecto tiene pantallas: **sistema de diseño** en `_project/design-system.md`, aprobado por el usuario en la primera slice con pantallas y ampliado solo cuando una slice lo necesite.
- **Diseño por slice:** cada feature incluye su sección "Diseño de interfaz", aprobada antes de programar (DoR) y verificada al terminar (DoD).
- El agente `designer` puede trabajar **una slice adelante**.

## Bloque A — Contar y mostrar
| Slice | Nombre | Qué puede hacer el usuario al terminarla | Fuera a propósito | Reglas | Depende de | Estado |
|---|---|---|---|---|---|---|
| VS-001 | Contar en el celular (**walking skeleton**) · **F-001** Escribir una palabra o frase y ver los 4 conteos | Abrir la app publicada desde el celular, escribir y ver los 4 conteos en texto sencillo | Imágenes y diseño didáctico (VS-002); avisos (VS-004): una letra de otro idioma simplemente no entra, sin aviso. El carácter 101 no entra y nunca muestra aviso (D-007) | C-001 a C-013 | — | Por definir |
| VS-002 | Imágenes y diseño para niños · **F-002** Una imagen y un color por grupo · **F-003** Pantalla didáctica (letra y botones grandes, poco texto) | Usarla con los niños: cada grupo se reconoce por su imagen sin leer | Colorear cada letra (VS-003) | C-001 a C-013 | VS-001 | Por definir |
| VS-003 | Ver cada letra en su grupo · **F-004** El texto escrito se muestra con cada carácter del color de su grupo | Ver **cuáles** caracteres son vocales, consonantes, números u otros, no solo cuántos | Avisos (VS-004) | C-001 a C-013 | VS-002 | Por definir |
| VS-004 | Aviso amable · **F-006** Aviso al intentar una letra de otro idioma: mensaje lindo para el niño y se borra todo el texto para escribirlo de nuevo (D-006) | Entender por qué se borró lo que se escribió | F-005 (aviso de largo máximo), retirada el 2026-11-25 (D-007): el carácter 101 se ignora en silencio | C-011 | VS-002 | Por definir |
| VS-005 | Borrar y empezar de nuevo · **F-007** Botón grande para borrar todo | Pasar de una palabra a otra sin borrar letra por letra | — | C-012 | VS-002 | Por definir |
| VS-006 | Instalar en el celular y usar sin internet · **F-008** Ícono en la pantalla de inicio · **F-009** Funciona sin conexión | Abrirla como cualquier app, también sin wifi | — | C-010 | VS-001 | Por definir |

## Fuera del roadmap (pendientes de definición)
- Ninguno. Descartados por el usuario el 2026-11-25: sonidos, juegos o ejercicios, otros idiomas de pantalla.
