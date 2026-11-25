# Arquitectura

## Stack
HTML + CSS + JavaScript (módulos ES), sin frameworks ni dependencias en runtime. Vitest como único devDependency. Despliegue en GitHub Pages con GitHub Actions. Node 20+.

## Estructura de carpetas
```
/
├─ index.html            # página única (lang="es")
├─ src/
│  ├─ dates.js           # módulo PURO de fechas (sin DOM, sin Date.now implícito)
│  ├─ holidays.js        # datos/reglas de feriados 2027 (usa dates.js)
│  ├─ render.js          # construye el DOM a partir de datos ya calculados
│  ├─ main.js            # punto de entrada: obtiene "ahora", llama a lógica y render
│  └─ styles.css
├─ tests/
│  ├─ dates.test.js
│  └─ holidays.test.js
├─ .github/workflows/pages.yml   # test + deploy
├─ package.json          # "type": "module", scripts: test, start
└─ docs/ (vision, architecture, backlog)
```
El sitio se sirve tal cual desde la raíz (sin build). El workflow publica `index.html` y `src/` (carpeta `_site` copiada en el job).

## Módulo de fechas puro (`src/dates.js`)
Reglas: funciones sin efectos; el "ahora" se inyecta como parámetro (`Date` o timestamp). Las fechas de calendario se representan como `{year, month, day}` o string `YYYY-MM-DD`, nunca como `Date` local, para evitar errores de zona.
API propuesta:
- `todayInMexicoCity(now)` → `YYYY-MM-DD` usando `Intl.DateTimeFormat('en-CA', {timeZone:'America/Mexico_City'})`.
- `nthWeekdayOfMonth(year, month, weekday, n)` → fecha (n-ésimo lunes).
- `weekdayOf(isoDate)` → 0–6 calculado en UTC; `isWeekend(isoDate)`.
- `daysBetween(isoA, isoB)` → entero (diferencia en UTC de medianoche).
- `formatDateEs(isoDate)` / nombre del día en español.

`src/holidays.js`: `getHolidays2027()` devuelve lista con `{id, name, originalDate, restDate, weekday, isWeekend}`; `getNextHoliday(holidays, today)` y `getStatus(holiday, today)` (`past|next|upcoming`), `null` tras el último feriado.

## Estrategia de tests (Vitest)
- Entorno `node`; solo se prueba lógica pura (no DOM). `npm test` = `vitest run`.
- Casos obligatorios: recorrido a lunes (1.er lunes feb, 3.er lunes mar/nov), `daysBetween`, zona CDMX (UTC vs CDMX, ej. `2027-01-01T03:00Z` sigue siendo 31 dic en CDMX), fin de semana (1 may y 25 dic), cambio de día a medianoche CDMX, "hoy = 0", después del último feriado, tabla completa de 7 feriados 2027 contra vision.md.
- Los tests no dependen de la zona del sistema (probar con `TZ` distintas).

## Cómo correr y probar
- `npm install` · `npm test` · `npm start` (servidor estático local, p. ej. `npx serve .`/`python -m http.server`; documentar el elegido en README).

## Despliegue
Workflow `pages.yml`: en push a `main` corre `npm ci && npm test`, copia `index.html` y `src/` a `_site`, y usa `actions/upload-pages-artifact` + `actions/deploy-pages`. Requiere activar Pages con fuente "GitHub Actions" en el repo (acción humana si no está activa).

## Accesibilidad / UI
Móvil primero (legible a 360 px), HTML semántico (`<main>`, `<table>` o lista), contraste AA, estado no solo por color (texto "Pasado", "Próximo", "Fin de semana"), `aria-live` no necesario (cuenta estática al cargar).
