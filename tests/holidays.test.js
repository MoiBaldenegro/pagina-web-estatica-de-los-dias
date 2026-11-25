import { describe, it, expect } from 'vitest';
import {
  getHolidays2027,
  getNextHoliday,
  getStatus,
} from '../src/holidays.js';
import {
  daysBetween,
  isWeekend,
  nthWeekdayOfMonth,
  weekdayOf,
} from '../src/dates.js';

const TABLA_2027 = [
  {
    id: 'ano-nuevo',
    name: 'Año Nuevo',
    originalDate: '2027-01-01',
    restDate: '2027-01-01',
    weekday: 5,
    isWeekend: false,
  },
  {
    id: 'constitucion',
    name: 'Constitución',
    originalDate: '2027-02-05',
    restDate: '2027-02-01',
    weekday: 1,
    isWeekend: false,
  },
  {
    id: 'natalicio-b-juarez',
    name: 'Natalicio B. Juárez',
    originalDate: '2027-03-21',
    restDate: '2027-03-15',
    weekday: 1,
    isWeekend: false,
  },
  {
    id: 'dia-del-trabajo',
    name: 'Día del Trabajo',
    originalDate: '2027-05-01',
    restDate: '2027-05-01',
    weekday: 6,
    isWeekend: true,
  },
  {
    id: 'independencia',
    name: 'Independencia',
    originalDate: '2027-09-16',
    restDate: '2027-09-16',
    weekday: 4,
    isWeekend: false,
  },
  {
    id: 'revolucion',
    name: 'Revolución',
    originalDate: '2027-11-20',
    restDate: '2027-11-15',
    weekday: 1,
    isWeekend: false,
  },
  {
    id: 'navidad',
    name: 'Navidad',
    originalDate: '2027-12-25',
    restDate: '2027-12-25',
    weekday: 6,
    isWeekend: true,
  },
];

describe('getHolidays2027', () => {
  it('coincide con la tabla completa de los 7 feriados de docs/vision.md', () => {
    expect(getHolidays2027()).toEqual(TABLA_2027);
  });

  it('devuelve exactamente 7 feriados ordenados por fecha de descanso', () => {
    const holidays = getHolidays2027();
    expect(holidays).toHaveLength(7);
    const fechas = holidays.map((h) => h.restDate);
    expect(fechas).toEqual([...fechas].sort());
  });

  it('recorre a lunes los feriados que la LFT traslada', () => {
    const porId = Object.fromEntries(getHolidays2027().map((h) => [h.id, h]));
    expect(porId.constitucion.restDate).toBe(nthWeekdayOfMonth(2027, 2, 1, 1));
    expect(porId['natalicio-b-juarez'].restDate).toBe(nthWeekdayOfMonth(2027, 3, 1, 3));
    expect(porId.revolucion.restDate).toBe(nthWeekdayOfMonth(2027, 11, 1, 3));
    for (const id of ['constitucion', 'natalicio-b-juarez', 'revolucion']) {
      expect(weekdayOf(porId[id].restDate)).toBe(1);
    }
  });

  it('conserva la fecha original de cada feriado', () => {
    const porId = Object.fromEntries(getHolidays2027().map((h) => [h.id, h]));
    expect(porId.constitucion.originalDate).toBe('2027-02-05');
    expect(porId['natalicio-b-juarez'].originalDate).toBe('2027-03-21');
    expect(porId.revolucion.originalDate).toBe('2027-11-20');
    expect(porId['ano-nuevo'].originalDate).toBe(porId['ano-nuevo'].restDate);
  });

  it('marca solo el 1 de mayo y el 25 de diciembre como fin de semana', () => {
    const holidays = getHolidays2027();
    for (const holiday of holidays) {
      expect(holiday.weekday).toBe(weekdayOf(holiday.restDate));
      expect(holiday.isWeekend).toBe(isWeekend(holiday.restDate));
    }
    const finesDeSemana = holidays.filter((h) => h.isWeekend).map((h) => h.id);
    expect(finesDeSemana).toEqual(['dia-del-trabajo', 'navidad']);
  });

  it('no depende de la zona horaria del sistema', () => {
    const original = process.env.TZ;
    for (const tz of ['UTC', 'America/Mexico_City', 'Asia/Tokyo']) {
      process.env.TZ = tz;
      expect(getHolidays2027()).toEqual(TABLA_2027);
    }
    if (original === undefined) delete process.env.TZ;
    else process.env.TZ = original;
  });

  it('devuelve una copia nueva en cada llamada', () => {
    const primero = getHolidays2027();
    primero[0].name = 'modificado';
    primero.pop();
    expect(getHolidays2027()).toEqual(TABLA_2027);
  });
});

