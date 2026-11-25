import { daysBetween } from './dates.js';
import { getNextHoliday, YEAR } from './holidays.js';

/**
 * Construye la cuenta regresiva al próximo feriado a partir de la fecha
 * `today` (ISO YYYY-MM-DD) ya calculada en hora de Ciudad de México.
 *
 * Es una función pura: no lee el reloj ni el DOM, así que el resultado no
 * depende de la zona horaria del navegador.
 *
 * Devuelve:
 * - `kind: 'today'`   → hoy es feriado.
 * - `kind: 'upcoming'` → quedan uno o más días.
 * - `kind: 'none'`    → ya pasó el último feriado de 2027.
 */
export function buildCountdown(holidays, today) {
  const next = getNextHoliday(holidays, today);

  if (next === null) {
    return {
      kind: 'none',
      days: null,
      holiday: null,
      message: `Ya pasaron los feriados de ${YEAR}.`,
    };
  }

  const days = daysBetween(today, next.restDate);

  if (days === 0) {
    return {
      kind: 'today',
      days: 0,
      holiday: next,
      message: `¡Es hoy! Es ${next.name}.`,
    };
  }

  const message =
    days === 1
      ? `Falta 1 día para ${next.name}`
      : `Faltan ${days} días para ${next.name}`;

  return {
    kind: 'upcoming',
    days,
    holiday: next,
    message,
  };
}
