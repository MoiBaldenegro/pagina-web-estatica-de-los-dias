import { describe, it, expect } from 'vitest';
import {
  todayInMexicoCity,
  nthWeekdayOfMonth,
  weekdayOf,
  isWeekend,
  daysBetween,
  weekdayNameEs,
  weekdayNameOf,
  formatDateEs,
  formatDateLongEs,
} from '../src/dates.js';

describe('todayInMexicoCity', () => {
  it('usa la fecha de Ciudad de México, no la de UTC', () => {
    expect(todayInMexicoCity(new Date('2027-01-01T03:00:00Z'))).toBe('2026-12-31');
    expect(todayInMexicoCity(new Date('2027-01-01T05:59:59Z'))).toBe('2026-12-31');
    expect(todayInMexicoCity(new Date('2027-01-01T06:00:00Z'))).toBe('2027-01-01');
  });

  it('cambia de día a medianoche de Ciudad de México', () => {
    expect(todayInMexicoCity(new Date('2027-06-15T05:59:59Z'))).toBe('2027-06-14');
    expect(todayInMexicoCity(new Date('2027-06-15T06:00:00Z'))).toBe('2027-06-15');
  });

  it('acepta un timestamp numérico', () => {
    const ts = Date.parse('2027-12-25T06:00:00Z');
    expect(todayInMexicoCity(ts)).toBe('2027-12-25');
  });

  it('no depende de la zona horaria del sistema', () => {
    const original = process.env.TZ;
    for (const tz of ['UTC', 'America/Mexico_City', 'Asia/Tokyo', 'Pacific/Kiritimati']) {
      process.env.TZ = tz;
      expect(todayInMexicoCity(new Date('2027-01-01T03:00:00Z'))).toBe('2026-12-31');
    }
    if (original === undefined) delete process.env.TZ;
    else process.env.TZ = original;
  });
});

describe('nthWeekdayOfMonth', () => {
  it('encuentra el primer lunes de febrero 2027', () => {
    expect(nthWeekdayOfMonth(2027, 2, 1, 1)).toBe('2027-02-01');
  });

  it('encuentra el tercer lunes de marzo 2027', () => {
    expect(nthWeekdayOfMonth(2027, 3, 1, 3)).toBe('2027-03-15');
  });

  it('encuentra el tercer lunes de noviembre 2027', () => {
    expect(nthWeekdayOfMonth(2027, 11, 1, 3)).toBe('2027-11-15');
  });

  it('devuelve una fecha que realmente cae en el día pedido', () => {
    for (let month = 1; month <= 12; month++) {
      for (let weekday = 0; weekday <= 6; weekday++) {
        const iso = nthWeekdayOfMonth(2027, month, weekday, 1);
        expect(weekdayOf(iso)).toBe(weekday);
      }
    }
  });

  it('devuelve null si la ocurrencia no existe en el mes', () => {
    expect(nthWeekdayOfMonth(2027, 2, 1, 5)).toBeNull();
  });

  it('valida sus argumentos', () => {
    expect(() => nthWeekdayOfMonth(2027, 13, 1, 1)).toThrow();
    expect(() => nthWeekdayOfMonth(2027, 1, 7, 1)).toThrow();
    expect(() => nthWeekdayOfMonth(2027, 1, 1, 0)).toThrow();
  });
});

describe('weekdayOf / isWeekend', () => {
  it('calcula el día en UTC sin importar la zona del sistema', () => {
    expect(weekdayOf('2027-01-01')).toBe(5);
    expect(weekdayOf('2027-05-01')).toBe(6);
    expect(weekdayOf('2027-09-16')).toBe(4);
    expect(weekdayOf('2027-12-25')).toBe(6);
  });

  it('marca sábados y domingos como fin de semana', () => {
    expect(isWeekend('2027-05-01')).toBe(true);
    expect(isWeekend('2027-12-25')).toBe(true);
    expect(isWeekend('2027-01-03')).toBe(true);
    expect(isWeekend('2027-01-01')).toBe(false);
    expect(isWeekend('2027-09-16')).toBe(false);
  });

  it('rechaza fechas mal formadas o inexistentes', () => {
    expect(() => weekdayOf('2027/01/01')).toThrow();
    expect(() => weekdayOf('2027-02-30')).toThrow();
  });
});

describe('daysBetween', () => {
  it('cuenta días entre fechas', () => {
    expect(daysBetween('2027-01-01', '2027-02-01')).toBe(31);
    expect(daysBetween('2027-01-01', '2027-01-01')).toBe(0);
    expect(daysBetween('2027-12-25', '2027-01-01')).toBe(-358);
  });

  it('es simétrico en signo', () => {
    expect(daysBetween('2027-03-15', '2027-01-01')).toBe(
      -daysBetween('2027-01-01', '2027-03-15'),
    );
  });

  it('no depende de la zona horaria del sistema', () => {
    const original = process.env.TZ;
    for (const tz of ['UTC', 'America/Mexico_City', 'Asia/Tokyo']) {
      process.env.TZ = tz;
      expect(daysBetween('2027-01-01', '2027-02-01')).toBe(31);
    }
    if (original === undefined) delete process.env.TZ;
    else process.env.TZ = original;
  });
});

describe('nombres y formato en español', () => {
  it('nombra los días de la semana', () => {
    expect(weekdayNameEs(0)).toBe('domingo');
    expect(weekdayNameEs(5)).toBe('viernes');
    expect(weekdayNameEs(6)).toBe('sábado');
  });

  it('nombra el día de una fecha ISO', () => {
    expect(weekdayNameOf('2027-01-01')).toBe('viernes');
    expect(weekdayNameOf('2027-09-16')).toBe('jueves');
  });

  it('formatea fechas en español', () => {
    expect(formatDateEs('2027-02-01')).toBe('1 de febrero de 2027');
    expect(formatDateEs('2027-12-25')).toBe('25 de diciembre de 2027');
    expect(formatDateLongEs('2027-03-15')).toBe('lunes 15 de marzo de 2027');
  });
});
