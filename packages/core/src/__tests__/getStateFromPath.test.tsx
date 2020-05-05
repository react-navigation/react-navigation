import getStateFromPath from '../getStateFromPath';
import getPathFromState from '../getPathFromState';

it('returns undefined for invalid path', () => {
  expect(getStateFromPath('//')).toBe(undefined);
});

it('converts path string to initial state', () => {
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
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath(path)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state))).toEqual(state);
});

it('converts path string to initial state with config', () => {
  const path = '/foo/bar/sweet/apple/baz/jane?count=10&answer=42&valid=true';
  const config = {
    Foo: 'foo',
    Bar: 'bar/:type/:fruit',
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
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath(path, config)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state, config), config)).toEqual(
    state
  );
});

it('handles leading slash when converting', () => {
  expect(getStateFromPath('/foo/bar/?count=42')).toEqual({
    routes: [
      {
        name: 'foo',
        state: {
          routes: [
            {
              name: 'bar',
              params: { count: '42' },
            },
          ],
        },
      },
    ],
  });
});

it('handles ending slash when converting', () => {
  expect(getStateFromPath('foo/bar/?count=42')).toEqual({
    routes: [
      {
        name: 'foo',
        state: {
          routes: [
            {
              name: 'bar',
              params: { count: '42' },
            },
          ],
        },
      },
    ],
  });
});

it('handles route without param', () => {
  const path = 'foo/bar';
  const state = {
    routes: [
      {
        name: 'foo',
        state: {
          routes: [{ name: 'bar' }],
        },
      },
    ],
  };

  expect(getStateFromPath(path)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state))).toEqual(state);
});

it('converts path string to initial state with config with nested screens', () => {
  const path = '/foe/bar/sweet/apple/baz/jane?count=10&answer=42&valid=true';
  const config = {
    Foo: {
      path: 'foo',
      screens: {
        Foe: 'foe',
      },
    },
    Bar: 'bar/:type/:fruit',
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

  expect(getStateFromPath(path, config)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state, config), config)).toEqual(
    state
  );
});

it('converts path string to initial state with config with nested screens and unused parse functions', () => {
  const path = '/foe/baz/jane?count=10&answer=42&valid=true';
  const config = {
    Foo: {
      path: 'foo',
      screens: {
        Foe: 'foe',
      },
    },
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
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath(path, config)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state, config), config)).toEqual(
    state
  );
});

it('handles nested object with unused configs and with parse in it', () => {
  const path = '/bar/sweet/apple/foe/bis/jane?count=10&answer=42&valid=true';
  const config = {
    Foo: {
      path: 'foo',
      screens: {
        Foe: 'foe',
      },
    },
    Bar: 'bar/:type/:fruit',
    Baz: {
      path: 'baz',
      screens: {
        Bos: 'bos',
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

  expect(getStateFromPath(path, config)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state, config), config)).toEqual(
    state
  );
});

it('handles parse in nested object for second route depth', () => {
  const path = '/baz';
  const config = {
    Foo: {
      path: 'foo',
      screens: {
        Foe: 'foe',
        Bar: {
          path: 'bar',
          screens: {
            Baz: 'baz',
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
                routes: [{ name: 'Baz' }],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath(path, config)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state, config), config)).toEqual(
    state
  );
});

it('handles parse in nested object for second route depth and and path and parse in roots', () => {
  const path = '/baz';
  const config = {
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
            Baz: 'baz',
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
                routes: [{ name: 'Baz' }],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath(path, config)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state, config), config)).toEqual(
    state
  );
});

it('handles initialRouteName', () => {
  const path = '/baz';
  const config = {
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
                routes: [{ name: 'Baz' }],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath(path, config)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state, config), config)).toEqual(
    state
  );
});

it('handles initialRouteName included in path', () => {
  const path = '/baz';
  const config = {
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
                routes: [{ name: 'Baz' }],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath(path, config)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state, config), config)).toEqual(
    state
  );
});

it('handles two initialRouteNames', () => {
  const path = '/bar/sweet/apple/foe/bis/jane?count=10&answer=42&valid=true';
  const config = {
    Foo: {
      path: 'foo',
      screens: {
        Foe: 'foe',
      },
    },
    Bar: 'bar/:type/:fruit',
    Baz: {
      initialRouteName: 'Bos',
      screens: {
        Bos: 'bos',
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
                                  author: 'Jane',
                                  count: 10,
                                  answer: '42',
                                  valid: true,
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
        },
      },
    ],
  };

  expect(getStateFromPath(path, config)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state, config), config)).toEqual(
    state
  );
});

