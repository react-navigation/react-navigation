import assert from 'node:assert';

import { afterEach, describe, expect, jest, test } from '@jest/globals';
import { Platform } from 'react-native';

import { Color } from '../Color';
import { DynamicColorIOS, PlatformColor } from '../PlatformColor';

jest.mock('../PlatformColor', () => ({
  DynamicColorIOS: jest.fn((dynamic: { light: unknown; dark: unknown }) => ({
    dynamic,
  })),
  PlatformColor: jest.fn((color: string) => {
    const { Platform } =
      require('react-native') as typeof import('react-native');

    return Platform.OS === 'android'
      ? { resource_paths: [color] }
      : { semantic: [color] };
  }),
}));

afterEach(() => {
  jest.restoreAllMocks();
});

describe('color parsing', () => {
  test('returns undefined for invalid input', () => {
    expect(Color('')).toBeUndefined();
    expect(Color('var(--primary)')).toBeUndefined();
    expect(Color('not-a-color')).toBeUndefined();
    expect(Color('#12345')).toBeUndefined();
    expect(Color('#xyz')).toBeUndefined();
    expect(Color('foo(1, 2, 3)')).toBeUndefined();
  });

  test('returns undefined for non-string input', () => {
    // @ts-expect-error Testing invalid runtime input.
    expect(Color(Symbol('color'))).toBeUndefined();
    // @ts-expect-error Testing invalid runtime input.
    expect(Color({ semantic: ['label'] })).toBeUndefined();
  });

  test('returns undefined for malformed function syntax', () => {
    expect(Color('rgb(255, 0)')).toBeUndefined();
    expect(Color('hsl(0)')).toBeUndefined();
    expect(Color('lab(50)')).toBeUndefined();
    expect(Color('lch(50 50)')).toBeUndefined();
    expect(Color('hwb(0 0%)')).toBeUndefined();

    expect(Color('rgb(1 2 3 4 5)')).toBeUndefined();
    expect(Color('rgba(255, 0, 0, 0.5, 0.6)')).toBeUndefined();
    expect(Color('lab(50 0 0 0 0)')).toBeUndefined();

    expect(Color('hsl(0px 100% 50%)')).toBeUndefined();
    expect(Color('rgb(255px 0 0)')).toBeUndefined();
    expect(Color('lch(50 50 180px)')).toBeUndefined();

    expect(Color('rgba(255, 0, 0, abc)')).toBeUndefined();
    expect(Color('rgb(255 0 0 / xyz)')).toBeUndefined();
  });

  test('parses hex to rgb', () => {
    expect(Color('#f00')?.string()).toBe('rgb(255, 0, 0)');
    expect(Color('#abc')?.string()).toBe('rgb(170, 187, 204)');

    expect(Color('#f008')?.string()).toBe('rgba(255, 0, 0, 0.533)');

    expect(Color('#ff0000')?.string()).toBe('rgb(255, 0, 0)');
    expect(Color('#1a2b3c')?.string()).toBe('rgb(26, 43, 60)');

    expect(Color('#ff000080')?.string()).toBe('rgba(255, 0, 0, 0.502)');
    expect(Color('#ffffff00')?.string()).toBe('rgba(255, 255, 255, 0)');

    expect(Color('#FFFFFF')?.string()).toBe('rgb(255, 255, 255)');
    expect(Color('#FfAa00')?.string()).toBe('rgb(255, 170, 0)');
  });

  test('parses named colors to rgb', () => {
    expect(Color('red')?.string()).toBe('rgb(255, 0, 0)');
    expect(Color('blue')?.string()).toBe('rgb(0, 0, 255)');
    expect(Color('white')?.string()).toBe('rgb(255, 255, 255)');
    expect(Color('black')?.string()).toBe('rgb(0, 0, 0)');

    expect(Color('RED')?.string()).toBe('rgb(255, 0, 0)');
    expect(Color('Red')?.string()).toBe('rgb(255, 0, 0)');
    expect(Color('rEbEcCaPuRpLe')?.string()).toBe('rgb(102, 51, 153)');
  });

  test('parses transparent as transparent black', () => {
    expect(Color('transparent')?.string()).toBe('rgba(0, 0, 0, 0)');
  });

  test('parses rgb / rgba', () => {
    expect(Color('rgb(255, 0, 0)')?.string()).toBe('rgb(255, 0, 0)');

    expect(Color('rgb(255 0 0)')?.string()).toBe('rgb(255, 0, 0)');

    expect(Color('rgba(255, 0, 0, 0.5)')?.string()).toBe(
      'rgba(255, 0, 0, 0.5)'
    );

    expect(Color('rgb(255, 0, 0, 0.5)')?.string()).toBe('rgba(255, 0, 0, 0.5)');

    expect(Color('rgb(255 0 0 / 0.5)')?.string()).toBe('rgba(255, 0, 0, 0.5)');

    expect(Color('rgb(255 0 0 / 50%)')?.string()).toBe('rgba(255, 0, 0, 0.5)');

    expect(Color('rgb(100% 0% 0%)')?.string()).toBe('rgb(255, 0, 0)');
    expect(Color('rgb(50% 50% 50%)')?.string()).toBe('rgb(128, 128, 128)');

    expect(Color('RGB(255, 0, 0)')?.string()).toBe('rgb(255, 0, 0)');
    expect(Color('RGBA(255, 0, 0, 0.5)')?.string()).toBe(
      'rgba(255, 0, 0, 0.5)'
    );
  });

  test('parses hsl / hsla', () => {
    expect(Color('hsl(0, 100%, 50%)')?.string()).toBe('hsl(0, 100%, 50%)');

    expect(Color('hsl(0 100% 50%)')?.string()).toBe('hsl(0, 100%, 50%)');

    expect(Color('hsla(0, 100%, 50%, 0.5)')?.string()).toBe(
      'hsla(0, 100%, 50%, 0.5)'
    );

    expect(Color('hsl(0 100% 50% / 0.5)')?.string()).toBe(
      'hsla(0, 100%, 50%, 0.5)'
    );

    expect(Color('hsl(180deg 100% 50%)')?.string()).toBe('hsl(180, 100%, 50%)');

    expect(Color(`hsl(${Math.PI}rad 100% 50%)`)?.string()).toBe(
      'hsl(180, 100%, 50%)'
    );

    expect(Color('hsl(200grad 100% 50%)')?.string()).toBe(
      'hsl(180, 100%, 50%)'
    );

    expect(Color('hsl(0.5turn 100% 50%)')?.string()).toBe(
      'hsl(180, 100%, 50%)'
    );

    expect(Color('hsl(0, 100, 50)')?.string()).toBe('hsl(0, 100%, 50%)');
  });

  test.each([
    ['deg', 'hsl(-180deg 100% 50%)'],
    ['grad', 'hsl(-200grad 100% 50%)'],
    ['rad', `hsl(${-Math.PI}rad 100% 50%)`],
    ['turn', 'hsl(-0.5turn 100% 50%)'],
  ])('normalizes negative %s angles', (_unit, input) => {
    expect(Color(input)?.string()).toBe('hsl(180, 100%, 50%)');
  });

  test.each([
    ['hsl', 'hsl(720 100% 50%)', 'hsl(0, 100%, 50%)'],
    ['hsl', 'hsl(-180 100% 50%)', 'hsl(180, 100%, 50%)'],
    ['hwb', 'hwb(720 30% 20%)', 'hwb(0 30% 20%)'],
    ['hwb', 'hwb(-180 30% 20%)', 'hwb(180 30% 20%)'],
    ['lch', 'lch(50 50 720)', 'lch(50 50 0)'],
    ['lch', 'lch(50 50 -90)', 'lch(50 50 270)'],
    ['oklch', 'oklch(0.5 0.1 720)', 'oklch(0.5 0.1 0)'],
    ['oklch', 'oklch(0.5 0.1 -90)', 'oklch(0.5 0.1 270)'],
  ])('normalizes hue to 0-360 for %s', (_type, input, expected) => {
    expect(Color(input)?.string()).toBe(expected);
  });

  test('clamps out-of-range channels in stringified output', () => {
    expect(Color('rgb(300 -50 0)')?.string()).toBe('rgb(255, 0, 0)');
    expect(Color('hsl(0 150% -50%)')?.string()).toBe('hsl(0, 100%, 0%)');
    expect(Color('hwb(0 150% -50%)')?.string()).toBe('hwb(0 100% 0%)');
    expect(Color('lab(150 200 -200)')?.string()).toBe('lab(100 125 -125)');
    expect(Color('oklab(2 1 -1)')?.string()).toBe('oklab(1 0.4 -0.4)');
    expect(Color('lch(150 200 0)')?.string()).toBe('lch(100 150 0)');
    expect(Color('oklch(2 1 0)')?.string()).toBe('oklch(1 0.4 0)');
  });

  test('parses hwb', () => {
    expect(Color('hwb(0 0% 0%)')?.string()).toBe('hwb(0 0% 0%)');
    expect(Color('hwb(120 30% 20%)')?.string()).toBe('hwb(120 30% 20%)');

    expect(Color('hwb(180 30 20)')?.string()).toBe('hwb(180 30% 20%)');

    expect(Color('hwb(120 30% 20% / 0.5)')?.string()).toBe(
      'hwb(120 30% 20% / 0.5)'
    );

    expect(Color('hwb(0 50% 50%)')?.string()).toBe('hwb(0 50% 50%)');
  });

  test('parses lab', () => {
    expect(Color('lab(50% 25 -25)')?.string()).toBe('lab(50 25 -25)');

    expect(Color('lab(50% 25 -25 / 0.5)')?.string()).toBe(
      'lab(50 25 -25 / 0.5)'
    );

    // % on a/b axes scales to ±125
    expect(Color('lab(50% 100% -100%)')?.string()).toBe('lab(50 125 -125)');
    expect(Color('lab(50% 50% -50%)')?.string()).toBe('lab(50 62.5 -62.5)');
  });

  test('parses oklab', () => {
    expect(Color('oklab(0.5 0.1 -0.1)')?.string()).toBe('oklab(0.5 0.1 -0.1)');

    // % on a/b axes scales to ±0.4
    expect(Color('oklab(50% 100% -100%)')?.string()).toBe(
      'oklab(0.5 0.4 -0.4)'
    );
    expect(Color('oklab(50% 50% -50%)')?.string()).toBe('oklab(0.5 0.2 -0.2)');
  });

  test('parses lch', () => {
    expect(Color('lch(50% 50 180)')?.string()).toBe('lch(50 50 180)');

    // % on C axis scales to 0-150
    expect(Color('lch(50% 100% 180)')?.string()).toBe('lch(50 150 180)');
    expect(Color('lch(50% 50% 180)')?.string()).toBe('lch(50 75 180)');
  });

  test('parses oklch', () => {
    expect(Color('oklch(0.5 0.1 180)')?.string()).toBe('oklch(0.5 0.1 180)');

    // % on C axis scales to 0-0.4
    expect(Color('oklch(50% 100% 180)')?.string()).toBe('oklch(0.5 0.4 180)');
    expect(Color('oklch(50% 50% 180)')?.string()).toBe('oklch(0.5 0.2 180)');
  });
});

