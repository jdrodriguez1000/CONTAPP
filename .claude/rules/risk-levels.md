# Nivel de riesgo de un cambio

> Genérico de VEGU 2.0: no nombra tecnologías, carpetas ni agentes de un proyecto. Cada proyecto lo aterriza en su manual con dos tablas: **tipo de riesgo → rutas** y **función → agente**. Máximo 45 líneas.

**Para qué.** La revisión extra se gasta donde hay riesgo. La base nunca se recorta en ningún nivel: pruebas primero (PI-5), pruebas de aceptación independientes, CI en verde, verificación del Manager y aceptación del usuario.

**Qué se clasifica.** Cada **entrega que va a revisión**: la revisión inicial y cada ronda de corrección, según los archivos que cambió esa entrega desde la revisión anterior (`git diff --name-only <base>...HEAD`). No la slice completa: casi toda slice funcional es alta, y el ahorro está en las rondas y los cambios pequeños.

**Niveles, por tipo de riesgo** (manda el archivo más riesgoso de la entrega):

| Nivel | La entrega toca… |
|---|---|
| **Alto** | (1) **Datos persistentes**: esquema, migraciones, escritura o borrado de datos. (2) **Reglas críticas del negocio**: dinero, cálculos, fechas, validación de entradas. (3) **Identidad y acceso**: inicio de sesión, permisos, sesiones, quién ve qué. (4) **Límite de confianza**: código de servidor, APIs, entradas externas. (5) **Secretos y despliegue**: configuración de servidor o plataforma, cabeceras de seguridad, variables de entorno. (6) **Dependencias**: agregar, quitar o cambiar versiones. (7) **Cadena de entrega**: CI, guardas y definiciones de agentes, scripts de despliegue |
| **Normal** | Comportamiento de la interfaz sin persistencia: pantallas con lógica, formularios, navegación, estado del lado del cliente |
| **Bajo** | Solo presentación o documentos: textos de pantalla, estilos, imágenes, documentación |

**Qué revisión extra corre en cada nivel:**

| Revisión (por función) | Bajo | Normal | Alto |
|---|---|---|---|
| Adversarial de caja negra (usa la app como un usuario torpe o malicioso) | — | ✅ | ✅ |
| Adversarial de caja blanca (lee el código buscando dónde se rompe) | — | — | ✅ |
| Calidad del código (duplicación, complejidad, alcance, mutación) | — | ✅ | ✅ |
| Seguridad | — | — | ✅ |
| Revisión visual contra el diseño | si toca pantallas | si toca pantallas | si toca pantallas |

**Reglas:**
1. **Ante la duda, se sube.** Un archivo que no encaja en ninguna fila cuenta como **alto**. Bajar un nivel solo se hace con aprobación del usuario.
2. **El usuario aprueba el nivel** de cada entrega: el Manager lo propone con la lista de archivos que lo deciden.
3. **Al definir** una slice o lote se anota el **nivel esperado** (para estimar sesiones); **antes de cada revisión** manda el diff real.
4. **En una ronda**, la revisión adversarial se repite solo si la corrección agrega comportamiento nuevo; las demás siguen la tabla.
5. **Los lotes de mantenimiento** usan la misma tabla; no tienen regla propia.
6. **Se mide:** el nivel de cada entrega queda en las métricas de la slice. Si un defecto llega a producción o a la aceptación por una revisión que el nivel omitió, se revisa la tabla (atajar en el origen).
