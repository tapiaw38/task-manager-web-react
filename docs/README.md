# Task Manager Web

React client for the Task Manager application. It communicates only with the Node gateway, never directly with the Go task service.

## Requirements

- Node.js 20+
- Node gateway running at `http://localhost:8081`

## Commands

```bash
pnpm install
pnpm dev
pnpm test
pnpm test:cover
pnpm build
pnpm run docs
```

`VITE_API_URL` configures the gateway base URL. Its default is `http://localhost:8081`.

## Features

- Virtualized task list.
- Create, complete, and delete tasks.
- Strikethrough completed tasks.
- Creation date and time in required format.
- Zod payload and response validation.
- Loading, empty, retry, and Snackbar feedback states.

See [Architecture](architecture/), [API](api/), [Components](components/), [Testing](testing/), [Operations](operations/), and [Performance](performance/).
