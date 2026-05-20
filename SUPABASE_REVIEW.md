# Supabase Schema Review: Trading Journal App

## 1. Table Layout – MOSTLY GOOD, Minor Refinements

### ✅ Current Structure
```sql
users → trades → screenshots (via foreign keys)
         └→ analytics_cache
```

### 🔧 Recommended Refinements

**Users Table:**
```sql
-- Add auth integration columns (if not delegating to Supabase Auth)
-- Consider: remove password_hash if using supabase.auth.users
ALTER TABLE users ADD COLUMN auth_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
-- legacy_user_id is good for migration
```

**Trades Table:**
```sql
-- GOOD: All core columns present
-- CONSIDER: Add settlement status for open trades tracking
ALTER TABLE trades ADD COLUMN status TEXT DEFAULT 'open' 
  CHECK (status IN ('open', 'closed', 'cancelled'));
  
-- Add composite unique constraint to prevent duplicate trades in same session
ALTER TABLE trades ADD CONSTRAINT no_duplicate_session_entries 
  UNIQUE(user_id, trade_date, session, pair);
```

**Screenshots Table:**
```sql
-- CURRENT: Links to trades only
-- ENHANCEMENT: Add storage_path for cleanup tracking
ALTER TABLE screenshots ADD COLUMN storage_path TEXT UNIQUE NOT NULL
  DEFAULT ('trades/' || gen_random_uuid() || '.jpg');
-- This enables deterministic deletion from storage without parsing file_path
```

**Analytics Cache:**
```sql
-- GOOD as-is but consider partitioning if huge volume
-- Index on (user_id, expires_at) is better than separate indexes
CREATE INDEX idx_analytics_cache_user_expires 
  ON analytics_cache(user_id, expires_at DESC);
```

---

## 2. Indexes – CRITICAL GAPS

### ❌ Missing Production Indexes

```sql
-- MISSING: Composite index for common queries
CREATE INDEX idx_trades_user_date_pair 
  ON trades(user_id, trade_date DESC, pair);

-- MISSING: Speed up single trade lookups (prevent Seq Scan)
CREATE INDEX idx_trades_id_user_id 
  ON trades(id, user_id);

-- MISSING: PNL calculations and reporting queries
CREATE INDEX idx_trades_user_pnl 
  ON trades(user_id, pnl DESC) WHERE pnl IS NOT NULL;

-- MISSING: Partial index for "open trades" queries (common filter)
CREATE INDEX idx_trades_open_trades 
  ON trades(user_id, created_at DESC) WHERE exit_price IS NULL;

-- MISSING: Screenshots by user (if dashboard shows all screenshots)
CREATE INDEX idx_screenshots_user_created 
  ON screenshots(trade_id, created_at DESC)
  INCLUDE (filename, file_size);  -- PostgreSQL 11+ covering index

-- MISSING: Cascade cleanup optimization
CREATE INDEX idx_screenshots_trade_id 
  ON screenshots(trade_id);  -- Already exists but ensure it's there
```

### 🗂️ Index Strategy
- **Keep `trades_user_id_idx`** ✓ (JOIN backbone)
- **Consolidate `trades_trade_date_idx + trades_pair_idx`** → Composite index for filtering
- **Add `idx_trades_open_trades`** to prevent scanning closed trades
- **Use INCLUDE clause** for covering indexes (screenshot queries)

---

## 3. RLS Policy Patterns – MISSING & CRITICAL

### ⚠️ Current Issue: NO RLS policies defined

Add to `schema.sql`:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE screenshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_cache ENABLE ROW LEVEL SECURITY;

-- ✅ Users: Own profile only
CREATE POLICY "Users can only view/update own profile"
  ON users FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ✅ Trades: Full ownership enforcement
CREATE POLICY "Trades are private to owner"
  ON trades FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ✅ Screenshots: Transitive ownership via trades
CREATE POLICY "Screenshots only accessible via owned trade"
  ON screenshots FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM trades 
      WHERE trades.id = screenshots.trade_id 
      AND trades.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trades 
      WHERE trades.id = screenshots.trade_id 
      AND trades.user_id = auth.uid()
    )
  );

-- ✅ Analytics Cache: User-scoped access
CREATE POLICY "Cache data is private to owner"
  ON analytics_cache FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- OPTIMIZATION: Service role bypass for batch operations
