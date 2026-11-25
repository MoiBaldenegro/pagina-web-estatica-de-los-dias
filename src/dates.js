export const TIME_ZONE = 'America/Mexico_City';

export const DIAS_SEMANA = [
  'domingo',
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
];

export const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

const MS_POR_DIA = 24 * 60 * 60 * 1000;
const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

function toDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new TypeError('Fecha inválida: se esperaba un Date o un timestamp');
  }
  return date;
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

export function parseIso(isoDate) {
  const match = ISO_RE.exec(String(isoDate));
  if (!match) {
    throw new TypeError(`Fecha inválida: se esperaba YYYY-MM-DD y llegó "${isoDate}"`);
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    throw new RangeError(`Fecha fuera de rango: "${isoDate}"`);
  }
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new RangeError(`Fecha inexistente: "${isoDate}"`);
  }
  return { year, month, day };
}

function toIsoDate(year, month, day) {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

/**
 * Devuelve la fecha de calendario (YYYY-MM-DD) "hoy" en la zona de Ciudad de
 * México, sin importar la zona horaria del entorno. El "ahora" se inyecta.
 */
export function todayInMexicoCity(now) {
  const date = toDate(now);
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = {};
  for (const part of parts) {
    if (part.type !== 'literal') values[part.type] = part.value;
  }
  return `${values.year}-${values.month}-${values.day}`;
}

/**
 * Fecha (YYYY-MM-DD) del n-ésimo `weekday` (0=domingo … 6=sábado) del mes.
 * `month` va de 1 a 12. Devuelve null si esa ocurrencia no existe en el mes.
 */
export function nthWeekdayOfMonth(year, month, weekday, n) {
  if (!Number.isInteger(year)) throw new TypeError('year debe ser entero');
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new RangeError('month debe ser un entero entre 1 y 12');
  }
  if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6) {
    throw new RangeError('weekday debe ser un entero entre 0 y 6');
  }
  if (!Number.isInteger(n) || n < 1) {
    throw new RangeError('n debe ser un entero mayor o igual a 1');
  }
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const offset = (weekday - firstWeekday + 7) % 7;
  const day = 1 + offset + (n - 1) * 7;
  const result = new Date(Date.UTC(year, month - 1, day));
  if (result.getUTCMonth() !== month - 1) return null;
  return toIsoDate(result.getUTCFullYear(), result.getUTCMonth() + 1, result.getUTCDate());
}

/** Día de la semana (0=domingo … 6=sábado) calculado siempre en UTC. */
export function weekdayOf(isoDate) {
  const { year, month, day } = parseIso(isoDate);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

/** true si la fecha cae en sábado o domingo. */
export function isWeekend(isoDate) {
  const weekday = weekdayOf(isoDate);
  return weekday === 0 || weekday === 6;
}

/**
 * Diferencia en días de calendario entre dos fechas ISO, calculada sobre
 * medianoches UTC. Positiva si `isoB` es posterior a `isoA`.
 */
export function daysBetween(isoA, isoB) {
  const a = parseIso(isoA);
  const b = parseIso(isoB);
  const msA = Date.UTC(a.year, a.month - 1, a.day);
  const msB = Date.UTC(b.year, b.month - 1, b.day);
  return Math.round((msB - msA) / MS_POR_DIA);
}

/** Nombre del día de la semana en español a partir de su índice 0–6. */
export function weekdayNameEs(weekday) {
  if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6) {
    throw new RangeError('weekday debe ser un entero entre 0 y 6');
  }
  return DIAS_SEMANA[weekday];
}

/** Nombre del día de la semana en español de una fecha ISO. */
export function weekdayNameOf(isoDate) {
  return weekdayNameEs(weekdayOf(isoDate));
}

/** Formatea una fecha ISO como "1 de febrero de 2027". */
export function formatDateEs(isoDate) {
  const { year, month, day } = parseIso(isoDate);
  return `${day} de ${MESES[month - 1]} de ${year}`;
}

/** Formatea una fecha ISO como "lunes 1 de febrero de 2027". */
export function formatDateLongEs(isoDate) {
  return `${weekdayNameOf(isoDate)} ${formatDateEs(isoDate)}`;
}
