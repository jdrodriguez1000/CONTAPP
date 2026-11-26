# P-2 — rojo de la prueba publicada
**Fecha:** 2026-11-26 · **Quién:** Manager

- Comando (Git Bash): `E2E_BASE_URL=https://contapp-tawny.vercel.app npm run test:published`
- Dirección usada: la de producción del proyecto en Vercel, recién importado; `main` todavía no tiene la app (plan R-9).
- La dirección respondió `HTTP/1.1 404 Not Found`.
- Resultado: **1 failed** — `expect(page).toHaveTitle("Contapp")` en `tests/e2e/published.spec.ts:13`. No arrancó servidor local (confirma que `webServer` se apaga con `E2E_BASE_URL`).
- Es el rojo esperado: la configuración funciona y la prueba falla solo porque la página publicada no tiene "Contapp".
