# P-10 — prueba de punta a punta sobre la versión publicada

**Fecha:** 2026-11-26 · **Quién corrió:** Manager · **Archivo:** `tests/e2e/published.spec.ts` (P-2, TC-001, TC-002, TC-024)

## Rojo (la prueba detecta una app que no cuenta)
- Dirección única de la preview del lote 2 (commit `bc098a3`, pantalla sin conteo): `https://contapp-96wddn9hr-jdrodriguez1000-8207s-projects.vercel.app` (`curl -sI` → 200).
- Comando: `E2E_BASE_URL=<dirección> npm run test:published` → **1 falla, 3 pasan**.
- TC-002 falla en `counts after "c"`: esperado `0/1/0/0`, recibido `0/0/0/0` (la razón correcta). P-2, TC-001 y TC-024 pasan: son controles del estado inicial (ver reporte del tester, lote 5).
- Se descartó la preview del lote 1 (`f633d79`): no tiene campo, el rojo fallaría por la pantalla y no por el conteo.

## Verde
- Dirección estable de la rama: `https://contapp-git-feature-vs-00-588149-jdrodriguez1000-8207s-projects.vercel.app` (código del commit `975b26d`; lo posterior es solo documentos y pruebas) (`curl -sI` → 200).
- Resultado: **4 passed (7.0s)**. Capturas de esta corrida (las del rojo quedaron sobrescritas): `tc-001-al-abrir.png`, `tc-002-casa.png`, `tc-024-despues-de-recargar.png`.
- Pendiente: repetir el verde sobre la preview del commit que se va a aceptar, y la lista manual del iPhone (`iphone-manual.md`).
