import { Box, Typography } from '@mui/material';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';

import type { EmptyStateProps } from './types';

export const EmptyState = ({ title, description }: EmptyStateProps) => (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            paddingY: 6,
        }}
    >
        <InboxOutlinedIcon color="disabled" fontSize="large" />
        <Typography variant="h6">{title}</Typography>
        {description ? (
            <Typography sx={{ color: 'text.secondary', textAlign: 'center' }}>
                {description}
            </Typography>
        ) : null}
    </Box>
);
