import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { AuthProvider, CLERK_PUBLISHABLE_KEY, useAuth } from '@/contexts/AuthContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ClerkProvider } from '@clerk/clerk-expo';
import { router, useSegments } from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, loading, isSignedIn } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(tabs)';
    const isWelcome = segments[0] === 'welcome';
    const isLogin = segments[0] === 'login';
    const isSSOCallback = segments[0] === 'sso-callback';
    const currentRoute = segments[0];

    if (!isSignedIn || !user) {
      // If not authenticated
      if (inAuthGroup) {
        // User is trying to access protected routes
        router.replace('/welcome');
      } else if (!isWelcome && !isLogin && !isSSOCallback && !currentRoute?.includes('sign-in') && !currentRoute?.includes('sign-up')) {
        // Not on welcome, login, or SSO callback, redirect to welcome (initial launch)
        router.replace('/welcome');
      }
      // If already on welcome, login, or SSO callback, stay there
    } else if (isSignedIn && user) {
      // If authenticated, redirect to home page (app/(tabs)/index.tsx)
      // (tabs) route automatically shows index route which is the home page
      if (!inAuthGroup && currentRoute !== 'login' && !currentRoute?.includes('sign-in') && !currentRoute?.includes('sign-up')) {
        // User is authenticated but not on tabs, redirect to home page
        router.replace('/(tabs)');
      }
    }
  }, [user, loading, segments, isSignedIn]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcome" />
        <Stack.Screen name="login" />
        <Stack.Screen name="sso-callback" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  // Load custom fonts if available
  // Add your font files to assets/fonts/ and uncomment below
  const [loaded, error] = useFonts({
    // SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    // Hide splash screen after fonts load or immediately if no fonts
    if (loaded || error) {
      SplashScreen.hideAsync();
    } else {
      // If no fonts to load, hide splash immediately
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <AuthProvider>
        <FavoritesProvider>
          <RootLayoutNav />
        </FavoritesProvider>
      </AuthProvider>
    </ClerkProvider>
  );
}
