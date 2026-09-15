import { expect, test } from '@jest/globals';

import { parse, stringify } from '../queryString';

test.each(['', ' ', '\t\n', '?', '#', '&', '&&&&', '?&&&'])(
  'returns no params for %j',
  (query) => {
    expect(parse(query)).toEqual({});
  }
);

test.each([
  { query: 'name=Jane&page=2', expected: { name: 'Jane', page: '2' } },
  { query: '?name=Jane', expected: { name: 'Jane' } },
  { query: '#name=Jane', expected: { name: 'Jane' } },
  { query: '&name=Jane', expected: { name: 'Jane' } },
  { query: ' \t?name=Jane\n', expected: { name: 'Jane' } },
  { query: '&&name=Jane&&page=2&&', expected: { name: 'Jane', page: '2' } },
  { query: 'flag&empty=', expected: { flag: null, empty: '' } },
  { query: '=value', expected: { '': 'value' } },
  { query: '=', expected: { '': '' } },
  { query: 'q=a=b=c', expected: { q: 'a=b=c' } },
  { query: 'q=a?b#c', expected: { q: 'a?b#c' } },
  { query: '??q=value', expected: { '?q': 'value' } },
  { query: 'q=hello+world&x=%2B', expected: { q: 'hello world', x: '+' } },
  { query: 'q=bar+baz++', expected: { q: 'bar baz  ' } },
  { query: 'first+name=Jane+Doe', expected: { 'first name': 'Jane Doe' } },
  { query: 'a%26b=x%3Dy%26z', expected: { 'a&b': 'x=y&z' } },
  { query: 'q=%20hello%20', expected: { q: ' hello ' } },
  { query: 'q=café😀', expected: { q: 'café😀' } },
  {
    query: 'q=100&flag=true&nothing=null',
    expected: { q: '100', flag: 'true', nothing: 'null' },
  },
  { query: 'tag=a&tag=b&tag=c', expected: { tag: ['a', 'b', 'c'] } },
  { query: 'a=&a=value', expected: { a: ['', 'value'] } },
  { query: 'a=&a', expected: { a: ['', null] } },
  {
    query: '192e11=bar&value=192e11',
    expected: { '192e11': 'bar', value: '192e11' },
  },
  { query: 'tag&tag=a&tag=&tag', expected: { tag: [null, 'a', '', null] } },
  { query: 'tag&tag', expected: { tag: [null, null] } },
  { query: 'tag=a&%74ag=b', expected: { tag: ['a', 'b'] } },
  { query: 'tag[]=a&tag[]=b', expected: { 'tag[]': ['a', 'b'] } },
  { query: 'tag[0]=a&tag[1]=b', expected: { 'tag[0]': 'a', 'tag[1]': 'b' } },
  { query: 'tag=a,b', expected: { tag: 'a,b' } },
])('parses $query', ({ query, expected }) => {
  expect(parse(query)).toEqual(expected);
});

test('preserves special property names as ordinary query params', () => {
  const params = parse(
    '__proto__=a&__proto__=b&constructor=x&prototype=y&toString=z&hasOwnProperty=w'
  );

  expect(Object.getPrototypeOf(params)).toBeNull();
  expect(Object.hasOwn(params, '__proto__')).toBe(true);
  expect(params.__proto__).toEqual(['a', 'b']);
  expect(params.constructor).toBe('x');
  expect(params.prototype).toBe('y');
  expect(params.toString).toBe('z');
  expect(params.hasOwnProperty).toBe('w');
});

