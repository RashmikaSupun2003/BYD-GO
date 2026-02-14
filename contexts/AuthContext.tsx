import { useAuth as useClerkAuth, useSSO, useUser } from '@clerk/clerk-expo';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Complete the web browser auth session for OAuth
WebBrowser.maybeCompleteAuthSession();

// Get Clerk publishable key from environment or constants
const CLERK_PUBLISHABLE_KEY = 
  Constants.expoConfig?.extra?.clerkPublishableKey ||
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  'pk_test_Zml0LW1vbmFyY2gtNzEuY2xlcmsuYWNjb3VudHMuZGV2JA';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  logout: () => Promise<void>;
  isSignedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded: userLoaded } = useUser();
  const { isSignedIn, signOut: clerkSignOut } = useClerkAuth();
  const { startSSOFlow } = useSSO();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLoaded) {
      setLoading(false);
    }
  }, [userLoaded]);

  const login = async (email: string, password: string) => {
    // For email/password login, redirect to Clerk's sign-in page
    throw new Error('Email/password login should be handled through Clerk sign-in page');
  };

  const register = async (email: string, password: string) => {
    // For email/password registration, redirect to Clerk's sign-up page
    throw new Error('Email/password registration should be handled through Clerk sign-up page');
  };

  const loginWithGoogle = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      throw new Error(error.message || 'Failed to sign in with Google');
    }
  };

  const loginWithFacebook = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_facebook',
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (error: any) {
      console.error('Facebook sign-in error:', error);
      throw new Error(error.message || 'Failed to sign in with Facebook');
    }
  };

  const loginWithApple = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_apple',
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (error: any) {
      console.error('Apple sign-in error:', error);
      throw new Error(error.message || 'Failed to sign in with Apple');
    }
  };

  const logout = async () => {
    try {
      await clerkSignOut();
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        loading,
        login,
        register,
        loginWithGoogle,
        loginWithFacebook,
        loginWithApple,
        logout,
        isSignedIn: isSignedIn || false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { CLERK_PUBLISHABLE_KEY };
