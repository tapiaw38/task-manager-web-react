import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

import { TasksPage } from './pages/TasksPage';
import { SnackbarProvider } from './components/SnackbarProvider';

const theme = createTheme({
    palette: {
        mode: 'light',
        background: { default: '#f5f6f8' },
    },
    shape: { borderRadius: 10 },
});

export const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider>
                <TasksPage />
            </SnackbarProvider>
        </ThemeProvider>
    );
};

export default App;
