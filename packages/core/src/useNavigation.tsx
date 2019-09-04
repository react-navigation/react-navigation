import * as React from 'react';
import NavigationContext from './NavigationContext';
import { NavigationProp, ParamListBase } from './types';

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
      "We couldn't find a navigation object. Is your component inside a navigator?"
    );
  }

  return navigation as T;
}
