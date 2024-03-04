import type { Route } from '@react-navigation/native';

import type { StackDescriptorMap } from '../types';

export const getModalRouteKeys = (
  routes: Route<string>[],
  descriptors: StackDescriptorMap,
  modalTypes: string[] = ['modal']
) =>
  routes.reduce<string[]>((acc, route) => {
    const { presentation } = descriptors[route.key]?.options ?? {};

    if (
      (acc.length && !presentation) ||
      modalTypes.includes(presentation ?? '')
    ) {
      acc.push(route.key);
    }

    return acc;
  }, []);
