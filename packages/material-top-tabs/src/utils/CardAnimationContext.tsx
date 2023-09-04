import * as React from 'react';

import type { MaterialTopTabCardAnimationContext } from '../types';

export const CardAnimationContext = React.createContext<
  MaterialTopTabCardAnimationContext | undefined
>(undefined);
