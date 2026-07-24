import { expect, test } from '@jest/globals';

import { getShadowStyle } from '../getShadowStyle';

test('returns web shadow styles', () => {
  const result = getShadowStyle({
    offset: {
      width: 2,
      height: 4,
    },
    radius: 5,
    opacity: 0.3,
  });

  expect(result).toEqual({
    boxShadow: '2px 4px 5px rgba(0, 0, 0, 0.3)',
  });
});
