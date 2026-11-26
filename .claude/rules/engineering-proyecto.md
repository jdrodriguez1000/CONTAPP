# Principios de ingeniería — cómo se aplican en este proyecto

> Complementa `engineering.md` (genérico de VEGU, no se edita aquí). Si algo de abajo choca con el genérico, **manda este archivo** en este proyecto. Aprobado por el usuario el 2026-11-25. Máximo 30 líneas.

**Equivalencias** (cómo se llama o se hace aquí lo que el genérico nombra en abstracto)
- **"PR a `main`"** = PR en GitHub (`jdrodriguez1000/CONTAPP`, D-004) desde la rama `feature/VS-XXX-<slug>`, abierto con `gh pr create` y fusionado tras la aceptación del usuario con commit de fusión, nunca squash ni rebase (D-011). Si la plataforma no bloquea fusiones con la CI en rojo, el Manager lo verifica.
- **"Código de la app"** (límite de ~200 líneas por lote) = carpeta `src/` (D-011).
- **"Mensaje o código exacto" de una prueba de rechazo** = el **texto exacto que aparece en la pantalla** del celular (p. ej. el aviso al pasar el largo máximo, A-001). No hay servidor que guarde datos (C-010), así que "no se guardó nada" significa que el conteo mostrado no cambió.

**Excepciones**
- Ninguna.

**Aclaraciones**
- Ninguna.
