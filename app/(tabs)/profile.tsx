import Header from '@/components/Header';
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

export default function ProfileScreen() {
  const { theme } = useTheme();
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
    <View style={styles.container}>
      <Header title="Profile" showThemeToggle={true} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header Section */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={56} color={PRIMARY_GREEN} />
          </View>
          <Text style={styles.profileName}>{getUserEmail().split('@')[0]}</Text>
          <Text style={styles.profileEmail}>{getUserEmail()}</Text>
        </View>

        {/* User Information Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={22} color={PRIMARY_GREEN} />
            <Text style={styles.sectionTitle}>Information</Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={20} color={PRIMARY_GREEN} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>
                  {getUserEmail()}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="heart-outline" size={20} color={PRIMARY_GREEN} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Saved Stations</Text>
                <Text style={styles.infoValue}>
                  {favorites.length} {favorites.length === 1 ? 'station' : 'stations'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="settings-outline" size={22} color={PRIMARY_GREEN} />
            <Text style={styles.sectionTitle}>Settings</Text>
          </View>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowAboutModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="information-circle-outline" size={20} color={TEXT_DARK} />
              <Text style={styles.menuItemText}>About App</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={TEXT_GRAY} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.menuItemLast]}
            onPress={() => setShowPrivacyModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="shield-checkmark-outline" size={20} color={TEXT_DARK} />
              <Text style={styles.menuItemText}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={TEXT_GRAY} />
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
                <Ionicons name="close" size={24} color={TEXT_GRAY} />
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
                <Ionicons name="close" size={24} color={TEXT_GRAY} />
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
    backgroundColor: BACKGROUND_SOFT,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: PRIMARY_GREEN,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: BACKGROUND_WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    ...SHADOW_MEDIUM,
  },
  profileName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textTransform: 'capitalize',
    letterSpacing: -0.5,
  },
  profileEmail: {
    fontSize: 17,
    color: '#FFFFFF',
    opacity: 0.95,
    letterSpacing: -0.3,
  },
  section: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    backgroundColor: BACKGROUND_WHITE,
    borderWidth: 1,
    borderColor: BORDER_LIGHT,
    ...SHADOW_SMALL,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_DARK,
    letterSpacing: -0.5,
  },
  infoRow: {
    marginBottom: 18,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: TEXT_GRAY,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 17,
    fontWeight: '500',
    color: TEXT_DARK,
    letterSpacing: -0.3,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_LIGHT,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuItemText: {
    fontSize: 17,
    color: TEXT_DARK,
    fontWeight: '500',
    letterSpacing: -0.3,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 18,
    borderRadius: 16,
    gap: 10,
    ...SHADOW_MEDIUM,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  bottomSpacer: {
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: BACKGROUND_WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 20,
    ...SHADOW_MEDIUM,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_LIGHT,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: TEXT_DARK,
    letterSpacing: -0.5,
  },
  modalBody: {
    padding: 24,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 26,
    color: TEXT_GRAY,
    letterSpacing: -0.2,
  },
  modalBold: {
    fontWeight: '700',
    color: TEXT_DARK,
  },
});
