# AGENTS.md

## Purpose

This file is the operational guide for agents and technical contributors working in this repository.
Use it to implement changes consistently with the MVP decisions already documented elsewhere.

## Project State

- This repository is in the initial implementation phase of the OrbitGuard Fire MVP.
- Product scope, technical refinement, data model, and API contracts are already defined.
- Current work should preserve the demonstrative MVP flow while keeping the codebase ready to evolve toward JWT, PostgreSQL, and PostGIS-backed behavior.

## Source of Truth

Read the relevant documents before changing code:

- `README.md`
- `tasks/prd-orbitguard-fire-mvp.md`
- `tasks/tasks-orbitguard-fire-mvp.md`
- `docs/mvp-foundation.md`
- `docs/mvp-technical-refinement.md`
- `docs/mvp-data-model.md`
- `docs/api-contracts.md`

If implementation conflicts with one of these documents, align the code to the documented decision or update the affected document in the same change.

## Current Technical Direction

- Backend: NestJS + TypeScript
- Persistence model: Prisma targeting PostgreSQL
- MVP strategy: controlled mocks first, with coherent fallback behavior
- API surface: documented HTTP contracts must remain stable and explicit
- Architecture constraint: do not block future evolution to JWT authentication and PostGIS-enabled spatial workflows

## Repository Responsibilities

- `backend/`: domain modules, contracts, entities, services, tests, and integration adapters
- `database/`: Prisma schema and database-related assets
- `docs/`: technical decisions, contracts, and refinement artifacts
- `tasks/`: PRD, execution breakdown, and delivery tracking

## Implementation Rules

- Prefer incremental delivery aligned with the MVP flow, not speculative production-grade expansion.
- Start from documented mocks and fallback scenarios before introducing real external integrations.
- Keep domain concepts, Prisma schema, and HTTP contracts consistent with each other.
- Do not invent parallel architecture, duplicate modules, or alternate contract shapes outside the documented direction.

## Update Rules

- If you change entities or domain structures, review the Prisma schema and the related technical documentation.
- If you change HTTP request or response shapes, update the TypeScript contracts and `docs/api-contracts.md` in the same change.
- If a task status changes, update `tasks/tasks-orbitguard-fire-mvp.md` in the same change.
- Do not mark a task as complete without validation evidence: automated test coverage or an explicit manual verification note.

## Commit Strategy

Prefer semantic commits with one concern per commit:

- `docs(...)` for planning, PRD, and technical documentation
- `feat(domain)` for entities, enums, and Prisma schema changes
- `feat(api)` for contracts, endpoints, and shared API shapes
- `test(...)` for unit, integration, or E2E coverage
- `chore(...)` for setup, tooling, and non-functional repository work

Avoid mixing documentation, domain modeling, and API contract work in a single commit when they can be separated cleanly.

## Git Conventions

- Branches must use a clear type prefix, with `feat/` as the default for feature work.
- Other accepted prefixes are `fix/`, `docs/`, `test/`, and `chore/` when they better describe the scope of the branch.
- Branch names should be short, lowercase, kebab-case after the prefix, for example `feat/git-conventions`.
- Commit messages must be single-line subjects only.
- Do not add commit body paragraphs, bullet lists, or multi-line explanations.
- Prefer Conventional Commits style subjects, for example `feat(git): add branch naming rule` or `docs(git): define commit format`.
- Do not use empty scope parentheses like `feat()`: use `feat(scope): ...` when a scope exists, or `feat: ...` when it does not.
- Keep the subject imperative, concise, and limited to the change itself.
- When a change is small and does not need a scope, use the shortest valid subject that still communicates intent.

Reference: `docs/git-conventions.md`.

## Minimum Done Criteria

Before considering work complete:

- code matches the documented MVP direction
- affected docs and tasks are updated
- contracts and domain remain internally consistent
- validation was executed or explicitly recorded
