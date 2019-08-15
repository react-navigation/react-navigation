import getPathFromState from '../getPathFromState';

it('converts path string to initial state', () => {
  expect(
    getPathFromState({
      routes: [
        {
          name: 'foo',
          state: {
            index: 1,
            routes: [
              { name: 'boo' },
              {
                name: 'bar',
                state: {
                  routes: [
                    {
                      name: 'baz qux',
                      params: { author: 'jane & co', valid: true },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    })
  ).toMatchInlineSnapshot(
    `"/foo/bar/baz%20qux?author=%22jane%20%26%20co%22&valid=true"`
  );
});

it('handles route without param', () => {
  expect(
    getPathFromState({
      routes: [
        {
          name: 'foo',
          state: {
            routes: [{ name: 'bar' }],
          },
        },
      ],
    })
  ).toBe('/foo/bar');
});
