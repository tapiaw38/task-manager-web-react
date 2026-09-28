import { useRef } from 'react';
import { Box, Checkbox, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import { useVirtualizer } from '@tanstack/react-virtual';

import { formatCreationDate, formatCreationTime } from '../../utils/formatDateTime';
import type { TaskListProps } from './types';

const ROW_HEIGHT = 96;
const MAX_VIEWPORT_HEIGHT = 520;

export const TaskList = ({
    tasks,
    completingId,
    deletingId,
    onToggleComplete,
    onDelete,
}: TaskListProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
        count: tasks.length,
        getScrollElement: () => scrollRef.current,
        estimateSize: () => ROW_HEIGHT,
        overscan: 8,
    });

    return (
        <Box
            ref={scrollRef}
            role="list"
            aria-label="Tasks"
            sx={{
                maxHeight: MAX_VIEWPORT_HEIGHT,
                overflowY: 'auto',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Box
                sx={{
                    height: virtualizer.getTotalSize(),
                    position: 'relative',
                    width: '100%',
                }}
            >
                {virtualizer.getVirtualItems().map((virtualRow) => {
                    const task = tasks[virtualRow.index];
                    const busy = completingId === task.id || deletingId === task.id;

                    return (
                        <Box
                            key={task.id}
                            role="listitem"
                            data-index={virtualRow.index}
                            ref={virtualizer.measureElement}
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                transform: `translateY(${virtualRow.start}px)`,
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                paddingX: 2,
                                paddingY: 1.5,
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 1.5,
                                backgroundColor: task.completed
                                    ? 'action.hover'
                                    : 'background.paper',
                            }}
                        >
                            <Checkbox
                                checked={task.completed}
                                disabled={busy}
                                onChange={() => onToggleComplete(task)}
                                slotProps={{
                                    input: {
                                        'aria-label': `Mark ${task.title} as completed`,
                                    },
                                }}
                            />

                            <Stack spacing={0.5} sx={{ flexGrow: 1, minWidth: 0 }}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        textDecoration: task.completed ? 'line-through' : 'none',
                                        color: task.completed ? 'text.disabled' : 'text.primary',
                                        overflowWrap: 'anywhere',
                                    }}
                                >
                                    {task.title}
                                </Typography>

                                {task.description ? (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            textDecoration: task.completed
                                                ? 'line-through'
                                                : 'none',
                                            overflowWrap: 'anywhere',
                                        }}
                                    >
                                        {task.description}
                                    </Typography>
                                ) : null}

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        rowGap: 0.5,
                                        minWidth: 0,
                                    }}
                                >
                                    <Chip
                                        size="small"
                                        variant="outlined"
                                        icon={<ScheduleOutlinedIcon />}
                                        label={`${formatCreationDate(task.created_at)} ${formatCreationTime(task.created_at)}`}
                                        sx={{ flexShrink: 0 }}
                                    />
                                    <Typography
                                        variant="caption"
                                        title={task.id}
                                        sx={{
                                            color: 'text.disabled',
                                            minWidth: 0,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        id: {task.id}
                                    </Typography>
                                </Stack>
                            </Stack>

                            <Tooltip title="Delete">
                                <span>
                                    <IconButton
                                        aria-label={`Delete ${task.title}`}
                                        disabled={busy}
                                        onClick={() => onDelete(task)}
                                    >
                                        <DeleteOutlinedIcon fontSize="small" />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};
