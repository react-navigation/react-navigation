import type { ParamListBase } from '@react-navigation/core';
import type { LinkingOptions } from '@react-navigation/native/src/types';
import * as React from 'react';

const MISSING_CONTEXT_ERROR = "Couldn't find a LinkingContext context.";

export const LinkingContext = React.createContext<{
  options?: LinkingOptions<ParamListBase>;
}>({
  get options(): any {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
});

LinkingContext.displayName = 'LinkingContext';
