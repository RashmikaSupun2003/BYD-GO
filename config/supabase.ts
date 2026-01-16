import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://dpzauorvmzfpbslxktyj.supabase.co';
const supabaseAnonKey = 'sb_publishable_qz33LM7kw7xoz1TMBZQM5g_Gfzxm-V7';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table interface
export interface ChargingStationRow {
  id: number;
  name: string;
  address: string;
  operator: string;
  charger_type: string;
  latitude: number;
  longitude: number;
  status: string;
}

// Favorites table interface
export interface FavoriteRow {
  id?: number;
  user_email: string;
  station_id: string;
  station_data?: any; // JSON data of the station
  created_at?: string;
}

