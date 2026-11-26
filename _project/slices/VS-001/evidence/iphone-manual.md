# P-10 — comprobación manual en el iPhone real

**Fecha:** 2026-11-26 · **Quién:** el usuario, en su iPhone con Safari (D-009) · **Dirección:** preview estable de la rama (código del commit `975b26d`) · **Revisó las fotos:** Manager

| # | Qué se comprobó (plan §P-10) | Resultado | Foto (`iphone-manual/`) |
|---|---|---|---|
| 1 | "cas" + espacio con el teclado real: el texto sigue "cas " y el teclado no propone ni cambia palabras (TC-031) | ✅ cursor después del espacio, sin barra de sugerencias, 1/2/0/0 | `1-cas-espacio-teclado.jpeg` (con teclado), `1-cas-espacio.jpeg` |
| 2 | "canción" y "niño" con tilde y ñ del teclado real: 3/4/0/0 y 2/2/0/0 | ✅ | `2-cancion.jpeg`, `2-nino.jpeg` |
| 3 | Un emoji desde el teclado: Otros 1 | ✅ 0/0/0/1 | `3-emoji.jpeg` |
| 4 | La primera letra no se pone sola en mayúscula | ✅ en todas las fotos | (todas) |
| 5 | Modo oscuro del iPhone: la app cambia sola | ✅ fondo oscuro, cifras en amarillo (D-010) | `5-modo-oscuro.jpeg` |

- El botón redondo a la derecha en dos fotos es un control de accesibilidad del iPhone, no de la app.
- Junto con `published/p10-publicada.md` (rojo contra el lote 2, verde 4/4), **P-10 queda terminado**.