describe('color manipulation', () => {
  describe('alpha()', () => {
    test('returns 1 when no alpha specified', () => {
      expect(Color('rgb(255 0 0)')?.alpha()).toBe(1);
      expect(Color('#f00')?.alpha()).toBe(1);
      expect(Color('red')?.alpha()).toBe(1);
    });

    test('returns parsed alpha', () => {
      expect(Color('rgba(255, 0, 0, 0.5)')?.alpha()).toBe(0.5);
      expect(Color('rgb(255 0 0 / 0.25)')?.alpha()).toBe(0.25);
      expect(Color('#ff000080')?.alpha()).toBe(128 / 255);
    });

    test('returns 0 for fully transparent', () => {
      expect(Color('rgba(255, 0, 0, 0)')?.alpha()).toBe(0);
      expect(Color('transparent')?.alpha()).toBe(0);
    });

    test('clamps parsed alpha to 0-1', () => {
      expect(Color('rgba(255, 0, 0, 1.5)')?.alpha()).toBe(1);
      expect(Color('rgba(255, 0, 0, -0.5)')?.alpha()).toBe(0);
      expect(Color('rgb(255 0 0 / 200%)')?.alpha()).toBe(1);
    });
  });

  describe('alpha(amount)', () => {
    test('sets alpha to given value', () => {
      expect(Color('rgb(255 0 0)')?.alpha(0.5).string()).toBe(
        'rgba(255, 0, 0, 0.5)'
      );
      expect(Color('rgb(255 0 0)')?.alpha(0).string()).toBe(
        'rgba(255, 0, 0, 0)'
      );

      expect(Color('rgba(255, 0, 0, 0.5)')?.alpha(1).string()).toBe(
        'rgb(255, 0, 0)'
      );
    });

    test('stringified output clamps alpha to 0-1', () => {
      // From parsing
      expect(Color('rgba(255, 0, 0, 1.5)')?.string()).toBe('rgb(255, 0, 0)');
      expect(Color('rgba(255, 0, 0, -0.5)')?.string()).toBe(
        'rgba(255, 0, 0, 0)'
      );
      expect(Color('rgb(255 0 0 / 200%)')?.string()).toBe('rgb(255, 0, 0)');

      // From setter
      expect(Color('rgb(255 0 0)')?.alpha(2).string()).toBe('rgb(255, 0, 0)');
      expect(Color('rgb(255 0 0)')?.alpha(-1).string()).toBe(
        'rgba(255, 0, 0, 0)'
      );
    });
  });

  describe('fade(amount)', () => {
    test('fades alpha by given amount', () => {
      expect(Color('rgb(255 0 0)')?.fade(0.5).string()).toBe(
        'rgba(255, 0, 0, 0.5)'
      );
      expect(Color('rgba(255, 0, 0, 0.5)')?.fade(0.5).string()).toBe(
        'rgba(255, 0, 0, 0.25)'
      );
    });

    test('does not change alpha when amount is 0', () => {
      expect(Color('rgba(255, 0, 0, 0.5)')?.fade(0).string()).toBe(
        'rgba(255, 0, 0, 0.5)'
      );
    });

    test('fades alpha to 0 when amount is 1', () => {
      expect(Color('rgb(255 0 0)')?.fade(1).string()).toBe(
        'rgba(255, 0, 0, 0)'
      );
    });

    test('stringified output clamps alpha to 0-1', () => {
      expect(Color('rgb(255 0 0)')?.fade(2).string()).toBe(
        'rgba(255, 0, 0, 0)'
      );
      expect(Color('rgba(255, 0, 0, 0.5)')?.fade(-1).string()).toBe(
        'rgb(255, 0, 0)'
      );
    });
  });

  test.each([
    [
      'rgb',
      'rgb(1 2 3)',
      'rgba(1, 2, 3, 0.8)',
      'rgba(1, 2, 3, 0.25)',
      'rgba(1, 2, 3, 0.4)',
    ],
    [
      'hsl',
      'hsl(120 50% 50%)',
      'hsla(120, 50%, 50%, 0.8)',
      'hsla(120, 50%, 50%, 0.25)',
      'hsla(120, 50%, 50%, 0.4)',
    ],
    [
      'hwb',
      'hwb(120 30% 20%)',
      'hwb(120 30% 20% / 0.8)',
      'hwb(120 30% 20% / 0.25)',
      'hwb(120 30% 20% / 0.4)',
    ],
    [
      'lab',
      'lab(50 25 -25)',
      'lab(50 25 -25 / 0.8)',
      'lab(50 25 -25 / 0.25)',
      'lab(50 25 -25 / 0.4)',
    ],
    [
      'oklab',
      'oklab(0.5 0.1 -0.1)',
      'oklab(0.5 0.1 -0.1 / 0.8)',
      'oklab(0.5 0.1 -0.1 / 0.25)',
      'oklab(0.5 0.1 -0.1 / 0.4)',
    ],
    [
      'lch',
      'lch(50 50 180)',
      'lch(50 50 180 / 0.8)',
      'lch(50 50 180 / 0.25)',
      'lch(50 50 180 / 0.4)',
    ],
    [
      'oklch',
      'oklch(0.5 0.1 180)',
      'oklch(0.5 0.1 180 / 0.8)',
      'oklch(0.5 0.1 180 / 0.25)',
      'oklch(0.5 0.1 180 / 0.4)',
    ],
  ])(
    'sets and fades alpha for %s',
    (_type, opaque, translucent, withAlpha, faded) => {
      expect(Color(opaque)?.alpha(0.25).string()).toBe(withAlpha);
      expect(Color(translucent)?.fade(0.5).string()).toBe(faded);
    }
  );

  describe('string()', () => {
    test('normalises hex 6-digit to rgb()', () => {
      expect(Color('#ff0000')?.string()).toBe('rgb(255, 0, 0)');
    });

    test('normalises named colors to rgb()', () => {
      expect(Color('red')?.string()).toBe('rgb(255, 0, 0)');
    });

    test('keeps rgb() form', () => {
      expect(Color('rgb(1, 2, 3)')?.string()).toBe('rgb(1, 2, 3)');
    });
  });
});

