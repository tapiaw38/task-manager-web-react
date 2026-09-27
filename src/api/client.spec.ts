import { afterEach, describe, expect, it, vi } from 'vitest';

import { ApiError, NETWORK_ERROR_CODE, UNEXPECTED_ERROR_CODE, request } from './client';
import { errorResponse, jsonResponse } from '../test/mocks/fetch';
import { taskResponseSchema } from '../schemas/task';

describe('request', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('returns JSON response and sends JSON content type', async () => {
        const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ data: 'ok' }));
        vi.stubGlobal('fetch', fetchMock);

        await expect(request<{ data: string }>('/api/tasks')).resolves.toEqual({ data: 'ok' });

        expect(fetchMock).toHaveBeenCalledWith(
            'http://localhost:8081/api/tasks',
            expect.objectContaining({ headers: { 'Content-Type': 'application/json' } }),
        );
    });

    it('returns undefined for a no-content response', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 204 })));

        await expect(request<void>('/api/tasks/task-1', { method: 'DELETE' })).resolves.toBe(
            undefined,
        );
    });

    it('maps a response that does not match its schema to an unexpected error', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ data: { id: 1 } })));

        await expect(request('/api/tasks/task-1', undefined, taskResponseSchema)).rejects.toEqual(
            expect.objectContaining({ code: UNEXPECTED_ERROR_CODE, status: 200 }),
        );
    });

    it('maps backend error body and logs request metadata', async () => {
        const logger = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        vi.stubGlobal(
            'fetch',
            vi
                .fn()
                .mockResolvedValue(errorResponse('task:shared:not-found', 'task not found', 404)),
        );

        await expect(request('/api/tasks/missing')).rejects.toMatchObject({
            code: 'task:shared:not-found',
            message: 'task not found',
            status: 404,
        });

        expect(logger).toHaveBeenCalledWith(
            'API request failed',
            expect.objectContaining({
                request: { method: 'GET', path: '/api/tasks/missing' },
                response: expect.objectContaining({ status: 404 }),
            }),
        );
    });

    it('maps malformed backend error body to unexpected error', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(
                new Response('invalid json', {
                    status: 500,
                    statusText: 'Internal Server Error',
                }),
            ),
        );

        await expect(request('/api/tasks')).rejects.toEqual(
            expect.objectContaining({ code: UNEXPECTED_ERROR_CODE, status: 500 }),
        );
    });

    it('maps network failure to network error', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));

        await expect(request('/api/tasks')).rejects.toEqual(
            expect.objectContaining({ code: NETWORK_ERROR_CODE, status: 0 }),
        );
    });

    it('preserves ApiError public fields', () => {
        const error = new ApiError('CODE', 'Message', 400, { code: 'CODE', message: 'Message' });

        expect(error).toMatchObject({
            name: 'ApiError',
            code: 'CODE',
            message: 'Message',
            status: 400,
        });
    });
});
