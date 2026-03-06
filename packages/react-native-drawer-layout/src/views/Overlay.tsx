import type { OverlayProps } from '../types';

export function Overlay({
  open,
  onPress,
  style,
  accessibilityLabel = 'Close drawer',
}: OverlayProps<React.CSSProperties>) {
  return (
    <div
      style={{
        ...styles.overlay,
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        ...style,
      }}
      aria-hidden={!open}
    >
      <button
        type="button"
        onClick={onPress}
        style={{
          ...styles.pressable,
          pointerEvents: open ? 'auto' : 'none',
        }}
        aria-label={accessibilityLabel}
      />
    </div>
  );
}

const styles = {
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    WebkitTapHighlightColor: 'transparent',
    transition: 'opacity 0.3s',
  },
  pressable: {
    display: 'flex',
    flex: 1,
    border: 'none',
    background: 'transparent',
    padding: 0,
    cursor: 'pointer',
  },
} satisfies Record<string, React.CSSProperties>;
