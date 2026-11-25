import { describe, it, expect } from 'vitest';
import { TITULO } from '../src/main.js';

describe('esqueleto', () => {
  it('exporta el título de la página', () => {
    expect(TITULO).toContain('2027');
  });
});
