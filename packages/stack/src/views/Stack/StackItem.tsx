import * as React from 'react';
import { StyleSheet, Platform, StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { Props as HeaderContainerProps } from '../Header/HeaderContainer';
import Card from './Card';
import {
  Route,
  HeaderScene,
  Layout,
  HeaderMode,
  NavigationProp,
  TransitionPreset,
} from '../../types';

type Props = TransitionPreset & {
  index: number;
  active: boolean;
  focused: boolean;
  closing: boolean;
  layout: Layout;
  current: Animated.Value<number>;
  previousScene?: HeaderScene<Route>;
  scene: HeaderScene<Route>;
  navigation: NavigationProp;
  cardTransparent?: boolean;
  cardOverlayEnabled?: boolean;
  cardShadowEnabled?: boolean;
  cardStyle?: StyleProp<ViewStyle>;
  gestureEnabled?: boolean;
  getPreviousRoute: (props: { route: Route }) => Route | undefined;
  renderHeader: (props: HeaderContainerProps) => React.ReactNode;
  renderScene: (props: { route: Route }) => React.ReactNode;
  onOpenRoute: (props: { route: Route }) => void;
  onCloseRoute: (props: { route: Route }) => void;
  onGoBack: (props: { route: Route }) => void;
  onTransitionStart?: (props: { route: Route }, closing: boolean) => void;
  onTransitionEnd?: (props: { route: Route }, closing: boolean) => void;
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
  hasCustomHeader: boolean;
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
      hasCustomHeader,
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
          headerMode === 'float' && !headerTransparent && !hasCustomHeader
            ? { marginTop: floatingHeaderHeight }
            : null
        }
        contentStyle={cardStyle}
        style={StyleSheet.absoluteFill}
      >
        {headerMode === 'screen'
          ? renderHeader({
              mode: 'screen',
              layout,
              scenes: [previousScene, scene],
              navigation,
              getPreviousRoute,
              styleInterpolator: headerStyleInterpolator,
              style: styles.header,
            })
          : null}
        {renderScene({ route: scene.route })}
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    // This is needed to show elevation shadow
    zIndex: Platform.OS === 'android' ? 1 : 0,
  },
});
