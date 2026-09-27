# Operations

## Development

```bash
pnpm dev
pnpm build
pnpm preview
pnpm test
pnpm test:cover
```

`VITE_API_URL` is embedded at build time. Rebuild the application after changing it.

## Delivery

CI runs formatting validation, lint, typecheck, coverage tests, and the production build.

Firebase Hosting serves the static application. `VITE_API_URL` must reference the deployed Node gateway before building the production bundle.

Add the public frontend origin to backend `ALLOWED_ORIGINS` before deployment.

## Documentation

Run `pnpm run docs` to serve this Docsify site at `http://localhost:3002`. Gateway API documentation is available at `/api/docs`.
