import { supabase } from '@/config/supabase';
import { EVStation } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favorites: EVStation[];
  addFavorite: (station: EVStation) => Promise<void>;
  removeFavorite: (stationId: string) => Promise<void>;
  isFavorite: (stationId: string) => boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<EVStation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Helper function to get user email from Clerk user object
  const getUserEmail = (): string | null => {
    if (!user) return null;
    
    // Clerk user object has emailAddresses array
    if (user.emailAddresses && user.emailAddresses.length > 0) {
      return user.emailAddresses[0].emailAddress;
    }
    
    // Fallback to primaryEmailAddress
    if (user.primaryEmailAddress) {
      return user.primaryEmailAddress.emailAddress;
    }
    
    // Fallback to email property
    if (user.email) {
      return user.email;
    }
    
    return null;
  };

  useEffect(() => {
    // Only load favorites if user is available and has an email
    try {
      const userEmail = getUserEmail();
      if (user && userEmail) {
        loadFavorites();
      } else {
        // If no user, clear favorites
        setFavorites([]);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error in FavoritesContext useEffect:', error);
      setFavorites([]);
      setLoading(false);
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const userEmail = getUserEmail();
    if (!userEmail) {
      console.warn('User email is not available');
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      // Fetch favorites from Supabase
      const { data, error } = await supabase
        .from('favorites')
        .select('station_data')
        .eq('user_email', userEmail);

      if (error) {
        console.error('Error loading favorites from Supabase:', error);
        // Fallback to AsyncStorage
        try {
          const stored = await AsyncStorage.getItem(`favorites_${userEmail}`);
          if (stored) {
            setFavorites(JSON.parse(stored));
          } else {
            setFavorites([]);
          }
        } catch (e) {
          console.error('Error loading from AsyncStorage:', e);
          setFavorites([]);
        }
        setLoading(false);
        return;
      }

      // Extract station data from favorites
      if (data && data.length > 0) {
        const stations = data
          .map((fav: any) => fav.station_data)
          .filter((station: any) => station !== null);
        setFavorites(stations);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      // Fallback to AsyncStorage
      try {
        const stored = await AsyncStorage.getItem(`favorites_${userEmail}`);
        if (stored) {
          setFavorites(JSON.parse(stored));
        } else {
          setFavorites([]);
        }
      } catch (e) {
        console.error('Error loading from AsyncStorage:', e);
        setFavorites([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (station: EVStation) => {
    if (!user) return;

    const userEmail = getUserEmail();
    if (!userEmail) {
      console.error('User email is not available');
      return;
    }

    // Check if already favorite
    if (isFavorite(station.id)) {
      return;
    }

    const updated = [...favorites, station];
    setFavorites(updated);

    try {
      // Insert favorite into Supabase
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_email: userEmail,
          station_id: station.id,
          station_data: station,
        });

      if (error) {
        console.error('Error saving favorite to Supabase:', error);
        // Fallback to AsyncStorage
        try {
          await AsyncStorage.setItem(`favorites_${userEmail}`, JSON.stringify(updated));
        } catch (e) {
          console.error('Error saving to AsyncStorage:', e);
        }
      }
    } catch (error) {
      console.error('Error saving favorite:', error);
      // Fallback to AsyncStorage
      try {
        await AsyncStorage.setItem(`favorites_${userEmail}`, JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving to AsyncStorage:', e);
      }
    }
  };

  const removeFavorite = async (stationId: string) => {
    if (!user) return;

    const userEmail = getUserEmail();
    if (!userEmail) {
      console.error('User email is not available');
      return;
    }

    const updated = favorites.filter((s) => s.id !== stationId);
    setFavorites(updated);

    try {
      // Delete favorite from Supabase
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_email', userEmail)
        .eq('station_id', stationId);

      if (error) {
        console.error('Error removing favorite from Supabase:', error);
        // Fallback to AsyncStorage
        try {
          await AsyncStorage.setItem(`favorites_${userEmail}`, JSON.stringify(updated));
        } catch (e) {
          console.error('Error saving to AsyncStorage:', e);
        }
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      // Fallback to AsyncStorage
      try {
        await AsyncStorage.setItem(`favorites_${userEmail}`, JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving to AsyncStorage:', e);
      }
    }
  };

  const isFavorite = (stationId: string) => {
    return favorites.some((s) => s.id === stationId);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite, loading }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
