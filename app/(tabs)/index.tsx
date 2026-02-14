import Header from '@/components/Header';
import HorizontalStationList from '@/components/HorizontalStationList';
import MapViewComponent from '@/components/MapView';
import SearchBar from '@/components/SearchBar';
import { getEVStations, searchEVStationsByAddress } from '@/services/evStations';
import { EVStation, Location as LocationType } from '@/types';
import * as Location from 'expo-location';
import { Linking } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    StyleSheet,
    View,
} from 'react-native';

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

// Center on Sri Lanka (Colombo area)
const INITIAL_REGION = {
  latitude: 6.9271,
  longitude: 79.8612,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

export default function HomeScreen() {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [searchedLocation, setSearchedLocation] = useState<LocationType | null>(null);
  const [stations, setStations] = useState<EVStation[]>([]);
  const [selectedStation, setSelectedStation] = useState<EVStation | null>(null);
  const [region, setRegion] = useState<Region>(INITIAL_REGION);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    // Load stations with current location or default to Sri Lanka center
    const locationToUse = location || {
      latitude: 6.9271,
      longitude: 79.8612,
    };
    loadStations(locationToUse);
  }, [location]);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to find nearby charging stations.'
        );
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const newLocation: LocationType = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      setLocation(newLocation);
      setRegion({
        latitude: newLocation.latitude,
        longitude: newLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      if (mapRef.current && Platform.OS !== 'web') {
        mapRef.current.animateToRegion({
          latitude: newLocation.latitude,
          longitude: newLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get your location');
    } finally {
      setLoading(false);
    }
  };

  const loadStations = async (locationToUse?: LocationType) => {
    const loc = locationToUse || location;
    if (!loc) {
      // Use default Sri Lanka location
      const defaultLoc: LocationType = {
        latitude: 6.9271,
        longitude: 79.8612,
      };
      try {
        // Load all Keells stations, sorted by distance
        const nearbyStations = await getEVStations(defaultLoc, 500); // Large radius to show all stations
        console.log('Loaded stations count (default):', nearbyStations.length);
        const sortedStations = nearbyStations.sort((a, b) => {
          const distA = a.distance || 0;
          const distB = b.distance || 0;
          return distA - distB;
        });
        setStations(sortedStations);
        console.log('Stations set in state (default):', sortedStations.length);
      } catch (error) {
        console.error('Error loading stations:', error);
        Alert.alert('Error', 'Failed to load charging stations');
      }
      return;
    }

    try {
      // Load all Keells stations, sorted by distance
      const nearbyStations = await getEVStations(loc, 500); // Large radius to show all stations
      console.log('Loaded stations count:', nearbyStations.length);
      const sortedStations = nearbyStations.sort((a, b) => {
        const distA = a.distance || 0;
        const distB = b.distance || 0;
        return distA - distB;
      });
      setStations(sortedStations);
      console.log('Stations set in state:', sortedStations.length);
    } catch (error) {
      console.error('Error loading stations:', error);
      Alert.alert('Error', 'Failed to load charging stations');
    }
  };

  const handleLocationSelect = async (newLocation: LocationType, address: string) => {
    setSearchedLocation(newLocation);
    setLocation(newLocation);
    setRegion({
      latitude: newLocation.latitude,
      longitude: newLocation.longitude,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    });

    if (mapRef.current && Platform.OS !== 'web') {
      mapRef.current.animateToRegion({
        latitude: newLocation.latitude,
        longitude: newLocation.longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      });
    }

    try {
      // Load all Keells charging stations near the searched location
      const foundStations = await searchEVStationsByAddress(address, newLocation);
      setStations(foundStations);
    } catch (error) {
      console.error('Error searching stations:', error);
      // Fallback to loading all stations
      loadStations(newLocation);
    }
  };

  const openDirections = (station: EVStation) => {
    // Use searched location if available, otherwise use current location
    const startLocation = searchedLocation || location;
    
    if (!startLocation) {
      Alert.alert('Error', 'Location not available. Please enable location services.');
      return;
    }

    const startLat = startLocation.latitude;
    const startLng = startLocation.longitude;
    const endLat = station.latitude;
    const endLng = station.longitude;

    let url = '';

    if (Platform.OS === 'ios') {
      // Apple Maps
      url = `http://maps.apple.com/?saddr=${startLat},${startLng}&daddr=${endLat},${endLng}&dirflg=d`;
    } else {
      // Android - Google Maps
      url = `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLng}&destination=${endLat},${endLng}&travelmode=driving`;
    }

    Linking.openURL(url).catch((err) => {
      console.error('Error opening maps:', err);
      Alert.alert('Error', 'Could not open maps application');
    });
  };

  const handleStationPress = (station: EVStation) => {
    setSelectedStation(station);
    if (mapRef.current && Platform.OS !== 'web') {
      mapRef.current.animateToRegion({
        latitude: station.latitude,
        longitude: station.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const handleMarkerPress = (station: EVStation) => {
    setSelectedStation(station);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2DBE7E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.mapContainer}>
        <MapViewComponent
          region={region}
          location={location}
          stations={stations}
          onMarkerPress={handleMarkerPress}
          mapRef={mapRef}
        />
        <SearchBar
          onLocationSelect={handleLocationSelect}
          currentLocation={location}
        />
        <View style={styles.horizontalListContainer}>
          <HorizontalStationList
            stations={stations}
            onStationPress={handleStationPress}
            onDirectionsPress={openDirections}
        />
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    flex: 1,
    overflow: 'visible',
  },
  horizontalListContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    maxHeight: 280,
    zIndex: 10,
  },
});
