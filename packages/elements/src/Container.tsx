import { Platform, View } from 'react-native';

type Props = {
  inert?: boolean;
  children: React.ReactNode;
};

export function Container({ inert, children }: Props) {
  if (Platform.OS === 'web') {
    return (
      <div inert={inert} aria-hidden={inert} style={DEFAULT_STYLE}>
        {children}
      </div>
    );
  }

  return (
    <View
      aria-hidden={inert}
      style={{
        pointerEvents: inert ? 'none' : 'auto',
      }}
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
