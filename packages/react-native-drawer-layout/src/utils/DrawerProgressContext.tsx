import * as React from 'react';
import type { SharedValue } from 'react-native-reanimated';

export const DrawerProgressContext = React.createContext<
  Readonly<SharedValue<number>> | undefined
>(undefined);
