---
name: debugging-method
description: How to investigate a failure until its cause is proven — triggers for proposing the debugger, fixed method (reproduce, preserve evidence, hypothesis, minimal experiment, proven cause), time box, how to reproduce intermittent failures, a catalog of causes already seen in the project, verdict and who fixes it. Preloaded by the debugger; read by the Manager to decide whether a failure meets a trigger.
---

# Método de depuración

> Lo usa el **debugger** (para investigar) y lo lee el **Manager** (para decidir si un fallo cumple un disparador, §1). Se investiga **una pregunta a la vez**: "¿por qué falla X?". No se corrige nada.
> Molde de VEGU 2.0. Los comandos de §4 dependen de las herramientas de prueba: `COMPLETAR AL DECIDIR:`. El catálogo de §5 crece con cada `DBG-XXX` del proyecto.

## 1. Disparadores (cuándo se propone el debugger)
Un fallo cumple un disparador si es: **(a)** sin explicación al primer intento (el mensaje no dice la causa); **(b)** repetido: el mismo fallo en otra ronda, otra corrida u otra slice; **(c)** un arreglo que no funcionó; **(d)** una herramienta o el entorno fallan sin causa clara (CI, DNS, base remota, una herramienta de revisión).
**No** se usa para un rojo con mensaje claro ("esperaba 3, recibió 2") ni para hallazgos de breakers que ya traen su reproducción.
**Quién lo pide:** el usuario, cuando quiera; el Manager lo **propone** y el usuario aprueba; los demás agentes solo **avisan** en la sección "Fallo sin explicar" de su reporte. Con (b), el Manager **debe** proponerlo; si el usuario dice que no, se anota el motivo.

## 2. El método (en orden; cada paso queda en la bitácora del reporte)
1. **Reproducir.** Primero en aislado (solo la prueba), luego en el contexto donde falló (suite completa, misma base, mismo dispositivo). Cuenta: "falló N de M".
2. **Guardar la evidencia** en cuanto aparece: traza, captura, salida y comando exacto, en tu carpeta `evidence/`. La corrida siguiente suele borrar los resultados de la anterior.
3. **Hipótesis:** una sola frase comprobable ("la prueba lee el aviso del guardado anterior"). Anota también qué la **refutaría**.
4. **Experimento mínimo:** el cambio más pequeño que distingue la hipótesis de la alternativa (otra espera, otro dispositivo, base local vs. remota, una sola prueba a la vez). Una variable a la vez. Anota el resultado tal cual.
5. **Causa probada:** la hipótesis que sobrevivió y una **prueba en rojo** que falla por esa causa y no por otra. Sin esa prueba, la causa es solo "probable".

## 3. Tiempo máximo
**45 minutos**, ampliable a **60** si el último experimento acotó la causa. Al llegar al límite, paras y entregas lo que tienes: un veredicto honesto "no reproducido" o "probable" vale más que otra hora de vueltas.

## 4. Cómo reproducir (uno por vez, desde la carpeta del código)
- **Prueba intermitente:** repetirla muchas veces seguidas (p. ej. 20), **sin reintentos**, **de a una a la vez**, guardando la traza solo de las que fallan y parando en el primer fallo. Después, la misma en paralelo: si solo falla en paralelo, es competencia por la base o por el servidor.
  COMPLETAR AL DECIDIR: el comando exacto (p. ej. `npx playwright test <archivo> --repeat-each 20 --retries 0 --workers 1 --trace retain-on-failure --output ../_project/debug/DBG-XXX/evidence/<corrida>`).
- **Una prueba concreta:** filtrar por su `TC-XXX`. **Otro dispositivo o entorno:** el nombre del proyecto de pruebas que corresponda.
- **Prueba de integración intermitente:** correr solo esa prueba varias veces y anotar cada resultado. Si usa una base remota, un corte de conexión no es un defecto de la app hasta que se demuestre.
- **DNS o red:** `nslookup <host>` 2 o 3 veces antes de dar por caído un servicio.

## 5. Causas que ya vimos (revísalas primero)
| Síntoma | Causa conocida | Lección o `DBG-XXX` |
|---|---|---|
| La prueba ve el aviso o el dato viejo tras "Guardar" | Esperaba el primer aviso que apareciera, que era el del guardado anterior; hay que esperar el efecto propio (p. ej. N filas) | — |
| Una prueba de punta a punta falla tras tocar un enlace | Esperó que la pantalla cargara, pero no un elemento propio de la pantalla nueva | — |
| Lo escrito en un campo desaparece | Se escribió antes de que la pantalla quedara lista para recibir entradas | — |
| Un servicio "no existe" (`ENOTFOUND`) | DNS de la red local; probar con otro servidor DNS | — |
| Cortes con una base remota en pruebas de integración | Red o tiempos de espera cortos; no es defecto de la app hasta demostrarlo | — |
| Falla una vez y luego pasa tres | Intermitencia sin cerrar: llevar el conteo, no darla por resuelta | — |
| Ninguna propia todavía: se agrega una fila con cada `DBG-XXX` confirmado | | |

## 6. Veredicto y de quién es el arreglo
- **Causa confirmada** (con prueba en rojo) · **Causa probable** (con el siguiente experimento que la confirmaría) · **No reproducido** (con lo que se intentó y cuántas corridas).
- De quién: **app** → coder, con tu prueba en rojo como su `test(P-X)` · **prueba** → tester (o coder, si es prueba suya) · **herramienta o entorno** → Manager · **especificación** → architect, vía Manager.
- Si encuentras otro fallo en el camino, **no lo persigas**: anótalo en "Otros hallazgos" y sigue con tu pregunta.