test.each([
  ['%00', '\0'],
  ['%7F', '\x7F'],
  ['%C2%80', '\u0080'],
  ['%DF%BF', '\u07FF'],
  ['%E0%A0%80', '\u0800'],
  ['%E1%80%80', '\u1000'],
  ['%E9%80%80', '\u9000'],
  ['%EA%80%80', '\uA000'],
  ['%EC%80%80', '\uC000'],
  ['%ED%9F%BF', '\uD7FF'],
  ['%EE%80%80', '\uE000'],
  ['%EF%BF%BF', '\uFFFF'],
  ['%F0%90%80%80', '\u{10000}'],
  ['%F1%80%80%80', '\u{40000}'],
  ['%F3%BF%BF%BF', '\u{FFFFF}'],
  ['%F4%8F%BF%BF', '\u{10FFFF}'],
  ['%c3%a9', 'é'],
  ['%C3%a9', 'é'],
  ['%F0%9f%98%80', '😀'],
])('decodes UTF-8 sequence %s in keys and values', (encoded, decoded) => {
  expect(parse(`${encoded}=${encoded}`)).toEqual({
    [decoded]: decoded,
  });
  expect(parse(`%ZZ${encoded}=%ZZ${encoded}`)).toEqual({
    [`%ZZ${decoded}`]: `%ZZ${decoded}`,
  });
});

test.each([
  '%',
  '%A',
  '%GG',
  '%G0',
  '%0G',
  '%u0041',
  '%80',
  '%BF',
  '%C0%AF',
  '%C1%BF',
  '%C2',
  '%c2',
  '%C3',
  '%DF',
  '%E0%80%80',
  '%E0%9F%BF',
  '%E2%82',
  '%ED%A0%80',
  '%ED%BF%BF',
  '%F0%80%80%80',
  '%F0%8F%BF%BF',
  '%F0%9F%98',
  '%F4%90%80%80',
  '%F5%80%80%80',
  '%F8%88%88%88',
  '%FF',
  '%FE%FF',
  '%FF%FE',
  '%E:%80%80',
  '%E;%80%80',
  '%E<%80%80',
  '%E=%80%80',
  '%E>%80%80',
  '%E?%80%80',
  '%E@%80%80',
])('preserves malformed sequence %s without throwing', (encoded) => {
  expect(parse(`q=${encoded}`)).toEqual({ q: encoded });
  expect(parse(`q=%C3%A9${encoded}%41`)).toEqual({
    q: `é${encoded}A`,
  });
});

test.each([
  ['%ea%ba%5a%ba', '%ea%baZ%ba'],
  ['%F0%9F%41', '%F0%9FA'],
  ['%E2%41%AC', '%E2A%AC'],
  ['%C3%41', '%C3A'],
  ['%C3%A9%80%C3%A9', 'é%80é'],
  ['%FE%FF%41', '%FE%FFA'],
  ['%84%D7%25%88%90', '%84%D7%%88%90'],
  ['%20%20%25%80', '  %%80'],
  ['%25C3%25A9', '%C3%A9'],
  ['%25C3%25A9%FF', '%C3%A9%FF'],
  ['%2525', '%25'],
  ['%%41', '%A'],
  ['%25%32%42', '%2B'],
])('decodes %s once while preserving invalid bytes', (encoded, decoded) => {
  expect(parse(`q=${encoded}`)).toEqual({ q: decoded });
});

test('handles long malformed values and names', () => {
  const value = '%C3'.repeat(20_000);

  expect(parse(`q=${value}`)).toEqual({ q: value });
  expect(parse(`${value}=value`)).toEqual({ [value]: 'value' });
});

test('handles long plain and encoded values', () => {
  const plain = 'abcdef'.repeat(10_000);
  const encoded = '%C3%A9'.repeat(10_000);

  expect(parse(`plain=${plain}&encoded=${encoded}`)).toEqual({
    plain,
    encoded: 'é'.repeat(10_000),
  });
});

test('handles long separator runs before and between params', () => {
  const separators = '&'.repeat(20_000);

  expect(parse(separators)).toEqual({});
  expect(parse(`${separators}q=a${separators}q=b${separators}`)).toEqual({
    q: ['a', 'b'],
  });
});

test('preserves every value when a key occurs many times', () => {
  expect(parse('q=value&'.repeat(20_000))).toEqual({
    q: Array.from({ length: 20_000 }, () => 'value'),
  });
});

