import { Platform, View, type ViewStyle } from 'react-native';

export type Props = {
  ref?: React.Ref<HTMLDivElement | View>;
  inert?: boolean;
  style?: ViewStyle &
    Omit<React.CSSProperties, 'backgroundColor'> & {
      backgroundColor?: ViewStyle['backgroundColor'];
    };
  children: React.ReactNode;
};

export function Container({ ref, inert, children, style }: Props) {
  if (Platform.OS === 'web') {
    const { backgroundColor, ...rest } = style ?? {};

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement> | undefined}
        inert={inert}
        aria-hidden={inert}
        style={{
          ...DEFAULT_STYLE,
          ...rest,
          backgroundColor:
            // In practice we only get string on web instead of OpaqueValue
            typeof backgroundColor === 'string' ? backgroundColor : undefined,
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <View
      ref={ref as React.Ref<View> | undefined}
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
