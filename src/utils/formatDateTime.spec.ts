import { describe, expect, it } from 'vitest';

import { formatCreationDate, formatCreationTime } from './formatDateTime';

describe('formatCreationDate', () => {
    it.for([
        { iso: '2026-01-05T10:00:00Z', expected: '05-jan-26' },
        { iso: '2026-09-27T10:00:00Z', expected: '27-sep-26' },
        { iso: '2026-12-31T10:00:00Z', expected: '31-dec-26' },
        { iso: '2005-03-08T10:00:00Z', expected: '08-mar-05' },
    ])('formats $iso as dd-mmm-yy', ({ iso, expected }) => {
        expect(formatCreationDate(iso)).toBe(expected);
    });

    it('returns an empty string for an invalid date', () => {
        expect(formatCreationDate('not-a-date')).toBe('');
    });
});

describe('formatCreationTime', () => {
    it('formats the time as hh:mm in 24 hour notation', () => {
        expect(formatCreationTime('2026-09-27T10:05:00Z')).toMatch(/^\d{2}:\d{2}$/);
    });

    it('returns an empty string for an invalid date', () => {
        expect(formatCreationTime('not-a-date')).toBe('');
    });
});
