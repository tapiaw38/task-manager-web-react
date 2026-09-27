import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
    createSnackbar: vi.fn(),
    list: vi.fn(),
    create: vi.fn(),
    complete: vi.fn(),
    remove: vi.fn(),
}));

vi.mock('../components/SnackbarProvider/useSnackbar', () => ({
    useSnackbar: () => ({ createSnackbar: mocks.createSnackbar }),
}));

vi.mock('../stores/taskStore', () => ({
    useTaskStore: (selector: (state: Record<string, unknown>) => unknown) =>
        selector({
            tasks: [],
            total: 0,
            error: null,
            hasLoaded: true,
            loadingList: false,
            creating: false,
            completingId: null,
            deletingId: null,
            list: mocks.list,
            create: mocks.create,
            complete: mocks.complete,
            remove: mocks.remove,
        }),
}));

import { useTask } from './useTask';

describe('useTask', () => {
    it('lists tasks and absorbs list errors into store state', async () => {
        mocks.list.mockRejectedValueOnce(new Error('List failed'));
        const { result } = renderHook(() => useTask());

        await expect(result.current.listTasks()).resolves.toBeUndefined();
    });

    it('shows success feedback after creating a task', async () => {
        mocks.create.mockResolvedValueOnce(undefined);
        const { result } = renderHook(() => useTask());

        await expect(
            result.current.createTask({ title: 'Buy milk', description: 'Go to the supermarket' }),
        ).resolves.toBe(true);

        expect(mocks.createSnackbar).toHaveBeenCalledWith({ message: 'Task created successfully' });
    });

    it('shows failure feedback after completion fails', async () => {
        mocks.complete.mockRejectedValueOnce(new Error('Completion failed'));
        const { result } = renderHook(() => useTask());

        await expect(result.current.completeTask('task-1', true)).resolves.toBe(false);

        expect(mocks.createSnackbar).toHaveBeenCalledWith({
            message: 'Completion failed',
            severity: 'error',
        });
    });

    it('shows success feedback after deleting a task', async () => {
        mocks.remove.mockResolvedValueOnce(undefined);
        const { result } = renderHook(() => useTask());

        await expect(result.current.deleteTask('task-1')).resolves.toBe(true);

        expect(mocks.createSnackbar).toHaveBeenCalledWith({ message: 'Task deleted successfully' });
    });
});
