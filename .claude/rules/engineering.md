# Principios de ingeniería

> Genérico de VEGU 2.0. Se mejora en VEGU, no en la copia del proyecto; lo propio del proyecto va en `engineering-proyecto.md`, que manda si algo choca. Máximo 60 líneas.

Cinco principios, ninguno opcional. Aplican a cualquiera que trabaje en el repositorio: el Manager o un agente.

**PI-1. Razona antes de actuar.** Da una recomendación, su contra principal y las suposiciones; el análisis largo, solo si se pide. Ante ambigüedad en una **decisión de alcance, diseño o técnica**, **detente y consulta**; nunca elijas en silencio. Un **dato del dominio** que falta se propone, se registra como supuesto (`A-XXX`) y se sigue. Un subagente consulta terminando con `STATUS: BLOCKED`.

**PI-2. Simplicidad primero.** Lo mínimo que resuelva, con interfaces simples. Sin abstracciones, parámetros ni configurabilidad que nadie pidió.

**PI-3. Cambios quirúrgicos.** Solo se toca lo necesario para la tarea. No se refactoriza lo que funciona: el refactor solo toca lo escrito en la tarea en curso. **No se borra código ni contenido preexistente sin autorización.** En la memoria, `decisions.md` y `lessons.md` solo se agrega.

**PI-4. Tracer bullet primero, después slices verticales.** Todo proyecto o fase empieza con un tracer bullet (la **walking skeleton**): lo mínimo corriendo de punta a punta, de verdad. Después se construye por slices verticales: cada una es un comportamiento completo a través de todas las capas, con su respaldo en verde (PI-5). No se completa una capa antes de que exista la siguiente.
- Una slice se construye en **lotes** de pocos pasos. **Cada lote cabe en una sesión**: empieza y termina en ella, en verde y con commit. La slice completa puede tomar varias sesiones.
- Cada lote suma como máximo **~200 líneas de código** de la app, sin contar pruebas, archivos generados ni lockfiles. Si un paso no cabe, se parte en el plan antes de empezar; nunca se juntan pasos.
- Si a mitad de camino el contexto pesa, se cierra la sesión con lo que esté en verde y se sigue en otra.
- Cada slice va en su propia rama y llega a `main` con un PR; nunca se trabaja directo en `main`.

**PI-5. Orientado a comportamiento.** Toda tarea lleva algo que la respalda, y la **Definición de Terminado** es que ese algo esté en verde. Si no admite prueba automática (documentos, planes, memoria del desarrollo), el respaldo es un criterio de aceptación escrito antes y verificado al final. En código, el respaldo se escribe primero: rojo → verde → refactor; el commit va con la suite completa en verde. Una prueba de rechazo exige el **mensaje o código exacto** que recibe quien usa el sistema y comprueba que **no se guardó nada**. En el rojo se revisan también las pruebas que pasan: una prueba que pasa antes de existir el código no prueba nada.

**Lo terminado se demuestra.** Toda afirmación de "hecho", del Manager o de un agente, trae evidencia verificable: la salida de las pruebas, capturas o archivos en `_project/slices/VS-XXX/evidence/`, y la verificación independiente del Manager. Lo no verificado se dice como tal, nunca se da por hecho.
