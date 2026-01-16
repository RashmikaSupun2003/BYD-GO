import { EVStation, Location } from '@/types';
import React from 'react';
import { Image, Platform, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

interface MapViewProps {
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  location: Location | null;
  stations: EVStation[];
  onMarkerPress: (station: EVStation) => void;
  mapRef: React.RefObject<any>;
  onRegionChange?: (region: any) => void;
}

// Native-only implementation with react-native-maps
// Using standard map type (default Google Maps style with roads, landmarks, and labels)
export default function MapViewComponent({
  region,
  location,
  stations,
  onMarkerPress,
  mapRef,
}: MapViewProps) {
  return (
    <MapView
      ref={mapRef}
      provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
      style={styles.map}
      initialRegion={region}
      region={region}
      showsUserLocation={false}
      showsMyLocationButton={true}
      mapType="standard"
    >
      {location && (
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Your Location"
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <Image
            source={require('@/assets/images/car-marker.png')}
            style={styles.carMarker}
            resizeMode="contain"
          />
        </Marker>
      )}

      {stations.map((station) => (
        <Marker
          key={station.id}
          coordinate={{
            latitude: station.latitude,
            longitude: station.longitude,
          }}
          title={station.name}
          description={station.address}
          onPress={() => onMarkerPress(station)}
          anchor={{ x: 0.5, y: 1 }}
        >
          <Image
            source={require('@/assets/images/marker.png')}
            style={styles.stationMarker}
            resizeMode="contain"
          />
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  carMarker: {
    width: 40,
    height: 40,
  },
  stationMarker: {
    width: 40,
    height: 40,
  },
});
