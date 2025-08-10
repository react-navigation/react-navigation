import { Platform, View, type ViewStyle } from 'react-native';

export type Props = {
  'inert'?: boolean;
  'aria-hidden'?: boolean;
  'style'?: React.CSSProperties & ViewStyle;
  'children': React.ReactNode;
};

export function Container({
  inert,
  'aria-hidden': ariaHiddenCustom,
  children,
  style,
}: Props) {
  const ariaHidden =
    inert !== true && ariaHiddenCustom !== undefined ? ariaHiddenCustom : inert;

  if (Platform.OS === 'web') {
    return (
      <div
        inert={inert}
        aria-hidden={ariaHidden}
        style={{ ...DEFAULT_STYLE, ...style }}
      >
        {children}
      </div>
    );
  }

  return (
    <View
      aria-hidden={ariaHidden}
      style={[{ pointerEvents: inert ? 'none' : 'box-none' }, style]}
      collapsable={false}
    >
      {children}
    </View>
  );
}

const DEFAULT_STYLE = {
  display: 'flex',
  alignContent: 'flex-start',
  alignItems: 'stretch',
  boxSizing: 'border-box',
  flexBasis: 'auto',
  flexDirection: 'column',
  flexShrink: 0,
  minHeight: 0,
  minWidth: 0,
  position: 'relative',
} as const satisfies React.CSSProperties;
