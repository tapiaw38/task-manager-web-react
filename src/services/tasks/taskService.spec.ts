import { describe, expect, it, vi } from 'vitest';

import { TaskService } from './taskService';
import type { ApiClient } from '../../api/client';

const api = (): ApiClient => ({ request: vi.fn() });

describe('TaskService', () => {
    it('lists tasks through the public API', async () => {
        const client = api();
        const service = new TaskService(client);
        vi.mocked(client.request).mockResolvedValue(undefined);

        await service.list();

        expect(client.request).toHaveBeenCalledWith('/api/tasks', undefined, expect.anything());
    });

    it('creates a task through the public API', async () => {
        const client = api();
        const service = new TaskService(client);
        const payload = { title: 'Buy milk', description: 'Go to the supermarket' };
        vi.mocked(client.request).mockResolvedValue(undefined);

        await service.create(payload);

        expect(client.request).toHaveBeenCalledWith(
            '/api/tasks',
            { method: 'POST', body: JSON.stringify(payload) },
            expect.anything(),
        );
    });

    it('changes completion status through the public API', async () => {
        const client = api();
        const service = new TaskService(client);
        vi.mocked(client.request).mockResolvedValue(undefined);

        await service.complete('task 1', true);

        expect(client.request).toHaveBeenCalledWith(
            '/api/tasks/task%201/complete',
            { method: 'PATCH', body: JSON.stringify({ completed: true }) },
            expect.anything(),
        );
    });

    it('deletes a task through the public API', async () => {
        const client = api();
        const service = new TaskService(client);
        vi.mocked(client.request).mockResolvedValue(undefined);

        await service.remove('task 1');

        expect(client.request).toHaveBeenCalledWith('/api/tasks/task%201', { method: 'DELETE' });
    });
});
