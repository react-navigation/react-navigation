import * as React from 'react';
import { render } from 'react-native-testing-library';
import useNavigationBuilder from '../useNavigationBuilder';
import useRoute from '../useRoute';
import BaseNavigationContainer from '../BaseNavigationContainer';
import Screen from '../Screen';
import MockRouter from './__fixtures__/MockRouter';
import { RouteProp } from '../types';

it('gets route prop from context', () => {
  expect.assertions(1);

  const TestNavigator = (props: any): any => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return state.routes.map(route => descriptors[route.key].render());
  };

  const Test = () => {
    const route = useRoute<RouteProp<{ sample: { x: string } }, 'sample'>>();

    expect(route?.params?.x).toEqual(1);

    return null;
  };

  render(
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="foo" component={Test} initialParams={{ x: 1 }} />
      </TestNavigator>
    </BaseNavigationContainer>
  );
});
