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
  it('usa el sistema de diseño MXVI y un layout de una pantalla', () => {
    expect(html).toMatch(/mxvi-design-system\/mxvi\/mxvi\.css/);
    expect(css).toMatch(/--color-background/);
    expect(css).toMatch(/height: 100dvh/);
    expect(css).toMatch(/repeat\(4, 1fr\)/);
  });
  it('define foco visible', () => {
    expect(css).toMatch(/:focus-visible/);
  });
  it.each([
    ['#ffffff', '#070716'],
    ['#b8b8c5', '#070716'],
    ['#b8b8c5', '#101018'],
    ['#B37AC2', '#070716'],
    ['#B37AC2', '#101018'],
    ['#070716', '#B37AC2'],
    ['#39C98A', '#070716'],
    ['#F7941D', '#101018'],
  ])('contraste AA %s sobre %s', (fg, bg) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });
});
