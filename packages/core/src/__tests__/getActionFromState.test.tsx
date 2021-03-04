import getActionFromState from '../getActionFromState';

it('gets navigate action from state', () => {
  const state = {
    routes: [
      {
        name: 'foo',
        state: {
          routes: [
            {
              name: 'bar',
              params: { answer: 42 },
              state: {
                routes: [
                  {
                    name: 'qux',
                    params: { author: 'jane' },
                    path: '/foo/bar',
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getActionFromState(state)).toEqual({
    payload: {
      name: 'foo',
      params: {
        params: {
          answer: 42,
          params: {
            author: 'jane',
          },
          screen: 'qux',
          path: '/foo/bar',
          initial: true,
        },
        screen: 'bar',
        initial: true,
      },
    },
    type: 'NAVIGATE',
  });
});

it('gets navigate action from state for top-level screen', () => {
  const state = {
    routes: [
      {
        name: 'foo',
        params: { answer: 42 },
        path: '/foo/bar',
      },
    ],
  };

  expect(getActionFromState(state)).toEqual({
    payload: {
      name: 'foo',
      params: { answer: 42 },
      path: '/foo/bar',
    },
    type: 'NAVIGATE',
  });
});

it('gets reset action from state with 1 route with key at root', () => {
  const state = {
    routes: [
      {
        name: 'foo',
        key: 'test',
        state: {
          routes: [
            {
              name: 'bar',
              state: {
                routes: [
                  {
                    key: 'test',
                    name: 'qux',
                    params: { author: 'jane' },
                    path: '/foo/bar',
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getActionFromState(state)).toEqual({
    payload: {
      routes: [
        {
          key: 'test',
          name: 'foo',
          state: {
            routes: [
              {
                name: 'bar',
                state: {
                  routes: [
                    {
                      key: 'test',
                      name: 'qux',
                      params: { author: 'jane' },
                      path: '/foo/bar',
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
    type: 'RESET',
  });
});

it('gets reset action from state for top-level screen with 2 screens', () => {
  const state = {
    routes: [
      {
        name: 'foo',
        params: { answer: 42 },
      },
      {
        name: 'bar',
        params: { author: 'jane' },
        path: '/foo/bar',
      },
    ],
  };

  expect(getActionFromState(state)).toEqual({
    payload: {
      routes: [
        {
          name: 'foo',
          params: { answer: 42 },
        },
        {
          name: 'bar',
          params: { author: 'jane' },
          path: '/foo/bar',
        },
      ],
    },
    type: 'RESET',
  });
});

it('gets reset action from state for top-level screen with more than 2 screens with config', () => {
  const state = {
    routes: [
      {
        name: 'foo',
        params: { answer: 42 },
      },
      {
        name: 'bar',
        params: { author: 'jane' },
      },
      { name: 'baz' },
    ],
  };

  const config = {
    initialRouteName: 'foo',
    screens: {
      bar: 'bar',
    },
  };

  expect(getActionFromState(state, config)).toEqual({
    payload: {
      routes: [
        {
          name: 'foo',
          params: { answer: 42 },
        },
        {
          name: 'bar',
          params: { author: 'jane' },
        },
        { name: 'baz' },
      ],
    },
    type: 'RESET',
  });
});

it('gets reset action from state for top-level screen with 2 screens with config', () => {
  const state = {
    routes: [
      {
        name: 'foo',
        params: { answer: 42 },
      },
      {
        name: 'bar',
        key: 'test',
        params: { author: 'jane' },
        path: '/foo/bar',
      },
    ],
  };

  const config = {
    initialRouteName: 'foo',
    screens: {
      bar: 'bar',
    },
  };

  expect(getActionFromState(state, config)).toEqual({
    payload: {
      routes: [
        {
          name: 'foo',
          params: { answer: 42 },
        },
        {
          name: 'bar',
          key: 'test',
          params: { author: 'jane' },
          path: '/foo/bar',
        },
      ],
    },
    type: 'RESET',
  });
});

it('gets navigate action from state for top-level screen with 2 screens with config', () => {
  const state = {
    routes: [
      {
        name: 'foo',
        params: { answer: 42 },
      },
      {
        name: 'bar',
        params: { author: 'jane' },
        path: '/foo/bar',
      },
    ],
  };

  const config = {
    initialRouteName: 'foo',
    screens: {
      bar: 'bar',
    },
  };

  expect(getActionFromState(state, config)).toEqual({
    payload: {
      name: 'bar',
      params: { author: 'jane' },
      path: '/foo/bar',
    },
    type: 'NAVIGATE',
  });
});

it('gets navigate action from state for top-level screen with more than 2 screens with config with lower index', () => {
  const state = {
    index: 1,
    routes: [
      {
        name: 'foo',
        params: { answer: 42 },
      },
      {
        name: 'bar',
        params: { author: 'jane' },
        path: '/foo/bar',
      },
      { name: 'baz' },
    ],
  };

  const config = {
    initialRouteName: 'foo',
    screens: {
      bar: 'bar',
    },
  };

  expect(getActionFromState(state, config)).toEqual({
    payload: {
      name: 'bar',
      params: { author: 'jane' },
      path: '/foo/bar',
    },
    type: 'NAVIGATE',
  });
});

it('gets navigate action from state with 2 screens', () => {
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
                    name: 'qux',
                    params: { author: 'jane' },
                  },
                  { name: 'quz', path: '/foo/bar' },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getActionFromState(state)).toEqual({
    payload: {
      name: 'foo',
      params: {
        screen: 'bar',
        initial: true,
        params: {
          state: {
            routes: [
              {
                name: 'qux',
                params: {
                  author: 'jane',
                },
              },
              { name: 'quz', path: '/foo/bar' },
            ],
          },
        },
      },
    },
    type: 'NAVIGATE',
  });
});

it('gets navigate action from state with 2 screens with lower index', () => {
  const state = {
    routes: [
      {
        name: 'foo',
        state: {
          routes: [
            {
              name: 'bar',
              state: {
                index: 0,
                routes: [
                  {
                    name: 'qux',
                    params: { author: 'jane' },
                    path: '/foo/bar',
                  },
                  { name: 'quz' },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getActionFromState(state)).toEqual({
    payload: {
      name: 'foo',
      params: {
        screen: 'bar',
        initial: true,
        params: {
          screen: 'qux',
          initial: true,
          params: {
            author: 'jane',
          },
          path: '/foo/bar',
        },
      },
    },
    type: 'NAVIGATE',
  });
});

it('gets navigate action from state with more than 2 screens', () => {
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
                    name: 'qux',
                    params: { author: 'jane' },
                  },
                  { name: 'quz' },
                  { name: 'qua' },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getActionFromState(state)).toEqual({
    payload: {
      name: 'foo',
      params: {
        screen: 'bar',
        initial: true,
        params: {
          state: {
            routes: [
              {
                name: 'qux',
                params: {
                  author: 'jane',
                },
              },
              { name: 'quz' },
              { name: 'qua' },
            ],
          },
        },
      },
    },
    type: 'NAVIGATE',
  });
});

it('gets navigate action from state with config', () => {
  const state = {
    routes: [
      {
        name: 'foo',
        state: {
          routes: [
            {
              name: 'bar',
              params: { answer: 42 },
              state: {
                routes: [
                  {
                    name: 'qux',
                    params: { author: 'jane' },
                    path: '/foo/bar',
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  const config = {
    screens: {
      foo: {
        initialRouteName: 'bar',
        screens: {
          bar: {
            initialRouteName: 'qux',
          },
        },
      },
    },
  };

  expect(getActionFromState(state, config)).toEqual({
    payload: {
      name: 'foo',
      params: {
        params: {
          answer: 42,
          params: {
            author: 'jane',
          },
          screen: 'qux',
          path: '/foo/bar',
          initial: true,
        },
        screen: 'bar',
        initial: true,
      },
    },
    type: 'NAVIGATE',
  });
});

it('gets navigate action from state for top-level screen with config', () => {
  const state = {
    routes: [
      {
        name: 'foo',
        params: { answer: 42 },
        path: '/foo/bar',
      },
    ],
  };

  const config = {
    screens: {
      initialRouteName: 'bar',
      foo: {
        path: 'some-path/:answer',
        parse: {
          answer: Number,
        },
      },
    },
  };

  expect(getActionFromState(state, config)).toEqual({
    payload: {
      name: 'foo',
      params: { answer: 42 },
      path: '/foo/bar',
    },
    type: 'NAVIGATE',
  });
});

it('gets navigate action from state with 2 screens including initial route and with config', () => {
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
                    name: 'qux',
                    params: { author: 'jane' },
                  },
                  { name: 'quz', path: '/foo/bar' },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  const config = {
    screens: {
      foo: {
        initialRouteName: 'bar',
        screens: {
          bar: {
            initialRouteName: 'qux',
          },
        },
      },
    },
  };

  expect(getActionFromState(state, config)).toEqual({
    payload: {
      name: 'foo',
      params: {
        initial: true,
        screen: 'bar',
        params: {
          screen: 'quz',
          initial: false,
          path: '/foo/bar',
        },
      },
    },
    type: 'NAVIGATE',
  });
});

it('gets navigate action from state with 2 screens without initial route and with config', () => {
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
                    name: 'qux',
                    params: { author: 'jane' },
                  },
                  { name: 'quz', path: '/foo/bar' },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  const config = {
    screens: {
      foo: {
        initialRouteName: 'bar',
        screens: {
          bar: {
            initialRouteName: 'quz',
          },
        },
      },
    },
  };

  expect(getActionFromState(state, config)).toEqual({
    payload: {
      name: 'foo',
      params: {
        initial: true,
        screen: 'bar',
        params: {
          state: {
            routes: [
              {
                name: 'qux',
                params: {
                  author: 'jane',
                },
              },
              { name: 'quz', path: '/foo/bar' },
            ],
          },
        },
      },
    },
    type: 'NAVIGATE',
  });
});

it('gets navigate action from state with 2 screens including route with key on initial route and with config', () => {
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
                    key: 'test',
                    name: 'qux',
                    params: { author: 'jane' },
                  },
                  { name: 'quz' },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  const config = {
    screens: {
      foo: {
        initialRouteName: 'bar',
        screens: {
          bar: {
            initialRouteName: 'qux',
          },
        },
      },
    },
  };

  expect(getActionFromState(state, config)).toEqual({
    payload: {
      name: 'foo',
      params: {
        initial: true,
        screen: 'bar',
        params: {
          state: {
            routes: [
              {
                key: 'test',
                name: 'qux',
                params: {
                  author: 'jane',
                },
              },
              { name: 'quz' },
            ],
          },
        },
      },
    },
    type: 'NAVIGATE',
  });
});

it('gets navigate action from state with 2 screens including route with key on 2nd route and with config', () => {
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
                    name: 'qux',
                    params: { author: 'jane' },
                  },
                  {
                    key: 'test',
                    name: 'quz',
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  const config = {
    screens: {
      foo: {
        initialRouteName: 'bar',
        screens: {
          bar: {
            initialRouteName: 'qux',
          },
        },
      },
    },
  };

  expect(getActionFromState(state, config)).toEqual({
    payload: {
      name: 'foo',
      params: {
        initial: true,
        screen: 'bar',
        params: {
          state: {
            routes: [
              {
                name: 'qux',
                params: {
                  author: 'jane',
                },
              },
              {
                key: 'test',
                name: 'quz',
              },
            ],
          },
        },
      },
    },
    type: 'NAVIGATE',
  });
});

it('gets navigate action from state with more than 2 screens and with config', () => {
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
                    name: 'qux',
                    params: { author: 'jane' },
                  },
                  { name: 'quz' },
                  { name: 'qua' },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  const config = {
    screens: {
      foo: {
        initialRouteName: 'bar',
        screens: {
          bar: {
            initialRouteName: 'qux',
          },
        },
      },
    },
  };

  expect(getActionFromState(state, config)).toEqual({
    payload: {
      name: 'foo',
      params: {
        initial: true,
        screen: 'bar',
        params: {
          state: {
            routes: [
              {
                name: 'qux',
                params: {
                  author: 'jane',
                },
              },
              { name: 'quz' },
              { name: 'qua' },
            ],
          },
        },
      },
    },
    type: 'NAVIGATE',
  });
});

it('gets navigate action from state with more than 2 screens with lower index', () => {
  const state = {
    routes: [
      {
        name: 'foo',
        state: {
          routes: [
            {
              name: 'bar',
              state: {
                index: 1,
                routes: [
                  { name: 'quu' },
                  {
                    name: 'qux',
                    params: { author: 'jane' },
                    path: '/foo/bar',
                  },
                  { name: 'quz' },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  const config = {
    screens: {
      foo: {
        initialRouteName: 'bar',
        screens: {
          bar: {
            initialRouteName: 'quu',
          },
        },
      },
    },
  };

  expect(getActionFromState(state, config)).toEqual({
    payload: {
      name: 'foo',
      params: {
        screen: 'bar',
        initial: true,
        params: {
          screen: 'qux',
          initial: false,
          path: '/foo/bar',
          params: {
            author: 'jane',
          },
        },
      },
    },
    type: 'NAVIGATE',
  });
});

it("doesn't return action if no routes are provided'", () => {
  expect(getActionFromState({ routes: [] })).toBe(undefined);
});

it('gets undefined action from state', () => {
  const state = {
    routes: [
      {
        name: 'foo',
        state: {
          routes: [
            {
              name: 'bar',
              state: {
                routes: [],
              },
            },
          ],
        },
      },
    ],
  };

  expect(getActionFromState(state)).toBe(undefined);
  expect(getActionFromState({ routes: [] })).toBe(undefined);
});
