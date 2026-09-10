# DwellOS — Architecture (Phase 1)

Working name: **DwellOS**. Source concept: [`product-concept.md`](product-concept.md) (originally drafted in `idea-lab/app_ideas/`, moved here now that this is an active project).

## Tech stack

| Concern            | Choice                                   | Why |
|--------------------|-------------------------------------------|-----|
| App framework      | Next.js (App Router, TypeScript)          | Single deployable for web UI + API routes; avoids standing up a separate backend for the MVP. |
| Styling            | Tailwind CSS                              | Fast to iterate on CRUD-heavy screens. |
| Database           | PostgreSQL                                | Relational model fits the Home → Room → Asset → (Document/Maintenance/Service) hierarchy directly. |
| ORM                | Prisma                                    | Schema-first, typed client, straightforward migrations. |
| Vector search       | `pgvector` extension on the same Postgres | Keeps retrieval data co-located with the relational data instead of standing up a separate vector DB before it's needed. Added when Phase 3 (RAG) lands. |
| Object storage      | S3-compatible (MinIO locally, S3/R2 in prod) | Manuals, receipts, and photos are files, not rows; keeps the DB small. |
| Auth                | Auth.js (NextAuth) with Prisma adapter    | Standard session/account/user tables, easy to add OAuth providers later. |
| AI generation       | Anthropic Claude                          | Grounded Q&A generation over retrieved document chunks (Phase 3). |
| Local dev orchestration | `docker-compose` (Postgres+pgvector, MinIO) | One command to get a working local backend without cloud accounts. |

Deliberately deferred: mobile client, background job runner, embeddings provider choice. None are needed to prove the Phase 1/2 vertical slice.

## Repository structure

```
DwellOS/
  src/
    app/          # Next.js routes (pages + API route handlers)
    lib/          # Shared utilities (db client, storage client, auth config)
    server/       # Server-only domain logic (asset, document, maintenance services)
  prisma/
    schema.prisma # Source of truth for the data model
  docs/
    architecture.md
  docker-compose.yml
  .env.example
```

As the intelligence layer (Phase 3) is added, ingestion/retrieval code lives under `src/server/ai/`.

## Conventions

- TypeScript everywhere; no `any` in new code without a comment explaining why.
- Server-only logic (DB writes, storage access, AI calls) stays under `src/server/`; route handlers in `src/app/api/**` stay thin and delegate to it.
- Prisma is the only thing that talks to Postgres directly — no raw SQL outside `prisma/` unless a query genuinely needs it (e.g. vector similarity search).
- Money is `Decimal`, not `Float`.
- Every table that references another entity is indexed on the foreign key (see `schema.prisma`).
- Env vars are documented in `.env.example` whenever one is added.

## High-level architecture (target, Phase 3+)

```
Web Client (Next.js)
        |
        v
Next.js API routes
        |
        +------------------+------------------+
        |                  |                  |
        v                  v                  v
   PostgreSQL         Object Storage      Claude (AI)
 (Home/Room/Asset/     (manuals, receipts,      ^
  Maintenance/          photos)                 |
  ServiceEvent)              |                  |
        |                    v                  |
        |             Document ingestion        |
        |             (parse/chunk/embed)        |
        |                    |                  |
        +--------> pgvector similarity search ---+
                    (retrieval for grounded answers)
```

## Data model

See `prisma/schema.prisma`. Mirrors the entities from the product doc:

- `User` / `Account` / `Session` / `VerificationToken` — Auth.js.
- `Home` — owned by a `User`.
- `Room` — optional grouping within a `Home`.
- `Asset` — the core entity; belongs to a `Home`, optionally a `Room`.
- `Document` — files attached to an `Asset` (manual, receipt, warranty, etc).
- `MaintenancePlan` — recurring maintenance tied to an `Asset`.
- `ServiceEvent` — repair/service history tied to an `Asset`.

Not yet modeled (Phase 3+): document chunks/embeddings for retrieval, household multi-user membership, contractor entities. These are intentionally left out until the phase that needs them, per the product doc's own phased backlog.

## Phase 1 status

- [x] Local workspace (Next.js + TypeScript + Tailwind, VS Code settings)
- [x] Tech stack chosen (this doc)
- [x] Repository structure and conventions (this doc)
- [x] System architecture (this doc)
- [x] Core database schema (`prisma/schema.prisma`)

## Phase 2 status (Asset platform)

Built as Server Components + Server Actions directly against Prisma (`src/server/*`) rather than a separate REST API layer — idiomatic for this app's App Router and there's no separate client that needs one yet.

- [x] Authentication — Credentials provider (email + password, bcrypt), JWT sessions (`src/auth.ts`). No Prisma adapter wired up since Credentials doesn't support database sessions; `Account`/`Session` tables stay ready for a future OAuth provider. Route protection: `src/proxy.ts` (Next.js 16 renamed Middleware to Proxy) redirects unauthenticated visits, **plus** each protected page/Server Action checks `auth()` itself — Proxy matchers don't cover direct Server Function calls, so it can't be the only guard.
- [x] Home management — CRUD for `Home` scoped to the signed-in owner (`src/server/homes.ts`; `ownerId` is part of every query's `where`, not checked after the fact). `/homes` lists a user's homes plus an add form; `/homes/[id]` edits or deletes one. Server Actions call `revalidatePath` before `redirect` — without it Next.js's client Router Cache keeps serving the pre-mutation `/homes` list on the client-side navigation the redirect triggers.
- [ ] Room/location management
- [ ] Room/location management
- [ ] Asset CRUD
- [ ] Document upload/storage
- [ ] Maintenance records
- [ ] Service history
