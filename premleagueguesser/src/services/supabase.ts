import { createClient } from '@supabase/supabase-js';
import type { Player } from '../types';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const getPlayers = async (): Promise<Player[]> => {
  const { data, error } = await supabase
    .from('players')
    .select('*');
  
  if (error) throw error;
  return data;
};

export const updatePlayerData = async (players: Player[]) => {
  const { error } = await supabase
    .from('players')
    .upsert(players);
  
  if (error) throw error;
};