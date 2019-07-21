import * as React from 'react';
import NavigationContext from './NavigationContext';

export default function useNavigation() {
  const navigation = React.useContext(NavigationContext);

  if (navigation === undefined) {
    throw new Error(
      "We couldn't find a navigation object. Is your component inside a navigator?"
    );
  }

  return navigation;
}
