import { afterEach, expect, test } from '@jest/globals';

import { parseErrorStack } from '../parseErrorStack';
import { parseHermesStack } from '../parseHermesStack';

afterEach(() => {
  Reflect.deleteProperty(globalThis, 'HermesInternal');
});

test('parses JavaScript error stack frames with zero-based columns', () => {
  const frames = parseErrorStack(`Error: Something went wrong
    at renderScreen (http://localhost/index.bundle:10:15)
    at anonymous (http://localhost/index.bundle:20:1)`);

  expect(frames).toHaveLength(2);
  expect(frames).toMatchObject([
    {
      file: 'http://localhost/index.bundle',
      methodName: 'renderScreen',
      lineNumber: 10,
      column: 14,
    },
    {
      file: 'http://localhost/index.bundle',
      methodName: 'anonymous',
      lineNumber: 20,
      column: 0,
    },
  ]);
});

test('parses Hermes stack frames', () => {
  expect(
    parseHermesStack(`Error: Something went wrong
    at first (native)
    at second (address at InternalBytecode.js:1:200)
    at third (address at index.bundle:10:300)
    at fourth (index.bundle:20:5)
    ... skipping 2 frames
    at Component`)
  ).toEqual({
    message: 'Error: Something went wrong',
    entries: [
      {
        type: 'FRAME',
        functionName: 'first',
        location: { type: 'NATIVE' },
      },
      {
        type: 'FRAME',
        functionName: 'second',
        location: {
          type: 'INTERNAL_BYTECODE',
          sourceUrl: 'InternalBytecode.js',
          line1Based: 1,
          virtualOffset0Based: 200,
        },
      },
      {
        type: 'FRAME',
        functionName: 'third',
        location: {
          type: 'BYTECODE',
          sourceUrl: 'index.bundle',
          line1Based: 10,
          virtualOffset0Based: 300,
        },
      },
      {
        type: 'FRAME',
        functionName: 'fourth',
        location: {
          type: 'SOURCE',
          sourceUrl: 'index.bundle',
          line1Based: 20,
          column1Based: 5,
        },
      },
      { type: 'SKIPPED', count: 2 },
    ],
  });
});

test('converts Hermes error stack to visible stack frames', () => {
  Object.defineProperty(globalThis, 'HermesInternal', {
    configurable: true,
    value: {},
  });

  expect(
    parseErrorStack(`Error: Something went wrong
    at first (native)
    at second (address at InternalBytecode.js:1:200)
    at third (address at index.bundle:10:300)
    at fourth (index.bundle:20:5)`)
  ).toEqual([
    {
      methodName: 'third',
      file: 'index.bundle',
      lineNumber: 10,
      column: 300,
    },
    {
      methodName: 'fourth',
      file: 'index.bundle',
      lineNumber: 20,
      column: 4,
    },
  ]);
});
