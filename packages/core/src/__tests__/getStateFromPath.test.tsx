import { expect, test } from '@jest/globals';
import type { InitialState, NavigationState } from '@react-navigation/routers';
import { produce } from 'immer';
import * as v from 'valibot';
import { z } from 'zod';

import { findFocusedRoute } from '../findFocusedRoute';
import { getPathFromState } from '../getPathFromState';
import { getStateFromPath } from '../getStateFromPath';

const changePath = <T extends InitialState>(state: T, path: string): T =>
  produce(state, (draftState) => {
    const route = findFocusedRoute(draftState);
    // @ts-expect-error: immer won't mutate this
    route.path = path;
  });

test('returns undefined for invalid path', () => {
  expect(getStateFromPath<object>('//')).toBeUndefined();
});

test('returns undefined for malformed encoded path segment', () => {
  expect(getStateFromPath<object>('foo/%E0%A4%A')).toBeUndefined();
});

test('returns undefined for malformed encoded path param', () => {
  const config = {
    screens: {
      Foo: 'foo/:id',
    },
  };

  expect(getStateFromPath<object>('foo/%E0%A4%A', config)).toBeUndefined();
});

test('matches malformed encoded path against wildcard', () => {
  const path = 'foo/%E0%A4%A';
  const config = {
    screens: {
      Foo: 'foo/:id',
      404: '*',
    },
  };

  const state = {
    routes: [{ name: '404', path }],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
});

test('matches malformed encoded first segment against wildcard', () => {
  const path = '%E0%A4%A/bar';
  const config = {
    screens: {
      Foo: 'foo/:id',
      404: '*',
    },
  };

  const state = {
    routes: [{ name: '404', path }],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
});

test('returns undefined for malformed encoded first segment without wildcard', () => {
  const config = {
    screens: {
      Foo: 'foo/:id',
    },
  };

  expect(getStateFromPath<object>('%E0%A4%A/bar', config)).toBeUndefined();
});

test('converts path string to initial state', () => {
  const path = 'foo/bar/baz%20qux?author=jane%20%26%20co&valid=true';
  const state = {
    routes: [
      {
        name: 'foo',
        state: {
          routes: [
            {
              name: 'bar',
              state: {
                routes: [
                  {
                    name: 'baz qux',
                    params: { author: 'jane & co', valid: 'true' },
                    path,
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path)).toEqual(state);
  expect(getStateFromPath<object>(getPathFromState<object>(state))).toEqual(
    changePath(state, '/foo/bar/baz%20qux?author=jane%20%26%20co&valid=true')
  );
});

test('decodes encoded params in path', () => {
  const path = '/foo/bar/bar_%23_foo';
  const config = {
    screens: {
      Foo: {
        path: 'foo',
        screens: {
          Bar: {
            path: '/bar/:id',
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foo',
        state: {
          routes: [
            {
              name: 'Bar',
              params: { id: 'bar_#_foo' },
              path,
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getPathFromState<object>(getStateFromPath<object>(path, config)!, config)
  ).toEqual(path);
});

test('decodes encoded params in path that have encoded /', () => {
  const path = '/foo/bar/bar_%2F_foo';
  const config = {
    screens: {
      Foo: {
        path: 'foo',
        screens: {
          Bar: {
            path: '/bar/:id',
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foo',
        state: {
          routes: [
            {
              name: 'Bar',
              params: { id: 'bar_/_foo' },
              path,
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getPathFromState<object>(getStateFromPath<object>(path, config)!, config)
  ).toEqual(path);
});

test('converts path string to initial state with config', () => {
  const path = '/foo/bar/sweet/apple/baz/jane?count=10&answer=42&valid=true';
  const config = {
    screens: {
      Foo: {
        path: 'foo',
        screens: {
          Bar: {
            path: 'bar/:type/:fruit',
            screens: {
              Baz: {
                path: 'baz/:author',
                parse: {
                  author: (author: string) =>
                    author.replace(/^\w/, (c) => c.toUpperCase()),
                  count: Number,
                  valid: Boolean,
                },
                stringify: {
                  author: (author: string) => author.toLowerCase(),
                },
              },
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foo',
        state: {
          routes: [
            {
              name: 'Bar',
              params: { fruit: 'apple', type: 'sweet' },
              state: {
                routes: [
                  {
                    name: 'Baz',
                    params: {
                      author: 'Jane',
                      count: 10,
                      answer: '42',
                      valid: true,
                    },
                    path,
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(state);
});

test('handles leading slash when converting', () => {
  const path = '/foo/bar/?count=42';

  expect(getStateFromPath<object>(path)).toEqual({
    routes: [
      {
        name: 'foo',
        state: {
          routes: [
            {
              name: 'bar',
              params: { count: '42' },
              path,
            },
          ],
        },
      },
    ],
  });
});

test('handles ending slash when converting', () => {
  const path = 'foo/bar/?count=42';

  expect(getStateFromPath<object>(path)).toEqual({
    routes: [
      {
        name: 'foo',
        state: {
          routes: [
            {
              name: 'bar',
              params: { count: '42' },
              path,
            },
          ],
        },
      },
    ],
  });
});

test('handles route without param', () => {
  const path = 'foo/bar';
  const state = {
    routes: [
      {
        name: 'foo',
        state: {
          routes: [{ name: 'bar', path }],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path)).toEqual(state);
  expect(getStateFromPath<object>(getPathFromState<object>(state))).toEqual(
    changePath(state, '/foo/bar')
  );
});

test('converts path string to initial state with config with nested screens', () => {
  const path = '/foe/bar/sweet/apple/baz/jane?count=10&answer=42&valid=true';
  const config = {
    screens: {
      Foo: {
        path: 'foo',
        screens: {
          Foe: {
            path: 'foe',
            exact: true,
            screens: {
              Bar: {
                path: 'bar/:type/:fruit',
                screens: {
                  Baz: {
                    path: 'baz/:author',
                    parse: {
                      author: (author: string) =>
                        author.replace(/^\w/, (c) => c.toUpperCase()),
                      count: Number,
                      valid: Boolean,
                    },
                    stringify: {
                      author: (author: string) => author.toLowerCase(),
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foo',
        state: {
          routes: [
            {
              name: 'Foe',
              state: {
                routes: [
                  {
                    name: 'Bar',
                    params: { fruit: 'apple', type: 'sweet' },
                    state: {
                      routes: [
                        {
                          name: 'Baz',
                          params: {
                            author: 'Jane',
                            count: 10,
                            answer: '42',
                            valid: true,
                          },
                          path,
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(state);
});

test('converts path string to initial state with config with nested screens and unused parse functions', () => {
  const path = '/foe/baz/jane?count=10&answer=42&valid=true';
  const config = {
    screens: {
      Foo: {
        path: 'foo',
        screens: {
          Foe: {
            path: 'foe',
            exact: true,
            screens: {
              Baz: {
                path: 'baz/:author',
                parse: {
                  author: (author: string) =>
                    author.replace(/^\w/, (c) => c.toUpperCase()),
                  count: Number,
                  valid: Boolean,
                  id: Boolean,
                },
              },
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foo',
        state: {
          routes: [
            {
              name: 'Foe',
              state: {
                routes: [
                  {
                    name: 'Baz',
                    params: {
                      author: 'Jane',
                      count: 10,
                      answer: '42',
                      valid: true,
                    },
                    path,
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(changePath(state, '/foe/baz/Jane?count=10&answer=42&valid=true'));
});

test('handles nested object with unused configs and with parse in it', () => {
  const path = '/bar/sweet/apple/foe/bis/jane?count=10&answer=42&valid=true';
  const config = {
    screens: {
      Bar: {
        path: 'bar/:type/:fruit',
        screens: {
          Foo: {
            screens: {
              Foe: {
                path: 'foe',
                screens: {
                  Baz: {
                    screens: {
                      Bos: {
                        path: 'bos',
                        exact: true,
                      },
                      Bis: {
                        path: 'bis/:author',
                        stringify: {
                          author: (author: string) =>
                            author.replace(/^\w/, (c) => c.toLowerCase()),
                        },
                        parse: {
                          author: (author: string) =>
                            author.replace(/^\w/, (c) => c.toUpperCase()),
                          count: Number,
                          valid: Boolean,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Bar',
        params: { fruit: 'apple', type: 'sweet' },
        state: {
          routes: [
            {
              name: 'Foo',
              state: {
                routes: [
                  {
                    name: 'Foe',
                    state: {
                      routes: [
                        {
                          name: 'Baz',
                          state: {
                            routes: [
                              {
                                name: 'Bis',
                                params: {
                                  author: 'Jane',
                                  count: 10,
                                  answer: '42',
                                  valid: true,
                                },
                                path,
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(state);
});

test('handles parse in nested object for second route depth', () => {
  const path = '/baz';
  const config = {
    screens: {
      Foo: {
        path: 'foo',
        screens: {
          Foe: {
            path: 'foe',
            exact: true,
          },
          Bar: {
            path: 'bar',
            exact: true,
            screens: {
              Baz: {
                path: 'baz',
                exact: true,
              },
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foo',
        state: {
          routes: [
            {
              name: 'Bar',
              state: {
                routes: [{ name: 'Baz', path }],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(state);
});

test('handles parse in nested object for second route depth and and path and parse in roots', () => {
  const path = '/baz';
  const config = {
    screens: {
      Foo: {
        path: 'foo/:id',
        parse: {
          id: Number,
        },
        stringify: {
          id: (id: number) => `id=${id}`,
        },
        screens: {
          Foe: 'foe',
          Bar: {
            screens: {
              Baz: {
                path: 'baz',
                exact: true,
              },
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foo',
        state: {
          routes: [
            {
              name: 'Bar',
              state: {
                routes: [{ name: 'Baz', path }],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(state);
});

test('handles path at top level', () => {
  const path = '/foo/fruits/apple';
  const config = {
    path: 'foo',
    screens: {
      Foo: {
        screens: {
          Fruits: 'fruits/:fruit',
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foo',
        state: {
          routes: [
            {
              name: 'Fruits',
              params: { fruit: 'apple' },
              path,
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(state);
});

test('handles initialRouteName at top level', () => {
  const path = '/baz';
  const config = {
    initialRouteName: 'Boo',
    screens: {
      Foo: {
        screens: {
          Foe: 'foe',
          Bar: {
            screens: {
              Baz: 'baz',
            },
          },
        },
      },
    },
  };

  const state = {
    index: 1,
    routes: [
      { name: 'Boo' },
      {
        name: 'Foo',
        state: {
          routes: [
            {
              name: 'Bar',
              state: {
                routes: [{ name: 'Baz', path }],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(state);
});

test('handles initialRouteName inside a screen', () => {
  const path = '/baz';
  const config = {
    screens: {
      Foo: {
        initialRouteName: 'Foe',
        screens: {
          Foe: 'foe',
          Bar: {
            screens: {
              Baz: 'baz',
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foo',
        state: {
          index: 1,
          routes: [
            {
              name: 'Foe',
            },
            {
              name: 'Bar',
              state: {
                routes: [{ name: 'Baz', path }],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(state);
});

test('handles initialRouteName included in path', () => {
  const path = '/baz';
  const config = {
    screens: {
      Foo: {
        initialRouteName: 'Foe',
        screens: {
          Foe: {
            screens: {
              Baz: 'baz',
            },
          },
          Bar: 'bar',
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foo',
        state: {
          routes: [
            {
              name: 'Foe',
              state: {
                routes: [{ name: 'Baz', path }],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(state);
});

test('handles two initialRouteNames', () => {
  const path = '/bar/sweet/apple/foe/bis/jane?answer=42&count=10&valid=true';
  const config = {
    screens: {
      Bar: {
        path: 'bar/:type/:fruit',
        screens: {
          Foo: {
            screens: {
              Foe: {
                path: 'foe',
                screens: {
                  Baz: {
                    initialRouteName: 'Bos',
                    screens: {
                      Bos: {
                        path: 'bos',
                        exact: true,
                      },
                      Bis: {
                        path: 'bis/:author',
                        stringify: {
                          author: (author: string) =>
                            author.replace(/^\w/, (c) => c.toLowerCase()),
                        },
                        parse: {
                          author: (author: string) =>
                            author.replace(/^\w/, (c) => c.toUpperCase()),
                          count: Number,
                          valid: Boolean,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Bar',
        params: { fruit: 'apple', type: 'sweet' },
        state: {
          routes: [
            {
              name: 'Foo',
              state: {
                routes: [
                  {
                    name: 'Foe',
                    state: {
                      routes: [
                        {
                          name: 'Baz',
                          state: {
                            index: 1,
                            routes: [
                              { name: 'Bos' },
                              {
                                name: 'Bis',
                                params: {
                                  answer: '42',
                                  author: 'Jane',
                                  count: 10,
                                  valid: true,
                                },
                                path,
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(state);
});

test('accepts initialRouteName without config for it', () => {
  const path = '/bar/sweet/apple/foe/bis/jane?answer=42&count=10&valid=true';
  const config = {
    screens: {
      Bar: {
        path: 'bar/:type/:fruit',
        screens: {
          Foo: {
            screens: {
              Foe: {
                path: 'foe',
                screens: {
                  Baz: {
                    initialRouteName: 'Bas',
                    screens: {
                      Bos: {
                        path: 'bos',
                        exact: true,
                      },
                      Bis: {
                        path: 'bis/:author',
                        stringify: {
                          author: (author: string) =>
                            author.replace(/^\w/, (c) => c.toLowerCase()),
                        },
                        parse: {
                          author: (author: string) =>
                            author.replace(/^\w/, (c) => c.toUpperCase()),
                          count: Number,
                          valid: Boolean,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Bar',
        params: { fruit: 'apple', type: 'sweet' },
        state: {
          routes: [
            {
              name: 'Foo',
              state: {
                routes: [
                  {
                    name: 'Foe',
                    state: {
                      routes: [
                        {
                          name: 'Baz',
                          state: {
                            index: 1,
                            routes: [
                              { name: 'Bas' },
                              {
                                name: 'Bis',
                                params: {
                                  answer: '42',
                                  author: 'Jane',
                                  count: 10,
                                  valid: true,
                                },
                                path,
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(state);
});

test('returns undefined if no matching screen is present (top level path)', () => {
  const path = '/foo/bar';
  const config = {
    path: 'qux',
    screens: {
      Foo: {
        screens: {
          Foe: 'foo',
          Bar: {
            screens: {
              Baz: 'bar',
            },
          },
        },
      },
    },
  };

  expect(getStateFromPath<object>(path, config)).toBeUndefined();
});

test('returns undefined if no matching screen is present', () => {
  const path = '/baz';
  const config = {
    screens: {
      Foo: {
        path: 'foo',
        screens: {
          Foe: 'foe',
          Bar: {
            screens: {
              Baz: 'baz',
            },
          },
        },
      },
    },
  };

  expect(getStateFromPath<object>(path, config)).toBeUndefined();
});

test('returns undefined if path is empty and no matching screen is present', () => {
  const path = '';
  const config = {
    screens: {
      Foo: {
        screens: {
          Foe: 'foe',
          Bar: {
            screens: {
              Baz: 'baz',
            },
          },
        },
      },
    },
  };

  expect(getStateFromPath<object>(path, config)).toBeUndefined();
});

test('returns matching screen if path is empty', () => {
  const path = '';
  const config = {
    screens: {
      Foo: {
        screens: {
          Foe: 'foe',
          Bar: {
            screens: {
              Qux: '',
              Baz: 'baz',
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foo',
        state: {
          routes: [
            {
              name: 'Bar',
              state: {
                routes: [{ name: 'Qux', path }],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(changePath(state, ''));
});

test('returns matching screen if path is only slash', () => {
  const path = '/';
  const config = {
    screens: {
      Foo: {
        screens: {
          Foe: 'foe',
          Bar: {
            screens: {
              Qux: '',
              Baz: 'baz',
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foo',
        state: {
          routes: [
            {
              name: 'Bar',
              state: {
                routes: [{ name: 'Qux', path: '' }],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(changePath(state, ''));
});

test('returns matching screen with params if path is empty', () => {
  const path = '?foo=42';
  const config = {
    screens: {
      Foo: {
        screens: {
          Foe: 'foe',
          Bar: {
            screens: {
              Qux: {
                path: '',
                parse: { foo: Number },
              },
              Baz: 'baz',
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foo',
        state: {
          routes: [
            {
              name: 'Bar',
              state: {
                routes: [{ name: 'Qux', params: { foo: 42 }, path }],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(changePath(state, '/?foo=42'));
});

test("doesn't match nested screen if path is empty", () => {
  const config = {
    screens: {
      Foo: {
        screens: {
          Foe: 'foe',
          Bar: {
            path: 'bar',
            screens: {
              Qux: {
                path: '',
                parse: { foo: Number },
              },
            },
          },
        },
      },
    },
  };

  const path = '';

  expect(getStateFromPath<object>(path, config)).toBeUndefined();
});

test('chooses more exhaustive pattern', () => {
  const path = '/foo/5';

  const config = {
    screens: {
      Foe: {
        path: '/',
        initialRouteName: 'Foo',
        screens: {
          Foo: 'foo',
          Bis: {
            path: 'foo/:id',
            parse: {
              id: Number,
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foe',
        state: {
          index: 1,
          routes: [
            {
              name: 'Foo',
            },
            {
              name: 'Bis',
              params: { id: 5 },
              path,
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(state);
});

test('handles same paths beginnings', () => {
  const path = '/foos';

  const config = {
    screens: {
      Foe: {
        path: '/',
        initialRouteName: 'Foo',
        screens: {
          Foo: 'foo',
          Bis: {
            path: 'foos',
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foe',
        state: {
          index: 1,
          routes: [
            {
              name: 'Foo',
            },
            {
              name: 'Bis',
              path,
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(state);
});

test('handles same paths beginnings with params', () => {
  const path = '/foos/5';

  const config = {
    screens: {
      Foe: {
        path: '/',
        initialRouteName: 'Foo',
        screens: {
          Foo: 'foo',
          Bis: {
            path: 'foos/:id',
            parse: {
              id: Number,
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foe',
        state: {
          index: 1,
          routes: [
            {
              name: 'Foo',
            },
            {
              name: 'Bis',
              params: { id: 5 },
              path,
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(state);
});

test('handles not taking path with too many segments', () => {
  const path = '/foos/5';

  const config = {
    screens: {
      Foe: {
        path: '/',
        initialRouteName: 'Foo',
        screens: {
          Foo: 'foo',
          Bis: {
            path: 'foos/:id',
            parse: {
              id: Number,
            },
          },
          Bas: {
            path: 'foos/:id/:nip',
            parse: {
              id: Number,
              pwd: Number,
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foe',
        state: {
          index: 1,
          routes: [
            {
              name: 'Foo',
            },
            {
              name: 'Bis',
              params: { id: 5 },
              path,
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(state);
});

test('handles differently ordered params v1', () => {
  const path = '/foos/5/res/20';

  const config = {
    screens: {
      Foe: {
        path: '/',
        initialRouteName: 'Foo',
        screens: {
          Foo: 'foo',
          Bis: {
            path: 'foos/:id',
            parse: {
              id: Number,
            },
          },
          Bas: {
            path: 'foos/:id/res/:pwd',
            parse: {
              id: Number,
              pwd: Number,
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foe',
        state: {
          index: 1,
          routes: [
            {
              name: 'Foo',
            },
            {
              name: 'Bas',
              params: { id: 5, pwd: 20 },
              path,
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(state);
});

test('handles differently ordered params v2', () => {
  const path = '/5/20/foos/res';

  const config = {
    screens: {
      Foe: {
        path: '/',
        initialRouteName: 'Foo',
        screens: {
          Foo: 'foo',
          Bis: {
            path: 'foos/:id',
            parse: {
              id: Number,
            },
          },
          Bas: {
            path: ':id/:pwd/foos/res',
            parse: {
              id: Number,
              pwd: Number,
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foe',
        state: {
          index: 1,
          routes: [
            {
              name: 'Foo',
            },
            {
              name: 'Bas',
              params: { id: 5, pwd: 20 },
              path,
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(state);
});

test('handles differently ordered params v3', () => {
  const path = '/foos/5/20/res';

  const config = {
    screens: {
      Foe: {
        path: '/',
        initialRouteName: 'Foo',
        screens: {
          Foo: 'foo',
          Bis: {
            path: 'foos/:id',
            parse: {
              id: Number,
            },
          },
          Bas: {
            path: 'foos/:id/:pwd/res',
            parse: {
              id: Number,
              pwd: Number,
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foe',
        state: {
          index: 1,
          routes: [
            {
              name: 'Foo',
            },
            {
              name: 'Bas',
              params: { id: 5, pwd: 20 },
              path,
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(state);
});

test('handles differently ordered params v4', () => {
  const path = '5/foos/res/20';

  const config = {
    screens: {
      Foe: {
        path: '/',
        initialRouteName: 'Foo',
        screens: {
          Foo: 'foo',
          Bis: {
            path: 'foos/:id',
            parse: {
              id: Number,
            },
          },
          Bas: {
            path: ':id/foos/res/:pwd',
            parse: {
              id: Number,
              pwd: Number,
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foe',
        state: {
          index: 1,
          routes: [
            {
              name: 'Foo',
            },
            {
              name: 'Bas',
              params: { id: 5, pwd: 20 },
              path,
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(changePath(state, '/5/foos/res/20'));
});

test('handles simple optional params', () => {
  const path = '/foos/5';

  const config = {
    screens: {
      Foe: {
        path: '/',
        initialRouteName: 'Foo',
        screens: {
          Foo: 'foo',
          Bis: {
            path: 'foo/:id',
            parse: {
              id: Number,
            },
          },
          Bas: {
            path: 'foos/:id/:nip?',
            parse: {
              id: Number,
              nip: Number,
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foe',
        state: {
          index: 1,
          routes: [
            {
              name: 'Foo',
            },
            {
              name: 'Bas',
              params: { id: 5 },
              path,
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(state);
});

test('handle 2 optional params at the end v1', () => {
  const path = '/foos/5';

  const config = {
    screens: {
      Foe: {
        path: '/',
        initialRouteName: 'Foo',
        screens: {
          Foo: 'foo',
          Bis: {
            path: 'foo/:id',
            parse: {
              id: Number,
            },
          },
          Bas: {
            path: 'foos/:id/:nip?/:pwd?',
            parse: {
              id: Number,
              nip: Number,
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foe',
        state: {
          index: 1,
          routes: [
            {
              name: 'Foo',
            },
            {
              name: 'Bas',
              params: { id: 5 },
              path,
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(state);
});

test('handle 2 optional params at the end v2', () => {
  const path = '/foos/5/10';

  const config = {
    screens: {
      Foe: {
        path: '/',
        initialRouteName: 'Foo',
        screens: {
          Foo: 'foo',
          Bis: {
            path: 'foo/:id',
            parse: {
              id: Number,
            },
          },
          Bas: {
            path: 'foos/:id/:nip?/:pwd?',
            parse: {
              id: Number,
              nip: Number,
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foe',
        state: {
          index: 1,
          routes: [
            {
              name: 'Foo',
            },
            {
              name: 'Bas',
              params: { id: 5, nip: 10 },
              path,
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(state);
});

test('handle 2 optional params at the end v3', () => {
  const path = '/foos/5/10/15';

  const config = {
    screens: {
      Foe: {
        path: '/',
        initialRouteName: 'Foo',
        screens: {
          Foo: 'foo',
          Bis: {
            path: 'foo/:id',
            parse: {
              id: Number,
            },
          },
          Bas: {
            path: 'foos/:id/:nip?/:pwd?',
            parse: {
              id: Number,
              nip: Number,
              pwd: Number,
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foe',
        state: {
          index: 1,
          routes: [
            {
              name: 'Foo',
            },
            {
              name: 'Bas',
              params: { id: 5, nip: 10, pwd: 15 },
              path,
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(state);
});

test('handle optional params in the middle v1', () => {
  const path = '/foos/5/10';

  const config = {
    screens: {
      Foe: {
        path: '/',
        initialRouteName: 'Foo',
        screens: {
          Foo: 'foo',
          Bis: {
            path: 'foo/:id',
            parse: {
              id: Number,
            },
          },
          Bas: {
            path: 'foos/:id/:nip?/:pwd',
            parse: {
              id: Number,
              nip: Number,
              pwd: Number,
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foe',
        state: {
          index: 1,
          routes: [
            {
              name: 'Foo',
            },
            {
              name: 'Bas',
              params: { id: 5, pwd: 10 },
              path,
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(state);
});

test('handle optional params in the middle v2', () => {
  const path = '/foos/5/10/15';

  const config = {
    screens: {
      Foe: {
        path: '/',
        initialRouteName: 'Foo',
        screens: {
          Foo: 'foo',
          Bis: {
            path: 'foo/:id',
            parse: {
              id: Number,
            },
          },
          Bas: {
            path: 'foos/:id/:nip?/:pwd',
            parse: {
              id: Number,
              nip: Number,
              pwd: Number,
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foe',
        state: {
          index: 1,
          routes: [
            {
              name: 'Foo',
            },
            {
              name: 'Bas',
              params: { id: 5, nip: 10, pwd: 15 },
              path,
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(state);
});

test('handle optional params in the middle v3', () => {
  const path = '/foos/5/10/15';

  const config = {
    screens: {
      Foe: {
        path: '/',
        initialRouteName: 'Foo',
        screens: {
          Foo: 'foo',
          Bis: {
            path: 'foo/:id',
            parse: {
              id: Number,
            },
          },
          Bas: {
            path: 'foos/:id/:nip?/:pwd/:smh',
            parse: {
              id: Number,
              nip: Number,
              pwd: Number,
              smh: Number,
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foe',
        state: {
          index: 1,
          routes: [
            {
              name: 'Foo',
            },
            {
              name: 'Bas',
              params: { id: 5, pwd: 10, smh: 15 },
              path,
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(state);
});

test('handle optional params in the middle v4', () => {
  const path = '/foos/5/10';

  const config = {
    screens: {
      Foe: {
        path: '/',
        initialRouteName: 'Foo',
        screens: {
          Foo: 'foo',
          Bis: {
            path: 'foo/:id',
            parse: {
              id: Number,
            },
          },
          Bas: {
            path: 'foos/:nip?/:pwd/:smh?/:id',
            parse: {
              id: Number,
              nip: Number,
              pwd: Number,
              smh: Number,
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foe',
        state: {
          index: 1,
          routes: [
            {
              name: 'Foo',
            },
            {
              name: 'Bas',
              params: { pwd: 5, id: 10 },
              path,
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(state);
});

test('handle optional params in the middle v5', () => {
  const path = '/foos/5/10/15';

  const config = {
    screens: {
      Foe: {
        path: '/',
        initialRouteName: 'Foo',
        screens: {
          Foo: 'foo',
          Bis: {
            path: 'foo/:id',
            parse: {
              id: Number,
            },
          },
          Bas: {
            path: 'foos/:nip?/:pwd/:smh?/:id',
            parse: {
              id: Number,
              nip: Number,
              pwd: Number,
              smh: Number,
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foe',
        state: {
          index: 1,
          routes: [
            {
              name: 'Foo',
            },
            {
              name: 'Bas',
              params: { nip: 5, pwd: 10, id: 15 },
              path,
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(state);
});

test('handle optional params in the beginning v1', () => {
  const path = '5/10/foos/15';

  const config = {
    screens: {
      Foe: {
        path: '/',
        initialRouteName: 'Foo',
        screens: {
          Foo: 'foo',
          Bis: {
            path: 'foo/:id',
            parse: {
              id: Number,
            },
          },
          Bas: {
            path: ':nip?/:pwd/foos/:smh?/:id',
            parse: {
              id: Number,
              nip: Number,
              pwd: Number,
              smh: Number,
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foe',
        state: {
          index: 1,
          routes: [
            {
              name: 'Foo',
            },
            {
              name: 'Bas',
              params: { nip: 5, pwd: 10, id: 15 },
              path,
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(changePath(state, '/5/10/foos/15'));
});

test('handle optional params in the beginning v2', () => {
  const path = '5/10/foos/15';

  const config = {
    screens: {
      Foe: {
        path: '/',
        initialRouteName: 'Foo',
        screens: {
          Foo: 'foo',
          Bis: {
            path: 'foo/:id',
            parse: {
              id: Number,
            },
          },
          Bas: {
            path: ':nip?/:smh?/:pwd/foos/:id',
            parse: {
              id: Number,
              nip: Number,
              pwd: Number,
              smh: Number,
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foe',
        state: {
          index: 1,
          routes: [
            {
              name: 'Foo',
            },
            {
              name: 'Bas',
              params: { nip: 5, pwd: 10, id: 15 },
              path,
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(changePath(state, '/5/10/foos/15'));
});

test('merges parent patterns if needed', () => {
  const path = 'foo/42/baz/babel';

  const config = {
    screens: {
      Foo: {
        path: 'foo/:bar',
        parse: {
          bar: Number,
        },
        screens: {
          Baz: 'baz/:qux',
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foo',
        params: { bar: 42 },
        state: {
          routes: [
            {
              name: 'Baz',
              params: { qux: 'babel' },
              path,
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(changePath(state, '/foo/42/baz/babel'));
});

test('ignores extra slashes in the pattern', () => {
  const path = '/bar/42';
  const config = {
    screens: {
      Foo: {
        screens: {
          Bar: {
            path: '/bar//:id/',
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foo',
        state: {
          routes: [
            {
              name: 'Bar',
              params: { id: '42' },
              path,
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(state);
});

test('matches wildcard patterns at root', () => {
  const path = '/test/bar/42/whatever';
  const config = {
    screens: {
      404: '*',
      Foo: {
        screens: {
          Bar: {
            path: '/bar/:id/',
          },
        },
      },
    },
  };

  const state = {
    routes: [{ name: '404', path }],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(changePath(state, '/404'));
});

test('matches param and wildcard patterns after unrelated static first segments', () => {
  const config = {
    screens: {
      Foo: 'foo/:id',
      Bar: 'bar/:id',
      Dynamic: ':section/:id',
      NotFound: '*',
    },
  };

  expect(getStateFromPath<object>('/bar/42', config)).toEqual({
    routes: [{ name: 'Bar', params: { id: '42' }, path: '/bar/42' }],
  });

  expect(getStateFromPath<object>('/baz/42', config)).toEqual({
    routes: [
      {
        name: 'Dynamic',
        params: { section: 'baz', id: '42' },
        path: '/baz/42',
      },
    ],
  });

  expect(getStateFromPath<object>('/foo/42/extra', config)).toEqual({
    routes: [{ name: 'NotFound', path: '/foo/42/extra' }],
  });
});

test('matches wildcard patterns at nested level', () => {
  const path = '/bar/42/whatever/baz/initt';
  const config = {
    screens: {
      Foo: {
        screens: {
          Bar: {
            path: '/bar/:id/',
            screens: {
              404: '*',
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foo',
        state: {
          routes: [
            {
              name: 'Bar',
              params: { id: '42' },
              state: {
                routes: [{ name: '404', path }],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(changePath(state, '/bar/42/404'));
});

test('matches wildcard patterns at nested level with exact', () => {
  const path = '/whatever';
  const config = {
    screens: {
      Foo: {
        screens: {
          Bar: {
            path: '/bar/:id/',
            screens: {
              404: {
                path: '*',
                exact: true,
              },
            },
          },
          Baz: {},
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foo',
        state: {
          routes: [
            {
              name: 'Bar',
              state: {
                routes: [{ name: '404', path }],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(changePath(state, '/404'));
});

test('tries to match wildcard patterns at the end', () => {
  const path = '/bar/42/test';
  const config = {
    screens: {
      Foo: {
        screens: {
          Bar: {
            path: '/bar/:id/',
            screens: {
              404: '*',
              UserProfile: ':userSlug',
              Test: 'test',
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foo',
        state: {
          routes: [
            {
              name: 'Bar',
              params: { id: '42' },
              state: {
                routes: [{ name: 'Test', path }],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(state);
});

test('uses nearest parent wildcard match for unmatched paths', () => {
  const path = '/bar/42/baz/test';
  const config = {
    screens: {
      Foo: {
        screens: {
          Bar: {
            path: '/bar/:id/',
            screens: {
              Baz: 'baz',
            },
          },
          404: '*',
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foo',
        state: {
          routes: [{ name: '404', path }],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(changePath(state, '/404'));
});

test('matches screen with overlapping initial path and wildcard', () => {
  const path = '/bar/42/baz/test/whatever';
  const config = {
    screens: {
      Foo: {
        screens: {
          Bar: {
            path: '/bar/:id/',
            screens: {
              Baz: 'baz',
            },
          },
          Baz: '/bar/:id/*',
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foo',
        state: {
          routes: [{ name: 'Baz', params: { id: '42' }, path }],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(changePath(state, '/bar/42/Baz'));
});

test('throws if two screens map to the same pattern', () => {
  const path = '/bar/42/baz/test';

  expect(() =>
    getStateFromPath<object>(path, {
      screens: {
        Foo: {
          screens: {
            Bar: {
              path: '/bar/:id/',
              screens: {
                Baz: 'baz',
              },
            },
            Bax: '/bar/:id/baz',
          },
        },
      },
    })
  ).toThrow(
    "Found conflicting screens with the same pattern. The pattern 'bar/:id/baz' resolves to both 'Foo > Bax' and 'Foo > Bar > Baz'. Patterns must be unique and cannot resolve to more than one screen unless shared: true is specified."
  );

  expect(() =>
    getStateFromPath<object>(path, {
      screens: {
        Foo: {
          screens: {
            Bar: {
              path: '/bar/:id/',
              screens: {
                Baz: '',
              },
            },
          },
        },
      },
    })
  ).not.toThrow();
});

test('correctly applies initialRouteName for config with similar route names', () => {
  const path = '/weekly-earnings';

  const config = {
    screens: {
      RootTabs: {
        screens: {
          HomeTab: {
            screens: {
              Home: '',
              WeeklyEarnings: 'weekly-earnings',
              EventDetails: 'event-details/:eventId',
            },
          },
          EarningsTab: {
            initialRouteName: 'Earnings',
            path: 'earnings',
            screens: {
              Earnings: '',
              WeeklyEarnings: 'weekly-earnings',
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'RootTabs',
        state: {
          routes: [
            {
              name: 'HomeTab',
              state: {
                routes: [
                  {
                    name: 'WeeklyEarnings',
                    path,
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(state);
});

test('correctly applies initialRouteName for config with similar route names v2', () => {
  const path = '/earnings/weekly-earnings';

  const config = {
    screens: {
      RootTabs: {
        screens: {
          HomeTab: {
            initialRouteName: 'Home',
            screens: {
              Home: '',
              WeeklyEarnings: 'weekly-earnings',
            },
          },
          EarningsTab: {
            initialRouteName: 'Earnings',
            path: 'earnings',
            screens: {
              Earnings: '',
              WeeklyEarnings: 'weekly-earnings',
            },
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'RootTabs',
        state: {
          routes: [
            {
              name: 'EarningsTab',
              state: {
                index: 1,
                routes: [
                  {
                    name: 'Earnings',
                  },
                  {
                    name: 'WeeklyEarnings',
                    path,
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
  expect(
    getStateFromPath<object>(getPathFromState<object>(state, config), config)
  ).toEqual(state);
});

test('throws when invalid properties are specified in the config', () => {
  expect(() =>
    getStateFromPath<object>('', {
      path: 42,
      Foo: 'foo',
      Bar: {
        path: 'bar',
      },
    } as any)
  ).toThrowErrorMatchingInlineSnapshot(`
    "Found invalid properties in the configuration:
    - path (expected 'string', got 'number')
    - Foo (extraneous)
    - Bar (extraneous)

    You can only specify the following properties:
    - path (string)
    - initialRouteName (string)
    - screens (object)

    If you want to specify configuration for screens, you need to specify them under a 'screens' property.

    See https://reactnavigation.org/docs/configuring-links for more details on how to specify a linking configuration."
  `);

  expect(() =>
    getStateFromPath<object>('', {
      screens: {
        Foo: 'foo',
        Bar: {
          path: 'bar',
        },
        Baz: {
          Qux: {
            path: 'qux',
          },
        },
      },
    } as any)
  ).toThrowErrorMatchingInlineSnapshot(`
"Found invalid properties in the configuration:
- Qux (extraneous)

You can only specify the following properties:
- path (string)
- initialRouteName (string)
- screens (object)
- alias (array)
- exact (boolean)
- stringify (object)
- parse (object)
- shared (boolean)

If you want to specify configuration for screens, you need to specify them under a 'screens' property.

See https://reactnavigation.org/docs/configuring-links for more details on how to specify a linking configuration."
`);

  expect(() =>
    getStateFromPath<object>('', {
      path: 'foo/:id',
    } as any)
  ).toThrowErrorMatchingInlineSnapshot(
    `"Found invalid path 'foo/:id'. The 'path' in the top-level configuration cannot contain patterns for params."`
  );
});

// Valid characters according to
// https://datatracker.ietf.org/doc/html/rfc3986#section-3.3 (see pchar definition)
// A–Z, a–z, 0–9, -, ., _, ~, !, $, &, ', (, ), *, +, ,, ;, =, :, @
// User09-A_Z~!$&'()*+,;=:@__#?# - should encode only last ones #?#
// query params after '?' should be encoded fully with encodeURIComponent
test('encodes special characters in params', () => {
  const paramWithValidSymbols = `User09-A_Z~!$&'()*+,;=:@__`;
  const invalidSymbols = '#?[]{}%<>||😄';
  const queryString = 'user#email@gmail.com=2&4';

  const path = `users/id/${paramWithValidSymbols}${encodeURIComponent(invalidSymbols)}?query=${encodeURIComponent(queryString)}`;
  const config = {
    path: 'users',
    screens: {
      Users: {
        screens: {
          User: 'id/:id',
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Users',
        state: {
          routes: [
            {
              name: 'User',
              params: {
                id: `${paramWithValidSymbols}${invalidSymbols}`,
                query: queryString,
              },
            },
          ],
        },
      },
    ],
  };

  expect(getPathFromState<object>(state, config)).toBe(`/${path}`);
  expect(
    getPathFromState<object>(getStateFromPath<object>(path, config)!, config)
  ).toBe(`/${path}`);
});

test('resolves nested path params with same name to correct screen', () => {
  const path = '/foo/42/bar/43';

  const config = {
    initialRouteName: 'Foo',
    screens: {
      Foo: {
        path: 'foo/:id',
        screens: {
          Bar: {
            path: 'bar/:id',
          },
        },
      },
    },
  };

  const state = {
    routes: [
      {
        name: 'Foo',
        params: { id: '42' },
        state: {
          routes: [
            {
              name: 'Bar',
              params: { id: '43' },
              path,
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>(path, config)).toEqual(state);
});

test('parses / same as empty string', () => {
  const config = {
    screens: {
      Foo: {
        path: '/',
      },
      Bar: {
        path: 'bar',
      },
    },
  };

  expect(getStateFromPath<object>('/', config)).toEqual(
    getStateFromPath<object>('', config)
  );
});

test('matches regexp patterns when provided', () => {
  const config = {
    screens: {
      Foo: {
        path: 'foo/:id(\\d+)',
        parse: {
          id: Number,
        },
      },
      Bar: {
        path: 'foo/:id([a-z]+)',
      },
      Baz: {
        path: 'foo/:id(\\d+)/:name([a-z]+)',
      },
      Qux: {
        path: 'foo/:id(@[a-z]+)',
        parse: {
          id: (id: string) => id.slice(1),
        },
      },
      Quy: {
        path: 'foo/bar/:category',
      },
      Quz: {
        path: 'foo/bar/:special([a-z]+)',
      },
      Quu: {
        path: 'foo/bar/baz',
      },
      NotFound: {
        path: 'foo/bar/*',
      },
    },
  };

  expect(getStateFromPath<object>('foo/42', config)).toEqual({
    routes: [
      {
        name: 'Foo',
        params: { id: 42 },
        path: 'foo/42',
      },
    ],
  });

  expect(getStateFromPath<object>('foo/bar', config)).toEqual({
    routes: [
      {
        name: 'Bar',
        params: { id: 'bar' },
        path: 'foo/bar',
      },
    ],
  });

  expect(getStateFromPath<object>('foo/42/bar', config)).toEqual({
    routes: [
      {
        name: 'Baz',
        params: { id: '42', name: 'bar' },
        path: 'foo/42/bar',
      },
    ],
  });

  expect(getStateFromPath<object>('foo/@bar', config)).toEqual({
    routes: [
      {
        name: 'Qux',
        params: { id: 'bar' },
        path: 'foo/@bar',
      },
    ],
  });

  expect(getStateFromPath<object>('foo/@bar', config)).toEqual({
    routes: [
      {
        name: 'Qux',
        params: { id: 'bar' },
        path: 'foo/@bar',
      },
    ],
  });

  expect(getStateFromPath<object>('foo/42a', config)).toBeUndefined();

  expect(getStateFromPath<object>('foo/bar/123', config)).toEqual({
    routes: [
      {
        name: 'Quy',
        params: { category: '123' },
        path: 'foo/bar/123',
      },
    ],
  });

  expect(getStateFromPath<object>('foo/bar/test', config)).toEqual({
    routes: [
      {
        name: 'Quz',
        params: { special: 'test' },
        path: 'foo/bar/test',
      },
    ],
  });

  expect(getStateFromPath<object>('foo/bar/baz', config)).toEqual({
    routes: [
      {
        name: 'Quu',
        path: 'foo/bar/baz',
      },
    ],
  });

  expect(getStateFromPath<object>('foo/bar/hello/world', config)).toEqual({
    routes: [{ name: 'NotFound', path: 'foo/bar/hello/world' }],
  });
});

test("doesn't match pattern when standard schema validation fails", () => {
  const IdSchema = z.string().startsWith('@');

  const config: Parameters<typeof getStateFromPath>[1] = {
    screens: {
      Foo: {
        path: 'foo/:id',
        parse: {
          id: IdSchema,
        },
      },
      Bar: {
        path: 'foo/:slug',
      },
    },
  };

  expect(getStateFromPath<object>('foo/42', config)).toEqual({
    routes: [
      {
        name: 'Bar',
        params: { slug: '42' },
        path: 'foo/42',
      },
    ],
  });

  expect(getStateFromPath<object>('foo/@test', config)).toEqual({
    routes: [
      {
        name: 'Foo',
        params: { id: '@test' },
        path: 'foo/@test',
      },
    ],
  });
});

test('parses values with valibot schema and falls back on validation failure', () => {
  const IdSchema = v.pipe(
    v.string(),
    v.transform((input) => Number(input)),
    v.number()
  );

  const config: Parameters<typeof getStateFromPath>[1] = {
    screens: {
      Foo: {
        path: 'foo/:id',
        parse: {
          id: IdSchema,
        },
      },
      Bar: {
        path: 'foo/:slug',
      },
    },
  };

  expect(getStateFromPath<object>('foo/42', config)).toEqual({
    routes: [
      {
        name: 'Foo',
        params: { id: 42 },
        path: 'foo/42',
      },
    ],
  });

  expect(getStateFromPath<object>('foo/x', config)).toEqual({
    routes: [
      {
        name: 'Bar',
        params: { slug: 'x' },
        path: 'foo/x',
      },
    ],
  });
});

test('falls back to next pattern when query param schema validation fails', () => {
  const QuerySchema = z.string().startsWith('@');

  const config: Parameters<typeof getStateFromPath>[1] = {
    screens: {
      Foo: {
        path: 'foo/:id(\\d+)',
        parse: {
          id: Number,
          query: QuerySchema,
        },
      },
      Bar: {
        path: 'foo/:slug',
      },
    },
  };

  expect(getStateFromPath<object>('foo/42?query=bad', config)).toEqual({
    routes: [
      {
        name: 'Bar',
        params: { slug: '42', query: 'bad' },
        path: 'foo/42?query=bad',
      },
    ],
  });
});

test("doesn't overwrite path param with same-named query param", () => {
  const config: Parameters<typeof getStateFromPath>[1] = {
    screens: {
      Foo: {
        path: 'foo/:id',
      },
    },
  };

  expect(getStateFromPath<object>('foo/42?id=7&query=test', config)).toEqual({
    routes: [
      {
        name: 'Foo',
        params: { id: '42', query: 'test' },
        path: 'foo/42?id=7&query=test',
      },
    ],
  });
});

test("doesn't use same-named query param when optional path param is missing with function parser", () => {
  const config: Parameters<typeof getStateFromPath>[1] = {
    screens: {
      Foo: {
        path: 'foo/:query?',
        parse: {
          query: (value: string) => value.toUpperCase(),
        },
      },
    },
  };

  expect(getStateFromPath<object>('foo?query=test', config)).toEqual({
    routes: [
      {
        name: 'Foo',
        params: { query: undefined },
        path: 'foo?query=test',
      },
    ],
  });
});

test("doesn't use same-named query param when optional path param is missing with schema parser", () => {
  const config: Parameters<typeof getStateFromPath>[1] = {
    screens: {
      Foo: {
        path: 'foo/:query?',
        parse: {
          query: z.string(),
        },
      },
    },
  };

  expect(getStateFromPath<object>('foo?query=test', config)).toEqual({
    routes: [
      {
        name: 'Foo',
        params: { query: undefined },
        path: 'foo?query=test',
      },
    ],
  });
});

test('keeps params object when optional path param is missing with optional function query parser', () => {
  const config: Parameters<typeof getStateFromPath>[1] = {
    screens: {
      Foo: {
        path: 'foo/:id?',
        parse: {
          query: (value: string) => value.toUpperCase(),
        },
      },
    },
  };

  expect(getStateFromPath<object>('foo', config)).toEqual({
    routes: [
      {
        name: 'Foo',
        params: { id: undefined },
        path: 'foo',
      },
    ],
  });

  expect(getStateFromPath<object>('foo?query=test', config)).toEqual({
    routes: [
      {
        name: 'Foo',
        params: { id: undefined, query: 'TEST' },
        path: 'foo?query=test',
      },
    ],
  });
});

test('keeps params object when optional path param is missing with optional schema query parser', () => {
  const QuerySchema = z.string().startsWith('@').optional();

  const config: Parameters<typeof getStateFromPath>[1] = {
    screens: {
      Foo: {
        path: 'foo/:id?',
        parse: {
          query: QuerySchema,
        },
      },
    },
  };

  expect(getStateFromPath<object>('foo', config)).toEqual({
    routes: [
      {
        name: 'Foo',
        params: { id: undefined },
        path: 'foo',
      },
    ],
  });

  expect(getStateFromPath<object>('foo?query=@ok', config)).toEqual({
    routes: [
      {
        name: 'Foo',
        params: { id: undefined, query: '@ok' },
        path: 'foo?query=@ok',
      },
    ],
  });
});

test('falls back to next pattern when required query param is missing', () => {
  const QuerySchema = z.string().startsWith('@');

  const config: Parameters<typeof getStateFromPath>[1] = {
    screens: {
      Foo: {
        path: 'foo/:id(\\d+)',
        parse: {
          id: Number,
          query: QuerySchema,
        },
      },
      Bar: {
        path: 'foo/:slug',
      },
    },
  };

  expect(getStateFromPath<object>('foo/42', config)).toEqual({
    routes: [
      {
        name: 'Bar',
        params: { slug: '42' },
        path: 'foo/42',
      },
    ],
  });

  expect(getStateFromPath<object>('foo/42?query=@ok', config)).toEqual({
    routes: [
      {
        name: 'Foo',
        params: { id: 42, query: '@ok' },
        path: 'foo/42?query=@ok',
      },
    ],
  });
});

test('allows missing query param when schema is optional', () => {
  const QuerySchema = z.string().startsWith('@').optional();

  const config: Parameters<typeof getStateFromPath>[1] = {
    screens: {
      Foo: {
        path: 'foo/:id(\\d+)',
        parse: {
          id: Number,
          query: QuerySchema,
        },
      },
      Bar: {
        path: 'foo/:slug',
      },
    },
  };

  expect(getStateFromPath<object>('foo/42', config)).toEqual({
    routes: [
      {
        name: 'Foo',
        params: { id: 42 },
        path: 'foo/42',
      },
    ],
  });

  expect(getStateFromPath<object>('foo/42?query=@ok', config)).toEqual({
    routes: [
      {
        name: 'Foo',
        params: { id: 42, query: '@ok' },
        path: 'foo/42?query=@ok',
      },
    ],
  });
});

test('treats function query parser as optional when query param is missing', () => {
  const config: Parameters<typeof getStateFromPath>[1] = {
    screens: {
      Foo: {
        path: 'foo/:id(\\d+)',
        parse: {
          id: Number,
          query: (value: string) => value.toUpperCase(),
        },
      },
      Bar: {
        path: 'foo/:slug',
      },
    },
  };

  expect(getStateFromPath<object>('foo/42', config)).toEqual({
    routes: [
      {
        name: 'Foo',
        params: { id: 42 },
        path: 'foo/42',
      },
    ],
  });

  expect(getStateFromPath<object>('foo/42?query=test', config)).toEqual({
    routes: [
      {
        name: 'Foo',
        params: { id: 42, query: 'TEST' },
        path: 'foo/42?query=test',
      },
    ],
  });
});

test('uses optional schema default for missing query param', () => {
  const QuerySchema = z
    .string()
    .startsWith('@')
    .optional()
    .default('@fallback');

  const config: Parameters<typeof getStateFromPath>[1] = {
    screens: {
      Foo: {
        path: 'foo/:id(\\d+)',
        parse: {
          id: Number,
          query: QuerySchema,
        },
      },
      Bar: {
        path: 'foo/:slug',
      },
    },
  };

  expect(getStateFromPath<object>('foo/42', config)).toEqual({
    routes: [
      {
        name: 'Foo',
        params: { id: 42, query: '@fallback' },
        path: 'foo/42',
      },
    ],
  });
});

test('uses optional schema default for missing query param with no path params', () => {
  const QuerySchema = z
    .string()
    .startsWith('@')
    .optional()
    .default('@fallback');

  const config: Parameters<typeof getStateFromPath>[1] = {
    screens: {
      Foo: {
        path: 'foo',
        parse: {
          query: QuerySchema,
        },
      },
    },
  };

  expect(getStateFromPath<object>('foo', config)).toEqual({
    routes: [
      {
        name: 'Foo',
        params: { query: '@fallback' },
        path: 'foo',
      },
    ],
  });
});

test('validates ?query and ?query= through schema parsers', () => {
  const QuerySchema = z.string().startsWith('@');

  const config: Parameters<typeof getStateFromPath>[1] = {
    screens: {
      Foo: {
        path: 'foo/:id(\\d+)',
        parse: {
          id: Number,
          query: QuerySchema,
        },
      },
      Bar: {
        path: 'foo/:slug',
      },
    },
  };

  expect(getStateFromPath<object>('foo/42?query', config)).toEqual({
    routes: [
      {
        name: 'Bar',
        params: { slug: '42', query: null },
        path: 'foo/42?query',
      },
    ],
  });

  expect(getStateFromPath<object>('foo/42?query=', config)).toEqual({
    routes: [
      {
        name: 'Bar',
        params: { slug: '42', query: '' },
        path: 'foo/42?query=',
      },
    ],
  });

  expect(getStateFromPath<object>('foo/42?query=@ok', config)).toEqual({
    routes: [
      {
        name: 'Foo',
        params: { id: 42, query: '@ok' },
        path: 'foo/42?query=@ok',
      },
    ],
  });
});

test('keeps query string intact when it contains an extra question mark', () => {
  const config: Parameters<typeof getStateFromPath>[1] = {
    screens: {
      Foo: 'foo',
    },
  };

  expect(getStateFromPath<object>('/foo?raw=x?y=1', config)).toEqual({
    routes: [
      {
        name: 'Foo',
        params: { raw: 'x?y=1' },
        path: '/foo?raw=x?y=1',
      },
    ],
  });
});

test('matches percent-encoded static segments', () => {
  const config: Parameters<typeof getStateFromPath>[1] = {
    screens: {
      Foo: 'café/foo',
      Bar: 'foo bar',
    },
  };

  expect(getStateFromPath<object>('/café/foo', config)).toEqual({
    routes: [{ name: 'Foo', path: '/café/foo' }],
  });

  expect(getStateFromPath<object>('/caf%C3%A9/foo', config)).toEqual({
    routes: [{ name: 'Foo', path: '/caf%C3%A9/foo' }],
  });

  expect(getStateFromPath<object>('/caf%c3%a9/foo', config)).toEqual({
    routes: [{ name: 'Foo', path: '/caf%c3%a9/foo' }],
  });

  expect(getStateFromPath<object>('/foo%20bar', config)).toEqual({
    routes: [{ name: 'Bar', path: '/foo%20bar' }],
  });

  const path = getPathFromState<object>({ routes: [{ name: 'Foo' }] }, config);

  expect(path).toBe('/caf%C3%A9/foo');
  expect(getStateFromPath<object>(path, config)).toEqual({
    routes: [{ name: 'Foo', path: '/caf%C3%A9/foo' }],
  });
});

test('matches percent-encoded root path prefix', () => {
  const config: Parameters<typeof getStateFromPath>[1] = {
    path: 'café',
    screens: {
      Foo: 'foo',
    },
  };

  expect(getStateFromPath<object>('/café/foo', config)).toEqual({
    routes: [{ name: 'Foo', path: '/café/foo' }],
  });

  expect(getStateFromPath<object>('/caf%C3%A9/foo', config)).toEqual({
    routes: [{ name: 'Foo', path: '/caf%C3%A9/foo' }],
  });

  expect(getStateFromPath<object>('/caf%c3%a9/foo', config)).toEqual({
    routes: [{ name: 'Foo', path: '/caf%c3%a9/foo' }],
  });

  expect(getStateFromPath<object>('/other/foo', config)).toBeUndefined();
});

test('passes null, string and string[] query values to schema parser', () => {
  const QuerySchema = {
    '~standard': {
      version: 1 as const,
      vendor: 'test',
      validate: (value: unknown) => {
        if (value === null) {
          return { value: 'from-null' };
        }

        if (typeof value === 'string') {
          return { value: `from-string:${value}` };
        }

        if (
          Array.isArray(value) &&
          value.every((item) => typeof item === 'string')
        ) {
          return { value: `from-array:${value.join('|')}` };
        }

        return { issues: [{ message: 'Invalid value' }] };
      },
    },
  };

  const config: Parameters<typeof getStateFromPath>[1] = {
    screens: {
      Foo: {
        path: 'foo/:id(\\d+)',
        parse: {
          id: Number,
          query: QuerySchema,
        },
      },
    },
  };

  expect(getStateFromPath<object>('foo/42?query', config)).toEqual({
    routes: [
      {
        name: 'Foo',
        params: { id: 42, query: 'from-null' },
        path: 'foo/42?query',
      },
    ],
  });

  expect(getStateFromPath<object>('foo/42?query=test', config)).toEqual({
    routes: [
      {
        name: 'Foo',
        params: { id: 42, query: 'from-string:test' },
        path: 'foo/42?query=test',
      },
    ],
  });

  expect(getStateFromPath<object>('foo/42?query=a&query=b', config)).toEqual({
    routes: [
      {
        name: 'Foo',
        params: { id: 42, query: 'from-array:a|b' },
        path: 'foo/42?query=a&query=b',
      },
    ],
  });
});

test('uses first repeated query value for function parser', () => {
  const config: Parameters<typeof getStateFromPath>[1] = {
    screens: {
      Foo: {
        path: 'foo/:id(\\d+)',
        parse: {
          id: Number,
          query: (value: string) => value.toUpperCase(),
        },
      },
      Bar: {
        path: 'foo/:slug',
      },
    },
  };

  expect(getStateFromPath<object>('foo/42?query=a&query=b', config)).toEqual({
    routes: [
      {
        name: 'Foo',
        params: { id: 42, query: 'A' },
        path: 'foo/42?query=a&query=b',
      },
    ],
  });
});

test('prefers standard schema when parser is both callable and schema', () => {
  const QueryParser = Object.assign((value: string) => `function:${value}`, {
    '~standard': {
      version: 1 as const,
      vendor: 'test',
      validate: (value: unknown) => {
        if (typeof value === 'string' && value.startsWith('@')) {
          return { value: `schema:${value}` };
        }

        return { issues: [{ message: 'Invalid value' }] };
      },
    },
  });

  const config: Parameters<typeof getStateFromPath>[1] = {
    screens: {
      Foo: {
        path: 'foo/:id(\\d+)',
        parse: {
          id: Number,
          query: QueryParser,
        },
      },
      Bar: {
        path: 'foo/:slug',
      },
    },
  };

  expect(getStateFromPath<object>('foo/42?query=@ok', config)).toEqual({
    routes: [
      {
        name: 'Foo',
        params: { id: 42, query: 'schema:@ok' },
        path: 'foo/42?query=@ok',
      },
    ],
  });

  expect(getStateFromPath<object>('foo/42?query=bad', config)).toEqual({
    routes: [
      {
        name: 'Bar',
        params: { slug: '42', query: 'bad' },
        path: 'foo/42?query=bad',
      },
    ],
  });
});

test('throws when schema validate returns an asynchronous result', () => {
  const AsyncSchema = {
    '~standard': {
      version: 1 as const,
      vendor: 'test',
      validate: async (value: string) => ({ value }),
    },
  };

  const config: Parameters<typeof getStateFromPath>[1] = {
    screens: {
      Foo: {
        path: 'foo/:id',
        parse: {
          id: AsyncSchema,
        },
      },
    },
  };

  expect(() => getStateFromPath<object>('foo/42', config)).toThrow(
    'Invalid validation result from schema. It should be an object with either "value" or "issues" property and cannot be asynchronous.'
  );
});

test('throws when schema validate returns an asynchronous result for query param', () => {
  const AsyncSchema = {
    '~standard': {
      version: 1 as const,
      vendor: 'test',
      validate: async (value: string) => ({ value }),
    },
  };

  const config: Parameters<typeof getStateFromPath>[1] = {
    screens: {
      Foo: {
        path: 'foo/:id',
        parse: {
          query: AsyncSchema,
        },
      },
    },
  };

  expect(() => getStateFromPath<object>('foo/42?query=test', config)).toThrow(
    'Invalid validation result from schema. It should be an object with either "value" or "issues" property and cannot be asynchronous.'
  );
});

test('throws when path param parser is not a function or standard schema', () => {
  const config = {
    screens: {
      Foo: {
        path: 'foo/:id',
        parse: {
          id: { version: 2, validate: (v: unknown) => ({ value: v }) } as any,
        },
      },
    },
  };

  expect(() => getStateFromPath<object>('foo/42', config)).toThrow(
    'Invalid parser. Expected a function or a Standard Schema V1 object.'
  );
});

test('throws when query param parser is not a function or standard schema', () => {
  const config = {
    screens: {
      Foo: {
        path: 'foo/:id',
        parse: {
          query: {
            version: 2,
            validate: (v: unknown) => ({ value: v }),
          } as any,
        },
      },
    },
  };

  expect(() => getStateFromPath<object>('foo/42?query=test', config)).toThrow(
    'Invalid parser. Expected a function or a Standard Schema V1 object.'
  );
});

test('strips null query param when function parser is configured', () => {
  const config: Parameters<typeof getStateFromPath>[1] = {
    screens: {
      Foo: {
        path: 'foo/:id(\\d+)',
        parse: {
          id: Number,
          query: (value: string) => value.toUpperCase(),
        },
      },
    },
  };

  expect(getStateFromPath<object>('foo/42?query', config)).toEqual({
    routes: [
      {
        name: 'Foo',
        params: { id: 42 },
        path: 'foo/42?query',
      },
    ],
  });
});

test('strips nested navigation query params for routes with nested screens', () => {
  const config = {
    screens: {
      Parent: {
        path: 'parent',
        screens: {
          Child: 'child',
        },
      },
    },
  };

  const path =
    'parent?screen=Child&params=value&initial=false&path=/child&merge=true&pop=true&state=keep&query=test';

  expect(getStateFromPath<object>(path, config)).toEqual({
    routes: [
      {
        name: 'Parent',
        params: {
          query: 'test',
          state: 'keep',
        },
        path,
      },
    ],
  });
});

test("doesn't strip nested navigation query params for leaf routes", () => {
  const config = {
    screens: {
      Leaf: 'leaf',
    },
  };

  const path =
    'leaf?screen=Child&params=value&initial=false&path=/child&merge=true&pop=true';

  expect(getStateFromPath<object>(path, config)).toEqual({
    routes: [
      {
        name: 'Leaf',
        params: {
          screen: 'Child',
          params: 'value',
          initial: 'false',
          path: '/child',
          merge: 'true',
          pop: 'true',
        },
        path,
      },
    ],
  });
});

test("doesn't strip nested navigation query params without screen", () => {
  const config = {
    screens: {
      Parent: {
        path: 'parent',
        screens: {
          Child: 'child',
        },
      },
    },
  };

  const path =
    'parent?params=value&initial=false&path=/child&merge=true&pop=true';

  expect(getStateFromPath<object>(path, config)).toEqual({
    routes: [
      {
        name: 'Parent',
        params: {
          params: 'value',
          initial: 'false',
          path: '/child',
          merge: 'true',
          pop: 'true',
        },
        path,
      },
    ],
  });
});

test('keeps reserved query params configured with parsers on routes with nested screens', () => {
  const config = {
    screens: {
      Parent: {
        path: 'parent',
        parse: {
          screen: (value: string) => value.toUpperCase(),
          params: (value: string) => `parsed:${value}`,
          initial: z.string().transform((value) => `schema:${value}`),
          path: (value: string) => `parsed:${value}`,
          merge: (value: string) => value === 'true',
          pop: (value: string) => value === 'true',
        },
        screens: {
          Child: 'child',
        },
      },
    },
  };

  const path =
    'parent?screen=Child&params=value&initial=false&path=/child&merge=true&pop=true';

  expect(getStateFromPath<object>(path, config)).toEqual({
    routes: [
      {
        name: 'Parent',
        params: {
          screen: 'CHILD',
          params: 'parsed:value',
          initial: 'schema:false',
          path: 'parsed:/child',
          merge: true,
          pop: true,
        },
        path,
      },
    ],
  });
});

test("regexp pattern doesn't match slash", () => {
  const config = {
    screens: {
      Foo: {
        path: 'foo/:id([a-z]+\\/)',
      },
    },
  };

  expect(getStateFromPath<object>('foo/bar/', config)).toBeUndefined();

  expect(getStateFromPath<object>('foo/bar/baz', config)).toBeUndefined();

  expect(getStateFromPath<object>('foo/bar/baz/qux', config)).toBeUndefined();
});

test('handles alias for paths', () => {
  const config = {
    screens: {
      Foo: {
        path: 'foo',
        alias: ['first'],
        screens: {
          Baz: {
            path: 'baz/:id?',
            parse: {
              id: (value: string) => value.replace(/@/, ''),
            },
            alias: [
              {
                path: 'second/:id',
                exact: true,
              },
              'third',
              {
                path: 'fourth/:id',
                parse: {
                  id: (value: string) => value.replace(/\$/, ''),
                },
              },
            ],
          },
          Qux: {
            path: 'qux/:id',
          },
        },
      },
    },
  };

  expect(getStateFromPath<object>('foo', config)).toEqual({
    routes: [{ name: 'Foo', path: 'foo' }],
  });

  expect(
    getPathFromState<object>(getStateFromPath<object>('foo', config)!, config)
  ).toBe('/foo');

  expect(getStateFromPath<object>('first', config)).toEqual({
    routes: [{ name: 'Foo', path: 'first' }],
  });

  expect(
    getPathFromState<object>(getStateFromPath<object>('first', config)!, config)
  ).toBe('/foo');

  expect(getStateFromPath<object>('foo/baz/@$test', config)).toEqual({
    routes: [
      {
        name: 'Foo',
        state: {
          routes: [
            {
              name: 'Baz',
              params: { id: '$test' },
              path: 'foo/baz/@$test',
            },
          ],
        },
      },
    ],
  });

  expect(
    getPathFromState<object>(
      getStateFromPath<object>('foo/baz/@$test', config)!,
      config
    )
  ).toBe('/foo/baz/$test');

  expect(getStateFromPath<object>('second/42', config)).toEqual({
    routes: [
      {
        name: 'Foo',
        state: {
          routes: [
            {
              name: 'Baz',
              params: { id: '42' },
              path: 'second/42',
            },
          ],
        },
      },
    ],
  });

  expect(
    getPathFromState<object>(
      getStateFromPath<object>('second/42', config)!,
      config
    )
  ).toBe('/foo/baz/42');

  expect(getStateFromPath<object>('foo/third', config)).toEqual({
    routes: [
      {
        name: 'Foo',
        state: {
          routes: [
            {
              name: 'Baz',
              path: 'foo/third',
            },
          ],
        },
      },
    ],
  });

  expect(
    getPathFromState<object>(
      getStateFromPath<object>('foo/third', config)!,
      config
    )
  ).toBe('/foo/baz');

  expect(getStateFromPath<object>('foo/fourth/@$test', config)).toEqual({
    routes: [
      {
        name: 'Foo',
        state: {
          routes: [
            {
              name: 'Baz',
              params: { id: '@test' },
              path: 'foo/fourth/@$test',
            },
          ],
        },
      },
    ],
  });

  expect(
    getPathFromState<object>(
      getStateFromPath<object>('foo/fourth/@$test', config)!,
      config
    )
  ).toBe('/foo/baz/@test');

  expect(getStateFromPath<object>('foo/qux/42', config)).toEqual({
    routes: [
      {
        name: 'Foo',
        state: {
          routes: [
            {
              name: 'Qux',
              params: { id: '42' },
              path: 'foo/qux/42',
            },
          ],
        },
      },
    ],
  });

  expect(
    getPathFromState<object>(
      getStateFromPath<object>('foo/qux/42', config)!,
      config
    )
  ).toBe('/foo/qux/42');
});

test('throws if screen has alias but no path', () => {
  expect(() =>
    getStateFromPath<object>('', {
      screens: {
        Foo: {
          alias: ['bar'],
        },
      },
    })
  ).toThrow(
    `Screen 'Foo' doesn't specify a 'path'. A 'path' needs to be specified in order to use 'alias'.`
  );
});

test('resolves shared paths to the initial tab or current tab', () => {
  const config = {
    screens: {
      Tabs: {
        initialRouteName: 'HomeTab',
        screens: {
          HomeTab: {
            initialRouteName: 'Home',
            screens: {
              Home: '',
              Profile: {
                path: 'profile/:id',
                shared: true,
              },
            },
          },
          SearchTab: {
            initialRouteName: 'Search',
            screens: {
              Search: 'search',
              Profile: {
                path: 'profile/:id',
                shared: true,
              },
            },
          },
        },
      },
    },
  };

  expect(getStateFromPath<object>('/profile/123', config)).toEqual({
    routes: [
      {
        name: 'Tabs',
        state: {
          routes: [
            {
              name: 'HomeTab',
              state: {
                index: 1,
                routes: [
                  { name: 'Home' },
                  {
                    name: 'Profile',
                    params: { id: '123' },
                    path: '/profile/123',
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  });

  const previous: NavigationState = {
    index: 0,
    key: 'root',
    routeNames: ['Tabs'],
    stale: false,
    type: 'test',
    routes: [
      {
        key: 'tabs',
        name: 'Tabs',
        state: {
          index: 1,
          key: 'tabs-state',
          routeNames: ['HomeTab', 'SearchTab'],
          stale: false,
          type: 'test',
          routes: [
            { key: 'home-tab', name: 'HomeTab' },
            {
              key: 'search-tab',
              name: 'SearchTab',
              state: {
                index: 0,
                key: 'search-state',
                routeNames: ['Search'],
                stale: false,
                type: 'test',
                routes: [{ key: 'search', name: 'Search' }],
              },
            },
          ],
        },
      },
    ],
  };

  const state = getStateFromPath<object>('/profile/123', config, previous);

  expect(state).toEqual({
    routes: [
      {
        name: 'Tabs',
        state: {
          index: 1,
          routes: [
            { name: 'HomeTab' },
            {
              name: 'SearchTab',
              state: {
                index: 1,
                routes: [
                  { name: 'Search' },
                  {
                    name: 'Profile',
                    params: { id: '123' },
                    path: '/profile/123',
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  });

  expect(getPathFromState<object>(state!, config)).toBe('/profile/123');
});

test('uses parse config from the selected shared screen', () => {
  const config = {
    screens: {
      Tabs: {
        initialRouteName: 'HomeTab',
        screens: {
          HomeTab: {
            initialRouteName: 'Home',
            screens: {
              Home: '',
              Profile: {
                path: 'profile/:id',
                shared: true,
                parse: {
                  id: (value: string) => `home:${value}`,
                },
              },
            },
          },
          SearchTab: {
            initialRouteName: 'Search',
            screens: {
              Search: 'search',
              Profile: {
                path: 'profile/:id',
                shared: true,
                parse: {
                  id: (value: string) => `search:${value}`,
                },
              },
            },
          },
        },
      },
    },
  };

  expect(getStateFromPath<object>('/profile/123', config)).toEqual({
    routes: [
      {
        name: 'Tabs',
        state: {
          routes: [
            {
              name: 'HomeTab',
              state: {
                index: 1,
                routes: [
                  { name: 'Home' },
                  {
                    name: 'Profile',
                    params: { id: 'home:123' },
                    path: '/profile/123',
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  });

  const previous: NavigationState = {
    index: 0,
    key: 'root',
    routeNames: ['Tabs'],
    stale: false,
    type: 'test',
    routes: [
      {
        key: 'tabs',
        name: 'Tabs',
        state: {
          index: 1,
          key: 'tabs-state',
          routeNames: ['HomeTab', 'SearchTab'],
          stale: false,
          type: 'test',
          routes: [
            { key: 'home-tab', name: 'HomeTab' },
            {
              key: 'search-tab',
              name: 'SearchTab',
              state: {
                index: 0,
                key: 'search-state',
                routeNames: ['Search'],
                stale: false,
                type: 'test',
                routes: [{ key: 'search', name: 'Search' }],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>('/profile/123', config, previous)).toEqual({
    routes: [
      {
        name: 'Tabs',
        state: {
          index: 1,
          routes: [
            { name: 'HomeTab' },
            {
              name: 'SearchTab',
              state: {
                index: 1,
                routes: [
                  { name: 'Search' },
                  {
                    name: 'Profile',
                    params: { id: 'search:123' },
                    path: '/profile/123',
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  });
});

test("uses the initial tab for shared paths when the current tab doesn't contain the screen", () => {
  const config = {
    screens: {
      Tabs: {
        initialRouteName: 'HomeTab',
        screens: {
          HomeTab: {
            initialRouteName: 'Home',
            screens: {
              Home: '',
              Profile: {
                path: 'profile/:id',
                shared: true,
              },
            },
          },
          OtherTab: {
            screens: {
              Other: 'other',
            },
          },
        },
      },
    },
  };

  const previous: NavigationState = {
    index: 0,
    key: 'root',
    routeNames: ['Tabs'],
    stale: false,
    type: 'test',
    routes: [
      {
        key: 'tabs',
        name: 'Tabs',
        state: {
          index: 0,
          key: 'tabs-state',
          routeNames: ['OtherTab'],
          stale: false,
          type: 'test',
          routes: [
            {
              key: 'other-tab',
              name: 'OtherTab',
              state: {
                index: 0,
                key: 'other-state',
                routeNames: ['Other'],
                stale: false,
                type: 'test',
                routes: [{ key: 'other', name: 'Other' }],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath<object>('/profile/123', config, previous)).toEqual({
    routes: [
      {
        name: 'Tabs',
        state: {
          routes: [
            {
              name: 'HomeTab',
              state: {
                index: 1,
                routes: [
                  { name: 'Home' },
                  {
                    name: 'Profile',
                    params: { id: '123' },
                    path: '/profile/123',
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  });
});

test('uses the first shared screen in the config when no tab is preferred', () => {
  const config = {
    screens: {
      Tabs: {
        screens: {
          HomeTab: {
            screens: {
              Profile: {
                path: 'profile/:id',
                shared: true,
              },
            },
          },
          SearchTab: {
            screens: {
              Profile: {
                path: 'profile/:id',
                shared: true,
              },
            },
          },
        },
      },
    },
  };

  expect(getStateFromPath<object>('/profile/123', config)).toEqual({
    routes: [
      {
        name: 'Tabs',
        state: {
          routes: [
            {
              name: 'HomeTab',
              state: {
                routes: [
                  {
                    name: 'Profile',
                    params: { id: '123' },
                    path: '/profile/123',
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  });
});

test('resolves nested shared paths in the current tab', () => {
  const config = {
    screens: {
      Tabs: {
        initialRouteName: 'HomeTab',
        screens: {
          HomeTab: {
            initialRouteName: 'Home',
            screens: {
              Home: '',
              Post: {
                path: 'post/:id',
                shared: true,
                screens: {
                  Comments: {
                    path: 'comments',
                    shared: true,
                  },
                },
              },
            },
          },
          SearchTab: {
            initialRouteName: 'Search',
            screens: {
              Search: 'search',
              Post: {
                path: 'post/:id',
                shared: true,
                screens: {
                  Comments: {
                    path: 'comments',
                    shared: true,
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  const previous: NavigationState = {
    index: 0,
    key: 'root',
    routeNames: ['Tabs'],
    stale: false,
    type: 'test',
    routes: [
      {
        key: 'tabs',
        name: 'Tabs',
        state: {
          index: 1,
          key: 'tabs-state',
          routeNames: ['HomeTab', 'SearchTab'],
          stale: false,
          type: 'test',
          routes: [
            { key: 'home-tab', name: 'HomeTab' },
            {
              key: 'search-tab',
              name: 'SearchTab',
              state: {
                index: 0,
                key: 'search-state',
                routeNames: ['Post'],
                stale: false,
                type: 'test',
                routes: [
                  {
                    key: 'post',
                    name: 'Post',
                    params: { id: '9' },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  expect(
    getStateFromPath<object>('/post/9/comments', config, previous)
  ).toEqual({
    routes: [
      {
        name: 'Tabs',
        state: {
          index: 1,
          routes: [
            { name: 'HomeTab' },
            {
              name: 'SearchTab',
              state: {
                index: 1,
                routes: [
                  { name: 'Search' },
                  {
                    name: 'Post',
                    params: { id: '9' },
                    state: {
                      routes: [
                        {
                          name: 'Comments',
                          path: '/post/9/comments',
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  });
});

test('resolves shared alias paths in the current tab', () => {
  const config = {
    screens: {
      Tabs: {
        initialRouteName: 'HomeTab',
        screens: {
          HomeTab: {
            screens: {
              Profile: {
                path: 'home-profile/:id',
                alias: [{ path: 'u/:id', shared: true }],
              },
            },
          },
          SearchTab: {
            screens: {
              Profile: {
                path: 'search-profile/:id',
                alias: [{ path: 'u/:id', shared: true }],
              },
            },
          },
        },
      },
    },
  };

  const previous: NavigationState = {
    index: 0,
    key: 'root',
    routeNames: ['Tabs'],
    stale: false,
    type: 'test',
    routes: [
      {
        key: 'tabs',
        name: 'Tabs',
        state: {
          index: 0,
          key: 'tabs-state',
          routeNames: ['HomeTab', 'SearchTab'],
          stale: false,
          type: 'test',
          routes: [{ key: 'search-tab', name: 'SearchTab' }],
        },
      },
    ],
  };

  expect(getStateFromPath<object>('/u/123', config, previous)).toEqual({
    routes: [
      {
        name: 'Tabs',
        state: {
          index: 1,
          routes: [
            { name: 'HomeTab' },
            {
              name: 'SearchTab',
              state: {
                routes: [
                  {
                    name: 'Profile',
                    params: { id: '123' },
                    path: '/u/123',
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  });
});

test("doesn't treat alias paths as shared unless the alias is marked as shared", () => {
  expect(() =>
    getStateFromPath<object>('/u/123', {
      screens: {
        Tabs: {
          screens: {
            HomeTab: {
              screens: {
                Profile: {
                  path: 'home-profile/:id',
                  shared: true,
                  alias: [{ path: 'u/:id' }],
                },
              },
            },
            SearchTab: {
              screens: {
                Profile: {
                  path: 'search-profile/:id',
                  shared: true,
                  alias: [{ path: 'u/:id' }],
                },
              },
            },
          },
        },
      },
    })
  ).toThrow(
    `Found conflicting screens with the same pattern. The pattern 'u/:id' resolves to both 'Tabs > HomeTab > Profile' and 'Tabs > SearchTab > Profile'. Patterns must be unique and cannot resolve to more than one screen unless shared: true is specified.`
  );
});
