import { expect, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { useMemoArray } from '../useMemoArray';

test('preserves array reference when dependencies are unchanged', async () => {
  const results: string[][] = [];

  const Test = ({ count }: { count: number }) => {
    results.push(
      useMemoArray([
        ['first', [count]],
        ['second', []],
      ])
    );

    return null;
  };

  const root = await render(<Test count={0} />);

  await root.rerender(<Test count={0} />);
  await root.rerender(<Test count={1} />);

  expect(results[1]).toBe(results[0]);
  expect(results[2]).toEqual(['first', 'second']);
  expect(results[2]).not.toBe(results[1]);
});

test('updates array reference when entries are removed', async () => {
  const results: string[][] = [];

  const Test = ({ showSecond }: { showSecond: boolean }) => {
    const entries: [string, readonly unknown[]][] = [['first', []]];

    if (showSecond) {
      entries.push(['second', []]);
    }

    results.push(useMemoArray(entries));

    return null;
  };

  const root = await render(<Test showSecond />);

  await root.rerender(<Test showSecond={false} />);

  expect(results[0]).toEqual(['first', 'second']);
  expect(results[1]).toEqual(['first']);
  expect(results[1]).not.toBe(results[0]);
});