it('accepts initialRouteName without config for it', () => {
  const path = '/bar/sweet/apple/foe/bis/jane?count=10&answer=42&valid=true';
  const config = {
    Foo: {
      path: 'foo',
      screens: {
        Foe: 'foe',
      },
    },
    Bar: 'bar/:type/:fruit',
    Baz: {
      initialRouteName: 'Bas',
      screens: {
        Bos: 'bos',
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
                                  author: 'Jane',
                                  count: 10,
                                  answer: '42',
                                  valid: true,
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
        },
      },
    ],
  };

  expect(getStateFromPath(path, config)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state, config), config)).toEqual(
    state
  );
});

it('returns undefined if path is empty and no matching screen is present', () => {
  const config = {
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
  };

  const path = '';

  expect(getStateFromPath(path, config)).toEqual(undefined);
});

it('returns matching screen if path is empty', () => {
  const path = '';
  const config = {
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
                routes: [{ name: 'Qux' }],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath(path, config)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state, config), config)).toEqual(
    state
  );
});

it('returns matching screen with params if path is empty', () => {
  const path = '?foo=42';
  const config = {
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
                routes: [{ name: 'Qux', params: { foo: 42 } }],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath(path, config)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state, config), config)).toEqual(
    state
  );
});

it("doesn't match nested screen if path is empty", () => {
  const config = {
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
  };

  const path = '';

  expect(getStateFromPath(path, config)).toEqual(undefined);
});

it('chooses more exhaustive pattern', () => {
  const path = '/foo/5';

  const config = {
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
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath(path, config)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state, config), config)).toEqual(
    state
  );
});

it('handles same paths beginnings', () => {
  const path = '/foos';

  const config = {
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
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath(path, config)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state, config), config)).toEqual(
    state
  );
});

it('handles same paths beginnings with params', () => {
  const path = '/foos/5';

  const config = {
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
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath(path, config)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state, config), config)).toEqual(
    state
  );
});

it('handles not taking path with too many segments', () => {
  const path = '/foos/5';

  const config = {
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
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath(path, config)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state, config), config)).toEqual(
    state
  );
});

it('handles differently ordered params v1', () => {
  const path = '/foos/5/res/20';

  const config = {
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
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath(path, config)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state, config), config)).toEqual(
    state
  );
});

it('handles differently ordered params v2', () => {
  const path = '/5/20/foos/res';

  const config = {
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
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath(path, config)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state, config), config)).toEqual(
    state
  );
});

it('handles differently ordered params v3', () => {
  const path = '/foos/5/20/res';

  const config = {
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
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath(path, config)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state, config), config)).toEqual(
    state
  );
});

it('handles differently ordered params v4', () => {
  const path = '5/foos/res/20';

  const config = {
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
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath(path, config)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state, config), config)).toEqual(
    state
  );
});

it('handles simple optional params', () => {
  const path = '/foos/5';

  const config = {
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
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath(path, config)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state, config), config)).toEqual(
    state
  );
});

it('handle 2 optional params at the end v1', () => {
  const path = '/foos/5';

  const config = {
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
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath(path, config)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state, config), config)).toEqual(
    state
  );
});

it('handle 2 optional params at the end v2', () => {
  const path = '/foos/5/10';

  const config = {
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
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath(path, config)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state, config), config)).toEqual(
    state
  );
});

it('handle 2 optional params at the end v3', () => {
  const path = '/foos/5/10/15';

  const config = {
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
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath(path, config)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state, config), config)).toEqual(
    state
  );
});

it('handle optional params in the middle v1', () => {
  const path = '/foos/5/10';

  const config = {
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
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath(path, config)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state, config), config)).toEqual(
    state
  );
});

it('handle optional params in the middle v2', () => {
  const path = '/foos/5/10/15';

  const config = {
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
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath(path, config)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state, config), config)).toEqual(
    state
  );
});

it('handle optional params in the middle v3', () => {
  const path = '/foos/5/10/15';

  const config = {
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
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath(path, config)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state, config), config)).toEqual(
    state
  );
});

it('handle optional params in the middle v4', () => {
  const path = '/foos/5/10';

  const config = {
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
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath(path, config)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state, config), config)).toEqual(
    state
  );
});

it('handle optional params in the middle v5', () => {
  const path = '/foos/5/10/15';

  const config = {
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
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath(path, config)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state, config), config)).toEqual(
    state
  );
});

it('handle optional params in the beginning v1', () => {
  const path = '5/10/foos/15';

  const config = {
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
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath(path, config)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state, config), config)).toEqual(
    state
  );
});

it('handle optional params in the beginning v2', () => {
  const path = '5/10/foos/15';

  const config = {
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
            },
          ],
        },
      },
    ],
  };

  expect(getStateFromPath(path, config)).toEqual(state);
  expect(getStateFromPath(getPathFromState(state, config), config)).toEqual(
    state
  );
});
