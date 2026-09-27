import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement, ReactNode } from 'react';

import { SnackbarProvider } from '../components/SnackbarProvider';

const theme = createTheme();

export const renderWithProviders = (ui: ReactElement) => {
    const wrapper = ({ children }: { children: ReactNode }) => (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider>{children}</SnackbarProvider>
        </ThemeProvider>
    );

    return {
        user: userEvent.setup(),
        ...render(ui, { wrapper }),
    };
};
