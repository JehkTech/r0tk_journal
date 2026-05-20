import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

dotenv.config();

interface LowDbSchema {
  users: Array<{
    id: number;
    username: string;
    email: string;
    password_hash: string;
    created_at: string;
    updated_at: string;
  }>;
  trades: Array<{
    id: number;
    user_id: number;
    pair: string;
    side: 'Long' | 'Short';
    lot_size: number;
    entry_price: number;
    exit_price?: number;
    stop_loss?: number;
    take_profit?: number;
    session: 'Asian' | 'London' | 'NY' | 'Overlap';
    strategy?: string;
    emotion?: 'Confident' | 'Focused' | 'Calm' | 'Rushed' | 'Uncertain' | 'Fearful' | 'Greedy';
    confidence?: number;
    notes?: string;
    pnl?: number;
    trade_date: string;
    created_at: string;
    updated_at: string;
  }>;
  screenshots: Array<{
    id: number;
    trade_id: number;
    filename: string;
    original_name: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    created_at: string;
  }>;
  analytics_cache: Array<{
    id: number;
    user_id: number;
    cache_key: string;
    cache_data: string;
    expires_at: string;
    created_at: string;
  }>;
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
}

const client = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

const databaseDir = process.env.DATABASE_PATH || './data';
const dbPath = path.join(databaseDir, 'db.json');

if (!fs.existsSync(dbPath)) {
  throw new Error(`LowDB file not found at ${dbPath}`);
}

const raw = fs.readFileSync(dbPath, 'utf-8');
const lowdb: LowDbSchema = JSON.parse(raw);

const userIdMap = new Map<number, string>();
const tradeIdMap = new Map<number, string>();

const chunkArray = <T>(items: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

const parseCacheData = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const insertChunk = async (table: string, rows: Array<Record<string, any>>) => {
  if (rows.length === 0) {
    return;
  }
  const { error } = await client.from(table).insert(rows);
  if (error) {
    throw error;
  }
};

const migrate = async () => {
  console.log('Migrating users...');
  const usersPayload = lowdb.users.map(user => {
    const newId = crypto.randomUUID();
    userIdMap.set(user.id, newId);
    return {
      id: newId,
      username: user.username,
      email: user.email,
      password_hash: user.password_hash,
      legacy_user_id: user.id,
      created_at: user.created_at,
      updated_at: user.updated_at
    };
  });

  for (const chunk of chunkArray(usersPayload, 500)) {
    await insertChunk('users', chunk);
  }

  console.log('Migrating trades...');
  const tradesPayload = lowdb.trades.map(trade => {
    const newId = crypto.randomUUID();
    tradeIdMap.set(trade.id, newId);
    return {
      id: newId,
      user_id: userIdMap.get(trade.user_id),
      pair: trade.pair,
      side: trade.side,
      lot_size: trade.lot_size,
      entry_price: trade.entry_price,
      exit_price: trade.exit_price,
      stop_loss: trade.stop_loss,
      take_profit: trade.take_profit,
      session: trade.session,
      strategy: trade.strategy,
      emotion: trade.emotion,
      confidence: trade.confidence,
      notes: trade.notes,
      pnl: trade.pnl,
      trade_date: trade.trade_date,
      legacy_trade_id: trade.id,
      created_at: trade.created_at,
      updated_at: trade.updated_at
    };
  }).filter(trade => trade.user_id);

  for (const chunk of chunkArray(tradesPayload, 500)) {
    await insertChunk('trades', chunk);
  }

  console.log('Migrating screenshots...');
  const screenshotsPayload = lowdb.screenshots.map(screenshot => ({
    id: crypto.randomUUID(),
    trade_id: tradeIdMap.get(screenshot.trade_id),
    filename: screenshot.filename,
    original_name: screenshot.original_name,
    file_path: screenshot.file_path,
    file_size: screenshot.file_size,
    mime_type: screenshot.mime_type,
    legacy_screenshot_id: screenshot.id,
    created_at: screenshot.created_at
  })).filter(screenshot => screenshot.trade_id);

  for (const chunk of chunkArray(screenshotsPayload, 500)) {
    await insertChunk('screenshots', chunk);
  }

  console.log('Migrating analytics cache...');
  const cachePayload = lowdb.analytics_cache.map(cache => ({
    id: crypto.randomUUID(),
    user_id: userIdMap.get(cache.user_id),
    cache_key: cache.cache_key,
    cache_data: parseCacheData(cache.cache_data),
    expires_at: cache.expires_at,
    legacy_cache_id: cache.id,
    created_at: cache.created_at
  })).filter(cache => cache.user_id);

  for (const chunk of chunkArray(cachePayload, 500)) {
    await insertChunk('analytics_cache', chunk);
  }

  console.log('Migration complete.');
};

migrate().catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
});
