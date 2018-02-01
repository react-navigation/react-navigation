/* @flow */

import React from 'react';
import { BackHandler, Linking } from './PlatformHelpers';
import NavigationActions from './NavigationActions';
import addNavigationHelpers from './addNavigationHelpers';
import invariant from './utils/invariant';

import type {
  NavigationAction,
  NavigationState,
  NavigationScreenProp,
  NavigationNavigator,
  PossiblyDeprecatedNavigationAction,
  NavigationInitAction,
  NavigationContainerProps,
  NavigationContainer,
} from './TypeDefinition';

type State<NavState> = {
  nav: ?NavState,
};

/**
 * Create an HOC that injects the navigation and manages the navigation state
 * in case it's not passed from above.
 * This allows to use e.g. the StackNavigator and TabNavigator as root-level
 * components.
 */
export default function createNavigationContainer<S: NavigationState, O: {}>(
  // Let the NavigationNavigator props flowwwww
  Component: NavigationNavigator<S, O, *>
): NavigationContainer<S, O, *> {
  class NavigationContainer extends React.Component<
    NavigationContainerProps<S, O>,
    State<S>
  > {
    subs: ?{
      remove: () => void,
    } = null;

    static router = Component.router;
    static navigationOptions = null;

    constructor(props: NavigationContainerProps<S, O>) {
      super(props);

      this._validateProps(props);

      this.state = {
        nav: this._isStateful()
          ? Component.router.getStateForAction(NavigationActions.init())
          : null,
      };
    }

    _isStateful(): boolean {
      return !this.props.navigation;
    }

    _validateProps(props: NavigationContainerProps<S, O>) {
      if (this._isStateful()) {
        return;
      }

      const { navigation, screenProps, ...containerProps } = props;

      const keys = Object.keys(containerProps);

      if (keys.length !== 0) {
        throw new Error(
          'This navigator has both navigation and container props, so it is ' +
            `unclear if it should own its own state. Remove props: "${keys.join(
              ', '
            )}" ` +
            'if the navigator should get its state from the navigation prop. If the ' +
            'navigator should maintain its own state, do not pass a navigation prop.'
        );
      }
    }

    _urlToPathAndParams(url: string) {
      const params = {};
      const delimiter = this.props.uriPrefix || '://';
      let path = url.split(delimiter)[1];
      if (typeof path === 'undefined') {
        path = url;
      }
      return {
        path,
        params,
      };
    }

    _handleOpenURL = ({ url }: { url: string }) => {
      const parsedUrl = this._urlToPathAndParams(url);
      if (parsedUrl) {
        const { path, params } = parsedUrl;
        const action = Component.router.getActionForPathAndParams(path, params);
        if (action) {
          this.dispatch(action);
        }
      }
    };

    _onNavigationStateChange(
      prevNav: NavigationState,
      nav: NavigationState,
      action: NavigationAction
    ) {
      if (
        typeof this.props.onNavigationStateChange === 'undefined' &&
        this._isStateful() &&
        !!process.env.REACT_NAV_LOGGING
      ) {
        /* eslint-disable no-console */
        if (console.group) {
          console.group('Navigation Dispatch: ');
          console.log('Action: ', action);
          console.log('New State: ', nav);
          console.log('Last State: ', prevNav);
          console.groupEnd();
        } else {
          console.log('Navigation Dispatch: ', {
            action,
            newState: nav,
            lastState: prevNav,
          });
        }
        /* eslint-enable no-console */
        return;
      }

      if (typeof this.props.onNavigationStateChange === 'function') {
        this.props.onNavigationStateChange(prevNav, nav, action);
      }
    }

    componentWillReceiveProps(nextProps: NavigationContainerProps<S, O>) {
      this._validateProps(nextProps);
    }

    componentDidUpdate() {
      // Clear cached _nav every tick
      if (this._nav === this.state.nav) {
        this._nav = null;
      }
    }

    componentDidMount() {
      if (!this._isStateful()) {
        return;
      }

      this.subs = BackHandler.addEventListener('hardwareBackPress', () =>
        this.dispatch(NavigationActions.back())
      );

      Linking.addEventListener('url', this._handleOpenURL);

      Linking.getInitialURL().then(
        (url: ?string) => url && this._handleOpenURL({ url })
      );
    }

    componentWillUnmount() {
      Linking.removeEventListener('url', this._handleOpenURL);
      this.subs && this.subs.remove();
    }

    // Per-tick temporary storage for state.nav
    _nav: ?S;

    dispatch = (inputAction: PossiblyDeprecatedNavigationAction) => {
      const action = NavigationActions.mapDeprecatedActionAndWarn(inputAction);
      if (!this._isStateful()) {
        return false;
      }
      this._nav = this._nav || this.state.nav;
      const oldNav = this._nav;
      invariant(oldNav, 'should be set in constructor if stateful');
      const nav = Component.router.getStateForAction(action, oldNav);
      if (nav && nav !== oldNav) {
        // Cache updates to state.nav during the tick to ensure that subsequent calls will not discard this change
        this._nav = nav;
        this.setState({ nav }, () =>
          this._onNavigationStateChange(oldNav, nav, action)
        );
        return true;
      }
      return false;
    };

    _navigation: ?NavigationScreenProp<NavigationState>;

    render() {
      let navigation = this.props.navigation;
      if (this._isStateful()) {
        const nav = this.state.nav;
        invariant(nav, 'should be set in constructor if stateful');
        if (!this._navigation || this._navigation.state !== nav) {
          this._navigation = addNavigationHelpers({
            dispatch: this.dispatch,
            state: nav,
          });
        }
        navigation = this._navigation;
      }
      invariant(navigation, 'failed to get navigation');
      return <Component {...this.props} navigation={navigation} />;
    }
  }

  return NavigationContainer;
}
