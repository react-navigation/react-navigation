import { expect, test } from '@jest/globals';

import { getShadowStyle } from '../getShadowStyle';

test('returns native shadow styles', () => {
  const result = getShadowStyle({
    offset: {
      width: 2,
      height: 4,
    },
    radius: 5,
    opacity: 0.3,
  });

  expect(result).toEqual({
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowRadius: 5,
    shadowOpacity: 0.3,
  });
});
