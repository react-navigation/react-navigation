/* @flow */

import * as React from 'react';
import { NativeModules } from 'react-native';
import _ from 'lodash';

import CardStack from './CardStack';
import CardStackStyleInterpolator from './CardStackStyleInterpolator';
import Transitioner from '../Transitioner';
import addNavigationHelpers from '../../addNavigationHelpers';
import TransitionConfigs from './TransitionConfigs';
import getScreenForRouteName from '../../routers/getScreenForRouteName';

import type {
  NavigationSceneRenderer,
  NavigationScreenProp,
  NavigationStackScreenOptions,
  NavigationState,
  NavigationTransitionProps,
  NavigationNavigatorProps,
  NavigationRouter,
  HeaderMode,
  ViewStyleProp,
  TransitionConfig,
} from '../../TypeDefinition';

const NativeAnimatedModule =
  NativeModules && NativeModules.NativeAnimatedModule;

type Props = {
  headerMode: HeaderMode,
  mode: 'card' | 'modal',
  router: NavigationRouter<NavigationState, NavigationStackScreenOptions>,
  cardStyle?: ViewStyleProp,
  onTransitionStart?: () => void,
  onTransitionEnd?: () => void,
  /**
   * Optional custom animation when transitioning between screens.
   */
  transitionConfig?: () => TransitionConfig,
} & NavigationNavigatorProps<NavigationStackScreenOptions, NavigationState>;

class CardStackTransitioner extends React.Component<Props> {
  _render: NavigationSceneRenderer;

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
    transitionProps: NavigationTransitionProps,
    // props for the old screen
    prevTransitionProps: ?NavigationTransitionProps
  ) => {
    // const isModal = this._getMode() === 'modal';
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

  _getMode() {
    const { navigation, mode, router } = this.props;
    let screenOptions;
    if (
      this.props.navigation.state.routes &&
      this.props.navigation.state.routes[1]
    ) {
      router.getScreenOptions(
        addNavigationHelpers({
          state: this.props.navigation.state.routes[1],
          dispatch: this.props.navigation.dispatch,
        })
      );
    }
    return screenOptions && screenOptions.mode ? screenOptions.mode : mode;
  }

  _render = (props: NavigationTransitionProps): React.Node => {
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
