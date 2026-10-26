import type * as React from 'react';

import { getNamedContext } from '../getNamedContext';
import type { HeaderSearchBarRef } from '../types';

export const HeaderSearchBarContext = getNamedContext<
  React.RefObject<HeaderSearchBarRef | null> | undefined
>('HeaderSearchBarContext', undefined);
