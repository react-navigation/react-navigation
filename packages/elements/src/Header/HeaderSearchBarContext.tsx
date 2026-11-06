import type * as React from 'react';

import { getNamedContext } from '../getNamedContext';
import type { HeaderSearchBarCommands } from '../types';

export const HeaderSearchBarContext = getNamedContext<
  React.RefObject<HeaderSearchBarCommands | null> | undefined
>('HeaderSearchBarContext', undefined);
