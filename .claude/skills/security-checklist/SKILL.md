---
name: security-checklist
description: How the security agent checks each OWASP row — read-only commands per function (secret scanner with redaction, dependency audit), concrete red flags per risk that hold on any web stack, a slot for stack-specific red flags, severity decision tree with origin, and how to explain a finding without an attack recipe. Preloaded by the security agent.
---

# Checklist de seguridad

> Complementa la tabla OWASP del security: allí está el **qué**; aquí, **dónde mirar** y **cómo clasificarlo**. Todo es **solo lectura**.
> Si dudas de cómo funciona una opción de una librería, verifícalo en Context7 antes de reportar; no reportes de memoria.
> Molde de VEGU 2.0. Las herramientas y las señales propias del stack van como `COMPLETAR AL DECIDIR:`; se llenan cuando se decide cada pieza (autenticación, base de datos, alojamiento).

## 1. Orden de la revisión
1. **Contexto:** `git log --oneline main..HEAD` y `git diff main...HEAD --stat`. Esa lista decide el **origen** de cada hallazgo (sección 4). Desde la ronda 2, lee solo `git diff <commit>..HEAD` (secretos y dependencias, completos) y empieza por el estado de los hallazgos anteriores.
2. **Herramientas** (sección 2).
3. **Lectura por riesgo** (sección 3): primero lo nuevo de la slice; para autenticación y acceso a datos, **todo** el código relacionado.
4. **Severidad** (sección 4) y reporte.

## 2. Comandos (uno por vez)
| Revisión | Comando | Notas |
|---|---|---|
| Secretos en el historial | COMPLETAR AL DECIDIR: p. ej. `gitleaks git --redact --no-banner` | Revisa **todos** los commits, no solo el último. |
| Secretos en los archivos | COMPLETAR AL DECIDIR: p. ej. `gitleaks dir --redact --no-banner .` | Incluye archivos aún sin commit. |
| Dependencias | COMPLETAR AL DECIDIR: auditoría completa y solo de producción | Lo que llega a producción pesa más. |
| Origen de una dependencia | COMPLETAR AL DECIDIR: árbol de dependencias de un paquete | Quién trae un paquete vulnerable. |

- **El detector de secretos siempre enmascara.** Sin esa opción, imprime el secreto completo en pantalla. El hook debe exigirla.
- Un código de salida de error puede significar "encontró algo" **o** "falló": lee el mensaje antes de concluir.
- **Prohibido** (el hook lo bloquea): arreglos automáticos de dependencias, opciones que escriben reportes a archivo, que cambian la configuración o que desactivan el enmascarado.

## 3. Dónde mirar, riesgo por riesgo
Cada riesgo trae las señales que valen en cualquier stack web; debajo, las del stack del proyecto cuando estén decididas.

**1. Acceso a datos ajenos**
- **Cada** función de servidor y **cada** ruta de API es una puerta pública: debe verificar la sesión **dentro de sí misma**. Que la página o un intermediario la verifiquen **no** basta.
- Las consultas filtran por el dueño (`id` **y** usuario de la sesión). Buscar consultas por `id` sin el filtro de usuario.
- El usuario sale **siempre** de la sesión, nunca de un formulario, de la URL ni del cuerpo de la petición.
- Al navegador solo llegan los campos necesarios, no la fila completa de la base.
- COMPLETAR AL DECIDIR: señales propias del framework (cómo se declara una función de servidor, dónde se lee la sesión).

**2. Inyección**
- El constructor de consultas y las plantillas parametrizadas están bien.
- SQL o comandos armados concatenando texto con datos del usuario → **Crítica**.
- COMPLETAR AL DECIDIR: la forma "cruda" de la librería de base de datos que hay que buscar.

**3. Secretos**
- Variables que el framework publica al navegador (por prefijo o configuración) **nunca** llevan un secreto.
- Los módulos que tocan la base o los secretos solo se importan en el servidor.
- El archivo de variables de ejemplo solo trae nombres, sin valores. Ningún secreto en pruebas, capturas ni logs.
- En el reporte, el secreto va **enmascarado**: archivo, línea y tipo, nunca el valor.

**4. Dependencias**
- Vulnerabilidad crítica o alta **en producción** → Alta. Solo en desarrollo → Media o Baja.
- Toda dependencia nueva está en el plan y es un paquete conocido y mantenido; desconfía de nombres parecidos a uno famoso.

