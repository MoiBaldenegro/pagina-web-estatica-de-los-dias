# Handoff
- Hecho: issue #7. Cuenta regresiva al próximo feriado calculada con la fecha de CDMX (`todayInMexicoCity`), independiente de la zona del navegador. Muestra "¡Es hoy! Es X.", "Falta 1 día para X", "Faltan N días para X" o "Ya pasaron los feriados de 2027."
- Archivos: `src/countdown.js` (nuevo; `buildCountdown(holidays, today)` puro), `src/render.js` (`renderCountdown(container, holidays, today, doc)`), `src/main.js` (`initPage` pinta `#cuenta-regresiva` y devuelve `countdown`), `index.html` (nuevo `<p id="cuenta-regresiva">`), `src/styles.css` (estilo `.countdown` y estados por `data-kind`), `tests/countdown.test.js` (nuevo) y `tests/render.test.js` (3 casos de render + initPage).
- API countdown: `buildCountdown` → `{kind:'upcoming'|'today'|'none', days, holiday, message}`; `days === 0` es hoy, `holiday === null` y `days === null` tras el último feriado.
- Tests: `npm test` (58) y `npm run test:tz` (UTC/CDMX/Tokio, 58 cada uno) en verde.
- Siguiente: issues abiertos #8 (fuentes oficiales), #9 (workflow Pages) y #10 (accesibilidad/responsive/README); no adelantar su trabajo.
