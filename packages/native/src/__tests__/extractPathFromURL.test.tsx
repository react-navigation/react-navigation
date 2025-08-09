import { expect, test } from '@jest/globals';

import { extractPathFromURL } from '../extractPathFromURL';

test('extracts path from URL with protocol', () => {
  expect(extractPathFromURL(['scheme://'], 'scheme://some/path')).toBe(
    'some/path'
  );

  expect(extractPathFromURL(['scheme://'], 'scheme:some/path')).toBe(
    'some/path'
  );

  expect(extractPathFromURL(['scheme://'], 'scheme:///some/path')).toBe(
    'some/path'
  );

  expect(extractPathFromURL(['scheme:///'], 'scheme:some/path')).toBe(
    'some/path'
  );

  expect(extractPathFromURL(['scheme:'], 'scheme:some/path')).toBe('some/path');

  expect(extractPathFromURL(['scheme:'], 'scheme://some/path')).toBe(
    'some/path'
  );

  expect(extractPathFromURL(['scheme:'], 'scheme:///some/path')).toBe(
    'some/path'
  );
});

test('extracts path from URL with protocol and host', () => {
  expect(
    extractPathFromURL(
      ['scheme://example.com'],
      'scheme://example.com/some/path'
    )
  ).toBe('/some/path');

  expect(
    extractPathFromURL(['scheme://example.com'], 'scheme:example.com/some/path')
  ).toBe('/some/path');

  expect(
    extractPathFromURL(
      ['scheme://example.com'],
      'scheme:///example.com/some/path'
    )
  ).toBe('/some/path');

  expect(
    extractPathFromURL(
      ['scheme:///example.com'],
      'scheme:example.com/some/path'
    )
  ).toBe('/some/path');

  expect(
    extractPathFromURL(['scheme:example.com'], 'scheme:example.com/some/path')
  ).toBe('/some/path');

  expect(
    extractPathFromURL(['scheme:example.com'], 'scheme://example.com/some/path')
  ).toBe('/some/path');

  expect(
    extractPathFromURL(
      ['scheme:example.com'],
      'scheme:///example.com/some/path'
    )
  ).toBe('/some/path');

  expect(
    extractPathFromURL(['scheme://example.com'], 'scheme://example.com/')
  ).toBe('/');

  expect(
    extractPathFromURL(['scheme://example.com'], 'scheme://example.com')
  ).toBe('');
});

test('extracts path from URL with protocol and host with wildcard', () => {
  expect(
    extractPathFromURL(
      ['scheme://*.example.com'],
      'scheme://test.example.com/some/path'
    )
  ).toBe('/some/path');

  expect(
    extractPathFromURL(
      ['scheme://*.example.com'],
      'scheme:test.example.com/some/path'
    )
  ).toBe('/some/path');

  expect(
    extractPathFromURL(
      ['scheme://*.example.com'],
      'scheme:///test.example.com/some/path'
    )
  ).toBe('/some/path');

  expect(
    extractPathFromURL(
      ['scheme:///*.example.com'],
      'scheme:test.example.com/some/path'
    )
  ).toBe('/some/path');

  expect(
    extractPathFromURL(
      ['scheme:*.example.com'],
      'scheme:test.example.com/some/path'
    )
  ).toBe('/some/path');

  expect(
    extractPathFromURL(
      ['scheme:*.example.com'],
      'scheme://test.example.com/some/path'
    )
  ).toBe('/some/path');

  expect(
    extractPathFromURL(
      ['scheme:*.example.com'],
      'scheme:///test.example.com/some/path'
    )
  ).toBe('/some/path');
});

test('extracts path from URL with protocol, host and path', () => {
  expect(
    extractPathFromURL(
      ['scheme://example.com/test'],
      'scheme://example.com/test/some/path'
    )
  ).toBe('/some/path');

  expect(
    extractPathFromURL(['scheme://example.com'], 'scheme:example.com/some/path')
  ).toBe('/some/path');

  expect(
    extractPathFromURL(
      ['scheme://example.com/test'],
      'scheme:///example.com/test/some/path'
    )
  ).toBe('/some/path');

  expect(
    extractPathFromURL(
      ['scheme:///example.com/test'],
      'scheme:example.com/test/some/path'
    )
  ).toBe('/some/path');

  expect(
    extractPathFromURL(
      ['scheme:example.com/test'],
      'scheme:example.com/test/some/path'
    )
  ).toBe('/some/path');

  expect(
    extractPathFromURL(
      ['scheme:example.com/test'],
      'scheme://example.com/test/some/path'
    )
  ).toBe('/some/path');

  expect(
    extractPathFromURL(
      ['scheme:example.com/test'],
      'scheme:///example.com/test/some/path'
    )
  ).toBe('/some/path');

  expect(
    extractPathFromURL(
      ['scheme:example.com/test'],
      'scheme:///example.com/test//some/path'
    )
  ).toBe('/some/path');

  expect(
    extractPathFromURL(
      ['scheme:example.com/test'],
      'scheme:///example.com/test/some//path'
    )
  ).toBe('/some/path');
});

