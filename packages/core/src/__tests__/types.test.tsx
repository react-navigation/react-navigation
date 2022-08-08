/* eslint-disable jest/expect-expect */
// noinspection BadExpressionStatementJS

import type { FC } from 'react';
import React from 'react';

import type { RouteConfigComponent, RouteProp } from '../types';

describe('RouteConfigComponent', () => {
  type RouteParams = {
    hasParam: { param: string };
    hasParam2: { param2: string };
    noParam: undefined;
  };

  const Screen = <Name extends keyof RouteParams>(
    _: { name: Name } & RouteConfigComponent<RouteParams, Name>
  ) => null;

  it("doesn't accept incorrect route params", () => {
    const Component: FC<{ route: RouteProp<RouteParams, 'hasParam'> }> = () =>
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
    <Screen name="hasParam" component={Component} />;
    <Screen name="noParam" component={Component} />;
  });
});
