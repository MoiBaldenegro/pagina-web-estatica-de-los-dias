# Handoff
- Hecho: issue #5. `src/holidays.js` con `getHolidays2027()` (7 feriados 2027 de docs/vision.md), `getNextHoliday(holidays, today)` y `getStatus(holiday, today, nextHoliday?)`.
- Datos: cada feriado `{id, name, originalDate, restDate, weekday, isWeekend}`; `restDate` se calcula con `nthWeekdayOfMonth` para Constitución (1er lunes feb), Juárez (3er lunes mar) y Revolución (3er lunes nov); 1 may y 25 dic quedan marcados `isWeekend`. `weekday` es índice 0–6 (usa `weekdayNameOf` para el nombre).
- API: `getNextHoliday` devuelve el feriado con `restDate >= today` (incluye hoy = 0) y `null` después del último. `getStatus` → `past|next|upcoming`; el tercer argumento es el resultado de `getNextHoliday` y, si se omite, un feriado futuro se asume como el próximo.
- Tests: `tests/holidays.test.js` (18) comparan la tabla completa, recorrido a lunes, fin de semana, hoy = 0, entre feriados y después del último. `npm test` (38) y `npm run test:tz` (UTC/CDMX/Tokio) pasan.
- Siguiente: issue #6. `src/render.js` debe pintar la lista usando `getHolidays2027`, `getNextHoliday` y `getStatus`; `main.js` inyecta `todayInMexicoCity(new Date())`.
