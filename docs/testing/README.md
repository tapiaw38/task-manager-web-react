# Testing

```bash
pnpm test
pnpm test:watch
pnpm test:cover
```

Stack: Vitest, jsdom, Testing Library, and `@testing-library/user-event`.

## Test structure

Tests live next to their layer, following backend structure:

```text
src/
  api/                 HTTP adapter tests
  services/            API service tests
  stores/              UI use case tests
  components/          presentation tests
  pages/               page integration tests
  utils/               pure function tests
  test/mocks/          fetch router and HTTP responses
  test/render.tsx      application UI providers
```

Dependency flow matches production code:

```text
page → hook → store → service → API client
```

Each layer validates its contract. Page tests cover integration. Store tests inject `ITaskService`, equivalent to backend use cases injecting repository interfaces.

## Covered behavior

| Layer                                        | Coverage                                                                        |
| :------------------------------------------- | :------------------------------------------------------------------------------ |
| `api/client.spec.ts`                         | JSON, 204, backend errors, malformed error body, network error, request logging |
| `services/tasks/taskService.spec.ts`         | List, create, complete, and delete Gateway HTTP contract                        |
| `stores/taskStore.spec.ts`                   | Injected service, loading state, failures, and task mutations                   |
| `components/SnackbarProvider/index.spec.tsx` | Message queue, auto-hide, unmount cleanup                                       |
| `pages/TasksPage.spec.tsx`                   | Loading, retry, empty state, and task-list composition                          |
| `schemas/task.spec.ts`                       | Zod validation and payload normalization                                        |

`mockFetch(routes)` rejects undeclared requests. Tests cannot silently call an unexpected endpoint.

Coverage is collected from `src/`, excluding only application bootstrap, test helpers, and type-only files.

| Metric     | Minimum |
| :--------- | ------: |
| Statements |     70% |
| Branches   |     60% |
| Functions  |     70% |
| Lines      |     70% |

## CI

CI runs formatting validation, lint, typecheck, tests with coverage, and production build.
