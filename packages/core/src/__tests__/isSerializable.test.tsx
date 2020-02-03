import isSerializable from '../isSerializable';

it('returns true for serializable object', () => {
  expect(
    isSerializable({
      index: 0,
      key: '7',
      routeNames: ['foo', 'bar'],
      routes: [
        {
          key: 'foo',
          name: 'foo',
          state: {
            index: 0,
            key: '8',
            routeNames: ['qux', 'lex'],
            routes: [
              { key: 'qux', name: 'qux' },
              { key: 'lex', name: 'lex' },
            ],
          },
        },
      ],
    })
  ).toBe(true);
});

it('returns false for non-serializable object', () => {
  expect(
    isSerializable({
      index: 0,
      key: '7',
      routeNames: ['foo', 'bar'],
      routes: [
        {
          key: 'foo',
          name: 'foo',
          state: {
            index: 0,
            key: '8',
            routeNames: ['qux', 'lex'],
            routes: [
              { key: 'qux', name: 'qux', params: () => 42 },
              { key: 'lex', name: 'lex' },
            ],
          },
        },
      ],
    })
  ).toBe(false);
});

it('returns false for circular references', () => {
  const o = {
    index: 0,
    key: '7',
    routeNames: ['foo', 'bar'],
    routes: [
      {
        key: 'foo',
        name: 'foo',
      },
    ],
  };

  // @ts-ignore
  o.routes[0].state = o;

  expect(isSerializable(o)).toBe(false);
});
