# Handoff
- Hecho: issue #8. Sección "Fuentes oficiales" (`<section>` con `#lista-fuentes` en index.html, renderizada por `src/sources.js` → `SOURCES`, `renderSources`, llamado desde `initPage`). Enlaces con `rel="noopener noreferrer"`.
- URLs (HTTP 200 el 2026-11-25): LFT https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf ; DOF 17-01-2006 https://www.diputados.gob.mx/LeyesBiblio/ref/lft/LFT_ref24_17ene06.pdf (vía lft.htm de diputados). No se pudo comprobar el texto del PDF (sin pdftotext); la fecha/decreto "reforma art. 74" sí consta en el índice de diputados.
- Tests: `npm test` (61) en verde.
- Siguiente: #9 (workflow Pages) y #10 (accesibilidad/responsive/README).

# Issue #9
- Hecho: .github/workflows/pages.yml + sección README. Pendiente humano: Settings → Pages → Source "GitHub Actions". Siguiente: #10.
