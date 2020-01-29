import MockRouter from '../../../core/src/__tests__/__fixtures__/MockRouter';
import Screen from '../../../core/src/Screen';
import * as React from 'react';
import {
  NavigationContainer,
  NavigationContainerRef,
  useNavigationBuilder,
} from '@react-navigation/core';
import { render } from 'react-native-testing-library';
import useLinking from '../useLinking';

it('throws if multiple instances of useLinking are used', () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[state.routes[state.index].key].render();
  };

  const ref = React.createRef<NavigationContainerRef>();

  const element = (
    <NavigationContainer ref={ref}>
      <TestNavigator initialRouteName="foo">
        <Screen name="foo" component={() => null} />
      </TestNavigator>
    </NavigationContainer>
  );

  render(element);

  const options = { prefixes: [] };

  function Sample() {
    useLinking(ref, options);
    useLinking(ref, options);
    return null;
  }

  const wrapper = <Sample />;

  let component;

  expect(() => (component = render(wrapper))).toThrowError(
    "Looks like you are using 'useLinking' in multiple components. This is likely an error since deep links need to be handled only once."
  );

  if (component) {
    // @ts-ignore
    component.unmount();
  }

  function Sample2() {
    useLinking(ref, options);
    return null;
  }

  const wrapper2 = <Sample2 />;

  render(wrapper2).unmount();

  expect(() => render(wrapper2)).not.toThrow();
});
