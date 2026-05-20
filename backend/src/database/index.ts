import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class DatabaseManager {
  private client: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    }

    this.client = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}

export default DatabaseManager;