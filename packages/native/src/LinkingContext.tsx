import * as React from 'react';
import type { LinkingOptions } from './types';

const LinkingContext = React.createContext<{
  options: LinkingOptions | undefined;
}>({ options: undefined });

LinkingContext.displayName = 'LinkingContext';

export default LinkingContext;
