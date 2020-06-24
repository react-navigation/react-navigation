import type { NavigationState, PartialState } from '@react-navigation/routers';
import getPathFromState from '../getPathFromState';
import getStateFromPath from '../getStateFromPath';

type State = PartialState<NavigationState>;

it('converts state to path string', () => {
  const state = {
    routes: [
      {
        name: 'foo',
        state: {
          index: 1,
          routes: [
            { name: 'boo' },
            {
              name: 'bar',
              params: { fruit: 'apple' },
              state: {
                routes: [
                  {
                    name: 'baz qux',
                    params: { author: 'jane', valid: true },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  const path = '/foo/bar/baz%20qux?author=jane&valid=true';

  expect(getPathFromState(state)).toBe(path);
  expect(getPathFromState(getStateFromPath(path) as State)).toBe(path);
});

it('converts state to path string with config', () => {
  const path = '/few/bar/sweet/apple/baz/jane?id=x10&valid=true';
  const config = {
    screens: {
      Foo: {
        path: 'few',
        screens: {
          Bar: {
            path: 'bar/:type/:fruit',
            screens: {
              Baz: {
                path: 'baz/:author',
                parse: {
                  author: (author: string) =>
                    author.replace(/^\w/, (c) => c.toUpperCase()),
                  id: (id: string) => Number(id.replace(/^x/, '')),
                  valid: Boolean,
                },
                stringify: {
                  author: (author: string) => author.toLowerCase(),
                  id: (id: number) => `x${id}`,
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
          index: 1,
          routes: [
            { name: 'boo' },
            {
              name: 'Bar',
              params: { fruit: 'apple', type: 'sweet', avaliable: false },
              state: {
                routes: [
                  {
                    name: 'Baz',
                    params: { author: 'Jane', valid: true, id: 10 },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getPathFromState(state, config)).toBe(path);
  expect(
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('converts state to path string with config (legacy)', () => {
  const path = '/few/bar/sweet/apple/baz/jane?id=x10&valid=true';
  const config = {
    Foo: 'few',
    Bar: 'bar/:type/:fruit',
    Baz: {
      path: 'baz/:author',
      parse: {
        author: (author: string) =>
          author.replace(/^\w/, (c) => c.toUpperCase()),
        id: (id: string) => Number(id.replace(/^x/, '')),
        valid: Boolean,
      },
      stringify: {
        author: (author: string) => author.toLowerCase(),
        id: (id: number) => `x${id}`,
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
            { name: 'boo' },
            {
              name: 'Bar',
              params: { fruit: 'apple', type: 'sweet', avaliable: false },
              state: {
                routes: [
                  {
                    name: 'Baz',
                    params: { author: 'Jane', valid: true, id: 10 },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  // @ts-expect-error
  expect(getPathFromState(state, config)).toBe(path);
  expect(
    // @ts-expect-error
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('handles route without param', () => {
  const path = '/foo/bar';
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

  expect(getPathFromState(state)).toBe(path);
  expect(getPathFromState(getStateFromPath(path) as State)).toBe(path);
});

it("doesn't add query param for empty params", () => {
  const path = '/foo';
  const state = {
    routes: [
      {
        name: 'foo',
        params: {},
      },
    ],
  };

  expect(getPathFromState(state)).toBe(path);
  expect(getPathFromState(getStateFromPath(path) as State)).toBe(path);
});

it('handles state with config with nested screens', () => {
  const path =
    '/foo/foe/bar/sweet/apple/baz/jane?answer=42&count=10&valid=true';
  const config = {
    screens: {
      Foo: {
        path: 'foo',
        screens: {
          Foe: {
            path: 'foe',
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
                      id: (id: number) => `x${id}`,
                      unknown: (_: unknown) => 'x',
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
                            count: '10',
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

  expect(getPathFromState(state, config)).toBe(path);
  expect(
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('handles state with config with nested screens (legacy)', () => {
  const path =
    '/foo/foe/bar/sweet/apple/baz/jane?answer=42&count=10&valid=true';
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
        id: (id: number) => `x${id}`,
        unknown: (_: unknown) => 'x',
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
                            count: '10',
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

  // @ts-expect-error
  expect(getPathFromState(state, config)).toBe(path);
  expect(
    // @ts-expect-error
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('handles state with config with nested screens and exact', () => {
  const path = '/foe/bar/sweet/apple/baz/jane?answer=42&count=10&valid=true';
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
                      id: (id: number) => `x${id}`,
                      unknown: (_: unknown) => 'x',
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
                            count: '10',
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

  expect(getPathFromState(state, config)).toBe(path);
  expect(
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('handles state with config with nested screens and exact (legacy)', () => {
  const path = '/foe/bar/sweet/apple/baz/jane?answer=42&count=10&valid=true';
  const config = {
    Foo: {
      path: 'foo',
      screens: {
        Foe: {
          path: 'foe',
          exact: true,
        },
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
        id: (id: number) => `x${id}`,
        unknown: (_: unknown) => 'x',
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
                            count: '10',
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

  // @ts-expect-error
  expect(getPathFromState(state, config)).toBe(path);
  expect(
    // @ts-expect-error
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('handles state with config with nested screens and unused configs', () => {
  const path = '/foo/foe/baz/jane?answer=42&count=10&valid=true';
  const config = {
    screens: {
      Foo: {
        path: 'foo',
        screens: {
          Foe: {
            path: 'foe',
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
                  author: (author: string) =>
                    author.replace(/^\w/, (c) => c.toLowerCase()),
                  unknown: (_: unknown) => 'x',
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
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getPathFromState(state, config)).toBe(path);
  expect(
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('handles state with config with nested screens and unused configs (legacy)', () => {
  const path = '/foo/foe/baz/jane?answer=42&count=10&valid=true';
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
      },
      stringify: {
        author: (author: string) =>
          author.replace(/^\w/, (c) => c.toLowerCase()),
        unknown: (_: unknown) => 'x',
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

  // @ts-expect-error
  expect(getPathFromState(state, config)).toBe(path);
  expect(
    // @ts-expect-error
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('handles state with config with nested screens and unused configs with exact', () => {
  const path = '/foe/baz/jane?answer=42&count=10&valid=true';
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
                },
                stringify: {
                  author: (author: string) =>
                    author.replace(/^\w/, (c) => c.toLowerCase()),
                  unknown: (_: unknown) => 'x',
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
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getPathFromState(state, config)).toBe(path);
  expect(
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('handles state with config with nested screens and unused configs with exact (legacy)', () => {
  const path = '/foe/baz/jane?answer=42&count=10&valid=true';
  const config = {
    Foo: {
      path: 'foo',
      screens: {
        Foe: {
          path: 'foe',
          exact: true,
        },
      },
    },
    Baz: {
      path: 'baz/:author',
      parse: {
        author: (author: string) =>
          author.replace(/^\w/, (c) => c.toUpperCase()),
        count: Number,
        valid: Boolean,
      },
      stringify: {
        author: (author: string) =>
          author.replace(/^\w/, (c) => c.toLowerCase()),
        unknown: (_: unknown) => 'x',
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

  // @ts-expect-error
  expect(getPathFromState(state, config)).toBe(path);
  expect(
    // @ts-expect-error
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('handles nested object with stringify in it', () => {
  const path = '/bar/sweet/apple/foo/bis/jane?answer=42&count=10&valid=true';
  const config = {
    screens: {
      Bar: {
        path: 'bar/:type/:fruit',
        screens: {
          Foo: {
            path: 'foo',
            screens: {
              Foe: {
                path: 'foe',
              },
              Baz: {
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
  };

  expect(getPathFromState(state, config)).toBe(path);
  expect(
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('handles nested object with stringify in it (legacy)', () => {
  const path = '/bar/sweet/apple/foo/bis/jane?answer=42&count=10&valid=true';
  const config = {
    Foo: {
      path: 'foo',
      screens: {
        Foe: {
          path: 'foe',
        },
      },
    },
    Bar: 'bar/:type/:fruit',
    Baz: {
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
  };

  // @ts-expect-error
  expect(getPathFromState(state, config)).toBe(path);
  expect(
    // @ts-expect-error
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('handles nested object with stringify in it with exact', () => {
  const path = '/bis/jane?answer=42&count=10&valid=true';
  const config = {
    screens: {
      Bar: {
        path: 'bar/:type/:fruit',
        screens: {
          Foo: {
            path: 'foo',
            screens: {
              Foe: {
                path: 'foe',
              },
              Baz: {
                path: 'baz',
                screens: {
                  Bos: 'bos',
                  Bis: {
                    path: 'bis/:author',
                    exact: true,
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
  };

  expect(getPathFromState(state, config)).toBe(path);
  expect(
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('handles nested object with stringify in it with exact (legacy)', () => {
  const path = '/bar/sweet/apple/foo/bis/jane?answer=42&count=10&valid=true';
  const config = {
    Foo: {
      path: 'foo',
      screens: {
        Foe: {
          path: 'foe',
        },
      },
    },
    Bar: 'bar/:type/:fruit',
    Baz: {
      path: 'baz',
      screens: {
        Bos: 'bos',
        Bis: {
          path: 'bis/:author',
          exact: true,
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
  };

  // @ts-expect-error
  expect(getPathFromState(state, config)).toBe(path);
  expect(
    // @ts-expect-error
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('handles nested object for second route depth', () => {
  const path = '/foo/bar/baz';
  const config = {
    screens: {
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

  expect(getPathFromState(state, config)).toBe(path);
  expect(
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('handles nested object for second route depth with exact', () => {
  const path = '/baz';
  const config = {
    screens: {
      Foo: {
        path: 'foo',
        screens: {
          Foe: 'foe',
          Bar: {
            path: 'bar',
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
                routes: [{ name: 'Baz' }],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getPathFromState(state, config)).toBe(path);
  expect(
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('handles nested object for second route depth and path and stringify in roots', () => {
  const path = '/foo/dathomir/bar/42/baz';
  const config = {
    screens: {
      Foo: {
        path: 'foo/:planet',
        stringify: {
          id: (id: number) => `planet=${id}`,
        },
        screens: {
          Foe: 'foe',
          Bar: {
            path: 'bar/:id',
            parse: {
              id: Number,
            },
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
        params: { planet: 'dathomir' },
        state: {
          routes: [
            {
              name: 'Bar',
              state: {
                routes: [{ name: 'Baz', params: { id: 42 } }],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getPathFromState(state, config)).toBe(path);
  expect(
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('handles nested object for second route depth and path and stringify in roots with exact', () => {
  const path = '/baz';
  const config = {
    screens: {
      Foo: {
        path: 'foo/:id',
        stringify: {
          id: (id: number) => `id=${id}`,
        },
        screens: {
          Foe: 'foe',
          Bar: {
            path: 'bar/:id',
            stringify: {
              id: (id: number) => `id=${id}`,
            },
            parse: {
              id: Number,
            },
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
                routes: [{ name: 'Baz' }],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getPathFromState(state, config)).toBe(path);
  expect(
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('ignores empty string paths', () => {
  const path = '/bar';
  const config = {
    screens: {
      Foo: {
        path: '',
        screens: {
          Foe: 'foe',
        },
      },
      Bar: 'bar',
    },
  };

  const state = {
    routes: [
      {
        name: 'Foo',
        state: {
          routes: [{ name: 'Bar' }],
        },
      },
    ],
  };

  expect(getPathFromState(state, config)).toBe(path);
  expect(
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('keeps query params if path is empty', () => {
  const path = '/?foo=42';
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
                routes: [{ name: 'Qux', params: { foo: 42 } }],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getPathFromState(state, config)).toBe(path);
  expect(
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toEqual(path);
});

it('cuts nested configs too', () => {
  const path = '/foo/baz';
  const config = {
    screens: {
      Foo: {
        path: 'foo',
        screens: {
          Bar: {
            path: '',
            screens: {
              Baz: {
                path: 'baz',
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
                routes: [{ name: 'Baz' }],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getPathFromState(state, config)).toBe(path);
  expect(
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('cuts nested configs too (legacy)', () => {
  const path = '/foo/baz';
  const config = {
    Foo: {
      path: 'foo',
      screens: {
        Bar: '',
      },
    },
    Baz: {
      path: 'baz',
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

  // @ts-expect-error
  expect(getPathFromState(state, config)).toBe(path);
  expect(
    // @ts-expect-error
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('cuts nested configs too with exact', () => {
  const path = '/baz';
  const config = {
    screens: {
      Foo: {
        path: 'foo',
        screens: {
          Bar: {
            path: '',
            exact: true,
            screens: {
              Baz: {
                path: 'baz',
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
                routes: [{ name: 'Baz' }],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getPathFromState(state, config)).toBe(path);
  expect(
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('handles empty path at the end', () => {
  const path = '/foo/bar';
  const config = {
    screens: {
      Foo: {
        path: 'foo',
        screens: {
          Bar: 'bar',
        },
      },
      Baz: { path: '' },
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

  expect(getPathFromState(state, config)).toBe(path);
  expect(
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('returns "/" for empty path', () => {
  const path = '/';

  const config = {
    screens: {
      Foo: {
        path: '',
        screens: {
          Bar: '',
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
            },
          ],
        },
      },
    ],
  };

  expect(getPathFromState(state, config)).toBe(path);
  expect(
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('parses no path specified', () => {
  const path = '/bar';
  const config = {
    screens: {
      Foo: {
        screens: {
          Foe: {},
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
          routes: [{ name: 'Bar' }],
        },
      },
    ],
  };

  expect(getPathFromState(state, config)).toBe(path);
  expect(
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('parses no path specified (legacy)', () => {
  const path = '/Foo/bar';
  const config = {
    Foo: {
      screens: {
        Foe: {},
      },
    },
    Bar: 'bar',
  };

  const state = {
    routes: [
      {
        name: 'Foo',
        state: {
          routes: [{ name: 'Bar' }],
        },
      },
    ],
  };

  // @ts-expect-error
  expect(getPathFromState(state, config)).toBe(path);
  expect(
    // @ts-expect-error
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('parses no path specified in nested config', () => {
  const path = '/Foo/Foe/bar';
  const config = {
    Foo: {
      path: 'foo',
      screens: {
        Foe: {},
      },
    },
    Bar: 'bar',
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
                routes: [{ name: 'Bar' }],
              },
            },
          ],
        },
      },
    ],
  };

  // @ts-expect-error
  expect(getPathFromState(state, config)).toBe(path);
  expect(
    // @ts-expect-error
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('strips undefined query params', () => {
  const path = '/bar/sweet/apple/foo/bis/jane?count=10&valid=true';
  const config = {
    screens: {
      Bar: {
        path: 'bar/:type/:fruit',
        screens: {
          Foo: {
            path: 'foo',
            screens: {
              Foe: {
                path: 'foe',
              },
              Baz: {
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
                    name: 'Baz',
                    state: {
                      routes: [
                        {
                          name: 'Bis',
                          params: {
                            author: 'Jane',
                            count: 10,
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

  expect(getPathFromState(state, config)).toBe(path);
  expect(
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('strips undefined query params (legacy)', () => {
  const path = '/bar/sweet/apple/foo/bis/jane?count=10&valid=true';
  const config = {
    Foo: {
      path: 'foo',
      screens: {
        Foe: {
          path: 'foe',
        },
      },
    },
    Bar: 'bar/:type/:fruit',
    Baz: {
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
                    name: 'Baz',
                    state: {
                      routes: [
                        {
                          name: 'Bis',
                          params: {
                            author: 'Jane',
                            count: 10,
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

  // @ts-expect-error
  expect(getPathFromState(state, config)).toBe(path);
  expect(
    // @ts-expect-error
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('strips undefined query params with exact', () => {
  const path = '/bis/jane?count=10&valid=true';
  const config = {
    screens: {
      Bar: {
        path: 'bar/:type/:fruit',
        screens: {
          Foo: {
            path: 'foo',
            screens: {
              Foe: {
                path: 'foe',
              },
              Baz: {
                screens: {
                  Bos: 'bos',
                  Bis: {
                    path: 'bis/:author',
                    exact: true,
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
                    name: 'Baz',
                    state: {
                      routes: [
                        {
                          name: 'Bis',
                          params: {
                            author: 'Jane',
                            count: 10,
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

  expect(getPathFromState(state, config)).toBe(path);
  expect(
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('strips undefined query params with exact (legacy)', () => {
  const path = '/bar/sweet/apple/foo/bis/jane?count=10&valid=true';
  const config = {
    Foo: {
      path: 'foo',
      screens: {
        Foe: {
          path: 'foe',
        },
      },
    },
    Bar: 'bar/:type/:fruit',
    Baz: {
      path: 'baz',
      screens: {
        Bos: 'bos',
        Bis: {
          path: 'bis/:author',
          exact: true,
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
                    name: 'Baz',
                    state: {
                      routes: [
                        {
                          name: 'Bis',
                          params: {
                            author: 'Jane',
                            count: 10,
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

  // @ts-expect-error
  expect(getPathFromState(state, config)).toBe(path);
  expect(
    // @ts-expect-error
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('handles stripping all query params', () => {
  const path = '/bar/sweet/apple/foo/bis/jane';
  const config = {
    screens: {
      Bar: {
        path: 'bar/:type/:fruit',
        screens: {
          Foo: {
            path: 'foo',
            screens: {
              Foe: {
                path: 'foe',
              },
              Baz: {
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
                    name: 'Baz',
                    state: {
                      routes: [
                        {
                          name: 'Bis',
                          params: {
                            author: 'Jane',
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

  expect(getPathFromState(state, config)).toBe(path);
  expect(
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('handles stripping all query params (legacy)', () => {
  const path = '/bar/sweet/apple/foo/bis/jane';
  const config = {
    Foo: {
      path: 'foo',
      screens: {
        Foe: {
          path: 'foe',
        },
      },
    },
    Bar: 'bar/:type/:fruit',
    Baz: {
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
                    name: 'Baz',
                    state: {
                      routes: [
                        {
                          name: 'Bis',
                          params: {
                            author: 'Jane',
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

  // @ts-expect-error
  expect(getPathFromState(state, config)).toBe(path);
  expect(
    // @ts-expect-error
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('handles stripping all query params with exact', () => {
  const path = '/bis/jane';
  const config = {
    screens: {
      Bar: {
        path: 'bar/:type/:fruit',
        screens: {
          Foo: {
            path: 'foo',
            screens: {
              Foe: {
                path: 'foe',
              },
              Baz: {
                path: 'baz',
                screens: {
                  Bos: 'bos',
                  Bis: {
                    path: 'bis/:author',
                    exact: true,
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
                    name: 'Baz',
                    state: {
                      routes: [
                        {
                          name: 'Bis',
                          params: {
                            author: 'Jane',
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

  expect(getPathFromState(state, config)).toBe(path);
  expect(
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('handles stripping all query params with exact (legacy)', () => {
  const path = '/bar/sweet/apple/foo/bis/jane';
  const config = {
    Foo: {
      path: 'foo',
      screens: {
        Foe: {
          path: 'foe',
        },
      },
    },
    Bar: 'bar/:type/:fruit',
    Baz: {
      path: 'baz',
      screens: {
        Bos: 'bos',
        Bis: {
          path: 'bis/:author',
          exact: true,
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
                    name: 'Baz',
                    state: {
                      routes: [
                        {
                          name: 'Bis',
                          params: {
                            author: 'Jane',
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

  // @ts-expect-error
  expect(getPathFromState(state, config)).toBe(path);
  expect(
    // @ts-expect-error
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('replaces undefined query params', () => {
  const path = '/bar/undefined/apple';
  const config = {
    screens: {
      Bar: 'bar/:type/:fruit',
    },
  };

  const state = {
    routes: [
      {
        name: 'Bar',
        params: { fruit: 'apple' },
      },
    ],
  };

  expect(getPathFromState(state, config)).toBe(path);
  expect(
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('matches wildcard patterns at root', () => {
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
    routes: [{ name: '404' }],
  };

  expect(getPathFromState(state, config)).toBe('/404');
  expect(
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe('/404');
});

it('matches wildcard patterns at nested level', () => {
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
                routes: [{ name: '404' }],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getPathFromState(state, config)).toBe('/bar/42/404');
  expect(
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe('/bar/42/404');
});

it('matches wildcard patterns at nested level with exact', () => {
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
                routes: [{ name: '404' }],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getPathFromState(state, config)).toBe('/404');
  expect(
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe('/404');
});

it('tries to match wildcard patterns at the end', () => {
  const path = '/bar/42/test';
  const config = {
    screens: {
      Foo: {
        screens: {
          Bar: {
            path: '/bar/:id/',
            screens: {
              404: '*',
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
                routes: [{ name: 'Test' }],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getPathFromState(state, config)).toBe(path);
  expect(
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe(path);
});

it('uses nearest parent wildcard match for unmatched paths', () => {
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
          routes: [{ name: '404' }],
        },
      },
    ],
  };

  expect(getPathFromState(state, config)).toBe('/404');
  expect(
    getPathFromState(getStateFromPath(path, config) as State, config)
  ).toBe('/404');
});

it('throws if wildcard is specified with legacy config', () => {
  const config = {
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
  };

  const state = {
    routes: [
      {
        name: 'Foo',
        state: {
          routes: [{ name: '404' }],
        },
      },
    ],
  };

  // @ts-expect-error
  expect(() => getPathFromState(state, config)).toThrow(
    "Please update your config to the new format to use wildcard pattern ('*')"
  );
});

it('supports legacy config', () => {
  const path = '/few/bar/sweet/apple/baz/jane?id=x10&valid=true';
  const config = {
    Foo: 'few',
    Bar: 'bar/:type/:fruit',
    Baz: {
      path: 'baz/:author',
      parse: {
        author: (author: string) =>
          author.replace(/^\w/, (c) => c.toUpperCase()),
        id: (id: string) => Number(id.replace(/^x/, '')),
        valid: Boolean,
      },
      stringify: {
        author: (author: string) => author.toLowerCase(),
        id: (id: number) => `x${id}`,
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
            { name: 'boo' },
            {
              name: 'Bar',
              params: { fruit: 'apple', type: 'sweet', avaliable: false },
              state: {
                routes: [
                  {
                    name: 'Baz',
                    params: { author: 'Jane', valid: true, id: 10 },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  // @ts-expect-error
  expect(getPathFromState(state, config)).toBe(path);
});

it("throws when using 'initialRouteName' or 'screens' with legacy config", () => {
  expect(() =>
    getPathFromState(
      { routes: [] },
      {
        initialRouteName: 'foo',
        // @ts-expect-error
        Foo: 'foo',
        Bar: 'bar/:type/:fruit',
      }
    )
  ).toThrow('Found invalid keys in the configuration object.');

  expect(() =>
    getPathFromState(
      { routes: [] },
      {
        screens: {
          Test: 'test',
        },
        // @ts-expect-error
        Foo: 'foo',
        Bar: 'bar/:type/:fruit',
      }
    )
  ).toThrow('Found invalid keys in the configuration object.');

  expect(() =>
    getPathFromState(
      { routes: [] },
      {
        initialRouteName: 'foo',
        screens: {
          Test: 'test',
        },
        // @ts-expect-error
        Foo: 'foo',
        Bar: 'bar/:type/:fruit',
      }
    )
  ).toThrow('Found invalid keys in the configuration object.');
});
