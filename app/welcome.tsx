import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { loginWithGoogle, user, isSignedIn } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If user is authenticated, navigate to home page (app/(tabs)/index.tsx)
    // (tabs) route automatically shows index route which is the home page
    if (isSignedIn && user) {
      router.replace('/(tabs)');
    }
  }, [user, isSignedIn]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      // Navigation will happen automatically via useEffect when user state changes
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Photo/Illustration */}
        <View style={styles.imageContainer}>
          <View style={[styles.illustration, { backgroundColor: colors.tint + '20' }]}>
            <Ionicons name="flash" size={80} color={colors.tint} />
          </View>
        </View>

        {/* Description */}
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            BYD GO
          </Text>
          <Text style={[styles.description, { color: colors.icon }]}>
            Find and navigate to electric vehicle charging stations near you. 
            Discover available chargers, check real-time availability, and plan 
            your charging stops effortlessly.
          </Text>
        </View>

        {/* Google Login Button */}
        <TouchableOpacity
          style={[
            styles.googleButton,
            { backgroundColor: '#fff', borderColor: '#e0e0e0' },
            loading && styles.googleButtonDisabled
          ]}
          onPress={handleGoogleLogin}
          activeOpacity={0.7}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#4285F4" size="small" />
              <Text style={[styles.googleButtonText, { marginLeft: 12 }]}>Signing in...</Text>
            </View>
          ) : (
            <View style={styles.buttonContent}>
              <Ionicons name="logo-google" size={24} color="#4285F4" />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Alternative login option */}
        <TouchableOpacity
          style={styles.alternativeLogin}
          onPress={() => router.push('/login')}
          activeOpacity={0.7}
        >
          <Text style={[styles.alternativeLoginText, { color: colors.icon }]}>
            Or sign in with email
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 40,
  },
  illustration: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  googleButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  alternativeLogin: {
    marginTop: 16,
    paddingVertical: 12,
  },
  alternativeLoginText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

