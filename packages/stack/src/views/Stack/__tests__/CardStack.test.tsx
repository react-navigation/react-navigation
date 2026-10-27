import 'react-native-gesture-handler/jestSetup';

import { describe, expect, test } from '@jest/globals';
import type {
  ParamListBase,
  Route,
  StackNavigationState,
} from '@react-navigation/native';

import type { StackDescriptorMap } from '../../../types';
import { CardStack } from '../CardStack';

const createRoute = (key: string): Route<string> => ({
  key,
  name: key,
});

const createNavigationState = (
  routes: Route<string>[]
): StackNavigationState<ParamListBase> => ({
  stale: false,
  type: 'stack',
  key: 'stack-1',
  index: routes.length - 1,
  routeNames: routes.map((route) => route.name),
  routes,
  preloadedRoutes: [],
});

const createDescriptors = (routes: Route<string>[]): StackDescriptorMap =>
  Object.fromEntries(
    routes.map((route) => [
      route.key,
      {
        route,
        options: {},
        navigation: {},
        render: () => null,
      },
    ])
  ) as unknown as StackDescriptorMap;

const getActiveStates = ({
  routes,
  previousRoutes,
  navigationRoutes = routes,
  openingRouteKeys,
  closingRouteKeys = [],
  replacingRouteKeys = [],
}: {
  routes: Route<string>[];
  previousRoutes: Route<string>[];
  navigationRoutes?: Route<string>[];
  openingRouteKeys: string[];
  closingRouteKeys?: string[];
  replacingRouteKeys?: string[];
}) => {
  const descriptors = createDescriptors(routes);

  const result = CardStack.getDerivedStateFromProps(
    {
      routes,
      state: createNavigationState(navigationRoutes),
      descriptors,
      preloadedDescriptors: {},
      openingRouteKeys,
      closingRouteKeys,
      replacingRouteKeys,
      direction: 'ltr',
      insets: { top: 0, right: 0, bottom: 0, left: 0 },
      isParentHeaderShown: false,
      isParentModal: false,
      getPreviousRoute: () => undefined,
      renderHeader: () => null,
      onOpenRoute: () => {},
      onCloseRoute: () => {},
      onTransitionStart: () => {},
      onTransitionEnd: () => {},
      onGestureStart: () => {},
      onGestureEnd: () => {},
      onGestureCancel: () => {},
    } as any,
    {
      routes: previousRoutes,
      scenes: [],
      gestures: {},
      layout: { width: 100, height: 100 },
      descriptors,
      activeStates: previousRoutes.map((_, index) => (index === 0 ? 0 : 1)),
      headerHeights: {},
    }
  );

  return result?.activeStates;
};

describe('CardStack activity states', () => {
  test('keeps an exposed screen active when replacing an opening route', () => {
    const [routeA, routeB, routeC, routeD] = ['A', 'B', 'C', 'D'].map(
      createRoute
    );

    const activeStates = getActiveStates({
      routes: [routeA, routeB, routeC, routeD],
      previousRoutes: [routeA, routeB, routeC],
      navigationRoutes: [routeA, routeB, routeD],
      openingRouteKeys: [routeD.key],
      replacingRouteKeys: [routeC.key],
    });

    expect(activeStates?.[1]).not.toBe(0);
  });

  test('ignores stale closing keys from routes that are no longer rendered', () => {
    const [routeA, routeB, routeC, routeD, routeE] = [
      'A',
      'B',
      'C',
      'D',
      'E',
    ].map(createRoute);

    const activeStates = getActiveStates({
      routes: [routeA, routeB, routeD, routeE],
      previousRoutes: [routeA, routeB, routeD],
      openingRouteKeys: [routeE.key],
      closingRouteKeys: [routeC.key],
    });

    expect(activeStates?.[1]).toBe(0);
  });

  test('keeps deeply covered screens inactive during a normal push', () => {
    const [routeA, routeB, routeC] = ['A', 'B', 'C'].map(createRoute);

    const activeStates = getActiveStates({
      routes: [routeA, routeB, routeC],
      previousRoutes: [routeA, routeB],
      openingRouteKeys: [routeC.key],
    });

    expect(activeStates?.[0]).toBe(0);
  });

  test('keeps an exposed screen active during overlapping transitions', () => {
    const [routeA, routeB, routeC, routeD] = ['A', 'B', 'C', 'D'].map(
      createRoute
    );

    const activeStates = getActiveStates({
      routes: [routeA, routeB, routeC, routeD],
      previousRoutes: [routeA, routeB, routeC],
      openingRouteKeys: [routeD.key],
      closingRouteKeys: [routeC.key],
    });

    expect(activeStates?.[1]).not.toBe(0);
  });

  test('reactivates below the active window without making it visible', () => {
    const [routeA, routeB, routeC] = ['A', 'B', 'C'].map(createRoute);

    const activeStates = getActiveStates({
      routes: [routeA, routeB],
      previousRoutes: [routeA, routeB, routeC],
      openingRouteKeys: [],
    });

    expect((activeStates?.[0] as any).__getValue()).toBe(0);
  });
});
