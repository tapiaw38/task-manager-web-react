# Architecture

```text
TasksPage → useTask → Zustand task store → ITaskService → API client → Node gateway
```

| Layer         | Responsibility                                  |
| :------------ | :---------------------------------------------- |
| `api/`        | Fetch wrapper and `ApiError` mapping            |
| `services/`   | Gateway HTTP endpoint contracts                 |
| `schemas/`    | Zod runtime schemas and inferred task types     |
| `stores/`     | Task state and operations                       |
| `hooks/`      | UI-facing state, effects, and Snackbar feedback |
| `components/` | Presentational controls                         |
| `pages/`      | Screen composition and local UI state           |

`createTaskStore(service)` accepts `ITaskService`. Production passes `TaskService`; tests inject a fake implementation.

`TasksPage` owns initial fetch timing. It calls `listTasks()` after mount. Hooks expose state and operations without starting requests automatically.

`hasLoaded` keeps the first list request in a loading state until it settles. This prevents an empty-state flash before the request begins.
