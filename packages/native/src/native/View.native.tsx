import {
  type HostInstance,
  View as NativeView,
  type ViewStyle,
} from 'react-native';

type Props = {
  ref?: React.Ref<HostInstance | HTMLDivElement> | undefined;
  style?: (React.CSSProperties & ViewStyle) | undefined;
  children?: React.ReactNode;
};

export function View({ ref, style, children }: Props) {
  return (
    <NativeView
      style={[style, { pointerEvents: 'box-none' }]}
      // @ts-expect-error: the ref type covers the div on Web too, but union produces type error
      ref={ref}
    >
      {children}
    </NativeView>
  );
}