test('extracts path from URL with IP address and port', () => {
  // Test exact IP address and port matching
  expect(
    extractPathFromURL(
      ['http://127.0.0.1:19000'],
      'http://127.0.0.1:19000/some/path'
    )
  ).toBe('/some/path');

  expect(
    extractPathFromURL(
      ['https://127.0.0.1:8080'],
      'https://127.0.0.1:8080/secure/path'
    )
  ).toBe('/secure/path');

  expect(
    extractPathFromURL(
      ['exp://127.0.0.1:19000'],
      'exp://127.0.0.1:19000/--/simple-stack'
    )
  ).toBe('/--/simple-stack');

  expect(
    extractPathFromURL(
      ['rne://127.0.0.1:19000'],
      'rne://127.0.0.1:19000/--/simple-stack'
    )
  ).toBe('/--/simple-stack');

  // Test IPv6 prefixes
  expect(
    extractPathFromURL(['http://[::1]:8080'], 'http://[::1]:8080/some/path')
  ).toBe('/some/path');

  // Test with query parameters
  expect(
    extractPathFromURL(
      ['http://127.0.0.1:19000'],
      'http://127.0.0.1:19000/path?param=value'
    )
  ).toBe('/path?param=value');

  // Test empty path
  expect(
    extractPathFromURL(['http://127.0.0.1:19000'], 'http://127.0.0.1:19000')
  ).toBe('');
  expect(
    extractPathFromURL(['http://127.0.0.1:19000'], 'http://127.0.0.1:19000/')
  ).toBe('/');
});

test('returns undefined for non-matching protocol', () => {
  expect(extractPathFromURL(['scheme://'], 'foo://some/path')).toBeUndefined();

  expect(extractPathFromURL(['scheme://'], 'foo:some/path')).toBeUndefined();

  expect(extractPathFromURL(['scheme://'], 'foo:///some/path')).toBeUndefined();

  expect(extractPathFromURL(['scheme:///'], 'foo:some/path')).toBeUndefined();

  expect(extractPathFromURL(['scheme:'], 'foo:some/path')).toBeUndefined();

  expect(extractPathFromURL(['scheme:'], 'foo://some/path')).toBeUndefined();

  expect(extractPathFromURL(['scheme:'], 'foo:///some/path')).toBeUndefined();
});

test('returns undefined for non-matching path', () => {
  expect(
    extractPathFromURL(['scheme://foo'], 'scheme://some/path')
  ).toBeUndefined();

  expect(
    extractPathFromURL(['scheme://foo'], 'scheme:some/path')
  ).toBeUndefined();

  expect(
    extractPathFromURL(['scheme://foo'], 'scheme:///some/path')
  ).toBeUndefined();

  expect(
    extractPathFromURL(['scheme:///foo'], 'scheme:some/path')
  ).toBeUndefined();

  expect(
    extractPathFromURL(['scheme:foo'], 'scheme:some/path')
  ).toBeUndefined();

  expect(
    extractPathFromURL(['scheme:foo'], 'scheme://some/path')
  ).toBeUndefined();

  expect(
    extractPathFromURL(['scheme:foo'], 'scheme:///some/path')
  ).toBeUndefined();
});

test('returns undefined for non-matching host', () => {
  expect(
    extractPathFromURL(['scheme://example.com'], 'scheme://foo.com/some/path')
  ).toBeUndefined();

  expect(
    extractPathFromURL(['scheme://example.com'], 'scheme:foo.com/some/path')
  ).toBeUndefined();

  expect(
    extractPathFromURL(['scheme://example.com'], 'scheme:///foo.com/some/path')
  ).toBeUndefined();

  expect(
    extractPathFromURL(['scheme:///example.com'], 'scheme:foo.com/some/path')
  ).toBeUndefined();

  expect(
    extractPathFromURL(['scheme:example.com'], 'scheme:foo.com/some/path')
  ).toBeUndefined();

  expect(
    extractPathFromURL(['scheme:example.com'], 'scheme://foo.com/some/path')
  ).toBeUndefined();

  expect(
    extractPathFromURL(['scheme:example.com'], 'scheme:///foo.com/some/path')
  ).toBeUndefined();
});

