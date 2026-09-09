# DwellOS

The operating system for your home: a persistent, structured record of every asset in a home (appliances, HVAC, plumbing, etc.) with an AI layer that answers questions grounded in that exact asset's manuals, warranty, and service history.

Working name; original concept doc: [`docs/product-concept.md`](docs/product-concept.md). Architecture and phase status: [`docs/architecture.md`](docs/architecture.md).

## Stack

Next.js (App Router, TypeScript) + Tailwind, PostgreSQL + Prisma (`pgvector` for retrieval once Phase 3 lands), S3-compatible object storage, Auth.js, Claude for grounded Q&A generation. See [`docs/architecture.md`](docs/architecture.md) for rationale.

## Local development

1. Copy env vars: `cp .env.example .env`
2. Start Postgres + MinIO: `docker compose up -d`
3. Install deps: `npm install`
4. Apply the schema: `npx prisma migrate dev`
5. Run the app: `npm run dev`

Open [http://localhost:3000](http://localhost:3000).

## Project layout

```
src/app/      Next.js routes (pages + API route handlers)
src/lib/      Shared utilities (db client, storage client, auth config)
src/server/   Server-only domain logic
prisma/       Data model (schema.prisma)
docs/         Architecture and design notes
```

## Status

Phase 1 (foundation) complete — see [`docs/architecture.md`](docs/architecture.md#phase-1-status) for the checklist. Phase 2 (asset platform: auth, CRUD, document upload) is next.
