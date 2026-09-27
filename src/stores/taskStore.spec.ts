import { describe, expect, it, vi } from 'vitest';

import { createTaskStore } from './taskStore';
import type { ITaskService } from '../services/tasks/taskService';
import type { Task } from '../types/task';

const task: Task = {
    id: 'task-1',
    title: 'Buy milk',
    description: 'Go to the supermarket',
    completed: false,
    createdAt: '2026-09-27T10:05:00Z',
    updatedAt: '2026-09-27T10:05:00Z',
};

const createService = (): ITaskService => ({
    list: vi.fn().mockResolvedValue({ data: [task], total: 1 }),
    create: vi.fn().mockResolvedValue({ data: task }),
    complete: vi.fn().mockResolvedValue({ data: { ...task, completed: true } }),
    remove: vi.fn().mockResolvedValue(undefined),
});

describe('createTaskStore', () => {
    it('lists tasks and records loaded state', async () => {
        const service = createService();
        const store = createTaskStore(service);

        await store.getState().list();

        expect(store.getState()).toMatchObject({
            tasks: [task],
            total: 1,
            hasLoaded: true,
            loadingList: false,
            error: null,
        });
    });

    it('keeps list error and clears loading state', async () => {
        const service = createService();
        const error = new Error('List failed');
        service.list = vi.fn().mockRejectedValue(error);
        const store = createTaskStore(service);

        await expect(store.getState().list()).rejects.toThrow('List failed');

        expect(store.getState()).toMatchObject({ error, hasLoaded: true, loadingList: false });
    });

    it('creates a task and refreshes the list', async () => {
        const service = createService();
        const store = createTaskStore(service);
        const payload = { title: task.title, description: task.description };

        await expect(store.getState().create(payload)).resolves.toEqual(task);

        expect(service.create).toHaveBeenCalledWith(payload);
        expect(service.list).toHaveBeenCalledOnce();
        expect(store.getState().creating).toBe(false);
    });

    it('updates completion state without listing again', async () => {
        const service = createService();
        const store = createTaskStore(service);
        store.setState({ tasks: [task], total: 1 });

        await expect(store.getState().complete(task.id, true)).resolves.toEqual({
            ...task,
            completed: true,
        });

        expect(service.complete).toHaveBeenCalledWith(task.id, true);
        expect(store.getState()).toMatchObject({
            tasks: [{ ...task, completed: true }],
            completingId: null,
        });
    });

    it('deletes a task and refreshes the list', async () => {
        const service = createService();
        const store = createTaskStore(service);

        await store.getState().remove(task.id);

        expect(service.remove).toHaveBeenCalledWith(task.id);
        expect(service.list).toHaveBeenCalledOnce();
        expect(store.getState().deletingId).toBeNull();
    });
});
