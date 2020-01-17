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
  const path = '/few/bar/sweet/apple/baz/jane?count=10&answer=42&valid=true';
  const config = {
    Foo: 'few',
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
  const path = '/few/bar/sweet/apple/baz/jane?count=10&answer=42&valid=true';
  const config = {
    Foo: {
      Foe: 'few',
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
  const path = '/few/baz/jane?count=10&answer=42&valid=true';
  const config = {
    Foo: {
      Foe: 'few',
    },
    Baz: {
      path: 'baz/:author',
      parse: {
        author: (author: string) => author.replace(/^\w/, c => c.toUpperCase()),
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
  const path = '/bar/sweet/apple/few/bis/jane?count=10&answer=42&valid=true';
  const config = {
    Foo: {
      Foe: 'few',
    },
    Bar: 'bar/:type/:fruit',
    Baz: {
      Bos: 'bos',
      Bis: {
        path: 'bis/:author',
        parse: {
          author: (author: string) =>
            author.replace(/^\w/, c => c.toUpperCase()),
          count: Number,
          valid: Boolean,
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
      Foe: 'foe',
      Bar: {
        Baz: 'baz',
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
      Foe: 'foe',
      Bar: {
        path: 'bar/:id',
        parse: {
          id: Number,
        },
        stringify: {
          id: (id: number) => `id=${id}`,
        },
        Baz: 'baz',
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
