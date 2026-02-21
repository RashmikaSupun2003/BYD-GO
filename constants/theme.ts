/**
 * BYD GO - Modern EV Charging Station App
 * Clean, minimal design inspired by Tesla, Uber, and modern fintech apps
 */

import { Platform } from 'react-native';

// Primary Colors - Modern Green
export const PRIMARY_GREEN = '#00C853';
export const PRIMARY_GREEN_DARK = '#00B248';
export const PRIMARY_GREEN_LIGHT = '#E8F5E9';

// Neutral Colors - Clean Grays
export const TEXT_DARK = '#0F172A';
export const TEXT_GRAY = '#64748B';
export const TEXT_LIGHT_GRAY = '#94A3B8';
export const TEXT_WHITE = '#FFFFFF';

// Background Colors - Soft and Clean
export const BACKGROUND_WHITE = '#FFFFFF';
export const BACKGROUND_SOFT = '#F8FAFC';
export const BACKGROUND_LIGHT = '#F1F5F9';
export const BACKGROUND_DARK = '#0F172A';

// Border Colors - Subtle and Clean
export const BORDER_LIGHT = '#E2E8F0';
export const BORDER_MEDIUM = '#CBD5E1';
export const BORDER_DARK = '#94A3B8';

// Soft Shadows - Minimal and Clean
export const SHADOW_SMALL = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.04,
  shadowRadius: 2,
  elevation: 1,
};

export const SHADOW_MEDIUM = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 4,
  elevation: 2,
};

export const SHADOW_BUTTON = {
  shadowColor: PRIMARY_GREEN,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 4,
  elevation: 3,
};

const tintColorLight = PRIMARY_GREEN;
const tintColorDark = PRIMARY_GREEN;

export const Colors = {
  light: {
    text: TEXT_DARK,
    background: BACKGROUND_SOFT,
    tint: PRIMARY_GREEN,
    icon: TEXT_GRAY,
    tabIconDefault: TEXT_LIGHT_GRAY,
    tabIconSelected: PRIMARY_GREEN,
    border: BORDER_LIGHT,
    cardBackground: BACKGROUND_WHITE,
    inputBackground: BACKGROUND_WHITE,
  },
  dark: {
    text: '#F1F5F9',
    background: BACKGROUND_DARK,
    tint: PRIMARY_GREEN,
    icon: TEXT_LIGHT_GRAY,
    tabIconDefault: TEXT_LIGHT_GRAY,
    tabIconSelected: PRIMARY_GREEN,
    border: BORDER_MEDIUM,
    cardBackground: '#1E293B',
    inputBackground: '#1E293B',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
