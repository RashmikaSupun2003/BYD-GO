import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://dpzauorvmzfpbslxktyj.supabase.co';
// Note: If this key doesn't work, get the anon/public key from:
// Supabase Dashboard -> Settings -> API -> Project API keys -> anon/public key
const supabaseAnonKey = 'sb_publishable_qz33LM7kw7xoz1TMBZQM5g_Gfzxm-V7';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection function (for debugging)
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('charging_stations')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Supabase connection test exception:', error);
    return { success: false, error };
  }
}

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

