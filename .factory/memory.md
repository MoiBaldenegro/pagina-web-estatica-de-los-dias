# Memoria de Página web estática de los días

Decisiones, convenciones y aprendizajes que cualquier agente futuro debe conocer.
Agrega entradas cortas y fechadas; no borres las de otros salvo que ya no sean ciertas.
- 2026-11-25: Feriados 2027 por LFT art.74 en docs/vision.md; LFT no traslada fines de semana; verificar fuentes al implementar.
- 2026-11-25: Arquitectura en docs/architecture.md: sin build, fechas como strings YYYY-MM-DD, 'ahora' inyectado, tests Vitest en node.
- 2026-11-25: Tests en tests/*.test.js; npm start usa npx http-server (puerto 8080); main.js tolera entorno sin document.
- 2026-11-25: `src/holidays.js` listo. `getHolidays2027()` → 7 objetos `{id, name, originalDate, restDate, weekday (0-6), isWeekend}` ordenados; `getNextHoliday(holidays, today)` (incluye hoy, null tras el último); `getStatus(holiday, today, nextHoliday?)` → `past|next|upcoming`. `today` siempre ISO `YYYY-MM-DD` de CDMX.
- 2026-11-25: `src/dates.js` listo. API: `todayInMexicoCity(now)` (Intl en-CA + formatToParts, TZ America/Mexico_City), `nthWeekdayOfMonth(year, month 1-12, weekday 0-6, n)` → ISO o null, `weekdayOf`, `isWeekend`, `daysBetween(a,b)=b-a`, `weekdayNameEs/Of`, `formatDateEs`, `formatDateLongEs`, `parseIso`. `npm run test:tz` valida con 3 TZ.
- 2026-11-25: `src/render.js` listo. `buildHolidayViewModel(holidays, today)` puro; `renderHolidays(container, holidays, today, doc=globalThis.document)` pinta `<ul class="holidays">` de `<li class="holiday holiday--{status}">` con badges textuales `badge--next|past|weekend`. `main.js` expone `initPage(now, doc)` y se auto-ejecuta solo si hay `document`. Tests de render usan un DOM falso en `tests/render.test.js` (no se agregó jsdom).
