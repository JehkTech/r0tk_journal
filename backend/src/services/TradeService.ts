import { SupabaseClient } from '@supabase/supabase-js';
import type { Express } from 'express';
import { Trade, CreateTradeRequest, UpdateTradeRequest, TradeFilters, DashboardStats, AnalyticsData } from '../types';
import { format } from 'date-fns';

export class TradeService {
  constructor(private db: SupabaseClient) {}

  async createTrade(userId: string, tradeData: CreateTradeRequest): Promise<Trade> {
    const {
      pair,
      side,
      lot_size,
      entry_price,
      exit_price,
      stop_loss,
      take_profit,
      session,
      strategy,
      emotion,
      confidence,
      notes,
      trade_date
    } = tradeData;

    // Calculate PnL if exit price is provided
    let pnl: number | undefined;
    if (exit_price) {
      const priceDiff = side === 'Long' ? exit_price - entry_price : entry_price - exit_price;
      pnl = priceDiff * lot_size * 100000; // Assuming standard lot size calculation
    }

    const { data: trade, error } = await this.db
      .from('trades')
      .insert({
        user_id: userId,
        pair,
        side,
        lot_size,
        entry_price,
        exit_price,
        stop_loss,
        take_profit,
        session,
        strategy,
        emotion,
        confidence,
        notes,
        pnl,
        trade_date,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (error || !trade) {
      throw error || new Error('Failed to create trade');
    }

    return trade as Trade;
  }

  async getTrades(userId: string, filters: TradeFilters = {}): Promise<Trade[]> {
    let query = this.db
      .from('trades')
      .select('*')
      .eq('user_id', userId);

    if (filters.pair) {
      query = query.eq('pair', filters.pair);
    }
    if (filters.session) {
      query = query.eq('session', filters.session);
    }
    if (filters.emotion) {
      query = query.eq('emotion', filters.emotion);
    }
    if (filters.strategy) {
      query = query.eq('strategy', filters.strategy);
    }
    if (filters.start_date) {
      query = query.gte('trade_date', filters.start_date);
    }
    if (filters.end_date) {
      query = query.lte('trade_date', filters.end_date);
    }
    if (filters.min_pnl !== undefined) {
      query = query.gte('pnl', filters.min_pnl);
    }
    if (filters.max_pnl !== undefined) {
      query = query.lte('pnl', filters.max_pnl);
    }

    query = query.order('trade_date', { ascending: false });

    if (filters.limit !== undefined) {
      const offset = filters.offset || 0;
      const end = offset + filters.limit - 1;
      query = query.range(offset, end);
    }

    const { data: trades, error } = await query;

    if (error) {
      throw error;
    }

    return (trades as Trade[]) || [];
  }

  async getTradeById(userId: string, tradeId: string): Promise<Trade | null> {
    const { data: trade, error } = await this.db
      .from('trades')
      .select('*')
      .eq('id', tradeId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return (trade as Trade) || null;
  }

  async updateTrade(userId: string, tradeData: UpdateTradeRequest): Promise<Trade | null> {
    const { id, ...updateData } = tradeData;

    const { data: trade, error } = await this.db
      .from('trades')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .maybeSingle();

    if (error) {
      throw error;
    }

    return (trade as Trade) || null;
  }

  async deleteTrade(userId: string, tradeId: string): Promise<boolean> {
    const { data, error } = await this.db
      .from('trades')
      .delete()
      .eq('id', tradeId)
      .eq('user_id', userId)
      .select('id');

    if (error) {
      throw error;
    }

    return (data || []).length > 0;
  }

  async createScreenshots(tradeId: string, files: Express.Multer.File[]): Promise<number> {
    const payload = files.map(file => ({
      trade_id: tradeId,
      filename: file.filename,
      original_name: file.originalname,
      file_path: file.path,
      file_size: file.size,
      mime_type: file.mimetype,
      created_at: new Date().toISOString()
    }));

    const { error } = await this.db
      .from('screenshots')
      .insert(payload);

    if (error) {
      throw error;
    }

    return payload.length;
  }

  async getDashboardStats(userId: string): Promise<DashboardStats> {
    const completedTrades = await this.getCompletedTrades(userId);

    const totalPnL = completedTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const totalTrades = completedTrades.length;
    const winningTrades = completedTrades.filter(trade => (trade.pnl || 0) > 0).length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

    // Calculate average risk:reward
    const tradesWithRR = completedTrades.filter(trade => 
      trade.stop_loss !== undefined && trade.take_profit !== undefined
    );
    const avgRiskReward = tradesWithRR.length > 0 
      ? tradesWithRR.reduce((sum, trade) => {
          const risk = Math.abs(trade.entry_price - trade.stop_loss!);
          const reward = Math.abs(trade.take_profit! - trade.entry_price);
          return sum + (reward / risk);
        }, 0) / tradesWithRR.length
      : 0;

    // Get monthly performance for last 6 months
    const monthlyData = this.getMonthlyPerformance(completedTrades);
    
    // Get recent trades
    const recentTrades = await this.getTrades(userId, { limit: 5 });

    return {
      total_pnl: totalPnL,
      win_rate: winRate,
      avg_risk_reward: avgRiskReward,
      total_trades: totalTrades,
      monthly_performance: monthlyData,
      recent_trades: recentTrades
    };
  }

  private getMonthlyPerformance(trades: Trade[]): Array<{month: string, profit: number, loss: number, trades: number}> {
    const monthlyData: { [key: string]: { profit: number, loss: number, trades: number } } = {};

    trades.forEach(trade => {
      const month = format(new Date(trade.trade_date), 'yyyy-MM');
      if (!monthlyData[month]) {
        monthlyData[month] = { profit: 0, loss: 0, trades: 0 };
      }
      
      monthlyData[month].trades++;
      if (trade.pnl && trade.pnl > 0) {
        monthlyData[month].profit += trade.pnl;
      } else if (trade.pnl && trade.pnl < 0) {
        monthlyData[month].loss += Math.abs(trade.pnl);
      }
    });

    return Object.entries(monthlyData)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 6);
  }

  async getAnalyticsData(userId: string): Promise<AnalyticsData> {
    const completedTrades = await this.getCompletedTrades(userId);

    // Get session performance
    const sessionData: { [key: string]: { trades: number, winning_trades: number, profit: number } } = {};
    
    completedTrades.forEach(trade => {
      if (!sessionData[trade.session]) {
        sessionData[trade.session] = { trades: 0, winning_trades: 0, profit: 0 };
      }
      
      sessionData[trade.session].trades++;
      if (trade.pnl && trade.pnl > 0) {
        sessionData[trade.session].winning_trades++;
        sessionData[trade.session].profit += trade.pnl;
      }
    });

    const sessionPerformance = Object.entries(sessionData).map(([session, data]) => ({
      session,
      win_rate: data.trades > 0 ? (data.winning_trades / data.trades) * 100 : 0,
      trades: data.trades,
      profit: data.profit
    }));

    // Get emotion distribution
    const emotionData: { [key: string]: { count: number, winning_trades: number, total_pnl: number } } = {};
    
    completedTrades.forEach(trade => {
      if (trade.emotion) {
        if (!emotionData[trade.emotion]) {
          emotionData[trade.emotion] = { count: 0, winning_trades: 0, total_pnl: 0 };
        }
        
        emotionData[trade.emotion].count++;
        if (trade.pnl && trade.pnl > 0) {
          emotionData[trade.emotion].winning_trades++;
        }
        emotionData[trade.emotion].total_pnl += trade.pnl || 0;
      }
    });

    const emotionDistribution = Object.entries(emotionData).map(([emotion, data]) => ({
      emotion,
      count: data.count,
      win_rate: data.count > 0 ? (data.winning_trades / data.count) * 100 : 0,
      avg_pnl: data.count > 0 ? data.total_pnl / data.count : 0
    }));

    // Mock data for other analytics (in a real app, these would be calculated from actual data)
    const riskRewardDistribution = [
      { range: '0-0.5', count: 8 },
      { range: '0.5-1', count: 15 },
      { range: '1-1.5', count: 32 },
      { range: '1.5-2', count: 45 },
      { range: '2-3', count: 28 },
      { range: '3+', count: 12 }
    ];

    const commonMistakes = [
      { mistake: 'Early Exit', count: 23, impact: -850 },
      { mistake: 'No Stop Loss', count: 8, impact: -1200 },
      { mistake: 'Overleveraged', count: 12, impact: -950 },
      { mistake: 'FOMO Entry', count: 18, impact: -680 },
      { mistake: 'Revenge Trading', count: 6, impact: -1400 }
    ];

    const chakraAlignment = [
      { chakra: 'Root', alignment: 85, description: 'Grounding & Stability' },
      { chakra: 'Sacral', alignment: 72, description: 'Creativity & Flow' },
      { chakra: 'Solar', alignment: 91, description: 'Confidence & Power' },
      { chakra: 'Heart', alignment: 88, description: 'Balance & Compassion' },
      { chakra: 'Throat', alignment: 76, description: 'Expression & Truth' },
      { chakra: 'Third Eye', alignment: 94, description: 'Intuition & Insight' },
      { chakra: 'Crown', alignment: 82, description: 'Connection & Wisdom' }
    ];

    return {
      session_performance: sessionPerformance,
      emotion_distribution: emotionDistribution,
      risk_reward_distribution: riskRewardDistribution,
      common_mistakes: commonMistakes,
      chakra_alignment: chakraAlignment
    };
  }

  private async getCompletedTrades(userId: string): Promise<Trade[]> {
    const { data: trades, error } = await this.db
      .from('trades')
      .select('*')
      .eq('user_id', userId)
      .not('exit_price', 'is', null);

    if (error) {
      throw error;
    }

    return (trades as Trade[]) || [];
  }
}