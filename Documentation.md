# Trading Journal Application

Comprehensive Technical Specification

Document version: 2.0.0
Last updated: 2026-04-12
Primary stack: Next.js (Pages Router) + Material UI + Prisma + SQLite

---

## 1. Document Purpose and Scope

This document is the full technical specification for the current Trading Journal codebase in this repository.

It is intended for:
- Developers implementing features
- Reviewers validating architecture and behavior
- Operators running the project locally or in deployment

It covers:
- Architecture and system boundaries
- Source structure and module responsibilities
- Data model and API contract details
- Runtime behavior and state flows
- Setup, operations, troubleshooting, and known gaps

It does not claim implementation of features that are not present in code.

---

## 2. Executive Summary

Trading Journal is a lightweight journaling platform for trade entries. Users can:
- Create journal records with pricing, risk, and notes
- Tag entries with emotions
- Select document files (file names captured in baseline)
- Review performance summaries on a dashboard

Current implementation status:
- Baseline MVP flow is complete for create + list + dashboard summary
- Authentication, file storage, and automated tests are not yet implemented

---

## 3. Technology Baseline

### 3.1 Runtime and Framework

- Next.js 13.4.12 (Pages Router)
- React 18.2.0
- Node.js runtime (recommended LTS)

### 3.2 UI and Styling

- Material UI 5.14.0
- Emotion (`@emotion/react`, `@emotion/styled`)
- App-level light/dark toggle implemented in `_app.jsx`

### 3.3 Data Layer

- Prisma 4.16.1
- SQLite datasource via `DATABASE_URL`

### 3.4 Tooling

- ESLint via `next lint`
- Next.js build tooling (SWC minify enabled)

### 3.5 Installed but not used in baseline flow

- `mongodb` dependency is present in `package.json` but not used by current runtime code paths

---

## 4. System Architecture

### 4.1 Logical Layers

1. Presentation layer
- Next.js pages under `src/pages`
- Material UI components and layout shell

2. Client state layer
- Context provider under `src/lib/context/UserContext.js`
- Holds baseline account and emotion options

3. API layer
- Route handler at `src/pages/api/journal.js`
- Performs validation, normalization, database operations

4. Persistence layer
- Prisma client exported from `lib/prisma/client.js`
- Models defined in `prisma/schema.prisma`

### 4.2 Request/Response Flow (Happy Path)

1. User fills form on `/journal`
2. `JournalForm` posts payload to `POST /api/journal`
3. API validates required fields and normalizes payload
4. API resolves account and emotion records
5. Prisma writes `JournalEntry`
6. API returns created object with relation includes
7. User opens `/dashboard`
8. Dashboard fetches `GET /api/journal`
9. UI computes summary metrics and renders entries

### 4.3 Configuration Surface

- `.env.local` provides `DATABASE_URL`
- `next.config.js` enables strict mode and SWC minify

---

## 5. Repository Layout and Responsibilities

```text
/trading
├── Documentation.md                       # Full technical specification (this file)
├── README.md                              # Short developer quickstart
├── next.config.js                         # Next.js runtime config
├── package.json                           # Scripts and dependencies
├── lib/
│   └── prisma/
│       └── client.js                      # Prisma client singleton export
├── prisma/
│   └── schema.prisma                      # Data models and datasource
├── public/                                # Static assets (currently empty)
└── src/
    ├── components/
    │   ├── DocumentUploader.jsx           # File picker (name capture)
    │   ├── EmotionSelector.jsx            # Emotion dropdown control
    │   └── JournalForm.jsx                # Trade entry form + POST logic
    ├── lib/
    │   └── context/
    │       └── UserContext.js             # Baseline app context provider
    └── pages/
        ├── _app.jsx                       # Global shell + theme toggle + provider
        ├── index.jsx                      # Home page
        ├── journal.jsx                    # Entry creation page
        ├── dashboard.jsx                  # Metrics and entries table
        └── api/
            └── journal.js                 # Journal API route (GET/POST)
```

---

## 6. Frontend Specification

## 6.1 Global App Shell (`src/pages/_app.jsx`)

Responsibilities:
- Creates MUI theme object using mode state (`light` or `dark`)
- Wraps app with:
  - `ThemeProvider`
  - `CssBaseline`
  - `UserProvider`
- Provides sticky app bar with color mode toggle button
- Wraps page content in `Container` and `Box`

Important behavior:
- Theme mode is local React state (not persisted to localStorage)

## 6.2 User Context (`src/lib/context/UserContext.js`)

Context values:
- `accountId`: fixed integer `1`
- `emotions`: default in-memory list
  - Fear
  - Greed
  - Joy
  - Neutral

Guard behavior:
- `useUser()` throws if used outside provider

Design note:
- Context is baseline scaffolding and not identity-aware yet

## 6.3 Home Page (`src/pages/index.jsx`)

Purpose:
- Provide simple entry point and navigation to core workflows

Actions:
- `Log New Trade` button routes to `/journal`
- `Open Dashboard` button routes to `/dashboard`

## 6.4 Journal Page (`src/pages/journal.jsx`)

