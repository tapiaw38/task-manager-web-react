# Components

Components receive props and do not call the API directly.

| Component                               | Responsibility                                             |
| :-------------------------------------- | :--------------------------------------------------------- |
| `TaskList`                              | Virtualized task rows with completion and deletion actions |
| `TaskForm`                              | Creates tasks after Zod validation                         |
| `ConfirmDialog`                         | Confirms destructive actions                               |
| `Loading`, `ErrorMessage`, `EmptyState` | List status states                                         |
| `SnackbarProvider`                      | Queues global success and error feedback                   |

`TasksPage` owns confirmation state. `useTask` owns API-facing task state.
