import { type ColorValue, Platform } from 'react-native';

import { DynamicColorIOS, PlatformColor } from './PlatformColor';

type ColorType = {
  alpha(amount: number): ColorType;
  alpha(): number;
  fade(amount: number): ColorType;
  string(): string;
};

type ParsedColor = {
  parts: number[];
  type: (typeof COLOR_TYPES)[number];
};

export function Color(value: ColorValue): ColorType | undefined {
  if (typeof value === 'string') {
    const parsed = parse(value);

    if (parsed) {
      return build(parsed);
    }
  }

  return undefined;
}

Color.foreground = (color: ColorValue): ColorValue => {
  const value = color as unknown;

  if (typeof value === 'object' && value != null) {
    // Special case for Android platform colors
    // Available colors: https://developer.android.com/reference/android/R.color
    if (
      Platform.OS === 'android' &&
      PlatformColor &&
      'resource_paths' in value &&
      Array.isArray(value.resource_paths) &&
      typeof value.resource_paths[0] === 'string'
    ) {
      const name = value.resource_paths[0].replace('@android:color/', '');

      if (name in ANDROID_COLOR_MAP) {
        return PlatformColor(`@android:color/${ANDROID_COLOR_MAP[name]}`);
      }
    }

    // Special case for iOS platform colors
    if (
      Platform.OS === 'ios' &&
      PlatformColor &&
      'semantic' in value &&
      Array.isArray(value.semantic) &&
      typeof value.semantic[0] === 'string'
    ) {
      const name = value.semantic[0];

      if (name in IOS_COLOR_MAP) {
        const foreground = IOS_COLOR_MAP[name];
        return foreground === 'white' || foreground === 'black'
          ? foreground
          : PlatformColor(foreground);
      }
    }

    // Special case for iOS dynamic colors
    if (
      Platform.OS === 'ios' &&
      DynamicColorIOS &&
      'dynamic' in value &&
      typeof value.dynamic === 'object' &&
      value.dynamic != null &&
      'light' in value.dynamic &&
      typeof value.dynamic.light === 'string' &&
      'dark' in value.dynamic &&
      typeof value.dynamic.dark === 'string'
    ) {
      const lightForeground = Color.foreground(value.dynamic.light);
      const darkForeground = Color.foreground(value.dynamic.dark);

      if (lightForeground && darkForeground) {
        return DynamicColorIOS({
          light: lightForeground,
          dark: darkForeground,
        });
      }
    }
  } else if (typeof color === 'string') {
    const parsed = parse(color);

    if (parsed && isLight(parsed)) {
      return darken(parsed, 0.71).string();
    }
  }

  return '#fff';
};

function build(parsed: ParsedColor): ColorType {
  function alpha(amount: number): ColorType;
  function alpha(): number;
  function alpha(amount?: number): ColorType | number {
    if (amount === undefined) {
      return clamp(parsed.parts[3], 0, 1);
    }

    const newParts = parsed.parts.slice();

    newParts[3] = amount;

    return build({ type: parsed.type, parts: newParts });
  }

  function fade(amount: number): ColorType {
    const newParts = parsed.parts.slice();

    newParts[3] = parsed.parts[3] * (1 - amount);

    return build({ type: parsed.type, parts: newParts });
  }

  function string(): string {
    return stringify(parsed);
  }

  return {
    alpha,
    fade,
    string,
  };
}

