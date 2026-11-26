---
name: tdd-cycle
description: How the coder applies strict TDD (red → green → refactor) to each plan step — valid red, minimal green, scoped refactor, commit sequence, test writing rules for exact values and fixed dates, traceability to TC-XXX and anti-patterns. Preloaded by the coder.
---

# Ciclo TDD del proyecto

> Complementa la sección "Ciclo TDD" del coder. Aquí está el **cómo hacerlo bien**. Si algo de este skill choca con el plan aprobado, manda el plan: detente y repórtalo.
> Molde de VEGU 2.0. Los ejemplos de código usan la herramienta de pruebas del proyecto cuando ya está decidida: COMPLETAR AL DECIDIR: herramienta de pruebas unitarias y forma de fijar la hora (p. ej. `vi.useFakeTimers()` en Vitest).

## 1. Por qué TDD
- La prueba se escribe **antes** que el código: así cada comportamiento nace con alguien que lo vigila.
- Un error en una regla crítica no se ve hasta que hace daño. Una prueba en rojo es más barata que un dato mal calculado.
- El historial de git **demuestra** el ciclo: el Manager verifica que cada `feat` va precedido de su `test`.

## 2. Rojo — la prueba que falla
1. Escribe **la prueba que indica el paso `P-X` del plan**, y solo esa (o una tabla de casos del mismo comportamiento).
2. Ejecuta **solo ese archivo** primero.
3. **Confirma la razón del fallo.** Un rojo válido falla porque **falta el comportamiento**: la aserción no se cumple.
   - ❌ No vale si falla por un error de escritura, un import mal puesto, configuración o tipos rotos: corrige eso primero.
   - ❌ Una prueba de rechazo (p. ej. "no encontrado") que falla o pasa solo porque la ruta o la función todavía no existen no prueba nada: créale el esqueleto y mira que falle por el motivo correcto.
   - Si la función aún no existe, crea un **esqueleto mínimo** (la firma de las Interfaces públicas del plan, que lanza "no implementado" o devuelve un valor neutro) para que el fallo sea de la aserción.
4. **Si la prueba pasa a la primera, detente.** O el comportamiento ya existe, o la prueba no prueba nada. Revisa; si no lo puedes explicar, repórtalo.
5. **Si a veces pasa y a veces falla**, no hagas el commit: detente con la causa que sospechas.
6. Commit: `test(P-X): <qué comportamiento prueba>`. En el reporte, anota **la razón del fallo que viste**.

## 3. Verde — el mínimo que pasa
- Escribe **el mínimo código** que hace pasar la prueba. Nada de ramas, parámetros u opciones que ninguna prueba pida ("por si acaso" = fuera de alcance).
- Ejecuta **todas las pruebas unitarias y de integración**, no solo tu archivo.
- Si se rompe una prueba anterior, corrige **tu código**, nunca la prueba ajena. Si crees que la prueba anterior está mal, detente y repórtalo.
- Lo que una herramienta no confirma (un valor, un orden, un formato), se verifica con el dato, no con la suposición.
- Commit: `feat(P-X): <qué hace>`.

## 4. Refactor — limpiar sin cambiar el comportamiento
- Solo el código **y las pruebas** de este paso: nombres claros, duplicación eliminada, funciones cortas (complejidad ≤ 10).
- **Ningún** comportamiento nuevo. Si al limpiar ves que falta algo, eso es otro paso del plan, no un refactor.
- Todo en verde después de limpiar.
- Commit: `refactor(P-X): <qué mejoró>`, o ninguno si no había nada que limpiar.

## 5. Cómo se escribe una buena prueba
- **Una prueba, un comportamiento.** Estructura **Preparar → Actuar → Verificar** (Arrange / Act / Assert), separadas por una línea en blanco.
- **Nombres en el idioma del código** (project-context) que describen el comportamiento, con el caso de la feature al inicio para la trazabilidad:
  ```text
  "TC-012: available is assigned minus spent"
  ```
  Si una prueba no corresponde a ningún `TC-XXX` (un detalle interno del plan), usa el paso: `"P-3: …"`.
- **Casos de borde en tabla** (una prueba parametrizada): vacío, cero, negativo, valores muy grandes, justo antes y justo después de cada límite, fin de mes, febrero y bisiesto.
- **Valores exactos:** las reglas críticas (dinero, cantidades, conteos) se comprueban con igualdad exacta, nunca con "aproximadamente". Si el dominio guarda dinero, se guarda y se compara en la unidad entera que diga project-context. El formato de pantalla (separadores, símbolo) se prueba solo en la función que formatea.
- **Fechas siempre fijas.** Nada que dependa del día ni de la zona horaria de la máquina: fija la hora al inicio de la prueba y restáurala al final, con la **zona horaria del usuario** que dice `AGENTS.md`. Un evento a las 11 p. m. del último día del mes es de ese mes, no del siguiente.
- **Sin red real ni servicios externos** en pruebas unitarias. Las de integración con base de datos usan **la base de pruebas que defina el plan**, nunca la de producción.
- **Datos de prueba** con nombres del glosario de project-context y valores realistas.

## 6. Qué tipo de prueba escribe el coder
| Tipo | Qué cubre | Dónde |
|---|---|---|
| Unitaria | Cálculos puros y reglas del dominio | Junto al código |
| Integración | Código de servidor y base de datos | Junto al código |
| E2E | Recorridos completos | **Solo si el plan lo pide**: las de aceptación son del tester. En un paso de pantalla, el rojo es el `test(acceptance)` del tester; una E2E propia solo si cubre algo que él no cubrió |

## 7. Prohibido (anti-patrones)
- Escribir el código antes que la prueba, o ambos en el mismo commit.
- Hacer commit con una prueba marcada como "solo esta" o "saltar", o comentar una prueba para que la suite pase.
- Cambiar una aserción para que coincida con lo que el código hace, sin que el plan lo diga.
- Probar detalles internos (variables privadas, orden de llamadas) en vez del resultado visible.
- Pruebas que dependen del orden, de la fecha real, de la zona horaria de la máquina o de otra prueba.
- "Verde" con más código del que pide la prueba.
