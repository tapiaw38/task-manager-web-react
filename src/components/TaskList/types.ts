import type { Task } from '../../types/task';

export interface TaskListProps {
    tasks: Task[];
    completingId: string | null;
    deletingId: string | null;
    onToggleComplete: (task: Task) => void;
    onDelete: (task: Task) => void;
}
