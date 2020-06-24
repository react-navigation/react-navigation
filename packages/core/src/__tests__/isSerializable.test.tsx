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
  const x: any = {
    a: 1,
    b: { b1: 1 },
  };

  x.b.b2 = x;
  x.c = x.b;

  expect(isSerializable(x)).toBe(false);

  const y: any = [
    {
      label: 'home',
      children: [{ label: 'product' }],
    },
    { label: 'about', extend: {} },
  ];

  y[0].children[0].parent = y[0];
  y[1].extend.home = y[0].children[0];

  expect(isSerializable(y)).toBe(false);

  const z: any = {
    name: 'sun',
    child: [{ name: 'flower' }],
  };

  z.child[0].parent = z;

  expect(isSerializable(z)).toBe(false);
});

it("doesn't fail if same object used multiple times", () => {
  const o = { foo: 'bar' };

  expect(
    isSerializable({
      baz: 'bax',
      first: o,
      second: o,
      stuff: {
        b: o,
      },
    })
  ).toBe(true);
});
