import MaterialSymbolsOutlined100 from '@react-navigation/native/assets/fonts/MaterialSymbolsOutlined_100.woff2';
import MaterialSymbolsOutlined200 from '@react-navigation/native/assets/fonts/MaterialSymbolsOutlined_200.woff2';
import MaterialSymbolsOutlined300 from '@react-navigation/native/assets/fonts/MaterialSymbolsOutlined_300.woff2';
import MaterialSymbolsOutlined400 from '@react-navigation/native/assets/fonts/MaterialSymbolsOutlined_400.woff2';
import MaterialSymbolsOutlined500 from '@react-navigation/native/assets/fonts/MaterialSymbolsOutlined_500.woff2';
import MaterialSymbolsOutlined600 from '@react-navigation/native/assets/fonts/MaterialSymbolsOutlined_600.woff2';
import MaterialSymbolsOutlined700 from '@react-navigation/native/assets/fonts/MaterialSymbolsOutlined_700.woff2';
import MaterialSymbolsRounded100 from '@react-navigation/native/assets/fonts/MaterialSymbolsRounded_100.woff2';
import MaterialSymbolsRounded200 from '@react-navigation/native/assets/fonts/MaterialSymbolsRounded_200.woff2';
import MaterialSymbolsRounded300 from '@react-navigation/native/assets/fonts/MaterialSymbolsRounded_300.woff2';
import MaterialSymbolsRounded400 from '@react-navigation/native/assets/fonts/MaterialSymbolsRounded_400.woff2';
import MaterialSymbolsRounded500 from '@react-navigation/native/assets/fonts/MaterialSymbolsRounded_500.woff2';
import MaterialSymbolsRounded600 from '@react-navigation/native/assets/fonts/MaterialSymbolsRounded_600.woff2';
import MaterialSymbolsRounded700 from '@react-navigation/native/assets/fonts/MaterialSymbolsRounded_700.woff2';
import MaterialSymbolsSharp100 from '@react-navigation/native/assets/fonts/MaterialSymbolsSharp_100.woff2';
import MaterialSymbolsSharp200 from '@react-navigation/native/assets/fonts/MaterialSymbolsSharp_200.woff2';
import MaterialSymbolsSharp300 from '@react-navigation/native/assets/fonts/MaterialSymbolsSharp_300.woff2';
import MaterialSymbolsSharp400 from '@react-navigation/native/assets/fonts/MaterialSymbolsSharp_400.woff2';
import MaterialSymbolsSharp500 from '@react-navigation/native/assets/fonts/MaterialSymbolsSharp_500.woff2';
import MaterialSymbolsSharp600 from '@react-navigation/native/assets/fonts/MaterialSymbolsSharp_600.woff2';
import MaterialSymbolsSharp700 from '@react-navigation/native/assets/fonts/MaterialSymbolsSharp_700.woff2';
import { type ImageSourcePropType, Text, type ViewProps } from 'react-native';

import { FONT_WEIGHTS } from './constants';
import type { MaterialSymbolOptions } from './types';

export type MaterialSymbolProps = MaterialSymbolOptions & ViewProps;

const VARIANTS = ['outlined', 'rounded', 'sharp'] as const;
const WEIGHTS = [100, 200, 300, 400, 500, 600, 700] as const;

const FONT_FAMILIES = {
  outlined: 'MaterialSymbolsOutlined',
  rounded: 'MaterialSymbolsRounded',
  sharp: 'MaterialSymbolsSharp',
};

const FONTS = {
  outlined: {
    100: MaterialSymbolsOutlined100,
    200: MaterialSymbolsOutlined200,
    300: MaterialSymbolsOutlined300,
    400: MaterialSymbolsOutlined400,
    500: MaterialSymbolsOutlined500,
    600: MaterialSymbolsOutlined600,
    700: MaterialSymbolsOutlined700,
  },
  rounded: {
    100: MaterialSymbolsRounded100,
    200: MaterialSymbolsRounded200,
    300: MaterialSymbolsRounded300,
    400: MaterialSymbolsRounded400,
    500: MaterialSymbolsRounded500,
    600: MaterialSymbolsRounded600,
    700: MaterialSymbolsRounded700,
  },
  sharp: {
    100: MaterialSymbolsSharp100,
    200: MaterialSymbolsSharp200,
    300: MaterialSymbolsSharp300,
    400: MaterialSymbolsSharp400,
    500: MaterialSymbolsSharp500,
    600: MaterialSymbolsSharp600,
    700: MaterialSymbolsSharp700,
  },
};

const STYLE_ID = `__react-navigation_native_MaterialSymbol`;

const CSS_TEXT = VARIANTS.flatMap((variant) =>
  WEIGHTS.map(
    (weight) => /* css */ `
      @font-face {
        font-family: '${FONT_FAMILIES[variant]}';
        font-style: normal;
        font-weight: ${weight};
        font-display: block;
        src: url('${FONTS[variant][weight]}') format('woff2');
      }
    `
  )
).join('\n');

export function MaterialSymbol({
  name,
  variant = 'outlined',
  weight = 400,
  size = 24,
  color = 'black',
  style,
  ...rest
}: MaterialSymbolProps): React.ReactElement {
  return (
    <>
      <style href={STYLE_ID} precedence="material-symbol">
        {CSS_TEXT}
      </style>
      <Text
        aria-hidden
        selectable={false}
        style={[
          {
            color,
            fontFamily: FONT_FAMILIES[variant],
            fontWeight:
              typeof weight === 'string' ? FONT_WEIGHTS[weight] : weight,
            fontSize: size,
            lineHeight: size,
            textAlign: 'center',
            writingDirection: 'ltr',
            width: size,
            height: size,
            overflow: 'hidden',
          },
          style,
        ]}
        {...rest}
      >
        {name}
      </Text>
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