describe('getNextHoliday', () => {
  const holidays = getHolidays2027();

  it('antes del año devuelve el primer feriado', () => {
    expect(getNextHoliday(holidays, '2026-12-31').id).toBe('ano-nuevo');
  });

  it('incluye el día de hoy (hoy = 0)', () => {
    const next = getNextHoliday(holidays, '2027-01-01');
    expect(next.id).toBe('ano-nuevo');
    expect(daysBetween('2027-01-01', next.restDate)).toBe(0);
  });

  it('en un feriado intermedio devuelve ese mismo feriado', () => {
    const next = getNextHoliday(holidays, '2027-05-01');
    expect(next.id).toBe('dia-del-trabajo');
    expect(daysBetween('2027-05-01', next.restDate)).toBe(0);
  });

  it('entre feriados devuelve el siguiente día de descanso', () => {
    expect(getNextHoliday(holidays, '2027-01-02').id).toBe('constitucion');
    expect(getNextHoliday(holidays, '2027-11-16').id).toBe('navidad');
  });

  it('en el último feriado devuelve ese feriado', () => {
    const next = getNextHoliday(holidays, '2027-12-25');
    expect(next.id).toBe('navidad');
    expect(daysBetween('2027-12-25', next.restDate)).toBe(0);
  });

  it('devuelve null después del último feriado', () => {
    expect(getNextHoliday(holidays, '2027-12-26')).toBeNull();
    expect(getNextHoliday(holidays, '2028-01-01')).toBeNull();
  });
});

describe('getStatus', () => {
  const holidays = getHolidays2027();

  function estados(today) {
    const next = getNextHoliday(holidays, today);
    return holidays.map((holiday) => getStatus(holiday, today, next));
  }

  it('antes del primer feriado: el primero es next y el resto upcoming', () => {
    expect(estados('2026-12-31')).toEqual([
      'next',
      'upcoming',
      'upcoming',
      'upcoming',
      'upcoming',
      'upcoming',
      'upcoming',
    ]);
  });

  it('hoy = 0: el feriado de hoy es next, los anteriores past y los demás upcoming', () => {
    expect(estados('2027-05-01')).toEqual([
      'past',
      'past',
      'past',
      'next',
      'upcoming',
      'upcoming',
      'upcoming',
    ]);
  });

  it('un día después de un feriado lo marca past y al siguiente next', () => {
    expect(estados('2027-09-17')).toEqual([
      'past',
      'past',
      'past',
      'past',
      'past',
      'next',
      'upcoming',
    ]);
  });

  it('después del último feriado todos quedan past', () => {
    expect(estados('2027-12-26')).toEqual([
      'past',
      'past',
      'past',
      'past',
      'past',
      'past',
      'past',
    ]);
  });

  it('sin nextHoliday asume que un feriado futuro es el próximo', () => {
    expect(getStatus(holidays[3], '2027-05-01')).toBe('next');
    expect(getStatus(holidays[0], '2027-05-01')).toBe('past');
    expect(getStatus(holidays[4], '2027-05-01')).toBe('next');
  });
});
