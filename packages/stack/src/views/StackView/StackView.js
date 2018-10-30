import React from 'react';

import { StackActions } from '@react-navigation/core';
import StackViewLayout from './StackViewLayout';
import Transitioner from '../Transitioner';
import TransitionConfigs from './StackViewTransitionConfigs';

const USE_NATIVE_DRIVER = true;

// NOTE(brentvatne): this was previously in defaultProps, but that is deceiving
// because the entire object will be clobbered by navigationConfig that is
// passed in.
const DefaultNavigationConfig = {
  mode: 'card',
  cardShadowEnabled: true,
  cardOverlayEnabled: false,
};

class StackView extends React.Component {
  render() {
    return (
      <Transitioner
        render={this._render}
        configureTransition={this._configureTransition}
        screenProps={this.props.screenProps}
        navigation={this.props.navigation}
        descriptors={this.props.descriptors}
        onTransitionStart={
          this.props.onTransitionStart ||
          this.props.navigationConfig.onTransitionStart
        }
        onTransitionEnd={(transition, lastTransition) => {
          const { navigationConfig, navigation } = this.props;
          const onTransitionEnd =
            this.props.onTransitionEnd || navigationConfig.onTransitionEnd;
          const transitionDestKey = transition.scene.route.key;
          const isCurrentKey =
            navigation.state.routes[navigation.state.index].key ===
            transitionDestKey;
          if (transition.navigation.state.isTransitioning && isCurrentKey) {
            navigation.dispatch(
              StackActions.completeTransition({
                key: navigation.state.key,
                toChildKey: transitionDestKey,
              })
            );
          }
          onTransitionEnd && onTransitionEnd(transition, lastTransition);
        }}
      />
    );
  }

  componentDidMount() {
    const { navigation } = this.props;
    if (navigation.state.isTransitioning) {
      navigation.dispatch(
        StackActions.completeTransition({
          key: navigation.state.key,
        })
      );
    }
  }

  _configureTransition = (transitionProps, prevTransitionProps) => {
    return {
      ...TransitionConfigs.getTransitionConfig(
        this.props.navigationConfig.transitionConfig,
        transitionProps,
        prevTransitionProps,
        this.props.navigationConfig.mode === 'modal'
      ).transitionSpec,
      useNativeDriver: USE_NATIVE_DRIVER,
    };
  };

  _getShadowEnabled = () => {
    const { navigationConfig } = this.props;
    return navigationConfig &&
      navigationConfig.hasOwnProperty('cardShadowEnabled')
      ? navigationConfig.cardShadowEnabled
      : DefaultNavigationConfig.cardShadowEnabled;
  };

  _getCardOverlayEnabled = () => {
    const { navigationConfig } = this.props;
    return navigationConfig &&
      navigationConfig.hasOwnProperty('cardOverlayEnabled')
      ? navigationConfig.cardOverlayEnabled
      : DefaultNavigationConfig.cardOverlayEnabled;
  };

  _render = (transitionProps, lastTransitionProps) => {
    const { screenProps, navigationConfig } = this.props;
    return (
      <StackViewLayout
        {...navigationConfig}
        shadowEnabled={this._getShadowEnabled()}
        cardOverlayEnabled={this._getCardOverlayEnabled()}
        onGestureBegin={this.props.onGestureBegin}
        onGestureCanceled={this.props.onGestureCanceled}
        onGestureEnd={this.props.onGestureEnd}
        screenProps={screenProps}
        descriptors={this.props.descriptors}
        transitionProps={transitionProps}
        lastTransitionProps={lastTransitionProps}
      />
    );
  };
}

export default StackView;
