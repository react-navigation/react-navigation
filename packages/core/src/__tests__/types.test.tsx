/* eslint-disable jest/expect-expect */
// noinspection BadExpressionStatementJS

import type { FC } from 'react';
import React from 'react';

import type {
  NavigationHelpersCommon,
  RouteConfigComponent,
  RouteProp,
} from '../types';

describe('RouteConfigComponent', () => {
  type ParamList = {
    hasParam: { param: string };
    hasParam2: { param2: string };
    noParam: undefined;
  };

  const Screen = <Name extends keyof ParamList>(
    _: { name: Name } & RouteConfigComponent<ParamList, Name>
  ) => null;

  it("doesn't accept incorrect route params", () => {
    const Component: FC<{ route: RouteProp<ParamList, 'hasParam'> }> = () =>
      null;
    // @ts-expect-error
    <Screen name="hasParam2" component={Component} />;
    // @ts-expect-error
    <Screen name="noParam" component={Component} />;
    // ok
    <Screen name="hasParam" component={Component} />;
  });

  it("doesn't require the component to accept the `route` or `navigation` prop", () => {
    const Component: FC<{}> = () => null;
    // ok
    <Screen name="hasParam" component={Component} />;
    // ok
    <Screen name="noParam" component={Component} />;
  });

  it('allows the component to declare any optional props', () => {
    const Component: FC<{ someProp?: string }> = () => null;
    <Screen name="hasParam" component={Component} />;
    <Screen name="noParam" component={Component} />;
  });

  it("doesn't allow a required prop that's neither `route` nor `navigation`", () => {
    const Component: FC<{ someProp: string }> = () => null;
    // @ts-expect-error
    <Screen name="hasParam" component={Component} />;
    // @ts-expect-error
    <Screen name="noParam" component={Component} />;
  });

  it('allows the component to accept just the `navigation` prop', () => {
    const Component: FC<{ navigation: object }> = () => null;
    // ok
    <Screen name="hasParam" component={Component} />;
    // ok
    <Screen name="noParam" component={Component} />;
  });
});

describe('NavigationHelpersCommon.navigate', () => {
  type ParamList = {
    hasParam: { param: string };
    hasParam2: { param2: string };
    noParam: undefined;
  };
  const navigate: NavigationHelpersCommon<ParamList>['navigate'] = () => {};
  it('strictly checks type of route params', () => {
    // ok
    navigate('noParam');
    // ok
    navigate('hasParam', { param: '123' });
    // @ts-expect-error
    navigate('hasParam2', { param: '123' });
  });

  it('strictly checks type of route params when a union RouteName is passed', () => {
    let routeName = undefined as unknown as keyof ParamList;

    // @ts-expect-error
    navigate(routeName);

    // ok
    if (routeName === 'noParam') navigate(routeName);
    // ok
    if (routeName === 'hasParam') navigate(routeName, { param: '123' });

    // @ts-expect-error
    if (routeName === 'hasParam') navigate(routeName);
    // @ts-expect-error
    if (routeName === 'hasParam2') navigate(routeName, { param: '123' });
  });
});
