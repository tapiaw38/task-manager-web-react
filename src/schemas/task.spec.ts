import { describe, expect, it } from 'vitest';

import { validateTaskPayload } from './task';

describe('validateTaskPayload', () => {
    it('sanitizes a valid payload', () => {
        expect(
            validateTaskPayload({
                title: '  Buy   milk  ',
                description: '  Go to  supermarket ',
            }),
        ).toEqual({
            data: { title: 'Buy milk', description: 'Go to supermarket' },
            errors: {},
        });
    });

    it('returns field errors for invalid payload', () => {
        expect(validateTaskPayload({ title: '  ', description: 'x'.repeat(501) })).toEqual({
            data: null,
            errors: {
                title: 'Title is required',
                description: 'Description must be at most 500 characters',
            },
        });
    });
});
