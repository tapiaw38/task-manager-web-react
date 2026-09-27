import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SnackbarProvider } from './index';
import { useSnackbar } from './useSnackbar';

const Trigger = () => {
    const { createSnackbar } = useSnackbar();

    return (
        <>
            <button onClick={() => createSnackbar({ message: 'First message' })}>First</button>
            <button onClick={() => createSnackbar({ message: 'Second message' })}>Second</button>
        </>
    );
};

describe('SnackbarProvider', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('displays queued messages in order after auto-hide', () => {
        render(
            <SnackbarProvider>
                <Trigger />
            </SnackbarProvider>,
        );

        fireEvent.click(screen.getByRole('button', { name: 'First' }));
        fireEvent.click(screen.getByRole('button', { name: 'Second' }));

        expect(screen.getByText('First message')).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(4000);
        });

        expect(screen.getByText('Second message')).toBeInTheDocument();
    });

    it('does not leave timer work after unmount', () => {
        const { unmount } = render(
            <SnackbarProvider>
                <Trigger />
            </SnackbarProvider>,
        );

        fireEvent.click(screen.getByRole('button', { name: 'First' }));
        expect(screen.getByText('First message')).toBeInTheDocument();

        unmount();

        act(() => {
            vi.runOnlyPendingTimers();
        });

        expect(screen.queryByText('First message')).not.toBeInTheDocument();
    });
});
