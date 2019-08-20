import { urlToPathAndParams } from '../pathUtils';

it('urlToPathAndParams empty', () => {
  const { path, params } = urlToPathAndParams('foo://');
  expect(path).toBe('');
  expect(params).toEqual({});
});

it('urlToPathAndParams empty params', () => {
  const { path, params } = urlToPathAndParams('foo://foo/bar/b');
  expect(path).toBe('foo/bar/b');
  expect(params).toEqual({});
});

it('urlToPathAndParams trailing slash', () => {
  const { path, params } = urlToPathAndParams('foo://foo/bar/');
  expect(path).toBe('foo/bar');
  expect(params).toEqual({});
});

it('urlToPathAndParams with params', () => {
  const { path, params } = urlToPathAndParams('foo://foo/bar?asdf=1&dude=foo');
  expect(path).toBe('foo/bar');
  expect(params).toEqual({ asdf: '1', dude: 'foo' });
});

it('urlToPathAndParams with custom delimeter string', () => {
  const { path, params } = urlToPathAndParams(
    'https://example.com/foo/bar?asdf=1',
    'https://example.com/'
  );
  expect(path).toBe('foo/bar');
  expect(params).toEqual({ asdf: '1' });
});

it('urlToPathAndParams with custom delimeter RegExp', () => {
  const { path, params } = urlToPathAndParams(
    'https://example.com/foo/bar?asdf=1',
    new RegExp('https://example.com/')
  );
  expect(path).toBe('foo/bar');
  expect(params).toEqual({ asdf: '1' });
});

it('urlToPathAndParams with duplicate prefix in query parameters', () => {
  const { path, params } = urlToPathAndParams(
    'example://whatever?related=example://something',
    'example://'
  );
  expect(path).toBe('whatever');
  expect(params).toEqual({ related: 'example://something' });
});

it('urlToPathAndParams with array of custom delimiters, should use first match', () => {
  const { path, params } = urlToPathAndParams(
    'https://example.com/foo/bar?asdf=1',
    ['baz', 'https://example.com/', 'https://example.com/foo']
  );
  expect(path).toBe('foo/bar');
  expect(params).toEqual({ asdf: '1' });
});

it('urlToPathAndParams with array of custom delimiters where none match, should resort to default delimiter', () => {
  const { path, params } = urlToPathAndParams('foo://foo/bar?asdf=1', [
    'baz',
    'bazzlefraz',
  ]);
  expect(path).toBe('foo/bar');
  expect(params).toEqual({ asdf: '1' });
});
