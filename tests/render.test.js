import { describe, it, expect } from 'vitest';
import { getHolidays2027 } from '../src/holidays.js';
import {
  buildHolidayViewModel,
  createHolidayElement,
  renderHolidays,
} from '../src/render.js';
import { initPage } from '../src/main.js';

class FakeNode {
  constructor(tag) {
    this.tagName = tag.toUpperCase();
    this.children = [];
    this.attributes = {};
    this.className = '';
    this._text = '';
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  replaceChildren(...nodes) {
    this.children = nodes.slice();
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
  }

  getAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this.attributes, name)
      ? this.attributes[name]
      : null;
  }

  get textContent() {
    return this._text + this.children.map((child) => child.textContent).join('');
  }

  set textContent(value) {
    this._text = String(value);
    this.children = [];
  }
}

function fakeDocument() {
  return {
    createElement: (tag) => new FakeNode(tag),
  };
}

function findByClass(node, className, found = []) {
  if (String(node.className).split(' ').includes(className)) found.push(node);
  for (const child of node.children) findByClass(child, className, found);
  return found;
}

describe('buildHolidayViewModel', () => {
  const holidays = getHolidays2027();

  it('devuelve los 7 feriados con fechas y día de la semana', () => {
    const rows = buildHolidayViewModel(holidays, '2026-12-31');
    expect(rows).toHaveLength(7);
    expect(rows.map((row) => row.id)).toEqual(holidays.map((h) => h.id));
    for (const row of rows) {
      expect(row.restDateLabel).toContain(row.weekdayLabel);
      expect(row.restDateLabel).toContain(row.restDate.slice(0, 4));
      expect(row.originalDateLabel).toMatch(/\d+ de \w+ de 2027/);
    }
  });

  it('marca "Fin de semana" solo el 1 de mayo y el 25 de diciembre', () => {
    const rows = buildHolidayViewModel(holidays, '2026-12-31');
    const finesDeSemana = rows.filter((row) => row.isWeekend).map((row) => row.id);
    expect(finesDeSemana).toEqual(['dia-del-trabajo', 'navidad']);
  });

  it('antes del año marca el primero como próximo y el resto upcoming', () => {
    const rows = buildHolidayViewModel(holidays, '2026-12-31');
    expect(rows[0]).toMatchObject({
      status: 'next',
      isNext: true,
      isPast: false,
      statusLabel: 'Próximo feriado',
    });
    expect(rows.slice(1).every((row) => row.status === 'upcoming')).toBe(true);
  });

  it('en un feriado marca los anteriores como Pasado y ese como próximo', () => {
    const rows = buildHolidayViewModel(holidays, '2027-05-01');
    expect(rows.slice(0, 3).every((row) => row.status === 'past')).toBe(true);
    expect(rows.slice(0, 3).every((row) => row.statusLabel === 'Pasado')).toBe(true);
    expect(rows[3]).toMatchObject({ status: 'next', statusLabel: 'Próximo feriado' });
    expect(rows.slice(4).every((row) => row.status === 'upcoming')).toBe(true);
  });

  it('después del último feriado todos son Pasado', () => {
    const rows = buildHolidayViewModel(holidays, '2027-12-26');
    expect(rows.every((row) => row.status === 'past')).toBe(true);
    expect(rows.every((row) => row.statusLabel === 'Pasado')).toBe(true);
  });
});

describe('createHolidayElement', () => {
  it('incluye fecha de descanso, fecha original, día y marcas como texto', () => {
    const holidays = getHolidays2027();
    const row = buildHolidayViewModel(holidays, '2027-05-01')[3];
    const item = createHolidayElement(row, fakeDocument());
    const texto = item.textContent;
    expect(texto).toContain('Día del Trabajo');
    expect(texto).toContain(row.restDateLabel);
    expect(texto).toContain(row.originalDateLabel);
    expect(texto).toContain('sábado');
    expect(texto).toContain('Próximo feriado');
    expect(texto).toContain('Fin de semana');
    expect(findByClass(item, 'badge--weekend')).toHaveLength(1);
  });

  it('marca "Pasado" los feriados ya transcurridos', () => {
    const row = buildHolidayViewModel(getHolidays2027(), '2027-09-17')[0];
    const item = createHolidayElement(row, fakeDocument());
    expect(item.textContent).toContain('Pasado');
    expect(findByClass(item, 'badge--past')).toHaveLength(1);
  });
});

describe('renderHolidays', () => {
  it('pinta los 7 feriados dentro del contenedor', () => {
    const container = new FakeNode('section');
    const list = renderHolidays(
      container,
      getHolidays2027(),
      '2026-12-31',
      fakeDocument(),
    );
    expect(container.children).toEqual([list]);
    expect(list.tagName).toBe('UL');
    expect(list.children).toHaveLength(7);
    expect(findByClass(list, 'holiday')).toHaveLength(7);
  });

  it('solo marca fin de semana en dos feriados y un único próximo', () => {
    const container = new FakeNode('section');
    const list = renderHolidays(
      container,
      getHolidays2027(),
      '2027-05-01',
      fakeDocument(),
    );
    expect(findByClass(list, 'badge--weekend')).toHaveLength(2);
    expect(findByClass(list, 'badge--next')).toHaveLength(1);
    expect(findByClass(list, 'badge--past')).toHaveLength(3);
  });
});

describe('initPage', () => {
  it('pinta los 7 feriados sin errores y actualiza el estado', () => {
    const doc = fakeDocument();
    const lista = new FakeNode('section');
    const estado = new FakeNode('p');
    doc.getElementById = (id) => {
      if (id === 'lista-feriados') return lista;
      if (id === 'estado') return estado;
      return null;
    };

    const result = initPage(new Date('2027-05-01T18:00:00Z'), doc);
    expect(result.holidays).toHaveLength(7);
    expect(result.today).toBe('2027-05-01');
    expect(findByClass(lista, 'holiday')).toHaveLength(7);
    expect(estado.textContent).toContain('7 feriados');
  });
});
