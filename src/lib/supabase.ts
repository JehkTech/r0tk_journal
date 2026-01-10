import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: supabaseUrl ? '✓' : '✗ VITE_SUPABASE_URL',
    key: supabaseAnonKey ? '✓' : '✗ VITE_SUPABASE_ANON_KEY'
  });
}

export const supabase = createClient(
  supabaseUrl || 'https://mreyajsuuynnwbtpwfnv.supabase.co',
  supabaseAnonKey || ''
);

export type User = {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
};

export type Trade = {
  id: string;
  user_id: string;
  date: string;
  pair: string;
  side: 'Long' | 'Short';
  entry_price: number;
  exit_price: number;
  risk_amount: number;
  profit_loss: number;
  rr_ratio: number;
  session: string;
  notes: string;
  screenshot_url?: string;
  created_at: string;
  updated_at: string;
};

export type Note = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  pair?: string;
  trade_id?: string;
  created_at: string;
  updated_at: string;
};

export type Screenshot = {
  id: string;
  user_id: string;
  url: string;
  trade_id?: string;
  description?: string;
  created_at: string;
};

export type Settings = {
  id: string;
  user_id: string;
  show_win_rate: boolean;
  show_risk_reward: boolean;
  show_balance_curve: boolean;
  show_emotional_analysis: boolean;
  show_performance_metrics: boolean;
  created_at: string;
  updated_at: string;
};
