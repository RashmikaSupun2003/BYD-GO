import { useAuth } from '@/contexts/AuthContext';
import { useClerk } from '@clerk/clerk-expo';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function SSOCallback() {
  const params = useLocalSearchParams();
  const { setActive } = useClerk();
  const { isSignedIn } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Clerk passes the session ID in the created_session_id parameter
        const sessionId = (params.created_session_id || params.session_id) as string;
        
        if (sessionId) {
          // Set the active session
          await setActive({ session: sessionId });
          
          // Wait a moment for the session to be set and propagate
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Navigate to home page after successful authentication
          router.replace('/(tabs)');
          setLoading(false);
        } else {
          console.log('SSO Callback params:', params);
          setError('No session ID provided in callback');
          setLoading(false);
          
          // Redirect to welcome screen after a delay if there's no session ID
          setTimeout(() => {
            router.replace('/welcome');
          }, 2000);
        }
      } catch (err: any) {
        console.error('SSO callback error:', err);
        setError(err.message || 'Failed to complete sign-in');
        setLoading(false);
        
        // Redirect to welcome screen after a delay if there's an error
        setTimeout(() => {
          router.replace('/welcome');
        }, 2000);
      }
    };

    handleCallback();
  }, [params, setActive]);

  // If already signed in, redirect immediately
  useEffect(() => {
    if (isSignedIn && !loading) {
      router.replace('/(tabs)');
    }
  }, [isSignedIn, loading]);

  return (
    <View style={styles.container}>
      {loading && (
        <>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.text}>Completing sign-in...</Text>
        </>
      )}
      {error && (
        <>
          <Text style={styles.errorText}>Error: {error}</Text>
          <Text style={styles.text}>Redirecting...</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    gap: 16,
  },
  text: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    marginBottom: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

