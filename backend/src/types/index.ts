export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface Trade {
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
}

export interface Screenshot {
  id: number;
  trade_id: number;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

export interface CreateTradeRequest {
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
  trade_date: string;
}

export interface UpdateTradeRequest extends Partial<CreateTradeRequest> {
  id: number;
}

export interface TradeFilters {
  pair?: string;
  session?: string;
  emotion?: string;
  strategy?: string;
  start_date?: string;
  end_date?: string;
  min_pnl?: number;
  max_pnl?: number;
  limit?: number;
  offset?: number;
}

export interface DashboardStats {
  total_pnl: number;
  win_rate: number;
  avg_risk_reward: number;
  total_trades: number;
  monthly_performance: Array<{
    month: string;
    profit: number;
    loss: number;
    trades: number;
  }>;
  recent_trades: Trade[];
}

export interface AnalyticsData {
  session_performance: Array<{
    session: string;
    win_rate: number;
    trades: number;
    profit: number;
  }>;
  emotion_distribution: Array<{
    emotion: string;
    count: number;
    win_rate: number;
    avg_pnl: number;
  }>;
  risk_reward_distribution: Array<{
    range: string;
    count: number;
  }>;
  common_mistakes: Array<{
    mistake: string;
    count: number;
    impact: number;
  }>;
  chakra_alignment: Array<{
    chakra: string;
    alignment: number;
    description: string;
  }>;
}
