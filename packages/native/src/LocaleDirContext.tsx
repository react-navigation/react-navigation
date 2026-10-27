import * as React from 'react';

import type { LocaleDirection } from './types';

export const LocaleDirContext = React.createContext<
  LocaleDirection | undefined
>(undefined);

LocaleDirContext.displayName = 'LocaleDirContext';
