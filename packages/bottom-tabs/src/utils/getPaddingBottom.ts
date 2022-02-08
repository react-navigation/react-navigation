import { Platform } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';

export default function getPaddingBottom(insets: EdgeInsets) {
  return Math.max(insets.bottom - Platform.select({ ios: 4, default: 0 }), 0);
}
