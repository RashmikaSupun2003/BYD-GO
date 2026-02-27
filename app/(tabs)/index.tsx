import Header from '@/components/Header';
import HorizontalStationList from '@/components/HorizontalStationList';
import MapViewComponent from '@/components/MapView';
import SearchBar from '@/components/SearchBar';
import { getEVStations, searchEVStationsByAddress } from '@/services/evStations';
import { EVStation, Location as LocationType } from '@/types';
import * as Location from 'expo-location';
import { Linking, Modal, TouchableOpacity } from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  BACKGROUND_WHITE,
  BACKGROUND_SOFT,
  SHADOW_SMALL,
  SHADOW_MEDIUM,
  TEXT_DARK,
  TEXT_GRAY,
  BORDER_LIGHT,
  PRIMARY_GREEN,
} from '@/constants/theme';

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

export default function HomeScreen() {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [searchedLocation, setSearchedLocation] = useState<LocationType | null>(null);
  const [originalGPSLocation, setOriginalGPSLocation] = useState<LocationType | null>(null);
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
      setOriginalGPSLocation(newLocation); // Store original GPS location
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
    // Animate map to the selected station
    if (mapRef.current && Platform.OS !== 'web') {
      mapRef.current.animateToRegion({
        latitude: station.latitude,
        longitude: station.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  // Calculate real-time distance from current location to selected station
  const getDistanceToStation = (station: EVStation | null): number | null => {
    if (!station || !location) return null;
    return calculateDistance(
      location.latitude,
      location.longitude,
      station.latitude,
      station.longitude
    );
  };

  // Sort stations by real-time distance from current location (memoized for performance)
  const sortedStations = useMemo(() => {
    if (!location || stations.length === 0) return stations;
    
    return [...stations].sort((a, b) => {
      const distA = calculateDistance(
        location.latitude,
        location.longitude,
        a.latitude,
        a.longitude
      );
      const distB = calculateDistance(
        location.latitude,
        location.longitude,
        b.latitude,
        b.longitude
      );
      return distA - distB;
    });
  }, [stations, location]);

  const handleClosePopup = () => {
    setSelectedStation(null);
  };

  const handleNavigateFromPopup = () => {
    if (selectedStation) {
      openDirections(selectedStation);
      handleClosePopup();
    }
  };

  const handleResetToCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to reset to your current location.'
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const newLocation: LocationType = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      // Reset to current GPS location
      setLocation(newLocation);
      setOriginalGPSLocation(newLocation);
      setSearchedLocation(null); // Clear searched location
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

      // Reload stations for the current location
      loadStations(newLocation);
    } catch (error) {
      console.error('Error resetting location:', error);
      Alert.alert('Error', 'Failed to get your current location');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_GREEN} />
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
        
        {/* Reset to Current Location Button */}
        {searchedLocation && (
          <TouchableOpacity
            style={styles.resetLocationButton}
            onPress={handleResetToCurrentLocation}
            activeOpacity={0.8}
          >
            <Ionicons name="locate" size={20} color="#FFFFFF" />
            <Text style={styles.resetLocationButtonText}>Current Location</Text>
          </TouchableOpacity>
        )}
        <View style={styles.horizontalListContainer}>
          <HorizontalStationList
            stations={sortedStations}
            onStationPress={handleStationPress}
            onDirectionsPress={openDirections}
        />
      </View>
      </View>

      {/* Station Popup Modal */}
      <Modal
        visible={selectedStation !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={handleClosePopup}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleClosePopup}
        >
          <TouchableOpacity
            style={styles.popupContainer}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {selectedStation && (
              <>
                {/* Popup Header */}
                <View style={styles.popupHeader}>
                  <View style={styles.popupHeaderContent}>
                    <Text style={styles.popupTitle} numberOfLines={2}>
                      {selectedStation.name}
                    </Text>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={handleClosePopup}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="close" size={24} color={TEXT_DARK} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Popup Content */}
                <View style={styles.popupContent}>
                  {/* Address */}
                  <View style={styles.popupInfoRow}>
                    <Ionicons name="location-outline" size={20} color={PRIMARY_GREEN} />
                    <Text style={styles.popupAddress} numberOfLines={2}>
                      {selectedStation.address}
                    </Text>
                  </View>

                  {/* Distance - Real-time calculation from current location */}
                  {(() => {
                    const realDistance = getDistanceToStation(selectedStation);
                    if (realDistance !== null) {
                      return (
                        <View style={styles.popupInfoRow}>
                          <Ionicons name="navigate-outline" size={20} color={PRIMARY_GREEN} />
                          <Text style={styles.popupDistance}>
                            {realDistance < 1
                              ? `${Math.round(realDistance * 1000)}m away`
                              : `${realDistance.toFixed(1)}km away`}
                          </Text>
                        </View>
                      );
                    }
                    return null;
                  })()}

                  {/* Connector Info */}
                  <View style={styles.popupInfoRow}>
                    <Ionicons name="flash-outline" size={20} color={PRIMARY_GREEN} />
                    <Text style={styles.popupInfoText}>
                      {selectedStation.connectorCount || 0} connectors available
                    </Text>
                  </View>

                  {/* Availability */}
                  <View style={styles.popupInfoRow}>
                    <Ionicons
                      name={selectedStation.available ? 'checkmark-circle' : 'close-circle'}
                      size={20}
                      color={selectedStation.available ? PRIMARY_GREEN : '#FF3B30'}
                    />
                    <Text
                      style={[
                        styles.popupInfoText,
                        { color: selectedStation.available ? PRIMARY_GREEN : '#FF3B30' },
                      ]}
                    >
                      {selectedStation.available ? 'Available' : 'Occupied'}
                    </Text>
                  </View>
                </View>

                {/* Popup Actions */}
                <View style={styles.popupActions}>
                  <TouchableOpacity
                    style={styles.navigateButton}
                    onPress={handleNavigateFromPopup}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="navigate" size={20} color="#FFFFFF" />
                    <Text style={styles.navigateButtonText}>Navigate</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_WHITE,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  popupContainer: {
    backgroundColor: BACKGROUND_WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
    maxHeight: '60%',
    ...SHADOW_MEDIUM,
  },
  popupHeader: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_LIGHT,
  },
  popupHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  popupTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: TEXT_DARK,
    flex: 1,
    marginRight: 12,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 16,
  },
  popupInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  popupAddress: {
    flex: 1,
    fontSize: 15,
    color: TEXT_GRAY,
    lineHeight: 22,
  },
  popupDistance: {
    fontSize: 16,
    color: PRIMARY_GREEN,
    fontWeight: '600',
  },
  popupInfoText: {
    fontSize: 15,
    color: TEXT_DARK,
    fontWeight: '500',
  },
  popupActions: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  navigateButton: {
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 20,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...SHADOW_SMALL,
  },
  navigateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  resetLocationButton: {
    position: 'absolute',
    top: 80,
    right: 24,
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 20,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 8,
    zIndex: 999,
    ...SHADOW_SMALL,
  },
  resetLocationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
