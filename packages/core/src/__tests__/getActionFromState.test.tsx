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
        },
        screen: 'bar',
      },
    },
    type: 'NAVIGATE',
  });

  expect(
    getActionFromState({
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
    })
  ).toEqual({
    payload: {
      name: 'foo',
      params: {
        screen: 'bar',
        params: {
          screen: 'quz',
        },
      },
    },
    type: 'NAVIGATE',
  });
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
