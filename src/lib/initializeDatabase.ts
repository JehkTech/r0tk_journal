import { supabase } from './supabase';

export async function initializeDatabase() {
  try {
    // Create trades table
    const { error: tradesError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS trades (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          date DATE NOT NULL,
          pair VARCHAR NOT NULL,
          side VARCHAR NOT NULL CHECK (side IN ('Long', 'Short')),
          entry_price DECIMAL NOT NULL,
          exit_price DECIMAL NOT NULL,
          risk_amount DECIMAL NOT NULL,
          profit_loss DECIMAL NOT NULL,
          rr_ratio DECIMAL NOT NULL,
          session VARCHAR,
          notes TEXT,
          screenshot_url VARCHAR,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(user_id, date, pair)
        );
        
        CREATE INDEX IF NOT EXISTS trades_user_id_idx ON trades(user_id);
        CREATE INDEX IF NOT EXISTS trades_date_idx ON trades(date);
      `
    }).catch(() => ({ error: null }));

    // Create notes table
    const { error: notesError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS notes (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          title VARCHAR NOT NULL,
          content TEXT NOT NULL,
          pair VARCHAR,
          trade_id UUID REFERENCES trades(id) ON DELETE SET NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS notes_user_id_idx ON notes(user_id);
        CREATE INDEX IF NOT EXISTS notes_trade_id_idx ON notes(trade_id);
      `
    }).catch(() => ({ error: null }));

    // Create screenshots table
    const { error: screenshotsError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS screenshots (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          url VARCHAR NOT NULL,
          trade_id UUID REFERENCES trades(id) ON DELETE SET NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS screenshots_user_id_idx ON screenshots(user_id);
        CREATE INDEX IF NOT EXISTS screenshots_trade_id_idx ON screenshots(trade_id);
      `
    }).catch(() => ({ error: null }));

    // Create settings table
    const { error: settingsError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS user_settings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
          show_win_rate BOOLEAN DEFAULT TRUE,
          show_risk_reward BOOLEAN DEFAULT TRUE,
          show_balance_curve BOOLEAN DEFAULT TRUE,
          show_emotional_analysis BOOLEAN DEFAULT TRUE,
          show_performance_metrics BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `
    }).catch(() => ({ error: null }));

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}
