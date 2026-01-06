import { Low } from 'lowdb';
import { Trade, CreateTradeRequest, UpdateTradeRequest, TradeFilters, DashboardStats, AnalyticsData } from '../types';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

interface DatabaseSchema {
  users: Array<any>;
  trades: Array<Trade>;
  screenshots: Array<any>;
  analytics_cache: Array<any>;
}

export class TradeService {
  constructor(private db: Low<DatabaseSchema>) {}

  async createTrade(userId: number, tradeData: CreateTradeRequest): Promise<Trade> {
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

    const trade: Trade = {
      id: (this.db.data.trades.length > 0 ? Math.max(...this.db.data.trades.map(t => t.id)) : 0) + 1,
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
    };

    this.db.data.trades.push(trade);
    await this.db.write();
    
    return trade;
  }

  async getTrades(userId: number, filters: TradeFilters = {}): Promise<Trade[]> {
    let trades = this.db.data.trades.filter(trade => trade.user_id === userId);

    // Apply filters
    if (filters.pair) {
      trades = trades.filter(trade => trade.pair === filters.pair);
    }
    if (filters.session) {
      trades = trades.filter(trade => trade.session === filters.session);
    }
    if (filters.emotion) {
      trades = trades.filter(trade => trade.emotion === filters.emotion);
    }
    if (filters.strategy) {
      trades = trades.filter(trade => trade.strategy === filters.strategy);
    }
    if (filters.start_date) {
      trades = trades.filter(trade => trade.trade_date >= filters.start_date!);
    }
    if (filters.end_date) {
      trades = trades.filter(trade => trade.trade_date <= filters.end_date!);
    }
    if (filters.min_pnl !== undefined) {
      trades = trades.filter(trade => trade.pnl !== undefined && trade.pnl >= filters.min_pnl!);
    }
    if (filters.max_pnl !== undefined) {
      trades = trades.filter(trade => trade.pnl !== undefined && trade.pnl <= filters.max_pnl!);
    }

    // Sort by trade date descending
    trades.sort((a, b) => new Date(b.trade_date).getTime() - new Date(a.trade_date).getTime());

    // Apply pagination
    if (filters.offset) {
      trades = trades.slice(filters.offset);
    }
    if (filters.limit) {
      trades = trades.slice(0, filters.limit);
    }

    return trades;
  }

  async getTradeById(userId: number, tradeId: number): Promise<Trade | null> {
    const trade = this.db.data.trades.find(t => t.id === tradeId && t.user_id === userId);
    return trade || null;
  }

  async updateTrade(userId: number, tradeData: UpdateTradeRequest): Promise<Trade | null> {
    const { id, ...updateData } = tradeData;
    
    const tradeIndex = this.db.data.trades.findIndex(t => t.id === id && t.user_id === userId);
    if (tradeIndex === -1) {
      return null;
    }

    const trade = this.db.data.trades[tradeIndex];
    const updatedTrade = {
      ...trade,
      ...updateData,
      updated_at: new Date().toISOString()
    };

    this.db.data.trades[tradeIndex] = updatedTrade;
    await this.db.write();
    
    return updatedTrade;
  }

  async deleteTrade(userId: number, tradeId: number): Promise<boolean> {
    const tradeIndex = this.db.data.trades.findIndex(t => t.id === tradeId && t.user_id === userId);
    if (tradeIndex === -1) {
      return false;
    }

    this.db.data.trades.splice(tradeIndex, 1);
    await this.db.write();
    
    return true;
  }

  async getDashboardStats(userId: number): Promise<DashboardStats> {
    const completedTrades = this.db.data.trades.filter(trade => 
      trade.user_id === userId && trade.exit_price !== undefined
    );

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

  async getAnalyticsData(userId: number): Promise<AnalyticsData> {
    const completedTrades = this.db.data.trades.filter(trade => 
      trade.user_id === userId && trade.exit_price !== undefined
    );

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
}