import { create } from 'zustand';
import type { StoreApi, UseBoundStore } from 'zustand';

import { apiClient } from '../api/client';
import { TaskService } from '../services/tasks/taskService';
import type { ITaskService } from '../services/tasks/taskService';
import type { Task, TaskPayload } from '../types/task';

export interface TaskStore {
    tasks: Task[];
    total: number;
    error: unknown;
    hasLoaded: boolean;
    loadingList: boolean;
    creating: boolean;
    completingId: string | null;
    deletingId: string | null;
    list: () => Promise<void>;
    create: (payload: TaskPayload) => Promise<Task>;
    complete: (id: string, completed: boolean) => Promise<Task>;
    remove: (id: string) => Promise<void>;
}

const initialState = {
    tasks: [],
    total: 0,
    error: null,
    hasLoaded: false,
    loadingList: false,
    creating: false,
    completingId: null,
    deletingId: null,
};

export const createTaskStore = (service: ITaskService): UseBoundStore<StoreApi<TaskStore>> =>
    create<TaskStore>((set, get) => ({
        ...initialState,

        list: async () => {
            set({ loadingList: true, error: null });
            try {
                const response = await service.list();
                set({ tasks: response.data, total: response.total });
            } catch (error) {
                set({ error });
                throw error;
            } finally {
                set({ loadingList: false, hasLoaded: true });
            }
        },

        create: async (payload) => {
            set({ creating: true });
            try {
                const response = await service.create(payload);
                await get().list();
                return response.data;
            } finally {
                set({ creating: false });
            }
        },

        complete: async (id, completed) => {
            set({ completingId: id });
            try {
                const response = await service.complete(id, completed);
                set((state) => ({
                    tasks: state.tasks.map((task) => (task.id === id ? response.data : task)),
                }));
                return response.data;
            } finally {
                set({ completingId: null });
            }
        },

        remove: async (id) => {
            set({ deletingId: id });
            try {
                await service.remove(id);
                await get().list();
            } finally {
                set({ deletingId: null });
            }
        },
    }));

export const useTaskStore = createTaskStore(new TaskService(apiClient));
