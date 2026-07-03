import MaterialSymbolsOutlined100 from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsOutlined_100.woff2';
import MaterialSymbolsOutlined100Filled from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsOutlined_100_Filled.woff2';
import MaterialSymbolsOutlined200 from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsOutlined_200.woff2';
import MaterialSymbolsOutlined200Filled from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsOutlined_200_Filled.woff2';
import MaterialSymbolsOutlined300 from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsOutlined_300.woff2';
import MaterialSymbolsOutlined300Filled from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsOutlined_300_Filled.woff2';
import MaterialSymbolsOutlined400 from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsOutlined_400.woff2';
import MaterialSymbolsOutlined400Filled from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsOutlined_400_Filled.woff2';
import MaterialSymbolsOutlined500 from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsOutlined_500.woff2';
import MaterialSymbolsOutlined500Filled from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsOutlined_500_Filled.woff2';
import MaterialSymbolsOutlined600 from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsOutlined_600.woff2';
import MaterialSymbolsOutlined600Filled from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsOutlined_600_Filled.woff2';
import MaterialSymbolsOutlined700 from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsOutlined_700.woff2';
import MaterialSymbolsOutlined700Filled from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsOutlined_700_Filled.woff2';
import MaterialSymbolsRounded100 from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsRounded_100.woff2';
import MaterialSymbolsRounded100Filled from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsRounded_100_Filled.woff2';
import MaterialSymbolsRounded200 from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsRounded_200.woff2';
import MaterialSymbolsRounded200Filled from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsRounded_200_Filled.woff2';
import MaterialSymbolsRounded300 from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsRounded_300.woff2';
import MaterialSymbolsRounded300Filled from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsRounded_300_Filled.woff2';
import MaterialSymbolsRounded400 from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsRounded_400.woff2';
import MaterialSymbolsRounded400Filled from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsRounded_400_Filled.woff2';
import MaterialSymbolsRounded500 from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsRounded_500.woff2';
import MaterialSymbolsRounded500Filled from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsRounded_500_Filled.woff2';
import MaterialSymbolsRounded600 from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsRounded_600.woff2';
import MaterialSymbolsRounded600Filled from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsRounded_600_Filled.woff2';
import MaterialSymbolsRounded700 from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsRounded_700.woff2';
import MaterialSymbolsRounded700Filled from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsRounded_700_Filled.woff2';
import MaterialSymbolsSharp100 from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsSharp_100.woff2';
import MaterialSymbolsSharp100Filled from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsSharp_100_Filled.woff2';
import MaterialSymbolsSharp200 from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsSharp_200.woff2';
import MaterialSymbolsSharp200Filled from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsSharp_200_Filled.woff2';
import MaterialSymbolsSharp300 from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsSharp_300.woff2';
import MaterialSymbolsSharp300Filled from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsSharp_300_Filled.woff2';
import MaterialSymbolsSharp400 from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsSharp_400.woff2';
import MaterialSymbolsSharp400Filled from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsSharp_400_Filled.woff2';
import MaterialSymbolsSharp500 from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsSharp_500.woff2';
import MaterialSymbolsSharp500Filled from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsSharp_500_Filled.woff2';
import MaterialSymbolsSharp600 from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsSharp_600.woff2';
import MaterialSymbolsSharp600Filled from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsSharp_600_Filled.woff2';
import MaterialSymbolsSharp700 from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsSharp_700.woff2';
import MaterialSymbolsSharp700Filled from '@react-navigation/material-symbols/assets/fonts/MaterialSymbolsSharp_700_Filled.woff2';
import type { ImageSourcePropType, ViewStyle } from 'react-native';

import { FONT_WEIGHTS } from './constants';
import type { MaterialSymbolOptions } from './types';

export type MaterialSymbolProps = MaterialSymbolOptions & {
  /**
   * Style object for the symbol.
   */
  style?: (React.CSSProperties & ViewStyle) | undefined;
};

