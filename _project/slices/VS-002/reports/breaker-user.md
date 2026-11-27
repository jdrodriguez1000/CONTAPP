# Ronda 1

**Reporte del breaker-user — VS-002** · **Fecha:** 2026-11-27 · Commit `25ccf38` · Playwright WebKit con `devices["iPhone 13"]` (cambiando el ancho y el modo cuando hizo falta), en Windows y contra la app local. **No probé en un iPhone real** ni en la versión publicada.

## Resumen
**No encontré defectos (0 hallazgos)** en lo que construyó VS-002, dentro de lo que pude probar. No hay reproducciones en rojo porque no hay nada que reproducir.
Anoto 1 detalle dentro de un borde que ya espera (celular girado) y 1 sospecha sin confirmar (iPhone de pantalla más baja).
Lo que no se puede simular aquí (teclado real, barras de Safari y letra SF Pro) sigue dependiendo de las pruebas en el iPhone.

## Hallazgos
| ID | Qué se rompe | Cómo reproducirlo | Esperado vs. obtenido | Gravedad propuesta | Restricción o criterio afectado | Evidencia |
|---|---|---|---|---|---|---|
| — | Ninguno | — | — | — | — | — |

## Reproducciones
No hay. Los archivos `tests/e2e/BRK-U-0-probe*.spec.ts` (3) son **sondas exploratorias**: imprimen medidas y guardan capturas, casi sin comprobaciones. Que salgan en verde **no demuestra nada por sí solo**; lo que digo abajo sale de leer sus salidas y las capturas. **No se deben copiar.** No puedo borrarlos y, mientras estén en esta carpeta, `npm run test:e2e` aquí también los corre.

- Comando: `npx playwright test <archivos de las sondas> --project=iphone --output=_project/slices/VS-002/evidence/breaker-user/run --reporter=list --workers=1`.
- Corridas: sonda 1, 11/11. Sonda 2, 4 pasaron y 1 falló **por un error mío** (recargaba la misma dirección y "atrás" salía de la app). La corregí y la corrí junto con la sonda 3: 10/10.
- No corrí la suite del tester ni la del coder.

## Borde que espera (no es un hallazgo nuevo)
- **Girar y volver (borde "celular girado").** Pegué `"m " × 50` con 844 × 390 y volví a 390 × 664 sin escribir. El campo se quedó en 145 px (4 líneas). Se ven **48 de las 50 "m"**: el resto queda escondido dentro del campo, y el conteo dice 50, que es correcto. Pasa ya de vuelta en el ancho de referencia. VS-001 ya había visto que el alto no cambia con el ancho, sin confirmar texto oculto; ahora sí lo vi. No lo considero más grave de lo que supone la lista: no hay conteo falso y las fichas se ven. No comprobé si se corrige al escribir, ni cómo se comporta el giro en un iPhone real. Evidencia: `evidence/breaker-user/probe-girado-vuelta.png`.

## Sospechas sin confirmar
- **iPhone con pantalla más baja que el de referencia** (p. ej. 375 × 667 o 375 × 812). La 2.ª fila termina en ≈ 395 px también en esos tamaños (medido en Windows). F-003 §5.2 midió 427 px visibles solo en la pantalla de 844 de alto. **Supuesto, no medido:** si en una de 812 el teclado y las barras ocuparan los mismos 370 px, con una barra de estado de unos 50 px quedarían ≈ 392, menos que 395 (≈ 402 con SF Pro). No tengo medidas de esos teclados. Los "Bordes que esperan" hablan de menos de 320 px de ancho, celular girado y computador, pero **no de una pantalla más baja**. Hoy la app la usa un solo adulto con su celular; recomiendo solo que el Manager decida si se añade a esa lista.
- **Doble toque sobre un número:** en WebKit simulado, el doble clic deja el número seleccionado, con resaltado azul (`probe-after-taps.png`). Los conteos no cambian. No sé si en el iPhone un niño que toca o mantiene el dedo ve el resaltado o el menú "Copiar", ni si el doble toque acerca la pantalla. Ningún criterio habla de esto y no comparé con VS-001.
- **Sin red con la app ya abierta:** pegar siguió contando bien (2/2/4/4). No revisé a ojo las imágenes en ese momento. El uso sin internet es de VS-006.

