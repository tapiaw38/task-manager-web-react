# API communication

Gateway contract is documented in [Swagger UI](http://localhost:8081/api/docs). This page describes frontend consumption.

## Client

`src/api/client.ts` is the only module that knows backend response format. It resolves base URL, adds headers, and maps errors.

```ts
export const request = async <T>(path: string, init?: RequestInit): Promise<T> => { ... }
```

| Situation                         | Result                                              |
| :-------------------------------- | :-------------------------------------------------- |
| 2xx response with body            | JSON validated through the supplied Zod schema      |
| `204` response                    | `undefined`, without parsing                        |
| Error response with envelope      | `ApiError` with `code`, `message`, and `status`     |
| Error response without valid JSON | `ApiError` with `UNEXPECTED_ERROR` code             |
| Network or unavailable backend    | `ApiError` with `NETWORK_ERROR` code and `status` 0 |

Backend error envelope:

```json
{ "code": "task:shared:not-found", "message": "task not found" }
```

## Operations

`src/services/tasks/taskService.ts`:

| Service method                        | Request                          |
| :------------------------------------ | :------------------------------- |
| `taskService.list()`                  | `GET /api/tasks`                 |
| `taskService.create(payload)`         | `POST /api/tasks`                |
| `taskService.complete(id, completed)` | `PATCH /api/tasks/{id}/complete` |
| `taskService.remove(id)`              | `DELETE /api/tasks/{id}`         |

Task responses use `snake_case` timestamps:

```json
{
    "data": {
        "id": "2c8d915b-6398-41e1-8896-396af606623a",
        "title": "Buy milk",
        "description": "Go to the supermarket",
        "completed": false,
        "created_at": "2026-09-27T10:05:00Z",
        "updated_at": "2026-09-27T10:05:00Z"
    }
}
```

## State flow

`TasksPage` calls `useTask()`. The hook delegates to the Zustand store, which delegates to `ITaskService`.

The page owns fetch timing. It calls `listTasks()` after mount. Hooks expose state and operations without starting requests automatically.

The first list request is represented by `hasLoaded: false`; the page renders loading until that request settles, preventing an empty-state flash. List failures remain in store state for `ErrorMessage`. Mutation methods return `true` on success and `false` after presenting a Snackbar error.

## Client-side validation

`src/schemas/task.ts` validates and sanitizes task payloads:

| Field         | Rule                             |
| :------------ | :------------------------------- |
| `title`       | required, 3 to 120 characters    |
| `description` | optional, maximum 500 characters |

Zod trims outer whitespace and collapses internal whitespace before submission. Go validation remains authoritative.

## CORS

Backend accepts `http://localhost:5173` by default. Deployments at another origin must add it to backend `ALLOWED_ORIGINS`.
