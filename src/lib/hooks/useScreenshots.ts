import { useState, useEffect } from 'react';
import { supabase, Screenshot } from '../supabase';

export function useScreenshots(userId?: string) {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchScreenshots = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('screenshots')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setScreenshots(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch screenshots');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScreenshots();
  }, [userId]);

  const addScreenshot = async (screenshot: Omit<Screenshot, 'id' | 'created_at'>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('screenshots')
        .insert([screenshot])
        .select()
        .single();

      if (insertError) throw insertError;
      
      setScreenshots(prev => [data, ...prev]);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add screenshot';
      setError(message);
      throw err;
    }
  };

  const deleteScreenshot = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('screenshots')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      setScreenshots(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete screenshot';
      setError(message);
      throw err;
    }
  };

  return {
    screenshots,
    isLoading,
    error,
    addScreenshot,
    deleteScreenshot,
    refetch: fetchScreenshots
  };
}
