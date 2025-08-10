import { Platform, View, type ViewStyle } from 'react-native';

export type Props = {
  inert?: boolean;
  style?: React.CSSProperties & ViewStyle;
  children: React.ReactNode;
};

export function Container({ inert, children, style }: Props) {
  if (Platform.OS === 'web') {
    return (
      <div
        inert={inert}
        aria-hidden={inert}
        style={{ ...DEFAULT_STYLE, ...style }}
      >
        {children}
      </div>
    );
  }

  return (
    <View
      aria-hidden={inert}
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
