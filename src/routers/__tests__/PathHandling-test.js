/* eslint no-shadow:0, react/no-multi-comp:0, react/display-name:0 */

import React from 'react';

import SwitchRouter from '../SwitchRouter';
import StackRouter from '../StackRouter';
import StackActions from '../StackActions';
import NavigationActions from '../../NavigationActions';
import { urlToPathAndParams } from '../pathUtils';
import { _TESTING_ONLY_normalize_keys } from '../KeyGenerator';

beforeEach(() => {
  _TESTING_ONLY_normalize_keys();
});

const ListScreen = () => <div />;

const ProfileNavigator = () => <div />;
ProfileNavigator.router = StackRouter({
  list: {
    path: 'list/:id',
    screen: ListScreen,
  },
});

const MainNavigator = () => <div />;
MainNavigator.router = StackRouter({
  profile: {
    path: 'p/:id',
    screen: ProfileNavigator,
  },
});

const LoginScreen = () => <div />;

const AuthNavigator = () => <div />;
AuthNavigator.router = StackRouter({
  login: {
    screen: LoginScreen,
  },
});

const BarScreen = () => <div />;

class FooNavigator extends React.Component {
  static router = StackRouter({
    bar: {
      path: 'b/:barThing',
      screen: BarScreen,
    },
  });
  render() {
    return <div />;
  }
}

const PersonScreen = () => <div />;

const performRouterTest = createTestRouter => {
  const testRouter = createTestRouter({
    main: {
      screen: MainNavigator,
    },
    baz: {
      path: null,
      screen: FooNavigator,
    },
    auth: {
      screen: AuthNavigator,
    },
    person: {
      path: 'people/:id',
      screen: PersonScreen,
    },
    foo: {
      path: 'fo/:fooThing',
      screen: FooNavigator,
    },
  });

  test('Handles empty URIs', () => {
    const router = createTestRouter(
      {
        Foo: {
          screen: () => <div />,
        },
        Bar: {
          screen: () => <div />,
        },
      },
      { initialRouteName: 'Bar', initialRouteParams: { foo: 42 } }
    );
    const action = router.getActionForPathAndParams('');
    expect(action).toEqual({
      type: NavigationActions.NAVIGATE,
      routeName: 'Bar',
      params: { foo: 42 },
    });
    const state = router.getStateForAction(action);
    expect(state.routes[state.index]).toEqual(
      expect.objectContaining({
        routeName: 'Bar',
        params: { foo: 42 },
      })
    );
  });

  test('Gets deep path with pure wildcard match', () => {
    const ScreenA = () => <div />;
    const ScreenB = () => <div />;
    const ScreenC = () => <div />;
    ScreenA.router = createTestRouter({
      Boo: { path: 'boo', screen: ScreenC },
      Baz: { path: 'baz/:bazId', screen: ScreenB },
    });
    ScreenC.router = createTestRouter({
      Boo2: { path: '', screen: ScreenB },
    });
    const router = createTestRouter({
      Foo: {
        path: null,
        screen: ScreenA,
      },
      Bar: {
        screen: ScreenB,
      },
    });

    {
      const state = {
        index: 0,
        routes: [
          {
            index: 1,
            key: 'Foo',
            routeName: 'Foo',
            params: {
              id: '123',
            },
            routes: [
              {
                index: 0,
                key: 'Boo',
                routeName: 'Boo',
                routes: [{ key: 'Boo2', routeName: 'Boo2' }],
              },
              { key: 'Baz', routeName: 'Baz', params: { bazId: '321' } },
            ],
          },
          { key: 'Bar', routeName: 'Bar' },
        ],
      };
      const { path, params } = router.getPathAndParamsForState(state);
      expect(path).toEqual('baz/321');
      expect(params.id).toEqual('123');
      expect(params.bazId).toEqual('321');
    }

    {
      const state = {
        index: 0,
        routes: [
          {
            index: 0,
            key: 'Foo',
            routeName: 'Foo',
            params: {
              id: '123',
            },
            routes: [
              {
                index: 0,
                key: 'Boo',
                routeName: 'Boo',
                routes: [{ key: 'Boo2', routeName: 'Boo2' }],
              },
              { key: 'Baz', routeName: 'Baz', params: { bazId: '321' } },
            ],
          },
          { key: 'Bar', routeName: 'Bar' },
        ],
      };
      const { path, params } = router.getPathAndParamsForState(state);
      expect(path).toEqual('boo');
      expect(params).toEqual({ id: '123' });
    }
  });

  test('URI encoded string get passed to deep link', () => {
    const uri = 'people/2018%2F02%2F07';
    const action = testRouter.getActionForPathAndParams(uri);
    expect(action).toEqual({
      routeName: 'person',
      params: {
        id: '2018/02/07',
      },
      type: NavigationActions.NAVIGATE,
    });

    const malformedUri = 'people/%E0%A4%A';
    const action2 = testRouter.getActionForPathAndParams(malformedUri);
    expect(action2).toEqual({
      routeName: 'person',
      params: {
        id: '%E0%A4%A',
      },
      type: NavigationActions.NAVIGATE,
    });
  });

  test('Querystring params get passed to nested deep link', () => {
    const action = testRouter.getActionForPathAndParams(
      'main/p/4/list/10259959195',
      { code: 'test', foo: 'bar' }
    );
    expect(action).toEqual({
      type: NavigationActions.NAVIGATE,
      routeName: 'main',
      params: {
        code: 'test',
        foo: 'bar',
      },
      action: {
        type: NavigationActions.NAVIGATE,
        routeName: 'profile',
        params: {
          id: '4',
          code: 'test',
          foo: 'bar',
        },
        action: {
          type: NavigationActions.NAVIGATE,
          routeName: 'list',
          params: {
            id: '10259959195',
            code: 'test',
            foo: 'bar',
          },
        },
      },
    });

    const action2 = testRouter.getActionForPathAndParams(
      'main/p/4/list/10259959195',
      { code: '', foo: 'bar' }
    );
    expect(action2).toEqual({
      type: NavigationActions.NAVIGATE,
      routeName: 'main',
      params: {
        code: '',
        foo: 'bar',
      },
      action: {
        type: NavigationActions.NAVIGATE,
        routeName: 'profile',
        params: {
          id: '4',
          code: '',
          foo: 'bar',
        },
        action: {
          type: NavigationActions.NAVIGATE,
          routeName: 'list',
          params: {
            id: '10259959195',
            code: '',
            foo: 'bar',
          },
        },
      },
    });
  });

  test('paths option on router overrides path from route config', () => {
    const router = createTestRouter(
      {
        main: {
          screen: MainNavigator,
        },
        baz: {
          path: null,
          screen: FooNavigator,
        },
      },
      { paths: { baz: 'overridden' } }
    );
    const action = router.getActionForPathAndParams('overridden', {});
    expect(action.type).toEqual(NavigationActions.NAVIGATE);
    expect(action.routeName).toEqual('baz');
  });
};

describe('Path handling for stack router', () => {
  performRouterTest(StackRouter);
});
describe('Path handling for switch router', () => {
  performRouterTest(SwitchRouter);
});
