import { beforeEach, expect, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { BaseNavigationContainer } from '../BaseNavigationContainer';
import { Screen } from '../Screen';
import { useNavigationBuilder } from '../useNavigationBuilder';
import { useRoute } from '../useRoute';
import { MockRouter, MockRouterKey } from './__fixtures__/MockRouter';

beforeEach(() => {
  MockRouterKey.current = 0;
});

test('gets route prop from context', () => {
  expect.assertions(2);

  const TestNavigator = (props: any): any => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return state.routes.map((route) => descriptors[route.key].render());
  };

  const Test = () => {
    expect(useRoute().params).toEqual({ x: 1 });

    expect(useRoute<{ foo: { x: number } }, 'foo'>('foo').params?.x).toBe(1);

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

test('throws if not used in a screen', () => {
  expect.assertions(1);

  const Test = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    expect(() => useRoute<{ test: { x: number } }, 'test'>('test')).toThrow(
      "Couldn't find a route object. Is your component inside a screen in a navigator?"
    );

    return null;
  };

  render(<Test />);
});

test("throws if provided route name doesn't match current route name", () => {
  expect.assertions(1);

  const TestNavigator = (props: any): any => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return state.routes.map((route) => descriptors[route.key].render());
  };

  const Test = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    expect(() => useRoute<{ test: { x: number } }, 'test'>('test')).toThrow(
      "The provided route name ('test') doesn't match the current route's name ('foo'). It must be used in the 'test' screen."
    );

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