describe('chaining', () => {
  test('chains alpha → fade → string', () => {
    expect(Color('rgb(255 0 0)')?.alpha(0.8).fade(0.5).string()).toBe(
      'rgba(255, 0, 0, 0.4)'
    );
  });
});

describe('parse → stringify → parse', () => {
  test.each([
    ['rgb', 'rgba(255, 0, 0, 0.5)'],
    ['hsl', 'hsla(120, 50%, 50%, 0.5)'],
    ['hwb', 'hwb(120 30% 20% / 0.5)'],
    ['lab', 'lab(50 25 -25 / 0.5)'],
    ['oklab', 'oklab(0.5 0.1 -0.1 / 0.5)'],
    ['lch', 'lch(50 50 180 / 0.5)'],
    ['oklch', 'oklch(0.5 0.1 180 / 0.5)'],
  ])('processes %s', (_type, input) => {
    const stringified = Color(input)?.string();

    expect(stringified).toBeDefined();
    expect(Color(stringified!)?.string()).toBe(stringified);
  });
});

describe('foreground color', () => {
  test.each([
    ['hex', '#ffffff', 'hsl(0, 0%, 29%)'],
    ['rgb', 'rgb(255 255 255)', 'hsl(0, 0%, 29%)'],
    ['hsl', 'hsl(0 0% 100%)', 'hsl(0, 0%, 29%)'],
    ['hwb', 'hwb(0 100% 0%)', 'hsl(0, 0%, 29%)'],
    ['lab', 'lab(100 0 0)', 'lab(29 0 0)'],
    ['lch', 'lch(100 0 0)', 'lch(29 0 0)'],
    ['oklab', 'oklab(1 0 0)', 'oklab(0.29 0 0)'],
    ['oklch', 'oklch(1 0 0)', 'oklch(0.29 0 0)'],
  ])(
    'returns darkened foreground for pure light %s',
    (_type, input, expected) => {
      expect(Color.foreground(input)).toBe(expected);
    }
  );

  test.each([
    ['hex', '#000000'],
    ['rgb', 'rgb(0 0 0)'],
    ['hsl', 'hsl(0 0% 0%)'],
    ['hwb', 'hwb(0 0% 100%)'],
    ['lab', 'lab(0 0 0)'],
    ['lch', 'lch(0 0 0)'],
    ['oklab', 'oklab(0 0 0)'],
    ['oklch', 'oklch(0 0 0)'],
  ])('returns #fff for pure black %s', (_type, input) => {
    expect(Color.foreground(input)).toBe('#fff');
  });

  test.each([
    ['hex', '#444444'],
    ['rgb', 'rgb(80 80 80)'],
    ['hsl', 'hsl(120 50% 25%)'],
    ['hwb', 'hwb(120 10% 70%)'],
    ['lab', 'lab(40 10 -10)'],
    ['lch', 'lch(40 10 120)'],
    ['oklab', 'oklab(0.4 0.1 -0.1)'],
    ['oklch', 'oklch(0.4 0.1 120)'],
  ])('returns #fff for darker %s', (_type, input) => {
    expect(Color.foreground(input)).toBe('#fff');
  });

  test.each([
    ['hex', '#eeeeee', 'hsl(0, 0%, 27.067%)'],
    ['rgb', 'rgb(220 220 220)', 'hsl(0, 0%, 25.02%)'],
    ['hsl', 'hsl(120 50% 80%)', 'hsl(120, 50%, 23.2%)'],
    ['hwb', 'hwb(120 70% 10%)', 'hsl(120, 50%, 23.2%)'],
    ['lab', 'lab(80 10 -10)', 'lab(23.2 10 -10)'],
    ['lch', 'lch(80 20 120)', 'lch(23.2 20 120)'],
    ['oklab', 'oklab(0.8 0.1 -0.1)', 'oklab(0.232 0.1 -0.1)'],
    ['oklch', 'oklch(0.8 0.1 120)', 'oklch(0.232 0.1 120)'],
  ])('returns darkened foreground for lighter %s', (_type, input, expected) => {
    expect(Color.foreground(input)).toBe(expected);
  });

  test.each([
    ['red', '#fff'],
    ['green', '#fff'],
    ['blue', '#fff'],
    ['rebeccapurple', '#fff'],
    ['yellow', 'hsl(60, 100%, 14.5%)'],
    ['lime', 'hsl(120, 100%, 14.5%)'],
    ['cyan', 'hsl(180, 100%, 14.5%)'],
    ['orange', 'hsl(38.824, 100%, 14.5%)'],
    ['gold', 'hsl(50.588, 100%, 14.5%)'],
    ['pink', 'hsl(349.524, 100%, 25.418%)'],
    ['lightblue', 'hsl(194.737, 53.271%, 22.916%)'],
    ['lightgreen', 'hsl(120, 73.438%, 21.722%)'],
    ['khaki', 'hsl(54, 76.923%, 21.608%)'],
    ['plum', 'hsl(300, 47.287%, 21.665%)'],
    ['tomato', 'hsl(9.13, 100%, 18.537%)'],
  ])('returns foreground for named color %s', (input, expected) => {
    expect(Color.foreground(input)).toBe(expected);
  });

  test('returns matching Android foreground platform colors', () => {
    jest.replaceProperty(Platform, 'OS', 'android');

    assert(PlatformColor);

    expect(
      Color.foreground(PlatformColor('@android:color/system_primary_light'))
    ).toEqual(PlatformColor('@android:color/system_on_primary_light'));

    expect(
      Color.foreground(
        PlatformColor('@android:color/system_surface_variant_dark')
      )
    ).toEqual(PlatformColor('@android:color/system_on_surface_variant_dark'));
  });

  test('returns matching iOS foreground semantic colors', () => {
    jest.replaceProperty(Platform, 'OS', 'ios');

    assert(PlatformColor);

    expect(Color.foreground(PlatformColor('systemBackground'))).toEqual(
      PlatformColor('label')
    );

    expect(Color.foreground(PlatformColor('systemRed'))).toBe('white');

    expect(Color.foreground(PlatformColor('systemYellow'))).toBe('black');
  });

  test('returns matching iOS dynamic foreground colors', () => {
    jest.replaceProperty(Platform, 'OS', 'ios');

    assert(DynamicColorIOS);

    expect(
      Color.foreground(
        DynamicColorIOS({
          light: '#ffffff',
          dark: '#000000',
        })
      )
    ).toEqual(
      DynamicColorIOS({
        light: 'hsl(0, 0%, 29%)',
        dark: '#fff',
      })
    );
  });

  test('returns #fff for var() custom properties', () => {
    expect(Color.foreground('var(--primary)')).toBe('#fff');
  });

  test('returns #fff for transparent', () => {
    expect(Color.foreground('transparent')).toBe('#fff');
  });

  test('returns #fff for unparseable input', () => {
    expect(Color.foreground('not-a-color')).toBe('#fff');
  });
});
