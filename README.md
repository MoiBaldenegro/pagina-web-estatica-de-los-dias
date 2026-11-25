# Días feriados 2027 en México

Página web estática (sin build) con los días feriados de 2027.

## Instalar
```
npm install
```

## Correr
```
npm start
```
Abre http://localhost:8080. (También sirve cualquier servidor estático en la raíz.)

## Probar
```
npm test
```

## Despliegue (GitHub Pages)

El workflow `.github/workflows/pages.yml` corre `npm ci && npm test` en cada push a `main`, copia `index.html` y `src` a `_site` y despliega con `deploy-pages`.

Configuración requerida una sola vez: en el repositorio, **Settings → Pages → Build and deployment → Source: "GitHub Actions"**.

## Accesibilidad y responsive (checklist)

- [x] HTML semántico: `lang="es"`, un `<main>`, un `<h1>`, secciones con título, fechas en `<time>`.
- [x] Enlace "Saltar a la lista de feriados" y foco visible (`:focus-visible`) en enlaces.
- [x] Cuenta regresiva con `role="status"` / `aria-live="polite"`.
- [x] Contraste AA (≥ 4.5:1) de los pares de color, verificado en `tests/a11y.test.js`.
- [x] Estados (próximo, pasado, fin de semana) con texto, no solo color.
- [x] Legible a 360 px: sin ancho fijo, `overflow-wrap`, espaciado reducido en ≤ 400 px.

## Estructura

- `index.html`: página; `src/`: módulos ES (`dates`, `holidays`, `countdown`, `render`, `sources`, `main`) y `styles.css`; `tests/`: Vitest; `docs/`: visión y arquitectura.
- `npm run test:tz` corre la suite en varias zonas horarias.
