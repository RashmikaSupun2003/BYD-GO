import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

interface HeaderProps {
  title?: string;
  showThemeToggle?: boolean;
}

export default function Header({ title = 'EV Charging Stations', showThemeToggle = false }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const colors = Colors[theme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderBottomColor: theme === 'dark' ? '#333' : '#e0e0e0' }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {showThemeToggle && (
          <View style={styles.themeToggleContainer}>
            <Ionicons 
              name={theme === 'dark' ? 'moon' : 'sunny'} 
              size={20} 
              color={colors.text} 
              style={styles.themeIcon}
            />
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: '#007AFF' }}
              thumbColor={theme === 'dark' ? '#fff' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  themeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeIcon: {
    marginRight: 4,
  },
});






