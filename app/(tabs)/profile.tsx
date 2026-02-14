import Header from '@/components/Header';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Get user email
  const getUserEmail = (): string => {
    if (!user) return 'Not available';
    
    if (user.emailAddresses && user.emailAddresses.length > 0) {
      return user.emailAddresses[0].emailAddress;
    }
    
    if (user.primaryEmailAddress) {
      return user.primaryEmailAddress.emailAddress;
    }
    
    if (user.email) {
      return user.email;
    }
    
    return 'Not available';
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/welcome');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Profile" showThemeToggle={true} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header Section */}
        <View style={[styles.profileHeader, { backgroundColor: theme === 'dark' ? '#1a1a1a' : '#007AFF' }]}>
          <View style={[styles.avatarContainer, { backgroundColor: theme === 'dark' ? '#333' : '#fff' }]}>
            <Ionicons name="person" size={60} color="#007AFF" />
          </View>
          <Text style={styles.profileName}>{getUserEmail().split('@')[0]}</Text>
          <Text style={styles.profileEmail}>{getUserEmail()}</Text>
        </View>

        {/* User Information Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={20} color={colors.tint} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Information</Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={18} color={colors.icon} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.icon }]}>Email</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {getUserEmail()}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="heart-outline" size={18} color={colors.icon} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.icon }]}>Saved Stations</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {favorites.length} {favorites.length === 1 ? 'station' : 'stations'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="settings-outline" size={20} color={colors.tint} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
          </View>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowAboutModal(true)}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="information-circle-outline" size={20} color={colors.text} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>About App</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.icon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={() => setShowPrivacyModal(true)}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.text} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.icon} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* About App Modal */}
      <Modal
        visible={showAboutModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAboutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>About App</Text>
              <TouchableOpacity onPress={() => setShowAboutModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalText}>
                <Text style={styles.modalBold}>EV Charging Station Finder</Text>
                {'\n\n'}
                A comprehensive mobile application designed to help electric vehicle owners find
                charging stations across Sri Lanka. Built with React Native and Expo.
                {'\n\n'}
                <Text style={styles.modalBold}>Features:</Text>
                {'\n'}
                • Find nearby charging stations
                {'\n'}
                • Search locations in Sri Lanka
                {'\n'}
                • Save favorite stations
                {'\n'}
                • Get directions to stations
                {'\n'}
                • View station details and availability
                {'\n\n'}
                <Text style={styles.modalBold}>Version:</Text> 1.0.0
                {'\n\n'}
                <Text style={styles.modalBold}>Developed by:</Text> BYD GO Team
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal
        visible={showPrivacyModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPrivacyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Privacy Policy</Text>
              <TouchableOpacity onPress={() => setShowPrivacyModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalText}>
                <Text style={styles.modalBold}>Last Updated:</Text> {new Date().toLocaleDateString()}
                {'\n\n'}
                <Text style={styles.modalBold}>1. Information We Collect</Text>
                {'\n\n'}
                We collect the following information:
                {'\n'}
                • Email address (for account authentication)
                {'\n'}
                • Location data (to find nearby charging stations)
                {'\n'}
                • Favorite stations (stored locally and in cloud)
                {'\n\n'}
                <Text style={styles.modalBold}>2. How We Use Your Information</Text>
                {'\n\n'}
                • To provide location-based services
                {'\n'}
                • To sync your favorites across devices
                {'\n'}
                • To improve app functionality
                {'\n\n'}
                <Text style={styles.modalBold}>3. Data Storage</Text>
                {'\n\n'}
                Your data is stored securely using Supabase and Clerk authentication services.
                Location data is only used when the app is active and is not stored permanently.
                {'\n\n'}
                <Text style={styles.modalBold}>4. Your Rights</Text>
                {'\n\n'}
                You have the right to:
                {'\n'}
                • Access your personal data
                {'\n'}
                • Delete your account and data
                {'\n'}
                • Opt-out of location services
                {'\n\n'}
                <Text style={styles.modalBold}>5. Contact Us</Text>
                {'\n\n'}
                For privacy concerns, please contact us through the app support.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: '#007AFF',
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textTransform: 'capitalize',
  },
  profileEmail: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  section: {
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoRow: {
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    marginHorizontal: 15,
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 12,
    gap: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  modalBody: {
    padding: 20,
  },
  modalText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#333',
  },
  modalBold: {
    fontWeight: '600',
    color: '#1a1a1a',
  },
});
