# Comprobación manual en el iPhone — ronda 1 (VS-001)
**Fecha:** 2026-11-26 · **Commit:** `25baa39` · **Dónde:** preview de la rama en el iPhone del usuario (Safari)

Lo hizo el usuario y lo reportó al Manager: "hice las cuatro pruebas y trabaja exactamente como se esperaba".

| # | Prueba | Caso | Esperado | Resultado |
|---|---|---|---|---|
| 1 | Escribir "casa 12", abrir otra dirección en la misma pestaña y tocar "atrás" | TC-043 | Campo vacío y los 4 en 0 | Como se esperaba |
| 2 | Con "casa", intentar escribir o pegar "ç" | TC-016 a TC-018 | No entra; 2/2/0/0 | Como se esperaba |
| 3 | Después de la 2, deshacer (agitar o tres dedos) | TC-044 | Nunca aparece la "ç" ni texto repetido | Como se esperaba |
| 4 | Con "casa", seleccionar "as" y pegar "a" | TC-047 | Queda "caa" | Como se esperaba |

Sin fotos: el usuario no reportó nada raro.
