# R0TK 7-Day Production Readiness Sprint

Started: 2026-06-04
Goal: Move R0TK Trading Journal from prototype/demo state toward production readiness with verified security, backend data flow, frontend integration, tests, and documentation.

## Sprint Rules

- Follow the loop: Plan, review UI and docs, write code, test, review UI and docs, fix, test, iterate.
- Keep docs updated in the same change set as implementation.
- Prefer backend-only Supabase access. The frontend talks to the backend.
- Record skipped tests with the reason and release risk.
- Do not mark a risk closed without repo evidence or a command result.

## Day Plan

| Day | Focus | Done When |
| --- | --- | --- |
| 1 | Sprint system, security review, monitor surface | Sprint docs exist, security review is truthful, security status endpoint and dashboard page build. |
| 2 | Backend production hardening | JWT production checks, route-specific rate limits, safer upload naming, and backend tests land. |
| 3 | Frontend API integration | Dashboard, journal, and analytics read authenticated backend data with loading/error states. |
| 4 | Supabase and data integrity | Schema/RLS review, migration docs, CRUD smoke path, and screenshot storage plan are verified. |
| 5 | Test and CI gates | Frontend tests, backend tests, build checks, and security/dependency scan commands are documented. |
| 6 | UX production polish | Empty states, responsive issues, form validation, and user-facing errors are cleaned up. |
| 7 | Release readiness | README, deployment guide, env docs, smoke checklist, and release-risk report are complete. |

## Current Sprint Backlog

| ID | Task | Status | Notes |
| --- | --- | --- | --- |
| D1-01 | Replace fictional security report with repo-verified review | Done | `.security-review.md` now separates verified controls from open risks. |
| D1-02 | Add backend security monitor endpoint | Done | `GET /api/security/status` returns pass/warn/fail checks. |
| D1-03 | Add dashboard view for security monitor | Done | Sidebar has Security Monitor page. |
| D1-04 | Document persistent agent workflow | Done | See `docs/AGENT_WORKFLOW.md`. |
| D2-01 | Fail closed on weak production JWT secret | Done | Production now throws on missing, short, or legacy fallback `JWT_SECRET`. |
| D2-02 | Add stricter auth/trade mutation rate limits | Next | Login/register and write endpoints need narrower limits. |
| D2-03 | Add backend tests for auth and trade ownership | Next | Start with service/route unit tests, including session revocation. |
| D2-04 | Triage backend dependency vulnerabilities | Next | Backend install reports 9 vulnerabilities, including 4 high. |
| D2-05 | Move screenshot binaries to Supabase Storage | Todo | Metadata already records ownership; implement upload/download/delete against `trade-screenshots`. |
| D2-06 | Persist dev runtime logs automatically | In progress | Added `npm run dev:logged`; still needs stop workflow and port-conflict handling. |
| D2-07 | Add revocable JWT sessions | In progress | Code and schema draft are in place; active Supabase DB migration and backend tests still needed. |
| D3-01 | Replace dashboard mock data with backend API data | Pending | Needs frontend auth/token flow decision. |
| D4-01 | Complete Supabase RLS/schema review | Pending | Follow Supabase checklist before schema changes. |

## Requested Todo List

| Task | Priority | Acceptance Criteria |
| --- | --- | --- |
| Upload storage | Medium | Screenshot files are stored in the private Supabase Storage bucket, metadata keeps `user_id`, `trade_id`, and `storage_path`, and local disk is not the source of truth. |
| Runtime log persistence | Medium | Starting the system through one command creates timestamped frontend/backend stdout/stderr logs under `reports/runtime-logs/`. |
| JWT fallback secret | High | Production startup fails when `JWT_SECRET` is missing, weak, or set to the old fallback value. |
| JWT session lifecycle | Medium | Login creates a revocable server-side session; auth checks reject revoked/expired sessions; logout and password change revoke sessions. |

## Verification Log

| Command | Result | Notes |
| --- | --- | --- |
| `npm run build` | Passed | Frontend build works. Vite reports a chunk-size warning for later code splitting. |
| `npm test -- --run` | Passed | Frontend smoke test covers the app shell and Security Monitor nav entry. |
| `npm run build` from `backend/` | Passed | Added explicit backend TypeScript ambient types to avoid broken empty `@types` directories. |
| `npm test -- --runInBand` from `backend/` | Failed | No Jest tests exist yet; D2-03 tracks adding them. |
| `npm run build` from `backend/` after JWT session changes | Passed | Auth middleware is now async and session-aware. |
| `npm run build` after log script/docs changes | Passed | Frontend remains buildable. |
| `npm test -- --run` after JWT/log changes | Passed | Existing frontend smoke test still passes. |
| `npm test -- --runInBand` from `backend/` after JWT changes | Failed | No Jest tests exist yet; D2-03 remains open. |

## View The Security Monitor

1. Start the backend from `backend/` with `npm run dev`.
2. Start the frontend from the repo root with `npm run dev`.
3. Open the Vite URL and choose `Security Monitor` in the sidebar.
4. Direct backend check: `http://localhost:3001/api/security/status`.

The frontend uses `VITE_API_URL` when set, otherwise it falls back to `http://localhost:3001`.

## Logged Dev Startup

Run `npm run dev:logged` from the repo root to start both dev servers and write logs under `reports/runtime-logs/<timestamp>/`.
