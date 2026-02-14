import { ChargingStationRow, supabase } from '@/config/supabase';
import { EVStation, Location } from '@/types';

// Image mapping for stations (based on location/name)
const STATION_IMAGES: { [key: string]: any } = {
  'Colombo': require('@/assets/images/Colombo.jpg'),
  'Battaramulla': require('@/assets/images/Battaramulla.jpg'),
  'Athurugiriya': require('@/assets/images/Athurugiriya.jpg'),
  'Kohuwala': require('@/assets/images/Kohuwala.jpg'),
  'Bellanthota': require('@/assets/images/Bellanthota.jpg'),
  'Negombo': require('@/assets/images/Negombo.jpg'),
  'Gampaha': require('@/assets/images/Gampaha.jpg'),
  'Minuwangoda': require('@/assets/images/Minuwangoda.jpg'),
  'Kalutara': require('@/assets/images/Kalutara.jpg'),
  'Peradeniya': require('@/assets/images/Peradeniya.jpg'),
};

// Helper function to get image for station
function getStationImage(name: string, address: string): any {
  const nameLower = name.toLowerCase();
  const addressLower = address.toLowerCase();
  
  for (const [key, image] of Object.entries(STATION_IMAGES)) {
    if (nameLower.includes(key.toLowerCase()) || addressLower.includes(key.toLowerCase())) {
      return image;
    }
  }
  return null;
}

// Helper function to get connector count based on station name
function parseConnectorCount(name: string, chargerType: string): number {
  const nameLower = name.toLowerCase();
  
  // Map station names to their connector counts
  const connectorCounts: { [key: string]: number } = {
    'darley road': 2,
    'battaramulla': 1,
    'kottawa': 3,
    'athurugiriya': 3,
    'kohuwala': 6,
    'attidiya': 5,
    'bellanthota': 5,
    'kurana': 1,
    'miriswatta': 2,
    'ja-ela': 3,
    'minuwangoda': 3,
    'kalutara': 1,
    'peradeniya': 2,
    'kandy': 2,
  };
  
  for (const [key, count] of Object.entries(connectorCounts)) {
    if (nameLower.includes(key)) {
      return count;
    }
  }
  
  // Try to extract number from charger_type as fallback
  const match = chargerType.match(/(\d+)/);
  return match ? parseInt(match[1]) : 1;
}

// Helper function to parse connector types from charger_type
function parseConnectorTypes(chargerType: string): string[] {
  if (!chargerType) return ['CCS2', 'CHAdeMO'];
  
  const types: string[] = [];
  if (chargerType.includes('CCS2') || chargerType.includes('CCS')) {
    types.push('CCS2');
  }
  if (chargerType.includes('CHAdeMO')) {
    types.push('CHAdeMO');
  }
  if (chargerType.includes('Type 2')) {
    types.push('Type 2');
  }
  
  return types.length > 0 ? types : ['CCS2', 'CHAdeMO'];
}

// Convert Supabase row to EVStation
function convertToEVStation(row: ChargingStationRow, location?: Location): EVStation {
  const station: EVStation = {
    id: row.id.toString(),
    name: row.name,
    address: row.address,
    latitude: row.latitude,
    longitude: row.longitude,
    available: row.status.toLowerCase() === 'available' || row.status.toLowerCase() === 'active',
    connectorTypes: parseConnectorTypes(row.charger_type),
    connectorCount: parseConnectorCount(row.name, row.charger_type),
    image: getStationImage(row.name, row.address),
  };

  // Calculate distance if location provided
  if (location) {
    station.distance = calculateDistance(
      location.latitude,
      location.longitude,
      row.latitude,
      row.longitude
    );
  }

  return station;
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

export async function getEVStations(
  location: Location,
  radius: number = 10
): Promise<EVStation[]> {
  try {
    // Fetch charging stations from Supabase
    console.log('Fetching stations from Supabase...');
    console.log('Supabase URL:', 'https://dpzauorvmzfpbslxktyj.supabase.co');
    
    const { data, error } = await supabase
      .from('charging_stations')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Supabase Error Details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      console.error('Full Supabase Error Object:', JSON.stringify(error, null, 2));
      
      // Check for common errors
      if (error.code === 'PGRST301' || error.message?.includes('permission')) {
        console.error('⚠️ Row Level Security (RLS) Error: The charging_stations table may have RLS enabled. Please disable RLS or create a policy to allow public read access.');
      }
      if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
        console.error('⚠️ Table Error: The charging_stations table may not exist. Please verify the table name in your Supabase dashboard.');
      }
      
      return [];
    }

    console.log('Supabase query result:', { dataLength: data?.length, data: data });

    if (!data || data.length === 0) {
      console.log('⚠️ No stations found in Supabase - returning empty array');
      console.log('💡 Tip: Check if RLS is disabled or if you have data in the charging_stations table');
      return [];
    }

    console.log(`✅ Successfully fetched ${data.length} stations from Supabase`);

    // Convert Supabase rows to EVStation format
    const stations = data.map((row) => convertToEVStation(row, location));
    
    // Filter by radius if specified
    if (radius < 500) {
      return stations.filter((station) => (station.distance || 0) <= radius);
    }
    
    return stations;
  } catch (error) {
    console.error('Error in getEVStations:', error);
    return [];
  }
}

export async function searchEVStationsByAddress(
  address: string,
  location: Location
): Promise<EVStation[]> {
  // Show all Keells charging stations near the searched location
  // Use a large radius to show all stations in Sri Lanka, sorted by distance
  const allStations = await getEVStations(location, 500); // Large radius to include all stations
  
  // Sort by distance (closest first)
  return allStations.sort((a, b) => {
    const distA = a.distance || 0;
    const distB = b.distance || 0;
    return distA - distB;
  });
}
