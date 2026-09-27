import type { AlertColor } from '@mui/material';

export interface SnackbarOptions {
    message: string;
    severity?: AlertColor;
    autoHideDuration?: number;
}

export interface SnackbarContextValue {
    createSnackbar: (options: SnackbarOptions) => void;
}
