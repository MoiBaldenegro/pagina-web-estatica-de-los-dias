import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

function lum(hex) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function ratio(a, b) {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

describe('accesibilidad', () => {
  it('HTML semántico con lang, viewport, main, un h1 y skip link', () => {
    expect(html).toMatch(/<html lang="es">/);
    expect(html).toMatch(/name="viewport"/);
    expect(html.match(/<main[\s>]/g)).toHaveLength(1);
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
    expect(html).toMatch(/class="skip-link" href="#lista-feriados"/);
    expect(html).toMatch(/id="cuenta-regresiva"[^>]*aria-live="polite"/);
  });
  it('define foco visible', () => {
    expect(css).toMatch(/:focus-visible/);
  });
  it.each([
    ['#1b1f24', '#f6f7f9'],
    ['#0b5cad', '#f6f7f9'],
    ['#0b5cad', '#e7f1fb'],
    ['#5a626b', '#f6f7f9'],
    ['#5a626b', '#ffffff'],
    ['#5a626b', '#e7f1fb'],
    ['#5a626b', '#eceef1'],
    ['#ffffff', '#0b5cad'],
    ['#6b4b00', '#fff4d6'],
    ['#0a7a35', '#f6f7f9'],
  ])('contraste AA %s sobre %s', (fg, bg) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });
});
