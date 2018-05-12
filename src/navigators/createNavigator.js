import React from 'react';

function createNavigator(NavigatorView, router, navigationConfig) {
  class Navigator extends React.Component {
    static router = router;
    static navigationOptions = null;

    render() {
      const { navigation } = this.props;
      const { dispatch, state, addListener } = navigation;
      const { routes } = state;

      const descriptors = {};
      routes.forEach(route => {
        const getComponent = () =>
          router.getComponentForRouteName(route.routeName);

        const childNavigation = navigation.getChildNavigation(route.key);

        const options = router.getScreenOptions(childNavigation);

        descriptors[route.key] = {
          key: route.key,
          getComponent,
          options,
          state: route,
          navigation: childNavigation,
        };
      });

      return (
        <NavigatorView
          {...this.props}
          screenProps={navigation.getScreenProps()}
          navigation={navigation}
          navigationConfig={navigationConfig}
          descriptors={descriptors}
        />
      );
    }
  }
  return Navigator;
}

export default createNavigator;