function parse(color: string): ParsedColor | undefined {
  if (color.toLowerCase() === 'transparent') {
    return { type: 'rgb', parts: [0, 0, 0, 0] };
  }

  const named = NAMED_COLORS[color.toLowerCase()];

  if (named) {
    return { type: 'rgb', parts: [...named, 1] };
  }

  const hex = color.match(/^#([\da-f]+)$/i);

  if (hex) {
    // Normalize 3-digit (#rgb) and 4-digit (#rgba) hex to 6-digit (#rrggbb) and 8-digit (#rrggbbaa)
    const digits =
      hex[1].length === 3 || hex[1].length === 4
        ? Array.from(hex[1], (d) => d + d).join('')
        : hex[1];

    if (digits.length !== 6 && digits.length !== 8) {
      return undefined;
    }

    return {
      type: 'rgb',
      parts: [
        parseInt(digits.slice(0, 2), 16),
        parseInt(digits.slice(2, 4), 16),
        parseInt(digits.slice(4, 6), 16),
        digits.length === 8 ? parseInt(digits.slice(6, 8), 16) / 255 : 1,
      ],
    };
  }

  const matched = color.match(/^([a-z]+)\(([^)]*)\)$/i);

  if (!matched) {
    return undefined;
  }

  // Get the color function name (e.g., "rgb", "hsl", "lab", etc.) and the color values
  const fnName = matched[1].toLowerCase();
  const argStr = matched[2];

  const type =
    fnName === 'rgba'
      ? 'rgb'
      : fnName === 'hsla'
        ? 'hsl'
        : COLOR_TYPES.find((t) => t === fnName);

  if (!type) {
    return undefined;
  }

  // Get values and optional alpha value based on the color format
  // e.g. CSS L4 (rgb(255 0 0 / 0.5) or rgb(255 0 0 / 50%)) or CSS L3 (rgba(255, 0, 0, 0.5))
  const slashIdx = argStr.indexOf('/');
  const valuesStr = slashIdx >= 0 ? argStr.slice(0, slashIdx) : argStr;

  let alphaStr = slashIdx >= 0 ? argStr.slice(slashIdx + 1).trim() : undefined;

  const tokens = valuesStr.split(/[,\s]+/).filter(Boolean);

  if (alphaStr === undefined && tokens.length === 4) {
    alphaStr = tokens.pop();
  }

  if (tokens.length !== 3) {
    return undefined;
  }

  const percent = (max: number) => (value: string) => parsePercent(value, max);

  const parsers = {
    rgb: [percent(255), percent(255), percent(255)],
    hsl: [parseAngle, percent(100), percent(100)],
    hwb: [parseAngle, percent(100), percent(100)],
    lab: [percent(100), percent(125), percent(125)],
    lch: [percent(100), percent(150), parseAngle],
    oklch: [percent(1), percent(0.4), parseAngle],
    oklab: [percent(1), percent(0.4), percent(0.4)],
  };

  try {
    const parts = parsers[type].map((parseChannel, index) =>
      parseChannel(tokens[index])
    );

    const a = alphaStr === undefined ? 1 : parseAlpha(alphaStr);

    parts.push(a);

    return { type, parts };
  } catch {
    return undefined;
  }
}

function stringify(color: ParsedColor): string {
  const [p0, p1, p2, rawA] = color.parts;
  const a = trim(clamp(rawA, 0, 1));

  // Legacy CSS L3: name(v1, v2, v3) / namea(v1, v2, v3, alpha)
  const legacy = (
    name: string,
    v1: string | number,
    v2: string | number,
    v3: string | number
  ) =>
    a < 1
      ? `${name}a(${v1}, ${v2}, ${v3}, ${a})`
      : `${name}(${v1}, ${v2}, ${v3})`;

  // Modern CSS L4: name(v1 v2 v3) / name(v1 v2 v3 / alpha)
  const modern = (
    name: string,
    v1: string | number,
    v2: string | number,
    v3: string | number
  ) =>
    a < 1 ? `${name}(${v1} ${v2} ${v3} / ${a})` : `${name}(${v1} ${v2} ${v3})`;

  switch (color.type) {
    case 'rgb':
      return legacy(
        'rgb',
        clamp(Math.round(p0), 0, 255),
        clamp(Math.round(p1), 0, 255),
        clamp(Math.round(p2), 0, 255)
      );
    case 'hsl':
      return legacy(
        'hsl',
        trim(p0),
        `${trim(clamp(p1, 0, 100))}%`,
        `${trim(clamp(p2, 0, 100))}%`
      );
    case 'hwb':
      return modern(
        'hwb',
        trim(p0),
        `${trim(clamp(p1, 0, 100))}%`,
        `${trim(clamp(p2, 0, 100))}%`
      );
    case 'lab':
      return modern(
        'lab',
        trim(clamp(p0, 0, 100)),
        trim(clamp(p1, -125, 125)),
        trim(clamp(p2, -125, 125))
      );
    case 'oklab':
      return modern(
        'oklab',
        trim(clamp(p0, 0, 1)),
        trim(clamp(p1, -0.4, 0.4)),
        trim(clamp(p2, -0.4, 0.4))
      );
    case 'lch':
      return modern(
        'lch',
        trim(clamp(p0, 0, 100)),
        trim(clamp(p1, 0, 150)),
        trim(p2)
      );
    case 'oklch':
      return modern(
        'oklch',
        trim(clamp(p0, 0, 1)),
        trim(clamp(p1, 0, 0.4)),
        trim(p2)
      );
    default: {
      const _exhaustiveCheck: never = color.type;

      return _exhaustiveCheck;
    }
  }
}

