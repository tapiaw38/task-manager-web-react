import { Box, CircularProgress, Typography } from '@mui/material';

import type { LoadingProps } from './types';

export const Loading = ({ label = 'Loading...' }: LoadingProps) => (
    <Box
        role="status"
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            paddingY: 6,
        }}
    >
        <CircularProgress aria-label={label} />
        <Typography sx={{ color: 'text.secondary' }}>{label}</Typography>
    </Box>
);
