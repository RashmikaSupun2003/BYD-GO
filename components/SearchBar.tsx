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
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Don't search if query is too short
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    // Set loading state
    setLoading(true);
    setShowResults(true);

    // Debounce search
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
      // Search any location in Sri Lanka only (country code: LK)
      // Increased limit to show more results
      const response = await fetch(
        `${NOMINATIM_BASE_URL}?format=json&q=${encodeURIComponent(query)}&countrycodes=lk&limit=10&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'EV-Charging-Station-App', // Required by Nominatim
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
    // Extract main name and address parts
    const parts = item.display_name.split(',');
    const title = parts[0] || item.display_name;
    const subtitle = parts.slice(1, 3).join(', ');

    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => handleSelectLocation(item)}
      >
        <Ionicons name="location-outline" size={20} color="#007AFF" style={styles.rowIcon} />
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
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search any location in Sri Lanka..."
          placeholderTextColor="#999"
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
          <ActivityIndicator size="small" color="#007AFF" style={styles.loader} />
        )}
        {searchQuery.length > 0 && !loading && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#666" />
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
    top: 10,
    left: 10,
    right: 10,
    zIndex: 1000,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    padding: 0,
  },
  loader: {
    marginLeft: 10,
  },
  clearButton: {
    marginLeft: 10,
    padding: 5,
  },
  resultsContainer: {
    marginTop: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    maxHeight: 300,
    overflow: 'hidden',
  },
  listView: {
    maxHeight: 300,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  rowIcon: {
    marginRight: 12,
  },
  rowContent: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  rowSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  noResults: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    color: '#666',
  },
});
