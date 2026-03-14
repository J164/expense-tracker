# Expense Tracker

A Cloudflare-native expense tracker built with Next.js, Auth.js, D1, and OpenNext.

## Stack

- Next.js 16 + React 19
- Auth.js 5 with Google OAuth
- Cloudflare Workers + OpenNext
- Cloudflare D1 with checked-in SQL migrations
- Vitest coverage + Playwright smoke tests

## Local Setup

1. Install dependencies:

```bash
pnpm install
```

2. Configure environment variables in `.env.local`:

```env
AUTH_SECRET="replace-me"
AUTH_GOOGLE_ID="replace-me"
AUTH_GOOGLE_SECRET="replace-me"
CRON_SECRET="replace-me"
AUTH_ENABLE_TEST_PROVIDER="true"
```

3. Start local development:

```bash
pnpm dev
```

In local development, the demo credentials login is enabled by default unless you set `AUTH_ENABLE_TEST_PROVIDER="false"`. That gives you a reliable way into `http://localhost:3000/login` without depending on Google OAuth localhost configuration.

The app will use the local SQLite-compatible fallback database at `.wrangler/state/expense-tracker.db` during local development and tests. Production uses the `DB` Cloudflare D1 binding from `wrangler.jsonc`.

## Scripts

- `pnpm typecheck`
- `pnpm lint`
- `pnpm format`
- `pnpm format:check`
- `pnpm test`
- `pnpm test:coverage`
- `pnpm test:e2e`
- `pnpm cf:build`
- `pnpm cf:preview`
- `pnpm cf:deploy`

## Recurring Transactions

Recurring rules stay editable, but historical periods are materialized into real transaction snapshots. Future periods remain virtual until reconciliation runs on demand when recurring-sensitive pages load, preserving accurate historical lookbacks without relying on cron as the primary mechanism.

## CI/CD

- Pull requests run typecheck, lint, format check, coverage, Playwright smoke tests, and a Cloudflare production build.
- Pushes to `main` run the deploy workflow after building and applying D1 migrations.
