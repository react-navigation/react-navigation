import type { DrawerStatus } from '@react-navigation/native';
import * as React from 'react';

const DrawerStatusContext =
  React.createContext<DrawerStatus | undefined>(undefined);

export default DrawerStatusContext;
