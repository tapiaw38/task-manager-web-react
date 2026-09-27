# Task Manager Web (React)

Web client of the Task Manager application. It lists tasks with a virtual scroll,
creates them, marks them as completed and deletes them.

It talks only to the [Node gateway](../task-manager-gateway-node), never to the
Go service directly.

```bash
React web  ──►  Node gateway  ──►  Go task service  ──►  Firestore / JSON file
```

## Requirements

- Node.js 20+
- pnpm
- The gateway reachable at `VITE_API_URL`

## Getting started

```bash
pnpm install
pnpm dev
```

The application runs on `http://localhost:5173` and expects the gateway on
`http://localhost:8081`.

To run the whole stack locally, start the backends first:

```bash
cd ../task-manager-service-go && make run   # terminal 1
cd ../task-manager-gateway-node && pnpm dev # terminal 2
cd ../task-manager-web-react   && pnpm dev  # terminal 3
```

### Available commands

```bash
pnpm dev           # development server
pnpm build         # typecheck and production build into dist/
pnpm preview       # serve the build
pnpm test          # vitest run
pnpm test:cover    # tests with coverage
pnpm typecheck     # tsc
pnpm lint          # oxlint
pnpm format:check  # prettier
```

## Configuration

| Variable       | Default                 | Description             |
| :------------- | :---------------------- | :---------------------- |
| `VITE_API_URL` | `http://localhost:8081` | Base URL of the gateway |

It lives in `.env.example`. Vite inlines the value at build time, so changing it
requires a rebuild; restarting the container is not enough.

## Features

- Task list rendered with **virtual scroll**, so the DOM size stays constant no
  matter how many tasks exist.
- Create a task with client side validation.
- Mark a task as completed or pending with a checkbox.
- Delete a task behind a confirmation dialog.
- Completed tasks are shown with a **strikethrough**.
- Each task shows its id, title, description, creation date in `dd-mmm-yy` and
  creation time in `hh:mm`.
- Loading, empty and error states, the latter with a retry button.
- Success and failure feedback through a snackbar.

### Date format

Dates are formatted with the native `Intl.DateTimeFormat`, no date library.

The locale is pinned to `en-US` on purpose. It is the locale that yields the
three letter month abbreviations the format requires: `en-GB` produces `Sept`
and `es-AR` produces `sept`, both of which break `dd-mmm-yy`. Times are rendered
in the browser timezone, so a task created at `23:30 UTC` reads as local time.

## Architecture

```
src/
  api/client.ts              fetch wrapper: base URL, headers and error mapping

  services/
    tasks/taskService.ts     REST operations, behind ITaskService
    info/infoService.ts

  stores/
    taskStore.ts             zustand store, receives the service by injection
    infoStore.ts

  hooks/
    useTask.ts               binds the store to the snackbar feedback
    useInfo.ts

  components/
    TaskList/                virtualized list with strikethrough and actions
    TaskForm/                creation form with validation
    ConfirmDialog/  Loading/  EmptyState/  ErrorMessage/  SnackbarProvider/

  pages/TasksPage.tsx        screen composition

  types/                     contracts shared with the API
  utils/                     validation, date formatting and error messages
  test/                      setup, render helper and fetch mocks
```

Components receive data through props and never call the API themselves, which
keeps them testable in isolation and avoids requests hidden deep in the tree.

The service is injected into the store, so the store tests run against a double
and never touch the network.

### Error handling

`api/client.ts` is the only place that knows the backend error format:

```json
{ "code": "task:shared:not-found", "message": "task not found" }
```

It turns that into an `ApiError` carrying `code`, `message` and `status`. A
network failure becomes an `ApiError` with code `NETWORK_ERROR`. Components never
inspect status codes: they show the message the backend already produced.

## Tests

```bash
pnpm test
pnpm test:cover
```

Vitest with jsdom, Testing Library for rendering and queries. Queries use
accessible roles and labels rather than test ids, so a passing query also means a
screen reader can find the element.

The virtual scroll is covered by rendering 500 tasks and asserting that fewer
than half reach the DOM. Date formatting, strikethrough and the completion and
deletion callbacks have their own tests.

## Deploying to Firebase Hosting

```bash
pnpm build

firebase login
firebase deploy --only hosting
```

`VITE_API_URL` must point at the deployed gateway **before** running
`pnpm build`, because Vite inlines it into the bundle.

`firebase.json` configures `dist` as the hosting directory and rewrites every route to `index.html` for the single-page application. `.firebaserc` targets `project-6f7bcba1-aac1-4997-b2c`.

The deployed origin must also be listed in the gateway `ALLOWED_ORIGINS`, or the
browser blocks every request.

## Documentation

```bash
pnpm run docs
```

Serves the docsify guide on `http://localhost:3002`. The API contract is
documented by the gateway itself at `/api/docs`.
