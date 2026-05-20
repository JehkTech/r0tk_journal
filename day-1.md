# Day 1 - Environment Setup & Supabase Integration

## Goal
Replace LowDB with Supabase (Postgres) while preserving API behavior.

## LowDB Schema Snapshot (Current)
**users**
- id (number)
- username (string)
- email (string)
- password_hash (string)
- created_at (string)
- updated_at (string)

**trades**
- id (number)
- user_id (number)
- pair (string)
- side (Long|Short)
- lot_size (number)
- entry_price (number)
- exit_price (number, optional)
- stop_loss (number, optional)
- take_profit (number, optional)
- session (Asian|London|NY|Overlap)
- strategy (string, optional)
- emotion (Confident|Focused|Calm|Rushed|Uncertain|Fearful|Greedy, optional)
- confidence (number, optional)
- notes (string, optional)
- pnl (number, optional)
- trade_date (string)
- created_at (string)
- updated_at (string)

**screenshots**
- id (number)
- trade_id (number)
- filename (string)
- original_name (string)
- file_path (string)
- file_size (number)
- mime_type (string)
- created_at (string)

**analytics_cache**
- id (number)
- user_id (number)
- cache_key (string)
- cache_data (string)
- expires_at (string)
- created_at (string)

## Draft Supabase Schema
- SQL draft: backend/supabase/schema.sql
- Notes:
  - Uses Supabase Auth + profiles table.
  - Adds indexes for common filters and analytics.

## Day 1 Todo List
- [x] Capture current LowDB schema fields
- [x] Draft Supabase schema SQL (UUID-first)
- [x] Add backend Supabase environment variables
- [x] Implement Supabase DatabaseManager replacement
- [x] Refactor services/routes to UUIDs + Supabase queries
- [x] Create data migration script (LowDB -> Supabase)
- [ ] CRUD smoke test against Supabase
- [ ] Update day-1 report

## Phase Testing & Report Rule
Every completed feature phase must be tested and recorded in the report doc.
- Report doc: reports/day-1-report.md