Purpose:
- Entry creation interface

Composition:
- Header + navigation button to dashboard
- `JournalForm` component

## 6.5 Journal Form (`src/components/JournalForm.jsx`)

### Form model

Fields tracked in local state:
- `symbol: string`
- `killzone: string`
- `open: string` (converted to number before submit)
- `close: string` (converted to number before submit)
- `risk: string` (converted to number before submit)
- `notes: string`
- `emotionId: number`
- `documents: string[]`

### Validation and conversion behavior

Client-side requirements before submission:
- `symbol`, `killzone`, `open`, `close`, `risk` via UI required fields

Payload normalization before POST:
- `open`, `close`, `risk`, `emotionId` coerced to `Number`
- `accountId` injected from context

### UX behavior

- Disables submit button while request is in flight
- Displays success alert after save
- Displays error alert when API responds non-OK or request fails
- Resets form to initial state on success

## 6.6 Emotion Selector (`src/components/EmotionSelector.jsx`)

Purpose:
- Controlled `Select` component for emotion ID

Inputs:
- `emotions`
- `value`
- `onChange`

## 6.7 Document Uploader (`src/components/DocumentUploader.jsx`)

Purpose:
- Baseline document attachment selector

Behavior:
- Accepts PDF/PNG/JPEG selection
- Supports multiple files
- Emits selected file names to parent

Current limitation:
- No binary upload or storage operation

## 6.8 Dashboard (`src/pages/dashboard.jsx`)

### Data loading

- Performs `GET /api/journal` in `useEffect` on first render
- Stores entries in local state
- Stores fetch error message in local state

### Derived metrics

- `totalTrades`: `entries.length`
- `winRate`: percentage where `close > open`
- `averageRisk`: arithmetic mean of `risk`, fixed to 2 decimals

### Table output

Columns:
- Symbol
- Emotion
- Open
- Close
- Risk
- Created

Empty state:
- Displays `No entries yet. Add your first trade.` row

---

## 7. API Specification

Route file: `src/pages/api/journal.js`
Endpoint base: `/api/journal`

### 7.1 Method Matrix

- `GET`: list journal entries
- `POST`: create journal entry
- other methods: `405 Method not allowed`

### 7.2 Baseline Data Bootstrap

Before handling method logic, the route ensures:
- At least one `UserAccount` exists
  - if none: creates `Primary Account`
- Default emotions exist using upsert by `name`
  - Fear
  - Greed
  - Joy
  - Neutral

This behavior guarantees minimum reference records for POST fallback logic.

### 7.3 GET /api/journal

#### Behavior

- Fetches all `JournalEntry` records
- Sorts by `createdAt desc`
- Includes relation objects:
  - `emotion`
  - `account`
- Parses `documents` from JSON string to array in response

#### Response (200 example)

```json
[
  {
    "id": 12,
    "symbol": "EURUSD",
    "killzone": "London",
    "open": 1.0825,
    "close": 1.0842,
    "risk": 0.5,
    "notes": "Clean break and retest",
    "documents": ["plan.pdf", "chart.png"],
    "emotionId": 2,
    "accountId": 1,
    "createdAt": "2026-04-12T07:00:00.000Z",
    "emotion": { "id": 2, "name": "Greed", "createdAt": "2026-04-12T06:00:00.000Z" },
    "account": { "id": 1, "name": "Primary Account", "balance": 0, "createdAt": "2026-04-12T06:00:00.000Z" }
  }
]
```

### 7.4 POST /api/journal

#### Required logical fields

- `symbol`
- `open`
- `close`
- `risk`

If missing, returns `400` with:

```json
{ "error": "Missing required trade fields." }
```

#### Optional fields

- `killzone`
- `accountId`
- `emotionId`
- `notes`
- `documents`

#### Fallback behavior

- If `accountId` omitted: uses first account by ascending ID
- If `emotionId` omitted: uses first emotion by ascending ID

If either cannot be resolved:

```json
{ "error": "Unable to resolve account or emotion." }
```

#### Stored transformations

- `symbol` uppercased
- `killzone` defaults to `N/A` if empty
- `documents` stored as JSON string in DB

#### Success response (201)

Returns created record with `emotion`, `account`, and parsed `documents` array.

### 7.5 Error Codes

- `200`: successful list
- `201`: successful create
- `400`: invalid payload or unresolved relation
- `405`: unsupported method
- `500`: internal processing failure

---

## 8. Persistence and Data Model

Schema file: `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model UserAccount {
  id        Int            @id @default(autoincrement())
  name      String
  balance   Float          @default(0)
  createdAt DateTime       @default(now())
  entries   JournalEntry[]
}

model Emotion {
  id        Int            @id @default(autoincrement())
  name      String         @unique
  createdAt DateTime       @default(now())
  entries   JournalEntry[]
}

model JournalEntry {
  id        Int         @id @default(autoincrement())
  symbol    String
  killzone  String
  open      Float
  close     Float
  risk      Float
  documents String      @default("[]")
  notes     String
  emotion   Emotion     @relation(fields: [emotionId], references: [id])
  emotionId Int
  account   UserAccount @relation(fields: [accountId], references: [id])
  accountId Int
  createdAt DateTime    @default(now())
}
```

