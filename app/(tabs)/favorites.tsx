import Header from '@/components/Header';
import StationList from '@/components/StationList';
import { useFavorites } from '@/contexts/FavoritesContext';
import { EVStation, Location as LocationType } from '@/types';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Linking, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';

export default function FavoritesScreen() {
  const { favorites, loading } = useFavorites();
  const [currentLocation, setCurrentLocation] = useState<LocationType | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
        setLocationLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setLocationLoading(false);
    }
  };

  const openDirections = (station: EVStation) => {
    // Use current location as starting point
    if (!currentLocation) {
      Alert.alert('Error', 'Location not available. Please enable location services.');
      return;
    }

    const startLat = currentLocation.latitude;
    const startLng = currentLocation.longitude;
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
    // Navigate to station details or map
    console.log('Station pressed:', station);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Favorites" />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Favorites" />
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubtext}>
            Start adding charging stations to your favorites
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Favorites" />
      <StationList 
        stations={favorites} 
        onStationPress={handleStationPress}
        onDirectionsPress={openDirections}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
  },
});