test('returns undefined for non-matching host with wildcard', () => {
  expect(
    extractPathFromURL(
      ['scheme://*.example.com'],
      'scheme://test.foo.com/some/path'
    )
  ).toBeUndefined();

  expect(
    extractPathFromURL(
      ['scheme://*.example.com'],
      'scheme:test.foo.com/some/path'
    )
  ).toBeUndefined();

  expect(
    extractPathFromURL(
      ['scheme://*.example.com'],
      'scheme:///test.foo.com/some/path'
    )
  ).toBeUndefined();

  expect(
    extractPathFromURL(
      ['scheme:///*.example.com'],
      'scheme:test.foo.com/some/path'
    )
  ).toBeUndefined();

  expect(
    extractPathFromURL(
      ['scheme:*.example.com'],
      'scheme:test.foo.com/some/path'
    )
  ).toBeUndefined();

  expect(
    extractPathFromURL(
      ['scheme:*.example.com'],
      'scheme://test.foo.com/some/path'
    )
  ).toBeUndefined();

  expect(
    extractPathFromURL(
      ['scheme:*.example.com'],
      'scheme:///test.foo.com/some/path'
    )
  ).toBeUndefined();
});

test('returns a valid search query when it has a url as param', () => {
  expect(
    extractPathFromURL(
      ['https://mysite.com'],
      'https://mysite.com/readPolicy?url=https://test.com'
    )
  ).toBe('/readPolicy?url=https://test.com');

  expect(
    extractPathFromURL(
      ['https://mysite.com'],
      'https://mysite.com/readPolicy?url=https://test.com?param=1'
    )
  ).toBe('/readPolicy?url=https://test.com?param=1');
});

test('supports wildcard prefix that matches any scheme', () => {
  // Test with various schemes
  expect(extractPathFromURL(['*'], 'myapp:some/path')).toBe('some/path');
  expect(extractPathFromURL(['*'], 'myapp://some/path')).toBe('some/path');
  expect(extractPathFromURL(['*'], 'myapp:///some/path')).toBe('/some/path');

  expect(extractPathFromURL(['*'], 'customscheme:path/to/resource')).toBe(
    'path/to/resource'
  );
});

test('supports wildcard prefix that matches any URL', () => {
  expect(extractPathFromURL(['*'], 'http://mysite.com/some/path')).toBe(
    '/some/path'
  );
  expect(extractPathFromURL(['*'], 'https://mysite.com/some/path')).toBe(
    '/some/path'
  );
  expect(
    extractPathFromURL(['*'], 'http://subdomain.mysite.com/some/path')
  ).toBe('/some/path');
  expect(
    extractPathFromURL(['*'], 'https://subdomain.mysite.com/some/path')
  ).toBe('/some/path');

  expect(
    extractPathFromURL(['*'], 'https://example.com/path?param=value')
  ).toBe('/path?param=value');

  expect(extractPathFromURL(['*'], 'https://example.com')).toBe('');
  expect(extractPathFromURL(['*'], 'https://example.com/')).toBe('/');
});

test('supports wildcard prefix that matches IP addresses and ports', () => {
  expect(extractPathFromURL(['*'], 'http://127.0.0.1:19000/some/path')).toBe(
    '/some/path'
  );
  expect(extractPathFromURL(['*'], 'https://127.0.0.1:8080/some/path')).toBe(
    '/some/path'
  );

  expect(extractPathFromURL(['*'], 'http://[::1]:8080/some/path')).toBe(
    '/some/path'
  );
  expect(extractPathFromURL(['*'], 'https://[::1]:3000/api/test')).toBe(
    '/api/test'
  );

  expect(extractPathFromURL(['*'], 'http://192.168.1.1:3000/admin')).toBe(
    '/admin'
  );
  expect(extractPathFromURL(['*'], 'https://10.0.0.1:8443/secure/path')).toBe(
    '/secure/path'
  );

  expect(extractPathFromURL(['*'], 'http://127.0.0.1:19000')).toBe('');
  expect(extractPathFromURL(['*'], 'http://127.0.0.1:19000/')).toBe('/');

  expect(
    extractPathFromURL(['*'], 'http://127.0.0.1:19000/path?param=value')
  ).toBe('/path?param=value');
  expect(
    extractPathFromURL(['*'], 'https://192.168.1.100:8080/api?token=123&id=456')
  ).toBe('/api?token=123&id=456');
});

test('wildcard prefix does not match when no scheme is present', () => {
  expect(extractPathFromURL(['*'], 'some/path/without/scheme')).toBeUndefined();
});
