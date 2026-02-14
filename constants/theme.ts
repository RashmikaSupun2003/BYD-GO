/**
 * BYD GO - Modern EV Charging Station App
 * Color scheme: Soft green (#2DBE7E) as primary, white background, dark gray text
 */

import { Platform } from 'react-native';

// BYD GO Brand Colors
export const PRIMARY_GREEN = '#2DBE7E';
export const PRIMARY_GREEN_DARK = '#25A06A';
export const TEXT_DARK = '#1A1A1A';
export const TEXT_GRAY = '#666666';
export const TEXT_LIGHT_GRAY = '#999999';
export const BACKGROUND_WHITE = '#FFFFFF';
export const BORDER_LIGHT = '#E0E0E0';
export const BACKGROUND_LIGHT = '#F5F5F5';

const tintColorLight = PRIMARY_GREEN;
const tintColorDark = PRIMARY_GREEN;

export const Colors = {
  light: {
    text: TEXT_DARK,
    background: BACKGROUND_WHITE,
    tint: PRIMARY_GREEN,
    icon: TEXT_GRAY,
    tabIconDefault: TEXT_LIGHT_GRAY,
    tabIconSelected: PRIMARY_GREEN,
    border: BORDER_LIGHT,
    cardBackground: BACKGROUND_WHITE,
    inputBackground: BACKGROUND_WHITE,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: PRIMARY_GREEN,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: PRIMARY_GREEN,
    border: '#333333',
    cardBackground: '#1F1F1F',
    inputBackground: '#2A2A2A',
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
