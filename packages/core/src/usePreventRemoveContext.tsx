import * as React from 'react';

import { PreventRemoveContext } from './PreventRemoveContext';

export function usePreventRemoveContext() {
  const value = React.useContext(PreventRemoveContext);

  if (value == null) {
    throw new Error(
      "Couldn't find the prevent remove context. This is likely a bug in the navigator.\n\nIf you're using a custom navigator, make sure that the navigator content is wrapped by the 'render' function returned by 'useNavigationBuilder'."
    );
  }

  return value;
}
