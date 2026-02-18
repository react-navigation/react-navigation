import * as React from 'react';
import {
  type ColorValue,
  type GestureResponderEvent,
  Platform,
  Pressable,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import {
  clearZoomTransitionRouteConfig,
  setZoomTransitionRouteConfig,
  setZoomTransitionSource,
} from '../native/NativeStackZoomTransitionModule';
import ZoomAnchorNativeComponent from '../native/ZoomAnchorNativeComponent';
import type { NativeStackZoomTransitionDimmingBlurEffect } from '../types';
import { ZoomTransitionRouteKeyContext } from '../utils/ZoomTransitionRouteKeyContext';

type ZoomAnchorAlignmentRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type ZoomAnchorProps = ViewProps & {
  id: string;
  alignmentRect?: ZoomAnchorAlignmentRect;
};

function ZoomAnchor({ id, alignmentRect, ...rest }: ZoomAnchorProps) {
  const routeKey = React.useContext(ZoomTransitionRouteKeyContext);

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
      hasAlignmentRect={alignmentRect != null}
      alignmentRectX={alignmentRect?.x ?? 0}
      alignmentRectY={alignmentRect?.y ?? 0}
      alignmentRectWidth={alignmentRect?.width ?? 0}
      alignmentRectHeight={alignmentRect?.height ?? 0}
    />
  );
}

const ZoomSourceIdContext = React.createContext<string | null>(null);

export type ZoomSourceButtonProps = {
  id: string;
  onPress: (e: GestureResponderEvent) => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function ZoomSourceButton({
  id,
  children,
  ...rest
}: ZoomSourceButtonProps) {
  const onPress = (e: GestureResponderEvent) => {
    setZoomTransitionSource(id);
    rest.onPress(e);
  };

  return (
    <ZoomSourceIdContext.Provider value={id}>
      <Pressable {...rest} onPress={onPress}>
        {children}
      </Pressable>
    </ZoomSourceIdContext.Provider>
  );
}

export type ZoomSourceAnchorProps = Omit<ZoomAnchorProps, 'id'>;

export function ZoomSourceAnchor(props: ZoomSourceAnchorProps) {
  const id = React.useContext(ZoomSourceIdContext);

  if (id == null) {
    throw new Error(
      '`ZoomSourceAnchor` must be rendered inside `ZoomSourceButton`.'
    );
  }

  return <ZoomAnchor {...props} id={id} />;
}

export type ZoomTargetProps = Omit<ZoomAnchorProps, 'id'> & {
  id: string;
  sourceId?: string;
  dimmingColor?: ColorValue;
  dimmingBlurEffect?: NativeStackZoomTransitionDimmingBlurEffect;
  interactiveDismissEnabled?: boolean;
};

export function ZoomTarget({
  id,
  sourceId,
  dimmingColor,
  dimmingBlurEffect,
  interactiveDismissEnabled,
  ...rest
}: ZoomTargetProps) {
  const routeKey = React.useContext(ZoomTransitionRouteKeyContext);

  if (Platform.OS === 'ios' && routeKey == null) {
    throw new Error(
      '`ZoomTarget` must be rendered inside a native-stack screen.'
    );
  }

  React.useLayoutEffect(() => {
    if (Platform.OS !== 'ios' || routeKey == null) {
      return;
    }

    setZoomTransitionRouteConfig({
      routeKey,
      sourceId: sourceId ?? id,
      targetId: id,
      dimmingColor,
      dimmingBlurEffect,
      interactiveDismissEnabled,
    });

    return () => {
      clearZoomTransitionRouteConfig(routeKey);
    };
  }, [
    dimmingBlurEffect,
    dimmingColor,
    id,
    interactiveDismissEnabled,
    routeKey,
    sourceId,
  ]);

  return <ZoomAnchor {...rest} id={id} />;
}
