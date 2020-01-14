import * as React from 'react';
import { render } from 'react-native-testing-library';
import useEventEmitter from '../useEventEmitter';
import useNavigationCache from '../useNavigationCache';
import MockRouter, { MockRouterKey } from './__fixtures__/MockRouter';

beforeEach(() => (MockRouterKey.current = 0));

it('preserves reference for navigation objects', () => {
  expect.assertions(2);

  const state = {
    type: 'tab',
    stale: false as const,
    index: 1,
    key: 'State',
    routeNames: ['Foo', 'Bar'],
    routes: [
      { key: 'Foo', name: 'Foo' },
      { key: 'Bar', name: 'Bar' },
    ],
  };

  const getState = () => state;
  const navigation = {} as any;
  const setOptions = (() => {}) as any;
  const router = MockRouter({});

  const Test = () => {
    const previous = React.useRef<any>();

    const emitter = useEventEmitter();
    const navigations = useNavigationCache({
      state,
      getState,
      navigation,
      setOptions,
      router,
      emitter,
    });

    if (previous.current) {
      Object.keys(navigations).forEach(key => {
        expect(navigations[key]).toBe(previous.current[key]);
      });
    }

    React.useEffect(() => {
      previous.current = navigations;
    });

    return null;
  };

  const root = render(<Test />);

  root.update(<Test />);
});
