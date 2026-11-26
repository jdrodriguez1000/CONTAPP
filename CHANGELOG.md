# Registro de cambios (CHANGELOG)

Versionado `X.YYY.ZZZ`: **X** mayor (cambio que rompe lo anterior: plataforma o metodología) · **YYY** menor (funcionalidad nueva compatible) · **ZZZ** parche (correcciones y ajustes). Al subir un número, los de la derecha vuelven a cero. `0.YYY.ZZZ` = en construcción; `1.000.000` = la app se usa con los niños en el celular, con los 4 grupos y sus imágenes.
Solo versionan los cambios al producto (catálogo, reglas o app); los cambios a la memoria del agente no. Cada versión lleva etiqueta git `vX.YYY.ZZZ`. Lo más reciente va arriba.

## [0.004.000] — 2026-11-26
### Agregado
- VS-001 "Contar en el celular" en producción (`https://contapp-tawny.vercel.app`): se escribe o pega una palabra o frase y la app muestra al instante cuántas vocales, consonantes, números y otros caracteres tiene (F-001).
- Letras de otros idiomas, números de otros alfabetos e invisibles no entran, sin aviso; tope de 100 caracteres en silencio; al recargar o volver atrás, todo vacío (D-017).
- Tildes sueltas sobre algo que no es letra no entran (D-018); solo la tecla de número y el emoji pasan completos.
### Conocido
- Deshacer y rehacer dejan de funcionar después de la primera corrección del campo, hasta recargar (DT-003).

## [0.003.000] — 2026-11-26
### Agregado
- VS-001 definida y aprobada: F-001 (42 casos de prueba), sistema de diseño C2 "Pizarra con fichas" con modo claro y oscuro, stack (D-011) y plan en 5 lotes.
- Reglas C-014 (letras en dos piezas), C-015 (caracteres raros y tilde suelta) y C-016 (pegar texto mezclado); A-001: los espacios ocupan lugar en los 100.
### Cambiado
- Letra de otro idioma desde VS-004: mensaje amable y se borra todo el texto (D-006). El carácter 101 se ignora en silencio; se retira F-005 (D-007).

## [0.002.000] — 2026-11-25
### Agregado
- Definición del producto (Fase 0): reglas de conteo C-001 a C-013, supuesto A-001 (largo máximo de 100 caracteres), catálogo de grupos GRP-001 a GRP-004 y roadmap VS-001 a VS-006.

## [0.001.000] — 2026-11-25
### Agregado
- Proyecto creado desde VEGU 2.0.
