/* @flow */

import React from 'react';
import invariant from 'fbjs/lib/invariant';
import {
  BackAndroid,
  Linking,
} from './PlatformHelpers';
import NavigationActions from './NavigationActions';
import addNavigationHelpers from './addNavigationHelpers';

import type {
  NavigationRoute,
  NavigationAction,
  NavigationContainerOptions,
  NavigationProp,
  NavigationState,
  NavigationScreenProp,
} from './TypeDefinition';

/**
 * Create an HOC that injects the navigation and manages the navigation state
 * in case it's not passed from above.
 * This allows to use e.g. the StackNavigator and TabNavigator as root-level
 * components.
 */
export default function createNavigationContainer<T: *>(
  Component: ReactClass<*>,
  containerConfig?: NavigationContainerOptions
) {
  type Props = {
    navigation: NavigationProp<T, NavigationAction>,
    onNavigationStateChange?: (NavigationState, NavigationState) => void,
  };

  type State = {
    nav: ?NavigationState,
  };

  function urlToPathAndParams(url: string) {
    const params = {};
    const URIPrefix = containerConfig && containerConfig.URIPrefix;
    const delimiter = URIPrefix || '://';
    let path = url.split(delimiter)[1];
    if (!path) {
      path = url;
    }
    return {
      path,
      params,
    };
  }

  class NavigationContainer extends React.Component {
    state: State;
    props: Props;

    subs: ?{
      remove: () => void,
    } = null;

    static router = Component.router;

    _isStateful: () => boolean = () => {
      const hasNavProp = !!this.props.navigation;
      if (hasNavProp) {
        invariant(
          !containerConfig,
          'This navigator has a container config AND a navigation prop, so it is ' +
          'unclear if it should own its own state. Remove the containerConfig ' +
          'if the navigator should get its state from the navigation prop. If the ' +
          'navigator should maintain its own state, do not pass a navigation prop.'
        );
        return false;
      }
      return true;
    }

    constructor(props: Props) {
      super(props);
      this.state = {
        nav: this._isStateful()
          ? Component.router.getStateForAction(NavigationActions.init())
          : null,
      };
    }

    componentDidMount() {
      if (this._isStateful()) {
        this.subs = BackAndroid.addEventListener('backPress', () =>
           this.dispatch(NavigationActions.back())
        );
        Linking.addEventListener('url', this._handleOpenURL);
        Linking.getInitialURL().then((url: string) => {
          if (url) {
            console.log('Handling URL:', url);
            const parsedUrl = urlToPathAndParams(url);
            if (parsedUrl) {
              const { path, params } = parsedUrl;
              const action = Component.router.getActionForPathAndParams(path, params);
              if (action) {
                this.dispatch(action);
              }
            }
          }
        });
      }
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
      const [prevNavigationState, navigationState] = this._isStateful()
        ? [prevState.nav, this.state.nav]
        : [prevProps.navigation.state, this.props.navigation.state];

      if (
        prevNavigationState !== navigationState
        && typeof this.props.onNavigationStateChange === 'function'
      ) {
        // $FlowFixMe state is always defined, either this.state or props
        this.props.onNavigationStateChange(prevNavigationState, navigationState);
      }
    }

    componentWillUnmount() {
      Linking.removeEventListener('url', this._handleOpenURL);
      this.subs && this.subs.remove();
    }

    _handleOpenURL = ({ url }: { url: string }) => {
      console.log('Handling URL:', url);
      const parsedUrl = urlToPathAndParams(url);
      if (parsedUrl) {
        const { path, params } = parsedUrl;
        const action = Component.router.getActionForPathAndParams(path, params);
        if (action) {
          this.dispatch(action);
        }
      }
    };

    dispatch = (action: NavigationAction) => {
      const { state } = this;
      if (!this._isStateful()) {
        return false;
      }
      const nav = Component.router.getStateForAction(action, state.nav);

      if (nav && nav !== state.nav) {
        if (console.group) {
          console.group('Navigation Dispatch: ');
          console.log('Action: ', action);
          console.log('New State: ', nav);
          console.log('Last State: ', state.nav);
          console.groupEnd();
        } else {
          console.log('Navigation Dispatch: ', { action, newState: nav, lastState: state.nav });
        }
        this.setState({ nav });
        return true;
      }
      return false;
    };

    _navigation: ?NavigationScreenProp<NavigationRoute, NavigationAction>;

    render() {
      let navigation = this.props.navigation;
      if (this._isStateful()) {
        if (!this._navigation || this._navigation.state !== this.state.nav) {
          this._navigation = addNavigationHelpers({
            dispatch: this.dispatch.bind(this),
            state: this.state.nav,
          });
        }
        navigation = this._navigation;
      }
      return (
        <Component
          {...this.props}
          navigation={navigation}
        />
      );
    }
  }

  return NavigationContainer;
}

