/* @flow */

import React, { Component } from 'react';
import { NativeModules, View } from 'react-native';

import CardStack from './CardStack';
import CardStackStyleInterpolator from './CardStackStyleInterpolator';
import Transitioner from './Transitioner';
import TransitionConfigs from './TransitionConfigs';
import Header from './Header';

const NativeAnimatedModule = NativeModules &&
  NativeModules.NativeAnimatedModule;

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
} from '../TypeDefinition';

import type { TransitionConfig } from './TransitionConfigs';

type Props = {
  screenProps?: {},
  headerMode: HeaderMode,
  headerComponent?: ReactClass<*>,
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
  headerComponent: ReactClass<*>,
};

class CardStackTransitioner extends Component<DefaultProps, Props, void> {
  _render: NavigationSceneRenderer;

  static defaultProps: DefaultProps = {
    mode: 'card',
    headerComponent: Header,
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
      headerComponent,
      headerMode,
      mode,
      router,
      style,
      cardStyle,
      screenProps,
    } = this.props;
    return (
      <CardStack
        headerComponent={headerComponent}
        headerMode={headerMode}
        mode={mode}
        router={router}
        cardStyle={cardStyle}
        style={style}
        screenProps={screenProps}
        {...props}
      />
    );
  };
}

export default CardStackTransitioner;