### 8.1 Field Semantics

`JournalEntry.documents`:
- Persisted as serialized JSON string, not a native list type
- Always parsed in API response layer before returning to frontend

`Emotion.name`:
- Unique constraint to support idempotent upsert during bootstrap

### 8.2 Referential Integrity

- `JournalEntry.accountId` references `UserAccount.id`
- `JournalEntry.emotionId` references `Emotion.id`

---

## 9. Configuration and Environment

## 9.1 Required env vars

File: `.env.local`

Required:
- `DATABASE_URL`

Example:

```env
DATABASE_URL="file:./dev.db"
```

Current repository note:
- `.env.local` exists but may be empty until configured locally

## 9.2 Next.js config

File: `next.config.js`

Current options:
- `reactStrictMode: true`
- `swcMinify: true`
- `images.domains: []`

---

## 10. Local Development Runbook

## 10.1 Initial setup

```bash
npm install
```

Add `.env.local`:

```env
DATABASE_URL="file:./dev.db"
```

Initialize Prisma artifacts:

```bash
npx prisma generate
npx prisma db push
```

Start app:

```bash
npm run dev
```

## 10.2 Daily commands

Development server:

```bash
npm run dev
```

Lint:

```bash
npm run lint
```

Build:

```bash
npm run build
```

Serve production build:

```bash
npm run start
```

After schema changes:

```bash
npx prisma generate
npx prisma db push
```

## 10.3 Validation smoke test

1. Open `/`
2. Navigate to `/journal`
3. Submit a sample trade
4. Navigate to `/dashboard`
5. Confirm metric cards and table include new entry
6. Refresh dashboard and confirm persistence

---

## 11. Non-Functional Characteristics

### 11.1 Performance

Current baseline:
- Small UI bundle footprint due minimal feature set
- Server operations are simple synchronous request/response DB operations

Not yet implemented:
- Query pagination
- Caching strategy
- performance budgets and measurement pipeline

### 11.2 Accessibility

Current baseline:
- Uses semantic MUI controls and labels
- Includes color mode toggle with `aria-label`

Not yet implemented:
- formal WCAG audit
- keyboard interaction audit matrix

### 11.3 Security

Current baseline:
- Method restriction (`405`) on unsupported HTTP methods
- Basic required-field validation for create endpoint

Not yet implemented:
- authentication/authorization
- rate limiting
- payload sanitization hardening
- CSRF policy definition

---

## 12. Testing Status

Automated test suites:
- Not implemented in repository at this stage

Recommended immediate additions:
- API integration tests for `GET/POST /api/journal`
- Component tests for `JournalForm` and dashboard metric computation
- End-to-end happy path (create entry -> visible on dashboard)

---

## 13. Known Gaps and Roadmap Priorities

### 13.1 Functional gaps

- User authentication and multi-account ownership
- Real document upload/storage pipeline
- Emotion CRUD management UI
- Strong server-side validation schema (type + range + domain checks)

### 13.2 Engineering gaps

- Automated test coverage
- CI checks for lint/build/test and docs freshness
- Observability and error telemetry
- Data migration strategy for future model changes

### 13.3 Dependency hygiene

- Remove or justify unused `mongodb` dependency

---

## 14. Troubleshooting Guide

### 14.1 `PrismaClientInitializationError`

Likely causes:
- Missing or invalid `DATABASE_URL`
- SQLite file path not writable

Actions:
1. Verify `.env.local` has a valid `DATABASE_URL`
2. Run `npx prisma generate`
3. Run `npx prisma db push`

### 14.2 POST returns `Missing required trade fields.`

Cause:
- One of `symbol`, `open`, `close`, `risk` missing or undefined in request

Action:
- Inspect payload sent from form/network tab

### 14.3 POST returns `Unable to resolve account or emotion.`

Cause:
- Supplied IDs do not exist and fallback retrieval failed

Action:
- Ensure baseline seed bootstrap can run and DB is accessible

### 14.4 Dashboard empty after submit

Possible causes:
- POST failed silently in UI (check alert)
- GET call failing (dashboard error alert)
- Different database file path between runs

Actions:
1. Check browser network for POST and GET status
2. Verify `.env.local` unchanged
3. Re-run Prisma commands

---

## 15. Documentation Strategy

- `README.md` is intentionally short and task-oriented (quick start + daily commands)
- `Documentation.md` is the long-form technical specification
- New feature changes should update both:
  - README: only if developer workflow changes
  - Documentation.md: always for architecture/API/model behavior changes

---

## 16. Change Log

### 2026-04-12 (v2.0.0)

- Replaced compact spec with comprehensive full technical specification
- Expanded frontend, API, persistence, operations, and troubleshooting sections
- Added explicit contracts, field semantics, and failure mode guidance
- Clarified current capabilities versus planned roadmap

### 2026-04-12 (v1.x prior rewrite)

- Removed stale generated sections
- Corrected file extensions and implementation mismatches
- Aligned schema and API descriptions with actual code