function darken(color: ParsedColor, amount: number): ColorType {
  const factor = 1 - amount;
  const parts = color.parts.slice();

  switch (color.type) {
    case 'lab':
    case 'lch':
    case 'oklab':
    case 'oklch':
      parts[0] *= factor;

      return build({ type: color.type, parts });
    case 'hsl':
      parts[2] *= factor;

      return build({ type: 'hsl', parts });
    case 'rgb':
    case 'hwb': {
      const [r, g, b] =
        color.type === 'hwb' ? hwbToRgb(parts[0], parts[1], parts[2]) : parts;

      const [h, s, l] = rgbToHsl(r, g, b);

      return build({ type: 'hsl', parts: [h, s, l * factor, parts[3]] });
    }
    default: {
      const _exhaustiveCheck: never = color.type;

      return _exhaustiveCheck;
    }
  }
}

// YIQ luma midpoint (0-255)
// https://en.wikipedia.org/wiki/YIQ
const YIQ_LIGHT_THRESHOLD = 128;

// Rec. 601 luma coefficients (sum to 1.0)
const YIQ_WEIGHT_R = 0.299;
const YIQ_WEIGHT_G = 0.587;
const YIQ_WEIGHT_B = 0.114;

function isLight(color: ParsedColor): boolean {
  let rgb: [number, number, number];

  switch (color.type) {
    case 'lab':
    case 'lch':
      return color.parts[0] > 50;
    case 'oklab':
    case 'oklch':
      return color.parts[0] > 0.5;
    case 'rgb':
      rgb = [color.parts[0], color.parts[1], color.parts[2]];
      break;
    case 'hsl':
      rgb = hslToRgb(color.parts[0], color.parts[1], color.parts[2]);
      break;
    case 'hwb':
      rgb = hwbToRgb(color.parts[0], color.parts[1], color.parts[2]);
      break;
    default: {
      const _exhaustiveCheck: never = color.type;

      return _exhaustiveCheck;
    }
  }

  const yiq =
    YIQ_WEIGHT_R * rgb[0] + YIQ_WEIGHT_G * rgb[1] + YIQ_WEIGHT_B * rgb[2];

  return yiq > YIQ_LIGHT_THRESHOLD;
}

function trim(n: number): number {
  return Number(n.toFixed(3));
}

function clamp(n: number, min: number, max: number): number {
  return n < min ? min : n > max ? max : n;
}

function parseNumber(s: string): number {
  const n = Number(s);

  if (s === '' || Number.isNaN(n)) {
    throw new Error(`Invalid number: ${s}`);
  }

  return n;
}

function parsePercent(s: string, max: number): number {
  if (s.endsWith('%')) {
    return (parseNumber(s.slice(0, -1)) / 100) * max;
  }

  return parseNumber(s);
}

function parseAngle(s: string): number {
  let degrees: number;

  if (s.endsWith('grad')) {
    degrees = parseNumber(s.slice(0, -4)) * 0.9;
  } else if (s.endsWith('turn')) {
    degrees = parseNumber(s.slice(0, -4)) * 360;
  } else if (s.endsWith('rad')) {
    degrees = (parseNumber(s.slice(0, -3)) * 180) / Math.PI;
  } else if (s.endsWith('deg')) {
    degrees = parseNumber(s.slice(0, -3));
  } else {
    degrees = parseNumber(s);
  }

  return ((degrees % 360) + 360) % 360;
}

function parseAlpha(s: string): number {
  return s.endsWith('%') ? parseNumber(s.slice(0, -1)) / 100 : parseNumber(s);
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    return [0, 0, l * 100];
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;

  if (max === r) {
    h = (g - b) / d + (g < b ? 6 : 0);
  } else if (max === g) {
    h = (b - r) / d + 2;
  } else {
    h = (r - g) / d + 4;
  }

  return [h * 60, s * 100, l * 100];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;

  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const huePrime = (((h % 360) + 360) % 360) / 60;
  const secondary = chroma * (1 - Math.abs((huePrime % 2) - 1));
  const lightnessOffset = l - chroma / 2;

  let redPrime: number;
  let greenPrime: number;
  let bluePrime: number;

  if (huePrime < 1) {
    [redPrime, greenPrime, bluePrime] = [chroma, secondary, 0];
  } else if (huePrime < 2) {
    [redPrime, greenPrime, bluePrime] = [secondary, chroma, 0];
  } else if (huePrime < 3) {
    [redPrime, greenPrime, bluePrime] = [0, chroma, secondary];
  } else if (huePrime < 4) {
    [redPrime, greenPrime, bluePrime] = [0, secondary, chroma];
  } else if (huePrime < 5) {
    [redPrime, greenPrime, bluePrime] = [secondary, 0, chroma];
  } else {
    [redPrime, greenPrime, bluePrime] = [chroma, 0, secondary];
  }

  return [
    (redPrime + lightnessOffset) * 255,
    (greenPrime + lightnessOffset) * 255,
    (bluePrime + lightnessOffset) * 255,
  ];
}

