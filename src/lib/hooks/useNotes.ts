import { useState, useEffect } from 'react';
import { supabase, Note } from '../supabase';

export function useNotes(userId?: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setNotes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [userId]);

  const addNote = async (note: Omit<Note, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('notes')
        .insert([note])
        .select()
        .single();

      if (insertError) throw insertError;
      
      setNotes(prev => [data, ...prev]);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add note';
      setError(message);
      throw err;
    }
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      
      setNotes(prev => prev.map(n => n.id === id ? data : n));
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update note';
      setError(message);
      throw err;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      setNotes(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete note';
      setError(message);
      throw err;
    }
  };

  return {
    notes,
    isLoading,
    error,
    addNote,
    updateNote,
    deleteNote,
    refetch: fetchNotes
  };
}