**5. Autenticación y sesiones**
- Registro público **solo** si el proyecto lo decidió; si la librería lo trae abierto por defecto y nadie lo cerró → **Crítica**.
- Límite de intentos de inicio de sesión activo donde corre la app (un límite guardado en memoria con varias instancias es débil: Media).
- Expiración de la sesión: anota el valor y señálalo si nadie lo decidió.
- Cookies seguras (`HttpOnly`, `Secure`, `SameSite`); orígenes de confianza solo con los dominios propios.
- Cerrar sesión invalida la sesión en el servidor. Los errores de inicio de sesión no dicen si falló el usuario o la clave.
- COMPLETAR AL DECIDIR: opciones de la librería de autenticación que hay que revisar y su valor por defecto.

**6. Entradas del usuario**
- Validación **en el servidor**, no solo en el navegador: valores en rango según las reglas del dominio, fechas válidas, textos con largo máximo.
- HTML armado con texto del usuario o inserción de HTML sin escapar → Alta.
- Redirecciones con destinos que vienen de la URL sin validar que sean internos.

**7. Configuración**
- Encabezados de seguridad: `Content-Security-Policy` o `frame-ancestors`, `Referrer-Policy`, `X-Content-Type-Options`.
- En producción, los errores no muestran detalles internos y no hay mapas de código fuente públicos.
- Las previews están protegidas y **nunca** usan la base de producción con datos reales.
- COMPLETAR AL DECIDIR: dónde se configuran encabezados y protección de previews en la plataforma.

**8. Privacidad en logs**
- Buscar mensajes de log con objetos completos, datos personales o sensibles del dominio, correos, tokens o la sesión.

**9. Inyección de prompt** (solo si la slice usa IA)
- El texto del usuario o de terceros es **dato**, nunca instrucción; la IA no ejecuta acciones ni lee datos sin la misma verificación de la sección 1.

**10. Datos de prueba**
- La base de pruebas **no** es la de producción. Ni las pruebas ni la evidencia (capturas, videos) muestran datos reales.

## 4. Cómo asignar la severidad
1. ¿Permite ver o cambiar datos sin ser el dueño, entrar sin credenciales, registrarse sin permiso, o expone un secreto? → **Crítica**.
2. Si no: ¿se puede aprovechar con poco esfuerzo y sin acceso especial (inyección de HTML, dependencia vulnerable en producción, acción sin verificar sesión aunque la página sí la verifique)? → **Alta**.
3. Si no: ¿es un riesgo real que exige condiciones difíciles (límite de intentos débil, sesión muy larga, encabezado faltante)? → **Media**.
4. Si no: ¿es una buena práctica pendiente sin riesgo directo hoy? → **Baja**.
5. Con dudas entre dos niveles, elige el **más alto** y explica por qué.
6. **Origen:** ¿la slice agregó o modificó ese código, o el código nuevo provoca o expone el riesgo (p. ej. una acción nueva que llama a una consulta vieja sin filtro de usuario)? → **Del cambio**. Si no → **Preexistente**: no bloquea; si es Crítica/Alta, márcala en el Resumen para que el Manager la lleve al usuario en el momento. Una dependencia vulnerable que la slice no agregó ni actualizó es preexistente. La severidad no cambia por el origen.

## 5. Cómo se escribe un hallazgo
Explica el **qué** (empezando por el **tipo de fallo**, para que se corrija en todos los lugares), el **cómo podría aprovecharse** (en una frase, sin pasos de ataque) y **cómo se corrige**:

| # | Severidad | Origen | Archivo:línea | Qué pasa (tipo de fallo) | Cómo podría aprovecharse | Cómo se corrige |
|---|---|---|---|---|---|---|
| 1 | Crítica | Del cambio | `src/orders/actions.ts:22` | **Acción sin filtro de dueño:** `deleteOrder(id)` borra por `id` sin filtrar por el usuario de la sesión | Alguien con sesión podría borrar registros que no son suyos cambiando el `id` | Filtrar por `id` **y** usuario de la sesión dentro de la acción, y revisar las demás acciones de la slice |

Desde la ronda 2, un hallazgo ya reportado va en "Hallazgos de rondas anteriores" (Corregido / Sigue abierto), nunca como fila nueva.