function hwbToRgb(h: number, w: number, b: number): [number, number, number] {
  const whiteRatio = w / 100;
  const blackRatio = b / 100;

  if (whiteRatio + blackRatio >= 1) {
    const gray = (whiteRatio / (whiteRatio + blackRatio)) * 255;

    return [gray, gray, gray];
  }

  const [pureRed, pureGreen, pureBlue] = hslToRgb(h, 100, 50);
  const factor = 1 - whiteRatio - blackRatio;

  return [
    pureRed * factor + whiteRatio * 255,
    pureGreen * factor + whiteRatio * 255,
    pureBlue * factor + whiteRatio * 255,
  ];
}

const COLOR_TYPES = [
  'rgb',
  'hsl',
  'hwb',
  'lab',
  'lch',
  'oklch',
  'oklab',
] as const;

const NAMED_COLORS: Record<string, [number, number, number]> = {
  aliceblue: [240, 248, 255],
  antiquewhite: [250, 235, 215],
  aqua: [0, 255, 255],
  aquamarine: [127, 255, 212],
  azure: [240, 255, 255],
  beige: [245, 245, 220],
  bisque: [255, 228, 196],
  black: [0, 0, 0],
  blanchedalmond: [255, 235, 205],
  blue: [0, 0, 255],
  blueviolet: [138, 43, 226],
  brown: [165, 42, 42],
  burntsienna: [234, 126, 93],
  burlywood: [222, 184, 135],
  cadetblue: [95, 158, 160],
  chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30],
  coral: [255, 127, 80],
  cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220],
  crimson: [220, 20, 60],
  cyan: [0, 255, 255],
  darkblue: [0, 0, 139],
  darkcyan: [0, 139, 139],
  darkgoldenrod: [184, 134, 11],
  darkgray: [169, 169, 169],
  darkgreen: [0, 100, 0],
  darkgrey: [169, 169, 169],
  darkkhaki: [189, 183, 107],
  darkmagenta: [139, 0, 139],
  darkolivegreen: [85, 107, 47],
  darkorange: [255, 140, 0],
  darkorchid: [153, 50, 204],
  darkred: [139, 0, 0],
  darksalmon: [233, 150, 122],
  darkseagreen: [143, 188, 143],
  darkslateblue: [72, 61, 139],
  darkslategray: [47, 79, 79],
  darkslategrey: [47, 79, 79],
  darkturquoise: [0, 206, 209],
  darkviolet: [148, 0, 211],
  deeppink: [255, 20, 147],
  deepskyblue: [0, 191, 255],
  dimgray: [105, 105, 105],
  dimgrey: [105, 105, 105],
  dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34],
  floralwhite: [255, 250, 240],
  forestgreen: [34, 139, 34],
  fuchsia: [255, 0, 255],
  gainsboro: [220, 220, 220],
  ghostwhite: [248, 248, 255],
  gold: [255, 215, 0],
  goldenrod: [218, 165, 32],
  gray: [128, 128, 128],
  green: [0, 128, 0],
  greenyellow: [173, 255, 47],
  grey: [128, 128, 128],
  honeydew: [240, 255, 240],
  hotpink: [255, 105, 180],
  indianred: [205, 92, 92],
  indigo: [75, 0, 130],
  ivory: [255, 255, 240],
  khaki: [240, 230, 140],
  lavender: [230, 230, 250],
  lavenderblush: [255, 240, 245],
  lawngreen: [124, 252, 0],
  lemonchiffon: [255, 250, 205],
  lightblue: [173, 216, 230],
  lightcoral: [240, 128, 128],
  lightcyan: [224, 255, 255],
  lightgoldenrodyellow: [250, 250, 210],
  lightgray: [211, 211, 211],
  lightgreen: [144, 238, 144],
  lightgrey: [211, 211, 211],
  lightpink: [255, 182, 193],
  lightsalmon: [255, 160, 122],
  lightseagreen: [32, 178, 170],
  lightskyblue: [135, 206, 250],
  lightslategray: [119, 136, 153],
  lightslategrey: [119, 136, 153],
  lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224],
  lime: [0, 255, 0],
  limegreen: [50, 205, 50],
  linen: [250, 240, 230],
  magenta: [255, 0, 255],
  maroon: [128, 0, 0],
  mediumaquamarine: [102, 205, 170],
  mediumblue: [0, 0, 205],
  mediumorchid: [186, 85, 211],
  mediumpurple: [147, 112, 219],
  mediumseagreen: [60, 179, 113],
  mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154],
  mediumturquoise: [72, 209, 204],
  mediumvioletred: [199, 21, 133],
  midnightblue: [25, 25, 112],
  mintcream: [245, 255, 250],
  mistyrose: [255, 228, 225],
  moccasin: [255, 228, 181],
  navajowhite: [255, 222, 173],
  navy: [0, 0, 128],
  oldlace: [253, 245, 230],
  olive: [128, 128, 0],
  olivedrab: [107, 142, 35],
  orange: [255, 165, 0],
  orangered: [255, 69, 0],
  orchid: [218, 112, 214],
  palegoldenrod: [238, 232, 170],
  palegreen: [152, 251, 152],
  paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147],
  papayawhip: [255, 239, 213],
  peachpuff: [255, 218, 185],
  peru: [205, 133, 63],
  pink: [255, 192, 203],
  plum: [221, 160, 221],
  powderblue: [176, 224, 230],
  purple: [128, 0, 128],
  rebeccapurple: [102, 51, 153],
  red: [255, 0, 0],
  rosybrown: [188, 143, 143],
  royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19],
  salmon: [250, 128, 114],
  sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87],
  seashell: [255, 245, 238],
  sienna: [160, 82, 45],
  silver: [192, 192, 192],
  skyblue: [135, 206, 235],
  slateblue: [106, 90, 205],
  slategray: [112, 128, 144],
  slategrey: [112, 128, 144],
  snow: [255, 250, 250],
  springgreen: [0, 255, 127],
  steelblue: [70, 130, 180],
  tan: [210, 180, 140],
  teal: [0, 128, 128],
  thistle: [216, 191, 216],
  tomato: [255, 99, 71],
  turquoise: [64, 224, 208],
  violet: [238, 130, 238],
  wheat: [245, 222, 179],
  white: [255, 255, 255],
  whitesmoke: [245, 245, 245],
  yellow: [255, 255, 0],
  yellowgreen: [154, 205, 50],
};

