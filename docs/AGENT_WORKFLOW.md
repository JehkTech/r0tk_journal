# Persistent Project Workflow

This file is the durable project instruction layer. Use it at the start of every implementation session before coding.

## Operating Loop

1. Plan the smallest useful slice.
2. Review the current UI, docs, and code relevant to that slice.
3. Write the implementation.
4. Test the behavior with the narrowest reliable command first, then broader checks.
5. Review the UI and docs again.
6. Fix what failed.
7. Repeat until the slice is done.
8. Move to the next sprint task and repeat the same loop.

## What Belongs Where

- Instructions: durable human/agent rules in docs, README, and repository guidance files.
- Rules: automated or semi-automated checks in scripts, tests, linting, CI, and pre-commit hooks.
- Hooks: local or CI triggers that run rules at specific moments, such as pre-commit, pre-push, pull request, deployment, or smoke test.

The process memory should live in instructions plus checklists. Enforcement should live in rules and hooks.

## Required Context Files

- `docs/SPRINT.md` for the active sprint and backlog.
- `DEV_CONSTRAINTS.md` for execution constraints.
- `.security-review.md` for current security risk state.
- `BACKEND_ARCHITECTURE.md` for backend design intent.
- `SUPABASE_REVIEW.md` before Supabase schema, RLS, or auth changes.

## Completion Criteria

A task is complete only when:

- Code is implemented.
- Relevant docs are updated.
- Tests or build checks are run, or skipped with a documented reason.
- Any remaining risk is listed in the sprint backlog or security review.
