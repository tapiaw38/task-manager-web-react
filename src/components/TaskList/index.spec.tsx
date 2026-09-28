import { screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { TaskList } from './index';
import { renderWithProviders } from '../../test/render';
import type { Task } from '../../types/task';

const buildTask = (index: number, overrides: Partial<Task> = {}): Task => ({
    id: `task-${index}`,
    title: `Task number ${index}`,
    description: `Description ${index}`,
    completed: false,
    created_at: '2026-09-27T10:05:00Z',
    updated_at: '2026-09-27T10:05:00Z',
    ...overrides,
});

const noop = () => undefined;

const VIEWPORT_HEIGHT = 520;
const ROW_HEIGHT = 96;

beforeAll(() => {
    const sizeOf = (element: HTMLElement) =>
        element.getAttribute('role') === 'list' ? VIEWPORT_HEIGHT : ROW_HEIGHT;

    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
        configurable: true,
        get(this: HTMLElement) {
            return sizeOf(this);
        },
    });

    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
        configurable: true,
        get: () => 800,
    });

    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
        configurable: true,
        get(this: HTMLElement) {
            return sizeOf(this);
        },
    });

    Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
        configurable: true,
        value: function getBoundingClientRect(this: HTMLElement) {
            const height = sizeOf(this);

            return {
                width: 800,
                height,
                top: 0,
                left: 0,
                right: 800,
                bottom: height,
                x: 0,
                y: 0,
                toJSON: () => ({}),
            } as DOMRect;
        },
    });
});

describe('TaskList', () => {
    it('renders only a window of rows for a large list', () => {
        const tasks = Array.from({ length: 500 }, (_, index) => buildTask(index));

        renderWithProviders(
            <TaskList
                tasks={tasks}
                completingId={null}
                deletingId={null}
                onToggleComplete={noop}
                onDelete={noop}
            />,
        );

        const rendered = screen.getAllByRole('listitem');

        expect(rendered.length).toBeGreaterThan(0);
        expect(rendered.length).toBeLessThan(tasks.length / 2);
    });

    it('shows creation date and time in the required format', () => {
        renderWithProviders(
            <TaskList
                tasks={[buildTask(1)]}
                completingId={null}
                deletingId={null}
                onToggleComplete={noop}
                onDelete={noop}
            />,
        );

        expect(screen.getByText(/27-sep-26 \d{2}:\d{2}/)).toBeInTheDocument();
    });

    it('strikes through completed tasks', () => {
        renderWithProviders(
            <TaskList
                tasks={[buildTask(1, { completed: true })]}
                completingId={null}
                deletingId={null}
                onToggleComplete={noop}
                onDelete={noop}
            />,
        );

        expect(screen.getByText('Task number 1')).toHaveStyle({
            textDecoration: 'line-through',
        });
    });

    it('toggles completion and requests deletion', async () => {
        const onToggleComplete = vi.fn();
        const onDelete = vi.fn();
        const task = buildTask(1);

        const { user } = renderWithProviders(
            <TaskList
                tasks={[task]}
                completingId={null}
                deletingId={null}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
            />,
        );

        await user.click(
            screen.getByRole('checkbox', {
                name: 'Mark Task number 1 as completed',
            }),
        );
        await user.click(screen.getByRole('button', { name: 'Delete Task number 1' }));

        expect(onToggleComplete).toHaveBeenCalledWith(task);
        expect(onDelete).toHaveBeenCalledWith(task);
    });
});
