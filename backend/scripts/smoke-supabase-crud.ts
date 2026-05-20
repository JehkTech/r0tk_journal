import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
}

const client = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

const run = async () => {
  const suffix = Date.now();
  const username = `smoke_user_${suffix}`;
  const email = `smoke_${suffix}@example.test`;
  const passwordHash = 'smoke-hash-not-used';

  const { data: user, error: userError } = await client
    .from('users')
    .insert({
      username,
      email,
      password_hash: passwordHash,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select('*')
    .single();

  if (userError || !user) {
    throw userError || new Error('Failed to create smoke user');
  }

  const { data: trade, error: tradeError } = await client
    .from('trades')
    .insert({
      user_id: user.id,
      pair: 'EUR/USD',
      side: 'Long',
      lot_size: 1,
      entry_price: 1.1,
      exit_price: 1.105,
      stop_loss: 1.09,
      take_profit: 1.12,
      session: 'London',
      strategy: 'SmokeTest',
      emotion: 'Calm',
      confidence: 7,
      notes: 'Smoke test trade',
      pnl: 500,
      trade_date: new Date().toISOString().slice(0, 10),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select('*')
    .single();

  if (tradeError || !trade) {
    throw tradeError || new Error('Failed to create smoke trade');
  }

  const { data: updatedTrade, error: updateError } = await client
    .from('trades')
    .update({
      notes: 'Smoke test trade - updated',
      updated_at: new Date().toISOString()
    })
    .eq('id', trade.id)
    .select('*')
    .single();

  if (updateError || !updatedTrade) {
    throw updateError || new Error('Failed to update smoke trade');
  }

  const { data: fetchedTrades, error: fetchError } = await client
    .from('trades')
    .select('*')
    .eq('user_id', user.id);

  if (fetchError) {
    throw fetchError;
  }

  const { error: deleteTradeError } = await client
    .from('trades')
    .delete()
    .eq('id', trade.id);

  if (deleteTradeError) {
    throw deleteTradeError;
  }

  const { error: deleteUserError } = await client
    .from('users')
    .delete()
    .eq('id', user.id);

  if (deleteUserError) {
    throw deleteUserError;
  }

  console.log('Smoke test complete.');
  console.log(`Trades fetched: ${fetchedTrades?.length || 0}`);
};

run().catch(error => {
  console.error('Smoke test failed:', error);
  process.exit(1);
});
