import { todayInMexicoCity } from './dates.js';
import { getHolidays2027 } from './holidays.js';
import { renderHolidays } from './render.js';

export const TITULO = 'Días feriados 2027 en México';

/**
 * Inicializa la página: calcula "hoy" en Ciudad de México y pinta los 7
 * feriados. `now` y `doc` se inyectan para poder probar la función.
 */
export function initPage(now = new Date(), doc = globalThis.document) {
  const holidays = getHolidays2027();
  const today = todayInMexicoCity(now);

  const container = doc.getElementById('lista-feriados');
  if (container) renderHolidays(container, holidays, today, doc);

  const estado = doc.getElementById('estado');
  if (estado) {
    estado.textContent = `Mostrando los ${holidays.length} feriados obligatorios de 2027.`;
  }

  return { holidays, today };
}

if (typeof document !== 'undefined') {
  initPage();
}
