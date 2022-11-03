import * as React from 'react';
import type { DrawerStatus } from '@react-navigation/native';

export default React.createContext<DrawerStatus | undefined>(
  undefined
);