test('serializes empty params without adding a query', () => {
  expect(stringify({})).toBe('');
});

test('preserves parameter insertion order', () => {
  expect(stringify({ z: 'last', a: 'first' })).toBe('z=last&a=first');
});

test('distinguishes bare keys from empty values', () => {
  expect(stringify({ flag: null, empty: '' })).toBe('flag&empty=');
  expect(stringify({ '': null })).toBe('');
  expect(stringify({ '': '' })).toBe('=');
  expect(stringify({ '': 'value' })).toBe('=value');
});

test('serializes arrays as repeated keys and omits empty arrays', () => {
  expect(stringify({ tags: ['b', '', 'a'], empty: [], flag: null })).toBe(
    'tags=b&tags=&tags=a&flag'
  );
});

test('serializes every value in a large array', () => {
  const tags = Array.from({ length: 20_000 }, (_, index) => `value ${index}`);
  const expected = Array.from(
    { length: 20_000 },
    (_, index) => `tags=value%20${index}`
  ).join('&');

  expect(stringify({ tags })).toBe(expected);
});

test('encodes bare parameter names', () => {
  expect(stringify({ 'x y': null })).toBe('x%20y');
});

test('skips holes in sparse arrays', () => {
  const tags = new Array<string>(3);
  tags[1] = 'value';

  expect(stringify({ tags })).toBe('tags=value');
});

test.each(['\uD800', '\uDFFF'])(
  'omits empty arrays under lone-surrogate key %j',
  (key) => {
    expect(stringify({ [key]: [] })).toBe('');
    expect(stringify({ before: 'a', [key]: [], after: 'b' })).toBe(
      'before=a&after=b'
    );
  }
);

test.each(['\uD800', '\uDFFF'])(
  'omits entirely sparse arrays under lone-surrogate key %j',
  (key) => {
    const values = new Array<string>(3);

    expect(stringify({ [key]: values })).toBe('');
    expect(stringify({ before: 'a', [key]: values, after: 'b' })).toBe(
      'before=a&after=b'
    );

    values[1] = 'value';

    expect(() => stringify({ [key]: values })).toThrow(URIError);
  }
);

test.each([
  ['AZaz09-._~', 'AZaz09-._~'],
  ['hello world', 'hello%20world'],
  ['+', '%2B'],
  ["!'()*", '%21%27%28%29%2A'],
  ['&=/#?:,[]', '%26%3D%2F%23%3F%3A%2C%5B%5D'],
  ['%C3', '%25C3'],
  ['café', 'caf%C3%A9'],
  ['😀', '%F0%9F%98%80'],
  ['\0\t\n\r', '%00%09%0A%0D'],
])('encodes %j in keys, values and arrays', (value, encoded) => {
  expect(stringify({ [value]: value })).toBe(`${encoded}=${encoded}`);
  expect(stringify({ q: [value, value] })).toBe(`q=${encoded}&q=${encoded}`);
});

test('preserves special property names without changing the input', () => {
  const params = {
    ['__proto__']: 'value',
    constructor: 'name',
    tags: ['b', 'a'],
  };

  expect(stringify(params)).toBe(
    '__proto__=value&constructor=name&tags=b&tags=a'
  );
  expect(params).toEqual({
    ['__proto__']: 'value',
    constructor: 'name',
    tags: ['b', 'a'],
  });
  expect(Object.getPrototypeOf(params)).toBe(Object.prototype);
});

test.each(['\uD800', '\uDFFF'])(
  'rejects lone surrogate %j during encoding',
  (value) => {
    expect(() => stringify({ q: value })).toThrow(URIError);
    expect(() => stringify({ [value]: 'value' })).toThrow(URIError);
    expect(() => stringify({ q: [value] })).toThrow(URIError);
  }
);

test('round-trips strings, repeated values and bare keys', () => {
  const params = {
    name: 'café 😀',
    tags: ['a&b', '', '%C3', '+'],
    flag: null,
    empty: '',
  };

  expect(parse(stringify(params))).toEqual(params);
});
