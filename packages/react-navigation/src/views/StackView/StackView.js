import React from 'react';
import { NativeModules } from 'react-native';

import StackViewLayout from './StackViewLayout';
import Transitioner from '../Transitioner';
import NavigationActions from '../../NavigationActions';
import StackActions from '../../routers/StackActions';
import TransitionConfigs from './StackViewTransitionConfigs';

const NativeAnimatedModule =
  NativeModules && NativeModules.NativeAnimatedModule;

class StackView extends React.Component {
  static defaultProps = {
    navigationConfig: {
      mode: 'card',
    },
  };

  render() {
    return (
      <Transitioner
        render={this._render}
        configureTransition={this._configureTransition}
        navigation={this.props.navigation}
        descriptors={this.props.descriptors}
        onTransitionStart={this.props.onTransitionStart}
        onTransitionEnd={(transition, lastTransition) => {
          const { navigationConfig, navigation } = this.props;
          const { onTransitionEnd } = navigationConfig;
          if (transition.navigation.state.isTransitioning) {
            navigation.dispatch(
              StackActions.completeTransition({
                key: navigation.state.key,
              })
            );
          }
          onTransitionEnd && onTransitionEnd(transition, lastTransition);
        }}
      />
    );
  }

  _configureTransition = (transitionProps, prevTransitionProps) => {
    return {
      ...TransitionConfigs.getTransitionConfig(
        this.props.navigationConfig.transitionConfig,
        transitionProps,
        prevTransitionProps,
        this.props.navigationConfig.mode === 'modal'
      ).transitionSpec,
      useNativeDriver: !!NativeAnimatedModule,
    };
  };

  _render = (transitionProps, lastTransitionProps) => {
    const { screenProps, navigationConfig } = this.props;
    return (
      <StackViewLayout
        {...navigationConfig}
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
