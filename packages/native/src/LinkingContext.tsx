import * as React from 'react';
import { LinkingOptions } from './types';

const LinkingContext = React.createContext<{
  options: LinkingOptions | undefined;
}>({ options: undefined });

export default LinkingContext;
