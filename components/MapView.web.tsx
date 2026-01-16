import { Location } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MapViewProps {
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  location: Location | null;
  stations: any[];
  onMarkerPress: (station: any) => void;
  mapRef: React.RefObject<any>;
  onRegionChange?: (region: any) => void;
}

// Web-only implementation - no react-native-maps
export default function MapViewComponent({
  location,
}: MapViewProps) {
  return (
    <View style={styles.webMapFallback}>
      <Ionicons name="map-outline" size={64} color="#ccc" />
      <Text style={styles.webMapText}>Map view is not available on web</Text>
      <Text style={styles.webMapSubtext}>
        Please use the Android or iOS app for full map functionality
      </Text>
      {location && (
        <View style={styles.locationInfo}>
          <Text style={styles.locationText}>
            Your Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  webMapFallback: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webMapText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  webMapSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  locationInfo: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});












