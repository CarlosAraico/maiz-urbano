import { describe, expect, it } from 'vitest';
import { scaleAmount } from './scale.js';

describe('scaleAmount', () => {
  it('scales linearly', () => {
    expect(scaleAmount(100, 10, 20)).toBe(200);
  });

  it('rounds to nearest integer', () => {
    expect(scaleAmount(33, 10, 3)).toBe(10);
  });

  it('throws on invalid base', () => {
    expect(() => scaleAmount(10, 0, 5)).toThrow();
  });
});
