import * as React from 'react';
import type { ParamListBase } from '@react-navigation/core';
import type { LinkingOptions } from './types';

const LinkingContext = React.createContext<{
  options: LinkingOptions<ParamListBase> | undefined;
}>({ options: undefined });

LinkingContext.displayName = 'LinkingContext';

export default LinkingContext;