const FONTS = {
  MaterialSymbolsOutlined: {
    100: MaterialSymbolsOutlined100,
    200: MaterialSymbolsOutlined200,
    300: MaterialSymbolsOutlined300,
    400: MaterialSymbolsOutlined400,
    500: MaterialSymbolsOutlined500,
    600: MaterialSymbolsOutlined600,
    700: MaterialSymbolsOutlined700,
  },
  MaterialSymbolsOutlinedFilled: {
    100: MaterialSymbolsOutlined100Filled,
    200: MaterialSymbolsOutlined200Filled,
    300: MaterialSymbolsOutlined300Filled,
    400: MaterialSymbolsOutlined400Filled,
    500: MaterialSymbolsOutlined500Filled,
    600: MaterialSymbolsOutlined600Filled,
    700: MaterialSymbolsOutlined700Filled,
  },
  MaterialSymbolsRounded: {
    100: MaterialSymbolsRounded100,
    200: MaterialSymbolsRounded200,
    300: MaterialSymbolsRounded300,
    400: MaterialSymbolsRounded400,
    500: MaterialSymbolsRounded500,
    600: MaterialSymbolsRounded600,
    700: MaterialSymbolsRounded700,
  },
  MaterialSymbolsRoundedFilled: {
    100: MaterialSymbolsRounded100Filled,
    200: MaterialSymbolsRounded200Filled,
    300: MaterialSymbolsRounded300Filled,
    400: MaterialSymbolsRounded400Filled,
    500: MaterialSymbolsRounded500Filled,
    600: MaterialSymbolsRounded600Filled,
    700: MaterialSymbolsRounded700Filled,
  },
  MaterialSymbolsSharp: {
    100: MaterialSymbolsSharp100,
    200: MaterialSymbolsSharp200,
    300: MaterialSymbolsSharp300,
    400: MaterialSymbolsSharp400,
    500: MaterialSymbolsSharp500,
    600: MaterialSymbolsSharp600,
    700: MaterialSymbolsSharp700,
  },
  MaterialSymbolsSharpFilled: {
    100: MaterialSymbolsSharp100Filled,
    200: MaterialSymbolsSharp200Filled,
    300: MaterialSymbolsSharp300Filled,
    400: MaterialSymbolsSharp400Filled,
    500: MaterialSymbolsSharp500Filled,
    600: MaterialSymbolsSharp600Filled,
    700: MaterialSymbolsSharp700Filled,
  },
};

const FONT_FAMILIES = {
  unfilled: {
    outlined: 'MaterialSymbolsOutlined',
    rounded: 'MaterialSymbolsRounded',
    sharp: 'MaterialSymbolsSharp',
  },
  filled: {
    outlined: 'MaterialSymbolsOutlinedFilled',
    rounded: 'MaterialSymbolsRoundedFilled',
    sharp: 'MaterialSymbolsSharpFilled',
  },
} satisfies Record<string, Record<string, keyof typeof FONTS>>;

const ID = `__react-navigation_native_MaterialSymbol`;

const CSS_TEXT = [
  ...Object.entries(FONTS).flatMap(([family, weights]) =>
    Object.entries(weights).map(
      ([weight, url]) => /* css */ `
        @font-face {
          font-family: '${family}';
          font-style: normal;
          font-weight: ${weight};
          font-display: block;
          src: url('${url}') format('woff2');
        }
      `
    )
  ),
  /* css */ `
    .${ID}::before {
      content: attr(data-name);
    }
  `,
].join('\n');

export function MaterialSymbol({
  name,
  variant = 'outlined',
  weight = 400,
  fill = false,
  size = 24,
  color = 'black',
  style,
}: MaterialSymbolProps): React.ReactElement {
  if (typeof color !== 'string') {
    throw new Error(
      `Invalid color value ${JSON.stringify(color)} for Material Symbol "${name}".`
    );
  }

  return (
    <>
      <style href={ID} precedence="material-symbol">
        {CSS_TEXT}
      </style>
      <span
        aria-hidden
        className={ID}
        data-name={name}
        style={{
          boxSizing: 'border-box',
          color,
          direction: 'ltr',
          display: 'inline-block',
          flexShrink: 0,
          fontFamily: FONT_FAMILIES[fill ? 'filled' : 'unfilled'][variant],
          fontWeight:
            typeof weight === 'string' ? FONT_WEIGHTS[weight] : weight,
          fontSize: size,
          fontStyle: 'normal',
          letterSpacing: 'normal',
          textTransform: 'none',
          whiteSpace: 'nowrap',
          wordWrap: 'normal',
          lineHeight: `${size}px`,
          textAlign: 'center',
          userSelect: 'none',
          width: size,
          height: size,
          overflow: 'hidden',
          ...style,
        }}
      />
    </>
  );
}

MaterialSymbol.getImageSource = (
  _: MaterialSymbolOptions
): ImageSourcePropType => {
  throw new Error(
    'MaterialSymbol.getImageSource is only supported on Android.'
  );
};
