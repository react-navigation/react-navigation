/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet, View } from 'react-native';
import * as GestureHandler from 'react-native-gesture-handler';
import { PagerRendererPropType } from './TabViewPropTypes';
import type { PagerRendererProps, Route } from './TabViewTypeDefinitions';

type Props<T> = PagerRendererProps<T> & {
  swipeDistanceThreshold?: number,
  swipeVelocityThreshold?: number,
};

const DefaultTransitionSpec = {
  timing: Animated.spring,
  tension: 300,
  friction: 35,
};

export default class TabViewPagerExperimental<
  T: Route<*>
> extends React.Component<Props<T>> {
  static propTypes = {
    ...PagerRendererPropType,
    swipeDistanceThreshold: PropTypes.number,
    swipeVelocityThreshold: PropTypes.number,
  };

  componentDidMount() {
    this._resetListener = this.props.subscribe('reset', this._transitionTo);
  }

  componentDidUpdate(prevProps: Props<T>) {
    if (prevProps.navigationState.index !== this.props.navigationState.index) {
      this._transitionTo(this.props.navigationState.index);
    }
  }

  componentWillUnmount() {
    this._resetListener.remove();
  }

  _handleHandlerStateChange = event => {
    if (event.nativeEvent.state === GestureHandler.State.END) {
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
        nextIndex = Math.min(
          Math.max(0, currentIndex - translationX / Math.abs(translationX)),
          navigationState.routes.length - 1
        );
      }

      this._transitionTo(isFinite(nextIndex) ? nextIndex : currentIndex);
    }
  };

  _transitionTo = (index: number) => {
    const offset = -index * this.props.layout.width;

    if (this.props.animationEnabled === false) {
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
        useNativeDriver,
      }),
      timing(this.props.offsetX, {
        ...transitionConfig,
        toValue: offset,
        useNativeDriver,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        this.props.jumpToIndex(index);
        this._pendingIndex = null;
      }
    });

    this._pendingIndex = index;
  };

  _resetListener: any;
  _pendingIndex: ?number;

  render() {
    const {
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
    const translateX = Animated.add(panX, offsetX).interpolate({
      inputRange: [-maxTranslate, 0],
      outputRange: [-maxTranslate, 0],
      extrapolate: 'clamp',
    });

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
          {React.Children.map(children, (child, i) => (
            <View
              key={navigationState.routes[i].key}
              testID={navigationState.routes[i].testID}
              style={
                width
                  ? { width }
                  : i === navigationState.index ? StyleSheet.absoluteFill : null
              }
            >
              {i === navigationState.index || width ? child : null}
            </View>
          ))}
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
