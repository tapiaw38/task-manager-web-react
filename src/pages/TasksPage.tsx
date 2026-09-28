import { useEffect, useState } from 'react';
import { Card, CardContent, Container, Stack, Typography } from '@mui/material';

import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { useTask } from '../hooks/useTask';
import type { Task } from '../types/task';
import { getErrorMessage } from '../utils/errorMessage';

export const TasksPage = () => {
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

    const tasks = useTask();
    const listTasks = tasks.listTasks;

    useEffect(() => {
        void listTasks();
    }, [listTasks]);

    const handleDelete = async () => {
        if (!taskToDelete) {
            return;
        }

        const deleted = await tasks.deleteTask(taskToDelete.id);

        if (deleted) {
            setTaskToDelete(null);
        }
    };

    const pending = tasks.tasks.filter((task) => !task.completed).length;

    return (
        <Container maxWidth="md" sx={{ paddingY: 4 }}>
            <Typography variant="h4" component="h1" sx={{ marginBottom: 3 }}>
                Task Manager
            </Typography>

            <Card sx={{ marginBottom: 3 }}>
                <CardContent>
                    <TaskForm submitting={tasks.creating} onSubmit={tasks.createTask} />
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Stack
                        direction="row"
                        sx={{
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 2,
                        }}
                    >
                        <Typography variant="h6">Tasks</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {pending} pending of {tasks.total}
                        </Typography>
                    </Stack>

                    {tasks.loadingList || !tasks.hasLoaded ? (
                        <Loading label="Loading tasks..." />
                    ) : tasks.error ? (
                        <ErrorMessage
                            message={getErrorMessage(tasks.error)}
                            onRetry={() => void tasks.listTasks()}
                        />
                    ) : tasks.tasks.length === 0 ? (
                        <EmptyState
                            title="No tasks yet"
                            description="Create the first task to get started"
                        />
                    ) : (
                        <TaskList
                            tasks={tasks.tasks}
                            completingId={tasks.completingId}
                            deletingId={tasks.deletingId}
                            onToggleComplete={(task) =>
                                void tasks.completeTask(task.id, !task.completed)
                            }
                            onDelete={setTaskToDelete}
                        />
                    )}
                </CardContent>
            </Card>

            <ConfirmDialog
                open={Boolean(taskToDelete)}
                title="Delete task"
                description="Are you sure you want to delete this task?"
                submitting={tasks.deletingId !== null}
                onConfirm={handleDelete}
                onClose={() => setTaskToDelete(null)}
            />
        </Container>
    );
};
