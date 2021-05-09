import * as React from 'react';
import type { ParamListBase } from '@react-navigation/routers';
import createNavigationContainerRef from './createNavigationContainerRef';
import type { NavigationContainerRefWithCurrent } from './types';

export default function useNavigationContainerRef<
  ParamList extends ParamListBase
>(): NavigationContainerRefWithCurrent<ParamList> {
  const navigation = React.useRef<NavigationContainerRefWithCurrent<ParamList> | null>(
    null
  );

  if (navigation.current == null) {
    navigation.current = createNavigationContainerRef<ParamList>();
  }

  return navigation.current;
}
