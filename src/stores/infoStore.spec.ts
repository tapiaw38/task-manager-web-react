import { describe, expect, it, vi } from 'vitest';

import type { IInfoService } from '../services/info/infoService';
import { createInfoStore } from './infoStore';

const appInfo = { application: 'Task Manager Gateway', version: '1.0.0' };
const failure = new Error('Info failed');

describe('infoStore', () => {
    it.for([
        {
            name: 'loads application information',
            service: { get: vi.fn().mockResolvedValue(appInfo) } satisfies IInfoService,
            expectedData: appInfo,
            expectedError: null,
        },
        {
            name: 'keeps failure state after first request',
            service: { get: vi.fn().mockRejectedValue(failure) } satisfies IInfoService,
            expectedData: null,
            expectedError: failure,
        },
    ])('$name', async ({ service, expectedData, expectedError }) => {
        const store = createInfoStore(service);

        expect(store.getState().hasLoaded).toBe(false);

        await store.getState().get();

        expect(store.getState().data).toEqual(expectedData);
        expect(store.getState().error).toEqual(expectedError);
        expect(store.getState().hasLoaded).toBe(true);
        expect(store.getState().loading).toBe(false);
    });
});
