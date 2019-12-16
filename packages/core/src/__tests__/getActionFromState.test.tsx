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
    payload: state,
    type: 'RESET_ROOT',
  });
});
