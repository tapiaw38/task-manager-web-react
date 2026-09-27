import type { ApiClient } from '../../api/client';
import { taskResponseSchema, tasksResponseSchema } from '../../schemas/task';
import type { TaskPayload, TaskResponse, TasksResponse } from '../../types/task';

export interface ITaskService {
    list(): Promise<TasksResponse>;
    create(payload: TaskPayload): Promise<TaskResponse>;
    complete(id: string, completed: boolean): Promise<TaskResponse>;
    remove(id: string): Promise<void>;
}

export class TaskService implements ITaskService {
    private readonly api: ApiClient;

    constructor(api: ApiClient) {
        this.api = api;
    }

    list() {
        return this.api.request<TasksResponse>('/api/tasks', undefined, tasksResponseSchema);
    }

    create(payload: TaskPayload) {
        return this.api.request<TaskResponse>(
            '/api/tasks',
            { method: 'POST', body: JSON.stringify(payload) },
            taskResponseSchema,
        );
    }

    complete(id: string, completed: boolean) {
        return this.api.request<TaskResponse>(
            `/api/tasks/${encodeURIComponent(id)}/complete`,
            { method: 'PATCH', body: JSON.stringify({ completed }) },
            taskResponseSchema,
        );
    }

    remove(id: string) {
        return this.api.request<void>(`/api/tasks/${encodeURIComponent(id)}`, { method: 'DELETE' });
    }
}
