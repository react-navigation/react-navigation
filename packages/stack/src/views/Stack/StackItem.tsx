import * as React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { NavigationRoute } from 'react-navigation';
import { Props as HeaderContainerProps } from '../Header/HeaderContainer';
import Card from './Card';
import {
  HeaderScene,
  Layout,
  HeaderMode,
  NavigationStackProp,
  TransitionPreset,
} from '../../types';

type Props = TransitionPreset & {
  index: number;
  active: boolean;
  focused: boolean;
  closing: boolean;
  layout: Layout;
  current: Animated.Value<number>;
  previousScene?: HeaderScene;
  scene: HeaderScene;
  navigation: NavigationStackProp;
  cardTransparent?: boolean;
  cardOverlayEnabled?: boolean;
  cardShadowEnabled?: boolean;
  cardStyle?: StyleProp<ViewStyle>;
  gestureEnabled?: boolean;
  getPreviousRoute: (props: {
    route: NavigationRoute;
  }) => NavigationRoute | undefined;
  renderHeader: (props: HeaderContainerProps) => React.ReactNode;
  renderScene: (props: { route: NavigationRoute }) => React.ReactNode;
  onOpenRoute: (props: { route: NavigationRoute }) => void;
  onCloseRoute: (props: { route: NavigationRoute }) => void;
  onGoBack: (props: { route: NavigationRoute }) => void;
  onTransitionStart?: (
    props: { route: NavigationRoute },
    closing: boolean
  ) => void;
  onTransitionEnd?: (
    props: { route: NavigationRoute },
    closing: boolean
  ) => void;
  onPageChangeStart?: () => void;
  onPageChangeConfirm?: () => void;
  onPageChangeCancel?: () => void;
  gestureResponseDistance?: {
    vertical?: number;
    horizontal?: number;
  };
  headerMode: HeaderMode;
  headerTransparent?: boolean;
  floatingHeaderHeight: number;
  headerShown: boolean;
  gestureVelocityImpact?: number;
};

export default class StackItem extends React.PureComponent<Props> {
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
      navigation,
      scene,
      previousScene,
      cardTransparent,
      cardOverlayEnabled,
      cardShadowEnabled,
      cardStyle,
      gestureEnabled,
      onPageChangeStart,
      onPageChangeCancel,
      gestureResponseDistance,
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
      gestureVelocityImpact,
    } = this.props;

    return (
      <Card
        index={index}
        active={active}
        transparent={cardTransparent}
        gestureDirection={gestureDirection}
        layout={layout}
        current={current}
        next={scene.progress.next}
        closing={closing}
        onOpen={this.handleOpen}
        onClose={this.handleClose}
        overlayEnabled={cardOverlayEnabled}
        shadowEnabled={cardShadowEnabled}
        gestureEnabled={gestureEnabled}
        onTransitionStart={this.handleTransitionStart}
        onGestureBegin={onPageChangeStart}
        onGestureCanceled={onPageChangeCancel}
        gestureResponseDistance={gestureResponseDistance}
        transitionSpec={transitionSpec}
        styleInterpolator={cardStyleInterpolator}
        accessibilityElementsHidden={!focused}
        importantForAccessibility={focused ? 'auto' : 'no-hide-descendants'}
        pointerEvents="box-none"
        containerStyle={
          headerMode === 'float' && !headerTransparent && !headerShown
            ? { marginTop: floatingHeaderHeight }
            : null
        }
        contentStyle={cardStyle}
        style={StyleSheet.absoluteFill}
        gestureVelocityImpact={gestureVelocityImpact}
      >
        <View style={styles.container}>
          <View style={styles.scene}>
            {renderScene({ route: scene.route })}
          </View>
          {headerMode === 'screen'
            ? renderHeader({
                mode: 'screen',
                layout,
                scenes: [previousScene, scene],
                navigation,
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
