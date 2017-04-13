/* @flow */

import React, { PropTypes, Component } from 'react';
import { NativeModules, View } from 'react-native';

import NavigationPropTypes from '../PropTypes';
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
  Style,
} from '../TypeDefinition';


import type { HeaderMode } from './Header';

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

  static propTypes = {
    /**
     * Custom style applied to the card.
     */
    cardStyle: PropTypes.any,

    /**
     * Style of the stack header. `float` means the header persists and is shared
     * for all screens. When set to `screen`, each header is rendered within the
     * card, and will animate in together.
     *
     * The default for `modal` mode is `screen`, and the default for `card` mode
     * is `screen` on Android and `float` on iOS.
     */
    headerMode: PropTypes.oneOf(['float', 'screen', 'none']),

    /**
     * Custom React component to be used as a header
     */
    headerComponent: PropTypes.func,

    /**
     * Style of the cards movement. Value could be `card` or `modal`.
     * Default value is `card`.
     */
    mode: PropTypes.oneOf(['card', 'modal']),

    /**
     * Optional custom animation when transitioning between screens.
     */
    transitionConfig: PropTypes.func,

    /**
     * The navigation prop, including the state and the dispatcher for the back
     * action. The dispatcher must handle the back action
     * ({ type: NavigationActions.BACK }), and the navigation state has this shape:
     *
     * ```js
     * navigation.state = {
     *   index: 0, // the index of the selected route.
     *   routes: [ // A list of routes.
     *     {key: 'page 1'}, // The 1st route.
     *     {key: 'page 2'}, // The second route.
     *   ],
     * };
     * ```
     */
    navigation: NavigationPropTypes.navigation.isRequired,

    /**
     * Custom style applied to the cards stack.
     */
    style: View.propTypes.style,
  };

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
      cardStyle,
    } = this.props;
    return (
      <CardStack
        headerComponent={headerComponent}
        headerMode={headerMode}
        mode={mode}
        router={router}
        style={cardStyle}
        {...props}
      />
    );
  };
}

export default CardStackTransitioner;
