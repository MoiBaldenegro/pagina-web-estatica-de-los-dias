import { describe, it, expect } from 'vitest';
import { todayInMexicoCity } from '../src/dates.js';
import { getHolidays2027 } from '../src/holidays.js';
import { buildCountdown } from '../src/countdown.js';

describe('buildCountdown', () => {
  const holidays = getHolidays2027();

  it('cuenta los días que faltan para el próximo feriado', () => {
    const result = buildCountdown(holidays, '2026-12-31');
    expect(result).toMatchObject({
      kind: 'upcoming',
      days: 1,
      message: 'Falta 1 día para Año Nuevo',
    });
    expect(result.holiday).toMatchObject({ id: 'ano-nuevo', restDate: '2027-01-01' });
  });

  it('usa plural cuando faltan varios días', () => {
    const result = buildCountdown(holidays, '2027-01-02');
    expect(result).toMatchObject({
      kind: 'upcoming',
      days: 30,
      message: 'Faltan 30 días para Constitución',
    });
    expect(result.holiday.restDate).toBe('2027-02-01');
  });

  it('anuncia "¡Es hoy!" cuando la fecha es feriado', () => {
    const result = buildCountdown(holidays, '2027-05-01');
    expect(result).toMatchObject({
      kind: 'today',
      days: 0,
      message: '¡Es hoy! Es Día del Trabajo.',
    });
    expect(result.holiday.id).toBe('dia-del-trabajo');
  });

  it('dice "¡Es hoy!" en cada uno de los 7 feriados', () => {
    for (const holiday of holidays) {
      const result = buildCountdown(holidays, holiday.restDate);
      expect(result.kind).toBe('today');
      expect(result.holiday.id).toBe(holiday.id);
      expect(result.days).toBe(0);
    }
  });

  it('avisa cuando ya pasó el último feriado de 2027', () => {
    const result = buildCountdown(holidays, '2027-12-26');
    expect(result).toMatchObject({
      kind: 'none',
      days: null,
      holiday: null,
      message: 'Ya pasaron los feriados de 2027.',
    });
  });

  it('no depende de la zona horaria: usa la fecha de CDMX ya calculada', () => {
    // 03:00 UTC del 1 de enero sigue siendo 31 de diciembre en CDMX.
    const today = todayInMexicoCity(new Date('2027-01-01T03:00:00Z'));
    expect(today).toBe('2026-12-31');
    expect(buildCountdown(holidays, today)).toMatchObject({
      kind: 'upcoming',
      days: 1,
      message: 'Falta 1 día para Año Nuevo',
    });

    // 05:30 UTC del 1 de mayo ya es 30 de abril en CDMX.
    const today2 = todayInMexicoCity(new Date('2027-05-01T05:30:00Z'));
    expect(today2).toBe('2027-04-30');
    expect(buildCountdown(holidays, today2)).toMatchObject({
      kind: 'upcoming',
      days: 1,
      message: 'Falta 1 día para Día del Trabajo',
    });
  });

  it('cuenta desde el inicio del año hasta el primer feriado', () => {
    const result = buildCountdown(holidays, '2026-12-01');
    expect(result.days).toBe(31);
    expect(result.message).toBe('Faltan 31 días para Año Nuevo');
  });
});
