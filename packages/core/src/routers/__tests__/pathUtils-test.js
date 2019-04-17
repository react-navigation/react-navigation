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

it('urlToPathAndParams with custom delimeter', () => {
  const { path, params } = urlToPathAndParams(
    'https://example.com/foo/bar?asdf=1',
    'https://example.com/'
  );
  expect(path).toBe('foo/bar');
  expect(params).toEqual({ asdf: '1' });
});
