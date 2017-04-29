/* @flow */

import React, { Component } from 'react';
import { NativeModules } from 'react-native';

import CardStack from './CardStack';
import CardStackStyleInterpolator from './CardStackStyleInterpolator';
import Transitioner from './Transitioner';
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
  Style,
  TransitionConfig,
  TransitionState
} from '../TypeDefinition';

const NativeAnimatedModule = NativeModules &&
  NativeModules.NativeAnimatedModule;

type Props = {
  screenProps?: {},
  headerMode: HeaderMode,
  mode: 'card' | 'modal',
  navigation: NavigationScreenProp<NavigationState, NavigationAction>,
  router: NavigationRouter<NavigationState, NavigationAction, NavigationStackScreenOptions>,
  cardStyle?: Style,
  onTransitionStart?: () => void,
  onTransitionEnd?: () => void,
  style: Style,
  /**
   * Optional custom animation when transitioning between screens.
   */
  transitionConfig?: () => TransitionConfig,
};

type DefaultProps = {
  mode: 'card' | 'modal',
};

type State = {
  transitionState: TransitionState
}

class CardStackTransitioner extends Component<DefaultProps, Props, void> {
  _render: NavigationSceneRenderer;

  static defaultProps: DefaultProps = {
    mode: 'card',
  };

  state: State;

  constructor() {
    super();
    this.state = { transitionState: 'inactive' };
  }

  render() {
    return (
      <Transitioner
        configureTransition={this._configureTransition}
        navigation={this.props.navigation}
        render={this._render}
        style={this.props.style}
        onTransitionStart={this.onTransitionStart.bind(this)}
        onTransitionEnd={this.onTransitionEnd.bind(this)}
      />
    );
  }

  onTransitionStart(...args) {
    const fromRoute = args[1].navigation.state.routes.slice(-1)[0];
    const toRoute = args[0].navigation.state.routes.slice(-1)[0];

    this.setState({ transitionState: 'active', fromScenes: args[3], toScenes: args[2]})

    if (this.props.onTransitionStart) this.props.onTransitionStart(...args)
  }

  onTransitionEnd(...args) {
    // Reverse fromScenes and toScenes in case the pan gesture needs them
    this.setState({ transitionState: 'inactive', fromScenes: this.state.toScenes, toScenes: this.state.fromScenes })

    if (this.props.onTransitionEnd) this.props.onTransitionEnd(...args)
  }

  _configureTransition = (
    // props for the new screen
    transitionProps: NavigationTransitionProps,
    // props for the old screen
    prevTransitionProps: NavigationTransitionProps,
  ) => {
    const isModal = this.props.mode === 'modal';
    // Copy the object so we can assign useNativeDriver below
    // (avoid Flow error, transitionSpec is of type NavigationTransitionSpec).
    const transitionSpec = {
      ...TransitionConfigs.getTransitionConfig(
        this.props.transitionConfig,
        transitionProps,
        prevTransitionProps,
        isModal,
      ).transitionSpec,
    };
    if (
      !!NativeAnimatedModule &&
      // Native animation support also depends on the transforms used:
      CardStackStyleInterpolator.canUseNativeDriver(isModal)
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
        transitionState={this.state.transitionState}
        fromScenes={this.state.fromScenes}
        toScenes={this.state.toScenes}
        style={style}
        {...props}
      />
    );
  };
}

export default CardStackTransitioner;
