import { describe, expect, it } from 'vitest';
import { formatINR, rupeesToPaise } from './money';
import { toCategoryKey } from './text';

describe('money', () => {
  it('converts rupees to paise without float errors', () => {
    expect(rupeesToPaise(1999.99)).toBe(199999);
  });
  it('formats INR', () => {
    expect(formatINR(250000000)).toContain('25,00,000');
  });
});

describe('categoryKey', () => {
  it('groups Catering and catering together', () => {
    expect(toCategoryKey('  Catering ')).toBe(toCategoryKey('catering'));
  });
});
