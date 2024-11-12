import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { getShadowStyles, shadowDirections } from '../getShadowStyles';

let mockPlatform = 'ios';
const mockSelect = jest.fn((obj: any) => {
  if (mockPlatform === 'web') {
    return obj.web;
  }
  return obj.default;
});

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'web',
  select: (obj: any) => mockSelect(obj),
}));

describe('getShadowStyles', () => {
  beforeEach(() => {
    mockPlatform = 'ios';
    mockSelect.mockClear();
  });

  test('returns web shadow styles', () => {
    mockPlatform = 'web';
    const result = getShadowStyles({
      offset: { width: 2, height: 4 },
    });

    expect(result).toEqual({
      boxShadow: '2px 4px 5px rgba(0, 0, 0, 0.3)',
    });
  });

  test('returns native shadow styles', () => {
    mockPlatform = 'ios';
    const result = getShadowStyles({
      offset: { width: 2, height: 4 },
    });

    expect(result).toEqual({
      shadowOffset: { width: 2, height: 4 },
    });
  });

  test('returns empty object when no config is provided', () => {
    const result = getShadowStyles();
    expect(result).toEqual({});
  });

  describe('shadowDirections', () => {
    test('provides correct base shadow', () => {
      mockPlatform = 'web';
      const result = shadowDirections.base();
      expect(result).toEqual({
        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)',
      });
      expect(mockSelect).toHaveBeenCalled();
    });

    test('provides correct horizontal shadow', () => {
      mockPlatform = 'web';
      const result = shadowDirections.horizontal();
      expect(result).toEqual({
        boxShadow: '-1px 1px 5px rgba(0, 0, 0, 0.3)',
      });
      expect(mockSelect).toHaveBeenCalled();
    });

    test('provides correct vertical shadow', () => {
      mockPlatform = 'web';
      const result = shadowDirections.vertical();
      expect(result).toEqual({
        boxShadow: '1px -1px 5px rgba(0, 0, 0, 0.3)',
      });
      expect(mockSelect).toHaveBeenCalled();
    });

    test('provides correct native shadows', () => {
      mockPlatform = 'ios';
      expect(shadowDirections.base()).toEqual({
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 5,
        shadowColor: '#000',
        shadowOpacity: 0.3,
      });
    });

    test('provides correct native horizontal shadow', () => {
      mockPlatform = 'ios';
      expect(shadowDirections.horizontal()).toEqual({
        shadowOffset: { width: -1, height: 1 },
      });
    });

    test('provides correct native vertical shadow', () => {
      mockPlatform = 'ios';
      expect(shadowDirections.vertical()).toEqual({
        shadowOffset: { width: 1, height: -1 },
      });
    });
  });
});
