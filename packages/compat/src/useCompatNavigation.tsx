import * as React from 'react';
import {
  useNavigation,
  useRoute,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/core';
import createCompatNavigationProp from './createCompatNavigationProp';
import { CompatNavigationProp } from './types';

export default function useCompatNavigation<
  T extends NavigationProp<ParamListBase>
>() {
  const navigation = useNavigation();
  const route = useRoute();

  return React.useMemo(
    () =>
      createCompatNavigationProp(
        navigation,
        route as any
      ) as CompatNavigationProp<T>,
    [navigation, route]
  );
}
