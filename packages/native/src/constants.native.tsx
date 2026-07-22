import { I18nManager } from 'react-native';

import type { LocaleDirection } from './types';

export const DEFAULT_DIRECTION: LocaleDirection = I18nManager.getConstants()
  .isRTL
  ? 'rtl'
  : 'ltr';

export const IS_NATIVE = true;
