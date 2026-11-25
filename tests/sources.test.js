import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { SOURCES, renderSources } from '../src/sources.js';

function node(tag) {
  return {
    tag, children: [], attributes: {}, textContent: '',
    appendChild(c) { this.children.push(c); return c; },
    replaceChildren(...n) { this.children = n; },
    setAttribute(k, v) { this.attributes[k] = v; },
  };
}

describe('fuentes oficiales', () => {
  it('incluye LFT art. 74 y DOF 2006 en diputados.gob.mx con https', () => {
    expect(SOURCES).toHaveLength(2);
    for (const s of SOURCES) expect(new URL(s.url).protocol).toBe('https:');
    expect(SOURCES[0].url).toContain('diputados.gob.mx');
    expect(SOURCES[1].label).toContain('17-01-2006');
  });

  it('renderSources crea enlaces con rel noopener', () => {
    const c = node('div');
    const ul = renderSources(c, SOURCES, { createElement: node });
    expect(c.children).toEqual([ul]);
    expect(ul.children).toHaveLength(2);
    for (const li of ul.children) {
      const a = li.children[0];
      expect(a.attributes.rel).toContain('noopener');
      expect(a.attributes.href).toMatch(/^https:/);
    }
  });

  it('index.html tiene los enlaces con rel noopener', () => {
    const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
    for (const s of SOURCES) expect(html).toContain(s.url);
    const links = html.match(/<a [^>]*>/g) ?? [];
    expect(links.length).toBe(2);
    for (const l of links) expect(l).toContain('noopener');
  });
});
