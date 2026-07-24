import { describe, expect, it } from 'vitest';
import { getInitials, formatTenure, toDateInputValue, withAlpha } from './format';

describe('getInitials', () => {
  it('returns uppercase initials from a name', () => {
    expect(getInitials('Ada', 'Lovelace')).toBe('AL');
    expect(getInitials('grace', 'hopper')).toBe('GH');
  });
});

describe('withAlpha', () => {
  it('converts a hex colour to an rgba string', () => {
    expect(withAlpha('#6366f1', 0.5)).toBe('rgba(99, 102, 241, 0.5)');
  });
});

describe('formatTenure', () => {
  it('handles missing dates', () => {
    expect(formatTenure(undefined)).toBe('—');
  });
});

describe('toDateInputValue', () => {
  it('formats an ISO date to YYYY-MM-DD', () => {
    expect(toDateInputValue('2024-03-15T10:00:00.000Z')).toBe('2024-03-15');
  });
  it('returns empty string for missing values', () => {
    expect(toDateInputValue(undefined)).toBe('');
  });
});
