import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TasksPage } from './TasksPage';
import { renderWithProviders } from '../test/render';

const mocks = vi.hoisted(() => ({
    getInfo: vi.fn(),
    listTasks: vi.fn(),
    createTask: vi.fn(),
    completeTask: vi.fn(),
    deleteTask: vi.fn(),
    useInfo: vi.fn(),
    useTask: vi.fn(),
}));

vi.mock('../hooks/useInfo', () => ({ useInfo: mocks.useInfo }));
vi.mock('../hooks/useTask', () => ({ useTask: mocks.useTask }));

const task = {
    id: 'task-1',
    title: 'Buy milk',
    description: 'Go to the supermarket',
    completed: false,
    createdAt: '2026-09-27T10:05:00Z',
    updatedAt: '2026-09-27T10:05:00Z',
};

describe('TasksPage', () => {
    beforeEach(() => {
        mocks.getInfo.mockReset();
        mocks.listTasks.mockReset();
        mocks.createTask.mockReset();
        mocks.completeTask.mockReset();
        mocks.deleteTask.mockReset();
        mocks.useInfo.mockReturnValue({
            data: { application: 'Task Manager Gateway', version: '1.0.0' },
            isLoading: false,
            isError: false,
            getInfo: mocks.getInfo,
        });
        mocks.useTask.mockReturnValue({
            tasks: [],
            total: 0,
            error: null,
            hasLoaded: true,
            loadingList: false,
            creating: false,
            completingId: null,
            deletingId: null,
            listTasks: mocks.listTasks,
            createTask: mocks.createTask,
            completeTask: mocks.completeTask,
            deleteTask: mocks.deleteTask,
        });
    });

    it('loads application metadata and tasks', () => {
        renderWithProviders(<TasksPage />);

        expect(mocks.getInfo).toHaveBeenCalledOnce();
        expect(mocks.listTasks).toHaveBeenCalledOnce();
        expect(screen.getByText('No tasks yet')).toBeInTheDocument();
    });

    it('shows loading state while listing tasks', () => {
        mocks.useTask.mockReturnValue({
            ...mocks.useTask(),
            hasLoaded: false,
            loadingList: true,
        });

        renderWithProviders(<TasksPage />);

        expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
    });

    it('shows list errors and allows retry', async () => {
        mocks.useTask.mockReturnValue({ ...mocks.useTask(), error: new Error('List failed') });
        const { user } = renderWithProviders(<TasksPage />);

        expect(screen.getByText('List failed')).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Retry' }));

        expect(mocks.listTasks).toHaveBeenCalledTimes(2);
    });

    it('renders task list state', () => {
        mocks.useTask.mockReturnValue({ ...mocks.useTask(), tasks: [task], total: 1 });
        renderWithProviders(<TasksPage />);

        expect(screen.getByRole('list', { name: 'Tasks' })).toBeInTheDocument();
        expect(screen.getByText('1 pending of 1')).toBeInTheDocument();
    });
});
