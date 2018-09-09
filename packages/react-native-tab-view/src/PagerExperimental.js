/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet, View } from 'react-native';
import { PagerRendererPropType } from './PropTypes';
import type { PagerRendererProps } from './TypeDefinitions';

type Props<T> = PagerRendererProps<T> & {
  swipeDistanceThreshold?: number,
  swipeVelocityThreshold?: number,
  GestureHandler: any,
};

const DefaultTransitionSpec = {
  timing: Animated.spring,
  tension: 68,
  friction: 12,
};

export default class PagerExperimental<T: *> extends React.Component<Props<T>> {
  static propTypes = {
    ...PagerRendererPropType,
    swipeDistanceThreshold: PropTypes.number,
    swipeVelocityThreshold: PropTypes.number,
    GestureHandler: PropTypes.object,
  };

  static defaultProps = {
    canJumpToTab: () => true,
  };

  componentDidUpdate(prevProps: Props<T>) {
    if (
      prevProps.navigationState.routes.length !==
        this.props.navigationState.routes.length ||
      prevProps.layout.width !== this.props.layout.width
    ) {
      this._transitionTo(this.props.navigationState.index, undefined, false);
    } else if (
      prevProps.navigationState.index !== this.props.navigationState.index &&
      this.props.navigationState.index !== this._pendingIndex
    ) {
      this._transitionTo(this.props.navigationState.index);
    }
  }

  _handleHandlerStateChange = event => {
    const { GestureHandler } = this.props;

    if (event.nativeEvent.state === GestureHandler.State.BEGAN) {
      this.props.onSwipeStart && this.props.onSwipeStart();
    } else if (event.nativeEvent.state === GestureHandler.State.END) {
      this.props.onSwipeEnd && this.props.onSwipeEnd();

      const {
        navigationState,
        layout,
        swipeDistanceThreshold = layout.width / 1.75,
        swipeVelocityThreshold = 150,
      } = this.props;
      const {
        translationX,
        translationY,
        velocityX,
        velocityY,
      } = event.nativeEvent;
      const currentIndex =
        typeof this._pendingIndex === 'number'
          ? this._pendingIndex
          : navigationState.index;

      let nextIndex = currentIndex;

      if (
        Math.abs(translationX) > Math.abs(translationY) &&
        Math.abs(velocityX) > Math.abs(velocityY) &&
        (Math.abs(translationX) > swipeDistanceThreshold ||
          Math.abs(velocityX) > swipeVelocityThreshold)
      ) {
        nextIndex = Math.round(
          Math.min(
            Math.max(0, currentIndex - translationX / Math.abs(translationX)),
            navigationState.routes.length - 1
          )
        );
      }

      if (
        !isFinite(nextIndex) ||
        !this.props.canJumpToTab(this.props.navigationState.routes[nextIndex])
      ) {
        nextIndex = currentIndex;
      }

      this._transitionTo(nextIndex, velocityX);
    }
  };

  _transitionTo = (
    index: number,
    velocity?: number,
    animated?: boolean = true
  ) => {
    const offset = -index * this.props.layout.width;

    if (this.props.animationEnabled === false || animated === false) {
      this.props.panX.setValue(0);
      this.props.offsetX.setValue(offset);
      return;
    }

    const { timing, ...transitionConfig } = DefaultTransitionSpec;
    const { useNativeDriver } = this.props;

    Animated.parallel([
      timing(this.props.panX, {
        ...transitionConfig,
        toValue: 0,
        velocity,
        useNativeDriver,
      }),
      timing(this.props.offsetX, {
        ...transitionConfig,
        toValue: offset,
        velocity,
        useNativeDriver,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        const route = this.props.navigationState.routes[index];
        this.props.jumpTo(route.key);
        this.props.onAnimationEnd && this.props.onAnimationEnd();
        this._pendingIndex = null;
      }
    });

    this._pendingIndex = index;
  };

  _pendingIndex: ?number;

  render() {
    const {
      GestureHandler,
      panX,
      offsetX,
      layout,
      navigationState,
      swipeEnabled,
      children,
    } = this.props;
    const { width } = layout;
    const { routes } = navigationState;
    const maxTranslate = width * (routes.length - 1);
    const translateX =
      routes.length > 1
        ? Animated.add(panX, offsetX).interpolate({
            inputRange: [-maxTranslate, 0],
            outputRange: [-maxTranslate, 0],
            extrapolate: 'clamp',
          })
        : 0;

    return (
      <GestureHandler.PanGestureHandler
        enabled={layout.width !== 0 && swipeEnabled !== false}
        minDeltaX={10}
        onGestureEvent={Animated.event(
          [{ nativeEvent: { translationX: this.props.panX } }],
          { useNativeDriver: this.props.useNativeDriver }
        )}
        onHandlerStateChange={this._handleHandlerStateChange}
      >
        <Animated.View
          style={[
            styles.sheet,
            width
              ? { width: routes.length * width, transform: [{ translateX }] }
              : null,
          ]}
        >
          {React.Children.map(children, (child, i) => {
            const route = navigationState.routes[i];
            const focused = i === navigationState.index;

            return (
              <View
                key={route.key}
                testID={this.props.getTestID({ route })}
                accessibilityElementsHidden={!focused}
                importantForAccessibility={
                  focused ? 'auto' : 'no-hide-descendants'
                }
                style={
                  width ? { width } : focused ? StyleSheet.absoluteFill : null
                }
              >
                {focused || width ? child : null}
              </View>
            );
          })}
        </Animated.View>
      </GestureHandler.PanGestureHandler>
    );
  }
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
});