## Lo que intenté y resistió
- **Alto del campo, que es lo que empuja las fichas:** a 390 px, con el campo vacío mide 82 y la 2.ª fila termina en 395. Vuelve a esos valores tras seleccionar todo y borrar, reemplazar 20 saltos de línea por "sol", vaciar el campo, recargar y volver atrás con un texto largo. Deshacer y rehacer un pegado de 100 ajustan el alto al texto — resistió.
- **Letras o símbolos altos en 1 o 2 líneas** (emojis, familia, bandera, `1️⃣`, mayúsculas con tilde, U+FDFD, flechas y símbolos), tabulaciones, 50 espacios y una palabra de 50 letras: el campo se quedó en 82 px y las fichas no bajaron (letra de Windows).
- **Frase de 50 del diseño, escrita tecla por tecla:** 17/20/0/1, 2 líneas, 82 px, sin desplazamiento interno.
- **Escribir, borrar y rechazar "ç" en la 1.ª línea de un campo desplazado:** con la "ç" no cambiaron el largo, el cursor ni el desplazamiento. Escribir y borrar tampoco hicieron saltar la vista. Lo comparé con una copia del campo sin la app, que sí aceptó la "ç" — resistió.
- **Carácter 101 y "ç" con 100 caracteres en una ventana baja (390 × 427) y la página desplazada:** no cambiaron el texto, el cursor, los conteos ni el desplazamiento.
- **Regresión de VS-001:** rehacer tras un rechazo, pegar "aç" sobre una selección ("caa"), letra ajena + U+20E3, espacio + acento suelto (entra solo el espacio), "ſ" y HTML con `onerror` (se cuenta como texto, sin diálogos) — resistió.
- **Historial:** ancla `#x` y atrás (misma página: texto y conteos se conservan y cuadran); ir a otra dirección de la app, atrás y adelante (vacío, 0/0/0/0 y 82 px) — resistió.
- **Escritura rápida** (135 teclas seguidas: se queda en el tope y 12/22/33/22) y **110 veces Enter** (largo 100, 0/0/0/0).
- **"100" en vocales y en consonantes, y 44/44/12, a 320, 360, 375, 390 y 430 px:** las columnas no se ensancharon; el nombre y el número quedan a ≥ 12 px del borde de su ficha. Es con la letra de Windows: **no dice nada de SF Pro** (bordes de 360 px y de la letra a 320 px).
- **100 caracteres de cada grupo a 390, 375 y 320 px, en claro y oscuro:** el ancho de la página fue igual al de la pantalla en los 30 casos medidos (24 de 100 caracteres y 6 de texto mezclado de 52) y el campo no pasó de 176 px. A ojo revisé solo dos: 375 claro con "100" en Números y 320 oscuro con "100" en Vocales; las imágenes y el "100" se ven completos. También 320 claro con texto mezclado.
- **Toques y dobles clics en las 4 fichas:** conteos iguales. Tocar la etiqueta vuelve a activar el campo y se puede seguir escribiendo.

## Notas para el Manager
- En `evidence/breaker-user/` quedan las capturas `probe-*.png` de las sondas. Las que respaldan algo de este reporte son `probe-girado-vuelta`, `probe-after-taps`, `probe-frase50`, `probe-7-lines`, `probe-375-light-100-digit`, `probe-320-dark-100-vowel` y `probe-320-light-mixed`. La subcarpeta `run/` es la salida de Playwright y no hace falta guardarla.
- No encontré el puerto 4173 ocupado con error. Playwright puede reutilizar un servidor que ya esté abierto, y no comprobé si lo hizo; según el paquete, sería el mismo commit.
- No probé: teclado real, pellizco para acercar, composición del teclado, arrastrar y soltar, VoiceOver, cambio de modo con la app abierta ni la versión publicada.

## Lecciones propuestas
- Cuando un cambio es de espacios o de tope de alto en un campo que crece, medir que el alto **vuelve** al del campo vacío por cada camino que cambia el texto (borrar, reemplazar, deshacer, volver atrás), no solo que crece — es lo que movería las fichas sin que cambie ningún conteo. → VEGU

STATUS: DONE
