import type { TaskPayload } from '../../types/task';

export interface TaskFormProps {
    submitting: boolean;
    onSubmit: (payload: TaskPayload) => Promise<boolean>;
}
