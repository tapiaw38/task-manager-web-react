import { Alert, Snackbar } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { SnackbarContext } from './context';
import type { SnackbarContextValue, SnackbarOptions } from './types';

const DEFAULT_DELAY = 4000;

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
    const [{ current }, setSnackbarState] = useState<{
        current: SnackbarOptions | null;
        queue: SnackbarOptions[];
    }>({ current: null, queue: [] });

    const createSnackbar = useCallback((options: SnackbarOptions) => {
        setSnackbarState((state) => {
            if (!state.current) {
                return { ...state, current: options };
            }

            return { ...state, queue: [...state.queue, options] };
        });
    }, []);

    const closeSnackbar = useCallback(() => {
        setSnackbarState((state) => {
            const [next, ...remaining] = state.queue;
            return { current: next ?? null, queue: remaining };
        });
    }, []);

    const value = useMemo<SnackbarContextValue>(() => ({ createSnackbar }), [createSnackbar]);

    return (
        <SnackbarContext.Provider value={value}>
            {children}
            <Snackbar
                key={current?.message}
                open={current !== null}
                autoHideDuration={current?.autoHideDuration ?? DEFAULT_DELAY}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                disableWindowBlurListener
                onClose={closeSnackbar}
            >
                <Alert severity={current?.severity ?? 'success'} onClose={closeSnackbar}>
                    {current?.message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};
