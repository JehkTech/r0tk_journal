import { useState, useEffect } from 'react';
import { supabase, Settings } from '../supabase';

export function useSettings(userId?: string) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (!data) {
        // Create default settings if they don't exist
        const defaultSettings = {
          user_id: userId,
          show_win_rate: true,
          show_risk_reward: true,
          show_balance_curve: true,
          show_emotional_analysis: true,
          show_performance_metrics: true
        };

        const { data: newSettings, error: createError } = await supabase
          .from('user_settings')
          .insert([defaultSettings])
          .select()
          .single();

        if (createError) throw createError;
        setSettings(newSettings);
      } else {
        setSettings(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [userId]);

  const updateSettings = async (updates: Partial<Settings>) => {
    if (!settings) return;

    try {
      const { data, error: updateError } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('id', settings.id)
        .select()
        .single();

      if (updateError) throw updateError;
      
      setSettings(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update settings';
      setError(message);
      throw err;
    }
  };

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    refetch: fetchSettings
  };
}
