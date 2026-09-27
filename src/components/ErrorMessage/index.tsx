import { Alert, AlertTitle, Button } from '@mui/material';

import type { ErrorMessageProps } from './types';

export const ErrorMessage = ({
    title = 'Something went wrong',
    message,
    onRetry,
}: ErrorMessageProps) => (
    <Alert
        severity="error"
        action={
            onRetry ? (
                <Button color="inherit" size="small" onClick={onRetry}>
                    Retry
                </Button>
            ) : undefined
        }
    >
        <AlertTitle>{title}</AlertTitle>
        {message}
    </Alert>
);
