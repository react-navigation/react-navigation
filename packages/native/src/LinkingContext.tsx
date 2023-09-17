import type { ParamListBase } from '@react-navigation/core';
import * as React from 'react';

import type { LinkingOptions } from './types';

export const LinkingContext = React.createContext<{
  options: LinkingOptions<ParamListBase> | undefined;
  lastUnhandledURL?: React.MutableRefObject<string | null | undefined>;
}>({ options: undefined, lastUnhandledURL: undefined });

LinkingContext.displayName = 'LinkingContext';
