import { DefaultTheme, type Theme } from '@react-navigation/native';
import { Platform } from 'react-native';

export const PlatformTheme: Theme = {
  ...DefaultTheme,
  colors: Platform.select<() => Theme['colors']>({
    web: () => ({
      primary: 'var(--color-primary)',
      background: 'var(--color-background)',
      card: 'var(--color-card)',
      text: 'var(--color-text)',
      border: 'var(--color-border)',
      notification: 'var(--color-notification)',
    }),
    default: () => DefaultTheme.colors,
  })(),
};
