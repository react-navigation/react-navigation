import * as React from 'react';
import { StyleSheet, Platform, StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { Props as HeaderContainerProps } from '../Header/HeaderContainer';
import Card from './Card';
import {
  Route,
  HeaderScene,
  GestureDirection,
  Layout,
  TransitionSpec,
  CardStyleInterpolator,
  HeaderMode,
  NavigationProp,
  HeaderStyleInterpolator,
} from '../../types';

type Props = {
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
  gesturesEnabled?: boolean;
  direction: GestureDirection;
  getPreviousRoute: (props: { route: Route }) => Route | undefined;
  renderHeader: (props: HeaderContainerProps) => React.ReactNode;
  renderScene: (props: { route: Route }) => React.ReactNode;
  onOpenRoute: (props: { route: Route }) => void;
  onCloseRoute: (props: { route: Route }) => void;
  onGoBack: (props: { route: Route }) => void;
  onTransitionStart?: (
    curr: { index: number },
    prev: { index: number }
  ) => void;
  onGestureBegin?: () => void;
  onGestureCanceled?: () => void;
  onGestureEnd?: () => void;
  gestureResponseDistance?: {
    vertical?: number;
    horizontal?: number;
  };
  transitionSpec: {
    open: TransitionSpec;
    close: TransitionSpec;
  };
  headerStyleInterpolator: HeaderStyleInterpolator;
  cardStyleInterpolator: CardStyleInterpolator;
  headerMode: HeaderMode;
  headerTransparent?: boolean;
  floaingHeaderHeight: number;
  hasCustomHeader: boolean;
};

export default class StackItem extends React.PureComponent<Props> {
  private handleOpen = () =>
    this.props.onOpenRoute({ route: this.props.scene.route });

  private handleClose = () =>
    this.props.onOpenRoute({ route: this.props.scene.route });

  private handleTransitionStart = ({ closing }: { closing: boolean }) => {
    const { index, scene, onTransitionStart, onGoBack } = this.props;

    onTransitionStart &&
      onTransitionStart({ index: closing ? index - 1 : index }, { index });

    closing && onGoBack({ route: scene.route });
  };

  render() {
    const {
      layout,
      active,
      focused,
      closing,
      current,
      navigation,
      scene,
      previousScene,
      direction,
      cardTransparent,
      cardOverlayEnabled,
      cardShadowEnabled,
      cardStyle,
      gesturesEnabled,
      onGestureBegin,
      onGestureCanceled,
      onGestureEnd,
      gestureResponseDistance,
      transitionSpec,
      headerStyleInterpolator,
      cardStyleInterpolator,
      floaingHeaderHeight,
      hasCustomHeader,
      getPreviousRoute,
      headerMode,
      headerTransparent,
      renderHeader,
      renderScene,
    } = this.props;

    return (
      <Card
        active={active}
        transparent={cardTransparent}
        direction={direction}
        layout={layout}
        current={current}
        next={scene.progress.next}
        closing={closing}
        onOpen={this.handleOpen}
        onClose={this.handleClose}
        overlayEnabled={cardOverlayEnabled}
        shadowEnabled={cardShadowEnabled}
        gesturesEnabled={gesturesEnabled}
        onTransitionStart={this.handleTransitionStart}
        onGestureBegin={onGestureBegin}
        onGestureCanceled={onGestureCanceled}
        onGestureEnd={onGestureEnd}
        gestureResponseDistance={gestureResponseDistance}
        transitionSpec={transitionSpec}
        styleInterpolator={cardStyleInterpolator}
        accessibilityElementsHidden={!focused}
        importantForAccessibility={focused ? 'auto' : 'no-hide-descendants'}
        pointerEvents="box-none"
        containerStyle={
          headerMode === 'float' && !headerTransparent && !hasCustomHeader
            ? { marginTop: floaingHeaderHeight }
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