const ANDROID_COLOR_MAP: Record<string, string> = {
  system_background_dark: 'system_on_background_dark',
  system_background_light: 'system_on_background_light',
  system_error_container_dark: 'system_on_error_container_dark',
  system_error_container_light: 'system_on_error_container_light',
  system_error_dark: 'system_on_error_dark',
  system_error_light: 'system_on_error_light',
  system_primary_container_dark: 'system_on_primary_container_dark',
  system_primary_container_light: 'system_on_primary_container_light',
  system_primary_dark: 'system_on_primary_dark',
  system_primary_fixed: 'system_on_primary_fixed',
  system_primary_light: 'system_on_primary_light',
  system_secondary_container_dark: 'system_on_secondary_container_dark',
  system_secondary_container_light: 'system_on_secondary_container_light',
  system_secondary_dark: 'system_on_secondary_dark',
  system_secondary_fixed: 'system_on_secondary_fixed',
  system_secondary_light: 'system_on_secondary_light',
  system_surface_dark: 'system_on_surface_dark',
  system_surface_disabled: 'system_on_surface_disabled',
  system_surface_light: 'system_on_surface_light',
  system_surface_variant_dark: 'system_on_surface_variant_dark',
  system_surface_variant_light: 'system_on_surface_variant_light',
};

const IOS_COLOR_MAP: Record<string, string> = {
  systemBackground: 'label',
  secondarySystemBackground: 'label',
  tertiarySystemBackground: 'label',
  systemGroupedBackground: 'label',
  secondarySystemGroupedBackground: 'label',
  tertiarySystemGroupedBackground: 'label',

  systemFill: 'label',
  secondarySystemFill: 'label',
  tertiarySystemFill: 'label',
  quaternarySystemFill: 'label',

  systemRed: 'white',
  systemGreen: 'white',
  systemBlue: 'white',
  systemIndigo: 'white',
  systemPurple: 'white',
  systemBrown: 'white',

  systemOrange: 'black',
  systemYellow: 'black',
  systemMint: 'black',
  systemTeal: 'black',
  systemCyan: 'black',
  systemPink: 'black',

  systemGray: 'label',
  systemGray2: 'label',
  systemGray3: 'label',
  systemGray4: 'label',
  systemGray5: 'label',
  systemGray6: 'label',
};
