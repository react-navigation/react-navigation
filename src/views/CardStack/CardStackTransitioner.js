/* @flow */

import React, { Component } from 'react';
import { NativeModules } from 'react-native';

import CardStack from './CardStack';
import CardStackStyleInterpolator from './CardStackStyleInterpolator';
import Transitioner from '../Transitioner';
import TransitionConfigs from './TransitionConfigs';

import type {
  NavigationAction,
  NavigationSceneRenderer,
  NavigationScreenProp,
  NavigationStackScreenOptions,
  NavigationState,
  NavigationTransitionProps,
  NavigationRouter,
  HeaderMode,
  ViewStyleProp,
  TransitionConfig,
} from '../../TypeDefinition';

const NativeAnimatedModule =
  NativeModules && NativeModules.NativeAnimatedModule;

type Props = {
  screenProps?: {},
  headerMode: HeaderMode,
  mode: 'card' | 'modal',
  navigation: NavigationScreenProp<NavigationState, NavigationAction>,
  router: NavigationRouter<
    NavigationState,
    NavigationAction,
    NavigationStackScreenOptions
  >,
  cardStyle?: ViewStyleProp,
  onTransitionStart?: () => void,
  onTransitionEnd?: () => void,
  style: ViewStyleProp,
  /**
   * Optional custom animation when transitioning between screens.
   */
  transitionConfig?: () => TransitionConfig,
};

type DefaultProps = {
  mode: 'card' | 'modal',
};

class CardStackTransitioner extends Component<DefaultProps, Props, void> {
  _render: NavigationSceneRenderer;

  static defaultProps: DefaultProps = {
    mode: 'card',
  };

  render() {
    return (
      <Transitioner
        configureTransition={this._configureTransition}
        navigation={this.props.navigation}
        render={this._render}
        style={this.props.style}
        onTransitionStart={this.props.onTransitionStart}
        onTransitionEnd={this.props.onTransitionEnd}
      />
    );
  }

  _configureTransition = (
    // props for the new screen
    transitionProps: NavigationTransitionProps,
    // props for the old screen
    prevTransitionProps: NavigationTransitionProps
  ) => {
    const isModal = this.props.mode === 'modal';
    // Copy the object so we can assign useNativeDriver below
    // (avoid Flow error, transitionSpec is of type NavigationTransitionSpec).
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

  _render = (props: NavigationTransitionProps): React.Element<*> => {
    const {
      screenProps,
      headerMode,
      mode,
      router,
      cardStyle,
      transitionConfig,
      style,
    } = this.props;
    return (
      <CardStack
        screenProps={screenProps}
        headerMode={headerMode}
        mode={mode}
        router={router}
        cardStyle={cardStyle}
        transitionConfig={transitionConfig}
        style={style}
        {...props}
      />
    );
  };
}

export default CardStackTransitioner;
