# Expense Tracker Agent Guide

## Purpose

This repository is a Cloudflare-native personal expense tracker built with Next.js, Auth.js, D1, and OpenNext. Use this file as the quick orientation guide before making changes.

## Current Stack

- Next.js 16 + React 19
- Auth.js 5
- Cloudflare Workers via `@opennextjs/cloudflare`
- Cloudflare D1 in production
- local SQLite fallback in development/tests
- Vitest for unit/integration tests
- Playwright for E2E smoke coverage
- `pnpm` as the package manager

## Architecture

### Runtime

- Production deploys to Cloudflare Workers.
- Worker config lives in [wrangler.jsonc](/home/jacob/projects/expense-tracker/wrangler.jsonc).
- OpenNext build/deploy is driven by `pnpm cf:build` and `pnpm cf:deploy`.

### Data Layer

- Prisma/Postgres have been removed.
- SQL schema lives in [drizzle/0000_initial.sql](/home/jacob/projects/expense-tracker/drizzle/0000_initial.sql).
- Database access is implemented in [app/lib/server/sql.ts](/home/jacob/projects/expense-tracker/app/lib/server/sql.ts) and [app/lib/server/repository.ts](/home/jacob/projects/expense-tracker/app/lib/server/repository.ts).
- Money is stored as integer cents.
- Dates are stored as ISO strings.

### Database Behavior

- Production uses the Cloudflare D1 binding `DB`.
- Local development and tests use a SQLite-compatible file under `.wrangler/state/`.
- In non-production, [app/lib/server/sql.ts](/home/jacob/projects/expense-tracker/app/lib/server/sql.ts) intentionally falls back to the local database rather than D1.

### Auth

- Auth configuration is split between [auth.config.ts](/home/jacob/projects/expense-tracker/auth.config.ts) and [auth.ts](/home/jacob/projects/expense-tracker/auth.ts).
- `trustHost: true` is required for Cloudflare-hosted Auth.js requests.
- Google auth is only enabled when both `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` are present.
- A demo credentials provider is enabled by default in non-production unless `AUTH_ENABLE_TEST_PROVIDER="false"`.
- Dashboard protection happens in [app/dashboard/layout.tsx](/home/jacob/projects/expense-tracker/app/dashboard/layout.tsx), not middleware.

## Recurring Transactions

Recurring transactions use a hybrid model:

- `recurring_transactions` stores editable rules/templates.
- `transactions` stores immutable historical ledger entries.
- Past-due recurring occurrences are materialized into real transactions.
- Future occurrences remain virtual and are derived from the rule.

Key files:

- [app/lib/server/recurring.ts](/home/jacob/projects/expense-tracker/app/lib/server/recurring.ts)
- [app/lib/data.ts](/home/jacob/projects/expense-tracker/app/lib/data.ts)

Important behavior:

- Reconciliation runs on demand before recurring-sensitive reads.
- History should remain stable after rule edits.
- There is no cron-based generation endpoint anymore.
- Do not reintroduce a public recurring generation route unless there is a strong operational reason.

## Important Commands

### Development

```bash
pnpm install
pnpm dev
```

### Validation

```bash
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm test:coverage
pnpm test:e2e
```

### Cloudflare

```bash
pnpm cf:build
pnpm cf:deploy
pnpm wrangler d1 migrations apply expense-tracker --remote
```

## Environment Variables

### Local

- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `AUTH_ENABLE_TEST_PROVIDER`
- optional: `LOCAL_DB_PATH`

### GitHub Actions Deploy

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`

Notes:

- CI injects its own `AUTH_SECRET` and enables demo auth for smoke tests.
- `CRON_SECRET` is no longer used.

## CI/CD

- CI workflow: [`.github/workflows/ci.yml`](/home/jacob/projects/expense-tracker/.github/workflows/ci.yml)
- Deploy workflow: [`.github/workflows/deploy.yml`](/home/jacob/projects/expense-tracker/.github/workflows/deploy.yml)

Current intent:

- Pull requests run typecheck, lint, format check, coverage, Playwright smoke tests, and a Cloudflare build.
- Pushes to `main` deploy through GitHub Actions.
- Prefer GitHub Actions as the source of truth for deployment over Cloudflare’s direct GitHub integration to avoid duplicate deploys.

## Testing Notes

- Coverage is intended to stay at 100% for app-owned logic.
- After any code change, run `pnpm test:coverage` before considering the work done.
- Playwright uses a separate local DB file: `.wrangler/state/e2e.db`.
- E2E relies on the demo credentials provider, not Google OAuth.
- If route or page files are removed, regenerate Next route types if needed with:

```bash
pnpm exec next typegen
```

## Known Gotchas

- Do not include `.next/dev/types` in TypeScript validation; stale generated route validators can break typecheck after route deletions.
- Do not assume Google auth exists in CI or local dev.
- If production sign-in fails with generic Auth.js callback errors, inspect Worker logs and the D1-backed auth callbacks first.
- `lint-staged` is intentionally limited to file types Prettier can parse in this repo; avoid broadening it back to “all non-TS files”.
- This repo is no longer Prisma-based. New persistence work should go through the repository/service layer, not an ORM reintroduction by default.

## Preferred Change Patterns

- Keep UI code independent from raw database details.
- Add new persistence logic in `app/lib/server/`.
- Preserve historical transaction snapshots when recurring rules change.
- Favor idempotent behavior in reconciliation and data writes.
- Validate changes with tests before deploy, including `pnpm test:coverage`.

## If You Need to Debug Production

Useful checks:

- `pnpm wrangler secret list`
- `pnpm wrangler d1 execute expense-tracker --remote --command "SELECT name FROM sqlite_master WHERE type='table';"`
- `pnpm wrangler tail expense-tracker`

When debugging auth:

- confirm deployed secrets exist
- confirm Google redirect URIs match the deployed host
- confirm the D1 schema is present remotely
- inspect [app/lib/server/auth-callbacks.ts](/home/jacob/projects/expense-tracker/app/lib/server/auth-callbacks.ts) first
