import { useCallback } from 'react';

import { useSnackbar } from '../components/SnackbarProvider/useSnackbar';
import { useTaskStore } from '../stores/taskStore';
import type { TaskPayload } from '../types/task';
import { getErrorMessage } from '../utils/errorMessage';

export const useTask = () => {
    const tasks = useTaskStore((state) => state.tasks);
    const total = useTaskStore((state) => state.total);
    const error = useTaskStore((state) => state.error);
    const hasLoaded = useTaskStore((state) => state.hasLoaded);
    const loadingList = useTaskStore((state) => state.loadingList);
    const creating = useTaskStore((state) => state.creating);
    const completingId = useTaskStore((state) => state.completingId);
    const deletingId = useTaskStore((state) => state.deletingId);
    const list = useTaskStore((state) => state.list);
    const create = useTaskStore((state) => state.create);
    const complete = useTaskStore((state) => state.complete);
    const remove = useTaskStore((state) => state.remove);
    const { createSnackbar } = useSnackbar();

    const listTasks = useCallback(() => list().catch(() => undefined), [list]);

    const createTask = useCallback(
        async (payload: TaskPayload) => {
            try {
                await create(payload);
                createSnackbar({ message: 'Task created successfully' });
                return true;
            } catch (creationError) {
                createSnackbar({
                    message: getErrorMessage(creationError),
                    severity: 'error',
                });
                return false;
            }
        },
        [create, createSnackbar],
    );

    const completeTask = useCallback(
        async (id: string, completed: boolean) => {
            try {
                await complete(id, completed);
                return true;
            } catch (completionError) {
                createSnackbar({
                    message: getErrorMessage(completionError),
                    severity: 'error',
                });
                return false;
            }
        },
        [complete, createSnackbar],
    );

    const deleteTask = useCallback(
        async (id: string) => {
            try {
                await remove(id);
                createSnackbar({ message: 'Task deleted successfully' });
                return true;
            } catch (deletionError) {
                createSnackbar({
                    message: getErrorMessage(deletionError),
                    severity: 'error',
                });
                return false;
            }
        },
        [createSnackbar, remove],
    );

    return {
        tasks,
        total,
        error,
        hasLoaded,
        loadingList,
        creating,
        completingId,
        deletingId,
        listTasks,
        createTask,
        completeTask,
        deleteTask,
    };
};
