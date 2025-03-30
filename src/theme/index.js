import { DefaultTheme } from 'react-native-paper';
import colors from './colors';

// Define custom font configuration
const fonts = {
  regular: {
    fontFamily: 'poppins-regular',
    fontWeight: 'normal',
  },
  medium: {
    fontFamily: 'poppins-medium',
    fontWeight: 'normal',
  },
  light: {
    fontFamily: 'poppins-light',
    fontWeight: 'normal',
  },
  thin: {
    fontFamily: 'poppins-light',
    fontWeight: 'normal',
  },
  semiBold: {
    fontFamily: 'poppins-semibold',
    fontWeight: 'normal',
  },
  bold: {
    fontFamily: 'poppins-bold',
    fontWeight: 'normal',
  },
};

// Custom spacing scale
const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 40,
};

// Custom border radius scale
const borderRadius = {
  s: 4,
  m: 8,
  l: 16,
  xl: 24,
  round: 9999,
};

// Shadow styles
const shadows = {
  light: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  dark: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Create the custom theme by extending DefaultTheme
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.secondary,
    background: colors.background,
    surface: colors.white,
    text: colors.textPrimary,
    error: colors.error,
    disabled: colors.grey,
    placeholder: colors.textTertiary,
    backdrop: colors.overlay,
    notification: colors.secondary,
    // Additional custom colors
    ...colors,
  },
  fonts,
  spacing,
  borderRadius,
  shadows,
};

export default theme;
