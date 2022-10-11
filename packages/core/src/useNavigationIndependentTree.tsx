import * as React from 'react';

import NavigationIndependentTreeContext from './NavigationIndependentTreeContext';

export default function useNavigationIndependentTree() {
  return React.useContext(NavigationIndependentTreeContext);
}
