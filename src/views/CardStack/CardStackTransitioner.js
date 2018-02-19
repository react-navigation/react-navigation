import React from 'react';
import { NativeModules } from 'react-native';

import CardStack from './CardStack';
import CardStackStyleInterpolator from './CardStackStyleInterpolator';
import Transitioner from '../Transitioner';
import TransitionConfigs from './TransitionConfigs';

const NativeAnimatedModule =
  NativeModules && NativeModules.NativeAnimatedModule;

class CardStackTransitioner extends React.Component {
  static defaultProps = {
    mode: 'card',
  };

  render() {
    return (
      <Transitioner
        configureTransition={this._configureTransition}
        navigation={this.props.navigation}
        render={this._render}
        onTransitionStart={this.props.onTransitionStart}
        onTransitionEnd={this.props.onTransitionEnd}
      />
    );
  }

  _configureTransition = (
    // props for the new screen
    transitionProps,
    // props for the old screen
    prevTransitionProps
  ) => {
    const isModal = this.props.mode === 'modal';
    // Copy the object so we can assign useNativeDriver below
    const transitionSpec = {
      ...TransitionConfigs.getTransitionConfig(
        this.props.transitionConfig,
        transitionProps,
        prevTransitionProps,
        isModal
      ).transitionSpec,
    };
    if (
      !!NativeAnimatedModule &&
      // Native animation support also depends on the transforms used:
      CardStackStyleInterpolator.canUseNativeDriver()
    ) {
      // Internal undocumented prop
      transitionSpec.useNativeDriver = true;
    }
    return transitionSpec;
  };

  _render = (props, prevProps) => {
    const {
      screenProps,
      headerMode,
      headerTransitionPreset,
      mode,
      router,
      cardStyle,
      transitionConfig,
    } = this.props;
    return (
      <CardStack
        screenProps={screenProps}
        headerMode={headerMode}
        headerTransitionPreset={headerTransitionPreset}
        mode={mode}
        router={router}
        cardStyle={cardStyle}
        transitionConfig={transitionConfig}
        transitionProps={props}
        prevTransitionProps={prevProps}
      />
    );
  };
}

export default CardStackTransitioner;
