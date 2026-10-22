import * as React from 'react';

import type { PanGesture } from '../types';

export const DrawerGestureContext: React.Context<PanGesture | undefined> =
  React.createContext<PanGesture | undefined>(undefined);
