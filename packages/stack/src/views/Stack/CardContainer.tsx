import * as React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { StackNavigationState } from '@react-navigation/routers';
import { Route } from '@react-navigation/core';
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
  cardTransparent?: boolean;
  cardOverlayEnabled?: boolean;
  cardShadowEnabled?: boolean;
  cardStyle?: StyleProp<ViewStyle>;
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

export default class CardContainer extends React.PureComponent<Props> {
  private handleOpen = () => {
    const { scene, onTransitionEnd, onOpenRoute } = this.props;

    onTransitionEnd && onTransitionEnd({ route: scene.route }, false);
    onOpenRoute({ route: scene.route });
  };

  private handleClose = () => {
    const { scene, onTransitionEnd, onCloseRoute } = this.props;

    onTransitionEnd && onTransitionEnd({ route: scene.route }, true);
    onCloseRoute({ route: scene.route });
  };

  private handleTransitionStart = ({ closing }: { closing: boolean }) => {
    const {
      scene,
      onTransitionStart,
      onPageChangeConfirm,
      onPageChangeCancel,
      onGoBack,
    } = this.props;

    if (closing) {
      onPageChangeConfirm && onPageChangeConfirm();
    } else {
      onPageChangeCancel && onPageChangeCancel();
    }

    onTransitionStart && onTransitionStart({ route: scene.route }, closing);
    closing && onGoBack({ route: scene.route });
  };

  render() {
    const {
      index,
      layout,
      active,
      focused,
      closing,
      current,
      state,
      scene,
      previousScene,
      safeAreaInsetTop,
      safeAreaInsetRight,
      safeAreaInsetBottom,
      safeAreaInsetLeft,
      cardTransparent,
      cardOverlayEnabled,
      cardShadowEnabled,
      cardStyle,
      onPageChangeStart,
      onPageChangeCancel,
      gestureEnabled,
      gestureResponseDistance,
      gestureVelocityImpact,
      floatingHeaderHeight,
      headerShown,
      getPreviousRoute,
      headerMode,
      headerTransparent,
      renderHeader,
      renderScene,
      gestureDirection,
      transitionSpec,
      cardStyleInterpolator,
      headerStyleInterpolator,
    } = this.props;

    const insets = {
      top: safeAreaInsetTop,
      right: safeAreaInsetRight,
      bottom: safeAreaInsetBottom,
      left: safeAreaInsetLeft,
    };

    return (
      <Card
        index={index}
        active={active}
        transparent={cardTransparent}
        gestureDirection={gestureDirection}
        layout={layout}
        insets={insets}
        current={current}
        next={scene.progress.next}
        closing={closing}
        onOpen={this.handleOpen}
        onClose={this.handleClose}
        overlayEnabled={cardOverlayEnabled}
        shadowEnabled={cardShadowEnabled}
        onTransitionStart={this.handleTransitionStart}
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
        contentStyle={cardStyle}
        style={StyleSheet.absoluteFill}
      >
        <View style={styles.container}>
          <View style={styles.scene}>
            {renderScene({ route: scene.route })}
          </View>
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
