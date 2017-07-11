/* @flow */

import React, { Component } from 'react';
import { NativeModules } from 'react-native';

import CardStack from './CardStack';
import CardStackStyleInterpolator from './CardStackStyleInterpolator';
import Transitioner from './Transitioner';
import TransitionConfigs from './TransitionConfigs';

import type {
  NavigationAction,
  NavigationScene,
  NavigationSceneRenderer,
  NavigationScreenProp,
  NavigationStackScreenOptions,
  NavigationState,
  NavigationTransitionProps,
  NavigationRouter,
  HeaderMode,
  Style,
  TransitionConfig,
  TransitionState,
} from '../TypeDefinition';

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
  transitionState: TransitionState,
  toScenes?: Array<NavigationScene>,
  fromScenes?: Array<NavigationScene>,
};

class CardStackTransitioner extends Component<DefaultProps, Props, State> {
  _render: NavigationSceneRenderer;
  _onTransitionStart: () => void;
  _onTransitionEnd: () => void;

  static defaultProps: DefaultProps = {
    mode: 'card',
  };

  state: State;

  constructor() {
    super();
    this.state = {
      transitionState: 'inactive',
    };
    this._onTransitionStart = this._onTransitionStart.bind(this);
    this._onTransitionEnd = this._onTransitionEnd.bind(this);
  }

  render() {
    return (
      <Transitioner
        configureTransition={this._configureTransition}
        navigation={this.props.navigation}
        render={this._render}
        style={this.props.style}
        onTransitionStart={this._onTransitionStart}
        onTransitionEnd={this._onTransitionEnd}
      />
    );
  }

  _onTransitionStart(...args: Array<any>) {
    this.setState({
      transitionState: 'active',
      fromScenes: args[3],
      toScenes: args[2],
    });

    if (this.props.onTransitionStart) this.props.onTransitionStart(...args);
  }

  _onTransitionEnd(...args: Array<any>) {
    // Reverse fromScenes and toScenes in case the pan gesture needs them
    this.setState({
      transitionState: 'inactive',
      fromScenes: this.state.toScenes,
      toScenes: this.state.fromScenes,
    });

    if (this.props.onTransitionEnd) this.props.onTransitionEnd(...args);
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
