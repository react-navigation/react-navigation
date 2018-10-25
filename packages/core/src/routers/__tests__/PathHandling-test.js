/* eslint no-shadow:0, react/no-multi-comp:0, react/display-name:0 */

import React from 'react';

import SwitchRouter from '../SwitchRouter';
import StackRouter from '../StackRouter';
import TabRouter from '../TabRouter';
import NavigationActions from '../../NavigationActions';
import { _TESTING_ONLY_normalize_keys } from '../KeyGenerator.ts';

beforeEach(() => {
  _TESTING_ONLY_normalize_keys();
});

const performRouterTest = createTestRouter => {
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

  test('Handles empty URIs with empty action', () => {
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
    expect(action).toEqual(null);
    const state = router.getStateForAction(action || NavigationActions.init());
    expect(state.routes[state.index]).toEqual(
      expect.objectContaining({
        routeName: 'Bar',
        params: { foo: 42 },
      })
    );
  });

  test('Handles paths with several params', () => {
    const router = createTestRouter({
      Person: {
        path: 'people/:person',
        screen: () => <div />,
      },
      Task: {
        path: 'people/:person/tasks/:task',
        screen: () => <div />,
      },
      ThingA: {
        path: 'things/:good',
        screen: () => <div />,
      },
      Thing: {
        path: 'things/:good/:thing',
        screen: () => <div />,
      },
    });
    const action = router.getActionForPathAndParams(
      'people/brent/tasks/everything'
    );
    expect(action).toEqual({
      type: NavigationActions.NAVIGATE,
      routeName: 'Task',
      params: { person: 'brent', task: 'everything' },
    });

    const action1 = router.getActionForPathAndParams('people/lucy');
    expect(action1).toEqual({
      type: NavigationActions.NAVIGATE,
      routeName: 'Person',
      params: { person: 'lucy' },
    });

    const action2 = router.getActionForPathAndParams('things/foo/bar');
    expect(action2).toEqual({
      type: NavigationActions.NAVIGATE,
      routeName: 'Thing',
      params: { good: 'foo', thing: 'bar' },
    });

    const action3 = router.getActionForPathAndParams('things/foo');
    expect(action3).toEqual({
      type: NavigationActions.NAVIGATE,
      routeName: 'ThingA',
      params: { good: 'foo' },
    });
  });

  test('Handles empty path configuration', () => {
    const router = createTestRouter({
      Foo: {
        screen: () => <div />,
      },
      Bar: {
        screen: () => <div />,
        path: '',
      },
    });
    const action = router.getActionForPathAndParams('');
    expect(action).toEqual({
      type: NavigationActions.NAVIGATE,
      routeName: 'Bar',
      params: {},
    });
  });

  test('Handles wildcard path configuration', () => {
    const router = createTestRouter({
      Foo: {
        screen: () => <div />,
      },
      Bar: {
        screen: () => <div />,
        path: ':something',
      },
    });
    const action = router.getActionForPathAndParams('');
    expect(action).toEqual(null);

    const action1 = router.getActionForPathAndParams('Foo');
    expect(action1).toEqual({
      type: NavigationActions.NAVIGATE,
      routeName: 'Foo',
      params: {},
    });
    const action2 = router.getActionForPathAndParams('asdf');
    expect(action2).toEqual({
      type: NavigationActions.NAVIGATE,
      routeName: 'Bar',
      params: { something: 'asdf' },
    });
  });

  test('Null path behavior', () => {
    const ScreenA = () => <div />;
    const router = createTestRouter({
      Bar: {
        screen: ScreenA,
      },
      Foo: {
        path: null,
        screen: ScreenA,
      },
      Baz: {
        path: '',
        screen: ScreenA,
      },
    });
    const action0 = router.getActionForPathAndParams('test/random', {});
    expect(action0).toBe(null);

    const action1 = router.getActionForPathAndParams('', {});
    expect(action1.routeName).toBe('Baz');
    const state1 = router.getStateForAction(action1);
    expect(state1.routes[state1.index].routeName).toBe('Baz');
  });

  test('Multiple null path sub routers path behavior', () => {
    const ScreenA = () => <div />;
    const ScreenB = () => <div />;
    ScreenB.router = createTestRouter({
      Foo: ScreenA,
    });
    const ScreenC = () => <div />;
    ScreenC.router = createTestRouter({
      Bar: {
        path: 'bar/:id',
        screen: ScreenA,
      },
      Empty: {
        path: '',
        screen: ScreenA,
      },
    });
    const router = createTestRouter({
      A: {
        screen: ScreenA,
      },
      B: {
        path: null,
        screen: ScreenB,
      },
      C: {
        path: null,
        screen: ScreenC,
      },
    });
    const action0 = router.getActionForPathAndParams('Foo', {});
    expect(action0.routeName).toBe('B');
    expect(action0.action.routeName).toBe('Foo');

    const action1 = router.getActionForPathAndParams('', {});
    expect(action1.routeName).toBe('C');
    expect(action1.action.routeName).toBe('Empty');

    const action2 = router.getActionForPathAndParams('A', {});
    expect(action2.routeName).toBe('A');

    const action3 = router.getActionForPathAndParams('bar/asdf', {});
    expect(action3.routeName).toBe('C');
    expect(action3.action.routeName).toBe('Bar');
    expect(action3.action.params.id).toBe('asdf');
  });

  test('Null and empty string path sub routers behavior', () => {
    const ScreenA = () => <div />;
    const ScreenB = () => <div />;
    ScreenB.router = createTestRouter({
      Foo: ScreenA,
      Baz: {
        screen: ScreenA,
        path: '',
      },
    });
    const ScreenC = () => <div />;
    ScreenC.router = createTestRouter({
      Boo: ScreenA,
      Bar: ScreenA,
      Baz: {
        screen: ScreenA,
        path: '',
      },
    });
    const router = createTestRouter({
      B: {
        path: null,
        screen: ScreenB,
      },
      C: {
        path: '',
        screen: ScreenC,
      },
    });
    const action0 = router.getActionForPathAndParams('', {});
    expect(action0.routeName).toBe('C');
    expect(action0.action.routeName).toBe('Baz');

    const action1 = router.getActionForPathAndParams('Foo', {});
    expect(action1.routeName).toBe('B');
    expect(action1.action.routeName).toBe('Foo');

    const action2 = router.getActionForPathAndParams('Bar', {});
    expect(action2.routeName).toBe('C');
    expect(action2.action.routeName).toBe('Bar');

    const action3 = router.getActionForPathAndParams('unknown', {});
    expect(action3).toBe(null);
  });

  test('Empty path acts as wildcard for nested router', () => {
    const ScreenA = () => <div />;
    const Foo = () => <div />;
    const ScreenC = () => <div />;
    ScreenC.router = createTestRouter({
      Boo: ScreenA,
      Bar: ScreenA,
    });
    Foo.router = createTestRouter({
      Quo: ScreenA,
      Qux: {
        screen: ScreenC,
        path: '',
      },
    });
    const router = createTestRouter({
      Bar: {
        screen: ScreenA,
      },
      Foo,
    });
    const action0 = router.getActionForPathAndParams('Foo/Bar', {});
    expect(action0.routeName).toBe('Foo');
    expect(action0.action.routeName).toBe('Qux');
    expect(action0.action.action.routeName).toBe('Bar');
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

  test('URI encoded path param gets parsed and correctly printed', () => {
    const action = testRouter.getActionForPathAndParams('people/Henry%20L');
    expect(action).toEqual({
      routeName: 'person',
      params: {
        id: 'Henry L',
      },
      type: NavigationActions.NAVIGATE,
    });
    const s = testRouter.getStateForAction(action);
    const out = testRouter.getPathAndParamsForState(s);
    expect(out.path).toEqual('people/Henry%20L');
    expect(out.params).toEqual({});
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

  test('paths option set as null on router overrides path from route config', () => {
    const router = createTestRouter(
      {
        main: {
          screen: MainNavigator,
        },
        baz: {
          path: 'bazPath',
          screen: FooNavigator,
        },
      },
      { paths: { baz: null } }
    );
    const action = router.getActionForPathAndParams('b/noBaz', {});
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

test('Handles nested switch routers', () => {
  const AScreen = () => <div />;
  const DocsNavigator = () => <div />;
  DocsNavigator.router = SwitchRouter({
    A: AScreen,
    B: AScreen,
    C: AScreen,
  });
  DocsNavigator.path = 'docs';
  const router = SwitchRouter({
    Docs: DocsNavigator,
    D: AScreen,
  });
  const action = router.getActionForPathAndParams('docs/B', {});

  expect(action.type).toEqual(NavigationActions.NAVIGATE);
  expect(action.routeName).toEqual('Docs');
  expect(action.action.type).toEqual(NavigationActions.NAVIGATE);
  expect(action.action.routeName).toEqual('B');
});

const performRouteNameAsPathDisabledTest = createTestRouter => {
  const BScreen = () => <div />;
  const NestedNavigator = () => <div />;
  NestedNavigator.router = createTestRouter({
    B: {
      screen: BScreen,
      path: 'baz',
    },
  });
  const router = createTestRouter(
    {
      A: NestedNavigator,
    },
    { disableRouteNamePaths: true }
  );

  test('disableRouteNamePaths option on router prevent the default path to be the routeName', () => {
    const action = router.getActionForPathAndParams('baz', {});

    expect(action.routeName).toBe('A');
    expect(action.action.routeName).toBe('B');
  });
};

describe('Stack router handles disableRouteNamePaths', () => {
  performRouteNameAsPathDisabledTest(StackRouter);
});

describe('Switch router handles disableRouteNamePaths', () => {
  performRouteNameAsPathDisabledTest(SwitchRouter);
});

describe('Tab router handles disableRouteNamePaths', () => {
  performRouteNameAsPathDisabledTest(TabRouter);
});
