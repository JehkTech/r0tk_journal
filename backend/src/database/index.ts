import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';

interface DatabaseSchema {
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

const defaultData: DatabaseSchema = {
  users: [],
  trades: [],
  screenshots: [],
  analytics_cache: []
};

export class DatabaseManager {
  private db: Low<DatabaseSchema>;
  private nextUserId = 1;
  private nextTradeId = 1;
  private nextScreenshotId = 1;
  private nextCacheId = 1;

  constructor() {
    const file = path.join(process.env.DATABASE_PATH || './data', 'db.json');
    const adapter = new JSONFile<DatabaseSchema>(file);
    this.db = new Low(adapter, defaultData);
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    await this.db.read();
    
    // Set next IDs based on existing data
    if (this.db.data.users.length > 0) {
      this.nextUserId = Math.max(...this.db.data.users.map(u => u.id)) + 1;
    }
    if (this.db.data.trades.length > 0) {
      this.nextTradeId = Math.max(...this.db.data.trades.map(t => t.id)) + 1;
    }
    if (this.db.data.screenshots.length > 0) {
      this.nextScreenshotId = Math.max(...this.db.data.screenshots.map(s => s.id)) + 1;
    }
    if (this.db.data.analytics_cache.length > 0) {
      this.nextCacheId = Math.max(...this.db.data.analytics_cache.map(c => c.id)) + 1;
    }
  }

  getDb(): Low<DatabaseSchema> {
    return this.db;
  }

  getNextUserId(): number {
    return this.nextUserId++;
  }

  getNextTradeId(): number {
    return this.nextTradeId++;
  }

  getNextScreenshotId(): number {
    return this.nextScreenshotId++;
  }

  getNextCacheId(): number {
    return this.nextCacheId++;
  }

  async save(): Promise<void> {
    await this.db.write();
  }
}

export default DatabaseManager;