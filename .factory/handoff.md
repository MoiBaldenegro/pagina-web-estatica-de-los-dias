# Handoff
- Hecho: issue #4. `src/dates.js` puro (sin DOM, sin Date.now implícito) con `todayInMexicoCity`, `nthWeekdayOfMonth`, `weekdayOf`, `isWeekend`, `daysBetween`, `weekdayNameEs/Of`, `formatDateEs`, `formatDateLongEs`, `parseIso`, constantes `DIAS_SEMANA`/`MESES`.
- Convenciones: fechas ISO `YYYY-MM-DD`; `nthWeekdayOfMonth(year, month 1-12, weekday 0-6, n)`; `daysBetween(a,b)` = b - a (positivo si b es posterior); nombres de días 0=domingo.
- Tests: `tests/dates.test.js` (19) cubren zona CDMX vs UTC, medianoche CDMX, nth weekday, fin de semana, daysBetween y formato español. `npm test` pasa; `npm run test:tz` corre la suite con TZ=UTC, America/Mexico_City y Asia/Tokyo (las 3 pasan).
- Siguiente: issue #5 `src/holidays.js` + tests usando `dates.js` (7 feriados 2027 de docs/vision.md).
