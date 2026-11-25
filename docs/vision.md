# Visión del producto

## Problema
Las personas trabajadoras en México quieren saber rápido cuáles son los días de descanso obligatorio de 2027, cuánto falta para el próximo y cuáles se pierden por caer en fin de semana. Las fuentes oficiales son textos legales, no una vista práctica.

## Usuarios
Trabajadores y empleadores en México, y cualquiera que planee vacaciones o puentes. Uso principalmente en móvil, sin cuenta ni instalación.

## Alcance del MVP (verificable)
- [ ] Lista de los feriados obligatorios 2027 según el art. 74 de la Ley Federal del Trabajo (LFT), con fecha real de descanso (ya recorrida a lunes cuando aplique) y fecha original.
- [ ] Cuenta regresiva en días al próximo feriado, calculada con la fecha actual de Ciudad de México (zona `America/Mexico_City`), independiente de la zona del navegador.
- [ ] Marca visible en cada feriado que cae en sábado o domingo, con el día de la semana.
- [ ] Marca del feriado ya pasado y destacado del próximo.
- [ ] Sección de fuentes oficiales con enlaces (LFT art. 74 en diputados.gob.mx; DOF de la reforma del 17-ene-2006).
- [ ] Lógica de fechas en un módulo JS puro, con tests en Vitest (recorrido a lunes, cálculo de días, zona CDMX, fin de semana, cambio de día a medianoche CDMX, después del último feriado).
- [ ] Página accesible, responsive, publicada en GitHub Pages (workflow de GitHub Actions).

## Fuera de alcance
Otros años, días no obligatorios (Semana Santa, 2 de nov., etc.), feriados estatales o bancarios, cuentas de usuario, backend, calendarios .ics, i18n.

## Datos investigados (a verificar contra la fuente en implementación)
LFT art. 74: 1 ene; primer lunes de feb (Constitución); tercer lunes de mar (Benito Juárez); 1 may; 16 sep; tercer lunes de nov (Revolución); 1 oct cada 6 años por transmisión del Ejecutivo Federal (no en 2027; próxima 2030); 25 dic.
Resultado 2027:
| Feriado | Fecha | Día |
|---|---|---|
| Año Nuevo | 1 ene | viernes |
| Constitución | lun 1 feb (conmemora 5 feb) | lunes |
| Natalicio B. Juárez | lun 15 mar (conmemora 21 mar) | lunes |
| Día del Trabajo | 1 may | **sábado** |
| Independencia | 16 sep | jueves |
| Revolución | lun 15 nov (conmemora 20 nov) | lunes |
| Navidad | 25 dic | **sábado** |

## Supuestos
- La LFT no traslada feriados de fin de semana a viernes/lunes: se muestran en su fecha y se marcan como fin de semana.
- El 1 oct 2027 no es feriado (no hay transmisión del Poder Ejecutivo).
- Interfaz en español; sin dependencias en runtime.
- Cuenta regresiva: se calcula al cargar la página en días de calendario (hoy = 0, "¡Es hoy!").

## Stack
HTML, CSS y JavaScript (módulos ES) sin frameworks; Vitest para tests (único devDependency); GitHub Pages vía Actions.

## Criterios de éxito
- Los 7 feriados 2027 coinciden con la tabla y las fuentes citadas.
- `npm test` pasa con la lógica de fechas cubierta.
- Sitio publicado y funcional en GitHub Pages, sin errores de consola, legible en 360 px de ancho.
