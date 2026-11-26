# P-2 — rojo de la prueba publicada
**Fecha:** 2026-11-26 · **Quién:** Manager

- Comando (Git Bash): `E2E_BASE_URL=https://contapp-tawny.vercel.app npm run test:published`
- Dirección usada: la de producción del proyecto en Vercel, recién importado; `main` todavía no tiene la app (plan R-9).
- La dirección respondió `HTTP/1.1 404 Not Found`.
- Resultado: **1 failed** — `expect(page).toHaveTitle("Contapp")` en `tests/e2e/published.spec.ts:13`. No arrancó servidor local (confirma que `webServer` se apaga con `E2E_BASE_URL`).
- Es el rojo esperado: la configuración funciona y la prueba falla solo porque la página publicada no tiene "Contapp".

# P-2 — verde
**Fecha:** 2026-11-26 · **Quién:** Manager y usuario

- Primer intento contra la preview: falló por **Vercel Authentication** encendida (302 a `vercel.com/sso-api`), no por la app. El usuario la apagó (opción B).
- Comando: `E2E_BASE_URL=https://contapp-git-feature-vs-00-588149-jdrodriguez1000-8207s-projects.vercel.app npm run test:published` sobre el commit `8506335`.
- La dirección respondió `HTTP/1.1 200 OK`. Resultado: **1 passed**.
- iPhone real (Safari): el usuario abrió la preview y ve "Contapp" → `p2-iphone.jpg` (en `.jpg` en vez del `.png` del plan; mismo contenido).
