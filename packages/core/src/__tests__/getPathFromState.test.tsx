import getPathFromState from '../getPathFromState';

it('converts state to path string', () => {
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
    })
  ).toMatchInlineSnapshot(`"/foo/bar/baz%20qux?author=jane&valid=true"`);
});

it('converts state to path string with config', () => {
  expect(
    getPathFromState(
      {
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
      },
      {
        Foo: 'few',
        Bar: 'bar/:type/:fruit',
        Baz: {
          path: 'baz/:author',
          stringify: {
            author: author => author.toLowerCase(),
            id: id => `x${id}`,
          },
        },
      }
    )
  ).toMatchInlineSnapshot(`"/few/bar/sweet/apple/baz/jane?id=x10&valid=true"`);
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
