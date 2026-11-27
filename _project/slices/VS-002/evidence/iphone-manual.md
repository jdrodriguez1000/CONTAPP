# VS-002 — P-7: verificación manual en el iPhone del usuario

- **Fecha:** 2026-11-27 (11:33 a 11:52)
- **Quién:** el usuario, en su iPhone con Safari; anota el Manager.
- **Dirección:** `https://contapp-r2rx70hdp-jdrodriguez1000-8207s-projects.vercel.app` (preview de `fd57232` publicada de nuevo, la misma del verde de P-6, sin barra de Vercel). El código de la app no cambió desde entonces (`5078227` solo agrega evidencia).
- **Lista:** `reports/tester.md`, "# Lote 4", "Lista de verificación para P-7".

## Resultados

| Punto | Caso | Modo / teclado | Conteo visto | ¿4 grupos completos y la línea a la vista? | Foto |
|---|---|---|---|---|---|
| 1 (TC-057) | Nombres tapados | claro | — | El usuario: con los nombres tapados, un niño reconoce de qué se trata cada grupo por el dibujo → **pasa** | sin foto (respuesta del usuario) |
| 2a (TC-061) | campo vacío | claro / letras | 0/0/0/0 ✓ | Sí | `p7-2a-claro.jpg` |
| 2b (TC-061) | `pingüino` | claro / letras | 4/4/0/0 ✓ | Sí | `p7-2b-claro.jpg` |
| 2c (TC-061) | `la casa` + salto + `el sol` | oscuro / letras | 5/6/0/0 ✓, 2 renglones | Sí | `p7-2c-oscuro.jpg` |
| 2d (TC-061) | frase de 50 | claro / letras | 17/20/0/1 ✓ | Sí | `p7-2d-claro.jpg` |
| 3 | frase de 50 | — | — | Ocupa **2 líneas** → no hace falta otra frase | `p7-2d-claro.jpg` |
| 4 (TC-062) | `pingüino 123` | oscuro / "123" | 4/4/3/0 ✓ | Sí | `p7-4-pinguino-123-oscuro.jpg` |
| 4 (TC-062) | frase de 50 | oscuro / "123" | 17/20/0/1 ✓ | Sí | `p7-4-frase50-123-oscuro.jpg` |
| 4 | dibujos y colores en oscuro | oscuro | — | Se distinguen bien los 4 | las fotos en oscuro |

**Resultado: P-7 pasa.** Ningún grupo queda tapado con el teclado de letras ni con el "123". El teclado "123" tiene la misma altura que el de letras.

## Notas
- **2c en claro (`p7-2c-claro-sin-salto.jpg`):** el primer intento quedó en un solo renglón porque se escribió un espacio en vez de "intro"; no es defecto (el campo es `textarea` y acepta el salto). Se repitió en oscuro con "intro".
- **Punto 5, solo para saber:**
  - `p7-5-pinguino-emoji-oscuro-sin-teclado.jpg`: `pingüino 😃` con el teclado **cerrado** da 4/4/0/1. No se tomó con el teclado de emojis abierto.
  - `p7-5-frase-larga-produccion-oscuro.jpg`: se tomó en **producción** (v0.004.000, sin imágenes) y con la frase sin "Mateo" (94 caracteres): 4 líneas, nada cortado. No sirve para revisar A-001 con las fichas nuevas; A-001 queda pendiente de esa observación.
