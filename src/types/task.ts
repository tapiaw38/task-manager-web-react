import type { z } from 'zod';

import type {
    taskPayloadSchema,
    taskResponseSchema,
    taskSchema,
    tasksResponseSchema,
} from '../schemas/task';

export type Task = z.infer<typeof taskSchema>;
export type TaskPayload = z.output<typeof taskPayloadSchema>;
export type TasksResponse = z.infer<typeof tasksResponseSchema>;
export type TaskResponse = z.infer<typeof taskResponseSchema>;
