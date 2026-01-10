import { useState, useEffect } from 'react';
import { supabase, Trade } from '../supabase';

export function useTrades(userId?: string) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrades = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (fetchError) throw fetchError;
      setTrades(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trades');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, [userId]);

  const addTrade = async (trade: Omit<Trade, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('trades')
        .insert([trade])
        .select()
        .single();

      if (insertError) throw insertError;
      
      setTrades(prev => [data, ...prev]);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add trade';
      setError(message);
      throw err;
    }
  };

  const updateTrade = async (id: string, updates: Partial<Trade>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('trades')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      
      setTrades(prev => prev.map(t => t.id === id ? data : t));
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update trade';
      setError(message);
      throw err;
    }
  };

  const deleteTrade = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('trades')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      setTrades(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete trade';
      setError(message);
      throw err;
    }
  };

  const getStats = () => {
    if (trades.length === 0) {
      return {
        totalTrades: 0,
        winRate: 0,
        totalPnL: 0,
        averageRR: 0,
        winningTrades: 0,
        losingTrades: 0
      };
    }

    const winningTrades = trades.filter(t => t.profit_loss > 0);
    const losingTrades = trades.filter(t => t.profit_loss < 0);
    const totalPnL = trades.reduce((sum, t) => sum + t.profit_loss, 0);
    const averageRR = trades.reduce((sum, t) => sum + t.rr_ratio, 0) / trades.length;

    return {
      totalTrades: trades.length,
      winRate: Math.round((winningTrades.length / trades.length) * 100),
      totalPnL,
      averageRR: averageRR.toFixed(2),
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length
    };
  };

  return {
    trades,
    isLoading,
    error,
    addTrade,
    updateTrade,
    deleteTrade,
    getStats,
    refetch: fetchTrades
  };
}
