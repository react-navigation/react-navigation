import * as React from 'react';
import {
  useNavigation,
  useRoute,
  NavigationProp,
  ParamListBase,
  useNavigationState,
} from '@react-navigation/native';
import createCompatNavigationProp from './createCompatNavigationProp';
import { CompatNavigationProp } from './types';

export default function useCompatNavigation<
  T extends NavigationProp<ParamListBase>
>() {
  const navigation = useNavigation();
  const route = useRoute();

  const isFirstRouteInParent = useNavigationState(
    state => state.routes[0].key === route.key
  );

  return React.useMemo(
    () =>
      createCompatNavigationProp(
        navigation,
        route as any,
        isFirstRouteInParent
      ) as CompatNavigationProp<T>,
    [isFirstRouteInParent, navigation, route]
  );
}
