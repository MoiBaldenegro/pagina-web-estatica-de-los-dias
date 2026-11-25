import { formatDateEs, formatDateLongEs, weekdayNameOf } from './dates.js';
import { buildCountdown } from './countdown.js';
import { getNextHoliday, getStatus } from './holidays.js';

const STATUS_LABELS = {
  next: 'Próximo feriado',
  past: 'Pasado',
  upcoming: '',
};

function createElement(doc, tag, className, text) {
  const node = doc.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/**
 * Convierte la lista de feriados en filas listas para pintar. Es una función
 * pura: recibe `today` (ISO de Ciudad de México) y no toca el DOM.
 */
export function buildHolidayViewModel(holidays, today) {
  const next = getNextHoliday(holidays, today);
  return holidays.map((holiday) => {
    const status = getStatus(holiday, today, next);
    return {
      id: holiday.id,
      name: holiday.name,
      restDate: holiday.restDate,
      restDateLabel: formatDateLongEs(holiday.restDate),
      originalDate: holiday.originalDate,
      originalDateLabel: formatDateEs(holiday.originalDate),
      weekday: holiday.weekday,
      weekdayLabel: weekdayNameOf(holiday.restDate),
      isWeekend: holiday.isWeekend,
      status,
      statusLabel: STATUS_LABELS[status],
      isNext: status === 'next',
      isPast: status === 'past',
    };
  });
}

function createBadge(doc, modifier, text) {
  return createElement(doc, 'li', `badge badge--${modifier}`, text);
}

/**
 * Crea el `<li>` de un feriado ya convertido con `buildHolidayViewModel`.
 * Las marcas usan texto además de clases de color.
 */
export function createHolidayElement(holiday, doc = globalThis.document) {
  const item = createElement(doc, 'li', `holiday holiday--${holiday.status}`);
  item.setAttribute('data-id', holiday.id);

  item.appendChild(createElement(doc, 'h2', 'holiday__name', holiday.name));

  const rest = createElement(doc, 'p', 'holiday__row');
  rest.appendChild(createElement(doc, 'span', 'holiday__label', 'Descanso: '));
  const restTime = createElement(doc, 'time', 'holiday__date', holiday.restDateLabel);
  restTime.setAttribute('datetime', holiday.restDate);
  rest.appendChild(restTime);
  item.appendChild(rest);

  const original = createElement(doc, 'p', 'holiday__row');
  original.appendChild(createElement(doc, 'span', 'holiday__label', 'Fecha original: '));
  const originalTime = createElement(
    doc,
    'time',
    'holiday__date',
    holiday.originalDateLabel,
  );
  originalTime.setAttribute('datetime', holiday.originalDate);
  original.appendChild(originalTime);
  item.appendChild(original);

  item.appendChild(
    createElement(doc, 'p', 'holiday__row', `Día: ${holiday.weekdayLabel}`),
  );

  const badges = createElement(doc, 'ul', 'holiday__badges');
  badges.setAttribute('aria-label', 'Marcas del feriado');
  if (holiday.isNext) badges.appendChild(createBadge(doc, 'next', holiday.statusLabel));
  if (holiday.isPast) badges.appendChild(createBadge(doc, 'past', holiday.statusLabel));
  if (holiday.isWeekend) {
    badges.appendChild(createBadge(doc, 'weekend', 'Fin de semana'));
  }
  if (badges.children.length > 0) item.appendChild(badges);

  return item;
}

/**
 * Pinta la cuenta regresiva dentro de `container` y devuelve el resultado de
 * `buildCountdown`. `today` debe venir ya en hora de Ciudad de México.
 */
export function renderCountdown(container, holidays, today, doc = globalThis.document) {
  const countdown = buildCountdown(holidays, today);
  container.textContent = countdown.message;
  container.setAttribute('data-kind', countdown.kind);
  if (countdown.days !== null) {
    container.setAttribute('data-days', String(countdown.days));
  }
  return countdown;
}

/**
 * Pinta la lista completa de feriados dentro de `container`, reemplazando su
 * contenido. `doc` se inyecta para poder probar sin navegador.
 */
export function renderHolidays(container, holidays, today, doc = globalThis.document) {
  const rows = buildHolidayViewModel(holidays, today);
  const list = createElement(doc, 'ul', 'holidays');
  list.setAttribute('aria-label', 'Feriados 2027 en México');
  for (const row of rows) list.appendChild(createHolidayElement(row, doc));
  container.replaceChildren(list);
  return list;
}
