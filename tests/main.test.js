import { describe, it, expect } from 'vitest';
import { TITULO } from '../src/main.js';

describe('esqueleto', () => {
  it('exporta el título de la página', () => {
    expect(TITULO).toContain('2027');
  });
});

describe('pie de página', () => {
  it('muestra el año del calendario', async () => {
    const { initPage } = await import('../src/main.js');
    const el = { textContent: '' };
    const doc = { getElementById: (id) => (id === 'anio-calendario' ? el : null) };
    initPage(new Date('2027-03-01T12:00:00Z'), doc);
    expect(el.textContent).toBe('Calendario 2027');
  });
});
