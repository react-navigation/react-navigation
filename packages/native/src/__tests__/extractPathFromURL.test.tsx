import extractPathFromURL from '../extractPathFromURL';

it('extracts path from URL with protocol', () => {
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

it('extracts path from URL with protocol and host', () => {
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

it('extracts path from URL with protocol and host with wildcard', () => {
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

it('extracts path from URL with protocol, host and path', () => {
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
      'scheme:///example.com//test/some/path'
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

it('returns undefined for non-matching protocol', () => {
  expect(extractPathFromURL(['scheme://'], 'foo://some/path')).toBeUndefined();

  expect(extractPathFromURL(['scheme://'], 'foo:some/path')).toBeUndefined();

  expect(extractPathFromURL(['scheme://'], 'foo:///some/path')).toBeUndefined();

  expect(extractPathFromURL(['scheme:///'], 'foo:some/path')).toBeUndefined();

  expect(extractPathFromURL(['scheme:'], 'foo:some/path')).toBeUndefined();

  expect(extractPathFromURL(['scheme:'], 'foo://some/path')).toBeUndefined();

  expect(extractPathFromURL(['scheme:'], 'foo:///some/path')).toBeUndefined();
});

it('returns undefined for non-matching path', () => {
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

it('returns undefined for non-matching host', () => {
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

it('returns undefined for non-matching host with wildcard', () => {
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
