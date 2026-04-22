# Vercel Deployment

This monorepo deploys to Vercel as **two separate Projects** that share the
same Git repository — one for the Next.js frontend and one for the Express
backend (running as a serverless function).

## Projects to create

In the Vercel dashboard, import this repo **twice**, once per app:

| Project          | Root Directory    | Framework Preset |
| ---------------- | ----------------- | ---------------- |
| `anvara-frontend` | `apps/frontend`   | Next.js          |
| `anvara-backend`  | `apps/backend`    | Other            |

The build/install commands are pinned in each app's `vercel.json`, so no
overrides are needed in the dashboard.

## Required environment variables

### Frontend (`anvara-frontend`)

| Variable               | Example                              |
| ---------------------- | ------------------------------------ |
| `NEXT_PUBLIC_API_URL`  | `https://anvara-backend.vercel.app`  |
| `NEXT_PUBLIC_SITE_URL` | `https://anvara-frontend.vercel.app` |
| `BETTER_AUTH_SECRET`   | (generate with `openssl rand -hex 32`) |
| `BETTER_AUTH_URL`      | `https://anvara-frontend.vercel.app` |

### Backend (`anvara-backend`)

| Variable             | Notes                                            |
| -------------------- | ------------------------------------------------ |
| `DATABASE_URL`       | Pooled Postgres URL (e.g. Neon, Supabase, Vercel Postgres) |
| `BETTER_AUTH_SECRET` | Must match the frontend value                    |
| `BETTER_AUTH_URL`    | Frontend's public URL                            |
| `CORS_ORIGINS`       | Comma-separated list, e.g. `https://anvara-frontend.vercel.app` |

> **Postgres note**: the local docker-compose database does not work in
> production. Use a managed provider with a connection-pooled URL — serverless
> functions exhaust direct connections quickly.

## Vercel Analytics & Speed Insights

`@vercel/analytics` and `@vercel/speed-insights` are wired into
`apps/frontend/app/layout.tsx`. Both light up automatically once the project
is deployed; no extra configuration is required.

## Local preview

```bash
# Install the CLI once
pnpm add -g vercel

# Link and deploy a preview from a given app
cd apps/frontend && vercel
cd apps/backend  && vercel
```
