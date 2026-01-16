import { useFavorites } from '@/contexts/FavoritesContext';
import { EVStation } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface StationListProps {
  stations: EVStation[];
  onStationPress: (station: EVStation) => void;
  onDirectionsPress?: (station: EVStation) => void;
}

export default function StationList({ stations, onStationPress, onDirectionsPress }: StationListProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const renderStation = ({ item }: { item: EVStation }) => {
    const favorite = isFavorite(item.id);

    return (
      <TouchableOpacity
        style={styles.stationCard}
        onPress={() => onStationPress(item)}
      >
        <View style={styles.stationHeader}>
          <View style={styles.stationInfo}>
            <Text style={styles.stationName}>{item.name}</Text>
            <Text style={styles.stationAddress}>{item.address}</Text>
          </View>
          <View style={styles.headerButtons}>
            {onDirectionsPress && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  onDirectionsPress(item);
                }}
                style={styles.directionsButton}
              >
                <Ionicons name="navigate" size={20} color="#4CAF50" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                if (favorite) {
                  removeFavorite(item.id);
                } else {
                  addFavorite(item);
                }
              }}
              style={styles.favoriteButton}
            >
              <Ionicons
                name={favorite ? 'heart' : 'heart-outline'}
                size={24}
                color={favorite ? '#FF3B30' : '#666'}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.stationDetails}>
          {item.rating && (
            <View style={styles.rating}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          )}
          {item.distance && (
            <Text style={styles.distance}>
              {item.distance.toFixed(1)} km away
            </Text>
          )}
          {item.price && (
            <Text style={styles.price}>{item.price}</Text>
          )}
          <View
            style={[
              styles.availability,
              { backgroundColor: item.available ? '#4CAF50' : '#F44336' },
            ]}
          >
            <Text style={styles.availabilityText}>
              {item.available ? 'Available' : 'Occupied'}
            </Text>
          </View>
        </View>

        {item.connectorTypes && item.connectorTypes.length > 0 && (
          <View style={styles.connectors}>
            {item.connectorTypes.map((type, index) => (
              <View key={index} style={styles.connectorTag}>
                <Text style={styles.connectorText}>{type}</Text>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={stations}
      renderItem={renderStation}
      keyExtractor={(item) => item.id}
      style={styles.list}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    padding: 15,
  },
  stationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  stationInfo: {
    flex: 1,
    marginRight: 10,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  directionsButton: {
    padding: 5,
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  stationAddress: {
    fontSize: 14,
    color: '#666',
  },
  favoriteButton: {
    padding: 5,
  },
  stationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  distance: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  availability: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availabilityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  connectors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  connectorTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  connectorText: {
    fontSize: 12,
    color: '#666',
  },
});













