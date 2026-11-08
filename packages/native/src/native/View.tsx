import type { HostInstance, ViewStyle } from 'react-native';

type Props = {
  ref?: React.Ref<HostInstance | HTMLDivElement> | undefined;
  style?: (React.CSSProperties & ViewStyle) | undefined;
  children?: React.ReactNode;
};

export function View({ ref, style, children }: Props) {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        minHeight: 0,
        minWidth: 0,
        position: 'relative',
        ...style,
      }}
      // @ts-expect-error: the ref type covers native views too, but union produces type error
      ref={ref}
    >
      {children}
    </div>
  );
}
