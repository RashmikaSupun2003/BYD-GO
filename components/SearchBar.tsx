import { Location } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BACKGROUND_WHITE,
  SHADOW_SMALL,
  SHADOW_MEDIUM,
  TEXT_DARK,
  TEXT_GRAY,
  BORDER_LIGHT,
  PRIMARY_GREEN,
} from '@/constants/theme';

interface SearchBarProps {
  onLocationSelect: (location: Location, address: string) => void;
  currentLocation: Location | null;
}

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
}

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';

export default function SearchBar({ onLocationSelect }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (searchQuery.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    setShowResults(true);

    debounceTimer.current = setTimeout(() => {
      searchLocations(searchQuery);
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery]);

  const searchLocations = async (query: string) => {
    try {
      const response = await fetch(
        `${NOMINATIM_BASE_URL}?format=json&q=${encodeURIComponent(query)}&countrycodes=lk&limit=10&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'EV-Charging-Station-App',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data: SearchResult[] = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error searching locations:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLocation = (result: SearchResult) => {
    const location: Location = {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
    };
    onLocationSelect(location, result.display_name);
    setSearchQuery(result.display_name);
    setShowResults(false);
    setResults([]);
  };

  const handleClear = () => {
    setSearchQuery('');
    setResults([]);
    setShowResults(false);
  };

  const renderResultItem = ({ item }: { item: SearchResult }) => {
    const parts = item.display_name.split(',');
    const title = parts[0] || item.display_name;
    const subtitle = parts.slice(1, 3).join(', ');

    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => handleSelectLocation(item)}
        activeOpacity={0.7}
      >
        <Ionicons name="location-outline" size={22} color={PRIMARY_GREEN} style={styles.rowIcon} />
        <View style={styles.rowContent}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.rowSubtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={22} color={TEXT_GRAY} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search any location in Sri Lanka..."
          placeholderTextColor={TEXT_GRAY}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          onFocus={() => {
            if (results.length > 0) {
              setShowResults(true);
            }
          }}
        />
        {loading && (
          <ActivityIndicator size="small" color={PRIMARY_GREEN} style={styles.loader} />
        )}
        {searchQuery.length > 0 && !loading && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Ionicons name="close-circle" size={22} color={TEXT_GRAY} />
          </TouchableOpacity>
        )}
      </View>

      {showResults && results.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={results}
            renderItem={renderResultItem}
            keyExtractor={(item) => item.place_id.toString()}
            keyboardShouldPersistTaps="handled"
            style={styles.listView}
            nestedScrollEnabled={true}
          />
        </View>
      )}

      {showResults && searchQuery.length >= 2 && results.length === 0 && !loading && (
        <View style={styles.resultsContainer}>
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>No results found</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 16,
    left: 24,
    right: 24,
    zIndex: 1000,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BACKGROUND_WHITE,
    borderRadius: 20,
    paddingHorizontal: 20,
    height: 56,
    borderWidth: 1,
    borderColor: BORDER_LIGHT,
    ...SHADOW_SMALL,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: TEXT_DARK,
    padding: 0,
    fontWeight: '400',
  },
  loader: {
    marginLeft: 12,
  },
  clearButton: {
    marginLeft: 12,
    padding: 4,
  },
  resultsContainer: {
    marginTop: 8,
    backgroundColor: BACKGROUND_WHITE,
    borderRadius: 20,
    maxHeight: 300,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER_LIGHT,
    ...SHADOW_MEDIUM,
  },
  listView: {
    maxHeight: 300,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_LIGHT,
  },
  rowIcon: {
    marginRight: 12,
  },
  rowContent: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    color: TEXT_DARK,
    fontWeight: '600',
    marginBottom: 4,
  },
  rowSubtitle: {
    fontSize: 13,
    color: TEXT_GRAY,
  },
  noResults: {
    padding: 24,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    color: TEXT_GRAY,
  },
});
