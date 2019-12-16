import getStateFromPath from '../getStateFromPath';

it('converts path string to initial state', () => {
  expect(
    getStateFromPath('foo/bar/baz%20qux?author=jane%20%26%20co&valid=true')
  ).toEqual({
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
  });
});

it('converts path string to initial state with config', () => {
  expect(
    getStateFromPath(
      '/few/bar/sweet/apple/baz/jane?count=10&answer=42&valid=true',
      {
        Foo: 'few',
        Bar: 'bar/:type/:fruit',
        Baz: {
          path: 'baz/:author',
          parse: {
            author: (author: string) =>
              author.replace(/^\w/, c => c.toUpperCase()),
            count: Number,
            valid: Boolean,
          },
        },
      }
    )
  ).toEqual({
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
  });
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
  expect(getStateFromPath('foo/bar')).toEqual({
    routes: [
      {
        name: 'foo',
        state: {
          routes: [{ name: 'bar' }],
        },
      },
    ],
  });
});

it('returns undefined for invalid path', () => {
  expect(getStateFromPath('//')).toBe(undefined);
});

it('converts path string to initial state with config with nested screens', () => {
  expect(
    getStateFromPath(
      '/few/bar/sweet/apple/baz/jane?count=10&answer=42&valid=true',
      {
        Foo: {
          Foe: 'few',
        },
        Bar: 'bar/:type/:fruit',
        Baz: {
          path: 'baz/:author',
          parse: {
            author: (author: string) =>
              author.replace(/^\w/, c => c.toUpperCase()),
            count: Number,
            valid: Boolean,
          },
        },
      }
    )
  ).toEqual({
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
  });
});

it('converts path string to initial state with config with nested screens and unused configs', () => {
  expect(
    getStateFromPath('/few/baz/jane?count=10&answer=42&valid=true', {
      Foo: {
        Foe: 'few',
      },
      Baz: {
        path: 'baz/:author',
        parse: {
          author: (author: string) =>
            author.replace(/^\w/, c => c.toUpperCase()),
          count: Number,
          valid: Boolean,
        },
      },
    })
  ).toEqual({
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
  });
});

it('handles parse in nested object with parse in it', () => {
  expect(
    getStateFromPath(
      '/bar/sweet/apple/few/bis/jane?count=10&answer=42&valid=true',
      {
        Foo: {
          Foe: 'few',
        },
        Bar: 'bar/:type/:fruit',
        Baz: {
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
      }
    )
  ).toEqual({
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
  });
});

it('handles parse in nested object for second route depth', () => {
  expect(
    getStateFromPath('/baz', {
      Foo: {
        path: 'foo',
        Foe: 'foe',
        Bar: {
          Baz: 'baz',
        },
      },
    })
  ).toEqual({
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
  });
});

it('handles parse in nested object for second route depth and and path and parse in roots', () => {
  expect(
    getStateFromPath('/baz', {
      Foo: {
        path: 'foo/:id',
        parse: {
          id: Number,
        },
        Foe: 'foe',
        Bar: {
          path: 'bar/:id',
          parse: {
            id: Number,
          },
          Baz: 'baz',
        },
      },
    })
  ).toEqual({
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
  });
});
