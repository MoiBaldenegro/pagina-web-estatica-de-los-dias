import { isWeekend, nthWeekdayOfMonth, weekdayOf } from './dates.js';

export const YEAR = 2027;

/**
 * Datos base de los 7 feriados obligatorios de 2027 (LFT art. 74).
 * `originalDate` es la fecha que conmemora la ley; `restDate` es el día que
 * efectivamente se descansa (recorrido a lunes cuando la ley lo indica).
 */
function baseHolidays() {
  return [
    {
      id: 'ano-nuevo',
      name: 'Año Nuevo',
      originalDate: `${YEAR}-01-01`,
      restDate: `${YEAR}-01-01`,
    },
    {
      id: 'constitucion',
      name: 'Constitución',
      originalDate: `${YEAR}-02-05`,
      restDate: nthWeekdayOfMonth(YEAR, 2, 1, 1),
    },
    {
      id: 'natalicio-b-juarez',
      name: 'Natalicio B. Juárez',
      originalDate: `${YEAR}-03-21`,
      restDate: nthWeekdayOfMonth(YEAR, 3, 1, 3),
    },
    {
      id: 'dia-del-trabajo',
      name: 'Día del Trabajo',
      originalDate: `${YEAR}-05-01`,
      restDate: `${YEAR}-05-01`,
    },
    {
      id: 'independencia',
      name: 'Independencia',
      originalDate: `${YEAR}-09-16`,
      restDate: `${YEAR}-09-16`,
    },
    {
      id: 'revolucion',
      name: 'Revolución',
      originalDate: `${YEAR}-11-20`,
      restDate: nthWeekdayOfMonth(YEAR, 11, 1, 3),
    },
    {
      id: 'navidad',
      name: 'Navidad',
      originalDate: `${YEAR}-12-25`,
      restDate: `${YEAR}-12-25`,
    },
  ];
}

/**
 * Devuelve los 7 feriados de 2027 ordenados por fecha de descanso.
 * Cada elemento incluye `weekday` (0=domingo … 6=sábado) e `isWeekend`,
 * calculados con `dates.js`. Se devuelve una copia nueva en cada llamada.
 */
export function getHolidays2027() {
  return baseHolidays()
    .map((holiday) => ({
      ...holiday,
      weekday: weekdayOf(holiday.restDate),
      isWeekend: isWeekend(holiday.restDate),
    }))
    .sort((a, b) => (a.restDate < b.restDate ? -1 : a.restDate > b.restDate ? 1 : 0));
}

/**
 * Siguiente feriado cuyo día de descanso es `today` o posterior.
 * `today` es una fecha ISO (YYYY-MM-DD) en hora de Ciudad de México.
 * Devuelve null después del último feriado.
 */
export function getNextHoliday(holidays, today) {
  let next = null;
  for (const holiday of holidays) {
    if (holiday.restDate < today) continue;
    if (next === null || holiday.restDate < next.restDate) next = holiday;
  }
  return next;
}

/**
 * Estado de un feriado respecto a `today`:
 * - 'past': su día de descanso ya pasó.
 * - 'next': es el próximo feriado (incluye el caso "hoy = 0").
 * - 'upcoming': es futuro pero hay otro feriado antes.
 *
 * El tercer argumento es el resultado de `getNextHoliday`; si se omite se
 * asume que este feriado es el próximo, útil para consultas aisladas.
 */
export function getStatus(holiday, today, nextHoliday) {
  const next =
    nextHoliday === undefined ? getNextHoliday([holiday], today) : nextHoliday;
  if (next !== null && next.id === holiday.id) return 'next';
  if (holiday.restDate < today) return 'past';
  return 'upcoming';
}
