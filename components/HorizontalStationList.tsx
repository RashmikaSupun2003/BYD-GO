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
              <Ionicons name="navigate" size={18} color="#fff" />
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
              <Ionicons name="car-outline" size={16} color={PRIMARY_GREEN} />
              <Text style={styles.chargerText}>
                Fast Charger (CCS2 & CHAdeMO)
              </Text>
            </View>
            <View style={styles.connectorInfo}>
              <Ionicons name="flash-outline" size={16} color={PRIMARY_GREEN} />
              <Text style={styles.connectorText}>
                {station.connectorCount || 0} connectors
              </Text>
            </View>
          </View>

            <View
            style={[
              styles.availability,
              { backgroundColor: station.available ? PRIMARY_GREEN : '#FF3B30' },
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
    paddingVertical: 16,
    backgroundColor: BACKGROUND_WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: BORDER_LIGHT,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  card: {
    width: 300,
    backgroundColor: BACKGROUND_WHITE,
    borderRadius: 20,
    marginRight: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER_LIGHT,
    ...SHADOW_SMALL,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
  },
  cardImage: {
    width: '100%',
    height: 120,
    backgroundColor: BACKGROUND_SOFT,
  },
  locationButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: PRIMARY_GREEN,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW_SMALL,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  cardInfo: {
    flex: 1,
    marginRight: 12,
  },
  cardName: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  cardAddress: {
    fontSize: 13,
    color: TEXT_GRAY,
    flex: 1,
    lineHeight: 18,
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
    fontSize: 13,
    color: TEXT_GRAY,
  },
  connectorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  connectorText: {
    fontSize: 13,
    color: TEXT_GRAY,
    fontWeight: '600',
  },
  availability: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availabilityText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
});

