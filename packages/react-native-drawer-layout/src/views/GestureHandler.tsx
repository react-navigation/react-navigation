import * as React from 'react';
import type { GestureType } from 'react-native-gesture-handler';

// FIXME: Inline this type instead of getting it from react-native-gesture-handler
// Otherwise, we get a type error:
// Exported variable 'GestureDetector' has or is using name 'GestureDetectorProps' from external module ".." but cannot be named.
type GestureDetectorProps = {
  gesture: GestureType | undefined;
  userSelect?: 'none' | 'auto' | 'text';
  children: React.ReactNode;
};

export const GestureDetector = ({
  gesture: _0,
  userSelect: _1,
  children,
}: GestureDetectorProps) => {
  return <>{children}</>;
};

export function GestureHandlerRootView({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export const Gesture:
  | typeof import('react-native-gesture-handler').Gesture
  | undefined = undefined;

export const enum GestureState {
  UNDETERMINED = 0,
  FAILED = 1,
  BEGAN = 2,
  CANCELLED = 3,
  ACTIVE = 4,
  END = 5,
}
