import { expect, test } from '@jest/globals';

import { getPatternParts } from '../getPatternParts';

test('splits a path into parts', () => {
  const path =
    '/users/:type//:page(profile|settings)/:id([a-z]+:(\\d+))?/:name?';

  expect(getPatternParts(path)).toEqual([
    { segment: 'users' },
    { segment: ':type', param: 'type' },
    {
      segment: ':page(profile|settings)',
      param: 'page',
      regex: 'profile|settings',
    },
    {
      segment: ':id([a-z]+:(\\d+))?',
      param: 'id',
      regex: '[a-z]+:(\\d+)',
      optional: true,
    },
    {
      segment: ':name?',
      param: 'name',
      optional: true,
    },
  ]);
});

test('splits a path with non-capturing regex groups into parts', () => {
  const path = '/users/:id(\\d+)/posts/:slug([a-z]+(?:-[a-z]+)*)/:tab?';

  expect(getPatternParts(path)).toEqual([
    { segment: 'users' },
    {
      segment: ':id(\\d+)',
      param: 'id',
      regex: '\\d+',
    },
    { segment: 'posts' },
    {
      segment: ':slug([a-z]+(?:-[a-z]+)*)',
      param: 'slug',
      regex: '[a-z]+(?:-[a-z]+)*',
    },
    {
      segment: ':tab?',
      param: 'tab',
      optional: true,
    },
  ]);
});

test('splits a path with escaped parentheses in regex into parts', () => {
  const path = '/users/:id(a\\)b)/:tag(\\(+)?';

  expect(getPatternParts(path)).toEqual([
    { segment: 'users' },
    {
      segment: ':id(a\\)b)',
      param: 'id',
      regex: 'a\\)b',
    },
    {
      segment: ':tag(\\(+)?',
      param: 'tag',
      regex: '\\(+',
      optional: true,
    },
  ]);
});

test('splits a path with parentheses inside character class into parts', () => {
  expect(getPatternParts('/users/:id([)])')).toEqual([
    { segment: 'users' },
    {
      segment: ':id([)])',
      param: 'id',
      regex: '[)]',
    },
  ]);

  expect(getPatternParts('/users/:id([(])')).toEqual([
    { segment: 'users' },
    {
      segment: ':id([(])',
      param: 'id',
      regex: '[(]',
    },
  ]);
});

test('thrown an error if duplicate params are found', () => {
  const path = '/users/:id/profile/:id';

  expect(() => getPatternParts(path)).toThrow(
    `Duplicate param name 'id' found in path: ${path}`
  );
});

test('throws an error if a colon is in the middle of a segment', () => {
  const path = '/users:profile';

  expect(() => getPatternParts(path)).toThrow(
    `Encountered ':' in the middle of a segment in path: ${path}`
  );
});

test('throws an error if a regex is not preceded by a colon', () => {
  const path = '/users/test(\\d+)';

  expect(() => getPatternParts(path)).toThrow(
    `Encountered '(' without preceding ':' in path: ${path}`
  );
});

test('throws an error if a regex starts at beginning', () => {
  const path = '/users/(\\d+)';

  expect(() => getPatternParts(path)).toThrow(
    `Encountered '(' without preceding ':' in path: ${path}`
  );
});

test('throws an error if a closing parenthesis is not preceded by an opening parenthesis', () => {
  const path = '/users/:id\\d+)';

  expect(() => getPatternParts(path)).toThrow(
    `Encountered ')' without preceding '(' in path: ${path}`
  );
});

test('throws an error if a question mark is not preceded by a colon', () => {
  const path = '/users/test?';

  expect(() => getPatternParts(path)).toThrow(
    `Encountered '?' without preceding ':' in path: ${path}`
  );
});

test('throws an error if a question mark starts at the beginning', () => {
  const path = '/users/?';

  expect(() => getPatternParts(path)).toThrow(
    `Encountered '?' without preceding ':' in path: ${path}`
  );
});

test('throws an error if a regex is not closed', () => {
  const path = '/users/:id(\\d+';

  expect(() => getPatternParts(path)).toThrow(
    `Could not find closing ')' in path: ${path}`
  );
});
