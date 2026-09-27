import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { TaskForm } from './index';
import { renderWithProviders } from '../../test/render';

describe('TaskForm', () => {
    it('shows schema validation errors without submitting', async () => {
        const onSubmit = vi.fn().mockResolvedValue(true);
        const { user } = renderWithProviders(<TaskForm submitting={false} onSubmit={onSubmit} />);

        await user.click(screen.getByRole('button', { name: 'Add task' }));

        expect(screen.getByText('Title is required')).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('submits the sanitized payload', async () => {
        const onSubmit = vi.fn().mockResolvedValue(true);
        const { user } = renderWithProviders(<TaskForm submitting={false} onSubmit={onSubmit} />);

        await user.type(screen.getByLabelText('Title'), '  Buy   milk  ');
        await user.type(screen.getByLabelText('Description'), '  Go to  supermarket ');
        await user.click(screen.getByRole('button', { name: 'Add task' }));

        expect(onSubmit).toHaveBeenCalledWith({
            title: 'Buy milk',
            description: 'Go to supermarket',
        });
    });
});
