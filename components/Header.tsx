import {
  BACKGROUND_WHITE,
  SHADOW_SMALL,
  TEXT_DARK,
  TEXT_GRAY,
  PRIMARY_GREEN,
  BORDER_LIGHT,
} from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Switch, Text, View } from 'react-native';

interface HeaderProps {
  title?: string;
  showThemeToggle?: boolean;
}

export default function Header({ title = 'BYD GO', showThemeToggle = false }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {title === 'BYD GO' ? (
          <Image
            source={require('@/assets/images/BYDGOlogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.title}>{title}</Text>
        )}
        {showThemeToggle && (
          <View style={styles.themeToggleContainer}>
            <Ionicons
              name={theme === 'dark' ? 'moon' : 'sunny'}
              size={20}
              color={theme === 'dark' ? '#ECEDEE' : '#1A1A1A'}
              style={styles.themeIcon}
            />
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: BORDER_LIGHT, true: PRIMARY_GREEN }}
              thumbColor={theme === 'dark' ? '#fff' : '#f4f3f4'}
              ios_backgroundColor={BORDER_LIGHT}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_WHITE,
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_LIGHT,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  logo: {
    height: 40,
    width: 140,
  },
  themeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  themeIcon: {
    marginRight: 0,
  },
});
