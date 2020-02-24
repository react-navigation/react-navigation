import getPathFromState from '../getPathFromState';
import getStateFromPath from '../getStateFromPath';

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
  expect(getPathFromState(getStateFromPath(path))).toBe(path);
});

it('converts state to path string with config', () => {
  const path = '/few/bar/sweet/apple/baz/jane?id=x10&valid=true';
  const config = {
    Foo: 'few',
    Bar: 'bar/:type/:fruit',
    Baz: {
      path: 'baz/:author',
      parse: {
        author: (author: string) => author.replace(/^\w/, c => c.toUpperCase()),
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

  expect(getPathFromState(state, config)).toBe(path);
  expect(getPathFromState(getStateFromPath(path, config), config)).toBe(path);
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
  expect(getPathFromState(getStateFromPath(path))).toBe(path);
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
  expect(getPathFromState(getStateFromPath(path))).toBe(path);
});

it('handles state with config with nested screens', () => {
  const path = '/foe/bar/sweet/apple/baz/jane?answer=42&count=10&valid=true';
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
        author: (author: string) => author.replace(/^\w/, c => c.toUpperCase()),
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

  expect(getPathFromState(state, config)).toBe(path);
  expect(getPathFromState(getStateFromPath(path, config), config)).toBe(path);
});

it('handles state with config with nested screens and unused configs', () => {
  const path = '/foe/baz/jane?answer=42&count=10&valid=true';
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
        author: (author: string) => author.replace(/^\w/, c => c.toUpperCase()),
        count: Number,
        valid: Boolean,
      },
      stringify: {
        author: (author: string) => author.replace(/^\w/, c => c.toLowerCase()),
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

  expect(getPathFromState(state, config)).toBe(path);
  expect(getPathFromState(getStateFromPath(path, config), config)).toBe(path);
});

it('handles nested object with stringify in it', () => {
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
          stringify: {
            author: (author: string) =>
              author.replace(/^\w/, c => c.toLowerCase()),
          },
          parse: {
            author: (author: string) =>
              author.replace(/^\w/, c => c.toUpperCase()),
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

  expect(getPathFromState(state, config)).toBe(path);
  expect(getPathFromState(getStateFromPath(path, config), config)).toBe(path);
});

it('handles nested object for second route depth', () => {
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

  expect(getPathFromState(state, config)).toBe(path);
  expect(getPathFromState(getStateFromPath(path, config), config)).toBe(path);
});

it('handles nested object for second route depth and and path and stringify in roots', () => {
  const path = '/baz';
  const config = {
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

  expect(getPathFromState(state, config)).toBe(path);
  expect(getPathFromState(getStateFromPath(path, config), config)).toBe(path);
});

it('ignores empty string paths', () => {
  const path = '/bar';
  const config = {
    Foo: {
      path: '',
      screens: {
        Foe: 'foe',
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

  expect(getPathFromState(state, config)).toBe(path);
  expect(getPathFromState(getStateFromPath(path, config), config)).toBe(path);
});

it('cuts nested configs too', () => {
  const path = '/baz';
  const config = {
    Foo: {
      path: 'foo',
      screens: {
        Bar: '',
      },
    },
    Baz: { path: 'baz' },
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
  expect(getPathFromState(getStateFromPath(path, config), config)).toBe(path);
});

it('handles empty path at the end', () => {
  const path = '/bar';
  const config = {
    Foo: {
      path: 'foo',
      screens: {
        Bar: 'bar',
      },
    },
    Baz: { path: '' },
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
  expect(getPathFromState(getStateFromPath(path, config), config)).toBe(path);
});

it('returns "/" for empty path', () => {
  const config = {
    Foo: {
      path: '',
      screens: {
        Bar: '',
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

  expect(getPathFromState(state, config)).toBe('/');
});
