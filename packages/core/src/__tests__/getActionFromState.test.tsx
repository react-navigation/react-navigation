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
      },
    ],
  };

  expect(getActionFromState(state)).toEqual({
    payload: {
      name: 'foo',
      params: { answer: 42 },
    },
    type: 'NAVIGATE',
  });
});

it('gets navigate action from state for top-level screen with 2 screens', () => {
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
    },
    type: 'NAVIGATE',
  });
});

it('gets navigate action from state for top-level screen with more than 2 screens with config', () => {
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
          state: {
            routes: [
              {
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
          screen: 'quz',
          initial: false,
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
              { name: 'quz' },
            ],
          },
        },
      },
    },
    type: 'NAVIGATE',
  });
});

it('gets navigate action from state with 2 screens including route with key and with config', () => {
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

it('gets reset action from state', () => {
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
