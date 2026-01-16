import { useFavorites } from '@/contexts/FavoritesContext';
import { EVStation } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface HorizontalStationListProps {
  stations: EVStation[];
  onStationPress: (station: EVStation) => void;
  onDirectionsPress: (station: EVStation) => void;
}

export default function HorizontalStationList({
  stations,
  onStationPress,
  onDirectionsPress,
}: HorizontalStationListProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const renderStationCard = (station: EVStation) => {
    const favorite = isFavorite(station.id);

    return (
      <TouchableOpacity
        key={station.id}
        style={styles.card}
        onPress={() => onStationPress(station)}
        activeOpacity={0.8}
      >
        {station.image && (
          <View style={styles.imageContainer}>
            <Image source={station.image} style={styles.cardImage} resizeMode="cover" />
            <TouchableOpacity
              style={styles.locationButton}
              onPress={(e) => {
                e.stopPropagation();
                onDirectionsPress(station);
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="navigate" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardName} numberOfLines={1}>
                {station.name}
              </Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={12} color="#666" />
                <Text style={styles.cardAddress} numberOfLines={2}>
                  {station.address}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                if (favorite) {
                  removeFavorite(station.id);
                } else {
                  addFavorite(station);
                }
              }}
              style={styles.favoriteButton}
            >
              <Ionicons
                name={favorite ? 'heart' : 'heart-outline'}
                size={20}
                color={favorite ? '#FF3B30' : '#666'}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.cardDetails}>
            <View style={styles.chargerInfo}>
              <Ionicons name="car-outline" size={14} color="#007AFF" />
              <Text style={styles.chargerText}>
                Fast Charger (CCS2 & CHAdeMO)
              </Text>
            </View>
            <View style={styles.connectorInfo}>
              <Ionicons name="flash-outline" size={14} color="#4CAF50" />
              <Text style={styles.connectorText}>
                {station.connectorCount || 0} connectors
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.availability,
              { backgroundColor: station.available ? '#4CAF50' : '#F44336' },
            ]}
          >
            <Text style={styles.availabilityText}>
              {station.available ? 'Available' : 'Occupied'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (stations.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {stations.map((station) => renderStationCard(station))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    backgroundColor: 'rgba(245, 245, 245, 0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingRight: 15,
  },
  card: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
  },
  cardImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#e0e0e0',
  },
  locationButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardContent: {
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  cardInfo: {
    flex: 1,
    marginRight: 8,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
  },
  cardAddress: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  favoriteButton: {
    padding: 4,
  },
  cardDetails: {
    marginBottom: 10,
    gap: 6,
  },
  chargerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chargerText: {
    fontSize: 12,
    color: '#666',
  },
  connectorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  connectorText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  availability: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availabilityText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
});

