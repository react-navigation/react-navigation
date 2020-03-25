import * as React from 'react';
import invariant from '../utils/invariant';
import ThemeContext from '../views/ThemeContext';
import NavigationFocusEvents from '../views/NavigationFocusEvents';

function createNavigator(NavigatorView, router, navigationConfig) {
  class Navigator extends React.Component {
    // eslint-disable-next-line react/sort-comp
    static contextType = ThemeContext;
    static router = router;
    static navigationOptions = navigationConfig.navigationOptions;

    constructor(props, context) {
      super(props, context);

      this.state = {
        descriptors: {},
        screenProps: this.props.screenProps,
        theme: context,
        themeContext: context,
      };
    }

    static getDerivedStateFromProps(nextProps, currentState) {
      const prevDescriptors = currentState.descriptors;
      const { navigation, screenProps } = nextProps;
      invariant(
        navigation != null,
        'The navigation prop is missing for this navigator. In react-navigation v3 and v4 you must set up your app container directly. More info: https://reactnavigation.org/docs/en/app-containers.html'
      );
      const { state } = navigation;
      const { routes } = state;
      if (typeof routes === 'undefined') {
        throw new TypeError(
          'No "routes" found in navigation state. Did you try to pass the navigation prop of a React component to a Navigator child? See https://reactnavigation.org/docs/en/custom-navigators.html#navigator-navigation-prop'
        );
      }

      const descriptors = routes.reduce((acc, route) => {
        if (
          prevDescriptors &&
          prevDescriptors[route.key] &&
          route === prevDescriptors[route.key].state &&
          screenProps === currentState.screenProps &&
          currentState.themeContext === currentState.theme
        ) {
          acc[route.key] = prevDescriptors[route.key];
          return acc;
        }
        const getComponent = router.getComponentForRouteName.bind(
          null,
          route.routeName
        );
        const childNavigation = navigation.getChildNavigation(route.key);
        const options = router.getScreenOptions(
          childNavigation,
          screenProps,
          currentState.themeContext
        );
        acc[route.key] = {
          key: route.key,
          getComponent,
          options,
          state: route,
          navigation: childNavigation,
        };
        return acc;
      }, {});

      return { descriptors, screenProps, theme: state.themeContext };
    }

    componentDidUpdate() {
      if (this.context !== this.state.themeContext) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ themeContext: this.context });
      }
    }

    render() {
      return (
        <React.Fragment>
          <NavigationFocusEvents
            navigation={this.props.navigation}
            onEvent={(target, type, data) => {
              this.state.descriptors[target]?.navigation.emit(type, data);
            }}
          />
          <NavigatorView
            {...this.props}
            screenProps={this.state.screenProps}
            navigation={this.props.navigation}
            navigationConfig={navigationConfig}
            descriptors={this.state.descriptors}
          />
        </React.Fragment>
      );
    }
  }

  return Navigator;
}

export default createNavigator;
