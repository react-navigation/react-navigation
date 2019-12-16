import * as React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { StackNavigationState } from '@react-navigation/routers';
import { Route, useTheme } from '@react-navigation/native';
import { Props as HeaderContainerProps } from '../Header/HeaderContainer';
import Card from './Card';
import { Scene, Layout, StackHeaderMode, TransitionPreset } from '../../types';

type Props = TransitionPreset & {
  index: number;
  active: boolean;
  focused: boolean;
  closing: boolean;
  layout: Layout;
  current: Animated.Value<number>;
  previousScene?: Scene<Route<string>>;
  scene: Scene<Route<string>>;
  state: StackNavigationState;
  safeAreaInsetTop: number;
  safeAreaInsetRight: number;
  safeAreaInsetBottom: number;
  safeAreaInsetLeft: number;
  cardOverlayEnabled?: boolean;
  cardShadowEnabled?: boolean;
  cardStyle?: StyleProp<ViewStyle>;
  animationEnabled?: boolean;
  getPreviousRoute: (props: {
    route: Route<string>;
  }) => Route<string> | undefined;
  renderHeader: (props: HeaderContainerProps) => React.ReactNode;
  renderScene: (props: { route: Route<string> }) => React.ReactNode;
  onOpenRoute: (props: { route: Route<string> }) => void;
  onCloseRoute: (props: { route: Route<string> }) => void;
  onGoBack: (props: { route: Route<string> }) => void;
  onTransitionStart?: (
    props: { route: Route<string> },
    closing: boolean
  ) => void;
  onTransitionEnd?: (props: { route: Route<string> }, closing: boolean) => void;
  onPageChangeStart?: () => void;
  onPageChangeConfirm?: () => void;
  onPageChangeCancel?: () => void;
  gestureEnabled?: boolean;
  gestureResponseDistance?: {
    vertical?: number;
    horizontal?: number;
  };
  gestureVelocityImpact?: number;
  headerMode: StackHeaderMode;
  headerShown?: boolean;
  headerTransparent?: boolean;
  floatingHeaderHeight: number;
};

export default function CardContainer({
  active,
  cardOverlayEnabled,
  cardShadowEnabled,
  cardStyle,
  cardStyleInterpolator,
  closing,
  current,
  floatingHeaderHeight,
  focused,
  gestureDirection,
  gestureEnabled,
  gestureResponseDistance,
  gestureVelocityImpact,
  getPreviousRoute,
  headerMode,
  headerShown,
  headerStyleInterpolator,
  headerTransparent,
  index,
  layout,
  onCloseRoute,
  onGoBack,
  onOpenRoute,
  onPageChangeCancel,
  onPageChangeConfirm,
  onPageChangeStart,
  onTransitionEnd,
  onTransitionStart,
  previousScene,
  renderHeader,
  renderScene,
  safeAreaInsetBottom,
  safeAreaInsetLeft,
  safeAreaInsetRight,
  safeAreaInsetTop,
  scene,
  state,
  transitionSpec,
}: Props) {
  const handleOpen = () => {
    onTransitionEnd && onTransitionEnd({ route: scene.route }, false);
    onOpenRoute({ route: scene.route });
  };

  const handleClose = () => {
    onTransitionEnd && onTransitionEnd({ route: scene.route }, true);
    onCloseRoute({ route: scene.route });
  };

  const handleTransitionStart = ({ closing }: { closing: boolean }) => {
    if (closing) {
      onPageChangeConfirm && onPageChangeConfirm();
    } else {
      onPageChangeCancel && onPageChangeCancel();
    }

    onTransitionStart && onTransitionStart({ route: scene.route }, closing);
    closing && onGoBack({ route: scene.route });
  };

  const insets = {
    top: safeAreaInsetTop,
    right: safeAreaInsetRight,
    bottom: safeAreaInsetBottom,
    left: safeAreaInsetLeft,
  };

  const { colors } = useTheme();

  return (
    <Card
      index={index}
      active={active}
      gestureDirection={gestureDirection}
      layout={layout}
      insets={insets}
      current={current}
      next={scene.progress.next}
      closing={closing}
      onOpen={handleOpen}
      onClose={handleClose}
      overlayEnabled={cardOverlayEnabled}
      shadowEnabled={cardShadowEnabled}
      onTransitionStart={handleTransitionStart}
      onGestureBegin={onPageChangeStart}
      onGestureCanceled={onPageChangeCancel}
      gestureEnabled={gestureEnabled}
      gestureResponseDistance={gestureResponseDistance}
      gestureVelocityImpact={gestureVelocityImpact}
      transitionSpec={transitionSpec}
      styleInterpolator={cardStyleInterpolator}
      accessibilityElementsHidden={!focused}
      importantForAccessibility={focused ? 'auto' : 'no-hide-descendants'}
      pointerEvents="box-none"
      containerStyle={
        headerMode === 'float' && !headerTransparent && headerShown !== false
          ? { marginTop: floatingHeaderHeight }
          : null
      }
      contentStyle={[{ backgroundColor: colors.background }, cardStyle]}
      style={StyleSheet.absoluteFill}
    >
      <View style={styles.container}>
        <View style={styles.scene}>{renderScene({ route: scene.route })}</View>
        {headerMode === 'screen'
          ? renderHeader({
              mode: 'screen',
              layout,
              insets,
              scenes: [previousScene, scene],
              state,
              getPreviousRoute,
              styleInterpolator: headerStyleInterpolator,
            })
          : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column-reverse',
  },
  scene: {
    flex: 1,
  },
});
