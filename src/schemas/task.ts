import { z } from 'zod';

export const TITLE_MIN_LENGTH = 3;
export const TITLE_MAX_LENGTH = 120;
export const DESCRIPTION_MAX_LENGTH = 500;

const sanitizeText = (value: string): string => value.trim().replace(/\s+/gu, ' ');

const sanitizedTextSchema = z.string().transform(sanitizeText);

export const taskPayloadSchema = z.object({
    title: sanitizedTextSchema.pipe(
        z
            .string()
            .min(1, 'Title is required')
            .min(TITLE_MIN_LENGTH, `Title must be at least ${TITLE_MIN_LENGTH} characters`)
            .max(TITLE_MAX_LENGTH, `Title must be at most ${TITLE_MAX_LENGTH} characters`),
    ),
    description: sanitizedTextSchema.pipe(
        z
            .string()
            .max(
                DESCRIPTION_MAX_LENGTH,
                `Description must be at most ${DESCRIPTION_MAX_LENGTH} characters`,
            ),
    ),
});

export const taskSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    completed: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
});

export const taskResponseSchema = z.object({ data: taskSchema });

export const tasksResponseSchema = z.object({
    data: z.array(taskSchema),
    total: z.number().int().nonnegative(),
});

export type TaskFormErrors = Partial<Record<keyof z.input<typeof taskPayloadSchema>, string>>;

export const validateTaskPayload = (
    values: z.input<typeof taskPayloadSchema>,
): { data: z.output<typeof taskPayloadSchema> | null; errors: TaskFormErrors } => {
    const parsed = taskPayloadSchema.safeParse(values);

    if (parsed.success) {
        return { data: parsed.data, errors: {} };
    }

    const errors: TaskFormErrors = {};

    for (const issue of parsed.error.issues) {
        const field = issue.path[0];

        if ((field === 'title' || field === 'description') && !errors[field]) {
            errors[field] = issue.message;
        }
    }

    return { data: null, errors };
};
