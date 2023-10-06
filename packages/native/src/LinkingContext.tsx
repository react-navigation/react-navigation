import type { ParamListBase } from '@react-navigation/core';
import * as React from 'react';

import type { LinkingOptions } from './types';

const MISSING_CONTEXT_ERROR = "Couldn't find a LinkingContext context.";

export const LinkingContext = React.createContext<{
  options?: LinkingOptions<ParamListBase>;
  lastUnhandledLinking: React.MutableRefObject<string | null | undefined>;
}>({
  get options(): any {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
  get lastUnhandledLinking(): any {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
});

LinkingContext.displayName = 'LinkingContext';