-- (Supabase handles this automatically with anon key vs service_role key)
```

### ⚠️ RLS Performance Notes
- Screenshot policy uses **subquery** (acceptable for small tables)
- For 100k+ screenshots, consider denormalizing `user_id` to `screenshots` table
- Test with `explain_execute_rls_policy()`

---

## 4. Storage Bucket Access Policies – SETUP REQUIRED

### 📦 Recommended Setup

```sql
-- Create bucket for trade screenshots
INSERT INTO storage.buckets (id, name, public)
VALUES ('trade-screenshots', 'trade-screenshots', false);

-- Set up RLS for storage bucket
CREATE POLICY "Users can upload screenshots for their trades"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'trade-screenshots' 
    AND auth.uid()::text = (storage.foldername(name))[1]
    -- Storage path: [user_id]/[trade_id]/[filename]
  );

CREATE POLICY "Users can view/delete own screenshots"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'trade-screenshots'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

### 📋 Storage Folder Structure
```
trade-screenshots/
├── [user_id]/
│   ├── [trade_id]/
│   │   ├── entry-screenshot-[timestamp].jpg
│   │   ├── exit-screenshot-[timestamp].jpg
│   │   └── analysis-[timestamp].jpg
```

### 🔐 Best Practices
- **Signed URLs** for temporary download access (60-120 min expiry)
- **Enforce file size limits** (5MB per image, 25MB per trade max)
- **Scan for malware** using Supabase Edge Functions + ClamAV
- **Implement orphan cleanup** (cron job to delete screenshots if trade is deleted)

---

## 5. Production Pitfalls & Fixes

### 🚨 Critical Issues

| Issue | Risk | Fix |
|-------|------|-----|
| **No RLS policies** | Data leaks between users | Add RLS (see #3) |
| **No composite index on common queries** | Slow analytics/dashboards at scale | Add `idx_trades_user_date_pair` |
| **Screenshot soft-delete only** | Orphaned files grow storage | Implement hard delete with storage cleanup |
| **No open trade filter** | Full table scans on dashboard | Add `idx_trades_open_trades` partial index |
| **No transactional consistency** | Trades created without screenshots verified | Use `ON DELETE CASCADE` ✓ already good |
| **analytics_cache no TTL cleanup** | Unbounded table growth | Add `VACUUM` trigger or cron job |

### ⚠️ High Priority

1. **Add RLS immediately** (security blocker)
2. **Composite indexes** (performance: 10-100x faster dashboards)
3. **Handle screenshot orphans** (storage cost blocker)

### 📊 Scaling Checkpoints

| Metric | Threshold | Action |
|--------|-----------|--------|
| Trades per user | 10k+ | Partition `trades` by `user_id` or date range |
| Screenshots per trade | 5+ avg | Add `trade_id` clustering index |
| Daily inserts | 100k+ | Enable parallel index builds; set `maintenance_work_mem` |
| Cache entries | 1M+ | Implement cache archival; move expired to separate table |

---

## 6. Query Optimization Examples

### ❌ Current Problem Query (N+1)
```typescript
// Application code calling DB per trade
const trades = await getTrades(userId);
for (const trade of trades) {
  trade.screenshots = await getScreenshots(trade.id);  // N+1 ❌
}
```

### ✅ Optimized Query
```sql
SELECT 
  t.id, t.pair, t.pnl, t.created_at,
  COALESCE(
    json_agg(
      json_build_object(
        'id', s.id,
        'filename', s.filename,
        'file_size', s.file_size
      ) ORDER BY s.created_at DESC
    ) FILTER (WHERE s.id IS NOT NULL),
    '[]'::json
  ) as screenshots
FROM trades t
LEFT JOIN screenshots s ON s.trade_id = t.id
WHERE t.user_id = $1
GROUP BY t.id
ORDER BY t.trade_date DESC
LIMIT 100;
```

---

## Summary: Production Readiness Checklist

- [ ] Add RLS policies (security critical)
- [ ] Add composite index `idx_trades_user_date_pair`
- [ ] Add partial index `idx_trades_open_trades`
- [ ] Implement screenshot orphan cleanup (cron function)
- [ ] Set up `analytics_cache` TTL cleanup
- [ ] Create storage bucket with file size limits
- [ ] Test `EXPLAIN ANALYZE` on dashboard queries
- [ ] Configure connection pooling (Supabase Pooler: transaction mode)
- [ ] Set up slow query logging (`log_min_duration_statement`)
- [ ] Add monitoring for index bloat and table sizes

**Current Grade:** B+ (solid foundation, security gaps, missing production indexes)
