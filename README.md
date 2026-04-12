# Trading Journal

A lightweight trading journal app built with Next.js, Material UI, Prisma, and SQLite.

For full architecture and implementation details, see [Documentation.md](Documentation.md).

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create or update `.env.local` with a Prisma SQLite URL:

```env
DATABASE_URL="file:./dev.db"
```

### 3. Prepare database

```bash
npx prisma generate
npx prisma db push
```

### 4. Run the app

```bash
npm run dev
```

Open http://localhost:3000

## Daily Commands

### Start dev server

```bash
npm run dev
```

### Build production bundle

```bash
npm run build
```

### Start production server

```bash
npm run start
```

### Run linting

```bash
npm run lint
```

### Refresh Prisma client after schema changes

```bash
npx prisma generate
```

### Push schema changes to SQLite

```bash
npx prisma db push
```

## Current App Routes

- `/` home
- `/journal` create journal entry
- `/dashboard` view metrics and entries
- `/api/journal` API endpoint (GET, POST)

## Notes

- This baseline stores selected document file names, not uploaded file binaries.
- Default account and emotion seed data are ensured by the API route on request.
