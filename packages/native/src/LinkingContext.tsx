import type { ParamListBase } from '@react-navigation/core';
import * as React from 'react';

import type { LinkingOptions } from './types';

const LinkingContext = React.createContext<{
  options: LinkingOptions<ParamListBase> | undefined;
  getLastLinkingUrl?: () => string;
}>({ options: undefined, getLastLinkingUrl: undefined });

LinkingContext.displayName = 'LinkingContext';

export default LinkingContext;
