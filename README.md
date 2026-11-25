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
