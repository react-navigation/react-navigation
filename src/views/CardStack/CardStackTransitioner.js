import React from 'react';
import { NativeModules } from 'react-native';

import CardStack from './CardStack';
import CardStackStyleInterpolator from './CardStackStyleInterpolator';
import Transitioner from '../Transitioner';
import addNavigationHelpers from '../../addNavigationHelpers';
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
    console.log('transition config', this._getMode());
    const isModal = this._getMode() === 'modal';
    console.log('isModal?', isModal, this._getMode());
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

  _getMode() {
    const { navigation, mode, router } = this.props;
    let screenOptions;
    if (
      navigation.state.routes &&
      navigation.state.routes[1]
    ) {
      screenOptions  = router.getScreenOptions(
        addNavigationHelpers({
          state: navigation.state.routes[1],
          dispatch: () => null,
          addListener: () => null
        })
      );
    }
    return screenOptions && screenOptions.mode ? screenOptions.mode : mode;
  }

  _render = props => {
    const {
      screenProps,
      headerMode,
      router,
      cardStyle,
      transitionConfig,
    } = this.props;
    return (
      <CardStack
        screenProps={screenProps}
        headerMode={headerMode}
        mode={this._getMode()}
        router={router}
        cardStyle={cardStyle}
        transitionConfig={transitionConfig}
        {...props}
      />
    );
  };
}

export default CardStackTransitioner;
