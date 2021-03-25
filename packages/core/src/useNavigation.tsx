import * as React from 'react';
import type { ParamListBase } from '@react-navigation/routers';
import NavigationContext from './NavigationContext';
import type { NavigationProp } from './types';

/**
 * Hook to access the navigation prop of the parent screen anywhere.
 *
 * @returns Navigation prop of the parent screen.
 */
export default function useNavigation<
  T extends NavigationProp<ParamListBase>
>(): T {
  const navigation = React.useContext(NavigationContext);

  if (navigation === undefined) {
    throw new Error(
      "Couldn't find a navigation object. Is your component inside a screen in a navigator?"
    );
  }

  return navigation as T;
}
