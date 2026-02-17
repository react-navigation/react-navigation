import * as React from 'react';
import { Platform, View, type ViewProps } from 'react-native';
import warnOnce from 'warn-once';

import ZoomAnchorNativeComponent from './native/ZoomAnchorNativeComponent';
import { ZoomTransitionRouteKeyContext } from './utils/ZoomTransitionRouteKeyContext';

export type ZoomAnchorAlignmentRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ZoomAnchorProps = ViewProps & {
  id: string;
  alignmentRect?: ZoomAnchorAlignmentRect;
};

type NativeAlignmentRectProps = {
  hasAlignmentRect: boolean;
  alignmentRectX: number;
  alignmentRectY: number;
  alignmentRectWidth: number;
  alignmentRectHeight: number;
};

function getNativeAlignmentRectProps(
  alignmentRect?: ZoomAnchorAlignmentRect
): NativeAlignmentRectProps {
  if (alignmentRect == null) {
    return {
      hasAlignmentRect: false,
      alignmentRectX: 0,
      alignmentRectY: 0,
      alignmentRectWidth: 0,
      alignmentRectHeight: 0,
    };
  }

  const { x, y, width, height } = alignmentRect;
  const isValid =
    Number.isFinite(x) &&
    Number.isFinite(y) &&
    Number.isFinite(width) &&
    Number.isFinite(height) &&
    width > 0 &&
    height > 0;

  if (!isValid) {
    if (__DEV__) {
      warnOnce(
        true,
        '[native-stack] `ZoomAnchor` received invalid `alignmentRect`. It must contain finite `x`, `y`, `width`, `height` with positive `width` and `height`.'
      );
    }

    return {
      hasAlignmentRect: false,
      alignmentRectX: 0,
      alignmentRectY: 0,
      alignmentRectWidth: 0,
      alignmentRectHeight: 0,
    };
  }

  return {
    hasAlignmentRect: true,
    alignmentRectX: x,
    alignmentRectY: y,
    alignmentRectWidth: width,
    alignmentRectHeight: height,
  };
}

export function ZoomAnchor({ id, alignmentRect, ...rest }: ZoomAnchorProps) {
  const routeKey = React.useContext(ZoomTransitionRouteKeyContext);
  const nativeAlignmentRect = getNativeAlignmentRectProps(alignmentRect);

  if (Platform.OS !== 'ios') {
    return <View {...rest} />;
  }

  if (routeKey == null) {
    throw new Error(
      '`ZoomAnchor` must be rendered inside a native-stack screen.'
    );
  }

  return (
    <ZoomAnchorNativeComponent
      {...rest}
      routeKey={routeKey}
      triggerId={id}
      hasAlignmentRect={nativeAlignmentRect.hasAlignmentRect}
      alignmentRectX={nativeAlignmentRect.alignmentRectX}
      alignmentRectY={nativeAlignmentRect.alignmentRectY}
      alignmentRectWidth={nativeAlignmentRect.alignmentRectWidth}
      alignmentRectHeight={nativeAlignmentRect.alignmentRectHeight}
    />
  );
}
