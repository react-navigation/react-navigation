import * as React from 'react';

import type { HeaderSearchBarCommands } from '../types';
import { HeaderSearchBarContext } from './HeaderSearchBarContext';

export function useHeaderSearchBar(): HeaderSearchBarCommands {
  const ref = React.use(HeaderSearchBarContext);

  if (ref === undefined) {
    throw new Error(
      "Couldn't find the header search bar. Are you inside a screen in a navigator with a header?"
    );
  }

  // The search bar may not be rendered yet, or may re-mount
  // So we look up the ref when a method is called instead of returning it directly
  return React.useMemo(
    () => ({
      focus: () => ref.current?.focus(),
      blur: () => ref.current?.blur(),
      setText: (text: string) => ref.current?.setText(text),
      clearText: () => ref.current?.clearText(),
      cancelSearch: () => ref.current?.cancelSearch(),
    }),
    [ref]
  );
}
